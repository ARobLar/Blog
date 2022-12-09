using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        private readonly IConfiguration _config;

        public AdminController(UserManager<BlogUserEntity> userManager,
                                IConfiguration configuration)
        {
            this._userManager = userManager;
            this._config = configuration;
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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
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

                    return NoContent();
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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status410Gone)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public ActionResult DeleteUser(string userId)
        {
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null)
            {   // Invalid user Id
                return NotFound();
            }
            if (user.UserName == _config["DefaultAdmin: Username"])
            {   //Can't remove default admin, protects from deleting all admins
                return Forbid();
            }
            if (user.Deleted)
            {   // User already deleted
                return StatusCode(StatusCodes.Status410Gone);
            }

            var errors = string.Empty;
            try
            {
                user.Deleted = true;

                var res = _userManager.UpdateAsync(user).Result;

                if (res.Succeeded)
                {
                    return NoContent();
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
    }
}
