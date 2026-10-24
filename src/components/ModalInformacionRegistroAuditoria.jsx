import { useEffect } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { obtenerRegistroAuditoria } from "../features/auditoria/auditoria.slice";
import {
  User,
  Calendar,
  Clock3,
  Globe,
  Database,
  FileJson,
  Shield,
  Monitor,
  ArrowRight,
  Hash,
  Activity,
  Code2,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

function renderValue(value) {
  if (value === null || value === undefined) return "Sin valor";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return value.toString();
}

const eventos = {
  POST: {
    texto: "Creación",
    clases: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  },
  INSERT: {
    texto: "Inserción",
    clases: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  },
  PUT: {
    texto: "Actualización",
    clases: "bg-sky-50 text-sky-700 border-sky-200/60",
  },
  DELETE: {
    texto: "Eliminación",
    clases: "bg-rose-50 text-rose-700 border-rose-200/60",
  },
  ACTIVATE: {
    texto: "Activación",
    clases: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  },
  INACTIVE: {
    texto: "Inactivación",
    clases: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  CHANGE_STATE: {
    texto: "Cambio de estado",
    clases: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  },
};

function InformacionRegistroAuditoria({
  abrirModal,
  setAbrirModal,
  id_registro,
}) {
  const dispatch = useDispatch();

  const registro = useSelector((state) => state.auditoria.registro);

  useEffect(() => {
    if (!id_registro) return;
    dispatch(obtenerRegistroAuditoria(id_registro))
      .unwrap()
      .catch((err) => {
        console.log("Error al obtener la evaluacion", err);
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [id_registro, dispatch]);

  if (!registro) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">
          Cargando Información...
        </span>
      </div>
    );
  }

  return (
    <Modal
      open={abrirModal}
      onCancel={() => {
        setAbrirModal(false);
      }}
      footer={null}
      width={900}
      centered
      title={
        <div className="flex items-center gap-3 pb-3! border-b border-slate-100">
          <div className="p-2.5! bg-indigo-50 rounded-xl text-[#24247F]">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-slate-900 m-0 font-poppins">
              Detalle de Auditoría
            </h2>
            <p className="text-xs text-slate-500 m-0 font-inter font-normal">
              Registro de traza y métricas del evento en el sistema
            </p>
          </div>
        </div>
      }
      className="py-4!"
    >
      <div className="space-y-6 pt-2! font-inter">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200/80 p-4! bg-slate-50/50 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1!">
              <Hash size={14} />
              <span className="font-montserrat text-[11px] uppercase tracking-wider font-semibold">
                Registro
              </span>
            </div>
            <h2 className="font-inter text-2xl font-bold text-[#24247F]">
              #{registro.id}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-4! bg-slate-50/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1!">
              <Activity size={14} />
              <span className="font-montserrat text-[11px] uppercase tracking-wider font-semibold">
                Evento
              </span>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-2.5! py-0.5! rounded-full border text-xs font-semibold ${
                  eventos[registro.evento]?.clases ||
                  "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {eventos[registro.evento]?.texto || registro.evento}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-4! bg-slate-50/50 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1!">
              <Calendar size={14} />
              <span className="font-montserrat text-[11px] uppercase tracking-wider font-semibold">
                Fecha & Hora
              </span>
            </div>
            <p className="font-semibold text-slate-800 text-sm mb-0.5!">
              {dayjs(registro.fecha).format("DD/MM/YYYY")}
            </p>
            <p className="text-slate-500 text-xs flex items-center gap-1 m-0">
              <Clock3 size={12} />
              {dayjs(registro.fecha).format("hh:mm:ss A")}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-4! bg-slate-50/50 shadow-xs">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1!">
              <Database size={14} />
              <span className="font-montserrat text-[11px] uppercase tracking-wider font-semibold">
                Tabla Afectada
              </span>
            </div>
            <p className="font-semibold text-slate-800 text-sm capitalize mb-0.5! truncate">
              {registro.tabla}
            </p>
            <p className="text-slate-500 text-xs m-0">
              ID Registro:{" "}
              <span className="font-mono font-medium text-slate-700">
                {registro.registro_id}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2!">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-100 px-4! py-3! flex items-center gap-2">
              <User size={16} className="text-[#24247F]" />
              <h4 className="font-montserrat text-sm font-semibold text-slate-800 m-0">
                Información del Usuario
              </h4>
            </div>

            <div className="p-4! space-y-3.5">
              <div>
                <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5!">
                  Nombre Completo
                </label>
                <p className="font-medium text-slate-800 text-sm m-0">
                  {[
                    registro.usuario?.primer_nombre,
                    registro.usuario?.segundo_nombre,
                    registro.usuario?.primer_apellido,
                    registro.usuario?.segundo_apellido,
                  ]
                    .filter(Boolean)
                    .join(" ") || "No especificado"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1! border-t border-slate-100 mt-2!">
                <div>
                  <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5!">
                    Documento
                  </label>
                  <p className="text-slate-700 text-sm m-0">
                    <span className="font-semibold">
                      {registro.usuario?.tipo_documento}
                    </span>{" "}
                    {registro.usuario?.numero_documento}
                  </p>
                </div>

                <div className="-ml-4!">
                  <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5!">
                    Correo Electrónico
                  </label>
                  <p
                    className="text-slate-700 text-sm truncate m-0"
                    title={registro.usuario?.correo_electronico}
                  >
                    {registro.usuario?.correo_electronico || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-100 px-4! py-3! flex items-center gap-2">
              <Monitor size={16} className="text-[#24247F]" />
              <h4 className="font-montserrat text-sm font-semibold text-slate-800 m-0">
                Contexto Técnico
              </h4>
            </div>

            <div className="p-4! space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5!">
                    Método HTTP
                  </label>
                  <span className="inline-block px-2! py-0.5! bg-slate-100 font-mono text-xs font-semibold text-slate-700 rounded border border-slate-200 mb-1!">
                    {registro.metodo}
                  </span>
                </div>

                <div className="text-right">
                  <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5!">
                    Dirección IP
                  </label>
                  <span className="font-mono text-xs font-medium text-slate-700 bg-slate-50 px-2! py-0.5! rounded border border-slate-100">
                    {registro.ip}
                  </span>
                </div>
              </div>

              <div className="pt-1! border-t border-slate-100">
                <label className="block font-montserrat text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1!">
                  Ruta de Petición (URL)
                </label>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200/70 rounded-lg px-3! py-2! break-all">
                  <Globe size={14} className="shrink-0 text-slate-400" />
                  <span>{registro.url}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden mt-2!">
          <div className="bg-slate-50/80 border-b border-slate-100 px-4! py-3! flex items-center gap-2">
            <FileJson size={16} className="text-[#24247F]" />
            <h4 className="font-montserrat text-sm font-semibold text-slate-800 m-0">
              Comparación de Modificaciones
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 text-slate-600 font-montserrat text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4! py-2.5! font-semibold">
                    Campo Modificado
                  </th>
                  <th className="px-4! py-2.5! font-semibold text-rose-600">
                    Valor Anterior
                  </th>
                  <th className="px-4! py-2.5! font-semibold text-emerald-600">
                    Valor Nuevo
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {Object.keys(registro.valores_nuevos || {})
                  .filter(
                    (key) =>
                      JSON.stringify(registro.valores_anteriores?.[key]) !==
                      JSON.stringify(registro.valores_nuevos?.[key]),
                  )
                  .map((key) => (
                    <tr
                      key={key}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4! py-3! font-semibold text-slate-700 capitalize font-mono text-xs">
                        {key.replaceAll("_", " ")}
                      </td>

                      <td className="px-4! py-3!">
                        <span className="inline-block px-2.5! py-1! rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-mono text-xs break-all">
                          {renderValue(registro.valores_anteriores?.[key])}
                        </span>
                      </td>

                      <td className="px-4! py-3!">
                        <div className="flex items-center gap-2">
                          <ArrowRight
                            size={14}
                            className="text-slate-300 shrink-0"
                          />
                          <span className="inline-block px-2.5! py-1! rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono text-xs break-all">
                            {renderValue(registro.valores_nuevos?.[key])}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0F172A] shadow-md overflow-hidden mt-2!">
          <div className="bg-[#1E293B] border-b border-slate-800 px-4! py-2.5! flex items-center gap-2">
            <Code2 size={16} className="text-indigo-400" />
            <h4 className="font-montserrat text-xs font-semibold text-slate-200 uppercase tracking-wider m-0">
              Estructura JSON Raw
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div>
              <div className="px-4! py-1.5! bg-rose-500/10 border-b border-slate-800/80 font-montserrat text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                Valores Anteriores
              </div>
              <pre className="p-4! text-rose-300/90 font-mono text-xs overflow-auto max-h-64 leading-relaxed scrollbar-thin">
                {JSON.stringify(registro.valores_anteriores, null, 2)}
              </pre>
            </div>

            <div>
              <div className="px-4! py-1.5! bg-emerald-500/10 border-b border-slate-800/80 font-montserrat text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Valores Nuevos
              </div>
              <pre className="p-4! text-emerald-300/90 font-mono text-xs overflow-auto max-h-64 leading-relaxed scrollbar-thin">
                {JSON.stringify(registro.valores_nuevos, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InformacionRegistroAuditoria;
