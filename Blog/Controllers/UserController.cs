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
        public bool Create([FromBody] SignUpUserDto user)
        {
            return true;
        }

        [HttpDelete("{usedId}")]
        public bool DeleteAccount(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
