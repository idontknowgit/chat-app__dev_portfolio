import React from "react";
import { authServices } from "../../services";
import { userStore } from "../../store";
import AuthForm from "./AuthForm";

class AuthPage extends React.Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  async login(credentials) {
    try {
      const user = await authServices.login(
        credentials,
        this.props.isRegistering
      );
      userStore.setUser(user);
    } catch (err) {}
  }

  render() {
    return (
      <div className="auth_page">
        <AuthForm isRegistering={this.props.isRegistering} login={this.login} />
      </div>
    );
  }
}

export default AuthPage;
