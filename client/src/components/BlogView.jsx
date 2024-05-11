import { useEffect, useState } from "react";
import Blog from "./Blog";
import BlogCreator from "./BlogCreator";
import blogService from "../services/blogs";

const BlogView = ({ blogs, changeBlogs, user, notify }) => {
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [sortType, setSortType] = useState("most");

  const hideWhenVisible = { display: creatorVisible ? "none" : "" };
  const showWhenVisible = { display: creatorVisible ? "" : "none" };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    let sortedBlogs = blogs;
    if (sortType === "most") {
      sortedBlogs = blogs.sort((a, b) => a.likes - b.likes);
    } else {
      sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
    }
    changeBlogs(sortedBlogs);
  }, [sortType]);

  const getBlogs = () => {
    blogService.getAll().then((blogs) => {
      changeBlogs(blogs);
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
      console.log(blogToCreate)
      blogService.create(blogToCreate);
      setBlog({ url: "", title: "" });
      notify({ message: "Blog created successfully", variant: "success" });
      getBlogs();
      setCreatorVisible(false);
    } else {
      notify({ message: "Please fill the entire form", variant: "error" });
    }
  };

  const handleLike = async (blog) => {
    await blogService.like(blog);
    notify({
      message: `Blog "${blog.title}" liked successfully`,
      variant: "success",
    });
    getBlogs();
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author} `)) {
      await blogService.deleteBlog(blog.id);
      getBlogs();
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
      {sortType === "most" ? (
        <button onClick={() => setSortType("least")}>
          Sort By Least Likes
        </button>
      ) : (
        <button onClick={() => setSortType("most")}>Sort By Most Likes</button>
      )}
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
