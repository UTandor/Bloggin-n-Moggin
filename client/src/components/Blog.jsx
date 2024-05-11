import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [viewBlog, setViewBlog] = useState(false);

  return (
    <div>
      <div className="card blog">
        <div className="blog-title">{blog.title}</div>
        <button onClick={() => setViewBlog(!viewBlog)}>
          {viewBlog ? "Hide" : "View"}
        </button>
        {viewBlog === true && (
          <div>
            <p className="blog-url">{blog.url}</p>
            <p className="blog-author">{blog.author}</p>
            <p>likes: {blog.likes}</p>
            <button onClick={() => handleLike(blog)}>like</button>
            <button onClick={() => handleDelete(blog)}>delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
