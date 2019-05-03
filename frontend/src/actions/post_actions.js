import * as PostAPIUtil from './../util/post_api_util';

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
// export const RECEIVE_POST = 'RECEIVE_POST';

const receivePosts = posts => {
  return({
    type: RECEIVE_POSTS,
    posts
  });
};

// const receivePost = post => {
//   return({
//     type: RECEIVE_POST,
//     post
//   });
// };

export const fetchPosts = () => dispatch => {
  return PostAPIUtil.fetchPosts().then(res => {
    return dispatch(receivePosts(res.data.posts));
  });
};

