using Microsoft.AspNetCore.Identity;

namespace Blog.Entities
{
    public class BlogUserEntity : IdentityUser
    {
        public string AvatarLabel { get; set; }
        public string AvatarSource {  get; set; }
    }
}
