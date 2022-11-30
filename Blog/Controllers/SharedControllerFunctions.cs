using System.Threading.Tasks;
using System;
using Blog.Dto;
using Microsoft.AspNetCore.Identity;
using Blog.Entities;
using System.Linq;

namespace Blog.Controllers
{
    public static class SharedControllerFunctions
    {
        private static bool IsNotEmpty(SignUpUserDto user, RoleManager<IdentityRole> roleManager)
        {
            return (user.Username != null && user.Username != "" &&
                    user.Email != null && user.Email != "" &&
                    user.Password != null && user.Password != "" &&
                    user.Role != null &&
                    roleManager.Roles.FirstOrDefault(r => r.Name == user.Role) != null);

        }
        public static bool UserExists(string username, UserManager<BlogUserEntity> userManager)
        {
            return (userManager.FindByNameAsync(username) != null);
        }

        public static async Task<string> TryAddUser(SignUpUserDto userInfo, 
                                            RoleManager<IdentityRole> roleManager, 
                                            UserManager<BlogUserEntity> userManager,
                                            SignInManager<BlogUserEntity> signInManager)
        {
            if (!IsNotEmpty(userInfo, roleManager))
            {
                return "User information is not valid";
            }

            if (!UserExists(userInfo.Username, userManager))
            {
                return "Username already exists";
            }

            string result = string.Empty;

            try
            {
                var user = new BlogUserEntity
                {
                    AvatarSource = @"https://source.unsplash.com/random",
                    AvatarLabel = "RandomImage",
                    UserName = userInfo.Username,
                    Email = userInfo.Email
                };

                var res = userManager.CreateAsync(user, userInfo.Password).Result;

                if (res.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, userInfo.Role);
                    await signInManager.SignInAsync(user, isPersistent: false);

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
    }
}
