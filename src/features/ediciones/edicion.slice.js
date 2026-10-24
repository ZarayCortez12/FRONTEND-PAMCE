import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import EdicionService from "./edicion.service";

export const listarEdiciones = createAsyncThunk(
  "edicion/listarEdiciones",
  async (params, thunkAPI) => {
    try {
      return await EdicionService.listarEdiciones(params);
    } catch (error) {
      console.error("Error en listarEdiciones:", error);
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const crearEdicion = createAsyncThunk(
  "edicion/crearEdicion",
  async (data, thunkAPI) => {
    try {
      return await EdicionService.crearEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicion = createAsyncThunk(
  "edicion/obtenerEdicion",
  async (id, thunkAPI) => {
    try {
      return await EdicionService.obtenerEdicion(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarEdicion = createAsyncThunk(
  "edicion/editarEdicion",
  async ({ id_edicion, datos }, thunkAPI) => {
    try {
      return await EdicionService.editarEdicion(id_edicion, datos);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const cambiarEstado = createAsyncThunk(
  "edicion/cambiarEstado",
  async ({ id_edicion, data }, thunkAPI) => {
    try {
      return await EdicionService.cambiarEstado(id_edicion, data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const eliminarEdicion = createAsyncThunk(
  "edicion/eliminarEdicion",
  async (id_edicion, thunkAPI) => {
    try {
      return await EdicionService.eliminarEdicion(id_edicion);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicionEnProceso = createAsyncThunk(
  "edicion/obtenerEdicionEnProceso",
  async (_, thunkAPI) => {
    try {
      const edicion = await EdicionService.obtenerEdicionEnProceso();
      return edicion;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const enviarCorreoConvocatoria = createAsyncThunk(
  "ediciones/enviarCorreoConvocatoria",
  async (data, { rejectWithValue }) => {
    try {
      return await EdicionService.enviarCorreoConvocatoria(data);
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicionesPorJurado = createAsyncThunk(
  "edicion/obtenerEdicionesPorJurado",
  async ({ id_jurado, params }, thunkAPI) => {
    try {
      return await EdicionService.obtenerEdicionesPorJurado(id_jurado, params);
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
  ediciones: [],
  edicion: undefined,
  loadingEdicion: false,
  errorEdicion: null,
  edicion_en_proceso: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const edicionSlice = createSlice({
  name: "ediciones",
  initialState,
  reducers: {
    setEdicionActual: (state, action) => {
      state.edicionActual = action.payload;
      localStorage.setItem("edicionEnProcesos", JSON.stringify(action.payload));
    },
    clearEdicionActual: (state) => {
      state.edicionActual = null;
      localStorage.removeItem("edicionEnProcesos");
    },
    limpiarEdicionObtenida: (state) => {
      state.edicion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarEdiciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.ediciones = action.payload.ediciones;
      })
      .addCase(crearEdicion.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(crearEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.edicion) {
          state.ediciones.push(action.payload.edicion);
        }
      })
      .addCase(obtenerEdicion.pending, (state) => {
        state.loadingEdicion = true;
        state.errorEdicion = null;
        state.edicion = undefined;
      })
      .addCase(obtenerEdicion.fulfilled, (state, action) => {
        state.loadingEdicion = false;
        state.edicion = action.payload?.edicion ?? null;
        state.errorEdicion = null;

        state.isSuccess = true;
        state.isExisting = Boolean(state.edicion);
        state.message = action.payload?.message || "";
      })
      .addCase(obtenerEdicion.rejected, (state, action) => {
        state.loadingEdicion = false;

        if (action.payload?.status === 404) {
          state.edicion = null;
          state.errorEdicion = null;
        } else {
          state.edicion = undefined;
          state.errorEdicion =
            action.payload?.message ||
            "No fue posible consultar la participación.";
        }

        state.isSuccess = false;
        state.isExisting = false;
      })
      .addCase(editarEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.edicion) {
          const updatedEdicionIndex = state.ediciones.findIndex(
            (edicion) =>
              edicion.id_edicion === action.payload.edicion.id_edicion,
          );

          if (updatedEdicionIndex !== -1) {
            state.ediciones[updatedEdicionIndex] = action.payload.edicion;
          } else {
            state.ediciones.push(action.payload.edicion);
          }
        }
      })
      .addCase(editarEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al editar la edición";
      })
      .addCase(cambiarEstado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Edición actualizada correctamente";
        state.ediciones = state.ediciones.map((edicion) => {
          if (edicion.id_edicion === action.payload.id_edicion) {
            return action.payload.edicion;
          }
          return edicion;
        });
      })
      .addCase(cambiarEstado.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al editar la edición";
      })
      .addCase(eliminarEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Edición eliminada correctamente";
        state.ediciones = state.ediciones.filter(
          (edicion) => edicion.id_edicion !== action.payload.id_edicion,
        );
      })
      .addCase(eliminarEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al eliminar la edición";
      })
      .addCase(obtenerEdicionEnProceso.fulfilled, (state, action) => {
        state.edicion_en_proceso = action.payload;
      })
      .addCase(enviarCorreoConvocatoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Correos enviados correctamente";
        state.ediciones = state.ediciones.map((edicion) => {
          if (edicion.id_edicion === action.payload.id_edicion) {
            return action.payload.edicion;
          }
          return edicion;
        });
      })
      .addCase(enviarCorreoConvocatoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al enviar los correos";
      })
      .addCase(obtenerEdicionesPorJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Información de la edición obtenida";
        state.ediciones = action.payload.ediciones;
      })
      .addCase(resetState, (state) => {
        state.ediciones = [];
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export const { limpiarEdicionObtenida } = edicionSlice.actions;

export default edicionSlice.reducer;
