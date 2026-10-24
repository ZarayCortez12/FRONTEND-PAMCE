import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import RequisitosService from "./requisitos.service";

export const listarRequisitosPorCategoriaEdicion = createAsyncThunk(
  "requisitos/listarRequisitosPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      return await RequisitosService.listarRequisitosPorCategoriaEdicion(
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

export const obtenerConfiguracionRequisitoDeCategoriaEdicion = createAsyncThunk(
  "requisitos/obtenerConfiguracionRequisitoDeCategoriaEdicion",
  async (id_requisito_edicion_categoria, thunkAPI) => {
    try {
      return await RequisitosService.obtenerConfiguracionRequisitoDeCategoriaEdicion(
        id_requisito_edicion_categoria,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarRequisitosEdicion = createAsyncThunk(
  "requisitos/listarRequisitosEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await RequisitosService.listarRequisitosEdicion(
        id_edicion,
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

export const filtrarRequisitosEdicion = createAsyncThunk(
  "requisitos/filtrarRequisitosEdicion",
  async ({ idEdicion, filtros }, thunkAPI) => {
    try {
      return await RequisitosService.filtrarRequisitosEdicion(
        idEdicion,
        filtros,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const crearRequisito = createAsyncThunk(
  "requisitos/crearRequisito",
  async (descripcion, thunkAPI) => {
    try {
      return await RequisitosService.crearRequisito(descripcion);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarRequisitoEdicion = createAsyncThunk(
  "requisitos/agregarRequisitoEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.agregarRequisitoEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarRequisito = createAsyncThunk(
  "requisitos/editarRequisito",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.editarRequisito(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarRequisitoCategoriaEdicion = createAsyncThunk(
  "requisitos/editarRequisitoCategoriaEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.editarRequisitoCategoriaEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarRequisitoEdicion = createAsyncThunk(
  "requisitos/editarRequisitoEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.editarRequisitoEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarConfiguracionRequisitoCategoriaEdicion = createAsyncThunk(
  "requisitos/editarConfiguracionRequisitoCategoriaEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.editarConfiguracionRequisitoCategoriaEdicion(
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

export const editarConfiguracionRequisitoEdicion = createAsyncThunk(
  "requisitos/editarConfiguracionRequisitoEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.editarConfiguracionRequisitoEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const eliminarRequisito = createAsyncThunk(
  "requisitos/eliminarRequisito",
  async (id, thunkAPI) => {
    try {
      return await RequisitosService.eliminarRequisito(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const filtrarRequisitosEdicionCategoria = createAsyncThunk(
  "requisitos/filtrarRequisitosEdicionCategoria",
  async ({ idEdicionCategoria, filtros }, thunkAPI) => {
    try {
      return await RequisitosService.filtrarRequisitosEdicionCategoria(
        idEdicionCategoria,
        filtros,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarRequisitoCategoriaEdicion = createAsyncThunk(
  "requisitos/agregarRequisitoCategoriaEdicion",
  async (data, thunkAPI) => {
    try {
      return await RequisitosService.agregarRequisitoCategoriaEdicion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const eliminarRequisitoCategoriaEdicion = createAsyncThunk(
  "requisitos/eliminarRequisitoCategoriaEdicion",
  async (id_requisito_edicion_categoria, thunkAPI) => {
    try {
      return await RequisitosService.eliminarRequisitoCategoriaEdicion(
        id_requisito_edicion_categoria,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const eliminarRequisitoEdicion = createAsyncThunk(
  "requisitos/eliminarRequisitoEdicion",
  async (id_requisito_edicion, thunkAPI) => {
    try {
      return await RequisitosService.eliminarRequisitoEdicion(
        id_requisito_edicion,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarRequisitosEdicionInscripcion = createAsyncThunk(
  "requisitos/listarRequisitosEdicionInscripcion",
  async ({ id_edicion, token }, thunkAPI) => {
    try {
      return await RequisitosService.listarRequisitosEdicionInscripcion(
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

export const listarRequisitosPorCategoriaEdicionInscripcion = createAsyncThunk(
  "requisitos/listarRequisitosPorCategoriaEdicionInscripcion",
  async ({ id_edicion_categoria, id_edicion, token }, thunkAPI) => {
    try {
      return await RequisitosService.listarRequisitosPorCategoriaEdicionInscripcion(
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

export const resetState = createAction("Reset_all");

const initialState = {
  loading_requisitos_categoria: false,
  requisitos_categoria: [],
  pagination_requisitos_categoria: {},
  configuracion: [],
  requisitos_edicion: [],
  pagination_requisitos_edicion: {},
  loading_requisitos_edicion: false,

  requisitosEdicion: [],
  requisitosEdiciones: [],
  requisitosCategorias: [],
  requisitosEdicionCategoria: [],
  requisitosEdicionInscripcion: [],
  requisitosEdicionCategoriaInscripcion: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const requisitosSlice = createSlice({
  name: "requisitos",
  initialState,
  reducers: {
    limpiarRequisitosEdicionCategoria: (state) => {
      state.requisitosEdicionCategoria = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarRequisitosPorCategoriaEdicion.pending, (state) => {
        state.loading_requisitos_categoria = true;
      })
      .addCase(
        listarRequisitosPorCategoriaEdicion.fulfilled,
        (state, action) => {
          state.loading_requisitos_categoria = false;
          state.message = action.payload.message;
          state.requisitos_categoria = action.payload.requisitos;
          state.pagination_requisitos_categoria = action.payload.pagination;
        },
      )
      .addCase(
        obtenerConfiguracionRequisitoDeCategoriaEdicion.fulfilled,
        (state, action) => {
          state.message = action.payload.message;
          state.configuracion = action.payload.configuracion;
        },
      )
      .addCase(listarRequisitosEdicion.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
        state.loading_requisitos_edicion = true;
      })
      .addCase(listarRequisitosEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.loading_requisitos_edicion = false;
        state.message = action.payload.message;
        state.requisitos_edicion = action.payload.requisitos;
        state.pagination_requisitos_edicion = action.payload.pagination;
      })
      .addCase(listarRequisitosEdicion.rejected, (state, action) => {
        state.loading_requisitos_edicion = false;
        state.requisitos_edicion = [];
      })
      .addCase(filtrarRequisitosEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.requisitosEdicion = action.payload.requisitosEdicion;
      })
      .addCase(filtrarRequisitosEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al filtrar requisitos";
      })
      .addCase(crearRequisito.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
      })
      .addCase(crearRequisito.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al crear requisito";
      })
      .addCase(agregarRequisitoEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.requisito) {
          state.requisitos_edicion.push(action.payload.requisito);
        }
      })
      .addCase(agregarRequisitoEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al agregar requisito";
      })
      .addCase(editarRequisito.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.requisito) {
          const updatedRequisitoIndex = state.requisitosEdicion.findIndex(
            (requisito) =>
              requisito.id_requisito_edicion ===
              action.payload.requisito.id_requisito_edicion,
          );

          if (updatedRequisitoIndex !== -1) {
            state.requisitosEdicion[updatedRequisitoIndex] =
              action.payload.requisito;
          } else {
            state.requisitosEdicion.push(action.payload.requisito);
          }
        }
      })
      .addCase(editarRequisito.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al editar requisito";
      })
      .addCase(editarRequisitoCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Requisito actualizado correctamente";
        if (action.payload.requisito) {
          const updatedRequisitoIndex = state.requisitos_categoria.findIndex(
            (requisito) =>
              requisito.id_requisito_edicion_categoria ===
              action.payload.requisito.id_requisito_edicion_categoria,
          );

          if (updatedRequisitoIndex !== -1) {
            state.requisitos_categoria[updatedRequisitoIndex] =
              action.payload.requisito;
          } else {
            state.requisitos_categoria.push(action.payload.requisito);
          }
        }
      })
      .addCase(editarRequisitoEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message =
          action.payload.message || "Requisito actualizado correctamente";
        if (action.payload.requisito) {
          const updatedRequisitoIndex = state.requisitos_edicion.findIndex(
            (requisito) =>
              requisito.id_requisito_edicion ===
              action.payload.requisito.id_requisito_edicion,
          );
          if (updatedRequisitoIndex !== -1) {
            state.requisitos_edicion[updatedRequisitoIndex] =
              action.payload.requisito;
          } else {
            state.requisitos_edicion.push(action.payload.requisito);
          }
        }
      })
      .addCase(
        editarConfiguracionRequisitoCategoriaEdicion.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message =
            action.payload.message || "Requisito actualizado correctamente";
          if (action.payload.requisito) {
            const updatedRequisitoIndex = state.requisitos_categoria.findIndex(
              (requisito) =>
                requisito.id_requisito_edicion_categoria ===
                action.payload.requisito.id_requisito_edicion_categoria,
            );

            if (updatedRequisitoIndex !== -1) {
              state.requisitos_categoria[updatedRequisitoIndex] =
                action.payload.requisito;
            } else {
              state.requisitos_categoria.push(action.payload.requisito);
            }
          }
        },
      )
      .addCase(
        editarConfiguracionRequisitoEdicion.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message =
            action.payload.message || "Requisito actualizado correctamente";
          if (action.payload.requisito) {
            const updatedRequisitoIndex = state.requisitos_edicion.findIndex(
              (requisito) =>
                requisito.id_requisito_edicion ===
                action.payload.requisito.id_requisito_edicion,
            );
            if (updatedRequisitoIndex !== -1) {
              state.requisitos_edicion[updatedRequisitoIndex] =
                action.payload.requisito;
            } else {
              state.requisitos_edicion.push(action.payload.requisito);
            }
          }
        },
      )
      .addCase(editarRequisitoCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al editar requisito";
      })
      .addCase(eliminarRequisito.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.idEdicionRequisito) {
          state.requisitosEdicion = state.requisitosEdicion.filter(
            (requisito) =>
              String(requisito.id_requisito_edicion) !==
              String(action.payload.idEdicionRequisito),
          );
        }
      })
      .addCase(eliminarRequisito.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al eliminar requisito";
      })
      .addCase(eliminarRequisitoCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.id_requisito_edicion_categoria) {
          state.requisitos_categoria = state.requisitos_categoria.filter(
            (requisito) =>
              Number(requisito.id_requisito_edicion_categoria) !==
              Number(action.payload.id_requisito_edicion_categoria),
          );
        }
      })
      .addCase(eliminarRequisitoCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al eliminar requisito";
      })
      .addCase(eliminarRequisitoEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.id_requisito_edicion) {
          state.requisitos_edicion = state.requisitos_edicion.filter(
            (requisito) =>
              Number(requisito.id_requisito_edicion) !==
              Number(action.payload.id_requisito_edicion),
          );
        }
      })
      .addCase(filtrarRequisitosEdicionCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.requisitosEdicionCategoria =
          action.payload.requisitosEdicionCategoria;
      })
      .addCase(filtrarRequisitosEdicionCategoria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message =
          action.payload?.message || "Error al filtrar requisitos";
      })
      .addCase(agregarRequisitoCategoriaEdicion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.requisitoEdicionCategoria) {
          state.requisitosEdicionCategoria.push(
            action.payload.requisitoEdicionCategoria,
          );
        }
      })
      .addCase(agregarRequisitoCategoriaEdicion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al agregar requisito";
      })
      .addCase(listarRequisitosEdicionInscripcion.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(
        listarRequisitosEdicionInscripcion.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.requisitosEdicionInscripcion =
            action.payload.requisitosEdicionInscripcion;
        },
      )
      .addCase(listarRequisitosEdicionInscripcion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload?.message || "Error al cargar requisitos";
      })
      .addCase(
        listarRequisitosPorCategoriaEdicionInscripcion.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.requisitosEdicionCategoriaInscripcion =
            action.payload.requisitosEdicionCategoriaInscripcion ||
            action.payload ||
            [];
        },
      )
      .addCase(
        listarRequisitosPorCategoriaEdicionInscripcion.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.isExisting = false;
          state.message =
            action.payload?.message || "Error al cargar requisitos";
        },
      )
      .addCase(resetState, (state) => {
        state.requisitosEdicion = [];
        state.requisitosCategorias = [];
        state.requisitosEdicionCategoria = [];
        state.requisitosEdicionInscripcion = [];
        state.requisitosEdicionCategoriaInscripcion = [];
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      });
  },
});

export const { limpiarRequisitosEdicionCategoria } = requisitosSlice.actions;

export default requisitosSlice.reducer;
