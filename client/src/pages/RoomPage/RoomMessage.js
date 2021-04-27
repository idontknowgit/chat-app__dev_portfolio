import React from "react";

export default ({ messenger, message, timestamp, ...otherProps }) => {
  return (
    <div className="room__message-line" {...otherProps}>
      <span className="room__message-username">{messenger.username}: </span>
      <span className="room__message-text">{message}</span>
    </div>
  );
};
