import { useSessionWatcher } from "../utils/useSessionWatcher";
import ExpireModal from "../components/ExpireModal";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { obtenerUsuarioActual } from "../features/autenticacion.slice";
import { obtenerEdicionEnProceso } from "../features/ediciones/edicion.slice";
import LoadingComponent from "@/components/LoadingComponent";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { usuario, isLoading } = useSelector((state) => state.autenticacion);
  const edicion_en_proceso = useSelector(
    (state) => state.ediciones.edicion_en_proceso,
  );
  const [redirectHome, setRedirectHome] = useState(false);
  const { showModal, handleConfirm, handleCancel } = useSessionWatcher();

  useEffect(() => {
    if (!edicion_en_proceso) {
      dispatch(obtenerEdicionEnProceso());
    }

    if (!usuario) {
      dispatch(obtenerUsuarioActual())
        .unwrap()
        .catch((err) => {
          setRedirectHome(true);
        });
    }
  }, []);

  if (redirectHome) {
    return <Navigate to="/inicio_sesion" replace />;
  }

  if (isLoading || usuario === null) {
    return <LoadingComponent mensaje="Cargando Información..." />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol_activo.nombre_rol)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
      {showModal && (
        <ExpireModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
};

export default PrivateRoute;
