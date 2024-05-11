import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogCreator from "./BlogCreator";

test("renders content", () => {
  const blog = {
    title: "Blog",
    author: "jaja",
    url: "jaja.com",
    likes: 0,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Blog");

  expect(element).toBeDefined();
});

test("renders likes after view is clicked", async () => {
  const blog = {
    title: "Blog",
    author: "jaja",
    url: "jaja.com",
    likes: 0,
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);
  const element = screen.getByText("jaja");

  expect(element).toBeDefined();
});

test("like button called twice", async () => {
  const blog = {
    title: "Blog",
    author: "jaja",
    url: "jaja.com",
    likes: 0,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("View");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("<BlogCreator /> updates parent state and calls onSubmit", async () => {
  const handleCreate = vi.fn();
  const user = userEvent.setup();

  render(<BlogCreator handleCreate={handleCreate} />);

  const titleInput = screen.getByRole("textbox");
  const urlInput = screen.getByRole("url");
  const sendButton = screen.getByText("create");

  await user.type(titleInput, "blog title");
  await user.type(urlInput, "blog.com");
  await user.click(sendButton);

  expect(handleCreate.mock.calls).toHaveLength(1);
  expect(handleCreate.mock.calls[0][0].title).toBe("blog title");
});
