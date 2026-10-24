import { useFormik } from "formik";
import * as yup from "yup";
import InputField from "../components/InputField.jsx";
import { GrSecure } from "react-icons/gr";
import "../styles/loginInicioSesion.css";
import image from "../images/logo_pamce.png";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  crearContrasenaUsuario,
  reenviarTokenCrearContrasena,
} from "../features/autenticacion.slice.js";
import { IoMdAlert } from "react-icons/io";

const validarDatos = yup.object().shape({
  nueva_clave: yup
    .string()
    .required("Debe ingresar una contraseña")
    .min(8, "La contraseña debe tener mínimo 8 caracteres")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).*$/,
      "Debe incluir al menos una mayúscula, un número y un carácter especial"
    ),
  confirmacion_clave: yup
    .string()
    .required("Debe ingresar una contraseña")
    .oneOf([yup.ref("nueva_clave"), null], "Las contraseñas no coinciden"),
});

function CrearContraseñaUsuario() {
  const token_creacion = useParams().token;
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);
  const location = useLocation();
  const token = location.state?.token_cambio;
  const correo = location.state?.correo;

  useEffect(() => {
    document.title = "PAMCE | Crear Contraseña";
  }, []);

  const formik = useFormik({
    initialValues: {
      nueva_clave: "",
      confirmacion_clave: "",
    },
    validationSchema: validarDatos,
    onSubmit: (values) => {
      setFormSubmitted(true);
      if (values.nueva_clave !== values.confirmacion_clave) {
        toast.error("Las contraseñas no coinciden", {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      if (Object.keys(formik.errors).length === 0) {
        dispatch(
          crearContrasenaUsuario({
            token: token_creacion,
            clave: values.nueva_clave,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            formik.resetForm();
            setTimeout(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("correo");
              navigate("/");
            }, 3000);
          })
          .catch((err) => {
            toast.error(err.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          });
      }
    },
  });

  useEffect(() => {
    if (formSubmitted && Object.keys(formik.errors).length > 0) {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formik.errors, formSubmitted]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    dispatch(reenviarTokenCrearContrasena({ token: token_creacion }))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
        });
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-inner">
          <div className="login-logo">
            <img src={image} alt="Logo Empresa" />
          </div>

          <div className="vertical-divider"></div>

          <div className="login-form-content">
            <h2 className="form-title">CREAR CONTRASEÑA</h2>

            <p className="separator">
              <span>Ingresa la contraseña</span>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
                formik.handleSubmit(e);
              }}
              className="login-form"
            >
              <InputField
                type="password"
                name="nueva_clave"
                placeholder="Contraseña"
                icon={<GrSecure />}
                value={formik.values.nueva_clave}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.nueva_clave}
                showError={formSubmitted}
              />

              <p className="separator">
                <span>Confirma la contraseña</span>
              </p>

              <InputField
                type="password"
                name="confirmacion_clave"
                placeholder="Confirma la contraseña"
                icon={<GrSecure />}
                value={formik.values.confirmacion_clave}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.confirmacion_clave}
                showError={formSubmitted}
              />

              <button type="submit" className="login-button">
                Guardar
              </button>
            </form>
            <span className="content-mensaje-clave">
              <IoMdAlert className="text-red-500 logo-content-mensaje" />
              <p className="mensaje-alert">
                <center>
                  Recuerda que la contraseña debe de contener por lo menos una
                  letra mayúscula, un número y un cáracter especial
                </center>
              </p>
            </span>
            <br />
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Se vencio el token?{" "}
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
      </div>
      <ToastContainer className="toast-container" />
    </div>
  );
}

export default CrearContraseñaUsuario;
