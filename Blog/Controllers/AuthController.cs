using Blog.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("signIn")]
        public UserDto SignInUser([FromBody] signInDto credentials)
        {
            return new UserDto
            {
                Id = "4",
                Username = "User4",
                Email = "Test",
                Role = "Admin"
            };
        }

        [HttpPost("signOut/{username}")]
        public Task<bool> SignOutUser(string username)
        {
            throw new NotImplementedException();
        }
    }
}
