﻿using Blog.Dto;
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
using Microsoft.AspNetCore.Identity;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly BlogDbContext _context;
        private readonly UserManager<BlogUserEntity> _userManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IConfiguration _config;

        public PostsController(BlogDbContext context,
                                UserManager<BlogUserEntity> userManager,
                                IWebHostEnvironment hostEnvironment,
                                IConfiguration config)
        {
            this._context = context;
            this._userManager = userManager;
            this._hostEnvironment = hostEnvironment;
            this._config = config;
        }

        [HttpGet("{id}")]
        public OutPostDto GetPostById(string id)
        {
            if(!int.TryParse(id, out int postId))
            {
                return null;
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId && p.Deleted == false);

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
            var user = _userManager.FindByNameAsync(username).Result;

            if(user == null || user.Deleted)
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
            try
            {

                var user = _userManager.FindByNameAsync(User.Identity.Name).Result;

                if(user == null || user.Deleted)
                {
                    return false;
                }

                var imagePaths = SaveImage(post.Image);

                var p = new PostEntity
                {
                    UserId = user.Id,
                    Title = post.Title,
                    CreationTime = post.CreationTime,
                    Text = post.Text,
                    ImageLabel = imagePaths["imageName"], // Split them up to imageSource and thumbnailSource
                    ImageSource = imagePaths["imagePath"],
                    ThumbnailSource = imagePaths["thumbnailPath"],
                    Deleted = false
                };

                _context.Posts.Add(p);
                _context.SaveChanges();

                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        [HttpPut("update")]
        public bool Update([FromBody] InPostDto post)
        {
            throw  new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public bool Delete(string id) 
        {

            if (!int.TryParse(id, out int postId))
            {
                return false;
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId);

            if (post != null)
            {
                post.Deleted = true;
                _context.Update(post);
                _context.SaveChanges();

                return true;
            }

            return false;
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
