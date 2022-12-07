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
    public class UsersController : ControllerBase
    {
        private readonly UserManager<BlogUserEntity> _userManager;
        private readonly SignInManager<BlogUserEntity> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<BlogUserEntity> userManager,
                                SignInManager<BlogUserEntity> signInManager,
                                RoleManager<IdentityRole> roleManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._roleManager = roleManager;
        }

        [HttpGet("test/current/{choice}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<bool> GetCurrentTest(int choice)
        {
            if(choice == 1)
            {
                return NotFound();
            }
            if (choice == 2)
            {
                return NoContent();
            }
            if (choice == 3)
            {
                return Ok(false);
            }

            return Ok(true);
        }

        [HttpGet("current")]
        [Authorize]
        public UserDto GetCurrentUser()
        {
            var userEntity = _userManager.FindByNameAsync(User.Identity.Name).Result;

            var user = new UserDto
            {
                Id = userEntity.Id,
                Username = userEntity.UserName,
                Role = _userManager.GetRolesAsync(userEntity).Result[0],
                Email = userEntity.Email
            };

            return user;
        }

        [HttpGet("all/cards")]
        public IEnumerable<UserCardDto> GetUserCards() 
        {
            var userCards = _userManager.Users
                .Where(user => user.Deleted == false)
                .Select(user => new UserCardDto
                {
                    Username = user.UserName,
                    AvatarLabel = user.AvatarLabel,
                    AvatarSource = user.AvatarSource
                }).ToList();

            return userCards;
        }

        [HttpPost("create")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type=typeof(string))]
        public async Task<ActionResult> Create([FromBody] SignUpUserDto userInfo)
        {
            //Enforce a member role
            userInfo.Role = "Member";

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

        [HttpDelete("{usedId}")]
        [Authorize]
        public bool DeleteUser(string userId)
        {
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null || User.Identity.Name != user.UserName)
            {
                return false;
            }

            user.Deleted = true;

            var res = _userManager.UpdateAsync(user).Result;

            return res.Succeeded;
        }
    }
}
