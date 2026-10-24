import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refrescarAccesToken } from "../features/autenticacion.slice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/autenticacion.slice";
import { toast } from "react-toastify";

export const useSessionWatcher = (token) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { usuario, expiresAt } = useSelector((state) => state.autenticacion);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const timeLeft = expiresAt - Date.now();

    if (timeLeft <= 0) {
      navigate("/");
      return;
    }

    const warningTime = timeLeft - 3 * 60_000;

    let warningTimer;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        setShowModal(true);
      }, warningTime);
    } else {
      setShowModal(true);
    }

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [expiresAt, navigate]);

  const handleConfirm = async () => {
    try {
      await dispatch(
        refrescarAccesToken({
          id_rol: usuario.rol_activo.id_rol,
        }),
      ).unwrap();

      setShowModal(false);
    } catch (error) {
      console.error("Error refrescando token:", error);
      navigate("/");
    }
  };

  const handleCancel = () => {
    dispatch(logout())
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });

        setShowModal(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error("Error al cerrar sesión");
      });
  };

  return { showModal, handleConfirm, handleCancel };
};
