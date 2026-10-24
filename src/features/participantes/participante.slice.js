import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ParticipanteService from "./participante.service";

export const listarParticipantes = createAsyncThunk(
  "participantes/listarParticipantes",
  async (params, thunkAPI) => {
    try {
      const response = await ParticipanteService.listarParticipantes(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarInformacionParticipante = createAsyncThunk(
  "participantes/editarInformacionParticipante",
  async (data, thunkAPI) => {
    try {
      const response = await ParticipanteService.editarInformacionParticipante(
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

export const cambiarEstadoParticipante = createAsyncThunk(
  "participantes/cambiarEstadoParticipante",
  async (datos, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.cambiarEstadoParticipante(datos);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarParticipante = createAsyncThunk(
  "participantes/agregarParticipante",
  async (data, thunkAPI) => {
    try {
      const response = await ParticipanteService.agregarParticipante(data);
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

export const obtenerParticipante = createAsyncThunk(
  "participantes/obtenerParticipante",
  async (id, thunkAPI) => {
    try {
      const response = await ParticipanteService.obtenerParticipante(id);
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

export const obtenerEdicionesParticipacionParticipante = createAsyncThunk(
  "participantes/obtenerEdicionesParticipacionParticipante",
  async (id_participante, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.obtenerEdicionesParticipacionParticipante(
          id_participante,
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

export const obtenerCategoriasEdicionesParticipacionParticipante =
  createAsyncThunk(
    "participantes/obtenerCategoriasEdicionesParticipacionParticipante",
    async ({ id_edicion, id_participante }, thunkAPI) => {
      try {
        const response =
          await ParticipanteService.obtenerCategoriasEdicionesParticipacionParticipante(
            id_edicion,
            id_participante,
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

export const obtenerConvocatoriasParticipante = createAsyncThunk(
  "participantes/obtenerConvocatoriasParticipante",
  async ({ id_participante, params }, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.obtenerConvocatoriasParticipante(
          id_participante,
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

export const obtenerParticipacionesPorJurado = createAsyncThunk(
  "participantes/obtenerParticipacionesPorJurado",
  async ({ id_jurado, params }, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.obtenerParticipacionesPorJurado({
          id_jurado,
          params,
        });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerParticipaciones = createAsyncThunk(
  "participantes/obtenerParticipaciones",
  async ({ id_participante, params }, thunkAPI) => {
    try {
      const response = await ParticipanteService.obtenerParticipaciones(
        id_participante,
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

export const obtenerParticipacionesPorParticipante = createAsyncThunk(
  "participantes/obtenerParticipacionesPorParticipante",
  async ({ id_participante, params }, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.obtenerParticipacionesPorParticipante(
          id_participante,
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

export const obtenerEdicionesPorParticipante = createAsyncThunk(
  "participantes/obtenerEdicionesPorParticipante",
  async ({ id_participante, params }, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.obtenerEdicionesPorParticipante(
          id_participante,
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

export const agregarParticipanteSis = createAsyncThunk(
  "participantes/agregarParticipanteSis",
  async (data, thunkAPI) => {
    try {
      const response = await ParticipanteService.agregarParticipanteSis(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const generarCertificadoParticipacion = createAsyncThunk(
  "participantes/generarCertificadoParticipacion",
  async (id_participacion, thunkAPI) => {
    try {
      const response =
        await ParticipanteService.generarCertificadoParticipacion(
          id_participacion,
        );

      return response;
    } catch (error) {
      let message = "No fue posible generar el certificado.";

      if (error.response?.data instanceof Blob) {
        try {
          const texto = await error.response.data.text();
          const data = JSON.parse(texto);

          message = data.message || message;
        } catch {
          // Si no se puede convertir, dejamos el mensaje por defecto
        }
      } else {
        message = error.response?.data?.message || error.message || message;
      }

      return thunkAPI.rejectWithValue({
        message,
        status: error.response?.status,
      });
    }
  },
);

const initialState = {
  loading: false,
  participantes: [],
  pagination_participantes: {},
  participante: undefined,
  loadingParticipante: false,
  ediciones: [],
  categorias: [],
  participaciones: [],
  pagination_participaciones: {},
  convocatorias: [],
  pagination_convocatorias: {},
  participanteObtenido: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
};

const participantesSlice = createSlice({
  name: "participantes",
  initialState,
  reducers: {
    limpiarCategoriasEdicionesParticipacionParticipante: (state) => {
      state.categorias = [];
    },

    limpiarParticipaciones: (state) => {
      state.participaciones = [];
      state.pagination_participaciones = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listarParticipantes.pending, (state) => {
        state.loading = true;
      })
      .addCase(listarParticipantes.fulfilled, (state, action) => {
        state.loading = false;
        state.participantes = action.payload.participantes;
        state.pagination_participantes = action.payload.pagination;
      })
      .addCase(editarInformacionParticipante.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(editarInformacionParticipante.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.participante) {
          const updatedParticipantIndex = state.participantes.findIndex(
            (participante) =>
              participante.id_usuario ===
              action.payload.participante.id_usuario,
          );

          if (updatedParticipantIndex !== -1) {
            state.participantes[updatedParticipantIndex] =
              action.payload.participante;
          } else {
            state.participantes.push(action.payload.participante);
          }
        }
      })
      .addCase(editarInformacionParticipante.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(cambiarEstadoParticipante.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(cambiarEstadoParticipante.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;

        if (action.payload.participante) {
          const updatedParticipantIndex = state.participantes.findIndex(
            (participante) =>
              participante.id_usuario ===
              action.payload.participante.id_usuario,
          );

          if (updatedParticipantIndex !== -1) {
            state.participantes[updatedParticipantIndex] =
              action.payload.participante;
          }
        }
      })
      .addCase(cambiarEstadoParticipante.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
      })
      .addCase(agregarParticipante.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
      })
      .addCase(agregarParticipante.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participante = action.payload.usuario;
      })
      .addCase(agregarParticipante.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = action.payload.message;
        state.participante = action.payload.usuario;
      })
      .addCase(obtenerParticipante.pending, (state) => {
        state.loadingParticipante = true;
        state.participante = undefined;
      })
      .addCase(obtenerParticipante.fulfilled, (state, action) => {
        state.loadingParticipante = false;
        state.participante = action.payload?.participante ?? null;
      })
      .addCase(obtenerParticipante.rejected, (state) => {
        state.loadingParticipante = false;
        state.participante = undefined;
      })
      .addCase(
        obtenerEdicionesParticipacionParticipante.fulfilled,
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
        obtenerCategoriasEdicionesParticipacionParticipante.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.categorias = action.payload.categorias;
        },
      )
      .addCase(obtenerConvocatoriasParticipante.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.convocatorias = action.payload.convocatorias;
        state.pagination_convocatorias = action.payload.pagination;
      })
      .addCase(obtenerParticipaciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participaciones = action.payload.participaciones;
        state.pagination_participaciones = action.payload.pagination;
      })
      .addCase(
        obtenerParticipacionesPorParticipante.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.isExisting = true;
          state.message = action.payload.message;
          state.participaciones = action.payload.participaciones;
        },
      )
      .addCase(obtenerParticipacionesPorJurado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.participaciones = action.payload.participaciones;
        state.pagination_participaciones = action.payload.pagination;
      })
      .addCase(obtenerEdicionesPorParticipante.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.ediciones = action.payload.ediciones;
      })
      .addCase(agregarParticipanteSis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.usuario) {
          state.participantes.push(action.payload.usuario);
        }
      });
  },
});

export const {
  limpiarCategoriasEdicionesParticipacionParticipante,
  limpiarParticipaciones,
} = participantesSlice.actions;

export default participantesSlice.reducer;
