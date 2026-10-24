import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./app/PrivateRoute.jsx";
import PublicRoute from "./app/PublicRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import InicioSesion from "./pages/inicio_sesion.jsx";
import EnviarCorreo from "./pages/enviar_correo.jsx";
import ValidarCodigo from "./pages/validar_codigo.jsx";
import NuevaClave from "./pages/nueva_clave.jsx";
import CrearContraseñaUsuario from "./pages/CrearContraseñaUsuario.jsx";
import RegistroPage from "./pages/RegistroModal.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./components/MainLayout.jsx";
import FormularioInscripcionEdicion from "./pages/FormularioInscripcionEdicion.jsx";
import ConfirmacionPostulacion from "./pages/ConfirmacionPostulacion.jsx";
import ListaNotificaciones from "./pages/ListaNotificaciones.jsx";

//Rutas del ADMINISTRADOR
import InicioAdministrador from "./pages/ADMINISTRADOR/Inicio.jsx";
import ListaDirectoresAdministrador from "./pages/ADMINISTRADOR/ListaDirectores.jsx";
import ListaJuradosAdministrador from "./pages/ADMINISTRADOR/ListaJurados.jsx";
import InformacionJuradoAdministrador from "./pages/ADMINISTRADOR/InformacionJurado.jsx";
import ListaParticipantesAdministrador from "./pages/ADMINISTRADOR/ListaParticipantes.jsx";
import InformacionParticipanteAdministrador from "./pages/ADMINISTRADOR/InformacionParticipante.jsx";
import InformacionParticipacionEvaluadaJuradoAdministrador from "./pages/ADMINISTRADOR/InformacionParticipacionEvaluadaJurado.jsx";
import InformacionParticipacionParticipanteAdministrador from "./pages/ADMINISTRADOR/InformacionParticipacionParticipante.jsx";
import ListaAuditoriaAdministrador from "./pages/ADMINISTRADOR/ListaAuditoria.jsx";

//Rutas de DIRECTOR
import InicioDirector from "./pages/DIRECTOR/Inicio.jsx";
import ListaEdicionesDirector from "./pages/DIRECTOR/ListaEdiciones.jsx";
import InformacionEdicionDirector from "./pages/DIRECTOR/InformacionEdicion.jsx";
import DefinirConvocatoriaDirector from "./pages/DIRECTOR/DefinirConvocatoria.jsx";
import ListaCategoriasEdicionDirector from "./pages/DIRECTOR/ListaCategoriasEdicion.jsx";
import ListaJuradosDirector from "./pages/DIRECTOR/ListaJurados.jsx";
import ListaJuradosEdicionDirector from "./pages/DIRECTOR/ListaJuradosEdicion.jsx";
import InformacionJuradoDirector from "./pages/DIRECTOR/InformacionJurado.jsx";
import ListaParticipantesDirector from "./pages/DIRECTOR/ListaParticipantes.jsx";
import InformacionParticipanteDirector from "./pages/DIRECTOR/InformacionParticipante.jsx";
import InformacionCategoriaEdicionDirector from "./pages/DIRECTOR/InformacionCategoriaEdicion.jsx";
import ListaConvocadosDirector from "./pages/DIRECTOR/ListaConvocados.jsx";
import ListaPostuladosDirector from "./pages/DIRECTOR/ListaPostulados.jsx";
import InformacionPostulacionEdicionDirector from "./pages/DIRECTOR/InformacionPostulacionEdicion.jsx";
import ListaParticipacionesDirector from "./pages/DIRECTOR/ListaParticipaciones.jsx";
import InformacionParticipacionEdicionDirector from "./pages/DIRECTOR/InformacionParticipacionEdicion.jsx";
import ListarGanadoresEdicionDirector from "./pages/DIRECTOR/ListarGanadoresEdicion.jsx";
import GenerarReportesDirector from "./pages/DIRECTOR/GenerarReportes.jsx";
import InformacionParticipacionEvaluadaJuradoDirector from "./pages/DIRECTOR/InformacionParticipacionEvaluadaJurado.jsx";
import InformacionParticipacionParticipanteDirector from "./pages/DIRECTOR/InformacionParticipacionParticipante.jsx";

//Rutas del Jurado
import InicioJurado from "./pages/JURADO/Inicio.jsx";
import ListaEdicionesJurado from "./pages/JURADO/ListaEdiciones.jsx";
import InformacionEdicionJurado from "./pages/JURADO/InformacionEdicion.jsx";
import ListaParticipacionesJurado from "./pages/JURADO/ListaParticipantes.jsx";
import InformacionParticipacionEvaluadaJurado from "./pages/JURADO/InformacionParticipacionEvaluada.jsx";
import EvaluacionesJurado from "./pages/JURADO/Evaluaciones.jsx";
import InformacionEvaluacionJurado from "./pages/JURADO/InformacionEvaluacion.jsx";

//Rutas del Participante
import InicioParticipante from "./pages/PARTICIPANTE/Inicio.jsx";
import ListaEdicionesParticipante from "./pages/PARTICIPANTE/ListaEdiciones.jsx";
import InformacionEdicionParticipante from "./pages/PARTICIPANTE/InformacionEdicion.jsx";
import ListarParticipacionesParticipante from "./pages/PARTICIPANTE/ListaParticipaciones.jsx";
import InformacionParticipacionParticipante from "./pages/PARTICIPANTE/InformacionParticipacion.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/inicio_sesion" element={<InicioSesion />} />
            <Route path="/enviar-correo" element={<EnviarCorreo />} />
            <Route path="/validar-codigo" element={<ValidarCodigo />} />
            <Route path="/nueva-contrasena" element={<NuevaClave />} />
            <Route
              path="/crear-clave/:token"
              element={<CrearContraseñaUsuario />}
            />
            <Route
              path="/inscripcion-edicion/:token"
              element={<FormularioInscripcionEdicion modo="invitacion" />}
            />
            <Route
              path="/inscripcion-edicion-publica/:id_edicion"
              element={<FormularioInscripcionEdicion modo="publica" />}
            />
            <Route
              path="/postulacion/confirmacion"
              element={<ConfirmacionPostulacion />}
            />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["administrador"]} />}>
            <Route path="/administrador" element={<MainLayout />}>
              <Route path="inicio" element={<InicioAdministrador />} />
              <Route path="notificaciones" element={<ListaNotificaciones />} />
              <Route
                path="lista-directores"
                element={<ListaDirectoresAdministrador />}
              />
              <Route
                path="lista-jurados"
                element={<ListaJuradosAdministrador />}
              />
              <Route
                path="lista-jurados/:id_usuario/informacion-jurado"
                element={<InformacionJuradoAdministrador />}
              />
              <Route
                path="jurados/participaciones-evaluadas/:id_participacion/informacion-participacion"
                element={
                  <InformacionParticipacionEvaluadaJuradoAdministrador />
                }
              />
              <Route
                path="lista-participantes"
                element={<ListaParticipantesAdministrador />}
              />
              <Route
                path="lista-participantes/:id_usuario/informacion-participante"
                element={<InformacionParticipanteAdministrador />}
              />
              <Route
                path="participantes/participaciones/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionParticipanteAdministrador />}
              />
              <Route
                path="auditoria"
                element={<ListaAuditoriaAdministrador />}
              />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["director"]} />}>
            <Route path="/director" element={<MainLayout />}>
              <Route path="inicio" element={<InicioDirector />} />
              <Route path="notificaciones" element={<ListaNotificaciones />} />
              <Route path="lista-jurados" element={<ListaJuradosDirector />} />
              <Route
                path="lista-jurados/:id_usuario/informacion-jurado"
                element={<InformacionJuradoDirector />}
              />
              <Route
                path="jurados-edicion"
                element={<ListaJuradosEdicionDirector />}
              />
              <Route
                path="jurados-edicion/:id_usuario/informacion-jurado"
                element={<InformacionJuradoDirector />}
              />
              <Route
                path="jurados-edicion/participaciones-evaluadas/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionEvaluadaJuradoDirector />}
              />
              <Route
                path="lista-jurados/participaciones-evaluadas/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionEvaluadaJuradoDirector />}
              />
              <Route
                path="lista-participantes"
                element={<ListaParticipantesDirector />}
              />
              <Route
                path="lista-participantes/:id_usuario/informacion-participante"
                element={<InformacionParticipanteDirector />}
              />
              <Route
                path="lista-participantes/participaciones/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionParticipanteDirector />}
              />
              <Route path="ediciones" element={<ListaEdicionesDirector />} />
              <Route
                path="ediciones/:id_edicion/informacion-edicion"
                element={<InformacionEdicionDirector />}
              />
              <Route
                path="convocatoria"
                element={<DefinirConvocatoriaDirector />}
              />

              <Route
                path="categorias-edicion"
                element={<ListaCategoriasEdicionDirector />}
              />
              <Route
                path="categorias-edicion/:id_edicion_categoria/informacion-categoria"
                element={<InformacionCategoriaEdicionDirector />}
              />
              <Route
                path="convocados-edicion"
                element={<ListaConvocadosDirector />}
              />
              <Route
                path="postulados-edicion"
                element={<ListaPostuladosDirector />}
              />
              <Route
                path="postulados-edicion/:id_participacion/informacion-postulacion"
                element={<InformacionPostulacionEdicionDirector />}
              />
              <Route
                path="participaciones-edicion"
                element={<ListaParticipacionesDirector />}
              />
              <Route
                path="participaciones-edicion/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionEdicionDirector />}
              />
              <Route
                path="ganadores"
                element={<ListarGanadoresEdicionDirector />}
              />
              <Route path="reportes" element={<GenerarReportesDirector />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["jurado"]} />}>
            <Route path="/jurado" element={<MainLayout />}>
              <Route path="inicio" element={<InicioJurado />} />
              <Route path="notificaciones" element={<ListaNotificaciones />} />
              <Route path="ediciones" element={<ListaEdicionesJurado />} />
              <Route
                path="ediciones/:id_edicion/informacion-edicion"
                element={<InformacionEdicionJurado />}
              />
              <Route
                path="lista-participantes"
                element={<ListaParticipacionesJurado />}
              />
              <Route
                path="lista-participantes/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionEvaluadaJurado />}
              />
              <Route path="evaluaciones" element={<EvaluacionesJurado />} />
              <Route
                path="evaluaciones/:id_participacion/informacion-evaluacion"
                element={<InformacionEvaluacionJurado />}
              />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["participante"]} />}>
            <Route path="/participante" element={<MainLayout />}>
              <Route path="inicio" element={<InicioParticipante />} />
              <Route path="notificaciones" element={<ListaNotificaciones />} />
              <Route
                path="ediciones"
                element={<ListaEdicionesParticipante />}
              />
              <Route
                path="ediciones/:id_edicion/informacion-edicion"
                element={<InformacionEdicionParticipante />}
              />
              <Route
                path="participaciones"
                element={<ListarParticipacionesParticipante />}
              />
              <Route
                path="participaciones/:id_participacion/informacion-participacion"
                element={<InformacionParticipacionParticipante />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
