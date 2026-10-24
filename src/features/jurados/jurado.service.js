import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarJuradosPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/jurados/edicion/${id_edicion}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listarJuradosPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/jurados/categoria/${id_edicion_categoria}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listarJurados = async (params) => {
  try {
    const response = await axios.get(`${base_url}/jurados`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listarJuradosDisponiblesParaAsignar = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/jurados-disponibles-asignar/${id_edicion}`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const agregarJurado = async (data) => {
  try {
    const response = await axios.post(`${base_url}/agregar-jurado`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarInformacionJurado = async (id_jurado, data) => {
  try {
    const response = await axios.put(
      `${base_url}/editar-informacion-jurado/${id_jurado}`,
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

const cambiarEstadoJurado = async (datos) => {
  try {
    const response = await axios.put(
      `${base_url}/cambiar-estado-jurado`,
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

const obtenerJurado = async (id_jurado) => {
  try {
    const response = await axios.get(
      `${base_url}/obtener-jurado/${id_jurado}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerEdicionesParticipacionJurado = async (id_jurado, params) => {
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
    return Promise.reject(error);
  }
};

const obtenerCategoriasEdicionesParticipacionJurado = async (
  id_edicion,
  id_jurado,
) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/${id_edicion}/categorias/jurado/${id_jurado}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerParticipacionesEvaluadasJurado = async (id_jurado, params) => {
  try {
    const response = await axios.get(
      `${base_url}/jurados/${id_jurado}/participaciones`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerParticipacionesEdicion = async (id, params) => {
  try {
    const response = await axios.get(
      `${base_url}/jurados/edicion/${id}/participaciones`,
      {
        params,
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerCategoriasParticipacionJurado = async (id_edicion, id_jurado) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/${id_edicion}/categorias/jurado/${id_jurado}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const registrarEvaluacion = async (data) => {
  try {
    const response = await axios.post(`${base_url}/evaluacion-jurado`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarEvaluacion = async (data) => {
  try {
    const response = await axios.put(`${base_url}/editar-evaluacion`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const JuradoService = {
  listarJuradosPorEdicion,
  listarJuradosPorCategoriaEdicion,
  listarJurados,
  agregarJurado,
  editarInformacionJurado,
  cambiarEstadoJurado,
  obtenerJurado,
  obtenerEdicionesParticipacionJurado,
  obtenerCategoriasEdicionesParticipacionJurado,
  obtenerParticipacionesEvaluadasJurado,
  obtenerParticipacionesEdicion,
  listarJuradosDisponiblesParaAsignar,
  obtenerCategoriasParticipacionJurado,
  registrarEvaluacion,
  editarEvaluacion,
};

export default JuradoService;
