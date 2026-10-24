import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Trophy,
  FlaskConical,
  Building2,
  GraduationCap,
  CalendarDays,
  Newspaper,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import logo_carrera from "../images/logo_carrera.png";
import logo_ufps from "../images/logo_universidad_vertical.png";
import logo_pamce from "../images/logo_pamce.png";
import {
  obtenerEdicionEnProcesoFanPage,
  obtenerEdicionesFanPage,
} from "../features/public/public.slice";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import RegistroModal from "./RegistroModal.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mostrarInfoEdicion, setMostrarInfoEdicion] = useState(false);
  const [registroOpen, setRegistroOpen] = useState(false);

  const edicion = useSelector((state) => state.public.edicion_en_proceso);
  const ediciones = useSelector((state) => state.public.ediciones);

  useEffect(() => {
    document.title = "PAMCE | Inicio";

    if (!edicion) {
      dispatch(obtenerEdicionEnProcesoFanPage());
    }

    dispatch(obtenerEdicionesFanPage());
  }, [dispatch, edicion]);

  const obtenerFechaActual = () => {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  };

  const fechaActual = obtenerFechaActual();

  const etapaActual = (() => {
    if (!edicion) return null;

    if (
      fechaActual >= edicion.fecha_inicio_convocatoria &&
      fechaActual <= edicion.fecha_fin_convocatoria
    ) {
      return "convocatoria";
    }

    if (
      fechaActual >= edicion.fecha_inicio_evaluacion &&
      fechaActual <= edicion.fecha_fin_evaluacion
    ) {
      return "evaluacion";
    }

    if (
      fechaActual >= edicion.fecha_inicio_premiacion &&
      fechaActual <= edicion.fecha_fin_premiacion
    ) {
      return "premiacion";
    }

    return "fuera_de_etapa";
  })();

  const informacionEtapa = {
    convocatoria: {
      titulo: "¡Participa en la edición vigente!",
      estado: "Convocatoria abierta",
      descripcion:
        "Conoce las fechas y condiciones de participación de esta edición del Premio Anual al Mérito Científico y Empresarial.",
      color: "bg-green-500",
      textoEstado: "text-green-700",
      fondoEstado: "bg-green-50",
      bordeEstado: "border-green-200",
    },

    evaluacion: {
      titulo: "Las postulaciones están en evaluación",
      estado: "Etapa de evaluación",
      descripcion:
        "La edición se encuentra en evaluación. Mantente informado sobre los avances del proceso de reconocimiento.",
      color: "bg-amber-500",
      textoEstado: "text-amber-700",
      fondoEstado: "bg-amber-50",
      bordeEstado: "border-amber-200",
    },

    premiacion: {
      titulo: "Una etapa para reconocer el talento",
      estado: "Etapa de premiación",
      descripcion:
        "Esta edición se encuentra en su etapa de premiación, dedicada al reconocimiento de los logros destacados.",
      color: "bg-[#D4AF37]",
      textoEstado: "text-[#94700C]",
      fondoEstado: "bg-amber-50",
      bordeEstado: "border-amber-200",
    },

    fuera_de_etapa: {
      titulo: "Conoce la edición vigente",
      estado: "Fuera de las fechas de las etapas",
      descripcion:
        "La edición está registrada, pero hoy no se encuentra dentro de las fechas programadas para convocatoria, evaluación o premiación.",
      color: "bg-gray-400",
      textoEstado: "text-gray-600",
      fondoEstado: "bg-gray-50",
      bordeEstado: "border-gray-200",
    },
  };

  const informacionActual = etapaActual ? informacionEtapa[etapaActual] : null;

  const listaEdiciones = Array.isArray(ediciones) ? ediciones : [];

  const fechaHoy = obtenerFechaActual();

  const edicionesAnteriores = listaEdiciones
    .filter((item) => Number(item.id_edicion) !== Number(edicion?.id_edicion))
    .sort((a, b) =>
      String(b.fecha_inicio || "").localeCompare(String(a.fecha_inicio || "")),
    );

  const formatearFecha = (fecha) => {
    if (!fecha) return null;

    const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");

    if (!anio || !mes || !dia) return null;

    return `${dia}/${mes}/${anio}`;
  };

  const obtenerNoticiaEdicion = (item) => {
    const fechaInicio = item.fecha_inicio;
    const fechaFin = item.fecha_fin;

    if (fechaFin && fechaFin < fechaHoy) {
      return {
        categoria: "Cierre del periodo",
        titulo: `Concluyó el periodo programado de ${item.nombre_edicion}`,
        descripcion: `El periodo registrado para ${item.nombre_edicion} ha concluido. Consulta los canales oficiales de PAMCE para conocer las novedades y la información disponible sobre esta edición.`,
        fecha: fechaFin,
        icono: "cierre",
      };
    }

    if (fechaInicio && fechaInicio > fechaHoy) {
      return {
        categoria: "Próxima edición",
        titulo: `Próximamente: ${item.nombre_edicion}`,
        descripcion: `El periodo programado para ${item.nombre_edicion} aún no ha comenzado. Mantente atento a las comunicaciones oficiales del PAMCE.`,
        fecha: fechaInicio,
        icono: "proxima",
      };
    }

    return {
      categoria: "Información de la edición",
      titulo: `Conoce ${item.nombre_edicion}`,
      descripcion: `Consulta la información registrada y las fechas programadas de ${item.nombre_edicion} del Premio Anual al Mérito Científico y Empresarial.`,
      fecha: fechaInicio || null,
      icono: "informacion",
    };
  };

  const noticias = edicionesAnteriores.map((item) => ({
    id: item.id_edicion,
    ...obtenerNoticiaEdicion(item),
    nombreEdicion: item.nombre_edicion,
    fechaInicio: item.fecha_inicio,
    fechaFin: item.fecha_fin,
  }));

  const noticiasCarruselRef = useRef(null);

  const desplazarNoticias = (direccion) => {
    if (!noticiasCarruselRef.current) return;

    const distancia = noticiasCarruselRef.current.clientWidth * 0.85;

    noticiasCarruselRef.current.scrollBy({
      left: direccion * distancia,
      behavior: "smooth",
    });
  };

  const categoriasEdicion = edicion?.categoriasEdicion ?? [];

  const obtenerNombreCategoria = (item) =>
    item?.categoria?.nombre_categoria ??
    item?.categoria?.nombre ??
    item?.nombre_categoria ??
    item?.nombre ??
    `Categoría ${item?.id_categoria ?? ""}`;

  const etapasEdicion = [
    {
      nombre: "Convocatoria",
      inicio: edicion?.fecha_inicio_convocatoria,
      fin: edicion?.fecha_fin_convocatoria,
    },
    {
      nombre: "Evaluación",
      inicio: edicion?.fecha_inicio_evaluacion,
      fin: edicion?.fecha_fin_evaluacion,
    },
    {
      nombre: "Premiación",
      inicio: edicion?.fecha_inicio_premiacion,
      fin: edicion?.fecha_fin_premiacion,
    },
  ];

  return (
    <>
      {" "}
      <div className="min-h-screen bg-white font-inter text-gray-800">
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
          <div className="mx-auto! flex max-w-7xl items-center justify-between px-6! py-2!">
            <div className="flex items-center gap-4">
              <img
                src={logo_carrera}
                alt="Ingeniería de Sistemas"
                className="h-20 w-auto object-contain"
              />
            </div>

            <nav className="hidden items-center gap-7 md:flex">
              <a
                href="#inicio"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-[#C21111]"
              >
                Inicio
              </a>

              <a
                href="#pamce"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-[#C21111]"
              >
                ¿Qué es PAMCE?
              </a>

              <a
                href="#noticias"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-[#C21111]"
              >
                Noticias
              </a>

              <div className="flex items-center gap-3">
                <a
                  href="/inicio_sesion"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A90F0F] hover:shadow-lg active:translate-y-0"
                >
                  <LogIn
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                  Iniciar sesión
                </a>

                <button
                  type="button"
                  onClick={() => setRegistroOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[#C21111] bg-white px-5! py-2.5! text-sm font-semibold text-[#C21111] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md active:translate-y-0"
                >
                  <UserPlus
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Registrarme
                </button>
              </div>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2! text-gray-700 md:hidden"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-gray-100 bg-white px-6! py-5! md:hidden">
              <nav className="flex flex-col gap-5">
                <a href="#inicio" onClick={() => setMenuOpen(false)}>
                  Inicio
                </a>

                <a href="#pamce" onClick={() => setMenuOpen(false)}>
                  ¿Qué es PAMCE?
                </a>

                <a href="#noticias" onClick={() => setMenuOpen(false)}>
                  Noticias
                </a>

                <a
                  href="/inicio_sesion"
                  onClick={() => setMenuOpen(false)}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#C21111] px-5! py-3! text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#A90F0F] hover:shadow-md active:scale-[0.98]"
                >
                  <LogIn
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                  Iniciar sesión
                </a>

                <a
                  href="/registro"
                  onClick={() => setMenuOpen(false)}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg border border-[#C21111] bg-white px-5! py-3! text-sm font-semibold text-[#C21111] transition-all duration-300 hover:bg-red-50 active:scale-[0.98]"
                >
                  <UserPlus
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Registrarme
                </a>
              </nav>
            </div>
          )}
        </header>

        <div className="w-full min-w-0">
          <section id="inicio" className="relative overflow-hidden bg-white">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C21111]/5" />

            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/5" />

            <div className="relative mx-auto! grid max-w-7xl items-center gap-12 px-6! py-20! lg:grid-cols-2! lg:px-8! lg:py-10!">
              <div className="max-w-2xl">
                <div className="mb-6! inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4! py-2!">
                  <Trophy size={17} className="text-[#D4AF37]" />

                  <span className="text-sm font-semibold text-gray-700">
                    Premio Anual al Mérito Científico y Empresarial
                  </span>
                </div>

                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  ¡Reconociendo el{" "}
                  <span className="text-[#C21111]">talento</span>!
                </h1>

                <p className="mt-6! max-w-xl text-lg leading-8 text-gray-600">
                  Una iniciativa del programa de Ingeniería de Sistemas de la
                  UFPS que promueve el reconocimiento del mérito científico y
                  empresarial de sus estudiantes y graduados.
                </p>

                <div className="mt-8! flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#pamce"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C21111] px-6! py-3.5! font-semibold text-white shadow-sm transition-all hover:bg-[#A90F0F] hover:shadow-lg"
                  >
                    Conocer PAMCE
                    <ArrowRight size={18} />
                  </a>

                  <a
                    href="#noticias"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6! py-3.5! font-semibold text-gray-700 transition-all hover:border-[#C21111] hover:text-[#C21111]"
                  >
                    Ver convocatoria
                  </a>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative flex h-[520px] w-[520px] items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#C21111]/10" />

                  <div className="absolute inset-10 rounded-full border border-[#D4AF37]/30" />

                  <div className="absolute inset-20 rounded-full bg-gray-50 shadow-sm" />

                  <div className="relative flex h-[430px] w-[430px] items-center justify-center rounded-full bg-white shadow-xl">
                    <img
                      src={logo_pamce}
                      alt="Logo PAMCE"
                      className="max-h-[360px] max-w-[360px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pamce" className="bg-gray-50 px-6! py-20! lg:px-8!">
            <div className="mx-auto! max-w-7xl!">
              <div className="grid items-center gap-12 lg:grid-cols-2! lg:gap-16!">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#C21111]">
                    Plataforma de reconocimiento
                  </span>

                  <h2 className="mt-3! text-3xl font-bold text-gray-900 sm:text-4xl">
                    ¿Qué es PAMCE?
                  </h2>

                  <p className="mt-5! text-base leading-8 text-gray-600">
                    PAMCE es un software web desarrollado para apoyar la gestión
                    del Premio Anual al Mérito Científico y Empresarial del
                    programa de Ingeniería de Sistemas de la Universidad
                    Francisco de Paula Santander (UFPS).
                  </p>

                  <p className="mt-4! text-base leading-8 text-gray-600">
                    La plataforma facilita la organización y el seguimiento de
                    las etapas del premio, desde la gestión de las convocatorias
                    y la evaluación de las postulaciones hasta la consolidación
                    de resultados y el reconocimiento de los participantes
                    destacados.
                  </p>

                  <h3 className="mt-8! text-2xl font-bold leading-tight text-gray-900">
                    Un reconocimiento al mérito y la excelencia
                  </h3>

                  <p className="mt-4! text-base leading-8 text-gray-600">
                    El premio tiene como propósito exaltar a estudiantes y
                    graduados del programa que sobresalen por sus logros,
                    aportes científicos y trayectoria en el ámbito empresarial,
                    contribuyendo al posicionamiento de Ingeniería de Sistemas
                    en distintos escenarios.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2!">
                  <article className="rounded-2xl border border-gray-100 bg-white p-6! shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4! flex h-12 w-12 items-center justify-center rounded-xl bg-[#C21111]/10">
                      <GraduationCap size={25} className="text-[#C21111]" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      Estudiantes y graduados
                    </h3>

                    <p className="mt-2! text-sm leading-6 text-gray-600">
                      Dirigido a integrantes y graduados del programa de
                      Ingeniería de Sistemas que cumplen con los criterios
                      establecidos para participar en el premio.
                    </p>
                  </article>

                  <article className="rounded-2xl border border-gray-100 bg-white p-6! shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:mt-8!">
                    <div className="mb-4! flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/15">
                      <FlaskConical size={25} className="text-[#A98212]" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      Mérito científico
                    </h3>

                    <p className="mt-2! text-sm leading-6 text-gray-600">
                      Reconoce los logros y aportes relacionados con la
                      investigación, la producción científica y la generación de
                      conocimiento.
                    </p>
                  </article>

                  <article className="rounded-2xl border border-gray-100 bg-white p-6! shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2!">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C21111]/10">
                        <Building2 size={25} className="text-[#C21111]" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Mérito empresarial e impacto
                        </h3>

                        <p className="mt-2! text-sm leading-6 text-gray-600">
                          Destaca la trayectoria profesional, los logros
                          empresariales y los aportes que generan valor e
                          impacto en los ámbitos regional, nacional e
                          internacional.
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section id="noticias" className="bg-white px-6! py-20! lg:px-8!">
            <div className="mx-auto! max-w-7xl!">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-[#C21111]">
                    Actualidad PAMCE
                  </span>

                  <h2 className="mt-3! text-3xl font-bold text-gray-900 sm:text-4xl">
                    Noticias
                  </h2>

                  <p className="mt-4! max-w-2xl text-base leading-7 text-gray-600">
                    Consulta la información y las novedades relacionadas con las
                    ediciones del Premio Anual al Mérito Científico y
                    Empresarial.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 sm:flex">
                  <Newspaper size={25} className="text-[#C21111]" />
                </div>
              </div>

              {edicion && (
                <article className="relative mt-10! overflow-hidden rounded-2xl bg-[#C21111] p-6! sm:p-8!">
                  <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/15" />

                  <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3! py-1.5! text-xs font-semibold text-white">
                        <CalendarDays size={15} />
                        Edición en proceso
                      </span>

                      <h3 className="mt-4! text-2xl font-bold leading-tight text-white! sm:text-3xl">
                        {edicion.nombre_edicion
                          ?.trim()
                          .split(/\s+/)
                          .map(
                            (palabra) =>
                              palabra.charAt(0).toLocaleUpperCase("es-CO") +
                              palabra.slice(1).toLocaleLowerCase("es-CO"),
                          )
                          .join(" ")}
                      </h3>

                      <p className="mt-3! max-w-2xl text-sm leading-6 text-white/90">
                        {informacionActual?.descripcion ||
                          "Conoce las etapas y las actividades programadas para esta edición del Premio Anual al Mérito Científico y Empresarial."}
                      </p>

                      <div className="mt-5!">
                        <button
                          type="button"
                          onClick={() =>
                            setMostrarInfoEdicion((actual) => !actual)
                          }
                          aria-expanded={mostrarInfoEdicion}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/50 bg-white px-4! py-2.5! text-sm font-bold text-[#C21111] transition hover:bg-red-50"
                        >
                          {mostrarInfoEdicion
                            ? "Ocultar información"
                            : "Ver información"}
                          {mostrarInfoEdicion ? (
                            <ChevronLeft size={17} className="-rotate-90" />
                          ) : (
                            <ArrowRight size={17} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4! text-white lg:min-w-56">
                      <Trophy size={26} className="shrink-0 text-white" />

                      <div>
                        <p className="text-xs text-white/80">
                          Estado del proceso
                        </p>

                        <p className="mt-1! text-sm font-semibold text-white">
                          {etapaActual === "convocatoria"
                            ? "Convocatoria abierta"
                            : informacionActual?.estado || "Edición en proceso"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {mostrarInfoEdicion && (
                    <article className="mt-4! rounded-2xl border border-gray-200 bg-white p-5! shadow-sm sm:p-6!">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                          <CalendarDays size={20} className="text-[#C21111]" />
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            Información de la edición
                          </h4>
                          <p className="text-sm text-gray-500">
                            Categorías y calendario de actividades.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5!">
                        <div className="mb-3! flex items-center justify-between gap-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            Categorías de la edición
                          </h5>

                          <span className="rounded-full bg-red-50 px-2.5! py-1! text-xs font-semibold text-[#C21111]">
                            {categoriasEdicion.length}{" "}
                            {categoriasEdicion.length === 1
                              ? "categoría"
                              : "categorías"}
                          </span>
                        </div>

                        {categoriasEdicion.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                            {categoriasEdicion.map((item) => (
                              <div
                                key={
                                  item.id_edicion_categoria ?? item.id_categoria
                                }
                                className="flex min-w-0 items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50 px-3! py-2.5!"
                              >
                                <Trophy
                                  size={17}
                                  className="shrink-0 text-[#C21111]"
                                />

                                <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-gray-700">
                                  {obtenerNombreCategoria(item)
                                    ?.trim()
                                    .split(/\s+/)
                                    .map(
                                      (palabra) =>
                                        palabra
                                          .charAt(0)
                                          .toLocaleUpperCase("es-CO") +
                                        palabra
                                          .slice(1)
                                          .toLocaleLowerCase("es-CO"),
                                    )
                                    .join(" ")}
                                </p>

                                <CheckCircle2
                                  size={15}
                                  className="shrink-0 text-green-600"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-lg bg-gray-50 p-3! text-sm text-gray-500">
                            No hay categorías disponibles para esta edición.
                          </p>
                        )}
                      </div>

                      <div className="mt-6!">
                        <h5 className="mb-3! text-sm font-bold text-gray-900">
                          Calendario de la edición
                        </h5>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {etapasEdicion.map((etapa, index) => {
                            const etapaEsActual =
                              etapaActual === etapa.nombre.toLowerCase();

                            return (
                              <div
                                key={etapa.nombre}
                                className={`rounded-xl border p-3! ${
                                  etapaEsActual
                                    ? "border-red-200 bg-red-50"
                                    : "border-gray-100 bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                      etapaEsActual
                                        ? "bg-[#C21111] text-white"
                                        : "bg-white text-gray-500"
                                    }`}
                                  >
                                    {index + 1}
                                  </span>

                                  <p
                                    className={`text-sm font-semibold ${
                                      etapaEsActual
                                        ? "text-[#C21111]"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {etapa.nombre}
                                  </p>
                                </div>

                                <p className="mt-2! pl-9! text-xs leading-5 text-gray-500">
                                  {etapa.inicio && etapa.fin
                                    ? `${formatearFecha(etapa.inicio)} — ${formatearFecha(etapa.fin)}`
                                    : "Fechas no disponibles"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {etapaActual === "convocatoria" && (
                        <div className="mt-3! border-t border-gray-100 pt-4!">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/inscripcion-edicion-publica/${edicion.id_edicion}`,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-bold text-white transition hover:bg-[#A90F0F]"
                          >
                            Quiero participar
                            <ArrowRight size={17} />
                          </button>
                        </div>
                      )}
                    </article>
                  )}
                </article>
              )}

              <div className="mt-12!">
                {noticias.length > 0 ? (
                  <div className="mt-5!">
                    <div className="mb-4! flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => desplazarNoticias(-1)}
                        aria-label="Ver noticias anteriores"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-[#C21111] hover:bg-red-50 hover:text-[#C21111]"
                      >
                        <ChevronLeft size={19} />
                      </button>

                      <button
                        type="button"
                        onClick={() => desplazarNoticias(1)}
                        aria-label="Ver noticias siguientes"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-[#C21111] hover:bg-red-50 hover:text-[#C21111]"
                      >
                        <ChevronRight size={19} />
                      </button>
                    </div>

                    <div
                      ref={noticiasCarruselRef}
                      className="flex items-stretch gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-3 snap-x snap-mandatory"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#C21111 #F3F4F6",
                        overscrollBehaviorX: "contain",
                      }}
                    >
                      {noticias.map((noticia) => (
                        <article
                          key={noticia.id}
                          className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-md sm:w-[calc(40%-10px)] lg:w-[calc(28%-12px)]"
                        >
                          <div className="h-1 shrink-0 bg-[#C21111]" />

                          <div className="flex flex-1 flex-col p-4!">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#C21111]">
                              {noticia.icono === "cierre" ? (
                                <CheckCircle2 size={15} />
                              ) : noticia.icono === "proxima" ? (
                                <CalendarDays size={15} />
                              ) : (
                                <Newspaper size={15} />
                              )}

                              {noticia.categoria}
                            </div>

                            <h4 className="mt-3! text-base font-bold leading-6 text-gray-900">
                              {noticia.titulo}
                            </h4>

                            <p className="mt-2! flex-1 text-sm leading-6 text-gray-600">
                              {noticia.icono === "cierre"
                                ? "Esta edición ha finalizado. Si deseas consultar tus resultados, ingresa al sistema PAMCE y revisa la información correspondiente a la edición."
                                : noticia.descripcion}
                            </p>

                            {noticia.fecha && (
                              <div className="mt-4! border-t border-gray-100 pt-3!">
                                <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                                  <CalendarDays size={14} />
                                  {formatearFecha(noticia.fecha)}
                                </span>
                              </div>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5! rounded-xl border border-gray-200 bg-gray-50 px-6! py-8! text-center">
                    <Newspaper size={28} className="mx-auto! text-gray-400" />

                    <h4 className="mt-3! font-semibold text-gray-900">
                      Próximamente más noticias
                    </h4>

                    <p className="mt-2! text-sm leading-6 text-gray-600">
                      Aquí encontrarás información sobre las ediciones del
                      PAMCE.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="relative overflow-hidden bg-[#970D0D] text-white!">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />

          <div className="relative mx-auto! max-w-7xl! px-6! pb-6! pt-14! lg:px-8!">
            <div className="grid gap-10 border-b border-white/20 pb-10 md:grid-cols-[1.3fr_0.7fr_1.2fr] md:gap-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/65!">
                  Plataforma institucional
                </span>

                <h2 className="mt-3! text-3xl font-bold tracking-tight text-white!">
                  PAMCE<span className="text-white/50">.</span>
                </h2>

                <p className="mt-3! max-w-sm text-sm leading-7 text-white/80!">
                  Premio Anual al Mérito Científico y Empresarial del programa
                  de Ingeniería de Sistemas de la Universidad Francisco de Paula
                  Santander.
                </p>

                <div className="mt-5! h-1 w-14 rounded-full bg-white/80!" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white!">
                  Explora
                </h3>

                <ul className="mt-5! space-y-3">
                  <li>
                    <a
                      href="#inicio"
                      className="inline-flex items-center text-sm text-white/75! transition-colors hover:translate-x-1 hover:text-white!"
                    >
                      Inicio
                    </a>
                  </li>

                  <li>
                    <a
                      href="#pamce"
                      className="inline-flex items-center text-sm text-white/75 transition-colors hover:translate-x-1 hover:text-white"
                    >
                      ¿Qué es PAMCE?
                    </a>
                  </li>

                  <li>
                    <a
                      href="#noticias"
                      className="inline-flex items-center text-sm text-white/75 transition-colors hover:translate-x-1 hover:text-white"
                    >
                      Noticias y ediciones
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white!">
                  Institución
                </h3>

                <div className="mt-5! flex items-start gap-4">
                  <div className="flex h-26 w-26 shrink-0 items-center justify-center rounded-xl bg-white p-2!">
                    <img
                      src={logo_ufps}
                      alt="Logo de la Universidad Francisco de Paula Santander"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold leading-6 text-white!">
                      Universidad Francisco de Paula Santander
                    </h4>

                    <p className="mt-1! text-sm leading-6 text-white/75!">
                      Programa de Ingeniería de Sistemas
                    </p>

                    <div className="mt-3! flex items-center gap-2 text-sm text-white/75!">
                      <Building2 size={15} className="shrink-0" />
                      <span>Cúcuta, Norte de Santander, Colombia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6! sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-white/65">
                © {new Date().getFullYear()} PAMCE · Todos los derechos
                reservados.
              </p>

              <a
                href="#inicio"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-white/25! px-4! py-2! text-xs font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#970D0D] sm:self-auto"
              >
                Volver al inicio
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </footer>
      </div>{" "}
      <RegistroModal
        open={registroOpen}
        onClose={() => setRegistroOpen(false)}
      />
    </>
  );
};

export default HomePage;
