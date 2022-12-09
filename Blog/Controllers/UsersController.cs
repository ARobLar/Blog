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
    public class UsersController : ControllerBase
    {
        private readonly UserManager<BlogUserEntity> _userManager;
        private readonly SignInManager<BlogUserEntity> _signInManager;
        private readonly IConfiguration _config;

        public UsersController(UserManager<BlogUserEntity> userManager,
                                SignInManager<BlogUserEntity> signInManager,
                                IConfiguration configuration)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._config = configuration;
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<UserCardDto>> GetUserCards() 
        {
            var userCards = _userManager.Users
                .Where(user => user.Deleted == false)
                .Select(user => new UserCardDto
                {
                    Username = user.UserName,
                    AvatarLabel = user.AvatarLabel,
                    AvatarSource = user.AvatarSource
                }).ToList();

            return Ok(userCards);
        }

        [HttpPost("create")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type=typeof(string))]
        public async Task<ActionResult> Create([FromBody] SignUpUserDto userInfo)
        {
            if (_userManager.FindByNameAsync(userInfo.Username).Result != null)
            {   // User already exists in database (even if deleted)
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

        [HttpDelete]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public ActionResult DeleteUser()
        {
            var user = _userManager.Users.FirstOrDefault(user => user.UserName == User.Identity.Name);

            if (user.UserName == _config["DefaultAdmin: Username"])
            {   //Can't remove default admin, protects from deleting all admins
                return Forbid();
            }

            var errors = string.Empty;
            try
            {
                user.Deleted = true;

                var res = _userManager.UpdateAsync(user).Result;

                if (res.Succeeded)
                {
                    _signInManager.SignOutAsync();
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
