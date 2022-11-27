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
        public OutPostDto GetPostById(string id)
        {
            var post = new OutPostDto
            {
                Id = id,
                Title = "Quisque neque augue, iaculis ultricies risus fermentum",
                CreationTime = DateTime.Now,
                Text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae nisi erat. Phasellus sem nisi, semper ut odio in, tempus commodo risus. Donec interdum id tellus et fermentum. Donec ut diam ut lorem aliquet egestas sit amet venenatis tortor. Curabitur in sagittis neque. Mauris at purus suscipit, mollis ligula eget, pharetra mauris. Maecenas ac dignissim mi. Mauris at dolor eget velit commodo porta malesuada sit amet tellus. Proin fringilla porta quam, ut ultrices tortor finibus sed. Aenean ullamcorper sapien eu est scelerisque, quis consequat erat euismod. Etiam cursus mi a urna ullamcorper, non blandit turpis efficitur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris finibus felis felis, eu sodales nibh congue vitae.\r\n\r\nQuisque neque augue, iaculis ultricies risus fermentum, laoreet luctus ante. Quisque suscipit interdum ipsum, in viverra turpis fringilla a. Suspendisse faucibus lorem et placerat blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse id ligula quis orci facilisis accumsan. Sed sagittis aliquam ultrices. Aenean malesuada nisl eget lacus egestas, non semper lectus feugiat. Phasellus odio est, porta sed sodales eget, congue id nisi. Morbi posuere vehicula tortor ac scelerisque. Vivamus at turpis risus.\r\nSed et dolor nunc. Vestibulum congue erat sapien, vel eleifend elit tempus in. Fusce porttitor nulla sem, at vehicula ante interdum ac. Fusce ipsum leo, sollicitudin vel iaculis sit amet, venenatis feugiat libero. Cras mollis nunc metus, nec sollicitudin libero iaculis vel. Donec non facilisis sem. Fusce faucibus ante ut libero iaculis varius. In id augue ut nisl dignissim aliquet. Proin auctor, augue eget aliquam pellentesque, risus nulla sodales purus, eu ultricies augue odio quis magna. Vestibulum semper dictum quam, sit amet luctus lectus vestibulum in. Praesent molestie, lorem eu ullamcorper dictum, mauris dolor efficitur urna, non rutrum nulla arcu sed purus. Fusce sagittis dolor arcu, et imperdiet.",
                ImageLabel = "KewlBike.jpg",
                ImageSource = "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
            };

            return post;
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
