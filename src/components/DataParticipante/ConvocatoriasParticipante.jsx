import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Tooltip,
  Card,
  Breadcrumb,
  Select,
  Pagination,
  ConfigProvider,
} from "antd";
import { BiSolidCategory, BiSolidMegaphone } from "react-icons/bi";
import { FaUser, FaFilter, FaUserCheck } from "react-icons/fa";
import { FaAward, FaFilterCircleXmark } from "react-icons/fa6";
import { obtenerConvocatoriasParticipante } from "../../features/participantes/participante.slice";
import esES from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import imagen_no_data from "../../images/imagen_no_data.jpg";

function ConvocatoriasParticipante({ id_usuario }) {
  const dispatch = useDispatch();

  const convocatorias = useSelector(
    (state) => state.participantes.convocatorias,
  );
  const pagination_convocatorias = useSelector(
    (state) => state.participantes.pagination_convocatorias,
  );

  const ediciones_filtro = useSelector((state) => state.ediciones.ediciones);

  const [filtroEdicionConvocatoria, setFiltroEdicionConvocatoria] =
    useState("TODOS");
  const [filtroEstadoConvocatoria, setFiltroEstadoConvocatoria] =
    useState("TODOS");
  const [pageSizeConvocatorias, setPageSizeConvocatorias] = useState(10);
  const [currentPageConvocatorias, setCurrentPageConvocatorias] = useState(1);

  useEffect(() => {
    document.title = "PAMCE | Información Participante";
    if (!id_usuario) return;

    dispatch(
      obtenerConvocatoriasParticipante({
        id_participante: id_usuario,
        params: {
          edicion: filtroEdicionConvocatoria,
          estado: filtroEstadoConvocatoria,
          limit: pageSizeConvocatorias,
          page: currentPageConvocatorias,
        },
      }),
    );
  }, [
    id_usuario,
    filtroEstadoConvocatoria,
    filtroEdicionConvocatoria,
    pageSizeConvocatorias,
    currentPageConvocatorias,
    dispatch,
  ]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={14} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const columnsConvocatorias = [
    {
      title: "Edición",
      dataIndex: "edicion",
      key: "edicion",
      sorter: (a, b) =>
        a.edicion.nombre_edicion.localeCompare(b.edicion.nombre_edicion),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => (
        <span className="flex text-center gap-1 font-inter text-xs text-gray-700 justify-center">
          {capitalizeFirstLetter(record.edicion.nombre_edicion)}
        </span>
      ),
    },
    {
      title: "Fecha de Envío",
      dataIndex: "fecha_envio",
      key: "fecha_envio",
      sorter: (a, b) =>
        dayjs(a.fecha_envio).valueOf() - dayjs(b.fecha_envio).valueOf(),
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => {
        return (
          <span className="flex text-center gap-1 font-inter text-xs text-gray-700 justify-center">
            {dayjs(record.fecha_envio).format("DD/MM/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Fecha de Respuesta",
      dataIndex: "fecha_respuesta",
      key: "fecha_respuesta",
      align: "center",
      sorter: (a, b) => {
        const fechaA = a.fecha_respuesta
          ? dayjs(a.fecha_respuesta).valueOf()
          : 0;

        const fechaB = b.fecha_respuesta
          ? dayjs(b.fecha_respuesta).valueOf()
          : 0;

        return fechaA - fechaB;
      },
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => {
        return (
          <span className="flex text-center gap-1 font-inter text-xs text-gray-700 justify-center">
            {record.fecha_respuesta
              ? dayjs(record.fecha_respuesta).format("DD/MM/YYYY")
              : "-"}
          </span>
        );
      },
    },
    {
      title: "Intentos de Envío",
      dataIndex: "intentos_envio",
      key: "intentos_envio",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => {
        return (
          <span className="flex text-center gap-1 font-inter text-xs text-gray-700 justify-center">
            {record.intentos_envio}
          </span>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => {
        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
              record.estado_envio === "enviado" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {record.estado_envio === "postulado"
              ? "Se registro"
              : capitalizeFirstLetter(record.estado_envio)}
          </span>
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
    <Card className="rounded-xl shadow-sm lg:col-span-1 mb-3!">
      <TituloCard icon={BiSolidMegaphone} titulo="Convocatorias Registradas" />
      <div className="w-full bg-red-600 rounded-xl p-2! flex items-center gap-3 flex-wrap md:flex-nowrap mb-2!">
        <Tooltip title="Filtrar por cantidad de registros">
          <Select
            value={pageSizeConvocatorias}
            onChange={(value) => {
              setPageSizeConvocatorias(value);
              setCurrentPageConvocatorias(1);
            }}
            className="w-17 font-inter"
            options={[
              { label: "10", value: 10 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
          />
        </Tooltip>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
          <div className="flex items-center gap-1">
            <FaFilter />
            <span className="-ml-0.5!">Edición:</span>
          </div>
          <Select
            className="w-full sm:w-38 font-inter"
            value={filtroEdicionConvocatoria}
            onChange={(v) => {
              setFiltroEdicionConvocatoria(v);
              setCurrentPageConvocatorias(1);
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
            <span className="-ml-0.5!">Estado:</span>
          </div>
          <Select
            className="w-full sm:w-27 font-inter"
            value={filtroEstadoConvocatoria}
            onChange={(v) => {
              setFiltroEstadoConvocatoria(v);
              setCurrentPageConvocatorias(1);
            }}
            options={[
              { label: "Todos", value: "TODOS" },
              { label: "Enviado", value: "enviado" },
              { label: "Postulado", value: "postulado" },
            ]}
          />
        </div>
        <Tooltip title="Limpiar filtros">
          <button
            onClick={() => {
              setFiltroEdicionConvocatoria("TODOS");
              setFiltroEstadoConvocatoria("TODOS");
              setCurrentPageConvocatorias(1);
            }}
            className="text-white hover:text-red-300 transition text-xl -ml-2!"
          >
            <FaFilterCircleXmark />
          </button>
        </Tooltip>
      </div>
      <div className="w-full overflow-x-auto mb-2!">
        <ConfigProvider locale={esES}>
          <Table
            rowKey={(record) => record.id_convocatoria}
            columns={columnsConvocatorias}
            dataSource={convocatorias}
            pagination={false}
            locale={{ emptyText: <EmptyTable /> }}
          />
        </ConfigProvider>
      </div>
      <div className="flex justify-between items-center mt-3 px-1">
        <span className="text-gray-600 font-inter text-sm">
          Mostrando{" "}
          <strong>
            {pagination_convocatorias?.total === 0
              ? 0
              : (pagination_convocatorias?.page - 1) *
                  pagination_convocatorias?.limit +
                1}{" "}
            -{" "}
            {Math.min(
              pagination_convocatorias?.page * pagination_convocatorias?.limit,
              pagination_convocatorias?.total,
            )}
          </strong>{" "}
          de <strong>{pagination_convocatorias?.total}</strong> registros
        </span>
        <Pagination
          current={pagination_convocatorias?.page}
          pageSize={pagination_convocatorias?.limit}
          total={pagination_convocatorias?.total}
          onChange={(page) => setCurrentPageConvocatorias(page)}
          showSizeChanger={false}
        />
      </div>
    </Card>
  );
}

export default ConvocatoriasParticipante;
