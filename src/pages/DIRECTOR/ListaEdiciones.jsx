import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  listarEdiciones,
  obtenerEdicion,
  cambiarEstado,
  eliminarEdicion,
} from "../../features/ediciones/edicion.slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import { Input, Modal, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import { IoMdAddCircle } from "react-icons/io";
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Eye, Pencil, Ban, Trash2, RotateCcw, ShieldX } from "lucide-react";
import EdicionFormulario from "../../components/EdicionFormulario";
import { useNavigate } from "react-router-dom";
import LoadingData from "@/components/LoadingData";

function ListaEdiciones() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ediciones = useSelector((state) => state.ediciones.ediciones);

  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroMes, setFiltroMes] = useState("TODOS");
  const [filtroAnio, setFiltroAnio] = useState("TODOS");
  const [searchText, setSearchText] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEdicion, setEditingEdicion] = useState(null);
  const [editarModal, setEditarModal] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [edicionSeleccionado, setEdicionSeleccionado] = useState(null);
  const anioActual = new Date().getFullYear();
  const anioInicial = 2000;
  const anios = Array.from(
    { length: anioActual - anioInicial + 50 },
    (_, i) => anioInicial + i,
  );

  useEffect(() => {
    document.title = "PAMCE | Ediciones";
    dispatch(
      listarEdiciones({
        search: searchText,
        estado: filtroEstado !== "TODOS" ? filtroEstado : null,
        mes: filtroMes !== "TODOS" ? filtroMes : null,
        anio: filtroAnio !== "TODOS" ? filtroAnio : null,
      }),
    )
      .unwrap()
      .catch((error) => {
        toast.error(error.message, {
          toastId: "listado-ediciones",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [searchText, filtroEstado, filtroMes, filtroAnio, dispatch]);

  const limpiarFiltros = () => {
    setFiltroEstado("TODOS");
    setFiltroMes("TODOS");
    setFiltroAnio("TODOS");
  };

  const handleEditarEdicion = (edicion) => {
    setIsEditMode(true);
    dispatch(obtenerEdicion(edicion.id_edicion))
      .unwrap()
      .then((data) => {
        setEditingEdicion(data);
        setNombreEdicion(data.nombre);
        setFechaInicioEdicion(dayjs(data.fecha_inicio));
        setFechaFinEdicion(dayjs(data.fecha_final));
        setFechaInicioConvocatoria(dayjs(data.fecha_inicio_convocatoria));
        setFechaFinConvocatoria(dayjs(data.fecha_fin_convocatoria));
        setFechaInicioEvaluacion(dayjs(data.fecha_inicio_evaluacion));
        setFechaFinEvaluacion(dayjs(data.fecha_fin_evaluacion));
        setFechaInicioPremiacion(dayjs(data.fecha_inicio_premiacion));
        setFechaFinPremiacion(dayjs(data.fecha_fin_premiacion));
        setModalVisible(true);
      })
      .catch((err) => {
        toast.error("Error al obtener datos de la edición");
      });
  };

  const capitalizarPrimeraLetra = (texto) => {
    if (!texto) return "";
    texto = texto.trim().toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const handleDesactivarClick = (edicion) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de inactivar esta edición?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaAward
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizarPrimeraLetra(edicion.nombre_edicion)}
              <br />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <FaCalendar
              style={{ fontSize: "20px", color: "#e10318", marginRight: "5px" }}
            />
            <div style={{ fontFamily: "Inter" }}>
              <strong>Fecha de inicio: </strong>
              {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")}
              <br />
              <strong>Fecha de finalización: </strong>
              {dayjs(edicion.fecha_fin).format("DD/MM/YYYY")}
              <br />
            </div>
          </div>
        </div>
      ),
      okText: "Sí, desactivar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(
          cambiarEstado({
            id_edicion: edicion.id_edicion,
            data: { estado: "inactivo" },
          }),
        )
          .unwrap()
          .then(() => {
            toast.success("Edicion desactivada correctamente");
            dispatch(listarEdiciones());
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const handleActivarClick = (edicion) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de activar esta edición?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaAward
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizarPrimeraLetra(edicion.nombre_edicion)}
              <br />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <FaCalendar
              style={{ fontSize: "20px", color: "#e10318", marginRight: "5px" }}
            />
            <div style={{ fontFamily: "Inter" }}>
              <strong>Fecha de inicio: </strong>
              {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")}
              <br />
              <strong>Fecha de finalización: </strong>
              {dayjs(edicion.fecha_fin).format("DD/MM/YYYY")}
              <br />
            </div>
          </div>
        </div>
      ),
      okText: "Sí, activar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(
          cambiarEstado({
            id_edicion: edicion.id_edicion,
            data: { estado: "activo" },
          }),
        )
          .unwrap()
          .then(() => {
            toast.success("Edicion activada correctamente", {
              toastId: "listado-jurados",
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            dispatch(listarEdiciones());
          })
          .catch((error) => {
            toast.error(error.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          });
      },
    });
  };

  const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  const handleCancelarClick = (edicion) => {
    let observacion = "";

    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Está seguro de cancelar esta edición en proceso?
        </div>
      ),
      content: (
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaAward
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizarPrimeraLetra(edicion.nombre_edicion)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: "5px",
            }}
          >
            <FaCalendar
              style={{ fontSize: "20px", color: "#e10318", marginRight: "5px" }}
            />
            <div style={{ fontFamily: "Inter" }}>
              <strong>Fecha de inicio: </strong>
              {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")}
              <br />
              <strong>Fecha de finalización: </strong>
              {dayjs(edicion.fecha_fin).format("DD/MM/YYYY")}
            </div>
          </div>
          <div style={{ fontFamily: "Inter" }}>
            <strong>Motivo de cancelación *</strong>
            <Input.TextArea
              rows={3}
              placeholder="Ingrese el motivo de la cancelación"
              style={{ marginTop: "5px" }}
              onChange={(e) => {
                observacion = e.target.value;
              }}
            />
          </div>
          <span
            style={{
              display: "flex",
              background: "hsl(354, 65%, 85%)",
              padding: "10px",
              borderRadius: "10px",
              fontFamily: "Inter",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <IoMdAlert
              style={{
                fontSize: "45px",
                color: "#e10318",
                marginRight: "8px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>
              Recuerda que cancelar esta edición es una acción permanente y no
              se podrá recuperar la información.
            </p>
          </span>
        </div>
      ),
      okText: "Sí, cancelar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        if (!observacion.trim()) {
          toast.warning("Debe ingresar el motivo de la cancelación");
          return Promise.reject();
        }
        return dispatch(
          cambiarEstado({
            id_edicion: edicion.id_edicion,
            data: {
              estado: "cancelada",
              observacion: normalizarTexto(observacion),
            },
          }),
        )
          .unwrap()
          .then(() => {
            toast.success("Edición cancelada correctamente");
            dispatch(listarEdiciones());
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const handleEliminarClick = (edicion) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          {" "}
          ¿Estás seguro de eliminar esta edición?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaAward
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />

            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizarPrimeraLetra(edicion.nombre_edicion)}
              <br />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <FaCalendar
              style={{ fontSize: "20px", color: "#e10318", marginRight: "5px" }}
            />

            <div style={{ fontFamily: "Inter" }}>
              <strong>Fecha de inicio: </strong>
              {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")}
              <br />
              <strong>Fecha de finalización: </strong>
              {dayjs(edicion.fecha_fin).format("DD/MM/YYYY")}
              <br />
            </div>
          </div>
          <span
            style={{
              display: "flex",
              background: "hsl(354, 65%, 85%)",
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "-30px",
              fontFamily: "Inter",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <IoMdAlert
              className="text-red-500"
              style={{
                fontSize: "70px",
                marginRight: "5px",
                marginTop: "-10px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333" }}>
              <center>
                Recuerda que el acción de eliminar es permanente y no se podrá
                recuperar la información de la edición.
              </center>
            </p>
          </span>
        </div>
      ),
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(eliminarEdicion(edicion.id_edicion))
          .unwrap()
          .then(() => {
            toast.success("Edicion eliminada correctamente");
            dispatch(listarEdiciones());
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
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
          Todas las ediciones de PAMCE UFPS
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

        <button
          onClick={() => {
            setAbrirModal(true);
          }}
          className="-mt-3! bg-white border-2 border-red-600 text-red-600 rounded-xl! py-3! flex! items-center! justify-center! gap-1! font-poppins text-md! shadow-md hover:bg-red-600 hover:text-white transition w-full md:w-45!"
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Edición
        </button>
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
                  {dayjs(edicion.fecha_inicio).format("DD/MM/YYYY")} -
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
                          className={`${iconBtn} hover:bg-green-50 hover:text-green-600`}
                          title="Editar edición"
                          onClick={() => {
                            setAbrirModal(true);
                            setEdicionSeleccionado(edicion);
                            setEditarModal(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                          title="Cancelar Edición"
                          onClick={() => handleCancelarClick(edicion)}
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
                              `/director/ediciones/${edicion.id_edicion}/informacion-edicion`,
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                          onClick={() => handleEditarEdicion(edicion)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Desactivar"
                          onClick={() => handleDesactivarClick(edicion)}
                        >
                          <Ban size={16} />
                        </button>
                      </>
                    )}

                    {edicion.estado_edicion === "cancelada" && (
                      <>
                        <button
                          className={`${iconBtn} hover:bg-blue-50 hover:text-blue-600`}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-green-50 ${disabledBtn}`}
                          title="Editar edición"
                          onClick={() => handleEditarEdicion(edicion)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 ${disabledBtn}`}
                          title="Desactivar"
                          onClick={() => handleDesactivarClick(edicion)}
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
                          className={`${iconBtn} hover:bg-green-50 hover:text-green-600`}
                          title="Editar edición"
                          onClick={() => {
                            setAbrirModal(true);
                            setEdicionSeleccionado(edicion);
                            setEditarModal(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                          title="Inactivar Edición"
                          onClick={() => handleDesactivarClick(edicion)}
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
                          className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                          title="Eliminar edición"
                          onClick={() => handleEliminarClick(edicion)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className={`${iconBtn} hover:bg-purple-50 hover:text-purple-600`}
                          title="Reactivar edición"
                          onClick={() => handleActivarClick(edicion)}
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
        <EdicionFormulario
          visible={abrirModal}
          onClose={() => {
            setEditarModal(false);
            setEdicionSeleccionado(null);
            setAbrirModal(false);
          }}
          isEditMode={editarModal}
          id_edicion={edicionSeleccionado?.id_edicion}
          initialValues={edicionSeleccionado}
        />
      </div>
    </div>
  );
}

export default ListaEdiciones;
