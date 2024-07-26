// InputField.js
import React from "react";
import '../../CSS/InputField.css'
import '../../CSS/KeyColor.css'

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="input-wrapper">
      <label className="input-field">
        <div>{label}</div>
        <input type={type} value={value} onChange={onChange} required />
      </label>
    </div>
  );
};

export default InputField;
