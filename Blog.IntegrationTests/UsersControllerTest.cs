using Blog.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace Blog.IntegrationTests
{
    public class UsersControllerTest : IntegrationTest
    {
        [Fact]
        public async Task GetAllUserCards_WittOnlyDefaultAdmin_ReturnOK_SingleUserList()
        {
            var url = "/api/Users/all/cards";
            var response = await TestClient.GetAsync(url);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task SignUpTwoMemberUsers_GetAllUserCards_ReturnThreeUserCardsResponse()
        {
            for (int i = 1; i <= 2; i++)
            {
                await AddUser(i.ToString(), "Member", false);
            }

            var url = "/api/Users/all/cards";
            var response = await TestClient.GetAsync(url);
            var data = await response.Content.ReadFromJsonAsync<IEnumerable<UserCardDto>>();


            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(3, data.ToList().Count);
        }


        [Fact]
        public async Task SignInAsAdmin_AddMember_DeleteMember_GetMissingMember()
        {
            await AuthenticateAsAdminAsync();

            var addedUsername = await AddUser("a", "Member", true);

            var getUsersUrl = "/api/Admin/users";
            var getUsersResponse = await TestClient.GetAsync(getUsersUrl);
            var getUsersData = await getUsersResponse.Content.ReadFromJsonAsync<IEnumerable<UserDto>>();

            var userToDelete = getUsersData.FirstOrDefault(user => user.Username == addedUsername);

            var deleteUserUrl = string.Format("/api/Admin/{0}", userToDelete.Id);
            var deleteUserResponse = await TestClient.DeleteAsync(deleteUserUrl);

            var getUsersAgainResponse = await TestClient.GetAsync(getUsersUrl);
            var getUsersAgainData = await getUsersAgainResponse.Content.ReadFromJsonAsync<IEnumerable<UserDto>>();

            var result = getUsersAgainData.FirstOrDefault(user => user.Username == userToDelete.Username);

            Assert.Equal(HttpStatusCode.OK, getUsersResponse.StatusCode);
            Assert.Equal(HttpStatusCode.NoContent, deleteUserResponse.StatusCode);
            Assert.Equal(HttpStatusCode.OK, getUsersAgainResponse.StatusCode);
            Assert.Null(result);

        }
    }
}