using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Blog.Entities
{
    public class BlogUserEntity : IdentityUser
    {
        [Required]
        public string AvatarLabel { get; set; }
        [Required]
        public string AvatarSource {  get; set; }
        public bool Deleted { get; set; }
    }
}
