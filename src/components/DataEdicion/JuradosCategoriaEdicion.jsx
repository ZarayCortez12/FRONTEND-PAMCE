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
import { listarJuradosPorCategoriaEdicion } from "../../features/jurados/jurado.slice";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";

function ParticipacionesCategoriaEdicion({ id_edicion_categoria }) {
  const dispatch = useDispatch();
  const jurados_categoria = useSelector(
    (state) => state.jurados.jurados_categoria,
  );
  const pagination_jurados_categoria = useSelector(
    (state) => state.jurados.pagination_jurados_categoria,
  );
  const loading = useSelector(
    (state) => state.jurados.loading_jurados_categoria,
  );
  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroNivelEstudio, setFiltroNivelEstudio] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!id_edicion_categoria) return;
    dispatch(
      listarJuradosPorCategoriaEdicion({
        id_edicion_categoria: id_edicion_categoria,
        params: {
          genero: filtroGenero,
          nivel_estudio_superior: filtroNivelEstudio,
          search: searchText,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    searchText,
    currentPage,
    pageSize,
    filtroNivelEstudio,
    filtroGenero,
    id_edicion_categoria,
    dispatch,
  ]);

  const columnsJurados = [
    {
      title: "Documento",
      dataIndex: "numero_documento",
      key: "numero_documento",
      sorter: (a, b) =>
        (a.numero_documento || "").localeCompare(b.numero_documento || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-xs text-gray-700 justify-center">
          {record.tipo_documento} {record.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) => {
        const nombreA = `${a.primer_nombre} ${
          a.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.primer_nombre} ${
          b.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.segundo_nombre)}{" "}
          {record.primer_apellido} {record.segundo_apellido}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "email",
      sorter: (a, b) =>
        (a.correo_electronico || "").localeCompare(b.correo_electronico || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.correo_electronico}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span>Nivel Profesional:</span>
            </div>
            <Select
              className="w-full sm:w-32 font-inter"
              value={filtroNivelEstudio}
              onChange={(v) => {
                setFiltroNivelEstudio(v);
                setCurrentPage(1);
              }}
              options={[
                { label: "Todos", value: "TODOS" },
                { label: "Bachiller", value: "bachiller" },
                { label: "Técnico", value: "tecnico" },
                { label: "Tecnólogo", value: "tecnologo" },
                { label: "Profesional", value: "profesional" },
                { label: "Especialización", value: "especializacion" },
                { label: "Maestría", value: "maestria" },
                { label: "Doctorado", value: "doctorado" },
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setSearchText("");
                setFiltroGenero("TODOS");
                setFiltroNivelEstudio("TODOS");
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
              dataSource={jurados_categoria}
              columns={columnsJurados}
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
              {pagination_jurados_categoria?.total === 0
                ? 0
                : (pagination_jurados_categoria?.page - 1) *
                    pagination_jurados_categoria?.limit +
                  1}{" "}
              -{" "}
              {Math.min(
                pagination_jurados_categoria?.page *
                  pagination_jurados_categoria?.limit,
                pagination_jurados_categoria?.total,
              )}
            </strong>{" "}
            de <strong>{pagination_jurados_categoria?.total}</strong> registros
          </span>
          <Pagination
            current={pagination_jurados_categoria?.page}
            pageSize={pagination_jurados_categoria?.limit}
            total={pagination_jurados_categoria?.total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}

export default ParticipacionesCategoriaEdicion;
