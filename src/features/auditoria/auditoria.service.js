import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const listarRegistrosAuditoria = async (params) => {
  try {
    const response = await axios.get(`${base_url}/auditoria`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const obtenerRegistroAuditoria = async (id_registro) => {
  try {
    const response = await axios.get(`${base_url}/auditoria/${id_registro}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const AuditoriaService = {
  listarRegistrosAuditoria,
  obtenerRegistroAuditoria,
};

export default AuditoriaService;
