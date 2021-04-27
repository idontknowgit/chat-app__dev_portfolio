import React from "react";
import { Redirect, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import withUserStore from "../hoc/withUserStore";

export default withUserStore(
  observer(({ userStore, guestOnly, ...routeProps }) => {
    const user = userStore.user;
    if (guestOnly && user) {
      return <Redirect to="/" />;
    }

    if (!guestOnly && !user) {
      return <Redirect to="/login" />;
    }

    return <Route {...routeProps} />;
  })
);
