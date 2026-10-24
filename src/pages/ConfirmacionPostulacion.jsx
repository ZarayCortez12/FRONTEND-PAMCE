import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ConfirmacionPostulacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const { nombreEdicion } = location.state || {};

  useEffect(() => {
    document.title = "PAMCE | Confirmación Participación";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg px-10! py-8! max-w-md text-center">
        <CheckCircleOutlined className="text-green-500! text-6xl mb-4!" />

        <h1 className="text-2xl font-bold font-montserrat mb-2!">
          ¡Postulación enviada!
        </h1>

        <p className="text-gray-600 font-inter mb-4!">
          Tu postulación a la{" "}
          <strong>{capitalizeFirstLetter(nombreEdicion)}</strong> ha sido
          correctamente registrada.
        </p>

        <p className="text-gray-500 text-sm font-inter mb-6!">
          Te agradecemos por participar. Mantente pendiente de tu correo
          electrónico, allí recibirás información adicional sobre el proceso.
        </p>

        <Button
          type="primary"
          className="bg-red-600! hover:bg-red-400! font-poppins"
          onClick={() => navigate("/")}
        >
          Ir al inicio
        </Button>
      </div>
    </div>
  );
}

export default ConfirmacionPostulacion;
