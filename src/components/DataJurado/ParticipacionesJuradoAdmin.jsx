import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tooltip, Card, Input, Select } from "antd";
import { FaUserGroup, FaFilterCircleXmark } from "react-icons/fa6";
import {
  limpiarParticipacionesEvaluadasJurado,
  obtenerParticipacionesEvaluadasJurado,
} from "../../features/jurados/jurado.slice";
import { Pagination } from "antd";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import { FaUser, FaFilter } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { Eye } from "lucide-react";

function ParticipacionesJuradoSuperadmin({ id_usuario }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participaciones = useSelector((state) => state.jurados.participaciones);
  const pagination_participaciones = useSelector(
    (state) => state.jurados.pagination_participaciones,
  );
  const categorias_filtro = useSelector((state) => state.categorias.categorias);
  const ediciones_filtro = useSelector((state) => state.ediciones.ediciones);

  const [filtroEdicion, setFiltroEdicion] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    document.title = "PAMCE | Información Jurado";
    if (!id_usuario) return;

    dispatch(limpiarParticipacionesEvaluadasJurado());
    dispatch(
      obtenerParticipacionesEvaluadasJurado({
        id_jurado: id_usuario,
        params: {
          search: searchText,
          categoria: filtroCategoria,
          edicion: filtroEdicion,
          genero: filtroGenero,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    id_usuario,
    searchText,
    filtroCategoria,
    filtroGenero,
    filtroEdicion,
    pageSize,
    currentPage,
    dispatch,
  ]);

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const columnsParticipaciones = [
    {
      title: "Documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) =>
        a.usuario.numero_documento.localeCompare(b.usuario.numero_documento),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {record.usuario.tipo_documento} {record.usuario.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombres",
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
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="flex items-center text-center font-inter text-sm text-gray-700 justify-center">
          {capitalizeFirstLetter(record.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_nombre)}
        </span>
      ),
    },
    {
      title: "Apellidos",
      key: "apellidos",
      sorter: (a, b) => {
        const apellidoA = `${a.usuario.primer_apellido} ${
          a.usuario.segundo_apellido || ""
        }`.toLowerCase();
        const apellidoB = `${b.usuario.primer_apellido} ${
          b.usuario.segundo_apellido || ""
        }`.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
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
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.usuario.correo_electronico}
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
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.edicion.nombre_edicion)}
        </span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) =>
        a.edicionCategoria.categoria.nombre_categoria.localeCompare(
          b.edicionCategoria.categoria.nombre_categoria,
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
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
      dataIndex: "calificacion_final",
      key: "calificacion_final",
      sorter: (a, b) => a.calificacion_final - b.calificacion_final,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.calificacion_final ? record.calificacion_final : "N/A"}
        </span>
      ),
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
                    `/administrador/jurados/participaciones-evaluadas/${record.id_participacion}/informacion-participacion`,
                    {
                      state: {
                        from: "jurado-admin",
                        juradoId: id_usuario,
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
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
            value={filtroCategoria}
            onChange={(v) => {
              setFiltroCategoria(v);
              setCurrentPage(1);
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
        <Tooltip title="Limpiar filtros">
          <button
            onClick={() => {
              setFiltroGenero("TODOS");
              setFiltroEdicion("TODOS");
              setFiltroCategoria("TODOS");
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
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      </div>
    </Card>
  );
}

export default ParticipacionesJuradoSuperadmin;
