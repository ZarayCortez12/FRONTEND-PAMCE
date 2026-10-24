import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarCategoriasPorEdicion = async (id_edicion, params) => {
  try {
    const response = await axios.get(
      `${base_url}/categorias/edicion/${id_edicion}`,
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

const obtenerCategoria = async (id_edicion_categoria) => {
  try {
    const response = await axios.get(
      `${base_url}/categorias/${id_edicion_categoria}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarRubricasPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/categorias/rubricas/${id_edicion_categoria}`,
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

const listarCategorias = async (id) => {
  try {
    const response = await axios.get(`${base_url}/categorias`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cambiarEstado = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}/categorias/estado/${data.id_edicion_categoria}`,
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

const eliminarCategoriaEdicion = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/categorias/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarCategoria = async (data) => {
  try {
    const response = await axios.post(`${base_url}/categorias`, data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const agregarCategoriaEdicion = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}/categorias/${data.id_edicion}`,
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

const editarCategoriaEdicion = async (id_edicion_categoria, data) => {
  try {
    const response = await axios.put(
      `${base_url}/categorias/${id_edicion_categoria}`,
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

const CategoriasService = {
  listarCategorias,
  listarRubricasPorCategoriaEdicion,
  agregarCategoria,
  agregarCategoriaEdicion,
  editarCategoriaEdicion,
  cambiarEstado,
  eliminarCategoriaEdicion,
  listarCategoriasPorEdicion,
  obtenerCategoria,
};

export default CategoriasService;
