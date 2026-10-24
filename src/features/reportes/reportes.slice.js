import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import ReportesService from "./reportes.service";

export const reportesParticipaciones = createAsyncThunk(
  "reportes/reportesParticipaciones",
  async (params, thunkAPI) => {
    try {
      return await ReportesService.reportesParticipaciones(params);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reportesPostulaciones = createAsyncThunk(
  "reportes/reportesPostulaciones",
  async (params, thunkAPI) => {
    try {
      return await ReportesService.reportesPostulaciones(params);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reportesConvocatorias = createAsyncThunk(
  "reportes/reportesConvocatorias",
  async (params, thunkAPI) => {
    try {
      return await ReportesService.reportesConvocatorias(params);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reportesUsuarios = createAsyncThunk(
  "reportes/reportesUsuarios",
  async (params, thunkAPI) => {
    try {
      return await ReportesService.reportesUsuarios(params);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const reportesParticipacionesPDF = createAsyncThunk(
  "reportes/reportesParticipacionesPDF",
  async (params, thunkAPI) => {
    try {
      return await ReportesService.reportesParticipacionesPDF(params);
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
  informacion: [],
  pagination: {},
  message: "",
};

const reportesSlice = createSlice({
  name: "reportes",
  initialState,
  reducers: {
    limpiarReportes: (state) => {
      state.informacion = [];
      state.pagination = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportesParticipaciones.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reportesParticipaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.informacion = action.payload.participaciones;
        state.pagination = action.payload.pagination;
      })
      .addCase(reportesPostulaciones.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reportesPostulaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.informacion = action.payload.postulaciones;
        state.pagination = action.payload.pagination;
      })
      .addCase(reportesConvocatorias.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reportesConvocatorias.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.informacion = action.payload.convocatorias;
        state.pagination = action.payload.pagination;
      })
      .addCase(reportesUsuarios.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reportesUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.informacion = action.payload.usuarios;
        state.pagination = action.payload.pagination;
      })
      .addCase(resetState, (state) => {
        state.convocatoriasEdicion = [];
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export const { limpiarReportes } = reportesSlice.actions;

export default reportesSlice.reducer;
