using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<BlogUserEntity> _signInManager;
        private readonly UserManager<BlogUserEntity> _userManager;

        public AuthController(SignInManager<BlogUserEntity> signInManager,
                                UserManager<BlogUserEntity> userManager)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
        }

        [HttpPost("signIn")]
        [ProducesResponseType(StatusCodes.Status200OK, Type=typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public ActionResult<UserDto> SignInUser([FromBody] signInDto credentials)
        {
            var userEntity = _userManager.FindByNameAsync(credentials.Username).Result;
            
            if (userEntity == null || userEntity.Deleted)
            {
                return NotFound();
            }

            try
            {
                var res = _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, credentials.RememberMe, false).Result;

                if (!res.Succeeded)
                {
                    return Unauthorized();
                }
                
                // All users require a role
                var role = _userManager.GetRolesAsync(userEntity).Result[0];

                var user = new UserDto
                {
                    Id = userEntity.Id,
                    Username = userEntity.UserName,
                    Email = userEntity.Email,
                    Role = role
                };

                return Ok(user);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("signOut")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public async Task<ActionResult> SignOutUser()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
