import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const editarInformacionContacto = async (usuarioId, nuevaInformacion) => {
  try {
    const response = await axios.put(
      `${base_url}/editar-informacion-contacto/${usuarioId}`,
      nuevaInformacion,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarGanadoresEdicionCategoria = async (id_edicion_categoria) => {
  try {
    const response = await axios.get(
      `${base_url}/ganadores-categoria/${id_edicion_categoria}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarGanadoresEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/ganadores-edicion/${id_edicion}`,
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

const filtrarGanadoresEdicion = async (id, filtros) => {
  try {
    const response = await axios.get(
      `${base_url}/filtrar-ganadores-edicion/${id}`,
      {
        params: filtros,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const GanadoresService = {
  editarInformacionContacto,
  listarGanadoresEdicionCategoria,
  listarGanadoresEdicion,
  filtrarGanadoresEdicion,
};

export default GanadoresService;
