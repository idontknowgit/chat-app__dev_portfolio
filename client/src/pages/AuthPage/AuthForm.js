import React from "react";
import { useFormik } from "formik";
import isLength from "validator/es/lib/isLength";
import TextField from "../../components/TextField";
import Button from "../../components/Button";

const validate = (values) => {
  const { username, password } = values;
  const required_msg = "This field is required.";
  const errors = {};

  if (!username) {
    errors.username = required_msg;
  } else if (!isLength(username, { min: 3, max: 15 })) {
    errors.username = "Must be between 3 and 15 characters.";
  }

  if (!password) {
    errors.password = required_msg;
  } else if (!isLength(password, { min: 6 })) {
    errors.password = "Must be atleast 6 characters.";
  }

  return errors;
};

export default ({ isRegistering, login }) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: validate,
    onSubmit: login,
  });

  return (
    <form className="auth-form" onSubmit={formik.handleSubmit}>
      <header className="auth-form__header">
        {isRegistering ? "Sign up" : "Log in"}
      </header>
      <TextField
        id="username"
        label="username"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
        error={formik.errors.username}
      />
      <TextField
        id="password"
        type="password"
        label="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        error={formik.errors.password}
      />
      <Button type="submit">Continue</Button>
    </form>
  );
};
