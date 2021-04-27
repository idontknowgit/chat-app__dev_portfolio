import React from "react";

export default ({ type, message, onClose }) => {
  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__icon"></div>
      <div className="notification__message">{message}</div>
      <div className="notification__close" onClick={onClose}>
        &times;
      </div>
    </div>
  );
};
