import { useEffect, useState } from "react";
import esES from "antd/es/locale/es_ES";
import { IoMdArrowDropright } from "react-icons/io";
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
import {
  listarCategoriasPorEdicion,
  limpiarCategoriasEdicion,
} from "../../features/categorias/categoria.slice";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  listarGanadoresEdicion,
  limpiarGanadoresEdicion,
  filtrarGanadoresEdicion,
} from "../../features/ganadores/ganadores.slice";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "@/components/LoadingComponent";

function ListarGanadoresEdicion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const categorias = useSelector(
    (state) => state.categorias.categorias_edicion,
  );

  const ganadores = useSelector((state) => state.ganadores.ganadores);
  const pagination = useSelector(
    (state) => state.ganadores.pagination_ganadores_edicion,
  );

  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!edicion?.id_edicion) return;

    document.title = "PAMCE | Ganadores";
    dispatch(limpiarCategoriasEdicion());
    dispatch(limpiarGanadoresEdicion());
    dispatch(
      listarCategoriasPorEdicion({
        id_edicion: edicion.id_edicion,
      }),
    );
    dispatch(
      listarGanadoresEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          search: searchText,
          genero: filtroGenero,
          categoria: filtroCategoria,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-ganadores-edicion",
          position: "top-right",
          autoClose: 3500,
          style: {
            marginTop: "50px",
          },
        });
      });
  }, [
    edicion?.id_edicion,
    dispatch,
    searchText,
    filtroGenero,
    filtroCategoria,
    pageSize,
    currentPage,
  ]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const columns = [
    {
      title: "Documento",
      dataIndex: "numero_documento",
      key: "numero_documento",
      sorter: (a, b) =>
        (a.usuario.numero_documento || "").localeCompare(
          b.usuario.numero_documento || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {record.usuario.tipo_documento} {record.usuario.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombre",
      sorter: (a, b) => {
        const nombreA = `${a.usuario.primer_nombre} ${
          a.usuario.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.usuario.primer_nombre} ${
          b.usuario.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      sorter: (a, b) => {
        const apellidosA =
          `${a.usuario.primer_apellido} ${a.usuario.segundo_apellido}`.toLowerCase();
        const apellidosB =
          `${b.usuario.primer_apellido} ${b.usuario.segundo_apellido}`.toLowerCase();
        return apellidosA.localeCompare(apellidosB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
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
      title: "Categoría",
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
          {capitalizeFirstLetter(
            record.edicionCategoria.categoria.nombre_categoria,
          )}
        </span>
      ),
    },
    {
      title: "Calificación",
      key: "calificacion",
      sorter: (a, b) => a.calificacion_final - b.calificacion_final,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.calificacion_final}
        </span>
      ),
    },
    {
      title: "Puesto",
      key: "puesto",
      sorter: (a, b) => a.puesto - b.puesto,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span
          className={`font-inter text-sm flex justify-center text-center ${record.puesto === "1" ? "text-yellow-600 font-bold" : "text-gray-700"}`}
        >
          {record.puesto}
        </span>
      ),
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
                  navigate(
                    `/director/participaciones-edicion/${record.id_participacion}/informacion-participacion`,
                    {
                      state: {
                        from: "ganador-edicion",
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
            Lista de Ganadores
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Ganadores de {capitalizeFirstLetter(edicion.nombre_edicion)}
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
              <span>Categoría:</span>
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
                ...categorias.map((categoria) => ({
                  value: categoria.edicionesCategoria[0].id_edicion_categoria,
                  label: capitalizeFirstLetter(categoria.nombre_categoria),
                })),
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setFiltroGenero("TODOS");
                setFiltroCategoria("TODOS");
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
                columns={columns}
                dataSource={ganadores}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: <EmptyTable /> }}
              />
            </ConfigProvider>
          </div>
          <div className="flex justify-between items-center px-1! mt-2!">
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

export default ListarGanadoresEdicion;
