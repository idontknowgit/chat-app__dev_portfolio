import React from "react";
import { observer } from "mobx-react-lite";
import Notification from "./Notification";

export default observer(({ requestStatusStore }) =>
  requestStatusStore.error ? (
    <Notification
      type="error"
      message={requestStatusStore.error.message}
      onClose={requestStatusStore.clearError}
    />
  ) : null
);
