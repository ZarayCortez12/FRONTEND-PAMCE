import { useState } from "react";
import "../styles/loginInicioSesion.css";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const InputField = ({
  type,
  placeholder,
  icon,
  value,
  onChange,
  onBlur,
  name,
  error,
  showError,
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type !== "password" && type !== "text") {
      inputValue = inputValue.replace(/\D/g, "");
      if (inputValue.length > 10) return; // Restringe a 10 dígitos

      if (inputValue.length < 6 && inputValue.length > 0) {
        setErrorMessage("El documento debe tener al menos 6 dígitos");
      } else {
        setErrorMessage("");
      }

    }

    onChange({
      target: {
        name,
        value: inputValue,
      },
    });
  };

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? "text" : type}
        name={name}
        placeholder={placeholder}
        className="input-field"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
      />

      <i className="material-symbols-rounded">{icon}</i>
      {type === "password" && (
        <i
          onClick={() => setIsPasswordShown((prevState) => !prevState)}
          className="material-symbols-rounded eye-icon"
        >
          {isPasswordShown ? <IoMdEyeOff /> : <IoMdEye />}
        </i>
      )}
      {(showError && error) || errorMessage ? (
        <p className="error-message">{errorMessage || error}</p>
      ) : null}
    </div>
  );
};

export default InputField;
