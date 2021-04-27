import { makeObservable, observable, action } from "mobx";

class UserStore {
  user = null;

  constructor() {
    makeObservable(this, { user: observable, setUser: action });
  }

  setUser(user) {
    this.user = user;
  }
}

export default new UserStore();
