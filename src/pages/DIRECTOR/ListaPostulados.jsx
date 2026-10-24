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
import { Eye } from "lucide-react";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { listarCategoriasPorEdicion } from "../../features/categorias/categoria.slice";
import { listarPostulacionesPorEdicion } from "../../features/participacion/participacion.slice";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingComponent from "@/components/LoadingComponent";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaPostulados() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const postulaciones = useSelector(
    (state) => state.participacion.postulaciones_edicion,
  );
  const pagination = useSelector(
    (state) => state.participacion.pagination_postulaciones_edicion,
  );
  const loading_postulaciones = useSelector(
    (state) => state.participacion.loading_postulaciones_edicion,
  );
  const categorias = useSelector(
    (state) => state.categorias.categorias_edicion,
  );

  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "PAMCE | Postulados";
    if (!edicion?.id_edicion) return;
    localStorage.setItem("selectedMenuKey", "postulados-edicion");
    dispatch(
      listarPostulacionesPorEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          search: searchText,
          genero: filtroGenero,
          categoria: filtroCategoria,
          estado: filtroEstado,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "lista-postulados-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        console.log("Error al listar participantes:", err);
      });
    dispatch(
      listarCategoriasPorEdicion({
        id_edicion: edicion.id_edicion,
      }),
    );
  }, [
    searchText,
    filtroGenero,
    filtroCategoria,
    filtroEstado,
    pageSize,
    currentPage,
    edicion.id_edicion,
    dispatch,
    location.state,
  ]);

  const columns = [
    {
      title: "Documento",
      dataIndex: ["usuario", "numero_documento"],
      key: "documento",
      align: "center",
      sorter: (a, b) =>
        a.usuario?.numero_documento.localeCompare(b.usuario?.numero_documento),
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
      key: "nombres",
      sorter: (a, b) => {
        const nombreA = `${a.usuario?.primer_nombre} ${
          a.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.usuario?.primer_nombre} ${
          b.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {capitalizeFirstLetter(record.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      sorter: (a, b) => {
        const apellidoA = `${a.usuario?.primer_apellido} ${
          a.segundo_apellido || ""
        }`.toLowerCase();
        const apellidoB = `${b.usuario?.primer_apellido} ${
          b.segundo_apellido || ""
        }`.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {capitalizeFirstLetter(record.usuario.primer_apellido)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: ["usuario", "correo_electronico"],
      key: "email",
      sorter: (a, b) =>
        (a.usuario?.correo_electronico || "").localeCompare(
          b.usuario?.correo_electronico || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (text) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {text}
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
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {capitalizeFirstLetter(
            record.edicionCategoria.categoria.nombre_categoria,
          )}
        </span>
      ),
    },
    {
      title: "Fecha de Postulación",
      key: "fecha_postulacion",
      sorter: (a, b) =>
        dayjs(a.fecha_postulacion).isBefore(dayjs(b.fecha_postulacion)),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center text-center">
          {dayjs(record.fecha_postulacion).format("DD/MM/YYYY")}
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
              record.estado === "aceptada"
                ? "bg-green-600"
                : record.estado === "pendiente"
                  ? "bg-blue-600"
                  : record.estado === "evaluada"
                    ? "bg-purple-600"
                    : "bg-red-600"
            }`}
          >
            {capitalizeFirstLetter(record.estado)}
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
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() => {
                  navigate(
                    `${record.id_participacion}/informacion-postulacion`,
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

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

  if (!edicion) {
    return <LoadingComponent mensaje="Cargando Información..." />;
  }

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Postulaciones
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Postulaciones de la {capitalizeFirstLetter(edicion.nombre_edicion)}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span>Género:</span>
            </div>
            <Select
              className="w-full sm:w-27.5 font-inter"
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
                ...categorias.map((categoria) => ({
                  value: categoria.edicionesCategoria[0].id_edicion_categoria,
                  label: capitalizeFirstLetter(categoria.nombre_categoria),
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
              className="w-full sm:w-29 font-inter"
              value={filtroEstado}
              onChange={(v) => {
                setFiltroEstado(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "pendiente", label: "Pendiente" },
                { value: "aceptada", label: "Aceptada" },
                { value: "rechazada", label: "Rechazada" },
                { value: "evaluada", label: "Evaluada" },
              ]}
            />
            <Tooltip title="Limpiar filtros">
              <button
                onClick={() => {
                  setFiltroGenero("TODOS");
                  setFiltroEstado("TODOS");
                  setFiltroCategoria("TODOS");
                }}
                className="text-white hover:text-red-300 transition text-xl"
              >
                <FaFilterCircleXmark />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="grid! grid-cols-1! gap-5! w-full!">
        <>
          <div className="w-full overflow-x-auto">
            {loading_postulaciones ? (
              <LoadingInformacion />
            ) : (
              <ConfigProvider locale={esES}>
                <Table
                  columns={columns}
                  dataSource={postulaciones}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: <EmptyTable /> }}
                />
              </ConfigProvider>
            )}
          </div>
          <div className="flex justify-between items-center px-1!">
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

export default ListaPostulados;
