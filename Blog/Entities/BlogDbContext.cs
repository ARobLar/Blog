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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.json")
                   .Build();
                var connectionString = configuration.GetConnectionString("database");
                optionsBuilder.UseSqlite(connectionString);
            }
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder options)
        //    => options.UseSqlite(@"Data Source=C:\Users\brittleSmallBrick\source\repos\Blog_NextjsRedux_DotNetCore\Blog\Blog.db");
    }
}
