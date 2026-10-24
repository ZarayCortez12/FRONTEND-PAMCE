import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { data } from "react-router-dom";

const listarRequisitosPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/categoria/${id_edicion_categoria}`,
      { params, withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerConfiguracionRequisitoDeCategoriaEdicion = async (
  id_requisito_edicion_categoria,
) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/configuracion/${id_requisito_edicion_categoria}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRequisitosEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/edicion/${id_edicion}`,
      { params, withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const filtrarRequisitosEdicion = async (idEdicion, filtros) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/filtrar/${idEdicion}`,
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

const crearRequisito = async (data) => {
  try {
    const response = await axios.post(`${base_url}/requisitos`, data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarRequisitoEdicion = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/requisitos/edicion/${data.id_edicion}`,
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

const editarRequisito = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/requisitos/${data.id_requisito_edicion}`,
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

const eliminarRequisito = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/requisitos/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const filtrarRequisitosEdicionCategoria = async (
  id_edicion_categoria,
  filtros,
) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/categoria/filtrar/${id_edicion_categoria}`,
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

const agregarRequisitoCategoriaEdicion = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/requisitos/edicion/categoria/${data.id_edicion_categoria}`,
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

const editarRequisitoCategoriaEdicion = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/requisitos/edicion/categoria/${data.id_requisito_edicion_categoria}`,
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

const editarConfiguracionRequisitoCategoriaEdicion = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/requisitos/edicion/categoria/configuracion/${data.id_requisito_edicion_categoria}`,
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

const editarRequisitoEdicion = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/requisitos/edicion/${data.id_requisito_edicion}`,
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

const editarConfiguracionRequisitoEdicion = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/requisitos/edicion/configuracion/${data.id_requisito_edicion}`,
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

const eliminarRequisitoCategoriaEdicion = async (
  id_requisito_edicion_categoria,
) => {
  try {
    const response = await axios.delete(
      `${base_url}/requisitos/edicion/categoria/${id_requisito_edicion_categoria}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const eliminarRequisitoEdicion = async (id_requisito_edicion) => {
  try {
    const response = await axios.delete(
      `${base_url}/requisitos/edicion/${id_requisito_edicion}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRequisitosEdicionInscripcion = async (id, token) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/inscripcion/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRequisitosPorCategoriaEdicionInscripcion = async (data, token) => {
  try {
    const response = await axios.get(
      `${base_url}/requisitos/categoria/inscripcion/${data.id_edicion_categoria}`,
      {
        params: {
          idEdicion: data.id_edicion,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const RequisitosService = {
  listarRequisitosPorCategoriaEdicion,
  obtenerConfiguracionRequisitoDeCategoriaEdicion,
  crearRequisito,
  agregarRequisitoCategoriaEdicion,
  listarRequisitosEdicion,
  listarRequisitosEdicionInscripcion,
  listarRequisitosPorCategoriaEdicionInscripcion,
  filtrarRequisitosEdicion,
  filtrarRequisitosEdicionCategoria,
  agregarRequisitoEdicion,
  editarRequisito,
  editarRequisitoCategoriaEdicion,
  eliminarRequisito,
  eliminarRequisitoCategoriaEdicion,
  editarConfiguracionRequisitoCategoriaEdicion,
  editarRequisitoEdicion,
  editarConfiguracionRequisitoEdicion,
  eliminarRequisitoEdicion,
};

export default RequisitosService;
