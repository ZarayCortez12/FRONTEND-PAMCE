import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const reportesParticipaciones = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/participaciones`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesPostulaciones = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/postulaciones`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesConvocatorias = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/convocatorias`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesUsuarios = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/usuarios`, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesParticipacionesPDF = async (params) => {
  try {
    const response = await axios.get(
      `${base_url}/reportes/participaciones/pdf`,
      {
        params,
        withCredentials: true,
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesParticipacionesExcel = async (params) => {
  try {
    const response = await axios.get(
      `${base_url}/reportes/participaciones/excel`,
      {
        params,
        withCredentials: true,
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesPostulacionesPDF = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/postulaciones/pdf`, {
      params,
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesPostulacionesExcel = async (params) => {
  try {
    const response = await axios.get(
      `${base_url}/reportes/postulaciones/excel`,
      {
        params,
        withCredentials: true,
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesConvocatoriasPDF = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/convocatorias/pdf`, {
      params,
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesConvocatoriasExcel = async (params) => {
  try {
    const response = await axios.get(
      `${base_url}/reportes/convocatorias/excel`,
      {
        params,
        withCredentials: true,
        responseType: "blob",
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesUsuariosPDF = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/usuarios/pdf`, {
      params,
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reportesUsuariosExcel = async (params) => {
  try {
    const response = await axios.get(`${base_url}/reportes/usuarios/excel`, {
      params,
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const ReportesService = {
  reportesParticipaciones,
  reportesPostulaciones,
  reportesConvocatorias,
  reportesUsuarios,
  reportesParticipacionesPDF,
  reportesParticipacionesExcel,
  reportesPostulacionesPDF,
  reportesPostulacionesExcel,
  reportesConvocatoriasPDF,
  reportesConvocatoriasExcel,
  reportesUsuariosPDF,
  reportesUsuariosExcel,
};

export default ReportesService;
