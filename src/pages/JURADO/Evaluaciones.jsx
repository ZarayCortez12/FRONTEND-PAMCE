import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { IoSearchCircle } from "react-icons/io5";
import { Table, Tooltip, Card, Breadcrumb, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Eye } from "lucide-react";
import { FaUser, FaFilter } from "react-icons/fa";
import { FaUserGroup, FaAward, FaFilterCircleXmark } from "react-icons/fa6";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  obtenerJurado,
  obtenerCategoriasParticipacionJurado,
  obtenerParticipacionesEdicion,
} from "../../features/jurados/jurado.slice";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";

function InformacionJurado() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id_usuario } = useParams();
  const jurado = useSelector((state) => state.jurados.juradoObtenido);
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const categorias = useSelector((state) => state.jurados.categorias);
  const participaciones = useSelector((state) => state.jurados.participaciones);
  const pagination = useSelector(
    (state) => state.jurados.pagination_participaciones,
  );
  const usuario = useSelector((state) => state.autenticacion.usuario);

  useEffect(() => {
    document.title = "PAMCE | Información Jurado";
    if (!edicion?.id_edicion) return;
    if (!usuario?.id_usuario) return;
    dispatch(
      obtenerCategoriasParticipacionJurado({
        id_edicion: edicion.id_edicion,
        id_jurado: usuario.id_usuario,
      }),
    );
    dispatch(
      obtenerParticipacionesEdicion({
        id: edicion.id_edicion,
        params: {
          id_jurado: usuario.id_usuario,
          search: searchText,
          categoria: filtroCategoria,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    edicion?.id_edicion,
    dispatch,
    usuario?.id_usuario,
    filtroCategoria,
    searchText,
    pageSize,
    currentPage,
  ]);

  const lista = Array.isArray(participaciones) ? participaciones : [];

  const participacionesFiltrados = lista.filter((p) => {
    const usuario = p.participacion.usuario;
    const participacion = p.participacion;

    const fullName =
      `${usuario.primer_nombre} ${usuario.segundo_nombre || ""} ${usuario.primer_apellido} ${usuario.segundo_apellido || ""}`.toLowerCase();

    const documento =
      `${usuario.tipo_documento} ${usuario.numero_documento}`.toLowerCase();

    const search = searchText.toLowerCase();

    const cumpleBusqueda =
      fullName.includes(search) || documento.includes(search);

    return cumpleBusqueda;
  });

  const columnsParticipaciones = [
    {
      title: "Documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) =>
        a.participacion.usuario.numero_documento.localeCompare(
          b.participacion.usuario.numero_documento,
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {record.participacion.usuario.tipo_documento}{" "}
          {record.participacion.usuario.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombres",
      sorter: (a, b) => {
        const nombreA = `${a.participacion.usuario.primer_nombre} ${
          a.participacion.usuario.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.participacion.usuario.primer_nombre} ${
          b.participacion.usuario.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="flex items-center text-center font-inter text-sm text-gray-700 justify-center">
          {capitalizeFirstLetter(record.participacion.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.participacion.usuario.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      sorter: (a, b) => {
        const apellidoA = `${a.participacion.usuario.primer_apellido} ${
          a.participacion.usuario.segundo_apellido || ""
        }`.toLowerCase();
        const apellidoB = `${b.participacion.usuario.primer_apellido} ${
          b.participacion.usuario.segundo_apellido || ""
        }`.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.participacion.usuario.primer_apellido)}{" "}
          {capitalizeFirstLetter(record.participacion.usuario.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "email",
      sorter: (a, b) =>
        (a.participacion.usuario.correo_electronico || "").localeCompare(
          b.participacion.usuario.correo_electronico || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.participacion.usuario.correo_electronico}
        </span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) =>
        a.participacion.edicionCategoria.categoria.nombre_categoria.localeCompare(
          b.participacion.edicionCategoria.categoria.nombre_categoria,
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(
            record.participacion.edicionCategoria.categoria.nombre_categoria,
          )}
        </span>
      ),
    },
    {
      title: "Calificación",
      dataIndex: "calificacion_final",
      key: "calificacion_final",
      sorter: (a, b) =>
        a.participacion.calificacion_final - b.participacion.calificacion_final,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.participacion.calificacion_final
            ? record.participacion.calificacion_final
            : "N/A"}
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
              record.estado === "evaluado" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {record.estado === "asignado"
              ? "Pendiente"
              : capitalizeFirstLetter(record.estado)}
          </span>
        );
      },
    },
    {
      title: "Acción",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <Tooltip title="Ver detalles de la evaluación">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() =>
                  navigate(
                    `/jurado/evaluaciones/${record.id_participacion}/informacion-evaluacion`,
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosEdicion = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Nombre de la edición"
          valor={capitalizeFirstLetter(edicion?.nombre_edicion)}
        />

        <Campo
          label="Fecha de Inicio"
          valor={dayjs(edicion?.fecha_inicio).format("DD/MM/YYYY")}
        />

        <Campo
          label="Fecha de Fin"
          valor={dayjs(edicion?.fecha_fin).format("DD/MM/YYYY")}
        />

        <Campo
          label="Etapa de Convocatoria"
          valor={
            dayjs(edicion?.fecha_inicio_convocatoria).format("DD/MM/YYYY") +
            " - " +
            dayjs(edicion?.fecha_fin_convocatoria).format("DD/MM/YYYY")
          }
        />

        <Campo
          label="Etapa de Evaluación"
          valor={
            dayjs(edicion?.fecha_inicio_evaluacion).format("DD/MM/YYYY") +
            " - " +
            dayjs(edicion?.fecha_fin_evaluacion).format("DD/MM/YYYY")
          }
        />

        <Campo
          label="Etapa de Premiacion"
          valor={
            dayjs(edicion?.fecha_inicio_premiacion).format("DD/MM/YYYY") +
            " - " +
            dayjs(edicion?.fecha_fin_premiacion).format("DD/MM/YYYY")
          }
        />
      </div>

      <div className="hidden lg:flex justify-center">
        <img
          src={imagen_data_postulado}
          alt="Foto de usuario"
          className="h-30 object-contain ml-3!"
        />
      </div>
    </div>
  );

  const Campo = ({ label, valor }) => (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  return (
    <div className="p-1! w-full">
      <div className="flex! flex-col gap-2! md:flex-row! md:items-center! md:justify-between! mb-4!">
        <div className="flex! items-center! gap-2!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md"
            size={36}
          />
          <h1 className="font-montserrat text-lg! md:text-xl!">
            Proceso de Evaluación
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={FaUser} titulo="Datos Edición" />
          <DatosEdicion />
        </Card>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50 h-full">
            <TituloCard
              icon={FaAward}
              titulo="Categorías"
              color="text-red-500"
            />
            <div className="flex flex-wrap gap-2">
              {categorias?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categorias.map((cat) => (
                    <span
                      key={cat.id_categoria}
                      className="inline-flex items-center gap-1 px-3! py-1.5! rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm font-inter"
                    >
                      {capitalizeFirstLetter(cat.nombre_categoria)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500 font-inter">
                  El jurado no ha participado en ninguna edición
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
      <Card className="rounded-xl shadow-sm lg:col-span-5">
        <TituloCard icon={FaUserGroup} titulo="Participaciones Asignadas" />
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
              autoFocus
              allowClear
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
                ...categorias.map((c) => ({
                  value: c.id_categoria,
                  label: capitalizeFirstLetter(c.nombre_categoria),
                })),
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setFiltroCategoria("TODOS");
                dispatch(obtenerJurado(id_usuario));
                setCurrentPage(1);
              }}
              className="text-white hover:text-red-300 transition text-xl -ml-2!"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
        <div className="grid! grid-cols-1! gap-5! w-full! mt-4!">
          <>
            <div className="w-full overflow-x-auto">
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
      </Card>
    </div>
  );
}

export default InformacionJurado;
