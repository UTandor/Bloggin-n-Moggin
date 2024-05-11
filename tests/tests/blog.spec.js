const { test, expect, beforeEach, describe } = require("@playwright/test");

beforeEach(async ({ page, request }) => {
  await request.post("http://localhost:3003/api/users", {
    data: { name: "user", username: "user", password: "jaja" },
  });
  await page.goto("http://localhost:5173");
});

describe("Blog app", () => {
  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByRole("heading", { name: "Login" });
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("user");
      await page.getByTestId("password").fill("jaja");
      await page.getByRole("button", { name: "Login" }).click();

      const notification = await page.locator(".success");
      expect(notification).toBeDefined();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("user");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "Login" }).click();

      const notification = await page.locator(".error");
      expect(notification).toBeDefined();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("user");
      await page.getByTestId("password").fill("jaja");
      await page.getByRole("button", { name: "Login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "New Blog" }).click();

      await page.getByTestId("title").fill("Test blog");
      await page.getByTestId("url").fill("blog.com");
      await page.getByRole("button", { name: "create" }).click();

      expect(page.getByText("Test Blog")).toBeDefined();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "New Blog" }).click();
      await page.getByTestId("title").fill("Good Blog");
      await page.getByTestId("url").fill("blog.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "View" }).first().click();
      await page.getByRole("button", { name: "like", exact: true }).click();
      expect(
        page.getByText('Blog "Good Blog" liked successfully ')
      ).toBeDefined();
    });

    test("creator of blog sees delete button", async ({ page }) => {
      await page.getByRole("button", { name: "New Blog" }).click();

      await page.getByTestId("title").fill("Test blog");
      await page.getByTestId("url").fill("blog.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByText("View").last().click();
      expect(page.getByText("delete")).toBeDefined();
    });

    test("creator of blog sees delete button", async ({ page }) => {
      await page.getByRole("button", { name: "New Blog" }).click();

      await page.getByTestId("title").fill("Test blog");
      await page.getByTestId("url").fill("blog.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByText("View").last().click();
      await page.getByRole("button", { name: "delete" }).click()
      
    });
  });
});
