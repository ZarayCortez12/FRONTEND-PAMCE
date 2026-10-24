import { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Modal,
  Select,
  Tooltip,
  Pagination,
  ConfigProvider,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import esES from "antd/es/date-picker/locale/es_ES";
import "../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  listarNotificaciones,
  marcarNotificacionLeida,
} from "../features/notificaciones/notificaciones.slice.js";
import { Eye } from "lucide-react";
import imagen_no_data from "../images/imagen_no_data.jpg";
import es from "dayjs/locale/es";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaNotificaciones() {
  const dispatch = useDispatch();
  const notificaciones = useSelector(
    (state) => state.notificaciones.notificaciones,
  );
  const pagination = useSelector((state) => state.notificaciones.pagination);
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const loading = useSelector((state) => state.jurados.loading_jurados);

  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODOS");
  const [filtroLeida, setFiltroLeida] = useState("TODOS");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [notificacionSeleccionada, setNotificacionSeleccionada] =
    useState(null);
  const [modalNotificacion, setModalNotificacion] = useState(false);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    document.title = "PAMCE | Notificaciones";
    if (!usuario?.id_usuario) return;
    dispatch(
      listarNotificaciones({
        id_usuario: usuario.id_usuario,
        params: {
          rol: usuario.rol_activo.id_rol,
          prioridad: filtroPrioridad,
          leida: filtroLeida,
          fecha_inicio: filtroFechaInicio,
          fecha_fin: filtroFechaFin,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-notificaciones",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [
    usuario?.id_usuario,
    filtroEstado,
    filtroPrioridad,
    filtroLeida,
    filtroFechaInicio,
    filtroFechaFin,
    pageSize,
    currentPage,
    dispatch,
  ]);

  const columns = [
    {
      title: "Titulo",
      key: "titulo",
      align: "center",
      sorter: (a, b) => a.titulo.localeCompare(b.titulo),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {record.titulo}
        </span>
      ),
    },
    {
      title: "Prioridad",
      key: "prioridad",
      sorter: (a, b) => a.prioridad.localeCompare(b.prioridad),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record.prioridad)}
        </span>
      ),
    },
    {
      title: "¿Leida?",
      key: "leida",
      sorter: (a, b) => a.leida.localeCompare(b.leida),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.leida ? "Si" : "No"}
        </span>
      ),
    },
    {
      title: "Fecha de Envio",
      key: "fecha_envio",
      sorter: (a, b) => dayjs(a.fecha_envio).isBefore(dayjs(b.fecha_envio)),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center">
          {dayjs(record.fecha_creacion).format("DD/MM/YYYY") || "-"}
        </span>
      ),
    },
    {
      title: "Fecha de Lectura",
      key: "fecha_leida",
      sorter: (a, b) => dayjs(a.fecha_leida).isBefore(dayjs(b.fecha_leida)),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center">
          {record.fecha_leida
            ? dayjs(record.fecha_leida).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm",
      }),
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <Tooltip title="Ver Notificación">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() => {
                  setNotificacionSeleccionada(record);
                  setModalNotificacion(true);
                }}
              >
                <Eye className="text-blue-600" size={18} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const EmptyTable = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        src={imagen_no_data}
        alt="No hay datos"
        className="w-40 opacity-80 mb-4"
      />
      <span className="font-inter text-gray-500 text-sm">
        No hay datos para mostrar
      </span>
    </div>
  );

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Notificaciones
          </span>
        </div>
        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Tus notificaciones
        </span>
      </div>

      <div className="w-full bg-red-600 rounded-xl p-2! flex flex-wrap items-center gap-3 mb-3!">
        <Tooltip title="Cantidad de registros">
          <Select
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            className="w-20 font-inter"
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
          />
        </Tooltip>
        <div className="flex items-center gap-2 text-white flex-1 min-w-[220px]">
          <FaFilter />
          <span className="font-inter">Prioridad:</span>
          <Select
            className="flex-1 font-inter"
            value={filtroPrioridad}
            onChange={(v) => {
              setFiltroPrioridad(v);
              setCurrentPage(1);
            }}
            options={[
              { value: "TODOS", label: "Todos" },
              { value: "alta", label: "Alta" },
              { value: "media", label: "Media" },
              { value: "baja", label: "Baja" },
            ]}
          />
        </div>
        <div className="flex items-center gap-2 text-white flex-1 min-w-[220px]">
          <FaFilter />
          <span className="font-inter">¿Leída?</span>
          <Select
            className="flex-1 font-inter"
            value={filtroLeida}
            onChange={(v) => {
              setFiltroLeida(v);
              setCurrentPage(1);
            }}
            options={[
              { value: "TODOS", label: "Todos" },
              { value: true, label: "Sí" },
              { value: false, label: "No" },
            ]}
          />
        </div>
        <div className="flex items-center gap-2 text-white flex-1 min-w-[280px]">
          <FaFilter />
          <span className="font-inter">Fecha Inicio:</span>
          <DatePicker
            locale={esES}
            format="DD [de] MMMM [del] YYYY"
            className="flex-1 font-inter"
            placeholder="Seleccionar inicio"
            allowClear
            value={filtroFechaInicio ? dayjs(filtroFechaInicio) : null}
            onChange={(date) => {
              setFiltroFechaInicio(
                date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "",
              );
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-white flex-1 min-w-[280px]">
          <FaFilter />
          <span className="font-inter">Fecha Fin:</span>
          <DatePicker
            locale={esES}
            format="DD [de] MMMM [del] YYYY"
            className="flex-1 font-inter"
            placeholder="Seleccionar fin"
            allowClear
            value={filtroFechaFin ? dayjs(filtroFechaFin) : null}
            onChange={(date) => {
              setFiltroFechaFin(
                date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "",
              );
            }}
          />
        </div>
        <Tooltip title="Limpiar filtros">
          <button
            onClick={() => {
              setFiltroPrioridad("TODOS");
              setFiltroLeida("TODOS");
              setFiltroFechaInicio("");
              setFiltroFechaFin("");
            }}
            className="text-white hover:text-red-300 transition text-xl"
          >
            <FaFilterCircleXmark />
          </button>
        </Tooltip>
      </div>
      <div className="grid! grid-cols-1! gap-5! w-full!">
        <>
          <div className="w-full overflow-x-auto">
            {loading ? (
              <LoadingInformacion />
            ) : (
              <ConfigProvider locale={es}>
                <Table
                  dataSource={notificaciones}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  locale={{
                    emptyText: <EmptyTable />,
                  }}
                />
              </ConfigProvider>
            )}
          </div>
          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-gray-600 font-inter text-sm">
              Mostrando{" "}
              <strong>
                {pagination?.total === 0
                  ? 0
                  : (pagination?.page - 1) * pagination?.limit + 1}{" "}
                -{" "}
                {Math.min(
                  pagination?.page * pagination?.limit,
                  pagination?.total,
                )}
              </strong>{" "}
              de <strong>{pagination?.total}</strong> registros
            </span>
            <Pagination
              current={pagination?.page}
              pageSize={pagination?.limit}
              total={pagination?.total}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      </div>
      <Modal
        open={modalNotificacion}
        footer={null}
        width={700}
        centered
        onCancel={() => {
          setModalNotificacion(false);
          setNotificacionSeleccionada(null);
        }}
      >
        {notificacionSeleccionada && (
          <div className="py-2!">
            <div className="border-b border-gray-200 pb-4! mb-5!">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                    {notificacionSeleccionada.titulo}
                  </h2>

                  <div className="flex gap-4 mt-2! text-sm text-gray-500">
                    <span>
                      Prioridad:{" "}
                      <strong>
                        {capitalizeWords(notificacionSeleccionada.prioridad)}
                      </strong>
                    </span>

                    <span>
                      Enviada el{" "}
                      <strong>
                        {dayjs(notificacionSeleccionada.fecha_envio).format(
                          "DD [de] MMMM [de] YYYY",
                        )}
                      </strong>
                    </span>
                  </div>
                </div>

                {!notificacionSeleccionada.leida && (
                  <span className="bg-red-100 text-red-700 px-4! py-1! rounded-full text-sm font-semibold whitespace-nowrap">
                    Sin leer
                  </span>
                )}
                
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5! shadow-sm">
              <div
                className="
            text-gray-700
            leading-7
            font-inter
            [&>p]:mb-3
            [&>p:last-child]:mb-0
            [&_b]:font-semibold
          "
                dangerouslySetInnerHTML={{
                  __html: notificacionSeleccionada.mensaje,
                }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6!">
              <button
                className="px-4! py-2! border border-gray-300 rounded-lg hover:bg-gray-100 transition font-inter"
                onClick={() => {
                  setModalNotificacion(false);
                }}
              >
                Cerrar
              </button>
              {!notificacionSeleccionada.leida && (
                <button
                  className="px-5! py-2! bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-inter"
                  onClick={() => {
                    dispatch(
                      marcarNotificacionLeida(notificacionSeleccionada.id),
                    )
                      .unwrap()
                      .then((res) => {
                        toast.success(res.message, {
                          position: "top-right",
                          autoClose: 3000,
                          pauseOnHover: true,
                          draggable: true,
                        });
                      })
                      .catch((error) => {
                        toast.error(error.message, {
                          position: "top-right",
                          autoClose: 3000,
                          pauseOnHover: true,
                          draggable: true,
                        });
                      });

                    setModalNotificacion(false);
                  }}
                >
                  Marcar como leída
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ListaNotificaciones;
