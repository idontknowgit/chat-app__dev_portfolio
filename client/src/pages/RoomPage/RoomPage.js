import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useHistory } from "react-router-dom";
import getSocket from "../../socket";
import RoomMessage from "./RoomMessage";
import RoomInputForm from "./RoomInputForm";
import { requestStatusStore } from "../../store";
import Button from "../../components/Button";

const cleanup = (roomId) => () => {
  const socket = getSocket();
  const events = [
    "room_not_found",
    "room",
    "joined_room",
    "left_room",
    "message",
  ];
  events.forEach((k) => socket.removeAllListeners(k));
  socket.emit("leave", { room_id: roomId });
};

export default observer(({ userStore }) => {
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [isRoomLoaded, setRoomLoaded] = useState(false);
  const { roomId } = useParams();
  const history = useHistory();
  const chatRoomRef = useRef(null);

  const scrollToBottom = () => {
    let chatRoomEl = chatRoomRef.current;
    chatRoomEl.scrollTop = chatRoomEl.scrollHeight;
  };

  const onRoom = (room) => {
    setUsers(room.users);
    setMessages(room.messages);
    setRoomLoaded(true);
    requestStatusStore.requestFinished();
    scrollToBottom();
  };
  const onRoomNotFound = () => {
    history.push("/");
    requestStatusStore.requestFinished();
    requestStatusStore.setError({ message: "Room does not exist." });
  };

  const onJoinedRoom = (user) => {
    setUsers((users) => {
      users = { ...users };
      users[user.sid] = user;
      return users;
    });
  };

  const onMessage = (message) => {
    let chatRoomEl = chatRoomRef.current;
    let shouldScroll =
      chatRoomEl.scrollTop + chatRoomEl.clientHeight ===
      chatRoomEl.scrollHeight;
    setMessages((messages) => [...messages, message]);

    if (shouldScroll) {
      scrollToBottom(chatRoomEl);
    }
  };
  const onLeftRoom = (user) => {
    setUsers((users) => {
      users = { ...users };
      delete users[user.sid];
      return users;
    });
  };
  const sendMessage = (message) => {
    getSocket().emit("message", { room_id: roomId, message: message });
  };

  const copyURL = async () => {
    await window.navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    const socket = getSocket();
    requestStatusStore.requestStarted();
    socket.on("room_not_found", onRoomNotFound);
    socket.on("room", onRoom);
    socket.on("joined_room", onJoinedRoom);
    socket.on("left_room", onLeftRoom);
    socket.on("message", onMessage);
    socket.emit("join", { room_id: roomId });

    return cleanup(roomId);
  }, []);

  if (!isRoomLoaded) {
    return null;
  }

  return (
    <div className="room-page">
      <div className="room">
        <div className="room__chat" ref={chatRoomRef}>
          <header className="room__section-name">chat</header>
          {messages.map((message) => (
            <RoomMessage
              messenger={message.messenger}
              message={message.message}
              key={message.id}
            />
          ))}
        </div>
        <div className="room__users">
          <header className="room__section-name">users</header>
          {Object.values(users).map((user) => (
            <div key={user.sid}>{user.username}</div>
          ))}
        </div>
        <RoomInputForm sendMessage={sendMessage} />
      </div>
      <footer>
        <Button style={{ width: "100%" }} onClick={copyURL}>
          copy url
        </Button>
      </footer>
    </div>
  );
});
