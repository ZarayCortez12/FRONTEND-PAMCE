import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Tooltip,
  ConfigProvider,
  Pagination,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import imagen_no_data from "../images/imagen_no_data.jpg";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { listarJuradosParticipacion } from "../features/participacion/participacion.slice";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
import { agregarJuradoAParticipacion } from "../features/participacion/participacion.slice";
import ModalEvaluacionParticipacion from "@/components/ModalEvaluacionParticipacion";

function ListaJuradosParticipacionEvaluacion({
  id_edicion_categoria,
  id_participacion,
}) {
  const dispatch = useDispatch();
  const jurados = useSelector(
    (state) => state.participacion.jurados_participacion,
  );
  const pagination = useSelector(
    (state) => state.participacion.pagination_jurados_participacion,
  );
  const loading = useSelector(
    (state) => state.jurados.loading_jurados_categoria,
  );
  const [searchText, setSearchText] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [abrirModal, setAbrirModal] = useState(false);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);

  useEffect(() => {
    if (!id_participacion) return;
    dispatch(
      listarJuradosParticipacion({
        id_participacion: id_participacion,
        params: {
          search: searchText,
          genero: filtroGenero,
          estado: filtroEstado,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    searchText,
    currentPage,
    pageSize,
    filtroEstado,
    filtroGenero,
    id_participacion,
    dispatch,
  ]);

  const columns = [
    {
      title: "Documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) => a.numero_documento.localeCompare(b.numero_documento),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-xs text-gray-700 justify-center">
          {record.jurado.tipo_documento} {record.jurado.numero_documento}
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
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="flex items-center text-center font-inter text-sm text-gray-700 justify-center">
          {capitalizeFirstLetter(record.jurado.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.jurado.segundo_nombre)}
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
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.jurado.primer_apellido)}{" "}
          {capitalizeFirstLetter(record.jurado.segundo_apellido)}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: ["jurado", "correo_electronico"],
      key: "email",
      sorter: (a, b) =>
        (a.correo_electronico || "").localeCompare(b.correo_electronico || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {text}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => {
        const estilosEstado = {
          asignado: "bg-blue-600",
          evaluado: "bg-green-600",
          no_evaluado: "bg-red-600",
        };

        const colorEstado = estilosEstado[record.estado] || "bg-gray-600";

        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center min-w-24 ${colorEstado}`}
          >
            {capitalizeFirstLetter(record.estado?.replace("_", " ")) || "-"}
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
        const deshabilitado = record.estado !== "evaluado";

        return (
          <div className="flex items-center justify-center">
            <Tooltip
              title={
                deshabilitado
                  ? "La evaluación aún no está disponible"
                  : "Ver detalles de la evaluación"
              }
            >
              <button
                onClick={() => {
                  if (deshabilitado) return;

                  setAbrirModal(true);
                  setEvaluacionSeleccionada(record.id_participacion_jurado);
                }}
                disabled={deshabilitado}
                className={`flex items-center gap-1
            px-3! py-2!
            rounded-lg
            text-xs font-bold font-poppins
            transition-all duration-200
            ${
              deshabilitado
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
            }
          `}
              >
                <Eye size={15} />
                <span className="font-poppins text-xs">Visualizar</span>
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

  const agregarJurado = async (id_jurado) => {
    try {
      setLoadingAgregar(true);
      setJuradoCargandoId(id_jurado);

      await dispatch(
        agregarJuradoAParticipacion({
          id: id_participacion,
          id_jurado,
        }),
      ).unwrap();

      toast.success("Jurado asignado correctamente");
    } catch (error) {
      toast.error(error?.message || "Error al asignar jurado");
    } finally {
      setLoadingAgregar(false);
      setJuradoCargandoId(null);
    }
  };

  return (
    <>
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
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
            />
          </Tooltip>
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por número de documento..."
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
              onChange={(value) => {
                setFiltroGenero(value);
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
              <span>Estado:</span>
            </div>
            <Select
              className="w-full sm:w-32 font-inter"
              value={filtroEstado}
              onChange={(v) => {
                setFiltroEstado(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "asignado", label: "Asignado" },
                { value: "retirado", label: "Retirado" },
                { value: "evaluado", label: "Evaluado" },
                { value: "no_evaluado", label: "No Evaluado" },
              ]}
            />
          </div>
          <Tooltip title="Limpiar filtros">
            <button
              onClick={() => {
                setSearchText("");
                setFiltroGenero("TODOS");
                setFiltroEstado("TODOS");
                setCurrentPage(1);
              }}
              className="text-white hover:text-red-300 transition text-xl"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        {loading ? (
          <LoadingInformacion />
        ) : (
          <ConfigProvider locale={esES}>
            <Table
              dataSource={jurados}
              columns={columns}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: <EmptyTable />,
              }}
            />
          </ConfigProvider>
        )}
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
      </div>
      <ModalEvaluacionParticipacion
        abrirModal={abrirModal}
        setAbrirModal={setAbrirModal}
        id_edicion_categoria={id_edicion_categoria}
        id_participacion_jurado={evaluacionSeleccionada}
      />
    </>
  );
}

export default ListaJuradosParticipacionEvaluacion;
