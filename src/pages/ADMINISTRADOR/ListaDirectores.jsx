import { useEffect, useState } from "react";
import {
  IoMdArrowDropright,
  IoMdAddCircle,
  IoIosInformationCircle,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import {
  Input,
  Table,
  Modal,
  Select,
  Tooltip,
  Pagination,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { cambiarEstadoDirector } from "../../features/directores/director.slice";
import {
  listarDirectores,
  obtenerDirector,
} from "../../features/directores/director.slice";
import {
  Eye,
  Pencil,
  Ban,
  CheckCircle,
  CircleUserRound,
  IdCard,
} from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import es from "dayjs/locale/es";
import LoadingInformacion from "@/components/LoadingInformacion";
import DirectorFormulario from "@/components/DirectorFormulario";

function ListaDirectores() {
  const dispatch = useDispatch();

  const directores = useSelector((state) => state.directores.directores);
  const pagination = useSelector(
    (state) => state.directores.pagination_directores,
  );
  const loading = useSelector((state) => state.jurados.loading_directores);

  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroNivelEstudio, setFiltroNivelEstudio] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [abrirModal, setAbrirModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [directorSeleccionado, setDirectorSeleccionado] = useState(null);
  const [abrirModalView, setAbrirModalView] = useState(false);
  const [viewDirector, setViewDirector] = useState(null);
  const [form, setForm] = useState(null);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    document.title = "PAMCE | Directores";
    dispatch(
      listarDirectores({
        search: searchText,
        genero: filtroGenero,
        nivel_estudio_superior: filtroNivelEstudio,
        estado: filtroEstado,
        limit: pageSize,
        page: currentPage,
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-directores",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [
    searchText,
    filtroGenero,
    filtroNivelEstudio,
    filtroEstado,
    pageSize,
    currentPage,
    dispatch,
  ]);

  useEffect(() => {
    if (!viewDirector) return;
    dispatch(obtenerDirector(viewDirector.id_usuario))
      .unwrap()
      .then((res) => {
        setForm({
          correo: res.correo_electronico || "",
          telefono: res.telefono || "",
          direccion: res.direccion || "",
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [viewDirector, dispatch]);

  const inactivarDirector = (director) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de inactivar este director?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IdCard
              style={{
                fontSize: "20px",
                color: "#e10318",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "5px" }}>
              <strong>Número de documento: </strong>
              {director.numero_documento}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <CircleUserRound style={{ fontSize: "20px", color: "#e10318" }} />
            <div style={{ fontFamily: "Inter", marginLeft: "5px" }}>
              <strong>Nombre: </strong>
              {capitalizeWords(director.primer_nombre)}{" "}
              {capitalizeWords(director.segundo_nombre)}{" "}
              {capitalizeWords(director.primer_apellido)}{" "}
              {capitalizeWords(director.segundo_apellido)}
            </div>
          </div>
        </div>
      ),
      okText: "Sí, desactivar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(
          cambiarEstadoDirector({
            id_usuario: director.id_usuario,
            estado: "inactivo",
          }),
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch((error) => {
            toast.error(error.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          });
      },
    });
  };

  const activarDirector = (director) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de activar este director?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IdCard
              style={{
                fontSize: "20px",
                color: "#e10318",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "5px" }}>
              <strong>Número de documento: </strong>
              {director.numero_documento}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <CircleUserRound style={{ fontSize: "20px", color: "#e10318" }} />
            <div style={{ fontFamily: "Inter", marginLeft: "5px" }}>
              <strong>Nombre: </strong>
              {capitalizeWords(director.primer_nombre)}{" "}
              {capitalizeWords(director.segundo_nombre)}{" "}
              {capitalizeWords(director.primer_apellido)}{" "}
              {capitalizeWords(director.segundo_apellido)}
            </div>
          </div>
        </div>
      ),
      okText: "Sí, activar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(
          cambiarEstadoDirector({
            id_usuario: director.id_usuario,
            estado: "activo",
          }),
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const recargarDirectores = () => {
    dispatch(
      listarDirectores({
        search: searchText,
        genero: filtroGenero,
        nivel_estudio_superior: filtroNivelEstudio,
        estado: filtroEstado,
        limit: pageSize,
        page: currentPage,
      }),
    );
  };

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
          {text || "No registrado"}
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
        const estado = record.roles[0].UsuarioRol.estado_rol;

        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Ver detalles">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() => {
                  setAbrirModalView(true);
                  setViewDirector(record);
                }}
              >
                <Eye className="text-blue-600" size={18} />
              </button>
            </Tooltip>

            <Tooltip
              title={
                estado === "inactivo"
                  ? "No se puede editar un director inactivo"
                  : "Editar director"
              }
            >
              <button
                disabled={estado === "inactivo"}
                onClick={() => {
                  if (estado === "inactivo") return;
                  setAbrirModal(true);
                  setDirectorSeleccionado(record);
                  setEditarModal(true);
                }}
                className={`
                  p-2! rounded-lg transition
                  ${
                    estado === "inactivo"
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-yellow-50 hover:bg-yellow-100"
                  }
                `}
              >
                <Pencil
                  size={18}
                  className={
                    estado === "inactivo" ? "text-gray-400" : "text-yellow-600"
                  }
                />
              </button>
            </Tooltip>

            {estado === "activo" ? (
              <Tooltip title="Inactivar">
                <button
                  className="p-2! rounded-lg bg-red-50 hover:bg-red-100 transition"
                  onClick={() => inactivarDirector(record)}
                >
                  <Ban className="text-red-600" size={18} />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Activar">
                <button
                  className="p-2! rounded-lg bg-green-50 hover:bg-green-100 transition"
                  onClick={() => activarDirector(record)}
                >
                  <CheckCircle className="text-green-600" size={18} />
                </button>
              </Tooltip>
            )}
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

  const InfoDisplay = ({ label, value }) => {
    const hasValue =
      value !== null && value !== undefined && String(value).trim() !== "";

    return (
      <div>
        <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1!">
          {label}
        </dt>
        <dd className="text-sm font-medium text-gray-800">
          {hasValue ? (
            capitalizeWords(String(value).trim())
          ) : (
            <span className="text-gray-400 italic">No disponible</span>
          )}
        </dd>
      </div>
    );
  };

  const InfoDocumento = ({ label, value }) => {
    const hasValue =
      value !== null && value !== undefined && String(value).trim() !== "";

    return (
      <div>
        <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1!">
          {label}
        </dt>
        <dd className="text-sm font-medium text-gray-800">
          {hasValue ? (
            String(value).trim()
          ) : (
            <span className="text-gray-400 italic">No disponible</span>
          )}
        </dd>
      </div>
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("T")[0].split("-");

    const fechaLocal = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fechaLocal);
  };

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Directores
          </span>
        </div>
        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Todos los Directores de PAMCE UFPS
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
              <span className="-ml-0.5!">Estado:</span>
            </div>
            <Select
              className="w-full sm:w-24 font-inter"
              value={filtroEstado}
              onChange={(v) => {
                setFiltroEstado(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" },
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
                setFiltroEstado("TODOS");
                setFiltroNivelEstudio("TODOS");
              }}
              className="text-white hover:text-red-300 transition text-xl -ml-1.5!"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
        <button
          onClick={() => setAbrirModal(true)}
          className="-mt-3! bg-white border-2 border-red-600 text-red-600 rounded-xl py-3! flex items-center justify-center font-poppins text-md shadow-md hover:bg-red-600 hover:text-white transition w-full md:w-55! gap-1"
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Director
        </button>
      </div>
      <div className="grid! grid-cols-1! gap-5! w-full!">
        <>
          <div className="w-full overflow-x-auto">
            {loading ? (
              <LoadingInformacion />
            ) : (
              <ConfigProvider locale={es}>
                <Table
                  dataSource={directores}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  locale={{
                    emptyText: <EmptyTable />,
                  }}
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
        <DirectorFormulario
          visible={abrirModal}
          onClose={() => {
            setEditarModal(false);
            setDirectorSeleccionado(null);
            setAbrirModal(false);
          }}
          isEditMode={editarModal}
          initialValues={directorSeleccionado}
          onSuccess={recargarDirectores}
        />
      </div>
      <Modal
        open={abrirModalView}
        onCancel={() => setAbrirModalView(false)}
        footer={null}
        width={950}
        closable={false}
        centered
      >
        <div className="bg-white rounded-2xl overflow-hidden font-inter shadow-xl">
          <div className="px-5! py-4! border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2.5! rounded-xl text-red-600 text-xl border border-red-100">
                <IoIosInformationCircle />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
                  Detalles del Director
                </h2>
                <p className="text-xs text-gray-500 -mt-0.5!">
                  Información personal y de contacto registrada del director
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAbrirModalView(false)}
                className="text-gray-400 hover:text-red-600 text-2xl p-1 ml-2 transition"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="p-6! bg-gray-50/50 space-y-8">
            <section className="bg-white py-4! px-6! rounded-2xl border border-gray-100 shadow-sm mb-4!">
              <h3 className=" font-bold uppercase text-gray-500 tracking-wider mb-4! flex items-center gap-2">
                <span className="w-1.5 h-4 bg-gray-300 rounded "></span>
                <span className="text-base">Información de Identidad</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <InfoDisplay
                  label="Nombre Completo"
                  value={[
                    viewDirector?.primer_nombre,
                    viewDirector?.segundo_nombre,
                    viewDirector?.primer_apellido,
                    viewDirector?.segundo_apellido,
                  ]
                    .filter((nombre) => nombre?.trim())
                    .join(" ")}
                />
                <InfoDocumento
                  label="Documento"
                  value={[
                    viewDirector?.tipo_documento,
                    viewDirector?.numero_documento
                      ? new Intl.NumberFormat("es-CO").format(
                          viewDirector.numero_documento,
                        )
                      : "",
                  ]
                    .filter((valor) => valor?.toString().trim())
                    .join(" ")}
                />
                <InfoDisplay
                  label="Código Institucional"
                  value={viewDirector?.codigo_institucional}
                />
                <InfoDisplay
                  label="Nivel de Educación"
                  value={capitalizeWords(viewDirector?.nivel_estudio_superior)}
                />
                <InfoDisplay
                  label="Género"
                  value={capitalizeWords(viewDirector?.genero)}
                />
                <InfoDisplay
                  label="Fecha de Nacimiento"
                  value={formatearFecha(viewDirector?.fecha_nacimiento)}
                />
              </div>
            </section>

            <section className="bg-white p-5! rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold uppercase text-red-600 tracking-wider mb-4! flex items-center gap-2">
                <span className="w-1.5 h-4 bg-red-200 rounded"></span>
                <span className="text-base">Contacto y Registro</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-2!">
                <InfoDisplay
                  label="Correo Electrónico"
                  value={viewDirector?.correo_electronico}
                />
                <InfoDisplay
                  label="Número de Teléfono"
                  value={viewDirector?.telefono}
                />
                <InfoDisplay
                  label="Dirección Residencia"
                  value={viewDirector?.direccion}
                />
              </div>
            </section>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ListaDirectores;
