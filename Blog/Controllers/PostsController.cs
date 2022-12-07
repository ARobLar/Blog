using Blog.Dto;
using Blog.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        [ProducesResponseType(StatusCodes.Status200OK, Type=typeof(OutPostDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity, Type = typeof(string))]
        public ActionResult<OutPostDto> GetPostById(string id)
        {
            if(!int.TryParse(id, out int postId))
            {   //Not a number
                return StatusCode(StatusCodes.Status422UnprocessableEntity, id);
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId && p.Deleted == false);

            if(post == null)
            {   //Invalid Id
                return NotFound(id);
            }

            var p = new OutPostDto
            {
                Id = id,
                Title = post.Title,
                CreationTime = post.CreationTime,
                Text = post.Text,
                ImageLabel = post.ImageLabel,
                ImageSource = post.ImageSource
            };

            return Ok(p);
        }

        [HttpGet("{username}/all/cards")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutPostDto>))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(string))]
        public ActionResult<IEnumerable<OutPostDto>> GetAllBlogPostCards(string username)
        {
            var user = _userManager.FindByNameAsync(username).Result;

            if(user == null || user.Deleted)
            {
                return NotFound(username);
            }

            var postCards = _context.Posts.Where(p => p.UserId == user.Id && p.Deleted == false)
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

            return postCards.Count > 0 ? 
                    Ok(postCards) : 
                    NoContent();
        }

        [HttpPost("create")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public ActionResult Create([FromForm] InPostDto post)
        {
            try
            {
                // Authorized user must exist in database
                var user = _userManager.FindByNameAsync(User.Identity.Name).Result;

                var imagePaths = SaveImage(post.Image);


                var p = new PostEntity
                {
                    UserId = user.Id,
                    Title = post.Title,
                    CreationTime = post.CreationTime,
                    Text = post.Text,
                    ImageLabel = imagePaths["imageName"],
                    ImageSource = imagePaths["imagePath"],
                    ThumbnailSource = imagePaths["thumbnailPath"],
                    Deleted = false
                };

                _context.Posts.Add(p);
                _context.SaveChanges();

                return NoContent();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity, Type = typeof(string))]
        public ActionResult Update([FromForm] InPostDto editedPost, string id)
        {
            if (!int.TryParse(id, out int postId))
            {   //Not a number
                return StatusCode(StatusCodes.Status422UnprocessableEntity, id);
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId);

            if (post == null)
            {   //Invalid Id
                return NotFound(id);
            }
            if (!IsAuthor(post.UserId))
            {   //Calling user is not author
                return Unauthorized();
            }

            post.Title = editedPost.Title;
            post.Text = editedPost.Text;

            var oldImageRootPath = string.Empty;
            var oldThumbnailRootPath = string.Empty;
            var editedImageRootPath = string.Empty;
            var editedThumbnailRootPath = string.Empty;

            try
            {
                if (editedPost.Image != null)
                {
                    //Update new image and thumbnail
                    var imagePaths = SaveImage(editedPost.Image);

                    oldImageRootPath = Path.Combine(_hostEnvironment.ContentRootPath, post.ImageSource.Replace('/','\\'));
                    oldThumbnailRootPath = Path.Combine(_hostEnvironment.ContentRootPath, post.ThumbnailSource.Replace('/', '\\'));

                    post.ImageLabel = imagePaths["imageName"];
                    post.ImageSource = imagePaths["imagePath"];
                    post.ThumbnailSource = imagePaths["thumbnailPath"];

                    editedImageRootPath = imagePaths["imageRootPath"];
                    editedThumbnailRootPath = imagePaths["thumbnailRootPath"];
                }

                _context.Posts.Update(post);
                var changed = _context.SaveChanges() > 0;

                if(changed && oldImageRootPath != string.Empty)
                {
                    // New images added, delete old image files
                    System.IO.File.Delete(oldImageRootPath);
                    System.IO.File.Delete(oldThumbnailRootPath);
                } 
                else if(!changed && editedImageRootPath != string.Empty)
                {
                    // Failed to save new post, delete newly added images
                    System.IO.File.Delete(editedImageRootPath);
                    System.IO.File.Delete(editedThumbnailRootPath);
                }

                return NoContent();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status410Gone)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError, Type = typeof(string))]
        public ActionResult Delete(string id) 
        {

            if (!int.TryParse(id, out int postId))
            {   //Not a number
                return StatusCode(StatusCodes.Status422UnprocessableEntity, id);
            }

            var post = _context.Posts.FirstOrDefault(p => p.Id == postId);

            if (post == null)
            {   // Invalid user Id
                return NotFound();
            }
            if (post.Deleted)
            {   // User already deleted
                return StatusCode(StatusCodes.Status410Gone);
            }
            if (!IsAuthor(post.UserId))
            {   //Unauthorized user
                return Unauthorized();
            }

            try
            {
                post.Deleted = true;

                _context.Update(post);
                _context.SaveChanges();

                return NoContent();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
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
                { "thumbnailPath", string.Format("{0}/{1}", subPath, thumbnailName) },
                { "imageRootPath", imagePath},
                { "thumbnailRootPath", thumbnailPath} };

            return imageNames;
        }

        private bool IsAuthor(string UserId)
        {
            var author = _userManager.FindByIdAsync(UserId).Result;

            var authorName = author != null ? author.UserName : string.Empty;

            return User.Identity.Name == authorName;
        }
    }
}
