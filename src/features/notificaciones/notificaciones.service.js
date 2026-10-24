import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarNotificacionesSinLeer = async (id_usuario, id_rol) => {
  try {
    const response = await axios.get(
      `${base_url}/notificaciones/sin-leer/${id_usuario}`,
      {
        params: { id_rol },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarNotificaciones = async (id_usuario, params) => {
  try {
    const response = await axios.get(
      `${base_url}/notificaciones/${id_usuario}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const marcarNotificacionLeida = async (id_notificacion) => {
  try {
    const response = await axios.put(
      `${base_url}/notificaciones/${id_notificacion}`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const NotificacionesService = {
  listarNotificacionesSinLeer,
  listarNotificaciones,
  marcarNotificacionLeida,
};

export default NotificacionesService;
