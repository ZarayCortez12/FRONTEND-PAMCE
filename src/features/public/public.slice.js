import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import PublicService from "./public.service";

export const obtenerEdicionEnProcesoPublico = createAsyncThunk(
  "public/obtenerEdicionEnProcesoPublico",
  async (token, thunkAPI) => {
    try {
      const edicion = await PublicService.obtenerEdicionEnProcesoPublico(token);
      return edicion;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicionEnProcesoFanPage = createAsyncThunk(
  "public/obtenerEdicionEnProcesoFanPage",
  async (_, thunkAPI) => {
    try {
      const edicion = await PublicService.obtenerEdicionEnProcesoFanPage();
      return edicion;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicionesFanPage = createAsyncThunk(
  "public/obtenerEdicionesFanPage",
  async (_, thunkAPI) => {
    try {
      const ediciones = await PublicService.obtenerEdicionesFanPage();
      return ediciones;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerUsuarioPorCedulaPublico = createAsyncThunk(
  "public/obtenerUsuarioPorCedulaPublico",
  async ({ numero_documento, id_edicion, token = null }, thunkAPI) => {
    try {
      const response = await PublicService.obtenerUsuarioPorCedulaPublico(
        numero_documento,
        id_edicion,
        token,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error?.response?.data?.message || "Error desconocido en la consulta",
        usuario: error?.response?.data?.usuario || null,
      });
    }
  },
);

export const listarRequisitosEdicionPublico = createAsyncThunk(
  "public/listarRequisitosEdicionPublico",
  async ({ id_edicion, token = null }, thunkAPI) => {
    try {
      return await PublicService.listarRequisitosEdicionPublico(
        id_edicion,
        token,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarCategoriasPorEdicionPublico = createAsyncThunk(
  "public/listarCategoriasPorEdicionPublico",
  async ({ id_edicion, token = null }, thunkAPI) => {
    try {
      return await PublicService.listarCategoriasPorEdicionPublico(
        id_edicion,
        token,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarRequisitosPorCategoriaEdicionPublico = createAsyncThunk(
  "public/listarRequisitosPorCategoriaEdicionPublico",
  async ({ id_edicion_categoria, id_edicion, token = null }, thunkAPI) => {
    try {
      return await PublicService.listarRequisitosPorCategoriaEdicionPublico(
        { id_edicion_categoria, id_edicion },
        token,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const crearParticipantePublico = createAsyncThunk(
  "public/crearParticipantePublico",
  async ({ data, token = null }, thunkAPI) => {
    try {
      const response = await PublicService.crearParticipantePublico(
        data,
        token,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        usuario: error.response?.data?.usuario || null,
        status: error.response?.status,
      });
    }
  },
);

export const registrarParticipacionPublico = createAsyncThunk(
  "participacion/registrarParticipacionPublico",
  async ({ formData, token }, thunkAPI) => {
    try {
      return await PublicService.registrarParticipacionPublico(formData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const crearUsuarioPublico = createAsyncThunk(
  "public/crearUsuarioPublico",
  async (data, thunkAPI) => {
    try {
      const response = await PublicService.crearUsuarioPublico(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        usuario: error.response?.data?.usuario || null,
        status: error.response?.status,
      });
    }
  },
);

export const resetState = createAction("Reset_all");

const initialState = {
  edicion_en_proceso: null,
  usuario: null,
  requisitos_edicion: null,
  categorias: null,
  requisitos_categoria_edicion: null,
  ediciones: null,
  participacion: null,
};

const publicSlice = createSlice({
  name: "public",
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
      state.edicion_en_proceso = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerEdicionEnProcesoPublico.fulfilled, (state, action) => {
        state.edicion_en_proceso = action.payload.edicion;
      })
      .addCase(obtenerEdicionEnProcesoFanPage.fulfilled, (state, action) => {
        state.edicion_en_proceso = action.payload.edicion;
      })
      .addCase(obtenerEdicionesFanPage.fulfilled, (state, action) => {
        state.ediciones = action.payload.ediciones;
      })
      .addCase(obtenerUsuarioPorCedulaPublico.fulfilled, (state, action) => {
        state.usuario = action.payload.usuario;
      })
      .addCase(listarRequisitosEdicionPublico.fulfilled, (state, action) => {
        state.requisitos_edicion = action.payload.requisitos;
      })
      .addCase(listarCategoriasPorEdicionPublico.fulfilled, (state, action) => {
        state.categorias = action.payload.categorias;
      })
      .addCase(
        listarRequisitosPorCategoriaEdicionPublico.fulfilled,
        (state, action) => {
          state.requisitos_categoria_edicion = action.payload.requisitos;
        },
      )
      .addCase(registrarParticipacionPublico.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(registrarParticipacionPublico.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participacion = action.payload.participacion;
      })
      .addCase(registrarParticipacionPublico.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
        state.participacion = action.payload.participacion;
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

export const { limpiarEdicionObtenida } = publicSlice.actions;

export default publicSlice.reducer;
