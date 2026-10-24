import "../styles/enviarCodigoStyle.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarCodigo, validarCodigo } from "../features/autenticacion.slice";

function ValidarCodigo() {
  const correo_electronico = localStorage.getItem("correo_electronico");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    document.title = "PAMCE | Reestablecer Contraseña";
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const codigo = otp.join("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codigo.length === 6) {
      dispatch(validarCodigo({ codigo, correo_electronico }))
        .unwrap()
        .then((res) => {
          toast.success(res.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });

          setOtp(new Array(6).fill(""));
          setTimeout(() => {
            navigate("/nueva-contrasena", {
              state: { token_cambio: res.token, correo: correo_electronico },
            });
          }, 2200);
        })
        .catch((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
          setOtp(new Array(6).fill(""));
        });
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;

    dispatch(enviarCodigo(correo_electronico))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        setResendTimer(180);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="form-title">REESTABLECER CONTRASEÑA</h2>
        <span>
          <center>Hemos enviado un código de reestablecimiento a</center>
        </span>
        <p className="separator">
          <span>{correo_electronico}</span>
        </p>
        <span className="mb-6">
          <center>
            Ingrese el código para continuar con el proceso de
            reestablecimiento.
            <br />
            No comparta su código con nadie
          </center>
        </span>
        <br />
        <div className="login-form-content-code">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6 sm:gap-8 content-otp-group">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="
        w-16 h-20 sm:w-20 sm:h-24 
        text-center text-2xl sm:text-3xl font-bold
        border-2 border-red-500 rounded-lg
        focus:outline-none focus:ring-4 focus:ring-red-200
      "
                />
              ))}
            </div>

            <div className="button-group">
              <button
                type="submit"
                className={`login-button ${
                  codigo.length !== 6
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700"
                }`}
                disabled={codigo.length !== 6}
              >
                Validar
              </button>
            </div>
            <br />
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No recibiste el código? o ¿Ya expiró?{" "}
            <span
              onClick={handleResend}
              className={`${
                resendTimer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-600 cursor-pointer hover:underline"
              } font-semibold`}
            >
              {resendTimer > 0
                ? `Reintenta en ${resendTimer}s`
                : "Volver a Enviar"}
            </span>
          </p>
        </div>
      </div>
      <ToastContainer className="toast-container" />
    </div>
  );
}

export default ValidarCodigo;
