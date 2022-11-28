using Blog.Dto;
using Blog.Entities;
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
        public UserDto GetUser(string userId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("all/cards")]
        public IEnumerable<UserCardDto> GetUserCards() 
        {
            var listOfCards = new List<UserCardDto>();

            for(int i =0; i<15; i++)
            {
                listOfCards.Add(new UserCardDto
                {
                    Username = "User" + i.ToString(),
                    AvatarLabel = "KewlBike.jpg",
                    AvatarSource = "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
                });
            }

            return listOfCards;
            //throw new NotImplementedException();
        }

        [HttpPost("create")]
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
        public bool DeleteAccount(string userId)
        {
            throw new NotImplementedException();
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
