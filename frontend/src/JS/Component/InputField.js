// InputField.js
import React from "react";
import '../../CSS/InputField.css'
import '../../CSS/KeyColor.css'

const InputField = ({ label, type, value, onChange, placeHolder }) => {
  return (
    <div className="input-wrapper">
      <label className="input-field">
        <div>{label}</div>
        <input type={type} value={value} onChange={onChange} required placeholder={placeHolder} />
      </label>
    </div>
  );
};

export default InputField;
