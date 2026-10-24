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
import { FaFilterCircleXmark } from "react-icons/fa6";
import { obtenerParticipacionesPorJurado } from "../../features/participantes/participante.slice";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { listarCategorias } from "../../features/categorias/categoria.slice";
import { listarEdiciones } from "../../features/ediciones/edicion.slice";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

function ListaParticipantes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroEdicion, setFiltroEdicion] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [filtroNivelEstudio, setFiltroNivelEstudio] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const participaciones = useSelector(
    (state) => state.participantes.participaciones,
  );
  const pagination = useSelector(
    (state) => state.participantes.pagination_participaciones,
  );

  const categorias_filtro = useSelector((state) => state.categorias.categorias);
  const ediciones_filtro = useSelector((state) => state.ediciones.ediciones);

  const usuario = useSelector((state) => state.autenticacion.usuario);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const cargado = React.useRef(false);

  useEffect(() => {
    document.title = "PAMCE | Participaciones";

    dispatch(listarEdiciones());
    dispatch(listarCategorias());
    dispatch(
      obtenerParticipacionesPorJurado({
        id_jurado: usuario.id_usuario,
        params: {
          edicion: filtroEdicion,
          categoria: filtroCategoria,
          genero: filtroGenero,
          nivel_estudio_superior: filtroNivelEstudio,
          limit: pageSize,
          page: currentPage,
          search: searchText,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.mensaje, {
          toastId: "lista-participantes-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [
    filtroGenero,
    filtroNivelEstudio,
    filtroCategoria,
    filtroEdicion,
    pageSize,
    currentPage,
    searchText,
    dispatch,
    usuario.id_usuario,
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
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record?.participacion?.usuario?.tipo_documento}{" "}
          {record?.participacion?.usuario?.numero_documento}
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record?.participacion?.usuario?.primer_nombre)}{" "}
          {capitalizeWords(record?.participacion?.usuario?.segundo_nombre)}
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record?.participacion?.usuario?.primer_apellido)}{" "}
          {capitalizeWords(record?.participacion?.usuario?.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      key: "email",
      sorter: (a, b) =>
        (a.correo_electronico || "").localeCompare(b.correo_electronico || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record?.participacion?.usuario?.correo_electronico}
        </span>
      ),
    },
    {
      title: "Edición",
      dataIndex: "edicion",
      key: "edicion",
      sorter: (a, b) =>
        a.edicion.nombre_edicion.localeCompare(b.edicion.nombre_edicion),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record?.participacion?.edicion?.nombre_edicion)}
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(
            record?.participacion?.edicionCategoria?.categoria
              ?.nombre_categoria,
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => {
        return (
          <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
            {dayjs(record?.fecha_postulacion).format("DD/MM/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Calificación",
      dataIndex: "calificacion_final",
      key: "calificacion_final",
      sorter: (a, b) =>
        a?.participacion?.calificacion_final -
        b?.participacion?.calificacion_final,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record?.participacion.calificacion_final
            ? record.participacion.calificacion_final
            : "N/A"}
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
            <Tooltip title="Ver detalles">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() => {
                  navigate(
                    `${record.id_participacion}/informacion-participacion`,
                  );
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
            Lista de Participaciones
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Todas las Participaciones que ha evaluado
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
              className="w-15 font-inter"
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
              ]}
            />
          </Tooltip>

          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por número de documento o nombre..."
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="rounded-xl! shadow-sm"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Edición:</span>
            </div>
            <Select
              className="w-full sm:w-38 font-inter"
              value={filtroEdicion}
              onChange={(v) => {
                setFiltroEdicion(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                ...ediciones_filtro.map((e) => ({
                  value: e.id_edicion,
                  label: capitalizeWords(e.nombre_edicion),
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
              value={filtroCategoria}
              onChange={(v) => {
                setFiltroCategoria(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                ...categorias_filtro.map((c) => ({
                  value: c.id_categoria,
                  label: capitalizeWords(c.nombre_categoria),
                })),
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setFiltroGenero("TODOS");
                setFiltroNivelEstudio("TODOS");
                setFiltroEdicion("TODOS");
                setFiltroCategoria("TODOS");
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
            <ConfigProvider locale={esES}>
              <Table
                dataSource={participaciones}
                columns={columns}
                rowKey="id"
                pagination={false}
                locale={{
                  emptyText: <EmptyTable />,
                }}
              />
            </ConfigProvider>
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

export default ListaParticipantes;
