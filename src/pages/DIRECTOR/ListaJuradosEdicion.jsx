import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import { Input, Table, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  listarJuradosPorEdicion,
  limpiarJuradosPorEdicion,
} from "../../features/jurados/jurado.slice";
import { Eye } from "lucide-react";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "@/components/LoadingComponent";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaJuradosEdicion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);

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

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    document.title = "PAMCE | Jurados Edicion";

    if (!edicion?.id_edicion) return;

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

  const columns = [
    {
      title: "Documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) => a.numero_documento.localeCompare(b.numero_documento),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {record.tipo_documento} {record.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombres",
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
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record.primer_nombre)}{" "}
          {capitalizeWords(record.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      sorter: (a, b) => {
        const apellidoA = `${a.primer_apellido} ${
          a.segundo_apellido || ""
        }`.toLowerCase();
        const apellidoB = `${b.primer_apellido} ${
          b.segundo_apellido || ""
        }`.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record.primer_apellido)}{" "}
          {capitalizeWords(record.segundo_apellido)}
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
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {text}
        </span>
      ),
    },
    {
      title: "Código Institucional",
      dataIndex: "codigo_institucional",
      key: "codigo",
      sorter: (a, b) =>
        (a.codigo_institucional || "").localeCompare(
          b.codigo_institucional || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {text}
        </span>
      ),
    },
    {
      title: "Nivel de Estudio",
      dataIndex: "nivel_estudio_superior",
      key: "nivel",
      sorter: (a, b) =>
        (a.nivel_estudio_superior || "").localeCompare(
          b.nivel_estudio_superior || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(text)}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (_, record) => {
        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
              record.roles[0].UsuarioRol.estado_rol === "activo"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {capitalizeWords(record.roles[0].UsuarioRol.estado_rol)}
          </span>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Ver detalles">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() =>
                  navigate(`${record.id_usuario}/informacion-jurado`, {
                    state: {
                      from: "jurado-edicion",
                    },
                  })
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
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Jurados
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Jurados de {capitalizeWords(edicion.nombre_edicion)}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
        <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
          <Tooltip title="Filtrar por cantidad de registros">
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-17 font-inter"
              options={[
                { label: "10", value: 10 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
            />
          </Tooltip>
          <div className="w-full md:flex-1 -ml-1!">
            <Input
              placeholder="Buscar por número de documento o nombre..."
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
              <span className="-ml-0.5!">Género:</span>
            </div>
            <Select
              className="w-full sm:w-28 font-inter"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Nivel de Estudio:</span>
            </div>
            <Select
              className="w-full sm:w-36 font-inter"
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
                setFiltroGenero("TODOS");
                setFiltroNivelEstudio("TODOS");
                setCurrentPage(1);
              }}
              className="text-white hover:text-red-300 transition text-xl -ml-1.5!"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="grid! grid-cols-1! gap-5! w-full!">
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
  );
}

export default ListaJuradosEdicion;
