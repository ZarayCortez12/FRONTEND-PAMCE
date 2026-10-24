import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DirectorService from "./director.service";

export const listarDirectores = createAsyncThunk(
  "directores/listarDirectores",
  async (params, thunkAPI) => {
    try {
      const response = await DirectorService.listarDirectores(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarDirector = createAsyncThunk(
  "directores/agregarDirector",
  async (data, thunkAPI) => {
    try {
      const response = await DirectorService.agregarDirector(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const editarInformacionDirector = createAsyncThunk(
  "directores/editarInformacionDirector",
  async (data, thunkAPI) => {
    try {
      const response = await DirectorService.editarInformacionDirector(
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

export const cambiarEstadoDirector = createAsyncThunk(
  "directores/cambiarEstadoDirector",
  async (datos, thunkAPI) => {
    try {
      const response = await DirectorService.cambiarEstadoDirector(datos);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

export const obtenerDirector = createAsyncThunk(
  "directores/obtenerDirector",
  async (id_director, thunkAPI) => {
    try {
      const response = await DirectorService.obtenerDirector(id_director);
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
  loading_directores: false,
  directores: [],
  pagination_directores: {},
  director: null,
  message: "",
};

const directoresSlice = createSlice({
  name: "directores",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(listarDirectores.pending, (state) => {
        state.loading_directores = true;
      })
      .addCase(listarDirectores.fulfilled, (state, action) => {
        state.loading_directores = false;
        state.message = action.payload.message;
        state.directores = action.payload.directores;
        state.pagination_directores = action.payload.pagination;
      })
      .addCase(agregarDirector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.usuario) {
          state.directores.push(action.payload.usuario);
        }
      })
      .addCase(editarInformacionDirector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.director) {
          const updatedDirectorIndex = state.directores.findIndex(
            (director) =>
              director.id_usuario === action.payload.director.id_usuario,
          );

          if (updatedDirectorIndex !== -1) {
            state.directores[updatedDirectorIndex] = action.payload.director;
          } else {
            state.directores.push(action.payload.director);
          }
        }
      })
      .addCase(cambiarEstadoDirector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        if (action.payload.director) {
          const updatedDirectorIndex = state.directores.findIndex(
            (director) =>
              director.id_usuario === action.payload.director.id_usuario,
          );

          if (updatedDirectorIndex !== -1) {
            state.directores[updatedDirectorIndex] = action.payload.director;
          } else {
            state.directores.push(action.payload.director);
          }
        }
      })
      .addCase(obtenerDirector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isExisting = true;
        state.message = action.payload.message;
        state.director = action.payload.director;
      });
  },
});

export default directoresSlice.reducer;
