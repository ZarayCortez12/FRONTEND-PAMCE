import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import RubricasService from "./rubricas.service";

export const listarRubricasPorCategoriaEdicion = createAsyncThunk(
  "rubricas/listarRubricasPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      return await RubricasService.listarRubricasPorCategoriaEdicion(
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

export const crearRubrica = createAsyncThunk(
  "rubricas/crearRubrica",
  async (rubrica, thunkAPI) => {
    try {
      const response = await RubricasService.crearRubrica(rubrica);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const crearRubricaCriterio = createAsyncThunk(
  "rubricas/crearRubricaCriterio",
  async ({ id_rubrica, id_criterio }, thunkAPI) => {
    try {
      const response = await RubricasService.crearRubricaCriterio(
        id_rubrica,
        id_criterio,
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

export const agregarRubricaAEdicionCategoria = createAsyncThunk(
  "rubricas/agregarRubricaAEdicionCategoria",
  async ({ id_edicion_categoria, datos }, thunkAPI) => {
    try {
      const response = await RubricasService.agregarRubricaAEdicionCategoria(
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

export const agregarPorcentajeCriterio = createAsyncThunk(
  "rubricas/agregarPorcentajeCriterio",
  async ({ id_edicion_categoria, datos }, thunkAPI) => {
    try {
      const response = await RubricasService.agregarPorcentajeCriterio(
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

export const listarRubricas = createAsyncThunk(
  "rubricas/listarRubricas",
  async (_, thunkAPI) => {
    try {
      return await RubricasService.listarRubricas();
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerRubricaCriterios = createAsyncThunk(
  "rubricas/obtenerRubricaCriterios",
  async (id_rubrica, thunkAPI) => {
    try {
      const response =
        await RubricasService.obtenerRubricaCriterios(id_rubrica);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarPorcentajeRubrica = createAsyncThunk(
  "rubricas/editarPorcentajeRubrica",
  async (data, thunkAPI) => {
    try {
      const response = await RubricasService.editarPorcentajeRubrica(
        data.id_ecr,
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

export const eliminarRubricaDeEdicionCategoria = createAsyncThunk(
  "rubricas/eliminarRubricaDeEdicionCategoria",
  async (data, thunkAPI) => {
    try {
      const response = await RubricasService.eliminarRubricaDeEdicionCategoria(
        data.id_edicion_categoria,
        data.id_ecr,
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
  rubricas_categoria_edicion: [],
  pagination_rubricas_categoria_edicion: {},
  rubricas: [],
  pagination_rubricas: {},
  rubrica_criterio: {},
  rubrica: null,
  message: "",
  loading: false,
  total_porcentaje_rubricas: 0,
};

const rubricasSlice = createSlice({
  name: "rubricas",
  initialState,
  reducers: {
    limpiarRubricasPorCategoriaEdicion: (state) => {
      state.rubricas = [];
      state.pagination_rubricas = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarRubricasPorCategoriaEdicion.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(listarRubricasPorCategoriaEdicion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.rubricas_categoria_edicion = action.payload.rubricas;
        state.pagination_rubricas_categoria_edicion = action.payload.pagination;
        state.total_porcentaje_rubricas = Number(
          action.payload.total_porcentaje_rubricas ?? 0,
        );
      })
      .addCase(crearRubrica.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al agregar rúbrica";
      })
      .addCase(crearRubricaCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.rubrica_criterio = action.payload.rubrica;
      })
      .addCase(agregarRubricaAEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(listarRubricas.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.rubricas = action.payload.rubricas;
        state.pagination_rubricas = action.payload.pagination;
      })
      .addCase(obtenerRubricaCriterios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.rubrica = action.payload.rubrica;
      })
      .addCase(eliminarRubricaDeEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const idEliminado = action.payload.id_ecr;
        state.rubricas_categoria_edicion =
          state.rubricas_categoria_edicion.filter(
            (rubrica) => rubrica.id_ecr !== idEliminado,
          );
      })
      .addCase(resetState, (state) => {
        state.rubricas = [];
        state.message = "";
        state.loading = false;
        state.pagination_rubricas = {};
      });
  },
});

export const { limpiarRubricasPorCategoriaEdicion } = rubricasSlice.actions;

export default rubricasSlice.reducer;
