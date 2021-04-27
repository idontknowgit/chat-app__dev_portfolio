import { makeObservable, observable, action } from "mobx";

class RequestStatusStore {
  error = null;
  statusCode = null;
  isRequestPending = false;

  constructor() {
    makeObservable(this, {
      error: observable,
      statusCode: observable,
      isRequestPending: observable,
      setError: action,
      clearError: action,
      requestStarted: action,
      requestFinished: action,
    });
  }

  setError = (error) => {
    this.error = error;
  };

  clearError = () => {
    this.error = null;
  };

  requestStarted = () => {
    this.clearError();
    this.isRequestPending = true;
  };

  requestFinished = () => {
    this.isRequestPending = false;
  };
}

export default new RequestStatusStore();
