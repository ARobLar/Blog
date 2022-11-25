using Microsoft.EntityFrameworkCore;

namespace Blog.Controllers
{
    public class BlogDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite(@"Data Source=C:\Users\brittleSmallBrick\source\repos\Blog_NextjsRedux_DotNetCore\Blog\Blog.db");
    }
}
