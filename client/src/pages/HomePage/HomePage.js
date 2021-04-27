import React from "react";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { roomServices } from "../../services";
import Button from "../../components/Button";
import withUserStore from "../../hoc/withUserStore";

export default withUserStore(
  observer(({ userStore }) => {
    const history = useHistory();
    const createRoom = async () => {
      if (userStore.user) {
        try {
          let roomId = await roomServices.create();
          history.push(`/room/${roomId}`);
        } catch (err) {}
      } else {
        history.push("/login");
      }
    };
    return (
      <div>
        <Button onClick={createRoom}>Create room</Button>
      </div>
    );
  })
);
