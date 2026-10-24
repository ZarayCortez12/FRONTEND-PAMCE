import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarDirectores = async (params) => {
  try {
    const response = await axios.get(`${base_url}/directores`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const agregarDirector = async (data) => {
  try {
    const response = await axios.post(`${base_url}/agregar-director`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarInformacionDirector = async (id_director, data) => {
  try {
    const response = await axios.put(
      `${base_url}/editar-informacion-director/${id_director}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const cambiarEstadoDirector = async (datos) => {
  try {
    const response = await axios.put(
      `${base_url}/cambiar-estado-director`,
      { datos },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerDirector = async (id_director) => {
  try {
    const response = await axios.get(
      `${base_url}/obtener-director/${id_director}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const DirectorService = {
  listarDirectores,
  agregarDirector,
  editarInformacionDirector,
  cambiarEstadoDirector,
  obtenerDirector,
};

export default DirectorService;
