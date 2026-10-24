import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Tooltip,
  ConfigProvider,
  Pagination,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { listarParticipacionesPorCategoriaEdicion } from "../../features/participacion/participacion.slice";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import dayjs from "dayjs";

function ParticipacionesCategoriaEdicion({ id_edicion_categoria }) {
  const dispatch = useDispatch();
  const participaciones_categoria = useSelector(
    (state) => state.participacion.participaciones_categoria,
  );
  const pagination_participaciones_categoria = useSelector(
    (state) => state.participacion.pagination_participaciones_categoria,
  );
  const loading = useSelector(
    (state) => state.participacion.loading_participaciones_categoria,
  );
  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!id_edicion_categoria) return;
    dispatch(
      listarParticipacionesPorCategoriaEdicion({
        id_edicion_categoria: id_edicion_categoria,
        params: {
          genero: filtroGenero,
          search: searchText,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    searchText,
    pageSize,
    currentPage,
    filtroGenero,
    id_edicion_categoria,
    dispatch,
  ]);

  const columnsParticipaciones = [
    {
      title: "Documento",
      dataIndex: "numero_documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) =>
        (a.usuario.numero_documento || "").localeCompare(
          b.usuario.numero_documento || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {record.usuario.tipo_documento} {record.usuario.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) =>
        `${a.usuario.primer_nombre} ${a.usuario.segundo_nombre}`.localeCompare(
          `${b.usuario.primer_nombre} ${b.usuario.segundo_nombre}`,
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.primer_apellido)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "email",
      sorter: (a, b) =>
        (a.usuario.correo_electronico || "").localeCompare(
          b.usuario.correo_electronico || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.usuario.correo_electronico}
        </span>
      ),
    },
    {
      title: "Fecha de Postulación",
      dataIndex: "fecha_postulacion",
      key: "fecha_postulacion",
      sorter: (a, b) =>
        (a.fecha_postulacion || "").localeCompare(b.fecha_postulacion || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {dayjs(record.fecha_postulacion).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Fecha de Revisión",
      dataIndex: "fecha_revision",
      key: "fecha_revision",
      sorter: (a, b) =>
        (a.fecha_revision || "").localeCompare(b.fecha_revision || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => {
        const fecha = record.fecha_revision;

        return (
          <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
            {fecha && dayjs(fecha).isValid()
              ? dayjs(fecha).format("DD/MM/YYYY")
              : "-"}
          </span>
        );
      },
    },
    {
      title: "Calificación",
      dataIndex: "calificacion",
      key: "calificacion",
      sorter: (a, b) =>
        (a.calificacion_final || "").localeCompare(b.calificacion_final || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.calificacion_final || "-"}
        </span>
      ),
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <>
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
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por número de documento..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span>Género:</span>
            </div>
            <Select
              className="w-full sm:w-32 font-inter"
              value={filtroGenero}
              onChange={(value) => {
                setFiltroGenero(value);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "femenino", label: "Femenino" },
                { value: "masculino", label: "Masculino" },
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setSearchText("");
                setFiltroGenero("TODOS");
                setCurrentPage(1);
              }}
              className="text-white hover:text-red-300 transition text-xl"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        {loading ? (
          <LoadingInformacion />
        ) : (
          <ConfigProvider locale={esES}>
            <Table
              dataSource={participaciones_categoria}
              columns={columnsParticipaciones}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: <EmptyTable />,
              }}
            />
          </ConfigProvider>
        )}
        <div className="flex justify-between items-center px-1! mt-2!">
          <span className="text-gray-600 font-inter text-sm">
            Mostrando{" "}
            <strong>
              {pagination_participaciones_categoria?.total === 0
                ? 0
                : (pagination_participaciones_categoria?.page - 1) *
                    pagination_participaciones_categoria?.limit +
                  1}{" "}
              -{" "}
              {Math.min(
                pagination_participaciones_categoria?.page *
                  pagination_participaciones_categoria?.limit,
                pagination_participaciones_categoria?.total,
              )}
            </strong>{" "}
            de <strong>{pagination_participaciones_categoria?.total}</strong>{" "}
            registros
          </span>
          <Pagination
            current={pagination_participaciones_categoria?.page}
            pageSize={pagination_participaciones_categoria?.limit}
            total={pagination_participaciones_categoria?.total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}

export default ParticipacionesCategoriaEdicion;
