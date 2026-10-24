import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import { Input, Table, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { listarConvocatoriasPorEdicion } from "../../features/participacion/participacion.slice";
import {
  Eye,
  CheckCircle,
  CircleUserRound,
  ChartArea,
  Info,
  CircleX,
} from "lucide-react";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "@/components/LoadingComponent";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaConvocados() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const loading_convocatorias = useSelector(
    (state) => state.participacion.loading_convocatorias,
  );
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [convocadoSeleccionado, setConvocadoSeleccionado] = useState(null);
  const [convocatoriasInformacion, setConvocatoriasInformacion] = useState([]);
  const [resumenConvocatorias, setResumenConvocatorias] = useState([]);
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const totalConvocados = resumenConvocatorias.length;

  const totalPostulados = resumenConvocatorias.filter(
    (c) => c.estado_envio === "postulado",
  ).length;

  const porcentajePostulados =
    totalConvocados === 0
      ? 0
      : Math.round((totalPostulados / totalConvocados) * 100);

  useEffect(() => {
    document.title = "PAMCE | Convocados";
    if (!edicion?.id_edicion) return;

    dispatch(
      listarConvocatoriasPorEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          search: searchText,
          estado: filtroEstado,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        setConvocatoriasInformacion(res.convocatorias);
        setResumenConvocatorias(res.resumen);
      })
      .catch((err) => {
        console.log("Error al listar convocados:", err);
      });
  }, [edicion, searchText, filtroEstado, dispatch]);

  const columns = [
    {
      title: "Correo Electrónico",
      key: "correo_electronico",
      align: "center",
      sorter: (a, b) =>
        (a.correo_electronico || "").localeCompare(b.correo_electronico || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="items-center gap-1 font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.correo_electronico}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm",
      }),
      render: (_, record) => {
        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
              record.estado_envio === "enviado" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {capitalizeWords(record.estado_envio)}
          </span>
        );
      },
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
            <Tooltip title="Ver detalles">
              <button
                onClick={() => setConvocadoSeleccionado(record)}
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition-transform duration-200! hover:scale-110!"
              >
                <Eye className="text-blue-600" size={18} />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const datosPaginados = convocatoriasInformacion.slice(startIndex, endIndex);

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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const dataLineaTiempo = React.useMemo(() => {
    const mapa = {};

    resumenConvocatorias.forEach((c) => {
      const fechaEnvio = dayjs(c.fecha_envio).startOf("day");
      const keyEnvio = fechaEnvio.format("YYYY-MM-DD");

      if (!mapa[keyEnvio]) {
        mapa[keyEnvio] = {
          fecha: fechaEnvio.format("DD MMM"),
          fechaOrden: fechaEnvio.valueOf(),
          convocados: 0,
          postulados: 0,
        };
      }

      mapa[keyEnvio].convocados += 1;

      if (c.estado_envio === "postulado" && c.fecha_respuesta) {
        const fechaResp = dayjs(c.fecha_respuesta).startOf("day");
        const keyResp = fechaResp.format("YYYY-MM-DD");

        if (!mapa[keyResp]) {
          mapa[keyResp] = {
            fecha: fechaResp.format("DD MMM"),
            fechaOrden: fechaResp.valueOf(),
            convocados: 0,
            postulados: 0,
          };
        }

        mapa[keyResp].postulados += 1;
      }
    });

    return Object.values(mapa).sort((a, b) => a.fechaOrden - b.fechaOrden);
  }, [resumenConvocatorias]);

  if (!edicion) {
    return <LoadingComponent mensaje="Cargando Información..." />;
  }

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2! -mt-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Invitaciones enviadas
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Personas convocadas para la{" "}
          {capitalizeFirstLetter(edicion.nombre_edicion)}
        </span>
      </div>

      <div className="grid! grid-cols-1! lg:grid-cols-2! gap-4!">
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
            <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
              <Tooltip title="Filtrar por cantidad de registros">
                <Select
                  value={pageSize}
                  onChange={(value) => {
                    setPageSize(value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-15 font-inter"
                  options={[
                    { label: "10", value: 10 },
                    { label: "50", value: 50 },
                    { label: "100", value: 100 },
                  ]}
                />
              </Tooltip>
              <div className="w-full md:flex-1 -ml-1!">
                <Input
                  placeholder="Buscar por correo electrónico..."
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  className="w-full sm:w-28 font-inter"
                  value={filtroEstado}
                  onChange={(v) => {
                    setFiltroEstado(v);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: "TODOS", label: "Todos" },
                    { value: "enviado", label: "Enviado" },
                    { value: "postulado", label: "Postulado" },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            {loading_convocatorias ? (
              <LoadingInformacion />
            ) : (
              <ConfigProvider locale={esES}>
                <Table
                  dataSource={datosPaginados}
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
          <div className="flex justify-between items-center mt-3! px-1!">
            <span className="text-gray-600 font-inter text-sm!">
              Mostrando{" "}
              <strong>
                {convocatoriasInformacion.length === 0 ? 0 : startIndex + 1} -{" "}
                {Math.min(endIndex, convocatoriasInformacion.length)}
              </strong>{" "}
              de <strong>{convocatoriasInformacion.length}</strong> registros
            </span>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={convocatoriasInformacion.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-sm p-4! border border-gray-100">
              <div className="flex items-center gap-3">
                <CircleUserRound className="text-red-600" size={32} />
                <div>
                  <p className="text-sm text-gray-500 font-inter">
                    Total convocados
                  </p>
                  <p className="text-2xl font-semibold font-montserrat text-gray-800">
                    {totalConvocados}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4! border border-gray-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={32} />
                <div>
                  <p className="text-sm text-gray-500 font-inter">
                    Total registrados
                  </p>
                  <p className="text-2xl font-semibold font-montserrat text-gray-800">
                    {totalPostulados}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {convocadoSeleccionado && (
            <div
              className={`
                bg-white rounded-xl shadow-md p-5! border border-gray-100
                transform transition-all duration-500 ease-out
                ${
                  convocadoSeleccionado
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                }
              `}
            >
              <div className="flex justify-between mb-4!">
                <h3 className="flex items-center font-inter text-base! text-center! text-gray-800 mb-1!">
                  <Info className="text-red-600" size={17} />
                  <div className="ml-2! text-red-600">
                    Detalle de la convocatoria
                  </div>
                </h3>

                <button onClick={() => setConvocadoSeleccionado(null)}>
                  <CircleX
                    className="text-red-600 hover:text-red-300"
                    size={20}
                  />
                </button>
              </div>

              <div className="space-y-2! text-sm font-inter text-gray-700">
                <p>
                  <strong>Correo electrónico:</strong>{" "}
                  {convocadoSeleccionado.correo_electronico}
                </p>

                <p>
                  <strong>Fecha de Primer Envío:</strong>{" "}
                  {dayjs(convocadoSeleccionado.fecha_envio).format(
                    "DD MMM YYYY",
                  )}
                </p>

                <p>
                  <strong>Fecha de Ultimo Envío:</strong>{" "}
                  {convocadoSeleccionado.fecha_ultimo_envio !== null
                    ? dayjs(convocadoSeleccionado.fecha_ultimo_envio).format(
                        "DD MMM YYYY",
                      )
                    : dayjs(convocadoSeleccionado.fecha_envio).format(
                        "DD MMM YYYY",
                      )}
                </p>

                <p>
                  <strong>Estado:</strong>{" "}
                  {capitalizeWords(convocadoSeleccionado.estado_envio)}
                </p>

                <p>
                  <strong>Número de envios:</strong>{" "}
                  {convocadoSeleccionado.intentos_envio}
                </p>
                {convocadoSeleccionado.intentos_envio > 1 ? (
                  <p>
                    <strong>Último envío:</strong>{" "}
                    {dayjs(convocadoSeleccionado.fecha_ultimo_envio).format(
                      "DD MMM YYYY",
                    )}
                  </p>
                ) : null}

                {convocadoSeleccionado.estado_envio === "postulado" && (
                  <div className="mt-4! p-3! bg-green-50 rounded-lg text-green-700 flex items-center justify-between">
                    <span>
                      El convocado se registró correctamente a la edición.
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          `/director/participaciones-edicion/${convocadoSeleccionado.id_participacion}/informacion-participacion`,
                          {
                            state: {
                              from: "convocado",
                            },
                          },
                        )
                      }
                      className="flex items-center gap-1 text-green-700 hover:text-green-900 transition-colors"
                      title="Ver detalles de la participación"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <>
            <div
              className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all duration-500 ease-out
                ${
                  convocadoSeleccionado
                    ? "translate-y-4 opacity-90"
                    : "translate-y-0 opacity-100"
                }
              `}
            >
              <div className=" bg-white rounded-xl shadow-sm p-4! border border-gray-100 -mt-1.5!">
                <h3 className="flex font-inter text-base! text-gray-800 mb-1!">
                  <ChartArea className="text-red-600" size={18} />
                  <div className="ml-2! text-gray-800">
                    Trayectoria de las Invitaciones
                  </div>
                </h3>

                <div className="h-60 flex justify-center">
                  <div className="w-full max-w-[95%]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dataLineaTiempo}
                        margin={{ top: 10, right: 20, left: -25, bottom: 10 }}
                        barGap={4}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        <XAxis
                          dataKey="fecha"
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />

                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />

                        <ReTooltip
                          cursor={{ fill: "#f3f4f6" }}
                          content={({ active, payload, label }) => {
                            if (!active || !payload || payload.length === 0) {
                              return null;
                            }

                            return (
                              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3! text-xs font-inter">
                                <p className="text-gray-500 mb-2">{label}</p>

                                {payload.map((dato) => (
                                  <div
                                    key={dato.dataKey}
                                    className="flex items-center gap-2 mb-1 last:mb-0"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{ backgroundColor: dato.color }}
                                    />

                                    <span className="text-gray-700">
                                      {dato.name}:{" "}
                                      <strong className="text-gray-900">
                                        {dato.value}
                                      </strong>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }}
                        />

                        <Bar
                          dataKey="convocados"
                          name="Invitaciones enviadas"
                          fill="#C21111"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={35}
                        />

                        <Bar
                          dataKey="postulados"
                          name="Postulaciones registradas"
                          fill="#2563EB"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={35}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex gap-6! text-sm font-inter justify-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600" />
                    Convocados
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    Postulados
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm px-6! py-3! border border-gray-100 -mt-1.5!">
              <div className="flex justify-between items-center mb-0.5!">
                <h4 className="font-inter text-sm text-gray-600">
                  Convocados que se registraron
                </h4>
                <span className="text-lg font-semibold text-green-600">
                  {porcentajePostulados}%
                </span>
              </div>

              <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r! from-green-500! to-green-700!
                 transition-all! duration-1000! ease-out!"
                  style={{ width: `${porcentajePostulados}%` }}
                />
              </div>

              <p className="mt-1! text-xs text-gray-500 font-inter">
                {totalPostulados} de {totalConvocados} convocados completaron su
                postulación
              </p>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default ListaConvocados;
