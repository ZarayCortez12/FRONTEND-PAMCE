import { useFormik } from "formik";
import * as yup from "yup";
import InputField from "../components/InputField.jsx";
import "../styles/enviarCodigoStyle.css";
import image from "../images/logo_pamce.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarCodigo } from "../features/autenticacion.slice.js";
import { MdAttachEmail } from "react-icons/md";

const validarDatos = yup.object().shape({
  correo_electronico: yup
    .string()
    .email("Debe ingresar un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
});

function EnviarCorreo() {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PAMCE | Reestablecer Contraseña";
  }, []);

  const formik = useFormik({
    initialValues: {
      correo_electronico: "",
    },
    validationSchema: validarDatos,
    onSubmit: (values, { setSubmitting }) => {
      setFormSubmitted(true);
      if (Object.keys(formik.errors).length === 0) {
        dispatch(enviarCodigo(values.correo_electronico))
          .unwrap()
          .then((res) => {
            localStorage.setItem("correo_electronico", res.correo_electronico);
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            setTimeout(() => {
              navigate("/validar-codigo");
            }, 3500);
          })
          .catch((err) => {
            toast.error(err.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            if (err.status === 400) {
              setTimeout(() => {
                navigate("/validar-codigo");
              }, 4000);
            }
          })
          .finally(() => {
            setSubmitting(false);
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
        <h2 className="form-title">REESTABLECER CONTRASEÑA</h2>

        <p className="separator">
          <span>Ingresa el correo electrónico asociado a su cuenta</span>
        </p>
        <div className="login-inner">
          <div className="login-logo">
            <img src={image} alt="Logo Empresa" />
          </div>

          <div className="login-form-content">
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
                name="correo_electronico"
                placeholder="Correo Electrónico"
                icon={<MdAttachEmail />}
                value={formik.values.correo_electronico}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.correo_electronico}
                showError={formSubmitted}
              />
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2! px-4! rounded transition-colors disabled:bg-red-400 disabled:cursor-not-allowed h-11"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-5 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Enviar"
                  )}
                </button>

                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2! px-4! rounded transition-colors disabled:opacity-50 h-11"
                  onClick={() => navigate("/")}
                  disabled={formik.isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
            <br />
          </div>
        </div>
      </div>
      <ToastContainer className="toast-container" />
    </div>
  );
}

export default EnviarCorreo;
