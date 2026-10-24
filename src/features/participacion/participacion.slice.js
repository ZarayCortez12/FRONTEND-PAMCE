import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import ParticipacionService from "./participacion.service";

export const listarParticipacionesPorEdicion = createAsyncThunk(
  "participacion/listarParticipacionesPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarParticipacionesPorEdicion(
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

export const listarConvocatoriasPorEdicion = createAsyncThunk(
  "participacion/listarConvocatoriasPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarConvocatoriasPorEdicion(
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

export const listarParticipacionesGanadorasPorEdicionCategoria =
  createAsyncThunk(
    "participacion/listarParticipacionesGanadorasPorEdicionCategoria",
    async ({ id_edicion_categoria, params }, thunkAPI) => {
      try {
        return await ParticipacionService.listarParticipacionesGanadorasPorEdicionCategoria(
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

export const listarPostulacionesPorCategoriaEdicion = createAsyncThunk(
  "participacion/listarPostulacionesPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarPostulacionesPorCategoriaEdicion(
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

export const listarParticipacionesPorCategoriaEdicion = createAsyncThunk(
  "participacion/listarParticipacionesPorCategoriaEdicion",
  async ({ id_edicion_categoria, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarParticipacionesPorCategoriaEdicion(
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

export const listarPostulacionesPorEdicion = createAsyncThunk(
  "participacion/listarPostulacionesPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarPostulacionesPorEdicion(
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

export const listarParticipacionesGanadorasPorEdicion = createAsyncThunk(
  "participacion/listarParticipacionesGanadorasPorEdicion",
  async ({ id_edicion, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarParticipacionesGanadorasPorEdicion(
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

export const editarRespuestaRequisitoDocumento = createAsyncThunk(
  "participacion/editarRespuestaRequisitoDocumento",
  async ({ id_participacion_requisito, formData }, thunkAPI) => {
    try {
      return await ParticipacionService.editarRespuestaRequisitoDocumento(
        id_participacion_requisito,
        formData,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarPostulaciones = createAsyncThunk(
  "participacion/listarPostulacioes",
  async (id, thunkAPI) => {
    try {
      return await ParticipacionService.listarPostulaciones(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerParticipacion = createAsyncThunk(
  "participacion/obtenerParticipacion",
  async (id, thunkAPI) => {
    try {
      return await ParticipacionService.obtenerParticipacion(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerParticipacionAEvaluar = createAsyncThunk(
  "participacion/obtenerParticipacionAEvaluar",
  async (id, thunkAPI) => {
    try {
      return await ParticipacionService.obtenerParticipacionAEvaluar(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerParticipacionParticipante = createAsyncThunk(
  "participacion/obtenerParticipacionParticipante",
  async (id, thunkAPI) => {
    try {
      return await ParticipacionService.obtenerParticipacionParticipante(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const mostrarDocumento = createAsyncThunk(
  "participacion/mostrarDocumento",
  async (id, thunkAPI) => {
    try {
      return await ParticipacionService.mostrarDocumento(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const cambiarEstadoParticipacion = createAsyncThunk(
  "participacion/cambiarEstadoParticipacion",
  async ({ id, datos }, thunkAPI) => {
    try {
      return await ParticipacionService.cambiarEstadoParticipacion(id, datos);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const actualizarComentarios = createAsyncThunk(
  "participacion/actualizarComentarios",
  async ({ id, datos }, thunkAPI) => {
    try {
      return await ParticipacionService.actualizarComentarios(id, datos);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarJuradoAParticipacion = createAsyncThunk(
  "participacion/agregarJuradoAParticipacion",
  async ({ id, id_jurado }, thunkAPI) => {
    try {
      return await ParticipacionService.agregarJuradoAParticipacion({
        id,
        id_jurado,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const cambiarEstadoAsignacionJurado = createAsyncThunk(
  "participacion/cambiarEstadoAsignacionJurado",
  async ({ id_participacion_jurado, estado }, thunkAPI) => {
    try {
      return await ParticipacionService.cambiarEstadoAsignacionJurado(
        id_participacion_jurado,
        estado,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarParticipacionesPorCategoria = createAsyncThunk(
  "participacion/listarParticipacionesPorCategoria",
  async ({ id_edicion_categoria }, thunkAPI) => {
    try {
      return await ParticipacionService.listarParticipacionesPorCategoria(
        id_edicion_categoria,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const listarJuradosParticipacion = createAsyncThunk(
  "participacion/listarJuradosParticipacion",
  async ({ id_participacion, params }, thunkAPI) => {
    try {
      return await ParticipacionService.listarJuradosParticipacion(
        id_participacion,
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

export const resetState = createAction("Reset_all");

const initialState = {
  loading_participaciones_edicion: false,
  loading_convocatorias: false,
  loading_participaciones_categoria: false,
  loading_postulaciones_categoria: false,
  loading_postulaciones_edicion: false,
  loading_participaciones_ganadoras_edicion: false,
  participaciones_edicion: [],
  pagination_participaciones_edicion: {},
  convocatorias: [],
  pagination_convocatorias: {},
  participaciones_ganadoras: [],
  pagination_participaciones_ganadoras: {},
  postulaciones_categoria: [],
  pagination_postulaciones_categoria: {},
  participaciones_categoria: [],
  pagination_participaciones_categoria: {},
  postulaciones_edicion: [],
  pagination_postulaciones_edicion: {},
  participaciones_ganadoras_edicion: [],
  pagination_participaciones_ganadoras_edicion: {},
  postulaciones_pendientes_edicion: [],
  postulaciones_rechazadas_edicion: [],
  participacion: undefined,
  loadingParticipacion: false,
  errorParticipacion: null,
  jurados_participacion: [],
  pagination_jurados_participacion: {},

  convocatoriasEdicion: [],
  participacionObtenida: null,
  postulacionesEdicion: [],
  participacionesEdicion: [],
  postulacionesPorEdicionCategoria: [],
  participacionesPorEdicionCategoria: [],
  documento: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const participacionSlice = createSlice({
  name: "participacion",
  initialState,
  reducers: {
    limpiarParticipacionesPorEdicion: (state) => {
      state.participaciones_edicion = [];
      state.pagination_participaciones_edicion = {};
    },
    limpiarConvocatoriasPorEdicion: (state) => {
      state.convocatorias = [];
      state.pagination_convocatorias = {};
    },
    limpiarParticipacionesGanadorasPorEdicionCategoria: (state) => {
      state.participaciones_ganadoras = [];
      state.pagination_participaciones_ganadoras = {};
    },
    limpiarPostulacionesPorEdicion: (state) => {
      state.postulaciones_edicion = [];
      state.pagination_postulaciones_edicion = {};
    },
    limpiarPostulacionesPorEdicionCategoria: (state) => {
      state.postulacionesPorEdicionCategoria = [];
    },
    limpiarParticipacionesPorEdicionCategoria: (state) => {
      state.participacionesPorEdicionCategoria = [];
    },
    limpiarParticipacionesGanadorasPorEdicion: (state) => {
      state.participaciones_ganadoras_edicion = [];
      state.pagination_participaciones_ganadoras_edicion = {};
    },
    limpiarParticipaciones: (state) => {
      state.participacionesEdicion = [];
    },

    limpiarPostulaciones: (state) => {
      state.postulacionesEdicion = [];
    },
    limpiarConvocatorias: (state) => {
      state.convocatoriasEdicion = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarParticipacionesPorEdicion.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.participaciones_edicion = action.payload.participaciones;
        state.pagination_participaciones_edicion = action.payload.pagination;
      })
      .addCase(listarConvocatoriasPorEdicion.pending, (state, action) => {
        state.loading_convocatorias = true;
      })
      .addCase(listarConvocatoriasPorEdicion.fulfilled, (state, action) => {
        state.loading_convocatorias = false;
        state.message = action.payload.message;
        state.convocatorias = action.payload.convocatorias;
        state.pagination_convocatorias = action.payload.pagination;
      })
      .addCase(
        listarParticipacionesGanadorasPorEdicionCategoria.fulfilled,
        (state, action) => {
          state.message = action.payload.message;
          state.participaciones_ganadoras =
            action.payload.participaciones_ganadoras;
          state.pagination_participaciones_ganadoras =
            action.payload.pagination_participaciones_ganadoras;
        },
      )
      .addCase(listarPostulacionesPorCategoriaEdicion.pending, (state) => {
        state.loading_postulaciones_categoria = true;
      })
      .addCase(
        listarPostulacionesPorCategoriaEdicion.fulfilled,
        (state, action) => {
          state.loading_postulaciones_categoria = false;
          state.message = action.payload.message;
          state.postulaciones_categoria = action.payload.postulaciones;
          state.pagination_postulaciones_categoria = action.payload.pagination;
        },
      )
      .addCase(listarParticipacionesPorCategoriaEdicion.pending, (state) => {
        state.loading_participaciones_categoria = true;
      })
      .addCase(
        listarParticipacionesPorCategoriaEdicion.fulfilled,
        (state, action) => {
          state.loading_participaciones_categoria = false;
          state.message = action.payload.message;
          state.participaciones_categoria = action.payload.participaciones;
          state.pagination_participaciones_categoria =
            action.payload.pagination;
        },
      )
      .addCase(listarPostulacionesPorEdicion.pending, (state) => {
        state.loading_postulaciones_edicion = true;
      })
      .addCase(listarPostulacionesPorEdicion.fulfilled, (state, action) => {
        state.loading_postulaciones_edicion = false;
        state.message = action.payload.message;
        state.postulaciones_pendientes_edicion =
          action.payload.postulaciones.filter(
            (aux) => aux.estado === "pendiente",
          );
        state.postulaciones_rechazadas_edicion =
          action.payload.postulaciones.filter(
            (aux) => aux.estado === "rechazada",
          );
        state.postulaciones_edicion = action.payload.postulaciones;
        state.pagination_postulaciones_edicion = action.payload.pagination;
      })
      .addCase(listarParticipacionesGanadorasPorEdicion.pending, (state) => {
        state.loading_participaciones_ganadoras_edicion = true;
      })
      .addCase(
        listarParticipacionesGanadorasPorEdicion.fulfilled,
        (state, action) => {
          state.loading_participaciones_ganadoras_edicion = false;
          state.message = action.payload.message;
          state.participaciones_ganadoras_edicion =
            action.payload.participaciones_ganadoras;
          state.pagination_participaciones_ganadoras_edicion =
            action.payload.pagination;
        },
      )
      .addCase(listarPostulaciones.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(listarPostulaciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.postulacionesEdicion = action.payload.postulaciones;
      })
      .addCase(obtenerParticipacion.pending, (state) => {
        state.loadingParticipacion = true;
        state.errorParticipacion = null;
        state.participacion = undefined;
      })
      .addCase(obtenerParticipacion.fulfilled, (state, action) => {
        state.loadingParticipacion = false;
        state.participacion = action.payload?.participacion ?? null;
        state.errorParticipacion = null;

        state.isSuccess = true;
        state.isExisting = Boolean(state.participacion);
        state.message = action.payload?.message || "";
      })
      .addCase(obtenerParticipacion.rejected, (state, action) => {
        state.loadingParticipacion = false;

        if (action.payload?.status === 404) {
          state.participacion = null;
          state.errorParticipacion = null;
        } else {
          state.participacion = undefined;
          state.errorParticipacion =
            action.payload?.message ||
            "No fue posible consultar la participación.";
        }

        state.isSuccess = false;
        state.isExisting = false;
      })
      .addCase(obtenerParticipacionAEvaluar.pending, (state) => {
        state.loadingParticipacion = true;
        state.errorParticipacion = null;
        state.participacion = undefined;
      })
      .addCase(obtenerParticipacionAEvaluar.fulfilled, (state, action) => {
        state.loadingParticipacion = false;
        state.participacion = action.payload?.participacion ?? null;
        state.errorParticipacion = null;

        state.isSuccess = true;
        state.isExisting = Boolean(state.participacion);
        state.message = action.payload?.message || "";
      })
      .addCase(obtenerParticipacionAEvaluar.rejected, (state, action) => {
        state.loadingParticipacion = false;

        if (action.payload?.status === 404) {
          state.participacion = null;
          state.errorParticipacion = null;
        } else {
          state.participacion = undefined;
          state.errorParticipacion =
            action.payload?.message ||
            "No fue posible consultar la participación.";
        }

        state.isSuccess = false;
        state.isExisting = false;
      })
      .addCase(obtenerParticipacionParticipante.pending, (state) => {
        state.loadingParticipacion = true;
        state.errorParticipacion = null;
        state.participacion = undefined;
      })
      .addCase(obtenerParticipacionParticipante.fulfilled, (state, action) => {
        state.loadingParticipacion = false;
        state.participacion = action.payload?.participacion ?? null;
        state.errorParticipacion = null;

        state.isSuccess = true;
        state.isExisting = Boolean(state.participacion);
        state.message = action.payload?.message || "";
      })
      .addCase(obtenerParticipacionParticipante.rejected, (state, action) => {
        state.loadingParticipacion = false;

        if (action.payload?.status === 404) {
          state.participacion = null;
          state.errorParticipacion = null;
        } else {
          state.participacion = undefined;
          state.errorParticipacion =
            action.payload?.message ||
            "No fue posible consultar la participación.";
        }

        state.isSuccess = false;
        state.isExisting = false;
      })
      .addCase(cambiarEstadoParticipacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participacion = action.payload.participacion;
      })
      .addCase(actualizarComentarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participacion = action.payload.participacion;
      })
      .addCase(mostrarDocumento.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.documento = action.payload.documento;
      })
      .addCase(agregarJuradoAParticipacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.jurados_participacion.push(action.payload.jurado);
      })
      .addCase(cambiarEstadoAsignacionJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.jurado) {
          const updatedJuradoIndex = state.jurados_participacion.findIndex(
            (jurado) =>
              jurado.id_participacion_jurado ===
              action.payload.jurado.id_participacion_jurado,
          );

          if (updatedJuradoIndex !== -1) {
            state.jurados_participacion[updatedJuradoIndex] =
              action.payload.jurado;
          } else {
            state.jurados_participacion.push(action.payload.jurado);
          }
        }
      })
      .addCase(listarParticipacionesPorCategoria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participacionesPorEdicionCategoria =
          action.payload.participaciones;
      })
      .addCase(listarJuradosParticipacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.jurados_participacion = action.payload.jurados;
        state.pagination_jurados_participacion = action.payload.pagination;
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

export const {
  limpiarParticipacionesPorEdicion,
  limpiarConvocatoriasPorEdicion,
  limpiarParticipacionesGanadorasPorEdicionCategoria,
  limpiarPostulacionesPorEdicion,
  limpiarParticipacionesGanadorasPorEdicion,

  limpiarPostulacionesPorEdicionCategoria,
  limpiarParticipacionesPorEdicionCategoria,
  limpiarParticipaciones,
  limpiarPostulaciones,
} = participacionSlice.actions;

export default participacionSlice.reducer;
