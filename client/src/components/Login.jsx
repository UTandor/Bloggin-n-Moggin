import React, { useState } from "react";
import loginService from "../services/login";

const Login = ({ changeUser, notify }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      changeUser(user);
      setUsername("");
      setPassword("");
      localStorage.setItem("user", JSON.stringify(user));
      notify({ message: "Logged user in successfully", variant: "success" });
    } catch (error) {
      if (error.response.status === 400) {
        notify({ message: "Incorrect username or password", variant: "error" });
      } else {
        notify({ message: "Internal server error", variant: "error" });
      }
    }
  };

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <h1>Login</h1>
      <input
        type="text"
        data-testid="username"
        value={username}
        placeholder="username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <input
        type="text"
        value={password}
        data-testid="password"
        placeholder="password"
        onChange={({ target }) => setPassword(target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
