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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type=typeof(string))]
        public async Task<ActionResult> Create([FromBody] SignUpUserDto userInfo)
        {
            if (_userManager.FindByNameAsync(userInfo.Username) != null)
            {   // User already exists
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
                    //Enforce the Member role
                    await _userManager.AddToRoleAsync(user, "Member");

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

        [HttpDelete("{usedId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status410Gone)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeleteUser(string userId)
        {
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null)
            {   // Invalid user Id
                return NotFound();
            }
            if (user.Deleted)
            {   // User already deleted
                return StatusCode(StatusCodes.Status410Gone);
            }
            if (User.Identity.Name != user.UserName)
            {   //Unauthorized user
                return Unauthorized();
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
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                errors += ex.Message;
            }

            return StatusCode(StatusCodes.Status500InternalServerError, errors);
        }
    }
}
