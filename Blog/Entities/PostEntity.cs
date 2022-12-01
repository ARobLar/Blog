using System;
using System.ComponentModel.DataAnnotations;

namespace Blog.Entities
{
    public class PostEntity
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public DateTime CreationTime { get; set; }
        public string Text { get; set; }
        public string ImageLabel { get; set; }
        public string ImageSource { get; set; }
        public string ThumbnailSource { get; set; }
        public bool Deleted { get; set; }
    }
}
