using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
//using static System.Net.Mime.MediaTypeNames;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Microsoft.Extensions.Configuration;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IConfiguration _config;

        public PostsController(BlogDbContext context,
                                IWebHostEnvironment hostEnvironment,
                                IConfiguration config)
        {
            this._context = context;
            this._hostEnvironment = hostEnvironment;
            this._config = config;
        }

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
            var user = _context.Users.FirstOrDefault(u => u.UserName == username);

            if(user == null)
            {
                return null;
            }

            var postCards = _context.Posts.Where(p => p.UserId == user.Id)
                .Select(p => new OutPostDto
                {
                    Id = p.Id.ToString(),
                    Title = p.Title, 
                    CreationTime = p.CreationTime,
                    Text = p.Text.Substring(0, 50),
                    ImageLabel = p.ImageLabel,
                    ImageSource = p.ThumbnailSource
                })
                .ToList();

            return postCards;
        }

        [HttpPost("create")]
        public bool Create([FromForm] InPostDto post)
        {
            var success = false;

            var user = _context.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);

            var imagePaths = SaveImage(post.Image);

            var p = new PostEntity
            {
                UserId = user.Id,
                Title = post.Title,
                CreationTime = post.CreationTime,
                Text = post.Text,
                ImageLabel = imagePaths["imageName"], // Split them up to imageSource and thumbnailSource
                ImageSource = imagePaths["imagePath"],
                ThumbnailSource = imagePaths["thumbnailPath"]
            };

            _context.Posts.Add(p);
            _context.SaveChanges();

            success = true;

            return success;
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


        private Dictionary<string, string> SaveImage(IFormFile image)
        {
            string extension = Path.GetExtension(image.FileName);
            string subPath = _config["FileStorage:PostImagePath"];
            string imageDir = Path.Combine(_hostEnvironment.ContentRootPath, subPath);

            string imageName = new string(Path.GetFileNameWithoutExtension(image.FileName)
                                    .Take(10)
                                    .ToArray())
                                    .Replace(' ', '-') + DateTime.Now.ToString("yymmssfff");

            string imagePath = Path.Combine(imageDir, imageName + extension);

            string thumbnailName = imageName + "_thumbnail" + extension;
            string thumbnailPath = Path.Combine(imageDir, thumbnailName);

            Image img = Image.Load(image.OpenReadStream());
            img.Save(imagePath);

            img.Mutate(i => i.Resize(150, 150));
            img.Save(thumbnailPath);

            var imageNames = new Dictionary<string, string> {
                { "imageName", imageName },
                { "imagePath", string.Format("{0}/{1}{2}", subPath, imageName, extension) }, 
                { "thumbnailPath", string.Format("{0}/{1}", subPath, thumbnailName) }};

            return imageNames;
        }
    }
}
