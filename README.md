# [Instapix](https://insta-pix.herokuapp.com/#/)

Instapix is a picture sharing application where users can upload photos, follow other users, and like / comment on each others photos. 

[main-feed]: https://i.imgur.com/9HszVLT.png "Main Feed"
![main-feed][main-feed]

[image-upload]: https://media.giphy.com/media/QWq5TAoRVgVYgg8ZVH/giphy.gif "Image Upload"

[infi-scroll]: https://media.giphy.com/media/Ii4fTyICnJEtecA4HT/giphy.gif "Infinite Scroll"

### Built With: 

* MongoDB

* Express

* React / Redux

* Node.js

* AWS S3

### Highlights

#### New Post / Image Upload

Users are able to upload files from their computer to make new posts. Once the file is selected and the caption added (optional), the user can share the post with others.  

![image-upload][image-upload]

This image upload and post creation process took two steps. The first step was to get the image stored in AWS S3, and then use the stored image url, along with the caption, in order to make the actual post. 

In the first part, a request is sent to the AWS upload service on the backend with the user's image (formData). Upon sucessful upload to AWS S3 a JSON object is returned with the URL of the image in S3. This URL along wiht the other information from the state is then used to create the post, and redirect to that new post. 

```javascript
axios.post("/api/users/images/upload", formData)
        .then((url) => {
          that.props.sendPost({ imgUrl: url.data.imageUrl, likes: [], user: that.state.user, description: that.state.description })
            .then((id) => {
              that.props.picLoaded();
              that.props.history.push(`/posts/${id}`);
            });
        });
```

```javascript
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'instapic-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});
```

```javascript
router.post('/upload', function (req, res) {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: err.message }] });
    }
    return res.json({ 'imageUrl': req.file.location });
  });
});
```

#### Infinite scroll (note the scroll bar)

By combining a npm infinite scroll with a request to fetch more posts from the backend, the user is able to have a seamless experience while scrolling, without requesting all of the posts at once. 

![infi-scroll][infi-scroll]

Once the scrollpoint is hit, the request for additional posts is sent, and the posts added to the state for display. Sent with the request is the current user (decoded from JWT) and the number of posts that have already been shown (skipPosts). This allows for a query to find the users followers, and select from their posts, along with those posts comments, and users who commented on the post. Once the data is collected and formatted, it is sent back with the response.

```javascript
User.findOne({ _id: user.id })
    .then(user => {
      let following = user.following;
      following.push(user.id);
      Post.find({ user: { $in: following } }).sort([['date', -1]])
      .skip(parseInt(req.query.skipPosts))
      .limit(20)
        .then(posts => {
          posts.forEach(post => {
            postsObject[post._id] = post;
            userIds.push(post.user);
            for (let i = 0; i < post.likes.length; i++) {
              userIds.push(post.likes[i]);
            }
          });
          let postIds = Object.keys(postsObject);
          Comment.find({ post: { $in: postIds } })
            .then(comments => {
              comments.forEach(comment => {
                commentsObject[comment._id] = comment;
                userIds.push(comment.user);
              });
              User.find({ _id: { $in: userIds } })
                .then((users) => {
                  users.forEach(user => {
                    usersObject[user._id] = user;
                  });
                })
                .then(() => res.send({ posts: postsObject, comments: commentsObject, users: usersObject }))
            });
          });
    });
```