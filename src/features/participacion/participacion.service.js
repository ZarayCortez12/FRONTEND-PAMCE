import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarParticipacionesPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/edicion/${id_edicion}`,
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

const listarConvocatoriasPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/convocatorias/${id_edicion}`,
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

const listarParticipacionesGanadorasPorEdicionCategoria = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/ganadoras/categoria/${id_edicion_categoria}`,
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

const listarPostulacionesPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/postulaciones/categoria/${id_edicion_categoria}`,
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

const listarParticipacionesPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/categoria/${id_edicion_categoria}`,
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

const listarPostulacionesPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/postulaciones/${id_edicion}`,
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

const listarParticipacionesGanadorasPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/ganadoras/${id_edicion}`,
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

const editarRespuestaRequisitoDocumento = async (
  id_participacion_requisito,
  formData,
) => {
  try {
    const response = await axios.put(
      `${base_url}/participaciones/requisitos/respuesta/${id_participacion_requisito}`,
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarPostulaciones = async (id) => {
  try {
    const response = await axios.get(`${base_url}/postulaciones/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerParticipacion = async (id) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/${id}/informacion`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerParticipacionAEvaluar = async (id) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/evaluar/${id}/informacion`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerParticipacionParticipante = async (id) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/participante/${id}/informacion`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const mostrarDocumento = async (id) => {
  try {
    const response = await axios.get(`${base_url}/documento/${id}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const mostrarDocumentoBlob = async (id) => {
  try {
    const response = await axios.get(`${base_url}/documento/${id}`, {
      responseType: "blob",
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const cambiarEstadoParticipacion = async (id, datos) => {
  try {
    const response = await axios.put(`${base_url}/participacion/${id}`, datos, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const actualizarComentarios = async (id, datos) => {
  try {
    const response = await axios.put(
      `${base_url}/participacion/${id}/comentarios`,
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

const agregarJuradoAParticipacion = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/participaciones/jurados/${data.id}`,
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

const cambiarEstadoAsignacionJurado = async (
  id_participacion_jurado,
  estado,
) => {
  try {
    const response = await axios.put(
      `${base_url}/participaciones/jurados/${id_participacion_jurado}`,
      {
        estado: estado,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarParticipacionesPorCategoria = async (id_edicion_categoria) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/categoria/${id_edicion_categoria}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarJuradosParticipacion = async (id_participacion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/jurados/${id_participacion}`,
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

const ParticipacionService = {
  listarParticipacionesPorEdicion,
  listarConvocatoriasPorEdicion,
  listarParticipacionesGanadorasPorEdicionCategoria,
  listarPostulacionesPorCategoriaEdicion,
  listarParticipacionesPorCategoriaEdicion,
  listarPostulacionesPorEdicion,
  listarParticipacionesGanadorasPorEdicion,
  listarJuradosParticipacion,
  listarPostulaciones,
  obtenerParticipacion,
  obtenerParticipacionAEvaluar,
  obtenerParticipacionParticipante,
  mostrarDocumento,
  mostrarDocumentoBlob,
  cambiarEstadoParticipacion,
  actualizarComentarios,
  agregarJuradoAParticipacion,
  cambiarEstadoAsignacionJurado,
  listarParticipacionesPorCategoria,
  editarRespuestaRequisitoDocumento,
};

export default ParticipacionService;
