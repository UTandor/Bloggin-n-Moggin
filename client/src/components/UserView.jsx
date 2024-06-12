import { useParams } from "react-router-dom";
import blogService from "../services/blogs";
import { useEffect } from "react";
import { useState } from "react";

const UserView = () => {
  const id = useParams().id;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await blogService.getUsers();
      const user = response.data.find((user) => user.id === id);
      console.log(user)
      setUser(user);
    };

    fetchUsers();
  }, []);
  return (
    <div>
      {user && (
        <div>
          <h1>{user.name}</h1>
          <ul>
            {user.blogs.map((blog) => (
              <li>{blog.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserView;
