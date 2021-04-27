import React from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import AuthRoute from "./components/AuthRoute";
import Navbar from "./components/Navbar";
import { userStore, requestStatusStore } from "./store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { authServices } from "./services";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import RoomPage from "./pages/RoomPage";

class App extends React.Component {
  state = {
    isReady: false,
  };

  async componentDidMount() {
    try {
      const user = await authServices.refresh();
      userStore.setUser(user);
    } catch (err) {}

    this.setState({ isReady: true });
  }

  render() {
    if (this.state.isReady) {
      return (
        <Router>
          <div className="app-wrapper">
            <div id="error-container">
              <Error requestStatusStore={requestStatusStore} />
            </div>
            <div id="loader-container" className="centered-wrapper">
              <Loader requestStatusStore={requestStatusStore} />
            </div>
            <Navbar />
            <main className="container">
              <div className="centered-wrapper">
                <Switch>
                  <AuthRoute guestOnly path="/login" component={AuthPage} />
                  <AuthRoute
                    guestOnly
                    path="/signup"
                    children={<AuthPage isRegistering />}
                  />
                  <AuthRoute path="/room/:roomId" component={RoomPage} />
                  <Route path="/" component={HomePage} />
                </Switch>
              </div>
            </main>
          </div>
        </Router>
      );
    }
    return null;
  }
}

export default App;
