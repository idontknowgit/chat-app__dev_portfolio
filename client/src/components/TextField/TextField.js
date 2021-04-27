import React, { useState } from "react";
import classNames from "classnames";

export default ({
  id,
  label,
  error,
  forceShowError,
  className,
  ...inputProps
}) => {
  const [isTouched, setTouched] = useState(false);
  const onFocus = (e) => {
    !isTouched && setTouched(true);
    inputProps.onFocus && inputProps.onFocus(e);
  };
  return (
    <div className={classNames("text-field", className)}>
      <div className="text-field__field">
        <label className="text-field__label" htmlFor={id}>
          {label}
        </label>
        <input
          className="text-field__input"
          id={id}
          name={id}
          type="text"
          {...inputProps}
          onFocus={onFocus}
        />
      </div>
      {(isTouched || forceShowError) && error && (
        <div className="text-field__error">{error}</div>
      )}
    </div>
  );
};
