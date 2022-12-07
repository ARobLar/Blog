using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<BlogUserEntity> _userManager;
        private readonly SignInManager<BlogUserEntity> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(UserManager<BlogUserEntity> userManager,
                                SignInManager<BlogUserEntity> signInManager,
                                RoleManager<IdentityRole> roleManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._roleManager = roleManager;
        }

        [HttpGet("users")]
        public IEnumerable<UserDto> GetAllUsers()
        {
            var users = _userManager.Users
                                .Where(user => user.Deleted == false)
                                .Select(user => new UserDto
                                {
                                    Id = user.Id,
                                    Username = user.UserName,
                                    Email = user.Email,
                                    Role = _userManager.GetRolesAsync(user).Result[0]
                                }).ToList();

            return users;
        }
        [HttpPost("create")]
        public async Task<ActionResult> CreateUser([FromBody] SignUpUserDto userInfo)
        {
            if (_userManager.FindByNameAsync(userInfo.Username) == null)
            {
                return new ConflictResult();
            }

            string errors = string.Empty;

            try
            {
                var user = new BlogUserEntity
                {
                    AvatarSource = userInfo.AvatarSource,
                    AvatarLabel = userInfo.AvatarLabel,
                    UserName = userInfo.Username,
                    Email = userInfo.Email
                };

                var res = _userManager.CreateAsync(user, userInfo.Password).Result;

                if (res.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, userInfo.Role);

                    return new OkResult();
                }
                else
                {
                    foreach (var error in res.Errors)
                    {
                        errors += string.Format("{0} : {1}\n", error.Code, error.Description);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                errors += ex.Message;
            }

            return StatusCode(StatusCodes.Status500InternalServerError, errors);
        }
        [HttpDelete("{userId}")]
        public bool DeleteUser(string userId)
        {
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null)
            {
                return false;
            }

            user.Deleted = true;

            var res = _userManager.UpdateAsync(user).Result;

            return res.Succeeded;
        }
    }
}
