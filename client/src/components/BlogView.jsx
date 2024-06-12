import { useEffect, useState } from "react";
import Blog from "./Blog";
import BlogCreator from "./BlogCreator";
import blogService from "../services/blogs";
import { addBlog, removeBlog, setBlogs } from "../reducers/blogReducer";
import { useSelector, useDispatch } from "react-redux";
import { notify } from "../reducers/notificationReducer";

const BlogView = () => {
  const [creatorVisible, setCreatorVisible] = useState(false);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const hideWhenVisible = { display: creatorVisible ? "none" : "" };
  const showWhenVisible = { display: creatorVisible ? "" : "none" };

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    await blogService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs));
    });
  };

  const handleCreate = async (blog) => {
    if (blog.title && blog.url) {
      const creator = await blogService.getUser(user.username);
      const blogToCreate = {
        title: blog.title,
        author: creator.username,
        url: blog.url,
        user: creator.id,
      };
      const createdBlog = await blogService.create(blogToCreate);
      dispatch(addBlog(createdBlog));
      dispatch(
        notify({ message: "Blog created successfully", variant: "success" })
      );
      setCreatorVisible(false);
    } else {
      dispatch(
        notify({ message: "Please fill the entire form", variant: "error" })
      );
    }
  };

  const handleLike = async (blog) => {
    await blogService.like(blog);
    dispatch(
      notify({
        message: `Blog "${blog.title}" liked successfully`,
        variant: "success",
      })
    );
    getBlogs();
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author} `)) {
      await blogService.deleteBlog(blog.id);
      dispatch(removeBlog(blog.id));
    }
  };

  return (
    <div>
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreatorVisible(true)}>New Blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogCreator handleCreate={handleCreate} />
          <button onClick={() => setCreatorVisible(false)}>cancel</button>
        </div>
      </div>
      <div className="grid-container">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogView;
