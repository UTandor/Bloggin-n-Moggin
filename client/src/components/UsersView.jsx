import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";

const UsersView = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await blogService.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div>
      <h1>Users</h1>
      <div>
        <ul>
          {users.length > 0 &&
            users.map((user, id) => (
              <li key={id}>
                <Link to={`/users/${user.id}`}>
                  {user.name} <br />
                </Link>
                <span>blogs created: {user.blogs.length} </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersView;
