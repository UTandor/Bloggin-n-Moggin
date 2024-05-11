import { useState, useEffect } from "react";
import BlogView from "./components/BlogView";
import Login from "./components/Login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);


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
        setNotification(null);
      }
    }, 2000);
  }, [notification]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setNotification({
      message: "Logged user out successfully",
      variant: "success",
    });
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
            <Login changeUser={setUser} notify={setNotification} />
        </div>
      ) : (
        <>
          <h2>Blogs</h2>
          <button onClick={handleLogout}>logout</button>

          <BlogView
            changeBlogs={setBlogs}
            blogs={blogs}
            user={user}
            notify={setNotification}
          />
        </>
      )}
    </div>
  );
};

export default App;
