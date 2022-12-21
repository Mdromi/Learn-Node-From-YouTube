# [Node.js Social Media REST API with MongoDb](https://youtu.be/ldGl6L4Vktk)


## Routs
`URL: http://localhost:4000/api`

### Users
- Register user

`Path: {{URL}}/auth/register`

`Method: post`

Body: 
```json
{
    "username": "username",
    "email": "name@email.com",
    "password": "pas123"
}
```

- Login user

`Path: {{URL}}/auth/login`

`Method: post`

Body: 
```json
{
    "email": "name@email.com",
    "password": "pas123"
}
```

- Update user

`Path: {{URL}}/users/updatedUserId`

`Method: put`

Body: 
```json
{
    "userId": "63a31aa829e1c10642baf435",
    "password": "pas123",
    "updatedData": "data"
}
```

- Delete user

`Path: {{URL}}/users/deletedUserId`

`Method: delete`

Body: 
```json
{
    "userId": "deletedUserId"
}
```

- Get a single user

`Path: {{URL}}/users/userId`

`Method: get`

- Follow user

`Path: {{URL}}/users/follow/followingId`

`Method: put`

Body: 
```json
{
    "userId": "currentUserId"
}
```
- UnFollow user

`Path: {{URL}}/users/follow/followingId`

`Method: put`

Body: 
```json
{
    "userId": "currentUserId"
}
```

### Posts
- Create post

`Path: {{URL}}/posts/`

`Method: post`

Body: 
```json
{
    "userId": "Creator user Id",
    "desc": "description",
    "img": "img url"
}
```

- Update post

`Path: {{URL}}/posts/postId`

`Method: post`

Body: 
```json
{
    "userId": "Creator user Id",
    "data": "updated data"
}
```

- Delete post

`Path: {{URL}}/posts/postId`

`Method: delete`

Body: 
```json
{
    "userId": "Creator user Id",
}
```

- Like Dislike post

`Path: {{URL}}/posts/like/postId`

`Method: put`

Body: 
```json
{
    "userId": "Creator user Id",
}
```

- Get a post

`Path: {{URL}}/posts/postId`

`Method: get`

- TimeLine post

`Path: {{URL}}/posts/timeline`

`Method: get`

Body: 
```json
{
    "userId": "Creator user Id",
}
```