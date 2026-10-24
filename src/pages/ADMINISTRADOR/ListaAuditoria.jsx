import { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
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
import { listarRegistrosAuditoria } from "../../features/auditoria/auditoria.slice";
import { Eye } from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import es from "dayjs/locale/es";
import LoadingInformacion from "@/components/LoadingInformacion";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ModalInformacionRegistroAuditoria from "../../components/ModalInformacionRegistroAuditoria";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(customParseFormat);

function ListaJurados() {
  const dispatch = useDispatch();
  const registros = useSelector((state) => state.auditoria.registros);
  const pagination = useSelector(
    (state) => state.auditoria.pagination_registros,
  );
  const loading = useSelector((state) => state.auditoria.loading_registros);

  const [filtroEvento, setFiltroEvento] = useState("TODOS");
  const [filtroUsuario, setFiltroUsuario] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [abrirModal, setAbrirModal] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    document.title = "PAMCE | Auditoría";
    dispatch(
      listarRegistrosAuditoria({
        params: {
          search: searchText,
          evento: filtroEvento,
          usuario: filtroUsuario,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-auditoria",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [
    searchText,
    filtroEvento,
    filtroUsuario,
    pageSize,
    currentPage,
    dispatch,
  ]);

  const eventos = {
    POST: {
      texto: "Creación",
      clases: "bg-green-100 text-green-700",
    },
    INSERT: {
      texto: "Inserción",
      clases: "bg-emerald-100 text-emerald-700",
    },
    PUT: {
      texto: "Actualización",
      clases: "bg-blue-100 text-blue-700",
    },
    UPDATE: {
      texto: "Actualización",
      clases: "bg-blue-100 text-blue-700",
    },
    DELETE: {
      texto: "Eliminación",
      clases: "bg-red-100 text-red-700",
    },
    ACTIVATE: {
      texto: "Activación",
      clases: "bg-lime-100 text-lime-700",
    },
    INACTIVE: {
      texto: "Inactivación",
      clases: "bg-orange-100 text-orange-700",
    },
    CHANGE_STATE: {
      texto: "Cambio de estado",
      clases: "bg-purple-100 text-purple-700",
    },
  };

  const columns = [
    {
      title: "Usuario",
      key: "usuario",
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
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeWords(record.usuario.primer_nombre)}{" "}
          {capitalizeWords(record.usuario.segundo_nombre)}{" "}
          {capitalizeWords(record.usuario.primer_apellido)}{" "}
          {capitalizeWords(record.usuario.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Evento",
      key: "evento",
      sorter: (a, b) => a.evento.localeCompare(b.evento),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (_, record) => {
        const evento = eventos[record.evento] || {
          texto: record.evento,
          clases: "bg-gray-100 text-gray-700",
        };

        return (
          <div className="flex justify-center">
            <span
              className={`px-3! py-1! rounded-full text-xs font-semibold ${evento.clases}`}
            >
              {evento.texto}
            </span>
          </div>
        );
      },
    },
    {
      title: "Fecha Evento",
      key: "fecha_evento",
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm text-center!",
      }),
      render: (_, record) => {
        return (
          <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
            {dayjs(record.fecha)
              .tz("America/Bogota")
              .format("DD/MM/YYYY hh:mm:ss A")}
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
                onClick={() => {
                  setAbrirModal(true);
                  setRegistroSeleccionado(record);
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
            Actividad
          </span>
        </div>
        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Registros de Actividad de PAMCE UFPS
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
              placeholder="Buscar por número de documento o nombre de usuario..."
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
              <span>Evento:</span>
            </div>
            <Select
              className="w-full sm:w-32 font-inter"
              value={filtroEvento}
              onChange={(v) => {
                setFiltroEvento(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "POST", label: "Creación" },
                { value: "PUT", label: "Actualización" },
                { value: "DELETE", label: "Eliminación" },
                { value: "ACTIVATE", label: "Activación" },
                { value: "INACTIVE", label: "Inactivación" },
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setFiltroEvento("TODOS");
                setFiltroUsuario("TODOS");
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
              <ConfigProvider locale={es}>
                <Table
                  dataSource={registros}
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
      </div>
      <ModalInformacionRegistroAuditoria
        abrirModal={abrirModal}
        setAbrirModal={setAbrirModal}
        id_registro={registroSeleccionado?.id}
      />
    </div>
  );
}

export default ListaJurados;
