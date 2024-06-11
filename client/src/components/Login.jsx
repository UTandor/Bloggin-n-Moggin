import { notify } from "../reducers/notificationReducer";
import { setUser } from "../reducers/userReducer";
import loginService from "../services/login";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(e.target.password.value)
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      dispatch(setUser(user));
      username = "";
      password = "";
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(
        notify({ message: "Logged user in successfully", variant: "success" })
      );
    } catch (error) {
      if (error.response.status === 400) {
        dispatch(
          notify({
            message: "Incorrect username or password",
            variant: "error",
          })
        );
      } else {
        dispatch(
          notify({ message: "Internal server error", variant: "error" })
        );
      }
    }
  };

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <h1>Login</h1>
      <input
        type="text"
        data-testid="username"
        placeholder="username"
        name="username"
      />
      <input
        type="text"
        data-testid="password"
        placeholder="password"
        name="password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
