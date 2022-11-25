using Blog.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Blog.Controllers
{
    public class BlogDbContext : IdentityDbContext
    {
        public DbSet<PostEntity> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite(@"Data Source=C:\Users\brittleSmallBrick\source\repos\Blog_NextjsRedux_DotNetCore\Blog\Blog.db");
    }
}
