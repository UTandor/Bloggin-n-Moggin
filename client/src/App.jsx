import { useEffect } from "react";
import BlogView from "./components/BlogView";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { notify, removeNotification } from "./reducers/notificationReducer";
import { removeUser, setUser } from "./reducers/userReducer";

const App = () => {
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (notification === null) {
        return;
      } else {
        dispatch(removeNotification());
      }
    }, 2000);
  }, [notification]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(removeUser());
    dispatch(
      notify({
        message: "Logged user out successfully",
        variant: "success",
      })
    );
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          variant={notification.variant}
        />
      )}
      {user === null ? (
        <div>
          <Login />
        </div>
      ) : (
        <>
          <h2>Blogs</h2>
          <button onClick={handleLogout}>logout</button>

          <BlogView />
        </>
      )}
    </div>
  );
};

export default App;
