# Blog
Blog

1. Take home the entire repo
2. To utilize the existing database, the path to it must first be set correctly,
   this can be done with the connectionstring found in the appsettings.json -> Connectionstrings:database

3. Open the commandprompt and go to the Blog project directory (same directory as the Blog.csproj file)
4. The client and server can be started in two ways:

  A. Run the command: "npm run start"
      - This will run the client application and the server simultaneously

  B. Enter the client directory and run command: "npm run dev" to start the client application
     Go to the Blog project directory and enter "dotnet run" to start the server

5. This should open up your default browser at "https://localhost:5001", rendering the main page of the website
   If the browser doesn't open automatically, enter the above url manually.


In the root folder (/Blog) you will find the database (Blog.db) having a few users added with different user roles ("Member" and "Admin") and blog posts.

- Default Admin can be accessed with:
   - username:  admiral
   - password:  Admin.123

- A user with multiple blog posts already added can be accessed via:
   - Username:  testMember
   - Password:  Member.123


The website consists of the following pages at endpoints ( ):

Home page   (/)               : Displays all users
Sign Up     (/signUp)         : allows a non logged-in user to sign up
Sign In     (/signIn)         : allows a user to log in 
Admin page  (/admin)          : Shows all existing users and allows to register new user with specified role. Only accessible for admin users.
Member page (/[username])     : home page of a blog user
Add post    (/[username]/post/add)        : Allows logged in user to add post
Edit post   (/[username]/post/edit/[id])  : Allows author to edit post
Show post   (/[username]/post/show/[id])  : Shows post of given id

On top is a Nagivationbar with a home button, and buttons to access each of the above pages (except for showing/editing a specific post)
