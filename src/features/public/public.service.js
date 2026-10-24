import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const configAutorizacion = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

const obtenerEdicionEnProcesoPublico = async (token) => {
  try {
    const response = await axios.get(
      `${base_url}/public/ediciones/estado/en-proceso/${token}`,
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

const obtenerEdicionEnProcesoFanPage = async () => {
  try {
    const response = await axios.get(
      `${base_url}/public/ediciones/publica/en-proceso`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const obtenerEdicionesFanPage = async () => {
  try {
    const response = await axios.get(`${base_url}/public/ediciones`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const obtenerUsuarioPorCedulaPublico = async (
  numero_documento,
  id_edicion,
  token = null,
) => {
  try {
    const response = await axios.get(
      `${base_url}/public/usuarios/${numero_documento}`,
      {
        params: { id_edicion },
        ...configAutorizacion(token),
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRequisitosEdicionPublico = async (id_edicion, token = null) => {
  try {
    const response = await axios.get(
      `${base_url}/public/requisitos/edicion/${id_edicion}`,
      configAutorizacion(token),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarCategoriasPorEdicionPublico = async (id_edicion, token = null) => {
  try {
    const response = await axios.get(
      `${base_url}/public/categorias/edicion/${id_edicion}`,
      configAutorizacion(token),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRequisitosPorCategoriaEdicionPublico = async (
  data,
  token = null,
) => {
  try {
    const response = await axios.get(
      `${base_url}/public/requisitos/categoria/${data.id_edicion_categoria}`,
      {
        params: {
          id_edicion: data.id_edicion,
        },
        ...configAutorizacion(token),
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const crearParticipantePublico = async (data, token = null) => {
  try {
    const response = await axios.post(
      `${base_url}/public/participantes`,
      data,
      configAutorizacion(token),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registrarParticipacionPublico = async (formData, token) => {
  try {
    const response = await axios.post(
      `${base_url}/public/crear-participacion`,
      formData,
      {
        params: {
          id_edicion: formData.get("id_edicion"),
        },
        ...(token ? configAutorizacion(token) : {}),
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const crearUsuarioPublico = async (data, token = null) => {
  try {
    const response = await axios.post(`${base_url}/public/usuarios`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const PublicService = {
  obtenerEdicionEnProcesoPublico,
  obtenerEdicionEnProcesoFanPage,
  obtenerEdicionesFanPage,
  obtenerUsuarioPorCedulaPublico,
  listarRequisitosEdicionPublico,
  listarCategoriasPorEdicionPublico,
  listarRequisitosPorCategoriaEdicionPublico,
  crearParticipantePublico,
  registrarParticipacionPublico,
  crearUsuarioPublico
};

export default PublicService;
