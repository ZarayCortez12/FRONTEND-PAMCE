import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import CriteriosService from "./criterios.service";

export const listarCriteriosPorRubricaPorCategoriaEdicion = createAsyncThunk(
  "criterios/listarCriteriosPorRubricaPorCategoriaEdicion",
  async ({ id_edicion_categoria, id_rubrica, params }, thunkAPI) => {
    try {
      return await CriteriosService.listarCriteriosPorRubricaPorCategoriaEdicion(
        id_rubrica,
        id_edicion_categoria,
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

export const crearCriterio = createAsyncThunk(
  "criterios/crearCriterio",
  async (criterio, thunkAPI) => {
    try {
      const response = await CriteriosService.crearCriterio(criterio);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarPorcentajeCriterio = createAsyncThunk(
  "criterios/agregarPorcentajeCriterio",
  async ({ id_edicion_categoria, datos }, thunkAPI) => {
    try {
      const response = await CriteriosService.agregarPorcentajeCriterio(
        id_edicion_categoria,
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

export const editarPorcentajeCriterio = createAsyncThunk(
  "criterios/editarPorcentajeCriterio",
  async (data, thunkAPI) => {
    try {
      const response = await CriteriosService.editarPorcentajeCriterio(
        data.id_ecrc,
        data.porcentaje,
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

export const resetState = createAction("Reset_all");

const initialState = {
  criterios: [],
  pagination_criterios: {},
  message: "",
  loading: false,
};

const rubricasSlice = createSlice({
  name: "rubricas",
  initialState,
  reducers: {
    limpiarCriteriosPorRubricaPorCategoriaEdicion: (state) => {
      state.criterios = [];
      state.pagination_criterios = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        listarCriteriosPorRubricaPorCategoriaEdicion.pending,
        (state, action) => {
          state.loading = true;
        },
      )
      .addCase(
        listarCriteriosPorRubricaPorCategoriaEdicion.fulfilled,
        (state, action) => {
          state.loading = false;
          state.message = action.payload.message;
          state.criterios = action.payload.criterios;
          state.pagination_criterios = action.payload.pagination;
        },
      )
      .addCase(crearCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(editarPorcentajeCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetState, (state) => {
        state.criterios = [];
        state.message = "";
        state.loading = false;
        state.pagination_criterios = {};
      });
  },
});

export const { limpiarCriteriosPorRubricaPorCategoriaEdicion } =
  rubricasSlice.actions;

export default rubricasSlice.reducer;
