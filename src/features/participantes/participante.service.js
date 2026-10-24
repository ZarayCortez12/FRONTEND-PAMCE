import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarParticipantes = async (params) => {
  try {
    const response = await axios.get(`${base_url}/participantes`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarInformacionParticipante = async (id_participante, data) => {
  try {
    const response = await axios.put(
      `${base_url}/editar-informacion-participante/${id_participante}`,
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

const cambiarEstadoParticipante = async (datos) => {
  try {
    const response = await axios.put(
      `${base_url}/cambiar-estado-participante`,
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

const agregarParticipante = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/agregar-participante`,
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

const obtenerParticipante = async (id) => {
  try {
    const response = await axios.get(`${base_url}/obtener-participante/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerEdicionesParticipacionParticipante = async (id_participante) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/participante/${id_participante}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerCategoriasEdicionesParticipacionParticipante = async (
  id_edicion,
  id_participante,
) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/${id_edicion}/categorias/participante/${id_participante}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerConvocatoriasParticipante = async (id_participante, params) => {
  try {
    const response = await axios.get(
      `${base_url}/convocatorias/participante/${id_participante}`,
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

const obtenerParticipacionesPorJurado = async ({ id_jurado, params }) => {
  try {
    const response = await axios.get(
      `${base_url}/listar-participaciones/${id_jurado}`,
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

const obtenerParticipaciones = async (id_participante, params) => {
  try {
    const response = await axios.get(
      `${base_url}/participaciones/${id_participante}`,
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

const obtenerParticipacionesPorParticipante = async (
  id_participante,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/participante/participaciones/${id_participante}`,
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

const obtenerEdicionesPorParticipante = async (id_participante, params) => {
  try {
    const response = await axios.get(
      `${base_url}/ediciones/participante/${id_participante}`,
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

const agregarParticipanteSis = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/agregar-participante-sis`,
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

const generarCertificadoParticipacion = async (id_participacion) => {
  try {
    const response = await axios.get(
      `${base_url}/participantes/${id_participacion}/certificado`,
      {
        withCredentials: true,
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const ParticipanteService = {
  listarParticipantes,
  agregarParticipante,
  editarInformacionParticipante,
  cambiarEstadoParticipante,
  obtenerParticipante,
  obtenerParticipaciones,
  obtenerEdicionesParticipacionParticipante,
  obtenerConvocatoriasParticipante,
  obtenerCategoriasEdicionesParticipacionParticipante,
  obtenerEdicionesPorParticipante,
  obtenerParticipacionesPorParticipante,
  agregarParticipanteSis,
  generarCertificadoParticipacion,
  obtenerParticipacionesPorJurado,
};

export default ParticipanteService;
