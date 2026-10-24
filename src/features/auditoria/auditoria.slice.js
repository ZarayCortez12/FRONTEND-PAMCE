import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuditoriaService from "./auditoria.service";

export const listarRegistrosAuditoria = createAsyncThunk(
  "auditoria/listarRegistrosAuditoria",
  async ({ params }, thunkAPI) => {
    try {
      const response = await AuditoriaService.listarRegistrosAuditoria(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerRegistroAuditoria = createAsyncThunk(
  "auditoria/obtenerRegistroAuditoria",
  async (id_registro, thunkAPI) => {
    try {
      const response =
        await AuditoriaService.obtenerRegistroAuditoria(id_registro);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

const initialState = {
  loading_registros: false,
  registros: [],
  pagination_registros: {},
  registro: null,
  message: "",
};

const auditoriaSlice = createSlice({
  name: "auditoria",
  initialState,
  reducers: {
    limpiarRegistrosAuditoria: (state) => {
      state.registros = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarRegistrosAuditoria.pending, (state, action) => {
        state.loading_registros = true;
      })
      .addCase(listarRegistrosAuditoria.fulfilled, (state, action) => {
        state.loading_registros = false;
        state.message = action.payload.message;
        state.registros = action.payload.registros;
        state.pagination_registros = action.payload.pagination;
      })
      .addCase(obtenerRegistroAuditoria.fulfilled, (state, action) => {
        state.registro = action.payload.registro;
      });
  },
});

export const { limpiarRegistrosAuditoria } = auditoriaSlice.actions;

export default auditoriaSlice.reducer;
