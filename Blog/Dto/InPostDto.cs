using Microsoft.AspNetCore.Http;
using System;

namespace Blog.Entities
{
    public class InPostDto
    {
        public string Title { get; set; }
        public DateTime CreationTime { get; set; }
        public string Text { get; set; }
        public string ImageLabel { get; set; }
        public IFormFile Image { get; set; }
    }
}
