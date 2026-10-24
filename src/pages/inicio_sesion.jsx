import { useFormik } from "formik";
import * as yup from "yup";
import InputField from "../components/InputField.jsx";
import { FaIdCard } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import "../styles/loginInicioSesion.css";
import image from "../images/logo_pamce.png";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  iniciarSesionUsuario,
  iniciarSesionGoogle,
  obtenerUsuarioActual,
} from "../features/autenticacion.slice.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebaseService.js";

const validarDatos = yup.object().shape({
  numero_documento: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("Debe ingresar un número de identificación"),
  clave: yup.string().required("Debe ingresar una contraseña"),
});

function Login() {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PAMCE | Iniciar Sesión";
  }, [dispatch, navigate]);

  const handleClickGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      dispatch(iniciarSesionGoogle({ token: idToken }))
        .unwrap()
        .then((res) => {
          toast.success(res.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
          localStorage.setItem("selectedMenuKey", "inicio");
          setTimeout(() => {
            dispatch(obtenerUsuarioActual())
              .unwrap()
              .then(() => {
                navigate(`/${res.usuario.rol_activo.nombre_rol}/inicio`);
              });
          }, 3500);
        })
        .catch((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      numero_documento: "",
      clave: "",
    },
    validationSchema: validarDatos,
    onSubmit: (values) => {
      setFormSubmitted(true);
      if (!values.numero_documento && !values.clave) {
        toast.error("Debe ingresar las credenciales", {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (Object.keys(formik.errors).length === 0) {
        dispatch(iniciarSesionUsuario(values))
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            localStorage.setItem("selectedMenuKey", "inicio");
            setTimeout(() => {
              dispatch(obtenerUsuarioActual())
                .unwrap()
                .then(() => {
                  navigate(`/${res.usuario.rol_activo.nombre_rol}/inicio`);
                });
            }, 3500);
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-inner">
          <div className="login-logo">
            <img src={image} alt="Logo Empresa" />
          </div>

          <div className="vertical-divider"></div>

          <div className="login-form-content">
            <h2 className="form-title">INICIAR SESIÓN</h2>

            <p className="separator">
              <span>Ingresa las credenciales</span>
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
                type="text"
                name="numero_documento"
                placeholder="Número de Documento"
                icon={<FaIdCard />}
                value={formik.values.numero_documento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.numero_documento}
                showError={formSubmitted}
              />

              <InputField
                type="password"
                name="clave"
                placeholder="Contraseña"
                icon={<GrSecure />}
                value={formik.values.clave}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.clave}
                showError={formSubmitted}
              />

              <button type="submit" className="login-button">
                Iniciar Sesión
              </button>
            </form>
            <p className="separator">
              <span>O ingresa con</span>
            </p>
            <button
              type="button"
              className="google-button"
              onClick={() => handleClickGoogleSignIn()}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="google-icon"
              />
              Iniciar con Google
            </button>
            <br />
            <Link to="/enviar-correo" className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer className="toast-container" />
    </div>
  );
}

export default Login;
