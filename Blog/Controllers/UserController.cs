using Blog.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("card/{username}")]
        public UserDto GetUserCard(string username)
        {
            return new UserDto();
        }
        [HttpGet("cards")]
        public IEnumerable<UserCardDto> GetUserCards() 
        {
            return new List<UserCardDto>();
        }

        [HttpPost("create")]
        public bool Create([FromBody] UserDto user)
        {
            return true;
        }

        [HttpDelete("delete/{usedId}")]
        public bool DeleteAccount(int userId)
        {
            return true;
        }
    }
}
