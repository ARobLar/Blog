using Blog.Dto;
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

        [HttpGet("{username}/all/cards")]
        public IEnumerable<OutPostDto> GetAllBlogPostCards(string username)
        {
            var listOfCards = new List<OutPostDto>();
            
            for (int i = 0; i < 15; i++)
            {
                listOfCards.Add(new OutPostDto
                {
                    Id = i.ToString(),
                    Title = "Title " + i.ToString(),
                    CreationTime= DateTime.Now,
                    Text = "This should amount to approximately fifty characters..",
                    ImageLabel = "KewlBike.jpg",
                    ImageSource = "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
                });
            }

            return listOfCards;
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
