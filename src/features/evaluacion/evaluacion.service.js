import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarRubricasPorCategoriaEdicion = async (id_edicion_categoria) => {
  try {
    const response = await axios.get(
      `${base_url}/categoria/${id_edicion_categoria}/rubricas`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listarRubricasConCriterios = async () => {
  try {
    const response = await axios.get(`${base_url}/rubricas/listar-rubricas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const editarPorcentajeCriterio = async (id_ecrc, porcentaje) => {
  try {
    const response = await axios.put(
      `${base_url}/rubricas/editar-porcentaje/${id_ecrc}`,
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

const editarPorcentajeRubrica = async (id_ecr, porcentaje) => {
  try {
    const response = await axios.put(
      `${base_url}/rubricas/editar-porcentaje-rubrica/${id_ecr}`,
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

const listarRubricasFiltradasPorCategoria = async (id_edicion_categoria) => {
  try {
    const response = await axios.get(
      `${base_url}/rubricas/filtradas/${id_edicion_categoria}`,
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
      `${base_url}/rubricas/agregar/${id_edicion_categoria}`,
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

const agregarPorcentajeCriterio = async (id_edicion_categoria, datos) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas/agregar-porcentajes/${id_edicion_categoria}`,
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

const eliminarRubricaAEdicionCategoria = async (
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

const crearRubrica = async (rubrica) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas/crear`,
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

const crearCriterio = async (criterio) => {
  try {
    const response = await axios.post(
      `${base_url}/criterios/crear`,
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

const crearRubricaCriterio = async (id_rubrica, id_criterio) => {
  try {
    const response = await axios.post(
      `${base_url}/rubricas/criterio`,
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

const obtenerRubricaCriterio = async (id_rubrica) => {
  try {
    const response = await axios.get(
      `${base_url}/rubricas/criterios/${id_rubrica}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerEvaluacion = async (id_participacion_jurado) => {
  try {
    const response = await axios.get(
      `${base_url}/evaluaciones/${id_participacion_jurado}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const EvaluacionService = {
  listarRubricasPorCategoriaEdicion,
  listarRubricasConCriterios,
  editarPorcentajeCriterio,
  listarRubricasFiltradasPorCategoria,
  agregarRubricaAEdicionCategoria,
  agregarPorcentajeCriterio,
  editarPorcentajeRubrica,
  eliminarRubricaAEdicionCategoria,
  crearRubrica,
  crearCriterio,
  crearRubricaCriterio,
  obtenerRubricaCriterio,
  obtenerEvaluacion,
};

export default EvaluacionService;
