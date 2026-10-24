import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import EvaluacionService from "./evaluacion.service";

export const listarRubricasPorCategoriaEdicion = createAsyncThunk(
  "evaluacion/listarRubricasPorCategoriaEdicion",
  async (id_edicion_categoria, thunkAPI) => {
    try {
      const response =
        await EvaluacionService.listarRubricasPorCategoriaEdicion(
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

export const listarRubricasConCriterios = createAsyncThunk(
  "evaluacion/listarRubricasConCriterios",
  async (_, thunkAPI) => {
    try {
      const response = await EvaluacionService.listarRubricasConCriterios();
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
  "evaluacion/editarPorcentajeCriterio",
  async (data, thunkAPI) => {
    try {
      const response = await EvaluacionService.editarPorcentajeCriterio(
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

export const listarRubricasFiltradasPorCategoria = createAsyncThunk(
  "evaluacion/listarRubricasFiltradasPorCategoria",
  async (id_edicion_categoria, thunkAPI) => {
    try {
      const response =
        await EvaluacionService.listarRubricasFiltradasPorCategoria(
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

export const agregarRubricaAEdicionCategoria = createAsyncThunk(
  "evaluacion/agregarRubricaAEdicionCategoria",
  async ({ id_edicion_categoria, datos }, thunkAPI) => {
    try {
      const response = await EvaluacionService.agregarRubricaAEdicionCategoria(
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
  "evaluacion/agregarPorcentajeCriterio",
  async ({ id_edicion_categoria, datos }, thunkAPI) => {
    try {
      const response = await EvaluacionService.agregarPorcentajeCriterio(
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

export const editarPorcentajeRubrica = createAsyncThunk(
  "evaluacion/editarPorcentajeRubrica",
  async (data, thunkAPI) => {
    try {
      const response = await EvaluacionService.editarPorcentajeRubrica(
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

export const eliminarRubricaAEdicionCategoria = createAsyncThunk(
  "evaluacion/eliminarRubricaAEdicionCategoria",
  async (data, thunkAPI) => {
    try {
      const response = await EvaluacionService.eliminarRubricaAEdicionCategoria(
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

export const crearRubrica = createAsyncThunk(
  "evaluacion/crearRubrica",
  async (rubrica, thunkAPI) => {
    try {
      const response = await EvaluacionService.crearRubrica(rubrica);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const crearCriterio = createAsyncThunk(
  "evaluacion/crearCriterio",
  async (criterio, thunkAPI) => {
    try {
      const response = await EvaluacionService.crearCriterio(criterio);
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
  "evaluacion/crearRubricaCriterio",
  async ({ id_rubrica, id_criterio }, thunkAPI) => {
    try {
      const response = await EvaluacionService.crearRubricaCriterio(
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

export const obtenerRubricaCriterio = createAsyncThunk(
  "evaluacion/obtenerRubricaCriterio",
  async (id_rubrica, thunkAPI) => {
    try {
      const response =
        await EvaluacionService.obtenerRubricaCriterio(id_rubrica);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEvaluacion = createAsyncThunk(
  "evaluacion/obtenerEvaluacion",
  async (id_participacion_jurado, thunkAPI) => {
    try {
      const response = await EvaluacionService.obtenerEvaluacion(
        id_participacion_jurado,
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

const initialState = {
  rubricas: [],
  rubricasCategoriaEdicion: [],
  rubricaCreada: null,
  evaluacion: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const evaluacionSlice = createSlice({
  name: "evaluacion",
  initialState,
  reducers: {
    limpiarRubricasCategoriaEdicion: (state) => {
      state.rubricasCategoriaEdicion = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarRubricasPorCategoriaEdicion.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(listarRubricasPorCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.rubricasCategoriaEdicion = action.payload.rubricas;
      })
      .addCase(listarRubricasPorCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(listarRubricasConCriterios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.rubricas = action.payload.rubricas;
      })
      .addCase(editarPorcentajeCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const criterioActualizado = action.payload.criterio;

        state.rubricasCategoriaEdicion.forEach((rubrica) => {
          rubrica.rubrica?.RubricaCriterios?.forEach((c) => {
            if (c.id_ecrc === criterioActualizado.id_ecrc) {
              c.porcentaje = criterioActualizado.porcentaje;
            }
          });
        });

        state.rubricasCategoriaEdicion.forEach((rubrica) => {
          rubrica.rubrica?.RubricaCriterios?.forEach((c) => {
            if (c.id === criterioActualizado.id) {
              c.porcentaje = criterioActualizado.porcentaje;
            }
          });
        });
      })
      .addCase(
        listarRubricasFiltradasPorCategoria.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.rubricas = action.payload.rubricas;
        },
      )
      .addCase(agregarRubricaAEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(agregarPorcentajeCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(editarPorcentajeRubrica.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(eliminarRubricaAEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const idEliminado = action.payload.id_ecr;
        state.rubricasCategoriaEdicion = state.rubricasCategoriaEdicion.filter(
          (rubrica) => rubrica.id_ecr !== idEliminado,
        );
      })
      .addCase(crearRubrica.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.rubricaCreada = action.payload.rubrica;
      })
      .addCase(crearCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(crearRubricaCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(obtenerRubricaCriterio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(obtenerEvaluacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.evaluacion = action.payload.evaluaciones;
      });
  },
});

export const { limpiarRubricasCategoriaEdicion } = evaluacionSlice.actions;

export default evaluacionSlice.reducer;
