import React from "react";
import { observer } from "mobx-react-lite";

export default observer(({ requestStatusStore }) =>
  requestStatusStore.isRequestPending ? (
    <div className="loader centered-wrapper">
      <div className="loader__content">
        <div class="loader__dot"></div>
        <div class="loader__dot"></div>
        <div class="loader__dot"></div>
        <div class="loader__dot"></div>
        <div class="loader__dot"></div>
      </div>
    </div>
  ) : null
);
