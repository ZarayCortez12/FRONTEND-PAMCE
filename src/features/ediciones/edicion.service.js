import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarEdiciones = async (params) => {
  try {
    const response = await axios.get(`${base_url}/ediciones`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerEdicion = async (id) => {
  try {
    const response = await axios.get(`${base_url}/ediciones/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const crearEdicion = async (data) => {
  try {
    const response = await axios.post(`${base_url}/ediciones`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const editarEdicion = async (id_edicion, datos) => {
  try {
    const response = await axios.put(
      `${base_url}/ediciones/${id_edicion}`,
      datos,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const cambiarEstado = async (id_edicion, data) => {
  try {
    const response = await axios.put(
      `${base_url}/ediciones/estado/${id_edicion}`,
      { data },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const eliminarEdicion = async (id_edicion) => {
  try {
    const response = await axios.delete(`${base_url}/ediciones/${id_edicion}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerEdicionEnProceso = async () => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/estado/en-proceso`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const enviarCorreoConvocatoria = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/enviar-correos-convocatoria`,
      data,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerEdicionesPorJurado = async (id_jurado, params) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/jurado/${id_jurado}`,
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

const EdicionService = {
  listarEdiciones,
  crearEdicion,
  obtenerEdicion,
  editarEdicion,
  cambiarEstado,
  eliminarEdicion,
  obtenerEdicionEnProceso,
  enviarCorreoConvocatoria,
  obtenerEdicionesPorJurado,
};

export default EdicionService;
