import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import NotificacionesService from "./notificaciones.service";

export const listarNotificacionesSinLeer = createAsyncThunk(
  "notificaciones/listarNotificacionesSinLeer",
  async ({ id_usuario, id_rol }, thunkAPI) => {
    try {
      return await NotificacionesService.listarNotificacionesSinLeer(
        id_usuario,
        id_rol,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarNotificaciones = createAsyncThunk(
  "notificaciones/listarNotificaciones",
  async ({ id_usuario, params }, thunkAPI) => {
    try {
      return await NotificacionesService.listarNotificaciones(
        id_usuario,
        params,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const marcarNotificacionLeida = createAsyncThunk(
  "notificaciones/marcarNotificacionLeida",
  async (id_notificacion, thunkAPI) => {
    try {
      return await NotificacionesService.marcarNotificacionLeida(
        id_notificacion,
      );
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
  loading: false,
  notificaciones: [],
  notificaciones_sin_leer: [],
  pagination: {},
  message: "",
};

const notificacionesSlice = createSlice({
  name: "notificaciones",
  initialState,
  reducers: {
    limpiarNotificaciones: (state) => {
      state.notificaciones = [];
      state.pagination = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarNotificaciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(listarNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.notificaciones = action.payload.notificaciones;
        state.pagination = action.payload.pagination;
      })
      .addCase(listarNotificacionesSinLeer.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.notificaciones_sin_leer = action.payload.notificaciones;
      })
      .addCase(marcarNotificacionLeida.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        if (action.payload.notificacion) {
          const notificacionIndex = state.notificaciones.findIndex(
            (notificacion) =>
              notificacion.id === action.payload.notificacion.id,
          );
          if (notificacionIndex !== -1) {
            state.notificaciones[notificacionIndex] =
              action.payload.notificacion;
          } else {
            state.notificaciones.push(action.payload.notificacion);
          }
        }
      })
      .addCase(resetState, (state) => {
        state.notificaciones = [];
        state.pagination = {};
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export const { limpiarNotificaciones } = notificacionesSlice.actions;

export default notificacionesSlice.reducer;
