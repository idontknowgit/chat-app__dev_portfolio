import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { authServices } from "../../services";
import withUserStore from "../../hoc/withUserStore";

export default withUserStore(
  observer(({ userStore }) => {
    const logout = () => {
      authServices.logout();
      userStore.setUser(null);
    };

    let navBtns;
    if (userStore.user) {
      navBtns = [
        <a key="log-out" className="navbar__btn" onClick={logout}>
          Log out
        </a>,
      ];
    } else {
      navBtns = [
        <Link to="/login" key="login" className="navbar__btn">
          Log in
        </Link>,
        <Link to="/signup" key="logout" className="navbar__btn">
          Sign up
        </Link>,
      ];
    }

    return (
      <header className="navbar">
        <div className="navbar__content container">
          <Link to="/" className="navbar__brand">
            Chat app
          </Link>
          <div className="navbar__btns">{navBtns}</div>
        </div>
      </header>
    );
  })
);
