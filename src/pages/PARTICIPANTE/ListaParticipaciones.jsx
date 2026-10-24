import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  obtenerParticipaciones,
} from "../../features/participantes/participante.slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import { Input, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Eye, Pencil, Ban, Trash2, RotateCcw, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { obtenerParticipacionesPorParticipante } from "../../features/participantes/participante.slice";
import { listarEdiciones } from "../../features/ediciones/edicion.slice";
import { listarCategorias } from "../../features/categorias/categoria.slice";
import { obtenerCategoriasEdicionesParticipacionParticipante } from "../../features/participantes/participante.slice";
import LoadingData from "@/components/LoadingData";

function ListaParticipaciones() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participaciones = useSelector(
    (state) => state.participantes.participaciones,
  );
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const [filtroEdicion, setFiltroEdicion] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const categorias_filtro = useSelector((state) => state.categorias.categorias);
  const categorias_edicion_filtro = useSelector(
    (state) => state.participantes.categorias,
  );
  const ediciones_filtro = useSelector((state) => state.ediciones.ediciones);
  const [edicionSeleccionada, setEdicionSeleccionada] = useState(null);

  useEffect(() => {
    document.title = "PAMCE | Participaciones";

    if (!usuario) return;

    dispatch(listarEdiciones());
  }, [usuario, dispatch]);

  useEffect(() => {
    if (!usuario) return;

    dispatch(
      obtenerParticipaciones({
        id_participante: usuario.id_usuario,
        params: {
          edicion: filtroEdicion,
          categoria: filtroCategoria,
          estado: filtroEstado,
        },
      }),
    );
  }, [usuario, filtroEdicion, filtroCategoria, filtroEstado, dispatch]);

  useEffect(() => {
    if (!usuario) return;

    if (filtroEdicion !== "TODOS") {
      dispatch(
        obtenerCategoriasEdicionesParticipacionParticipante({
          id_edicion: filtroEdicion,
          id_participante: usuario.id_usuario,
        }),
      );
    } else {
      dispatch(listarCategorias());
    }
  }, [filtroEdicion, usuario, dispatch]);

  const capitalizeEstado = (estado) => {
    switch (estado) {
      case "aceptada":
        return "Aceptada";
      case "rechazada":
        return "Rechazada";
      case "pendiente":
        return "Pendiente";
      case "evaluada":
        return "Evaluada";
      default:
        return estado;
    }
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => {
        if (/^[ivxlcdm]+$/i.test(word)) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const estadoClass = {
    Pendiente: "text-blue-600",
    Aceptada: "text-green-600",
    Rechazada: "text-red-600",
    Evaluada: "text-purple-600",
  };

  const iconBtn = `
  w-8 h-8
  flex items-center justify-center
  rounded-full
  border border-gray-200
  text-gray-500
  transition
  hover:scale-105
`;

  const disabledBtn = "opacity-50 cursor-not-allowed!";

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Participaciones
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Tus participaciones en PAMCE
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
        <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por categoria..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Edición:</span>
            </div>
            <Select
              className="w-full sm:w-38 font-inter"
              value={filtroEdicion}
              onChange={(v) => {
                setFiltroEdicion(v);
                setEdicionSeleccionada(v);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                ...ediciones_filtro.map((e) => ({
                  value: e.id_edicion,
                  label: capitalizeFirstLetter(e.nombre_edicion),
                })),
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Categoría:</span>
            </div>
            <Select
              className="w-full sm:w-49 font-inter"
              value={filtroCategoria}
              onChange={(v) => {
                setFiltroCategoria(v);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                ...(filtroEdicion !== "TODOS"
                  ? categorias_edicion_filtro
                  : categorias_filtro
                ).map((c) => ({
                  value: c.id_categoria,
                  label: capitalizeFirstLetter(c.nombre_categoria),
                })),
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Estado:</span>
            </div>
            <Select
              className="w-full sm:w-30 font-inter"
              value={filtroEstado}
              onChange={(v) => setFiltroEstado(v)}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "pendiente", label: "Pendiente" },
                { value: "aceptada", label: "Aceptado" },
                { value: "rechazada", label: "Rechazado" },
                { value: "evaluada", label: "Evaluada" },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4! 2xl:grid-cols-5! gap-5! mt-4!">
        {!participaciones ? (
          <LoadingData mensaje="Cargando ediciones..." />
        ) : participaciones && participaciones.length > 0 ? (
          participaciones.map((participacion) => {
            return (
              <div
                key={participacion.id_participacion}
                className="bg-white! p-4! rounded-xl! shadow-md! border-l-8! border-red-600! flex! flex-col! justify-between! transition! hover:shadow-lg!"
              >
                <div className="flex! items-center! justify-center! gap-2! mb-2!">
                  <h3 className="text-base! sm:text-lg! font-montserrat font-bold text-gray-900! text-center!">
                    {capitalizeWords(
                      participacion.edicionCategoria.categoria.nombre_categoria,
                    )}
                  </h3>

                  <BsBookmarkStarFill className="text-yellow-400 text-lg" />
                </div>
                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Edición:{" "}
                  </span>
                  {capitalizeWords(participacion.edicion.nombre_edicion)}
                </p>
                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Fecha Postulación:{" "}
                  </span>
                  {dayjs(participacion.fecha_postulacion).format("DD/MM/YYYY")}
                </p>

                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Fecha de Revisión:{" "}
                  </span>
                  {participacion.fecha_revision
                    ? dayjs(participacion.fecha_revision).format("DD/MM/YYYY")
                    : "-"}
                </p>

                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Estado:
                  </span>{" "}
                  <span
                    className={`font-bold ${
                      estadoClass[capitalizeEstado(participacion.estado)]
                    }`}
                  >
                    {capitalizeEstado(participacion.estado)}
                  </span>
                </p>

                <div className="mt-2! flex! justify-center!">
                  <div className="flex! gap-2! p-1! rounded-full! shadow-md! bg-white">
                    <button
                      className={`${iconBtn} hover:bg-blue-50`}
                      title="Ver detalles"
                      onClick={() => {
                        navigate(
                          `${participacion.id_participacion}/informacion-participacion`,
                        );
                      }}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20!">
            <img
              src={imagen_no_data}
              alt="No hay datos"
              className="w-60 opacity-80 mb-4"
            />
            <span className="font-inter text-gray-500 text-sm">
              No hay datos para mostrar
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaParticipaciones;
