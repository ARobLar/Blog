using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using static Blog.Controllers.SharedControllerFunctions;

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

        [HttpGet("current")]
        public UserDto GetCurrentUser()
        {
            if(!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userEntity = _userManager.FindByNameAsync(User.Identity.Name).Result;

            return new UserDto
                {
                    Id = userEntity.Id,
                    Username = userEntity.UserName,
                    Role = _userManager.GetRolesAsync(userEntity).Result[0],
                    Email = userEntity.Email,
                };
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
        public bool Create([FromBody] SignUpUserDto userInfo)
        {
            userInfo.Role = "Member";
            return "success" == TryAddUser(userInfo,
                                          _roleManager,
                                          _userManager,
                                          _signInManager).Result;
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
