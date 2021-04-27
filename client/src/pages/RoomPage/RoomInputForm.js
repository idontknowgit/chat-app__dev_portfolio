import React, { useState } from "react";
import Button from "../../components/Button";

export default ({ sendMessage }) => {
  const [message, setMessage] = useState("");
  const handleChange = (e) => setMessage(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="room__input" onSubmit={handleSubmit}>
      <textarea
        onKeyDown={(e) => {
          if (e.which == 13) {
            handleSubmit(e);
          }
        }}
        placeholder="Enter your message..."
        value={message}
        onChange={handleChange}
      />
      <Button type="submit">Send</Button>
    </form>
  );
};
