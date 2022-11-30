using Blog.Dto;
using Blog.Entities;
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
        //private readonly RoleManager<IdentityRole> _roleManager;
        //private readonly BlogDbContext _context;

        public AuthController(SignInManager<BlogUserEntity> signInManager,
                                UserManager<BlogUserEntity> userManager,
                                RoleManager<IdentityRole> roleManager,
                                BlogDbContext context)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
            //this._roleManager = roleManager;
            //this._context = context;
        }

        [HttpPost("signIn")]
        public UserDto SignInUser([FromBody] signInDto credentials)
        {

            if (credentials.Username == null ||
                credentials.Password == null)
            {
                return null;
            }

            var userEntity = _userManager.FindByNameAsync(credentials.Username).Result;
            
            if (userEntity == null || userEntity.Deleted)
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
                
                //var roleId = _context.UserRoles.FirstOrDefault(r => r.UserId == userEntity.Id).RoleId;
                //var role = _roleManager.FindByIdAsync(roleId).Result;
                var role = _userManager.GetRolesAsync(userEntity).Result[0];

                var user = new UserDto
                {
                    Id = userEntity.Id,
                    Username = userEntity.UserName,
                    Email = userEntity.Email,
                    Role = role
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
