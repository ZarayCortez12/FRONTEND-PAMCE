import React, { useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearchCircle } from "react-icons/io5";
import { Input, Table, Modal, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  listarParticipantes,
  cambiarEstadoParticipante,
} from "../../features/participantes/participante.slice";
import {
  Eye,
  Pencil,
  Ban,
  CheckCircle,
  CircleUserRound,
  IdCard,
} from "lucide-react";
import { Pagination } from "antd";
import ParticipanteFormulario from "../../components/ParticipanteFormulario";
import es from "dayjs/locale/es";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { useNavigate } from "react-router-dom";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaParticipantes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participantes = useSelector(
    (state) => state.participantes.participantes,
  );
  const pagination = useSelector(
    (state) => state.participantes.pagination_participantes,
  );
  const loading = useSelector((state) => state.participantes.loading);

  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroNivelEstudio, setFiltroNivelEstudio] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [abrirModal, setAbrirModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [participanteSeleccionado, setParticipanteSeleccionado] =
    useState(null);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    document.title = "PAMCE | Participantes";
    dispatch(
      listarParticipantes({
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
          toastId: "listado-participantes",
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

  const inactivarParticipante = (participante) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de inactivar este participante?
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
              {participante.numero_documento}
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
              {capitalizeWords(participante.primer_nombre)}{" "}
              {capitalizeWords(participante.segundo_nombre)}{" "}
              {capitalizeWords(participante.primer_apellido)}{" "}
              {capitalizeWords(participante.segundo_apellido)}
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
          cambiarEstadoParticipante({
            numero_documento: participante.numero_documento,
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
            dispatch(
              listarParticipantes({
                search: searchText,
                genero: filtroGenero,
                nivel_estudio_superior: filtroNivelEstudio,
                estado: filtroEstado,
                limit: pageSize,
                page: currentPage,
              }),
            );
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

  const activarParticipante = (participante) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de activar este participante?
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
              {participante.numero_documento}
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
              {capitalizeWords(participante.primer_nombre)}{" "}
              {capitalizeWords(participante.segundo_nombre)}{" "}
              {capitalizeWords(participante.primer_apellido)}{" "}
              {capitalizeWords(participante.segundo_apellido)}
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
          cambiarEstadoParticipante({
            numero_documento: participante.numero_documento,
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
            dispatch(
              listarParticipantes({
                search: searchText,
                genero: filtroGenero,
                nivel_estudio_superior: filtroNivelEstudio,
                estado: filtroEstado,
                limit: pageSize,
                page: currentPage,
              }),
            );
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
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
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {text || "-"}
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => {
        const estado = record.roles[0].UsuarioRol.estado_rol;

        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Ver detalles">
              <button
                className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                onClick={() =>
                  navigate(`${record.id_usuario}/informacion-participante`)
                }
              >
                <Eye className="text-blue-600" size={18} />
              </button>
            </Tooltip>

            <Tooltip
              title={
                estado === "inactivo"
                  ? "No se puede editar un participante inactivo"
                  : "Editar participante"
              }
            >
              <button
                disabled={estado === "inactivo"}
                onClick={() => {
                  if (estado === "inactivo") return;
                  setAbrirModal(true);
                  setParticipanteSeleccionado(record);
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
                  onClick={() => inactivarParticipante(record)}
                >
                  <Ban className="text-red-600" size={18} />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Activar">
                <button
                  className="p-2! rounded-lg bg-green-50 hover:bg-green-100 transition"
                  onClick={() => activarParticipante(record)}
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

  return (
    <div className="p-1! w-full">
      <div className="flex flex-wrap items-center gap-2! mb-2!">
        <div className="flex! items-center!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md!"
            size={40}
          />
          <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
            Lista de Participantes
          </span>
        </div>
        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Todos los Participantes de PAMCE UFPS
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
                { label: "20", value: 20 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
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
              <span className="-ml-0.5!">Estado:</span>
            </div>
            <Select
              className="w-24! font-inter"
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
              className="text-white hover:text-red-300 transition text-xl"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
        <button
          onClick={() => setAbrirModal(true)}
          className="-mt-3! bg-white border-2 border-red-600 text-red-600 rounded-xl py-3! flex items-center justify-center font-poppins text-md shadow-md hover:bg-red-600 hover:text-white transition w-full md:w-54! gap-1"
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Participante
        </button>
      </div>
      <div className="grid! grid-cols-1! gap-5! w-full! mt-4!">
        <>
          <div className="w-full overflow-x-auto">
            {loading ? (
              <LoadingInformacion />
            ) : (
              <ConfigProvider locale={es}>
                <Table
                  dataSource={participantes}
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
        <ParticipanteFormulario
          visible={abrirModal}
          onClose={() => {
            setEditarModal(false);
            setParticipanteSeleccionado(null);
            setAbrirModal(false);
          }}
          isEditMode={editarModal}
          initialValues={participanteSeleccionado}
        />
      </div>
    </div>
  );
}

export default ListaParticipantes;
