import { useSelector } from "react-redux";

const Notification = ({}) => {
  const notification = useSelector((state) => state.notification);
  return (
    <div
      className={`notification ${
        notification.variant === "error" ? "error" : "success"
      }`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
