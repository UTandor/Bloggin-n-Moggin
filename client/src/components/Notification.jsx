const Notification = ({ message, variant }) => {
  return (
    <div
      className={`notification ${
        variant === "error" ? "error" : "success"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
