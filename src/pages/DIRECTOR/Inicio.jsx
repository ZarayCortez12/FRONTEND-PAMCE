import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Users,
  Layers,
  Gavel,
  CheckCheck,
  Filter,
  Activity,
  BarChart3,
  TrendingUp,
  ClipboardCheck,
  Megaphone,
  Trophy,
  CalendarDays,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { obtenerEdicionEnProceso } from "../../features/ediciones/edicion.slice";
import {
  listarConvocatoriasPorEdicion,
  listarPostulacionesPorEdicion,
  listarParticipacionesPorEdicion,
} from "../../features/participacion/participacion.slice";
import { listarCategoriasPorEdicion } from "../../features/categorias/categoria.slice";
import { listarJuradosPorEdicion } from "../../features/jurados/jurado.slice";
import LoadingComponent from "@/components/LoadingComponent";

const EMPTY = [];

const COLOR = {
  pendiente: "#f59e0b",
  aceptada: "#10b981",
  rechazada: "#e10318",
  evaluada: "#10b981",
  porEvaluar: "#f59e0b",
  sinJurado: "#e5e7eb",
  postulaciones: "#cbd5e1",
  participaciones: "#e10318",
};

const capitalize = (v) =>
  typeof v === "string" && v.length > 0
    ? v.charAt(0).toUpperCase() + v.slice(1)
    : "";

const plural = (n, singular, pluralForm) => (n === 1 ? singular : pluralForm);

const pctTexto = (n, d) => (d > 0 ? `${Math.round((n / d) * 100)}%` : "—");

const norm = (v) => String(v ?? "").toLowerCase();

const estadoPostulacion = (p) => {
  const e = norm(p?.estado);
  if (e === "pendiente") return "pendiente";
  if (e.startsWith("acept")) return "aceptada";
  return "rechazada";
};
const esEvaluada = (p) => norm(p?.estado) === "evaluada";

const idParticipacion = (p) => p?.id_participacion ?? p?.id;

function KpiCard({
  titulo,
  valor,
  subtexto,
  alerta,
  Icon,
  colorGradient,
  onClick,
}) {
  return (
    <motion.div
      whileHover={onClick ? { y: -5, scale: 1.02 } : { y: -5 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-4! md:p-5! flex items-center justify-between border border-gray-100 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-md hover:border-red-200" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider font-montserrat">
          {titulo}
        </p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-800 font-poppins mt-1!">
          {valor}
        </p>
        {subtexto && (
          <p
            className={`text-xs font-semibold font-inter mt-1! ${
              alerta ? "text-amber-600" : "text-gray-400"
            }`}
          >
            {subtexto}
          </p>
        )}
      </div>

      <div
        className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg transform rotate-3 ml-2`}
      >
        <Icon className="text-white transform -rotate-3" size={24} />
      </div>
    </motion.div>
  );
}

function Card({ titulo, Icon, accion, extra, className = "", children }) {
  return (
    <section
      className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-5! flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4!">
        <div className="flex items-start gap-2 min-w-0">
          <Icon className="text-red-600 mt-0.5 shrink-0" size={18} />

          <div className="min-w-0">
            <h3 className="font-bold text-gray-700! font-montserrat text-base! leading-tight">
              {titulo}
            </h3>
          </div>
        </div>

        {extra && <div className="shrink-0 ml-auto">{extra}</div>}

        {accion}
      </div>

      {children}
    </section>
  );
}

function Vacio({ texto }) {
  return (
    <div className="flex-1 flex items-center justify-center py-8! text-center">
      <p className="text-xs font-semibold text-gray-400 font-inter">{texto}</p>
    </div>
  );
}

function LinkButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3! py-1.5! bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
    >
      {children}
    </button>
  );
}

function Embudo({ etapas }) {
  const max = Math.max(...etapas.map((e) => e.valor), 1);
  return (
    <div className="flex-1 flex flex-col justify-center space-y-5 font-inter">
      {etapas.map((e, i) => {
        return (
          <div key={e.nombre} className="mb-4!">
            <div className="flex items-baseline justify-between text-xs mb-1!">
              <span className="font-semibold text-gray-600">{e.nombre}</span>
              <span className="font-extrabold text-gray-800">{e.valor}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(e.valor / max) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: e.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeyendaItem({ color, texto, valor }) {
  return (
    <div className="flex items-center justify-between text-xs font-inter">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold text-gray-600">{texto}</span>
      </div>
      <span className="font-extrabold text-gray-800">{valor}</span>
    </div>
  );
}

const definirEtapas = (e) => [
  {
    clave: "convocatoria",
    nombre: "Convocatoria",
    inicio: e.fecha_inicio_convocatoria,
    fin: e.fecha_fin_convocatoria,
  },
  {
    clave: "evaluacion",
    nombre: "Evaluación",
    inicio: e.fecha_inicio_evaluacion,
    fin: e.fecha_fin_evaluacion,
  },
  {
    clave: "premiacion",
    nombre: "Premiación",
    inicio: e.fecha_inicio_premiacion,
    fin: e.fecha_fin_premiacion,
  },
];

const obtenerEtapaActual = (edicion) => {
  const ahora = dayjs();

  const etapas = definirEtapas(edicion).filter(
    (et) =>
      et.inicio &&
      et.fin &&
      dayjs(et.inicio).isValid() &&
      dayjs(et.fin).isValid(),
  );

  for (const etapa of etapas) {
    const inicio = dayjs(etapa.inicio).startOf("day");
    const fin = dayjs(etapa.fin).endOf("day");

    if (!ahora.isBefore(inicio) && !ahora.isAfter(fin)) {
      return etapa.nombre;
    }
  }

  if (etapas.length === 0) return "Sin etapa definida";

  const primera = etapas.reduce(
    (min, et) => (dayjs(et.inicio).isBefore(dayjs(min.inicio)) ? et : min),
    etapas[0],
  );

  const ultima = etapas.reduce(
    (max, et) => (dayjs(et.fin).isAfter(dayjs(max.fin)) ? et : max),
    etapas[0],
  );

  if (ahora.isBefore(dayjs(primera.inicio).startOf("day"))) {
    return "Por iniciar";
  }

  if (ahora.isAfter(dayjs(ultima.fin).endOf("day"))) {
    return "Etapas finalizadas";
  }

  return "Entre etapas";
};

const ESTILOS_ETAPA = {
  Convocatoria: {
    Icon: Megaphone,
    clases: "border-blue-200 bg-blue-50 text-blue-700",
  },
  Evaluación: {
    Icon: ClipboardCheck,
    clases: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Premiación: {
    Icon: Trophy,
    clases: "border-amber-300 bg-amber-50 text-amber-700",
  },
};

function EncabezadoEdicion({ edicion, diasParaCierre }) {
  const etapaActual = obtenerEtapaActual(edicion);

  const etapaNormalizada = etapaActual
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const configEtapa =
    etapaNormalizada === "convocatoria"
      ? ESTILOS_ETAPA.Convocatoria
      : etapaNormalizada === "evaluacion"
        ? ESTILOS_ETAPA.Evaluación
        : etapaNormalizada === "premiacion"
          ? ESTILOS_ETAPA.Premiación
          : null;

  const edicionFinalizada = dayjs().isAfter(
    dayjs(edicion.fecha_fin).endOf("day"),
  );

  return (
    <header className="mb-4! flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-1">
        <IoMdArrowDropright
          className="mt-0.5 shrink-0 text-red-600"
          size={32}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="break-words font-montserrat text-xl font-extrabold leading-tight text-gray-800 md:text-3xl">
              {capitalize(edicion.nombre_edicion)}
            </h1>

            {configEtapa && (
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5! py-1.5! font-inter text-[11px] font-bold ${configEtapa.clases}`}
              >
                <configEtapa.Icon size={15} strokeWidth={2.3} />
                <span>{etapaActual}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4! py-3! sm:min-w-[210px]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
          <CalendarDays size={21} />
        </div>

        <div>
          <p className="mt-0.5! font-poppins text-lg font-extrabold leading-tight text-gray-800">
            {edicionFinalizada
              ? "Finalizada"
              : `${diasParaCierre} ${plural(diasParaCierre, "día", "días")}`}
          </p>

          <p className="mt-0.5! font-inter text-[11px] text-gray-500">
            {edicionFinalizada
              ? "El periodo ha concluido"
              : "Para finalizar la edición"}
          </p>
        </div>
      </div>
    </header>
  );
}

function Inicio() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const edicion_en_proceso = useSelector(
    (state) => state.ediciones.edicion_en_proceso,
  );
  const participaciones =
    useSelector((state) => state.participacion.participaciones_edicion) ??
    EMPTY;
  const postulaciones =
    useSelector((state) => state.participacion.postulaciones_edicion) ?? EMPTY;
  const categorias =
    useSelector((state) => state.categorias.categorias_edicion) ?? EMPTY;
  const jurados =
    useSelector((state) => state.jurados.jurados_edicion) ?? EMPTY;
  const convocatorias =
    useSelector((state) => state.participacion.convocatorias) ?? EMPTY;

  const hayEdicion =
    edicion_en_proceso && Object.keys(edicion_en_proceso).length > 0;

  useEffect(() => {
    document.title = "PAMCE | Inicio Director";
    let activo = true;

    const cargar = async () => {
      try {
        setLoading(true);

        if (!hayEdicion) {
          await dispatch(obtenerEdicionEnProceso());
          return;
        }

        const params = { id_edicion: edicion_en_proceso.id_edicion };
        await Promise.all([
          dispatch(listarParticipacionesPorEdicion(params)),
          dispatch(listarPostulacionesPorEdicion(params)),
          dispatch(listarCategoriasPorEdicion(params)),
          dispatch(listarJuradosPorEdicion(params)),
          dispatch(listarConvocatoriasPorEdicion(params)),
        ]);
      } catch (error) {
        console.log("Error al cargar datos:", error);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [dispatch, edicion_en_proceso]);

  const cronograma = useMemo(() => {
    const etapas = [
      {
        clave: "convocatoria",
        nombre: "Convocatoria",
        inicio: edicion_en_proceso?.fecha_inicio_convocatoria,
        fin: edicion_en_proceso?.fecha_fin_convocatoria,
      },
      {
        clave: "evaluacion",
        nombre: "Evaluación",
        inicio: edicion_en_proceso?.fecha_inicio_evaluacion,
        fin: edicion_en_proceso?.fecha_fin_evaluacion,
      },
      {
        clave: "premiacion",
        nombre: "Premiación",
        inicio: edicion_en_proceso?.fecha_inicio_premiacion,
        fin: edicion_en_proceso?.fecha_fin_premiacion,
      },
    ];

    const hoy = dayjs().startOf("day");

    const etapasCalculadas = etapas.map((etapa) => {
      const fechasValidas =
        etapa.inicio &&
        etapa.fin &&
        dayjs(etapa.inicio).isValid() &&
        dayjs(etapa.fin).isValid();

      if (!fechasValidas) {
        return { ...etapa, estado: "Sin fechas", porcentaje: 0 };
      }

      const inicio = dayjs(etapa.inicio).startOf("day");
      const fin = dayjs(etapa.fin).startOf("day");

      if (fin.isBefore(inicio)) {
        return { ...etapa, estado: "Fechas por revisar", porcentaje: 0 };
      }

      const duracion = fin.diff(inicio, "day") + 1;
      const transcurridos = Math.max(
        0,
        Math.min(duracion, hoy.diff(inicio, "day") + 1),
      );

      let estado;
      let porcentaje = 0;

      if (hoy.isBefore(inicio)) {
        estado = "Por iniciar";
      } else if (hoy.isAfter(fin)) {
        estado = "Finalizada";
        porcentaje = 100;
      } else {
        estado = "En curso";
        porcentaje = Math.round((transcurridos / duracion) * 100);
      }

      return {
        ...etapa,
        estado,
        porcentaje,
        diasRestantes: Math.max(0, fin.diff(hoy, "day")),
      };
    });

    const etapaActual = etapasCalculadas.find(
      (etapa) => etapa.estado === "En curso",
    );

    const primeraFecha = etapasCalculadas.find(
      (etapa) => etapa.inicio && dayjs(etapa.inicio).isValid(),
    )?.inicio;

    const ultimaFecha = [...etapasCalculadas]
      .reverse()
      .find((etapa) => etapa.fin && dayjs(etapa.fin).isValid())?.fin;

    let porcentajeGeneral = 0;

    if (primeraFecha && ultimaFecha) {
      const inicioEdicion = dayjs(primeraFecha).startOf("day");
      const finEdicion = dayjs(ultimaFecha).startOf("day");
      const duracionTotal = finEdicion.diff(inicioEdicion, "day");

      if (duracionTotal > 0) {
        porcentajeGeneral = Math.round(
          Math.max(
            0,
            Math.min(1, hoy.diff(inicioEdicion, "day") / duracionTotal),
          ) * 100,
        );
      } else if (!hoy.isBefore(inicioEdicion)) {
        porcentajeGeneral = 100;
      }
    }

    let estadoGeneral = "Por iniciar";

    if (etapaActual) {
      estadoGeneral = etapaActual.nombre;
    } else if (
      etapasCalculadas.every((etapa) => etapa.estado === "Finalizada")
    ) {
      estadoGeneral = "Etapas finalizadas";
    } else if (
      etapasCalculadas.some((etapa) => etapa.estado === "Sin fechas")
    ) {
      estadoGeneral = "Cronograma incompleto";
    } else if (
      etapasCalculadas.some((etapa) => etapa.estado === "Finalizada") &&
      etapasCalculadas.some((etapa) => etapa.estado === "Por iniciar")
    ) {
      estadoGeneral = "Entre etapas";
    }

    return {
      etapas: etapasCalculadas,
      etapaActual,
      estadoGeneral,
      porcentajeGeneral,
      fechaInicio: primeraFecha,
      fechaFin: ultimaFecha,
    };
  }, [edicion_en_proceso]);

  const m = useMemo(() => {
    const estados = { pendiente: 0, aceptada: 0, rechazada: 0 };
    postulaciones.forEach((p) => {
      estados[estadoPostulacion(p)] += 1;
    });

    const convocados = convocatorias.length;
    const registrados = convocatorias.filter(
      (c) => c.estado_envio === "postulado",
    ).length;
    const embudo = [
      { nombre: "Convocados", valor: convocados, color: "#fca5a5" },
      { nombre: "Registrados", valor: registrados, color: "#f87171" },
      {
        nombre: "Postulaciones",
        valor: postulaciones.length,
        color: "#ef4444",
      },
      {
        nombre: "Participaciones",
        valor: participaciones.length,
        color: "#b91c1c",
      },
    ];

    const porCategoria = categorias.map((cat) => ({
      nombre: capitalize(cat.nombre_categoria),
      postulaciones: postulaciones.filter(
        (p) => p.edicionCategoria?.id_categoria === cat.id_categoria,
      ).length,
      participaciones: participaciones.filter(
        (p) => p.edicionCategoria?.id_categoria === cat.id_categoria,
      ).length,
      activa: cat.edicionesCategoria?.[0]?.estado === "activo",
    }));
    const activas = porCategoria.filter((c) => c.activa).length;

    const porDia = {};
    postulaciones.forEach((p) => {
      if (!p.fecha_postulacion) return;

      const fecha = dayjs(p.fecha_postulacion);

      if (!fecha.isValid()) return;

      const clave = fecha.format("YYYY-MM-DD");

      porDia[clave] = (porDia[clave] || 0) + 1;
    });

    const evolucion = Object.keys(porDia)
      .sort()
      .map((fecha) => ({
        fecha: dayjs(fecha).format("DD MMM"),
        nuevas: porDia[fecha],
      }));

    const mapaPart = new Map(
      participaciones.map((p) => [idParticipacion(p), p]),
    );
    const idsAsignados = new Set();

    const filasJurados = jurados.map((j, i) => {
      const u = j.usuario ?? j;
      const asignadas = j.evaluacionesAsignadas ?? EMPTY;
      asignadas.forEach((a) => idsAsignados.add(idParticipacion(a)));
      const evaluadas = asignadas.filter((a) =>
        esEvaluada(mapaPart.get(idParticipacion(a)) ?? a),
      ).length;
      const nombre =
        `${capitalize(u.primer_nombre)} ${capitalize(u.segundo_nombre)} ${capitalize(u.primer_apellido)} ${capitalize(u.segundo_apellido)}`.trim() ||
        "Jurado";
      return {
        id: j.id_jurado ?? u.id_usuario ?? i,
        nombre,
        corto: `${capitalize(u.primer_nombre)} ${capitalize(u.primer_apellido)?.[0] ?? ""}.`,
        correo: u.correo_electronico,
        asignadas: asignadas.length,
        evaluadas,
        pendientes: asignadas.length - evaluadas,
      };
    });

    let evaluadasTotal = 0;
    let conJuradoPorEvaluar = 0;
    let sinJurado = 0;
    participaciones.forEach((p) => {
      if (esEvaluada(p)) evaluadasTotal += 1;
      else if (idsAsignados.has(idParticipacion(p))) conJuradoPorEvaluar += 1;
      else sinJurado += 1;
    });

    const juradosSinAsignacion = filasJurados.filter(
      (j) => j.asignadas === 0,
    ).length;

    const tablaJurados = [...filasJurados].sort(
      (a, b) => b.pendientes - a.pendientes || a.nombre.localeCompare(b.nombre),
    );
    const cargaJurados = [...filasJurados]
      .filter((j) => j.asignadas > 0)
      .sort((a, b) => b.asignadas - a.asignadas)
      .slice(0, 8);

    return {
      estados,
      embudo,
      convocados,
      registrados,
      porCategoria,
      activas,
      inactivas: porCategoria.length - activas,
      evolucion,
      filasJurados,
      tablaJurados,
      cargaJurados,
      juradosSinAsignacion,
      cobertura: { evaluadasTotal, conJuradoPorEvaluar, sinJurado },
    };
  }, [postulaciones, participaciones, categorias, jurados, convocatorias]);

  if (loading) {
    return <LoadingComponent mensaje="Cargando Información de la Edición..." />;
  }

  if (!hayEdicion) {
    return (
      <div className="flex flex-col items-center justify-center mt-[-25px] h-[80vh] text-center">
        <FaUserShield className="text-[#e10318]" size={60} />
        <h1 className="text-[2.5rem] font-bold font-poppins mt-2.5">
          ¡Bienvenido de nuevo, Director!
        </h1>
        <p className="text-[1.2rem] text-[#666] max-w-[600px] mt-2.5">
          Este es tu panel de control. Explora las opciones del menú para
          comenzar a gestionar el sistema.
        </p>
      </div>
    );
  }

  const hoy = new Date();
  const convocatoriaIniciada = !(
    hoy <= dayjs(edicion_en_proceso.fecha_inicio_convocatoria).toDate()
  );

  const ir = (ruta, menuKey, state) => {
    if (menuKey) localStorage.setItem("selectedMenuKey", menuKey);
    navigate(ruta, state ? { state } : undefined);
  };

  const irSiConvocatoria = (ruta, menuKey, state) => {
    if (!convocatoriaIniciada) return;
    ir(ruta, menuKey, state);
  };

  const diasParaCierre = Math.max(
    dayjs(edicion_en_proceso.fecha_fin).diff(dayjs(), "day"),
    0,
  );

  const totalEstados =
    m.estados.pendiente + m.estados.aceptada + m.estados.rechazada;
  const datosEstados = [
    {
      nombre: "Pendientes",
      valor: m.estados.pendiente,
      color: COLOR.pendiente,
    },
    { nombre: "Aceptadas", valor: m.estados.aceptada, color: COLOR.aceptada },
    {
      nombre: "Rechazadas",
      valor: m.estados.rechazada,
      color: COLOR.rechazada,
    },
  ];

  const { evaluadasTotal, conJuradoPorEvaluar, sinJurado } = m.cobertura;

  const alturaCategorias = Math.max(220, m.porCategoria.length * 56);

  return (
    <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1800px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-6">
      <EncabezadoEdicion
        edicion={edicion_en_proceso}
        diasParaCierre={diasParaCierre}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          titulo="Postulaciones a la Edición"
          valor={postulaciones.length}
          alerta={m.estados.pendiente > 0}
          Icon={Users}
          colorGradient="from-red-600 to-red-400"
          onClick={() =>
            irSiConvocatoria(
              "/director/postulados-edicion",
              "postulados-edicion",
            )
          }
        />
        <KpiCard
          titulo="Categorías Activas"
          valor={m.activas}
          Icon={Layers}
          colorGradient="from-orange-500 to-orange-300"
          onClick={() => ir("/director/categorias-edicion")}
        />
        <KpiCard
          titulo="Jurados evaluando en la Edición"
          valor={jurados.length}
          alerta={m.juradosSinAsignacion > 0}
          Icon={Gavel}
          colorGradient="from-gray-800 to-gray-600"
          onClick={() => ir("/director/jurados-edicion")}
        />
        <KpiCard
          titulo="Participaciones de la Edición"
          valor={participaciones.length}
          alerta={sinJurado > 0}
          Icon={CheckCheck}
          colorGradient="from-green-600 to-green-400"
          onClick={() => irSiConvocatoria("/director/participaciones-edicion")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6!">
        <Card
          className="lg:col-span-8"
          titulo="Postulaciones a través del tiempo"
          Icon={TrendingUp}
        >
          {m.evolucion.length === 0 ? (
            <Vacio texto="Aún no hay postulaciones para graficar" />
          ) : (
            <div className="relative flex-1 min-h-[260px] font-inter">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={m.evolucion}
                    margin={{ left: -15, right: 8, top: 8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gradPost" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#e10318"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#e10318"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="fecha"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                      tickMargin={10}
                      padding={{ left: 12, right: 12 }}
                    />

                    <YAxis
                      allowDecimals={false}
                      domain={[0, "auto"]}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
                      tickMargin={8}
                      width={40}
                    />

                    <Tooltip
                      formatter={(valor) => [valor, "Postulaciones del día"]}
                      labelFormatter={(fecha) => `Fecha: ${fecha}`}
                    />

                    <Area
                      type="monotone"
                      dataKey="nuevas"
                      name="Postulaciones del día"
                      stroke="#e10318"
                      strokeWidth={2.5}
                      fill="url(#gradPost)"
                      activeDot={{ r: 6 }}
                      dot={{ r: 3, fill: "#e10318", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>

        <Card
          className="lg:col-span-4"
          titulo="Estado de postulaciones"
          Icon={Activity}
        >
          {totalEstados === 0 ? (
            <Vacio texto="Aún no hay postulaciones" />
          ) : (
            <>
              <div className="h-60 relative font-inter">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-gray-800">
                    {totalEstados}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    Total
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosEstados}
                      dataKey="valor"
                      nameKey="nombre"
                      innerRadius={75}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {datosEstados.map((d) => (
                        <Cell key={d.nombre} fill={d.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3!">
                {datosEstados.map((d) => (
                  <LeyendaItem
                    key={d.nombre}
                    color={d.color}
                    texto={d.nombre}
                    valor={d.valor}
                  />
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6!">
        <Card
          className="lg:col-span-5"
          titulo="Recorrido de los participantes"
          Icon={Filter}
        >
          {m.convocados === 0 && postulaciones.length === 0 ? (
            <Vacio texto="Aún no hay convocados ni postulaciones" />
          ) : (
            <>
              <Embudo etapas={m.embudo} />

              <div className="grid grid-cols-2 gap-4 pt-4! border-t border-gray-100 font-inter">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400">
                    Efectividad de la convocatoria
                  </p>
                  <p className="mt-0.5! text-xl font-extrabold text-gray-800">
                    {pctTexto(m.registrados, m.convocados)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {m.registrados} de {m.convocados} se registraron
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400">
                    Postulaciones aceptadas
                  </p>
                  <p className="mt-0.5! text-xl font-extrabold text-gray-800">
                    {pctTexto(participaciones.length, postulaciones.length)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {participaciones.length} de {postulaciones.length} pasaron a
                    participar
                  </p>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card
          className="lg:col-span-7 font-inter"
          titulo="Postulaciones y participaciones por categoría"
          Icon={BarChart3}
          extra={
            <div className="flex items-center gap-3 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                  Postulaciones
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e10318]" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                  Participaciones
                </span>
              </div>
            </div>
          }
        >
          {m.porCategoria.length === 0 ? (
            <Vacio texto="La edición aún no tiene categorías" />
          ) : (
            <div
              className="w-full flex-1"
              style={{ minHeight: alturaCategorias }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={m.porCategoria}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: -52, bottom: 0 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid horizontal={false} stroke="#f1f5f9" />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                      fontFamily: "Inter",
                      fill: "#64748b",
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickMargin={8}
                  />

                  <YAxis
                    type="category"
                    dataKey="nombre"
                    width={170}
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fontFamily: "Inter",
                      fill: "#475569",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                  />

                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                    }}
                    labelStyle={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      color: "#1f2937",
                      marginBottom: 4,
                    }}
                  />

                  <Bar
                    dataKey="postulaciones"
                    name="Postulaciones"
                    fill="#64748b"
                    radius={[0, 5, 5, 0]}
                    barSize={12}
                  />

                  <Bar
                    dataKey="participaciones"
                    name="Participaciones"
                    fill="#e10318"
                    radius={[0, 5, 5, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6! mb-6!">
        <Card
          className="lg:col-span-8"
          titulo="Jurados de la edición"
          Icon={Gavel}
        >
          {m.tablaJurados.length === 0 ? (
            <Vacio texto="Aún no hay jurados en esta edición" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-inter">
                <thead>
                  <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                    <th className="pb-2! font-semibold">Jurado</th>
                    <th className="pb-2! font-semibold text-center">
                      Asignadas
                    </th>
                    <th className="pb-2! font-semibold w-2/5">
                      Avance de evaluación
                    </th>
                    <th className="pb-2! font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {m.tablaJurados.slice(0, 6).map((j) => {
                    const pct =
                      j.asignadas > 0 ? (j.evaluadas / j.asignadas) * 100 : 0;
                    const estado =
                      j.asignadas === 0
                        ? {
                            txt: "Sin asignaciones",
                            cls: "bg-gray-100 text-gray-500",
                          }
                        : j.pendientes === 0
                          ? {
                              txt: "Completó",
                              cls: "bg-emerald-100 text-emerald-700",
                            }
                          : {
                              txt: "En curso",
                              cls: "bg-amber-100 text-amber-700",
                            };
                    return (
                      <tr
                        key={j.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="py-3!">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-800 leading-tight truncate">
                                {j.nombre}
                              </p>
                              {j.correo && (
                                <p className="text-[10px] text-gray-400 truncate">
                                  {j.correo}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3! text-center text-sm font-extrabold text-gray-700">
                          {j.asignadas}
                        </td>
                        <td className="py-3! pr-4!">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-gray-500 w-14 text-right">
                              {j.evaluadas}/{j.asignadas}
                            </span>
                          </div>
                        </td>
                        <td className="py-3! text-right">
                          <span
                            className={`px-2.5! py-1! rounded-lg text-[10px] font-bold ${estado.cls}`}
                          >
                            {estado.txt}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          className="lg:col-span-4 font-inter"
          titulo="Estado del cronograma"
          Icon={CalendarDays}
        >
          <div className="space-y-5">
            <div>
              <div className="mb-2! flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-gray-600">
                  Tiempo del cronograma
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {cronograma.porcentajeGeneral}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#e10318] transition-all duration-500"
                  style={{ width: `${cronograma.porcentajeGeneral}%` }}
                />
              </div>

              <div className="mt-2! flex justify-between gap-3 text-[10px] text-gray-400">
                <span>
                  {cronograma.fechaInicio
                    ? dayjs(cronograma.fechaInicio).format("DD MMM YYYY")
                    : "Sin fecha inicial"}
                </span>
                <span>
                  {cronograma.fechaFin
                    ? dayjs(cronograma.fechaFin).format("DD MMM YYYY")
                    : "Sin fecha final"}
                </span>
              </div>
            </div>

            <div className="relative space-y-0">
              {cronograma.etapas.map((etapa, index) => {
                const actual = etapa.estado === "En curso";
                const finalizada = etapa.estado === "Finalizada";
                const sinFechas = etapa.estado === "Sin fechas";

                const colorPunto = actual
                  ? "bg-[#e10318] ring-4 ring-red-100"
                  : finalizada
                    ? "bg-emerald-500"
                    : "bg-gray-300";

                const colorTexto = actual
                  ? "text-[#e10318]"
                  : finalizada
                    ? "text-emerald-700"
                    : "text-gray-500";

                return (
                  <div
                    key={etapa.clave}
                    className="relative flex gap-3 pb-5! last:pb-0"
                  >
                    {index < cronograma.etapas.length - 1 && (
                      <div className="absolute left-[7px] top-4 h-full w-0.5 bg-gray-200" />
                    )}

                    <div className="relative z-10 mt-1 shrink-0">
                      <div
                        className={`h-4 w-4 rounded-full border-2 border-white ${colorPunto}`}
                      />
                    </div>

                    <div
                      className={`min-w-0 flex-1 rounded-lg border p-3! ${
                        actual
                          ? "border-red-100 bg-red-50/60"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-gray-800">
                          {etapa.nombre}
                        </p>

                        <span
                          className={`rounded-full px-2! py-1! text-[10px] font-semibold ${colorTexto} ${
                            actual
                              ? "bg-red-100"
                              : finalizada
                                ? "bg-emerald-50"
                                : "bg-gray-100"
                          }`}
                        >
                          {etapa.estado}
                        </span>
                      </div>

                      <div className="mt-2! flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-gray-500">
                        <p>
                          <span className="font-medium text-gray-600">
                            Inicio:
                          </span>{" "}
                          {etapa.inicio && dayjs(etapa.inicio).isValid()
                            ? dayjs(etapa.inicio).format("DD MMM YYYY")
                            : "Sin definir"}
                        </p>

                        <p>
                          <span className="font-medium text-gray-600">
                            Fin:
                          </span>{" "}
                          {etapa.fin && dayjs(etapa.fin).isValid()
                            ? dayjs(etapa.fin).format("DD MMM YYYY")
                            : "Sin definir"}
                        </p>
                      </div>

                      {actual && (
                        <div className="mt-3!">
                          <div className="mb-1! flex justify-between text-[10px]">
                            <span className="text-gray-500">
                              Tiempo transcurrido
                            </span>
                            <span className="font-bold text-[#e10318]">
                              {etapa.porcentaje}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-red-100">
                            <div
                              className="h-full rounded-full bg-[#e10318]"
                              style={{ width: `${etapa.porcentaje}%` }}
                            />
                          </div>

                          <p className="mt-2! text-[10px] text-gray-500">
                            {etapa.diasRestantes === 0
                              ? "La etapa termina hoy."
                              : `Quedan ${etapa.diasRestantes} ${
                                  etapa.diasRestantes === 1 ? "día" : "días"
                                } para finalizar esta etapa.`}
                          </p>
                        </div>
                      )}

                      {sinFechas && (
                        <p className="mt-2! text-[10px] text-amber-700">
                          Revisa las fechas configuradas para esta etapa.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Inicio;
