import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tooltip, Card, Select, Pagination, ConfigProvider } from "antd";
import { FaFilter, FaUserCheck } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  limpiarParticipaciones,
  obtenerParticipaciones,
} from "../../features/participantes/participante.slice";
import esES from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ParticipacionesParticipante({ id_usuario }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participaciones = useSelector(
    (state) => state.participantes.participaciones,
  );
  const pagination_participaciones = useSelector(
    (state) => state.participantes.pagination_participaciones,
  );

  const categorias_filtro = useSelector((state) => state.categorias.categorias);
  const ediciones_filtro = useSelector((state) => state.ediciones.ediciones);

  const [filtroEdicionParticipaciones, setFiltroEdicionParticipaciones] =
    useState("TODOS");
  const [filtroCategoriaParticipaciones, setFiltroCategoriaParticipaciones] =
    useState("TODOS");
  const [filtroEstadoParticipaciones, setFiltroEstadoParticipaciones] =
    useState("TODOS");
  const [pageSizeParticipaciones, setPageSizeParticipaciones] = useState(10);
  const [currentPageParticipaciones, setCurrentPageParticipaciones] =
    useState(1);

  useEffect(() => {
    document.title = "PAMCE | Información Participante";
    if (!id_usuario) return;

    dispatch(limpiarParticipaciones());
    dispatch(
      obtenerParticipaciones({
        id_participante: id_usuario,
        params: {
          edicion: filtroEdicionParticipaciones,
          categoria: filtroCategoriaParticipaciones,
          estado: filtroEstadoParticipaciones,
          limit: pageSizeParticipaciones,
          page: currentPageParticipaciones,
        },
      }),
    );
  }, [
    id_usuario,
    filtroEdicionParticipaciones,
    filtroCategoriaParticipaciones,
    filtroEstadoParticipaciones,
    pageSizeParticipaciones,
    currentPageParticipaciones,
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

  const columnsParticipaciones = [
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
        <span className="flex text-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {capitalizeFirstLetter(record.edicion.nombre_edicion)}
        </span>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) =>
        a.edicionCategoria.categoria.nombre_categoria.localeCompare(
          b.edicionCategoria.categoria.nombre_categoria,
        ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => (
        <span className="flex text-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {capitalizeFirstLetter(
            record.edicionCategoria.categoria.nombre_categoria,
          )}
        </span>
      ),
    },
    {
      title: " Fecha de Registro",
      dataIndex: "fecha_registro",
      key: "fecha_registro",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.fecha_postulacion).valueOf() -
        dayjs(b.fecha_postulacion).valueOf(),
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
          <span className="flex text-center gap-1 font-inter text-sm text-gray-700 justify-center">
            {dayjs(record.fecha_postulacion).format("DD/MM/YYYY")}
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
              record.estado === "aceptada"
                ? "bg-green-600"
                : record.estado === "rechazada"
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
          >
            {capitalizeFirstLetter(record.estado)}
          </span>
        );
      },
    },
    {
      title: "Acción",
      key: "acciones",
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
          <div className="flex items-center justify-center gap-4">
            <Tooltip title="Ver detalles de la evaluación">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() =>
                  navigate(
                    `/director/lista-participantes/participaciones/${record.id_participacion}/informacion-participacion`,
                    {
                      state: {
                        from: "participante",
                        participanteId: id_usuario,
                      },
                    },
                  )
                }
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
    <Card className="rounded-xl shadow-sm lg:col-span-1">
      <TituloCard icon={FaUserCheck} titulo="Participaciones Registradas" />
      <div className="w-full bg-red-600 rounded-xl p-2! flex items-center gap-3 flex-wrap md:flex-nowrap mb-2!">
        <Tooltip title="Filtrar por cantidad de registros">
          <Select
            value={pageSizeParticipaciones}
            onChange={(value) => {
              setPageSizeParticipaciones(value);
              setCurrentPageParticipaciones(1);
            }}
            className="w-15 font-inter"
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
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
            value={filtroEdicionParticipaciones}
            onChange={(v) => {
              setFiltroEdicionParticipaciones(v);
              setCurrentPageParticipaciones(1);
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
            value={filtroCategoriaParticipaciones}
            onChange={(v) => {
              setFiltroCategoriaParticipaciones(v);
              setCurrentPageParticipaciones(1);
            }}
            options={[
              { value: "TODOS", label: "Todos" },
              ...categorias_filtro.map((c) => ({
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
            value={filtroEstadoParticipaciones}
            onChange={(v) => {
              setFiltroEstadoParticipaciones(v);
              setCurrentPageParticipaciones(1);
            }}
            options={[
              { value: "TODOS", label: "Todos" },
              { value: "pendiente", label: "Pendiente" },
              { value: "aceptada", label: "Aceptado" },
              { value: "rechazada", label: "Rechazado" },
            ]}
          />
        </div>
        <Tooltip title="Limpiar filtros">
          <button
            onClick={() => {
              setFiltroEdicionParticipaciones("TODOS");
              setFiltroCategoriaParticipaciones("TODOS");
              setFiltroEstadoParticipaciones("TODOS");
              setCurrentPageParticipaciones(1);
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
            rowKey={(record) => record.id_participacion}
            columns={columnsParticipaciones}
            dataSource={participaciones}
            pagination={false}
            locale={{ emptyText: <EmptyTable /> }}
          />
        </ConfigProvider>
      </div>
      <div className="flex justify-between items-center mt-3 px-1">
        <span className="text-gray-600 font-inter text-sm">
          Mostrando{" "}
          <strong>
            {pagination_participaciones?.total === 0
              ? 0
              : (pagination_participaciones?.page - 1) *
                  pagination_participaciones?.limit +
                1}{" "}
            -{" "}
            {Math.min(
              pagination_participaciones?.page *
                pagination_participaciones?.limit,
              pagination_participaciones?.total,
            )}
          </strong>{" "}
          de <strong>{pagination_participaciones?.total}</strong> registros
        </span>
        <Pagination
          current={pagination_participaciones?.page}
          pageSize={pagination_participaciones?.limit}
          total={pagination_participaciones?.total}
          onChange={(page) => setCurrentPageParticipaciones(page)}
          showSizeChanger={false}
        />
      </div>
    </Card>
  );
}

export default ParticipacionesParticipante;
