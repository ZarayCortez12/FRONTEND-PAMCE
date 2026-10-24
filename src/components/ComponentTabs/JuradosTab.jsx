import { useEffect, useState } from "react";
import esES from "antd/es/locale/es_ES";
import {
  ConfigProvider,
  Input,
  Table,
  Select,
  Tooltip,
  Pagination,
} from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  listarJuradosPorEdicion,
  limpiarJuradosPorEdicion,
} from "../../features/jurados/jurado.slice";
import LoadingComponent from "@/components/LoadingComponent";
import LoadingInformacion from "@/components/LoadingInformacion";

function JuradosTab({ edicion }) {
  const dispatch = useDispatch();
  const jurados = useSelector((state) => state.jurados.jurados_edicion);
  const pagination = useSelector(
    (state) => state.jurados.pagination_jurados_edicion,
  );
  const loading = useSelector((state) => state.jurados.loading_jurados_edicion);
  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroNivelEstudio, setFiltroNivelEstudio] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!edicion.id_edicion) return;
    dispatch(limpiarJuradosPorEdicion());
    dispatch(
      listarJuradosPorEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          search: searchText,
          genero: filtroGenero,
          nivel_estudio_superior: filtroNivelEstudio,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    searchText,
    filtroGenero,
    filtroNivelEstudio,
    pageSize,
    currentPage,
    edicion.id_edicion,
    dispatch,
  ]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const columns = [
    {
      title: "Documento",
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
      title: "Nombres",
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
          {capitalizeFirstLetter(record.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      sorter: (a, b) => {
        const apellidosA =
          `${a.primer_apellido} ${a.segundo_apellido}`.toLowerCase();
        const apellidosB =
          `${b.primer_apellido} ${b.segundo_apellido}`.toLowerCase();
        return apellidosA.localeCompare(apellidosB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.primer_apellido)}{" "}
          {capitalizeFirstLetter(record.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
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
    {
      title: "Código Institucional",
      sorter: (a, b) =>
        (a.codigo_institucional || "").localeCompare(
          b.codigo_institucional || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.codigo_institucional || "-"}
        </span>
      ),
    },
    {
      title: "Nivel Profesional",
      sorter: (a, b) =>
        (a.nivel_estudio_superior || "").localeCompare(
          b.nivel_estudio_superior || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.nivel_estudio_superior)}
        </span>
      ),
    },
  ];

  if (!edicion) {
    return <LoadingComponent mensaje="Cargando Información..." />;
  }

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
    <div className="p-4! bg-gray-50 w-full">
      <div className="rounded-xl shadow-sm bg-white p-4!">
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
                placeholder="Buscar por nombre o documento..."
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
                onChange={(v) => {
                  setFiltroGenero(v);
                  setCurrentPage(1);
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
                <span>Nivel de Estudio:</span>
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
        <div className="grid! grid-cols-1! gap-5! w-full! mt-4!">
          <>
            <div className="w-full overflow-x-auto">
              {loading ? (
                <LoadingInformacion />
              ) : (
                <ConfigProvider locale={esES}>
                  <Table
                    columns={columns}
                    dataSource={jurados}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: <EmptyTable /> }}
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
      </div>
    </div>
  );
}

export default JuradosTab;
