using Blog.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("{userId}")]
        public UserDto GetUser(string userId)
        {
            throw new NotImplementedException();
        }
        [HttpGet("all/cards")]
        public IEnumerable<UserCardDto> GetUserCards() 
        {
            throw new NotImplementedException();
        }

        [HttpPost("create")]
        public bool Create([FromBody] UserDto user)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{usedId}")]
        public bool DeleteAccount(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
