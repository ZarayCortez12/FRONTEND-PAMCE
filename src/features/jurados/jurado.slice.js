import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import JuradoService from "./jurado.service";

export const listarJuradosPorEdicion = createAsyncThunk(
  "jurados/listarJuradosPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      const response = await JuradoService.listarJuradosPorEdicion(
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

export const listarJuradosPorCategoriaEdicion = createAsyncThunk(
  "jurados/listarJuradosPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      const response = await JuradoService.listarJuradosPorCategoriaEdicion(
        id_edicion_categoria,
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

export const listarJurados = createAsyncThunk(
  "jurados/listarJurados",
  async (params, thunkAPI) => {
    try {
      const response = await JuradoService.listarJurados(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarJuradosDisponiblesParaAsignar = createAsyncThunk(
  "jurados/listarJuradosDisponiblesParaAsignar",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      const response = await JuradoService.listarJuradosDisponiblesParaAsignar(
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

export const agregarJurado = createAsyncThunk(
  "jurados/agregarJurado",
  async (data, thunkAPI) => {
    try {
      const response = await JuradoService.agregarJurado(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarInformacionJurado = createAsyncThunk(
  "jurados/editarInformacionJurado",
  async (data, thunkAPI) => {
    try {
      const response = await JuradoService.editarInformacionJurado(
        data.numero_documento,
        data,
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

export const cambiarEstadoJurado = createAsyncThunk(
  "jurados/cambiarEstadoJurado",
  async (datos, thunkAPI) => {
    try {
      const response = await JuradoService.cambiarEstadoJurado(datos);
      return response;
    } catch (error) {
      console.log("Error al cambiar estado slice", error);
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerJurado = createAsyncThunk(
  "jurados/obtenerJurado",
  async (id_jurado, thunkAPI) => {
    try {
      const response = await JuradoService.obtenerJurado(id_jurado);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerEdicionesParticipacionJurado = createAsyncThunk(
  "jurados/obtenerEdicionesParticipacionJurado",
  async ({ id_jurado, params }, thunkAPI) => {
    try {
      const response = await JuradoService.obtenerEdicionesParticipacionJurado(
        id_jurado,
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

export const obtenerCategoriasEdicionesParticipacionJurado = createAsyncThunk(
  "jurados/obtenerCategoriasEdicionesParticipacionJurado",
  async ({ id_edicion, id_jurado }, thunkAPI) => {
    try {
      const response =
        await JuradoService.obtenerCategoriasEdicionesParticipacionJurado(
          id_edicion,
          id_jurado,
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

export const obtenerParticipacionesEdicion = createAsyncThunk(
  "jurados/obtenerParticipacionesEdicion",
  async ({ id, params }, thunkAPI) => {
    try {
      return await JuradoService.obtenerParticipacionesEdicion(id, params);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerCategoriasParticipacionJurado = createAsyncThunk(
  "jurados/obtenerCategoriasParticipacionJurado",
  async ({ id_edicion, id_jurado }, thunkAPI) => {
    try {
      return await JuradoService.obtenerCategoriasParticipacionJurado(
        id_edicion,
        id_jurado,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerParticipacionesEvaluadasJurado = createAsyncThunk(
  "jurados/obtenerParticipacionesEvaluadasJurado",
  async ({ id_jurado, params }, thunkAPI) => {
    try {
      return await JuradoService.obtenerParticipacionesEvaluadasJurado(
        id_jurado,
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

export const registrarEvaluacion = createAsyncThunk(
  "jurados/registrarEvaluacion",
  async (data, thunkAPI) => {
    try {
      const response = await JuradoService.registrarEvaluacion(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarEvaluacion = createAsyncThunk(
  "jurados/editarEvaluacion",
  async (data, thunkAPI) => {
    try {
      const response = await JuradoService.editarEvaluacion(data);
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
  loading_jurados_categoria: false,
  loading_jurados_edicion: false,
  loading_jurados: false,
  jurados_edicion: [],
  pagination_jurados_edicion: {},
  jurados_categoria: [],
  pagination_jurados_categoria: {},
  jurados: [],
  pagination_jurados: {},
  jurado: undefined,
  loadingJurado: false,
  ediciones: [],
  categorias: [],
  participaciones: [],
  pagination_participaciones: {},

  juradoObtenido: null,
  juradosPorEdicionCategoria: [],
  juradosPorEdicion: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const juradosSlice = createSlice({
  name: "jurados",
  initialState,
  reducers: {
    limpiarJuradosPorEdicionCategoria: (state) => {
      state.juradosPorEdicionCategoria = [];
    },
    limpiarJuradosPorEdicion: (state) => {
      state.jurados_edicion = [];
      state.pagination_jurados_edicion = {};
    },
    limpiarJuradoObtenido: (state) => {
      state.juradoObtenido = null;
    },
    limpiarCategoriasParticionJurado: (state) => {
      state.categorias = [];
    },
    limpiarParticipacionesEvaluadasJurado: (state) => {
      state.participaciones = [];
      state.pagination_participaciones = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarJuradosPorEdicion.pending, (state, action) => {
        state.loading_jurados_edicion = true;
      })
      .addCase(listarJuradosPorEdicion.fulfilled, (state, action) => {
        state.loading_jurados_edicion = false;
        state.message = action.payload.message;
        state.jurados_edicion = action.payload.jurados;
        state.pagination_jurados_edicion = action.payload.pagination;
      })
      .addCase(listarJuradosPorCategoriaEdicion.pending, (state) => {
        state.loading_jurados_categoria = true;
      })
      .addCase(listarJuradosPorCategoriaEdicion.fulfilled, (state, action) => {
        state.loading_jurados_categoria = false;
        state.message = action.payload.message;
        state.jurados_categoria = action.payload.jurados;
        state.pagination_jurados_categoria = action.payload.pagination;
      })

      .addCase(listarJurados.pending, (state) => {
        state.loading_jurados = true;
      })
      .addCase(listarJurados.fulfilled, (state, action) => {
        state.loading_jurados = false;
        state.message = action.payload.message;
        state.jurados = action.payload.jurados;
        state.pagination_jurados = action.payload.pagination;
      })
      .addCase(
        listarJuradosDisponiblesParaAsignar.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.jurados = action.payload.jurados;
        },
      )
      .addCase(agregarJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.usuario) {
          state.jurados.push(action.payload.usuario);
        }
      })
      .addCase(editarInformacionJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.jurado) {
          const updatedJuradoIndex = state.jurados.findIndex(
            (jurado) => jurado.id_usuario === action.payload.jurado.id_usuario,
          );

          if (updatedJuradoIndex !== -1) {
            state.jurados[updatedJuradoIndex] = action.payload.jurado;
          } else {
            state.jurados.push(action.payload.jurado);
          }
        }
      })
      .addCase(cambiarEstadoJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.jurado) {
          const updatedJuradoIndex = state.jurados.findIndex(
            (jurado) => jurado.id_usuario === action.payload.jurado.id_usuario,
          );

          if (updatedJuradoIndex !== -1) {
            state.jurados[updatedJuradoIndex] = action.payload.jurado;
          } else {
            state.jurados.push(action.payload.jurado);
          }
        }
      })
      .addCase(obtenerJurado.pending, (state) => {
        state.loadingJurado = true;
        state.jurado = undefined;
      })
      .addCase(obtenerJurado.fulfilled, (state, action) => {
        state.loadingJurado = false;
        state.jurado = action.payload?.jurado ?? null;
      })
      .addCase(obtenerJurado.rejected, (state) => {
        state.loadingJurado = false;
        state.jurado = undefined;
      })
      .addCase(
        obtenerEdicionesParticipacionJurado.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.ediciones = action.payload.ediciones;
        },
      )
      .addCase(
        obtenerCategoriasEdicionesParticipacionJurado.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.categorias = action.payload.categorias;
        },
      )
      .addCase(
        obtenerParticipacionesEvaluadasJurado.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.participaciones = action.payload.participaciones;
          state.pagination_participaciones = action.payload.pagination;
        },
      )
      .addCase(obtenerParticipacionesEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participaciones = action.payload.participaciones;
        state.pagination_participaciones = action.payload.pagination;
      })
      .addCase(
        obtenerCategoriasParticipacionJurado.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.categorias = action.payload.categorias;
        },
      )
      .addCase(registrarEvaluacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
      })
      .addCase(editarEvaluacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
      });
  },
});

export const {
  limpiarJuradosPorEdicionCategoria,
  limpiarJuradosPorEdicion,
  limpiarJuradoObtenido,
  limpiarCategoriasParticionJurado,
  limpiarParticipacionesEvaluadasJurado,
} = juradosSlice.actions;

export default juradosSlice.reducer;
