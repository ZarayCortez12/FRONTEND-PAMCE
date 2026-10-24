import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import GanadoresService from "./ganadores.service";

export const editarInformacionContacto = createAsyncThunk(
  "usuarios/editarInformacionContacto",
  async ({ usuarioId, datos }, thunkAPI) => {
    try {
      const response = await UsuarioService.editarInformacionContacto(
        usuarioId,
        datos,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarGanadoresEdicionCategoria = createAsyncThunk(
  "ganadores/listarGanadoresEdicionCategoria",
  async (id_edicion_categoria, thunkAPI) => {
    try {
      const response =
        await GanadoresService.listarGanadoresEdicionCategoria(
          id_edicion_categoria,
        );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarGanadoresEdicion = createAsyncThunk(
  "ganadores/listarGanadoresEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      const response = await GanadoresService.listarGanadoresEdicion(
        id_edicion,
        params,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const filtrarGanadoresEdicion = createAsyncThunk(
  "ganadores/filtrarGanadoresEdicion",
  async ({ id, filtros }, thunkAPI) => {
    try {
      return await GanadoresService.filtrarGanadoresEdicion(id, filtros);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const resetState = createAction("Reset_all");

const initialState = {
  usuario: null,
  usuarios: [],
  ganadoresEdicionCategoria: [],
  ganadoresEdicion: [],

  ganadores: [],
  pagination_ganadores_edicion: {},

  isLoading: false,
  error: null,
};

const ganadoresSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    limpiarGanadoresEdicionCategoria: (state) => {
      state.ganadoresEdicionCategoria = [];
    },
    limpiarGanadoresEdicion: (state) => {
      state.ganadoresEdicion = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editarInformacionContacto.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editarInformacionContacto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.usuario = action.payload;
      })
      .addCase(editarInformacionContacto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(listarGanadoresEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ganadoresEdicionCategoria = action.payload.ganadores;
      })
      .addCase(listarGanadoresEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ganadores = action.payload.ganadores;
        state.pagination_ganadores_edicion = action.payload.pagination;
      })
      .addCase(listarGanadoresEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.ganadores = action.payload.ganadores;
        state.pagination_ganadores_edicion = action.payload.pagination;
      })
      .addCase(filtrarGanadoresEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ganadores = action.payload.ganadores;
      })
      .addCase(resetState, (state) => {
        state.usuario = null;
        state.usuarios = [];
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { limpiarGanadoresEdicionCategoria, limpiarGanadoresEdicion } =
  ganadoresSlice.actions;

export default ganadoresSlice.reducer;
