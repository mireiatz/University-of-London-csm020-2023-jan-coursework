**DESCRIPTION**

MiniWall is the API for a posting app. Users register and log in to access the API. Once authenticated and verified, users can create and see posts, as well as edit and delete their own posts. Once posts are available, users can comment on, like and unlike other users’ posts. 

To use the API, on Postman, select the method, add the endpoint and introduce the data in the Body as raw JSON on Table 1 below to perform the corresponding actions:

|**ACTION**|**METHOD**|**ENDPOINT**|**DATA**|
| :-: | :-: | :-: | :-: |
|<p>Register </p><p>a user</p>|POST|/users/register|<p>{</p><p>"user\_name": "name of the user",</p><p>"user\_email": "email of the user",</p><p>"user\_password": "chosen password"</p><p>}</p>|
|<p>Log in </p><p>as a user</p>|POST|/users/login|<p>{</p><p>"user\_email": "email of the registered user",</p><p>"user\_password": "password of the user"</p><p>}</p>|
|<p>Create </p><p>a post</p>|POST|/posts|<p>{</p><p>"post\_title": "title of the post",</p><p>"post\_content": "content of the post"</p><p>}</p>|
|Search posts|GET|/posts|-|
|<p>Search </p><p>a post</p>|GET|/posts/postId\*|-|
|<p>Edit </p><p>a post</p>|PATCH|/posts/postId\*|<p>{</p><p>"post\_title": "new title of the post",</p><p>"post\_content": "new content of the post"</p><p>}</p>|
|<p>Delete </p><p>a post</p>|DELETE|/posts/postId\*|-|
|Comment on a post|POST|/comments/postId\*|<p>{</p><p>"comment\_text": "text of the comment"</p><p>}</p>|
|Search comments|GET|/comments/postId\*|-|
|<p>Like / unlike</p><p>a post</p>|POST|/likes/postId\*|-|

\*postId = the ID of a specific post.

All actions except registration and login require the authentication token received when logging in to be added as a value under Headers with the key “auth-token”.


**DATABASE**

The MiniWall API connects to a mongoDB database named MiniWall created on the mongoDB website where there are the collections comments, likes, posts and users [2]. The connection is achieved through a connection string retrieved on mongoDB [2].

The database schemas are as follows [2]:

|**USERS**||
| :-: | :- |
|<p>{</p><p>user\_name:{</p><p>`        `type:String,</p><p>`        `require:true,</p><p>`        `min:3,</p><p>`        `max:256</p><p>},</p><p>user\_email:{</p><p>`        `type:String,</p><p>`        `require:true,</p><p>`        `min:6,</p><p>`        `max:256</p><p>},</p><p>user\_password:{</p><p>`        `type:String,</p><p>`        `require:true,</p><p>`        `min:6,</p><p>`        `max:1024</p><p>},</p><p>user\_timestamp:{</p><p>`        `type: Date,</p><p>`        `default: Date.now</p><p>}     </p><p>}</p>|<p></p><p>Name is required to be entered with min and max lengths</p><p></p><p></p><p></p><p>Email is required to be entered with min and max lengths, as well as regular email requirements</p><p></p><p></p><p>Password is required to be entered with min and max lengths</p><p></p><p></p><p>Timestamp defaults to the moment of registration</p>|

|**POSTS**||
| :-: | :- |
|<p>{</p><p>post\_title:{</p><p>`        `type: String,</p><p>`        `required: true</p><p>},</p><p>post\_content:{</p><p>`        `type: String,</p><p>`        `required: true</p><p>},</p><p>post\_owner:{</p><p>`        `type: String,</p><p>`        `required:true</p><p>},</p><p>post\_timestamp:{</p><p>`        `type: Date,</p><p>`        `default: Date.now</p><p>},</p><p>post\_likes:{</p><p>`        `type: Number,</p><p>`        `default: 0</p><p>}    </p><p>}</p>|<p></p><p>Title is required to be entered</p><p></p><p>Content is required to be entered</p><p></p><p>Owner is the ID of the user who has created the post, saved automatically</p><p></p><p>Timestamp defaults to the moment of creation</p><p></p><p>Number of likes in the post, defaults to 0 on creation and is updated after like/unlike</p>|

|**COMMENTS**||
| :-: | :- |
|<p>{</p><p>comment\_text:{</p><p>`        `type: String,</p><p>`        `required: true</p><p>},</p><p>comment\_postId:{</p><p>`        `type: String,</p><p>`        `required: true</p><p>},</p><p>comment\_owner:{</p><p>`        `type: String,</p><p>`        `required:true</p><p>},</p><p>comment\_timestamp:{</p><p>`        `type: Date,</p><p>`        `default: Date.now</p><p>}    </p><p>}</p>|<p></p><p>Text is required to be entered</p><p></p><p>Post ID is the ID of the post it belongs to, received on the endpoint</p><p></p><p>Owner is the ID of the user who has commented the post, saved automatically</p><p></p><p>Timestamp defaults to the moment of creation</p>|

|**LIKES**||
| :-: | :- |
|<p>{</p><p>like\_postId:{</p><p>`        `type: String,</p><p>`        `required: true</p><p>},</p><p>like\_owner:{</p><p>`        `type: String,</p><p>`        `required:true</p><p>},</p><p>like\_timestamp:{</p><p>`        `type: Date,</p><p>`        `default: Date.now</p><p>}    </p><p>}</p>|<p></p><p>Post ID is the ID of the post it belongs to, received on the endpoint</p><p></p><p>Owner is the ID of the user who has liked the post, saved automatically</p><p></p><p>Timestamp defaults to the moment of creation</p>|


**API DESIGN**

The MiniWall API has been developed on the Node.js framework Express using VS Code and a localhost server on Postman [2] [3]. The main file is `app.js` where:

- The app and local server are created as per Express [2].
- The app is connected to mongoDB using the mongoose package together with the dotenv package to protect the connection string [2].
- The package body-parser is imported to manage the data in JSON format [2].
- The routing is set up by connecting files under the folder routes to their corresponding endpoints:
1. `/users` calls the `auth.js` file where the database schema for users described in `User.js` under the models folder is used to [3]:
   - Register (create) users by following the instructions described in section A:
     - The data is validated through the registerValidation function in the `validation.js` file using the joi package. 
     - The data is validated against existing users to avoid replication.
     - The user data is saved with a hashed password which is achieved through the use of the bcryptjs package.
   - Log in users by following the instructions described in section A:
     - The data is validated through the loginValidation function in the `validation.js` file using the joi package. 
     - The password is validated against the hashed password using the compare function in the bcryptjs package.
     - A token is generated through the jsonwebtoken package to verify users accessing the API. The token is then verified for every action the user carries out (e.g. browsing posts). In order to achieve this, the `verifyToken.js` file - where the token provided as a header by the user is checked using the jsonwebtoken package - is imported in each of the routes. 


2. `/posts` calls the `posts.js` file where the database schema for posts described in `Post.js` under the models folder is used to [2]:
   - Create posts by following the instructions described in section A.
   - Read all posts sorting them first by amount of likes (most popular first) and then creation times (most recent first) by following the instructions described in section A.
   - Read a specific post by following the instructions described in section A.
   - Edit a post owned by the logged in user by following the instructions described in section A.
   - Delete a post owned by the logged in user by following the instructions described in section A.

3. `/comments` calls the `comments.js` file where the database schemas for posts and comments described in `Post.js` and Comments.js` under the models folder are used to [2]:
   - Create comments in other users’ posts by following the instructions described in section A.
   - Read comments on a specific post by following the instructions described in section A.

4. `/likes` calls the `likes.js` file where the database schemas for likes and posts described in `Like.js` and `Post.js` under the models folder are used to [2]:
   - Like and unlike other users’ posts, i.e, create and delete likes, as well as increase and decrease the number of likes in the post, respectively, by following the instructions described in section A.
   - Read likes in a post both the amount and their data by following the instructions described in section A.



**DEPLOYMENT**

MiniWall was deployed in Google Cloud following the steps below [4]:

1. Upload code to GitHub.
   - Create a repository on GitHub.
   - Initialise git and add the GitHub repository:
   
   `git init`
   
   `git remote add origin repo-name`

   - Hide the `.env` file by adding a `.gitignore` file and writing `.env` on it.
   - Push code to GitHub:

      `git add .`

      `git commit -m “message”`

      `git push -f origin master`

2. Create a Virtual Machine (VM) on the Google Cloud platform [1].

3. Connect the VM using the SSH button.

4. Install and configure Docker with the following commands:
   - First update the system: 
   
   `sudo apt-get update`

   - Install Docker: 
   
   `sudo apt-get install docker.io`

   - Check that Docker is running: 
   
   `sudo systemctl status docker`

   - Create a new user: 
   
   `sudo adduser username`

   - Give the user sudo access by adding it to the sudo group: 
   
   `sudo usermod -aG sudo username`

   - Give sudo permissions to docker to run commands without using sudo: 
   
   `sudo usermod -aG docker username`.

   - Switch users to *username*: 
   
   `su - username`.

   - Check that everything is ready: 
   
   `docker`

5. Clone the GitHub repository:

   - Clone the repository:

   `git clone --branch master https://username:ghp\_L1xt2Eut1yS49r0JIIarByXLVugjgQ1MGHif@github.com/repo-name`

   - Check that it has worked: 
   
   `ls`

   - Enter the repository folder and create a new Dockerfile: 

   `cd repo-name` 

   `pico Dockerfile`

   - Build an image: 
   
   `docker image build -t mini-wall-image:1 .`

   - Run the container: 
   
   `docker container run -d --name mini-wall-1 --publish 80:3000 mini-wall-image:1`

6. Use the API in the VM.


**FUTURE WORK**

In the future there are a few things that could improve the usability of the platform. 

One example is role definition, e.g. differentiating between regular and admin users to allow admin users to perform more advanced actions such as viewing other users’ information. 

In addition, a front-end must be developed to allow users to use the platform.



**REFERENCES**

[1] Sotiriadis, S 2023, 1.7 Lecture 6: Introduction to Google Cloud Platform (GCP) services and virtual machines, lecture notes, Cloud computing CSM020-2023-JAN, University of London, delivered 30 January 2023.

[2] Sotiriadis, S 2023, 3.8 Lab 3, Part 1: Building the MiniPost REST microservice, lecture notes, Cloud computing CSM020-2023-JAN, University of London, delivered 23 January 2023.

[3] Sotiriadis, S 2023, 5.6 Lab 5, Part 3: Pushing code to GitHub and Docker, lecture notes, Cloud computing CSM020-2023-JAN, University of London, delivered 30 January 2023.

[4] Sotiriadis, S 2023, 5.6 Lab 5, Part 3: Pushing code to GitHub and Docker, lecture notes, Cloud computing CSM020-2023-JAN, University of London, delivered 30 January 2023.
