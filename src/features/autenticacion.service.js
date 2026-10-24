import axios from "axios";
import { base_url } from "../utils/baseUrl";

const iniciarSesionUsuario = async (credenciales) => {
  try {
    const response = await axios.post(base_url, credenciales, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const iniciarSesionGoogle = async (informacion) => {
  try {
    const response = await axios.post(`${base_url}/login-google`, informacion, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const enviarCodigo = async (correo_electronico) => {
  try {
    const response = await axios.post(
      `${base_url}/enviar-codigo`,
      { correo_electronico },
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const validarCodigo = async (codigo, correo_electronico) => {
  try {
    const response = await axios.post(
      `${base_url}/validar-codigo`,
      { correo_electronico, codigo },
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const reestablcerContraseña = async (token, nueva_clave, correo) => {
  try {
    const response = await axios.post(
      `${base_url}/reestablecer-contrasena`,
      { token, nueva_clave, correo },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerUsuarioActual = async () => {
  try {
    const response = await axios.get(`${base_url}/usuario-actual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const refrescarAccesToken = async (id_rol) => {
  try {
    const response = await axios.post(
      `${base_url}/refresh-token`,
      { id_rol },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const editarInformacionContacto = async (usuarioId, nuevaInformacion) => {
  try {
    const response = await axios.put(
      `${base_url}/editar-informacion-contacto/${usuarioId}`,
      nuevaInformacion,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cambiarRolActivo = async (id_usuario, nuevoRol) => {
  try {
    const response = await axios.put(
      `${base_url}/cambiar-rol-activo/${id_usuario}`,
      { nuevoRol },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      `${base_url}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerUsuarioPorCedula = async (numero_documento) => {
  try {
    const response = await axios.get(
      `${base_url}/obtener-usuario/${numero_documento}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerUsuarioPorCedulaInscripcion = async (
  numero_documento,
  id_edicion,
  token,
) => {
  try {
    const response = await axios.get(
      `${base_url}/obtener-usuario-inscripcion/${numero_documento}`,
      {
        params: {
          idEdicion: id_edicion,
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

const crearContrasenaUsuario = async (token, clave) => {
  try {
    const response = await axios.post(
      `${base_url}/crear-contrasena`,
      { token, clave },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reenviarTokenCrearContrasena = async (token) => {
  try {
    const response = await axios.post(
      `${base_url}/reenviar-token-crear-contrasena`,
      { token },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AutenticacionService = {
  iniciarSesionUsuario,
  enviarCodigo,
  validarCodigo,
  reestablcerContraseña,
  obtenerUsuarioActual,
  iniciarSesionGoogle,
  refrescarAccesToken,
  editarInformacionContacto,
  cambiarRolActivo,
  logout,
  obtenerUsuarioPorCedula,
  obtenerUsuarioPorCedulaInscripcion,
  crearContrasenaUsuario,
  reenviarTokenCrearContrasena,
};

export default AutenticacionService;
