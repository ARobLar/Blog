﻿using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<BlogUserEntity> userManager,
                                SignInManager<BlogUserEntity> signInManager,
                                RoleManager<IdentityRole> roleManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._roleManager = roleManager;
        }

        [HttpGet("{userId}")]
        [Authorize]
        public UserDto GetUser(string userId)
        {
            throw new NotImplementedException();
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
        [Authorize]
        public async Task<string> Create([FromBody] SignUpUserDto userInfo)
        {
            if (!IsValid(userInfo))
            {
                return "User information is not valid";
            }

            if (!AlreadyExists(userInfo.Username))
            {
                return "Username already exists";
            }

            string result = string.Empty;

            try
            {
                var user = new BlogUserEntity
                {
                    UserName = userInfo.Username,
                    Email = userInfo.Email
                };

                var res = _userManager.CreateAsync(user, userInfo.Password).Result;

                if (res.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Member");
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    result = "success";
                }
                else
                {
                    foreach (var error in res.Errors)
                    {
                        result += string.Format("{0} : {1}\n", error.Code, error.Description);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result += ex.Message;
            }

            return result;
        }

        [HttpDelete("{usedId}")]
        [Authorize]
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


        private bool IsValid(SignUpUserDto user)
        {
            return (user.Username != null && user.Username != "" &&
                    user.Email != null && user.Email != "" &&
                    user.Password != null && user.Password != "" &&
                    user.Role != null &&
                    _roleManager.Roles.FirstOrDefault(r => r.Name == user.Role) != null);

        }
        private bool AlreadyExists(string username)
        {
            return (_userManager.Users.FirstOrDefault(u => u.UserName == username) != null);
        }
    }
}
