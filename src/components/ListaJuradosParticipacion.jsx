import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Tooltip,
  ConfigProvider,
  Pagination,
  Select,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import imagen_no_data from "../images/imagen_no_data.jpg";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { listarJuradosParticipacion } from "../features/participacion/participacion.slice";
import { Eye, Ban, CheckCircle } from "lucide-react";
import { IoMdAddCircle } from "react-icons/io";
import { PiGavelFill } from "react-icons/pi";
import { listarJuradosDisponiblesParaAsignar } from "../features/jurados/jurado.slice";
import { toast } from "react-toastify";
import { agregarJuradoAParticipacion } from "../features/participacion/participacion.slice";
import { cambiarEstadoAsignacionJurado } from "../features/participacion/participacion.slice";
import { FileText } from "lucide-react";
import { FaUser } from "react-icons/fa";
import ModalEvaluacionParticipacion from "@/components/ModalEvaluacionParticipacion";

function ListaJuradosParticipacion({
  id_participacion,
  id_edicion_categoria,
  id_edicion,
}) {
  const dispatch = useDispatch();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const jurados = useSelector(
    (state) => state.participacion.jurados_participacion,
  );
  const jurados_activos = useSelector((state) => state.jurados.jurados);
  const pagination = useSelector(
    (state) => state.participacion.pagination_jurados_participacion,
  );
  const loading = useSelector(
    (state) => state.jurados.loading_jurados_categoria,
  );
  const [searchText, setSearchText] = useState("");
  const [searchJurado, setSearchJurado] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("TODOS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [abrirModal, setAbrirModal] = useState(false);
  const [loadingAgregar, setLoadingAgregar] = useState(false);
  const [juradoCargandoId, setJuradoCargandoId] = useState(null);
  const [abrirModalEvaluacion, setAbrirModalEvaluacion] = useState(false);
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

  useEffect(() => {
    if (!id_edicion) return;
    dispatch(
      listarJuradosDisponiblesParaAsignar({
        id_edicion: id_edicion,
        params: {
          search: searchJurado,
        },
      }),
    );
  }, [searchJurado, dispatch, id_edicion]);

  const columns = [
    {
      title: "Documento",
      key: "numero_documento",
      align: "center",
      sorter: (a, b) =>
        a.jurado?.numero_documento.localeCompare(b.jurado?.numero_documento),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 justify-center">
          {record.jurado.tipo_documento} {record.jurado.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombres",
      key: "nombres",
      sorter: (a, b) => {
        const nombreA = `${a.jurado?.primer_nombre} ${
          a.jurado?.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.jurado?.primer_nombre} ${
          b.jurado?.segundo_nombre || ""
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
        const apellidoA = `${a.jurado?.primer_apellido} ${
          a.jurado?.segundo_apellido || ""
        }`.toLowerCase();
        const apellidoB = `${b.jurado?.primer_apellido} ${
          b.jurado?.segundo_apellido || ""
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
        (a.jurado?.correo_electronico || "").localeCompare(
          b.jurado?.correo_electronico || "",
        ),
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
        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
              record.estado === "asignado"
                ? "bg-green-600"
                : record.estado === "evaluado"
                  ? "bg-blue-600"
                  : "bg-gray-600"
            }`}
          >
            {record.estado === "no_evaluado"
              ? capitalizeFirstLetter("No Evaluado")
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
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Ver detalles de la evaluación">
              <button
                className={`p-2! rounded-lg  transition ${
                  record.estado !== "evaluado"
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-blue-50 hover:bg-blue-100"
                }`}
                disabled={record.estado !== "evaluado"}
                onClick={() => {
                  setAbrirModalEvaluacion(true);
                  setEvaluacionSeleccionada(record.id_participacion_jurado);
                }}
                style={{
                  cursor:
                    record.estado !== "evaluado" ? "not-allowed" : "pointer",
                }}
              >
                <Eye
                  className={
                    record.estado !== "evaluado"
                      ? "text-gray-400"
                      : "text-blue-600"
                  }
                  size={18}
                />
              </button>
            </Tooltip>

            {record.estado === "asignado" ? (
              <Tooltip title="Retirar Jurado">
                <button
                  className={`p-2! rounded-lg  transition ${
                    edicion?.fecha_inicio_evaluacion &&
                    hoy > edicion?.fecha_inicio_evaluacion
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                  onClick={() => cambiarEstadoJurado(record, "retirado")}
                  disabled={
                    edicion?.fecha_inicio_evaluacion &&
                    hoy > edicion?.fecha_inicio_evaluacion
                  }
                >
                  <Ban
                    className={
                      edicion?.fecha_inicio_evaluacion &&
                      hoy > edicion?.fecha_inicio_evaluacion
                        ? "text-gray-400"
                        : "text-red-600"
                    }
                    size={18}
                  />
                </button>
              </Tooltip>
            ) : record.estado === "retirado" ? (
              <Tooltip title="Asignar de Nuevo">
                <button
                  className={`p-2! rounded-lg ransition ${
                    edicion?.fecha_inicio_evaluacion &&
                    hoy > edicion?.fecha_inicio_evaluacion
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-green-50 hover:bg-green-100"
                  }`}
                  onClick={() => cambiarEstadoJurado(record, "asignado")}
                >
                  <CheckCircle
                    className={
                      edicion?.fecha_inicio_evaluacion &&
                      hoy > edicion?.fecha_inicio_evaluacion
                        ? "text-gray-400"
                        : "text-green-600"
                    }
                    size={18}
                  />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Retirar Jurado">
                <button
                  className={`p-2! rounded-lg ransition ${
                    (edicion?.fecha_inicio_evaluacion &&
                      hoy > edicion?.fecha_inicio_evaluacion) ||
                    record.estado === "evaluado"
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-green-50 hover:bg-green-100"
                  }`}
                  onClick={() => cambiarEstadoJurado(record, "retirado")}
                  disabled={record.estado === "evaluado"}
                >
                  <Ban
                    className={
                      (edicion?.fecha_inicio_evaluacion &&
                        hoy > edicion?.fecha_inicio_evaluacion) ||
                      record.estado === "evaluado"
                        ? "text-gray-400"
                        : "text-red-600"
                    }
                    size={18}
                  />
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const hoy = new Date().toLocaleDateString("en-CA");

  const agregarJurado = async (id_jurado) => {
    try {
      setLoadingAgregar(true);
      setJuradoCargandoId(id_jurado);

      await dispatch(
        agregarJuradoAParticipacion({
          id: id_participacion,
          id_jurado,
        }),
      )
        .unwrap()
        .then((res) => {
          toast.success(res.message);
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
        });
    } catch (error) {
      toast.error(error?.message || "Error al asignar jurado");
    } finally {
      setLoadingAgregar(false);
      setJuradoCargandoId(null);
    }
  };

  const cambiarEstadoJurado = (record, nuevoEstado) => {
    Modal.confirm({
      title: null,
      icon: null,
      width: 450,
      centered: true,
      className: "modal-cambiar-estado",
      content: (
        <div className="py-2!">
          <div className="flex items-center gap-3 mb-3!">
            <div
              className={`p-3! rounded-2xl ${nuevoEstado === "asignado" ? "bg-green-100" : "bg-red-100"}`}
            >
              {nuevoEstado === "asignado" ? (
                <CheckCircle className="text-green-600" size={28} />
              ) : (
                <Ban className="text-red-600" size={28} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 font-poppins m-0">
                {nuevoEstado === "asignado"
                  ? "Reactivar Jurado"
                  : "Retirar Jurado"}
              </h3>
              <p className="text-xs text-gray-500 font-inter">
                Confirma la acción para este jurado
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4! border border-gray-100 mb-5!">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-white p-1.5! rounded-lg border border-gray-100">
                  <FaUser className="text-red-500" size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Nombre Completo
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {[
                      record?.jurado?.primer_nombre,
                      record?.jurado?.segundo_nombre,
                      record?.jurado?.primer_apellido,
                      record?.jurado?.segundo_apellido,
                    ]
                      .filter(Boolean)
                      .map((nombre) => capitalizeFirstLetter(nombre))
                      .join(" ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-white p-1.5! rounded-lg border border-gray-100">
                  <FileText className="text-red-500" size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Identificación
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {record?.jurado?.tipo_documento}{" "}
                    {record?.jurado?.numero_documento}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-inter leading-relaxed px-1! text-justify">
            ¿Estás seguro de que desea cambiar el estado a{" "}
            <span
              className={`font-bold uppercase ${nuevoEstado === "asignado" ? "text-green-600" : "text-red-600"}`}
            >
              {nuevoEstado}
            </span>
            ?
            {nuevoEstado === "asignado"
              ? " El jurado podrá evaluar nuevamente esta participación."
              : " Esta acción inhabilitará al jurado para calificar este registro."}
          </p>
        </div>
      ),
      okText: nuevoEstado === "asignado" ? "Sí, Reasignar" : "Sí, Retirar",
      okButtonProps: {
        className: `${nuevoEstado === "asignado" ? "bg-green-600! hover:bg-green-700!" : "bg-red-600! hover:bg-red-700!"} 
                    border-none rounded-xl h-10 font-bold px-6! shadow-md transition-all`,
      },
      cancelText: "Cancelar",
      cancelButtonProps: {
        className:
          "rounded-xl h-10 font-medium hover:text-gray-700 border-gray-200",
      },
      onOk() {
        return dispatch(
          cambiarEstadoAsignacionJurado({
            id_participacion_jurado: record.id_participacion_jurado,
            estado: nuevoEstado,
          }),
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message);
          })
          .catch((error) => {
            toast.error(error.message || "Error al actualizar estado");
          });
      },
    });
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
        <button
          onClick={() => setAbrirModal(true)}
          disabled={
            edicion?.fecha_inicio_evaluacion &&
            hoy > edicion?.fecha_inicio_evaluacion
          }
          className={`bg-white border-2 rounded-xl! py-3! flex! items-center! justify-center! gap-1! font-poppins text-md! shadow-md transition w-full md:w-45! -mt-3.5!
                    ${
                      edicion?.fecha_inicio_evaluacion &&
                      hoy > edicion?.fecha_inicio_evaluacion
                        ? "border-gray-400 text-gray-400 cursor-not-allowed"
                        : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    }
                    `}
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Jurado
        </button>
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
      <Modal
        open={abrirModal}
        onCancel={() => {
          setAbrirModal(false);
          setSearchJurado("");
        }}
        footer={null}
        width={700}
        centered
        title={
          <div>
            <div className="flex items-center gap-2 text-red-600 font-poppins  mb-2!">
              <PiGavelFill />
              Agregar Jurado a la Participación
            </div>
            <p className="text-[11px] text-gray-400 font-normal">
              Busca y selecciona un jurado para esta participación
            </p>
          </div>
        }
      >
        <Input
          placeholder="Buscar por nombre o número de documento..."
          value={searchJurado}
          onChange={(e) => setSearchJurado(e.target.value)}
          prefix={<IoSearchCircle className="text-red-500 text-xl" />}
          className="mb-4! rounded-xl"
        />

        <div className="max-h-[400px] overflow-y-auto space-y-3! pr-2!">
          {jurados_activos.map((jurado) => {
            const yaAsignado = jurados?.some(
              (j) => j.jurado.id_usuario === jurado.id_usuario,
            );

            return (
              <div
                key={jurado.id_usuario}
                className={`flex items-center justify-between p-3! rounded-xl border transition ${
                  yaAsignado
                    ? "bg-gray-100 border-gray-200 opacity-60"
                    : "bg-white border-gray-200 hover:border-red-400 hover:bg-red-50"
                }`}
              >
                <div>
                  <p className="font-semibold font-inter text-sm">
                    {[
                      jurado.primer_nombre,
                      jurado.segundo_nombre,
                      jurado.primer_apellido,
                      jurado.segundo_apellido,
                    ]
                      .filter(Boolean)
                      .map((nombre) => capitalizeFirstLetter(nombre))
                      .join(" ")}
                  </p>
                  <p className="text-xs text-gray-500">
                    CC {jurado.numero_documento} · {jurado.correo_electronico}
                  </p>
                </div>

                <button
                  disabled={
                    yaAsignado ||
                    (loadingAgregar && juradoCargandoId === jurado.id_usuario)
                  }
                  onClick={() => agregarJurado(jurado.id_usuario)}
                  className={`px-4! py-2! rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                    yaAsignado
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : loadingAgregar && juradoCargandoId === jurado.id_usuario
                        ? "bg-red-500 text-white cursor-wait"
                        : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {loadingAgregar && juradoCargandoId === jurado.id_usuario ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Agregando...
                    </>
                  ) : yaAsignado ? (
                    "Asignado"
                  ) : (
                    "Agregar"
                  )}
                </button>
              </div>
            );
          })}

          {jurados_activos.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No se encontraron jurados
            </div>
          )}
        </div>
      </Modal>
      <ModalEvaluacionParticipacion
        abrirModal={abrirModalEvaluacion}
        setAbrirModal={setAbrirModalEvaluacion}
        id_edicion_categoria={id_edicion_categoria}
        id_participacion_jurado={evaluacionSeleccionada}
      />
    </>
  );
}

export default ListaJuradosParticipacion;
