import { useState } from "react";
import blogService from "../services/blogs";

const BlogCreator = ({ handleCreate }) => {
  const [blog, setBlog] = useState({ title: "", url: "" });

  const addBlog = (e) => {
    e.preventDefault();
    handleCreate(blog);
    setBlog({ url: "", title: "" });
  };

  return (
    <>
      <h2>Create</h2>
      <form onSubmit={(e) => addBlog(e)}>
        title:
        <input
          type="text"
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          value={blog.title}
          role="textbox"
          data-testid="title"
        />
        url:
        <input
          type="text"
          onChange={(e) => setBlog({ ...blog, url: e.target.value })}
          value={blog.url}
          role="url"
          data-testid="url"

        />
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogCreator;
