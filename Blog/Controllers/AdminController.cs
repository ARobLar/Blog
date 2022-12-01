using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using static Blog.Controllers.SharedControllerFunctions;

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
        public bool CreateUser([FromBody] SignUpUserDto user)
        {
            return "success" == TryAddUser(user,
                                            _roleManager,
                                            _userManager,
                                            _signInManager).Result;
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
