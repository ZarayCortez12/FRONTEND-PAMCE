import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserShield } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Users, Clock, Eye } from "lucide-react";
import {
  TrendingUp,
  CheckCheck,
  Timer,
  CalendarCheck,
  UsersRound,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { m, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { obtenerParticipacionesEdicion } from "../../features/jurados/jurado.slice";

function KpiCard({ titulo, valor, Icon, colorGradient, onClick }) {
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
      </div>

      <div
        className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg transform rotate-3 ml-2`}
      >
        <Icon className="text-white transform -rotate-3" size={24} />
      </div>
    </motion.div>
  );
}

function Inicio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hoy = new Date().toISOString().split("T")[0];
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const participaciones = useSelector((state) => state.jurados.participaciones);
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const totalParticipacionesEvaluadas = participaciones.filter(
    (p) => p.estado === "evaluado",
  ).length;
  const totalParticipacionesPendientes = participaciones.filter(
    (p) => p.estado === "asignado",
  ).length;
  const totalParticipacionesEvaluadasHoy = participaciones.filter(
    (p) => p?.fecha_evaluacion?.split("T")[0] === hoy,
  ).length;

  useEffect(() => {
    document.title = "PAMCE | Inicio Jurado";
    if (!edicion?.id_edicion) return;
    dispatch(
      obtenerParticipacionesEdicion({
        id: edicion.id_edicion,
        params: { id_jurado: usuario.id_usuario },
      }),
    );
  }, [edicion?.id_edicion, dispatch, usuario]);

  const dataParticipaciones = Object.values(
    participaciones.reduce((acc, p) => {
      const categoria =
        p.participacion.edicionCategoria.categoria.nombre_categoria;

      if (!acc[categoria]) {
        acc[categoria] = { nombre: categoria, participaciones: 0 };
      }

      acc[categoria].participaciones++;

      return acc;
    }, {}),
  );

  const generateColors = (count) => {
    const baseHue = 350;
    return Array.from({ length: count }, (_, i) => {
      const lightness = 40 + i * (40 / count);
      return `hsl(${baseHue}, 80%, ${lightness}%)`;
    });
  };

  const COLORS = generateColors(dataParticipaciones?.length);

  if (!edicion) {
    return (
      <div className="flex flex-col items-center justify-center mt-[-25px] h-[80vh] text-center">
        <FaUserShield className="text-[#e10318]" size={60} />
        <h1 className="text-[2.5rem] font-bold font-poppins mt-2.5">
          ¡Bienvenido de nuevo, Jurado!
        </h1>
        <p className="text-[1.2rem] text-[#666] max-w-[600px] mt-2.5">
          Este es tu panel de control. Explora las opciones del menú para
          comenzar a gestionar el sistema.
        </p>
      </div>
    );
  }

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1800px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4!">
        <div className="flex items-center">
          <IoMdArrowDropright className="text-red-600 shrink-0" size={35} />
          <div className="ml-[-5px]">
            <h1 className="font-montserrat text-lg md:text-xl font-bold leading-none">
              Panel de Control
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-montserrat mt-1! uppercase tracking-tighter">
              {edicion.nombre_edicion}
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 px-4! py-2! rounded-2xl flex items-center gap-3 self-start sm:self-center shadow-sm -mt-3!">
          <Clock className="text-red-600" size={18} />
          <div>
            <p className="text-[9px] uppercase font-bold text-red-400 leading-none">
              Cierre de la Edición en
            </p>
            <p className="text-base md:text-lg font-black text-red-600 leading-none mt-1!">
              {dayjs(edicion.fecha_fin).diff(dayjs(), "day")} Días
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-2!">
        <KpiCard
          titulo="Participaciones Asignadas"
          valor={participaciones.length}
          Icon={Users}
          colorGradient="from-red-600 to-red-400"
          onClick={() => {
            if (hoy <= edicion.fecha_inicio_convocatoria) return;
            localStorage.setItem("selectedMenuKey", "postulados-edicion");
            navigate("/administrador/postulados-edicion");
          }}
        />
        <KpiCard
          titulo="Participaciones Evaluadas"
          valor={totalParticipacionesEvaluadas}
          Icon={CheckCheck}
          colorGradient="from-orange-500 to-orange-300"
          onClick={() => {
            navigate("/administrador/categorias-edicion");
          }}
        />
        <KpiCard
          titulo="Participaciones Pendientes"
          valor={totalParticipacionesPendientes}
          Icon={Timer}
          colorGradient="from-blue-800 to-blue-600"
          onClick={() => {
            navigate("/administrador/jurados-edicion");
          }}
        />
        <KpiCard
          titulo="Participaciones evaluadas hoy"
          valor={totalParticipacionesEvaluadasHoy}
          Icon={CalendarCheck}
          colorGradient="from-green-600 to-green-400"
          onClick={() => {
            if (hoy <= edicion.fecha_inicio_convocatoria) return;
            navigate("/administrador/participaciones-edicion");
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-3!">
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm p-5! border border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-red-600" size={18} />
            <h3 className="font-bold text-gray-700! font-montserrat text-xl!">
              Distribución
            </h3>
          </div>
          <div className="h-64 relative -mt-6!">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-gray-800">
                {participaciones.length}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                Total
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataParticipaciones}
                  dataKey="participaciones"
                  nameKey="nombre"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                >
                  {dataParticipaciones.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip cornerRadius={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-6! space-y-3">
            {dataParticipaciones.map((cat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-1! rounded-xl hover:bg-gray-50 transition-colors font-inter"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs font-semibold text-gray-600 truncate max-w-[150px]">
                    {capitalizeFirstLetter(cat.nombre)}
                  </span>
                </div>
                <span className="bg-gray-100 px-2! py-1! rounded-md text-[10px] font-bold text-gray-800">
                  {cat.participaciones}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm p-5! border border-gray-100">
          <div className="flex items-center justify-between mb-1!">
            <div className="flex items-center gap-2">
              <UsersRound className="text-red-600" size={18} />
              <div>
                <h3 className="font-bold text-gray-700! font-montserrat text-xl!">
                  Participaciones Asignadas
                </h3>
              </div>
            </div>

            <button
              className="px-4! py-2! bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm -mt-1!"
              onClick={() => {
                localStorage.setItem("selectedMenuKey", "postulados-edicion");
                navigate("/jurado/evaluaciones");
              }}
            >
              Ver todas
            </button>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-gray-400">
                  <th className="px-4! font-black">Participante</th>
                  <th className="font-black text-center">Categoría</th>
                  <th className="font-black text-center">Fecha Registro</th>
                  <th className="font-black text-center">Fecha Evaluación</th>
                  <th className="ont-black text-center">Estado</th>
                  <th className="px-4! font-black text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="font-inter">
                {participaciones.slice(0, 5).map((p, i) => {
                  const esPendiente = p.estado === "asignado";
                  return (
                    <tr
                      key={i}
                      className={`group transition-all duration-300 ${
                        esPendiente
                          ? "bg-amber-50/50 hover:bg-amber-50 border-amber-200"
                          : "bg-white hover:bg-gray-50 border-transparent"
                      } border rounded-2xl shadow-sm`}
                    >
                      <td className="py-2! px-4! rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                              esPendiente
                                ? "bg-amber-500 text-white"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {p.participacion.usuario.primer_nombre[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-tight">
                              {capitalizeFirstLetter(
                                p.participacion.usuario.primer_nombre,
                              )}{" "}
                              {capitalizeFirstLetter(
                                p.participacion.usuario.primer_apellido,
                              )}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {p.participacion.usuario.correo_electronico}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3! flex text-center justify-center">
                        <span className="text-[11px] text-gray-600 font-semibold bg-gray-100/50 px-2! py-1! rounded-lg">
                          {capitalizeFirstLetter(
                            p.participacion.edicionCategoria.categoria
                              .nombre_categoria,
                          )}
                        </span>
                      </td>
                      <td className="py-3! text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-bold text-gray-700">
                            {dayjs(p.participacion.fecha_postulacion).format(
                              "DD/MM/YYYY",
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3! text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-bold text-gray-700">
                            {p.fecha_evaluacion
                              ? dayjs(p.fecha_evaluacion).format("DD/MM/YYYY")
                              : "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3! text-center">
                        <span
                          className={`px-3! py-1.5! rounded-xl text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            esPendiente
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-200 animate-pulse"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {esPendiente && <Clock size={10} />}
                          {esPendiente ? "Pendiente" : "Evaluada"}
                        </span>
                      </td>
                      <td className="py-3! px-4! text-right rounded-r-2xl">
                        <button
                          className={`p-2! rounded-xl transition-all shadow-sm ${
                            esPendiente
                              ? "bg-amber-600 text-white hover:bg-amber-700"
                              : "bg-white text-gray-400 hover:bg-red-600 hover:text-white border border-gray-100"
                          }`}
                          onClick={() =>
                            navigate(
                              `/jurado/evaluaciones/${p.id_participacion}/informacion-evaluacion`,
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
