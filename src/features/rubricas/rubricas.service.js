import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const listarRubricasPorCategoriaEdicion = async (
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/rubricas/${id_edicion_categoria}`,
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

const crearRubrica = async (rubrica) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas`,
      {
        rubrica,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const crearRubricaCriterio = async (id_rubrica, id_criterio) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas/criterios`,
      {
        id_rubrica: id_rubrica,
        id_criterio: id_criterio,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const agregarRubricaAEdicionCategoria = async (id_edicion_categoria, datos) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas/edicion/${id_edicion_categoria}`,
      datos,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listarRubricas = async () => {
  try {
    const response = await axios.get(`${base_url}/rubricas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerRubricaCriterios = async (id_rubrica) => {
  try {
    const response = await axios.get(
      `${base_url}/rubricas/${id_rubrica}/criterios`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarPorcentajeRubrica = async (id_ecr, porcentaje) => {
  try {
    const response = await axios.put(
      `${base_url}/rubricas/porcentaje/${id_ecr}`,
      {
        porcentaje: porcentaje,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const eliminarRubricaDeEdicionCategoria = async (
  id_edicion_categoria,
  id_ecr,
) => {
  try {
    const response = await axios.delete(
      `${base_url}/rubricas/eliminar/${id_ecr}`,
      {
        data: {
          id_edicion_categoria,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const RubricasService = {
  listarRubricasPorCategoriaEdicion,
  crearRubrica,
  crearRubricaCriterio,
  agregarRubricaAEdicionCategoria,
  listarRubricas,
  obtenerRubricaCriterios,
  editarPorcentajeRubrica,
  eliminarRubricaDeEdicionCategoria,
};

export default RubricasService;
