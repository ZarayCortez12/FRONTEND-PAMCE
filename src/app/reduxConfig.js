import { configureStore } from "@reduxjs/toolkit";
import autenticacionReducer from "../features/autenticacion.slice";
import edicionReducer from "../features/ediciones/edicion.slice";
import categoriasReducer from "../features/categorias/categoria.slice";
import juradosReducer from "../features/jurados/jurado.slice";
import participantesReducer from "../features/participantes/participante.slice";
import requisitosReducer from "../features/requisitos/requisitos.slice";
import participacionReducer from "../features/participacion/participacion.slice";
import ganadoresReducer from "../features/ganadores/ganadores.slice";
import evaluacionesReducer from "../features/evaluacion/evaluacion.slice";
import rubricasReducer from "../features/rubricas/rubricas.slice";
import criteriosReducer from "../features/criterios/criterios.slice";
import reportesReducer from "../features/reportes/reportes.slice";
import notificacionesReducer from "../features/notificaciones/notificaciones.slice";
import publicReducer from "../features/public/public.slice";
import directoresReducer from "../features/directores/director.slice";
import auditoriaReducer from "../features/auditoria/auditoria.slice";

export const reduxConfig = configureStore({
  reducer: {
    autenticacion: autenticacionReducer,
    ediciones: edicionReducer,
    categorias: categoriasReducer,
    jurados: juradosReducer,
    participantes: participantesReducer,
    requisitos: requisitosReducer,
    participacion: participacionReducer,
    ganadores: ganadoresReducer,
    evaluacion: evaluacionesReducer,
    rubricas: rubricasReducer,
    criterios: criteriosReducer,
    reportes: reportesReducer,
    notificaciones: notificacionesReducer,
    public: publicReducer,
    directores: directoresReducer,
    auditoria: auditoriaReducer,
  },
});
