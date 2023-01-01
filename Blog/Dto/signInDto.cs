using System.ComponentModel.DataAnnotations;

namespace Blog.Dto
{
    public class signInDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public bool RememberMe { get; set; }
    }
}
