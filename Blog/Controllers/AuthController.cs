using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<BlogUserEntity> _signInManager;
        private readonly BlogDbContext _context;

        public AuthController(SignInManager<BlogUserEntity> signInManager,
                                BlogDbContext context)
        {
            this._signInManager = signInManager;
            this._context = context;
        }

        [HttpPost("signIn")]
        public UserDto SignInUser([FromBody] signInDto credentials)
        {

            if (credentials.Username == null ||
                credentials.Password == null)
            {
                return null;
            }

            try
            {
                var res = _signInManager.PasswordSignInAsync(credentials.Username, credentials.Password, credentials.RememberMe, false).Result;

                if (!res.Succeeded)
                {
                    return null;
                }

                var userEntity = _context.Users.FirstOrDefault(u => u.UserName == credentials.Username);
                var roleId = _context.UserRoles.FirstOrDefault(r => r.UserId == userEntity.Id).RoleId;
                var role = _context.Roles.FirstOrDefault(r => r.Id == roleId);


                var user = new UserDto
                {
                    Id = userEntity.Id,
                    Username = userEntity.UserName,
                    Email = userEntity.Email,
                    Role = role.Name
                };

                return user;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        [HttpPost("signOut")]
        [Authorize]
        public async Task<bool> SignOutUser()
        {
            bool success;

            try
            {
                await _signInManager.SignOutAsync();
                success = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                success = false;
            }

            return success;
        }
    }
}
