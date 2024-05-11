import axios from "axios";
const baseBlogUrl = "http://localhost:3003/api/blogs";
const baseUserUrl = "http://localhost:3003/api/users";

const getAll = () => {
  const request = axios.get(baseBlogUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const token = JSON.parse(localStorage.getItem("user")).token;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.post(baseBlogUrl, newObject, config);
  return response.data;
};

const getUser = async (username) => {
  const response = await axios.get(`${baseUserUrl}/${username}`);
  return response.data;
};

const like = async (blog) => {
  const blogToUpdate = {
    user: blog.user,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url,
  };

  const response = await axios.put(`${baseBlogUrl}/${blog.id}`, blogToUpdate);
  return response.data;
};

const deleteBlog = async (id) => {
  const token = JSON.parse(localStorage.getItem("user")).token;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  await axios.delete(`${baseBlogUrl}/${id}`, config);
};

export default { getAll, getUser, create, like, deleteBlog };
