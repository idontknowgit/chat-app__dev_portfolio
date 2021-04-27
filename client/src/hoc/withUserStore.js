import React from "react";
import { userStore } from "../store";

export default (Component) => (props) => (
  <Component userStore={userStore} {...props} />
);
