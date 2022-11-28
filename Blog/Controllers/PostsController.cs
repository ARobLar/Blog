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
            int postId;
            if(!int.TryParse(id, out postId))
            {
                return null;
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId);

            return new OutPostDto
            {
                Id = id,
                Title = post.Title,
                CreationTime = post.CreationTime,
                Text = post.Text,
                ImageLabel = post.ImageLabel,
                ImageSource = post.ImageSource
            };
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
