using Blog.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpGet("users")]
        public IEnumerable<UserDto> GetAllUsers()
        {
            throw new NotImplementedException();
        }
        [HttpPost("create")]
        public bool CreateUser([FromForm] UserDto user)
        {
            throw new NotImplementedException();
        }
        [HttpDelete("{id}")]
        public bool DeleteUser(int id) 
        {
            throw new NotImplementedException(); 
        }
    }
}
