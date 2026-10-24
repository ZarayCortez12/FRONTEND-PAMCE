import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { obtenerEdicionesPorParticipante } from "../../features/participantes/participante.slice";
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
import LoadingData from "@/components/LoadingData";

function ListaEdiciones() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ediciones = useSelector((state) => state.participantes.ediciones);
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroMes, setFiltroMes] = useState("TODOS");
  const [filtroAnio, setFiltroAnio] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const anioActual = new Date().getFullYear();
  const anioInicial = 2000;
  const anios = Array.from(
    { length: anioActual - anioInicial + 50 },
    (_, i) => anioInicial + i,
  );

  useEffect(() => {
    document.title = "PAMCE | Ediciones";

    dispatch(
      obtenerEdicionesPorParticipante({
        id_participante: usuario.id_usuario,
        params: {
          search: searchText,
          estado: filtroEstado !== "TODOS" ? filtroEstado : null,
          mes: filtroMes !== "TODOS" ? filtroMes : null,
          anio: filtroAnio !== "TODOS" ? filtroAnio : null,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-ediciones",
          position: "top-right",
          autoClose: 3500,
        });
      })
      .catch((err) => {
        console.log("Error al listar ediciones:", err);
      });
  }, [searchText, filtroEstado, filtroMes, filtroAnio, dispatch, usuario]);

  const limpiarFiltros = () => {
    setFiltroEstado("TODOS");
    setFiltroMes("TODOS");
    setFiltroAnio("TODOS");
  };

  const capitalizeEstado = (estado) => {
    switch (estado) {
      case "en_proceso":
        return "En Proceso";
      case "finalizada":
        return "Finalizada";
      case "inactivo":
        return "Inactivo";
      case "activo":
        return "Activo";
      case "cancelada":
        return "Cancelada";
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
    Activo: "text-blue-600",
    "En Proceso": "text-green-600",
    Finalizada: "text-red-600",
    Inactivo: "text-gray-500",
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

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Ediciones
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Todas las ediciones donde ha participado como participante
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
        <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por nombre..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
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
              onChange={(value) => setFiltroEstado(value)}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "en_proceso", label: "En Proceso" },
                { value: "finalizada", label: "Finalizada" },
                { value: "inactivo", label: "Inactivo" },
                { value: "activo", label: "Activo" },
                { value: "cancelada", label: "Cancelada" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Año:</span>
            </div>
            <Select
              className="w-full sm:w-24 font-inter"
              value={filtroAnio}
              onChange={(value) => setFiltroAnio(value)}
            >
              <Select.Option value="TODOS">Todos</Select.Option>
              {anios.map((anio) => (
                <Select.Option key={anio} value={anio}>
                  {anio}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Mes:</span>
            </div>
            <Select
              className="w-full sm:w-24 font-inter"
              value={filtroMes}
              onChange={(value) => setFiltroMes(value)}
            >
              <Select.Option value="TODOS">Todos</Select.Option>
              {[...Array(12).keys()].map((i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={limpiarFiltros}
              className="text-white hover:text-red-300 transition text-xl"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4! 2xl:grid-cols-5! gap-5! mt-4!">
        {!ediciones ? (
          <LoadingData mensaje="Cargando ediciones..." />
        ) : ediciones && ediciones.length > 0 ? (
          ediciones.map((edicion) => {
            return (
              <div
                key={edicion.id_edicion}
                className="bg-white! p-4! rounded-xl! shadow-md! border-l-8! border-red-600! flex! flex-col! justify-between! transition! hover:shadow-lg!"
              >
                <div className="flex! items-center! justify-center! gap-2! mb-2!">
                  <h3 className="text-base! sm:text-lg! font-montserrat font-bold text-gray-900! text-center!">
                    {capitalizeWords(edicion.nombre_edicion)}
                  </h3>

                  <BsBookmarkStarFill className="text-yellow-400 text-lg" />
                </div>
                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Periodo:
                  </span>{" "}
                  {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")} -{" "}
                  {dayjs(edicion.fecha_fin).format("DD/MM/YYYY")}
                </p>

                <p className="font-montserrat text-sm text-gray-700! my-1!">
                  <span className="font-inter font-semibold text-gray-800!">
                    Estado:
                  </span>{" "}
                  <span
                    className={`font-bold ${
                      estadoClass[capitalizeEstado(edicion.estado_edicion)]
                    }`}
                  >
                    {capitalizeEstado(edicion.estado_edicion)}
                  </span>
                </p>

                <div className="mt-2! flex! justify-center!">
                  <div className="flex! gap-2! p-1! rounded-full! shadow-md! bg-white">
                    {edicion.estado_edicion === "en_proceso" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 ${disabledBtn}`}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Cancelar Edición"
                        >
                          <ShieldX size={16} />
                        </button>
                      </>
                    )}

                    {edicion.estado_edicion === "finalizada" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 hover:text-blue-600`}
                          title="Ver detalles"
                          onClick={() =>
                            navigate(
                              `/participante/ediciones/${edicion.id_edicion}/informacion-edicion`,
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Desactivar"
                        >
                          <Ban size={16} />
                        </button>
                      </>
                    )}

                    {edicion.estado_edicion === "cancelada" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 ${disabledBtn}`}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Desactivar"
                        >
                          <Ban size={16} />
                        </button>
                      </>
                    )}

                    {edicion.estado_edicion === "activo" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 ${disabledBtn}`}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Inactivar Edición"
                        >
                          <Ban size={16} />
                        </button>
                      </>
                    )}

                    {edicion.estado_edicion === "inactivo" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 ${disabledBtn}`}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Eliminar edición"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-purple-50 ${disabledBtn}`}
                          title="Reactivar edición"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </>
                    )}
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

export default ListaEdiciones;
