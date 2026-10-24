import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarCriteriosPorRubricaPorCategoriaEdicion = async (
  id_rubrica,
  id_edicion_categoria,
  params,
) => {
  try {
    const response = await axios.get(
      `${base_url}/criterios/${id_rubrica}/${id_edicion_categoria}`,
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

const crearCriterio = async (criterio) => {
  try {
    const response = await axios.post(
      `${base_url}/criterios`,
      {
        criterio,
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

const agregarPorcentajeCriterio = async (id_edicion_categoria, datos) => {
  try {
    const response = await axios.post(
      `${base_url}/criterios/${id_edicion_categoria}`,
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

const editarPorcentajeCriterio = async (id_ecrc, porcentaje) => {
  try {
    const response = await axios.put(
      `${base_url}/criterios/porcentaje/${id_ecrc}`,
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

const CriteriosService = {
  listarCriteriosPorRubricaPorCategoriaEdicion,
  crearCriterio,
  agregarPorcentajeCriterio,
  editarPorcentajeCriterio,
};

export default CriteriosService;
