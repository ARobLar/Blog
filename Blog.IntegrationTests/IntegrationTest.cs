using Blog.Controllers;
using Blog.Dto;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Policy;
using System.Threading.Tasks;
using Xunit;

namespace Blog.IntegrationTests
{
    public class IntegrationTest
    {
        protected readonly HttpClient TestClient;

        public IntegrationTest() 
        {
            var appFactory = new WebApplicationFactory<Startup>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        services.RemoveAll(typeof(DbContextOptions<BlogDbContext>));
                        services.AddDbContext<BlogDbContext>(options =>
                        {
                            options.UseInMemoryDatabase("TestDb");
                        });
                    });
                });
            TestClient = appFactory.CreateClient();
        }

        protected async Task AuthenticateAsMemberAsync()
        {
            string url = string.Format("/api/Users/create");

            await TestClient.PostAsJsonAsync(url, new SignUpUserDto
            {
                AvatarLabel = "TestLabel",
                AvatarSource = "TestSource",
                Role = "Member",
                Email = "email@test.com",
                Username = "test",
                Password = "Password.123",
            });

            url = "/api/Auth/signIn";

            await TestClient.PostAsJsonAsync(url, new signInDto
            {
                Username = "test",
                Password = "Password.123",
                RememberMe = false
            });
        }
        protected async Task AuthenticateAsAdminAsync()
        {
            var url = "/api/Auth/signIn";

            await TestClient.PostAsJsonAsync(url, new signInDto
            {
                Username = "admiral",
                Password = "Admin.123",
                RememberMe = false
            });
        }
        protected async Task<string> AddUser(string uniqueNameId, string role, bool asAdmin)
        {
            var addUserUrl = string.Format("/api/{0}/create", asAdmin ? "Admin" : "Users");

            var name = "Abc" + uniqueNameId;

            await TestClient.PostAsJsonAsync(addUserUrl, new SignUpUserDto
            {
                AvatarLabel = uniqueNameId.ToString(),
                AvatarSource = uniqueNameId.ToString(),
                Email = uniqueNameId.ToString(),
                Role = role,
                Username = name,
                Password = "Abc.123",
            });

            return name;
        }
     }
}
