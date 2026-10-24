import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import CategoriasService from "./categoria.service";

export const listarCategoriasPorEdicion = createAsyncThunk(
  "categorias/listarCategoriasPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await CategoriasService.listarCategoriasPorEdicion(
        id_edicion,
        params,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        pagination: error.response?.data?.pagination || {},
      });
    }
  },
);

export const obtenerCategoria = createAsyncThunk(
  "categorias/obtenerCategoria",
  async (id_edicion_categoria, thunkAPI) => {
    try {
      return await CategoriasService.obtenerCategoria(id_edicion_categoria);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarRubricasPorCategoriaEdicion = createAsyncThunk(
  "categorias/listarRubricasPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      return await CategoriasService.listarRubricasPorCategoriaEdicion(
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

export const listarCategorias = createAsyncThunk(
  "categorias/listarCategorias",
  async (id, thunkAPI) => {
    try {
      return await CategoriasService.listarCategorias(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const cambiarEstado = createAsyncThunk(
  "categorias/cambiarEstado",
  async (data, thunkAPI) => {
    try {
      return await CategoriasService.cambiarEstado(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarCategoria = createAsyncThunk(
  "categorias/agregarCategoria",
  async (data, thunkAPI) => {
    try {
      return await CategoriasService.agregarCategoria(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarCategoriaEdicion = createAsyncThunk(
  "categorias/agregarCategoriaEdicion",
  async (data, thunkAPI) => {
    try {
      return await CategoriasService.agregarCategoriaEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarCategoriaEdicion = createAsyncThunk(
  "categorias/editarCategoriaEdicion",
  async ({ id_edicion_categoria, data }, thunkAPI) => {
    try {
      return await CategoriasService.editarCategoriaEdicion(
        id_edicion_categoria,
        data,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const eliminarCategoriaEdicion = createAsyncThunk(
  "categorias/eliminarCategoriaEdicion",
  async (id, thunkAPI) => {
    try {
      return await CategoriasService.eliminarCategoriaEdicion(id);
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
  categorias_edicion: [],
  pagination: {},
  loading: false,
  categoria: undefined,
  loadingCategoria: false,
  errorCategoria: null,
  rubricas: [],
  pagination_rubricas: {},
  categorias: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const categoriasSlice = createSlice({
  name: "categorias",
  initialState,
  reducers: {
    limpiarCategoriasEdicion: (state) => {
      state.categorias_edicion = [];
      state.pagination = {};
    },
    limpiarRubricasPorCategoriaEdicion: (state) => {
      state.rubricas = [];
      state.pagination_rubricas = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarCategoriasPorEdicion.pending, (state) => {
        state.loading = true;
      })
      .addCase(listarCategoriasPorEdicion.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.categorias_edicion = action.payload.categorias;
        state.pagination = action.payload.pagination;
      })
      .addCase(listarCategoriasPorEdicion.rejected, (state, action) => {
        state.loading = false;
        state.categorias_edicion = [];
        state.pagination = action.payload.pagination;
      })
      .addCase(obtenerCategoria.pending, (state) => {
        state.loadingCategoria = true;
        state.errorCategoria = null;
        state.categoria = undefined;
      })
      .addCase(obtenerCategoria.fulfilled, (state, action) => {
        state.loadingCategoria = false;
        state.categoria = action.payload?.categoria ?? null;
        state.errorCategoria = null;

        state.isSuccess = true;
        state.isExisting = Boolean(state.categoria);
        state.message = action.payload?.message || "";
      })
      .addCase(obtenerCategoria.rejected, (state, action) => {
        state.loadingCategoria = false;

        if (action.payload?.status === 404) {
          state.categoria = null;
          state.errorCategoria = null;
        } else {
          state.categoria = undefined;
          state.errorCategoria =
            action.payload?.message || "No fue posible consultar la categoría.";
        }

        state.isSuccess = false;
        state.isExisting = false;
      })
      .addCase(listarRubricasPorCategoriaEdicion.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.rubricas = action.payload.rubricas;
        state.pagination_rubricas = action.payload.pagination;
      })
      .addCase(listarCategorias.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(listarCategorias.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categorias cargadas correctamente";
        state.categorias = action.payload.categorias || action.payload || [];
      })
      .addCase(listarCategorias.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al cargar categorias";
      })
      .addCase(agregarCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categoria agregada correctamente";
      })
      .addCase(agregarCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al agregar categoria";
      })
      .addCase(agregarCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categoria agregada correctamente";
        if (action.payload.categoria) {
          state.categorias_edicion.push(action.payload.categoria);
        }
      })
      .addCase(agregarCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al agregar categoria";
      })
      .addCase(editarCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categoria editada correctamente";

        if (action.payload.categoria) {
          const updateCategoriaIndex = state.categorias_edicion.findIndex(
            (categoria) =>
              categoria.id_categoria === action.payload.categoria.id_categoria,
          );

          if (updateCategoriaIndex !== -1) {
            state.categorias_edicion[updateCategoriaIndex] =
              action.payload.categoria;
          } else {
            state.categorias_edicion.push(action.payload.categoria);
          }
        }
      })
      .addCase(editarCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al editar categoria";
      })
      .addCase(eliminarCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categoria eliminada correctamente";

        if (action.payload.id_edicion_categoria) {
          state.categorias_edicion = state.categorias_edicion.filter(
            (categoria) =>
              String(categoria.edicionesCategoria[0]?.id_edicion_categoria) !==
              String(action.payload.id_edicion_categoria),
          );
        }
      })
      .addCase(eliminarCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al eliminar categoria";
      })
      .addCase(cambiarEstado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Categoria desactivada correctamente";
        if (action.payload.categoria) {
          const updateCategoriaIndex = state.categorias_edicion.findIndex(
            (categoria) =>
              categoria.id_categoria === action.payload.categoria.id_categoria,
          );

          if (updateCategoriaIndex !== -1) {
            state.categorias_edicion[updateCategoriaIndex] =
              action.payload.categoria;
          } else {
            state.categorias_edicion.push(action.payload.categoria);
          }
        }
      })
      .addCase(cambiarEstado.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al desactivar categoria";
      })
      .addCase(resetState, (state) => {
        state.categorias = [];
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export const { limpiarCategoriasEdicion, limpiarRubricasPorCategoriaEdicion } =
  categoriasSlice.actions;

export default categoriasSlice.reducer;
