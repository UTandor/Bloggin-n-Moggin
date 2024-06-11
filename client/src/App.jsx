import { useState, useEffect } from "react";
import BlogView from "./components/BlogView";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "./reducers/notificationReducer";

const App = () => {
  const [user, setUser] = useState(null);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
    setUser(null);
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
          <Login changeUser={setUser} />
        </div>
      ) : (
        <>
          <h2>Blogs</h2>
          <button onClick={handleLogout}>logout</button>

          <BlogView user={user} />
        </>
      )}
    </div>
  );
};

export default App;
