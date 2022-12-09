using Blog.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Blog.Controllers
{
    public class BlogDbContext : IdentityDbContext<BlogUserEntity>
    {
        public DbSet<PostEntity> Posts { get; set; }

        public BlogDbContext(DbContextOptions<BlogDbContext> options) 
            : base(options)
        {
        }
    }
}
