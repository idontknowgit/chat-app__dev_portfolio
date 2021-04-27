import React from "react";
import classNames from "classnames";

export default ({ children, className, ...buttonProps }) => {
  return (
    <button className={classNames("btn", className)} {...buttonProps}>
      {children}
    </button>
  );
};
