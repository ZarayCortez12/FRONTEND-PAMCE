import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { obtenerUsuarioActual } from "../features/autenticacion.slice";
import LoadingComponent from "@/components/LoadingComponent";

const PublicRoute = () => {
  const dispatch = useDispatch();

  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    let componenteActivo = true;

    const verificarSesion = async () => {
      try {
        const usuario = await dispatch(obtenerUsuarioActual()).unwrap();

        if (componenteActivo) {
          setUsuarioActivo(usuario.usuario);
        }
      } catch (error) {
        if (componenteActivo) {
          setUsuarioActivo(null);
        }
      } finally {
        if (componenteActivo) {
          setVerificandoSesion(false);
        }
      }
    };

    verificarSesion();

    return () => {
      componenteActivo = false;
    };
  }, [dispatch]);

  if (verificandoSesion) {
    return <LoadingComponent mensaje="Verificando sesión..." />;
  }

  if (usuarioActivo) {
    const rol = usuarioActivo.rol_activo?.nombre_rol;

    if (rol) {
      return <Navigate to={`/${rol}/inicio`} replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
