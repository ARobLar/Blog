using System.ComponentModel.DataAnnotations;

namespace Blog.Dto
{
    public class SignUpUserDto
    {
        [Required]
        public string AvatarLabel { get; set; }
        [Required]
        public string AvatarSource { get; set; }
        [Required]
        public string Role { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
