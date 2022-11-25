using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        [HttpGet("{id}")]
        public OutPostDto GetPostById(int id)
        {
            throw new NotImplementedException();
        }

        [HttpGet("all/{username}")]
        public IEnumerable<OutPostDto> GetAllBlogPostCards(string username)
        {
            throw new NotImplementedException();
        }

        [HttpPost("create")]
        public bool Create([FromForm] InPostDto post)
        {
            throw new NotImplementedException();
        }

        [HttpPut("update")]
        public bool Update([FromBody] InPostDto post)
        {
            throw  new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public bool Delete(int id) 
        {
            throw new NotImplementedException();
        }
    }
}
