using System;

namespace Blog.Entities
{
    public class OutPostDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime CreationTime { get; set; }
        public string Text { get; set; }
        public string ImageLabel { get; set; }
        public string ImageSource { get; set; }
    }
}
