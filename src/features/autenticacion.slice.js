import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import AutenticacionService from "./autenticacion.service";
import EdicionService from "./ediciones/edicion.service";
import { getUserFromToken } from "../utils/auth";

export const iniciarSesionUsuario = createAsyncThunk(
  "autenticacion/iniciarSesionUsuario",
  async (credenciales, thunkAPI) => {
    try {
      return await AutenticacionService.iniciarSesionUsuario(credenciales);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const iniciarSesionGoogle = createAsyncThunk(
  "autenticacion/iniciarSesionGoogle",
  async (informacion, thunkAPI) => {
    try {
      return await AutenticacionService.iniciarSesionGoogle(informacion);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const enviarCodigo = createAsyncThunk(
  "autenticacion/enviarCodigo",
  async (correo_electronico, thunkAPI) => {
    try {
      return await AutenticacionService.enviarCodigo(correo_electronico);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const validarCodigo = createAsyncThunk(
  "autenticacion/validarCodigo",
  async ({ codigo, correo_electronico }, thunkAPI) => {
    try {
      return await AutenticacionService.validarCodigo(
        codigo,
        correo_electronico,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reestablecerContraseña = createAsyncThunk(
  "autenticacion/reestablecerContraseña",
  async ({ token, nueva_clave, correo }, thunkAPI) => {
    try {
      return await AutenticacionService.reestablcerContraseña(
        token,
        nueva_clave,
        correo,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerUsuarioActual = createAsyncThunk(
  "autenticacion/obtenerUsuarioActual",
  async (_, thunkAPI) => {
    try {
      const response = await AutenticacionService.obtenerUsuarioActual();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const refrescarAccesToken = createAsyncThunk(
  "autenticacion/refrescarAccesToken",
  async ({ id_rol }, thunkAPI) => {
    try {
      return await AutenticacionService.refrescarAccesToken(id_rol);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarInformacionContacto = createAsyncThunk(
  "autenticacion/editarInformacionContacto",
  async ({ usuarioId, datos }, thunkAPI) => {
    try {
      const response = await AutenticacionService.editarInformacionContacto(
        usuarioId,
        datos,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const cambiarRolActivo = createAsyncThunk(
  "autenticacion/cambiarRolActivo",
  async ({ id_usuario, nuevoRol }, thunkAPI) => {
    try {
      const response = await AutenticacionService.cambiarRolActivo(
        id_usuario,
        nuevoRol,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const logout = createAsyncThunk(
  "autenticacion/logout",
  async (_, thunkAPI) => {
    try {
      const response = await AutenticacionService.logout();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const obtenerUsuarioPorCedula = createAsyncThunk(
  "autenticacion/obtenerUsuarioPorCedula",
  async (numero_documento, thunkAPI) => {
    try {
      const response =
        await AutenticacionService.obtenerUsuarioPorCedula(numero_documento);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const obtenerUsuarioPorCedulaInscripcion = createAsyncThunk(
  "autenticacion/obtenerUsuarioPorCedulaInscripcion",
  async ({ numero_documento, id_edicion, token }, thunkAPI) => {
    try {
      const response =
        await AutenticacionService.obtenerUsuarioPorCedulaInscripcion(
          numero_documento,
          id_edicion,
          token,
        );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error?.response?.data?.message || "Error desconocido en la consulta",
      });
    }
  },
);

export const crearContrasenaUsuario = createAsyncThunk(
  "autenticacion/crearContrasenaUsuario",
  async ({ token, clave }, thunkAPI) => {
    try {
      const response = await AutenticacionService.crearContrasenaUsuario(
        token,
        clave,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reenviarTokenCrearContrasena = createAsyncThunk(
  "autenticacion/reenviarTokenCrearContrasena",
  async (token, thunkAPI) => {
    try {
      const response = await AutenticacionService.reenviarTokenCrearContrasena(
        token.token,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const resetState = createAction("Reset_all");

const initialState = {
  correo_electronico: null,
  usuario: null,
  edicionActual: null,
  usuarioCedula: null,
  usuarioCedulaInscripcion: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const autenticacionSlice = createSlice({
  name: "autenticacion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(iniciarSesionUsuario.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.usuario = action.payload.usuario;
        state.message = action.payload.message;
        if (action.payload.expiresIn) {
          state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
        }
      })
      .addCase(iniciarSesionGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.usuario = action.payload.usuario;
        state.message = action.payload.message;
        if (action.payload.expiresIn) {
          state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
        }
      })
      .addCase(enviarCodigo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(validarCodigo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(validarCodigo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(reestablecerContraseña.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(reestablecerContraseña.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(obtenerUsuarioActual.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(obtenerUsuarioActual.fulfilled, (state, action) => {
        state.usuario = action.payload.usuario;
        state.expiresAt = action.payload.expiresIn;
        state.isLoading = false;
      })
      .addCase(obtenerUsuarioActual.rejected, (state) => {
        state.usuario = null;
        state.isLoading = false;
      })

      .addCase(refrescarAccesToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
        if (action.payload.expiresIn) {
          state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
        }
      })
      .addCase(refrescarAccesToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(editarInformacionContacto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = {
          ...state.usuario,
          ...action.payload.usuario,
        };
      })
      .addCase(cambiarRolActivo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(obtenerUsuarioPorCedula.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = action.payload.exists;
        state.usuarioCedula = action.payload.usuario;
        state.message = action.payload.message || "";
      })
      .addCase(obtenerUsuarioPorCedula.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.usuarioCedula = null;
        state.message = action.payload?.message || "Error buscando usuario";
      })
      .addCase(
        obtenerUsuarioPorCedulaInscripcion.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = action.payload.exists;
          state.usuarioCedulaInscripcion = action.payload.usuario;
          state.message = action.payload.message || "";
        },
      )
      .addCase(obtenerUsuarioPorCedulaInscripcion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.usuarioCedulaInscripcion = null;
        state.message = action.payload?.message || "Error buscando usuario";
      })
      .addCase(crearContrasenaUsuario.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
      })
      .addCase(crearContrasenaUsuario.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(crearContrasenaUsuario.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reenviarTokenCrearContrasena.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(reenviarTokenCrearContrasena.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(reenviarTokenCrearContrasena.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetState, (state) => {
        state.usuarioCedula = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export default autenticacionSlice.reducer;
