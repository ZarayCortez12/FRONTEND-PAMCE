import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Form, Table, Tooltip, Card, Dropdown, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  obtenerParticipacion,
  cambiarEstadoParticipacion,
  actualizarComentarios,
} from "../../features/participacion/participacion.slice";
import { ChevronDown, Eye } from "lucide-react";
import {
  FaUser,
  FaCommentDots,
  FaStream,
  FaFolderOpen,
  FaClipboardList,
} from "react-icons/fa";
import { Tabs, Timeline } from "antd";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import dayjs from "dayjs";
import { motion, resize } from "framer-motion";
import {
  listarRequisitosEdicion,
  listarRequisitosPorCategoriaEdicion,
} from "../../features/requisitos/requisitos.slice";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import ParticipacionService from "../../features/participacion/participacion.service";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  CircleCheck,
  FileText,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from "lucide-react";
import { LuLayoutPanelLeft } from "react-icons/lu";
import LoadingData from "@/components/LoadingData";

const TimelinePostulacion = React.memo(({ participacion }) => {
  const items = [];

  if (participacion?.usuario?.fecha_registro) {
    items.push({
      fecha: participacion.usuario.fecha_registro,
      titulo: "Registro",
      descripcion: "El participante se registró en la plataforma",
      icon: <FaUser />,
    });
  }

  if (participacion?.fecha_postulacion) {
    items.push({
      fecha: participacion.fecha_postulacion,
      titulo: "Postulación",
      descripcion: "El participante se postuló a la edición",
      icon: <FaClipboardList />,
    });
  }

  if (participacion?.fecha_revision) {
    items.push({
      fecha: participacion.fecha_revision,
      titulo:
        participacion.estado === "aceptada" ||
        participacion.estado === "evaluada"
          ? "Postulación aprobada"
          : "Postulación rechazada",
      descripcion:
        participacion.estado === "aceptada" ||
        participacion.estado === "evaluada"
          ? "La postulación fue aprobada"
          : "La postulación fue rechazada",
      icon:
        participacion.estado === "aceptada" ||
        participacion.estado === "evaluada" ? (
          <CircleCheck />
        ) : (
          <AlertCircle />
        ),
    });
  }

  items.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <Timeline className="mt-8!">
      {items.map((item, index) => (
        <Timeline.Item
          key={index}
          dot={
            <span className="w-6 h-6 flex items-center justify-center bg-red-100 rounded-full text-red-600">
              {item.icon}
            </span>
          }
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <span className="text-xs text-gray-400">
              {dayjs(item.fecha).format("DD/MM/YYYY")}
            </span>

            <div className="font-semibold text-sm text-gray-800">
              {item.titulo}
            </div>

            <div className="text-xs text-gray-600">{item.descripcion}</div>
          </motion.div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
});

function InformacionPostulacionEdicion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const { id_participacion } = useParams();
  const postulacion = useSelector((state) => state.participacion.participacion);
  const loading_postulacion = useSelector(
    (state) => state.participacion.loadingParticipacion,
  );
  const error_postulacion = useSelector(
    (state) => state.participacion.errorParticipacion,
  );
  const requisitos_categoria = useSelector(
    (state) => state.requisitos.requisitos_categoria,
  );
  const requisitos_edicion = useSelector(
    (state) => state.requisitos.requisitos_edicion,
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [respuestaPreview, setRespuestaPreview] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [modalRechazoOpen, setModalRechazoOpen] = useState(false);
  const [observacionRechazo, setObservacionRechazo] = useState("");
  const [loadingCambioEstado, setLoadingCambioEstado] = useState(false);
  const [modalAceptarOpen, setModalAceptarOpen] = useState(false);
  const [checkSeguridad, setCheckSeguridad] = useState(false);
  const [loadingObs, setLoadingObs] = useState(false);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [modalComentarioOpen, setModalComentarioOpen] = useState(false);

  useEffect(() => {
    document.title = "PAMCE | Información de la Postulación";

    if (!edicion?.id_edicion || !id_participacion) return;

    dispatch(obtenerParticipacion(id_participacion))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "postulacion-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        dispatch(listarRequisitosEdicion({ id_edicion: edicion.id_edicion }));
        dispatch(
          listarRequisitosPorCategoriaEdicion({
            id_edicion_categoria:
              res?.participacion?.edicionCategoria?.id_edicion_categoria,
          }),
        );
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [edicion?.id_edicion, id_participacion, dispatch]);

  const requisitosCategoriaConRespuesta = React.useMemo(() => {
    const respuestas = Array.isArray(postulacion?.respuestas)
      ? postulacion.respuestas
      : [];

    if (!Array.isArray(requisitos_categoria) || respuestas.length === 0) {
      return [];
    }

    return requisitos_categoria.map((req) => {
      const respuesta = respuestas
        .filter((item) => item.id_requisito_edicion_categoria !== null)
        .find(
          (r) =>
            r.id_requisito_edicion_categoria ===
            req.id_requisito_edicion_categoria,
        );

      return {
        id_requisito_edicion_categoria: req.id_requisito_edicion_categoria,
        descripcion: capitalizeFirstLetter(req.Requisito.descripcion),
        tipo: capitalizeFirstLetter(req.tipo_requisito),
        fecha_envio: respuesta?.fecha_envio ?? "",
        obligatorio: req.obligatorio,
        estado_entrega: Boolean(respuesta),
        respuesta: respuesta ?? "No respondió",
      };
    });
  }, [requisitos_categoria, postulacion]);

  const requisitosEdicionConRespuesta = React.useMemo(() => {
    const respuestas = Array.isArray(postulacion?.respuestas)
      ? postulacion.respuestas
      : [];

    if (!Array.isArray(requisitos_edicion) || respuestas.length === 0) {
      return [];
    }

    return requisitos_edicion.map((req) => {
      const respuesta = respuestas
        .filter((item) => item.id_requisito_edicion !== null)
        .find((r) => r.id_requisito_edicion === req.id_requisito_edicion);

      return {
        id_requisito_edicion: req.id_requisito_edicion,
        descripcion: capitalizeFirstLetter(req.Requisito.descripcion),
        tipo: capitalizeFirstLetter(req.tipo_requisito),
        fecha_envio: respuesta?.fecha_envio ?? "",
        obligatorio: req.obligatorio,
        estado_entrega: Boolean(respuesta),
        respuesta: respuesta ?? "No respondió",
      };
    });
  }, [requisitos_edicion, postulacion]);

  const abrirVistaPrevia = async (record) => {
    if (!record?.respuesta || record.respuesta === "No respondió") {
      toast.info("Este requisito no tiene respuesta");
      return;
    }

    setRespuestaPreview(record);
    setPdfUrl(null);
    setModalPreviewOpen(true);

    if (record.respuesta.tipo_respuesta === "documento") {
      try {
        const blob = await ParticipacionService.mostrarDocumentoBlob(
          record.respuesta.id_participacion_requisito,
        );
        const ext = record.respuesta.extension_archivo.toLowerCase();
        let type = "application/octet-stream";

        if (ext === ".pdf") type = "application/pdf";
        else if (ext === ".doc") type = "application/msword";
        else if (ext === ".docx")
          type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (ext === ".xls") type = "application/vnd.ms-excel";
        else if (ext === ".xlsx")
          type =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if (ext === ".jpg" || ext === ".jpeg") type = "image/jpeg";
        else if (ext === ".png") type = "image/png";

        const url = URL.createObjectURL(new Blob([blob], { type }));
        setPdfUrl(url);
      } catch (error) {
        toast.error("Error al cargar el archivo");
      }
    }
  };

  const columnsRequisitos = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (record) => (
        <span
          style={{ fontFamily: "Inter", fontWeight: 250, fontSize: "13px" }}
          className="flex text-justify"
        >
          {record}
        </span>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (record) => (
        <span
          style={{ fontFamily: "Inter", fontWeight: 250, fontSize: "13px" }}
        >
          {record}
        </span>
      ),
    },
    {
      title: "Fecha de Entrega",
      dataIndex: "fecha_envio",
      key: "fecha_envio",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (value) => {
        if (!value) {
          return (
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 250,
                fontSize: "13px",
              }}
              className="flex justify-center"
            >
              -
            </span>
          );
        }

        const fecha = dayjs(value);

        return (
          <span
            style={{
              fontFamily: "Inter",
              fontWeight: 250,
              fontSize: "13px",
            }}
            className="flex justify-center"
          >
            {fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-"}
          </span>
        );
      },
    },

    {
      title: "¿Obligatorio?",
      dataIndex: "obligatorio",
      key: "obligatorio",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (value) => {
        const isObligatorio =
          value === true || value === 1 || value === "1" || value === "true";
        const estilosBadge = {
          display: "inline-block",
          borderRadius: "40px",
          fontWeight: "600",
          fontSize: "14px",
          padding: "6px 30px",
          color: "#fff",
          backgroundColor: isObligatorio ? "#09C823" : "#e10318",
          border: `1px solid ${isObligatorio ? "#badbcc" : "#f5c2c7"}`,
        };
        return (
          <div style={{ textAlign: "center" }}>
            <span style={estilosBadge}>{isObligatorio ? "Sí" : "No"}</span>
          </div>
        );
      },
    },
    {
      title: "¿Entregado?",
      dataIndex: "estado_entrega",
      key: "estado_entrega",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (value) => {
        const isEntregado =
          value === true || value === 1 || value === "1" || value === "true";
        const estilosBadge = {
          display: "inline-block",
          borderRadius: "40px",
          fontWeight: "600",
          fontSize: "14px",
          padding: "6px 30px",
          color: "#fff",
          backgroundColor: isEntregado ? "#09C823" : "#e10318",
          border: `1px solid ${isEntregado ? "#badbcc" : "#f5c2c7"}`,
        };
        return (
          <div style={{ textAlign: "center" }}>
            <span style={estilosBadge}>{isEntregado ? "Sí" : "No"}</span>
          </div>
        );
      },
    },
    {
      title: "Acción",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
      }),
      render: (_, record) => {
        const noRespondio = record.respuesta === "No respondió";

        const boton = (
          <button
            className={`flex items-center gap-1 px-3! py-2! rounded-lg text-xs font-bold font-poppins transition-all duration-200
        ${
          noRespondio
            ? "bg-gray-100 text-gray-600 cursor-not-allowed"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
        }`}
            disabled={noRespondio}
            onClick={() => abrirVistaPrevia(record)}
          >
            <Eye size={14} />
            Visualizar
          </button>
        );

        return noRespondio ? (
          boton
        ) : (
          <Tooltip title="Vista previa del requisito">{boton}</Tooltip>
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

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={14} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosParticipante = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4  gap-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Documento"
          valor={
            postulacion?.usuario?.numero_documento
              ? `CC ${postulacion.usuario.numero_documento}`
              : "-"
          }
        />

        <Campo
          label="Categoría"
          valor={
            capitalizeFirstLetter(
              postulacion?.edicionCategoria?.categoria?.nombre_categoria,
            ) || "-"
          }
        />

        <Campo
          label="Nombres"
          valor={[
            capitalizeFirstLetter(postulacion?.usuario?.primer_nombre),
            capitalizeFirstLetter(postulacion?.usuario?.segundo_nombre),
          ].join(" ")}
        />

        <Campo
          label="Apellidos"
          valor={[
            capitalizeFirstLetter(postulacion?.usuario?.primer_apellido),
            capitalizeFirstLetter(postulacion?.usuario?.segundo_apellido),
          ].join(" ")}
        />

        <Campo
          label="Código Institucional"
          valor={postulacion?.usuario?.codigo_institucional || "No Aplica"}
        />

        <Campo
          label="Nivel Educativo"
          valor={
            capitalizeFirstLetter(
              postulacion?.usuario?.nivel_estudio_superior,
            ) || "No Aplica"
          }
        />

        <Campo label="Teléfono" valor={postulacion?.usuario?.telefono || "-"} />

        <Campo
          label="Género"
          valor={capitalizeFirstLetter(postulacion?.usuario?.genero)}
        />

        <Campo
          label="Dirección"
          valor={postulacion?.usuario?.direccion || "-"}
        />

        <Campo
          label="Correo"
          valor={postulacion?.usuario?.correo_electronico || "-"}
        />
      </div>

      <div className="hidden lg:flex justify-center">
        <img
          src={imagen_data_postulado}
          alt="Foto de usuario"
          className="h-60 object-contain"
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

  const VistaPreviaRespuesta = ({ respuesta, pdfUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
      sidebarTabs: (defaultTabs) => [],
      renderToolbar: (Toolbar) => (
        <Toolbar>
          {(slots) => {
            const {
              CurrentPageInput,
              GoToNextPage,
              GoToPreviousPage,
              NumberOfPages,
              Zoom,
              ZoomIn,
              ZoomOut,
              EnterFullScreen,
              Print,
            } = slots;
            return (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <GoToPreviousPage />
                  <CurrentPageInput />
                  <span className="mx-2">/</span>
                  <NumberOfPages />
                  <GoToNextPage />
                </div>
                <div className="flex items-center">
                  <ZoomOut />
                  <Zoom />
                  <ZoomIn />
                </div>
                <div className="flex items-center">
                  <EnterFullScreen />
                  <Print />
                </div>
              </div>
            );
          }}
        </Toolbar>
      ),
    });

    if (!respuesta) return null;

    if (respuesta.tipo_respuesta === "texto") {
      return (
        <div className="p-6! bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-xs! font-bold text-gray-400 uppercase mb-2!">
            Respuesta escrita:
          </h4>
          <div className="text-gray-800 font-inter whitespace-pre-wrap">
            {respuesta.valor_texto}
          </div>
        </div>
      );
    }

    if (respuesta.tipo_respuesta === "documento") {
      const ext = respuesta.extension_archivo.toLowerCase();
      const esPdf = ext === ".pdf";
      const esImagen = [".jpg", ".jpeg", ".png"].includes(ext);
      const esOffice = [".doc", ".docx", ".xls", ".xlsx"].includes(ext);

      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between bg-gray-50 p-3! mb-4! rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2! bg-white rounded">
                {esPdf && <FileText className="text-red-500" size={20} />}
                {esImagen && <Eye className="text-blue-500" size={20} />}
                {esOffice && ext.includes("xl") ? (
                  <FileSpreadsheet className="text-green-600" size={20} />
                ) : (
                  esOffice && <FileText className="text-blue-600" size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {respuesta.nombre_archivo}
                </p>
                <p className="text-[10px] text-gray-500 uppercase mt-1">
                  {respuesta.extension_archivo} {respuesta.tamano_bytes / 1024}{" "}
                  KB
                </p>
              </div>
            </div>

            {esOffice && (
              <a
                href={pdfUrl}
                download={respuesta.nombre_archivo}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4! py-2! rounded-lg text-xs font-bold transition-all!"
              >
                <Download size={14} /> Descargar para Visualizar
              </a>
            )}
          </div>

          <div className="w-full min-h-[300px] max-h-[70vh] border-2 border-gray-100 rounded-xl overflow-auto bg-gray-50 flex justify-center items-center p-2!">
            {!pdfUrl ? (
              <div className="text-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-500 font-inter">
                  Cargando archivo...
                </p>
              </div>
            ) : esPdf ? (
              <div className="w-full h-[70vh] p-1!">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    theme="light"
                  />
                </Worker>
              </div>
            ) : esImagen ? (
              <img
                src={pdfUrl}
                alt="Preview"
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md transition-transform duration-300"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : esOffice ? (
              <div className="text-center p-10! flex flex-col items-center">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  {ext.includes("xl") ? (
                    <FileSpreadsheet size={40} />
                  ) : (
                    <FileText size={40} />
                  )}
                </div>
                <h3 className="text-lg! font-bold text-gray-800!">
                  Documento de Office
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6!">
                  Los archivos de Word y Excel no se pueden previsualizar
                  directamente en el navegador por seguridad. Por favor,
                  descárgalo.
                </p>
                <a
                  href={pdfUrl}
                  download={respuesta.nombre_archivo}
                  className="bg-gray-800 hover:bg-black text-white px-6! py-3! rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Download size={18} /> Descargar {ext.toUpperCase()}
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center p-10!">
                <AlertCircle className="text-orange-500 mb-2!" size={40} />
                <p className="text-gray-600">
                  Formato no compatible para vista previa
                </p>
                <a
                  href={pdfUrl}
                  download
                  className="text-blue-600 underline mt-2!"
                >
                  Descargar de todos modos
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const cerrarModal = () => {
    setPdfUrl(null);
    setModalPreviewOpen(false);
  };

  const DocumentosPostulacion = () => (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key)}
      className="
      font-inter
      text-red-400

      [&_.ant-tabs-tab]:text-gray-400
      [&_.ant-tabs-tab]:font-medium

      [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-red-400!
      [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-semibold

      [&_.ant-tabs-tab:hover_.ant-tabs-tab-btn]:text-red-400!

      [&_.ant-tabs-ink-bar]:bg-red-400!
      [&_.ant-tabs-ink-bar]:h-[3px]
    "
    >
      <Tabs.TabPane tab="Requisitos de la Edición" key="1">
        <Table
          columns={columnsRequisitos}
          dataSource={requisitosEdicionConRespuesta}
          pagination={false}
          locale={{ emptyText: <EmptyTable /> }}
        />
      </Tabs.TabPane>

      <Tabs.TabPane tab="Requisitos de la Categoría" key="2">
        <Table
          columns={columnsRequisitos}
          dataSource={requisitosCategoriaConRespuesta}
          pagination={false}
          locale={{ emptyText: <EmptyTable /> }}
        />
      </Tabs.TabPane>
    </Tabs>
  );

  const estadoStyles = {
    pendiente: "bg-blue-100 text-blue-700",
    aceptada: "bg-green-100 text-green-700",
    rechazada: "bg-red-100 text-red-700",
    evaluada: "bg-purple-100 text-purple-700",
  };

  const cambiarEstado = (estado) => {
    if (estado === "aceptada") {
      setCheckSeguridad(false);
      setModalAceptarOpen(true);
    }
    if (estado === "rechazada") {
      setModalRechazoOpen(true);
    }
  };

  const confirmarAceptacionFinal = async () => {
    if (!checkSeguridad) return;

    try {
      setLoadingCambioEstado(true);
      await dispatch(
        cambiarEstadoParticipacion({
          id: id_participacion,
          datos: { estado: "aceptada" },
        }),
      ).unwrap();
      toast.success("Postulación aceptada correctamente");
      setModalAceptarOpen(false);
    } catch (error) {
      toast.error("Error al procesar");
    } finally {
      setLoadingCambioEstado(false);
    }
  };

  const confirmarRechazo = async () => {
    if (!observacionRechazo.trim()) {
      toast.warning("La observación es obligatoria para rechazar", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoadingCambioEstado(true);

      const res = await dispatch(
        cambiarEstadoParticipacion({
          id: id_participacion,
          datos: {
            estado: "rechazada",
            observacion: observacionRechazo,
          },
        }),
      ).unwrap();

      toast.success(res.message || "Postulación rechazada");

      setModalRechazoOpen(false);
      setObservacionRechazo("");
    } catch (error) {
      toast.error(error?.message || "Error al rechazar la postulación");
    } finally {
      setLoadingCambioEstado(false);
    }
  };

  const handleGuardarNuevoComentario = async () => {
    if (!nuevoComentario.trim()) {
      toast.warning("El comentario no puede estar vacío");
      return;
    }
    const fecha = dayjs().format("DD/MM/YYYY");
    const comentarioFormateado = `[${fecha}]: ${nuevoComentario.trim()}`;

    const historialPrevio = postulacion?.comentarios || "";
    const nuevoHistorial = historialPrevio
      ? `${historialPrevio}\n\n${comentarioFormateado}`
      : comentarioFormateado;

    try {
      setLoadingObs(true);
      await dispatch(
        actualizarComentarios({
          id: id_participacion,
          datos: {
            comentarios: nuevoHistorial,
          },
        }),
      ).unwrap();

      toast.success("Comentario agregado al historial");
      setNuevoComentario("");
      setModalComentarioOpen(false);
    } catch (error) {
      toast.error("Error al actualizar comentarios");
    } finally {
      setLoadingObs(false);
    }
  };

  const renderizarComentarios = (comentariosRaw) => {
    if (!comentariosRaw) return null;

    const listaComentarios = comentariosRaw.split("\n\n");

    return listaComentarios.map((bloque, index) => {
      const regex = /^\[(.*?)\]:\s*(.*)/s;
      const match = bloque.match(regex);

      if (match) {
        const [_, fecha, texto] = match;
        return (
          <div
            key={index}
            className="mb-3! last:mb-0! border-l-2 border-red-400 pl-3! py-1! bg-gray-50/50 rounded-r-lg"
          >
            <div className="flex items-center gap-2 mb-1!">
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2! py-0.5! rounded-full border border-red-100">
                {fecha}
              </span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">{texto}</p>
          </div>
        );
      }

      return (
        <p key={index} className="text-[11px] mb-2 italic text-gray-500">
          {bloque}
        </p>
      );
    });
  };

  if (!edicion) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">
          Cargando Información...
        </span>
      </div>
    );
  }

  if (loading_postulacion) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (error_postulacion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg rounded-2xl text-center shadow-sm">
          <img
            src={imagen_no_data}
            alt="Error al consultar la postulación"
            className="mx-auto mb-4 h-40 object-contain"
          />

          <h2 className="font-montserrat text-xl font-semibold text-gray-800">
            No se pudo consultar la postulación
          </h2>

          <p className="mt-2! font-inter text-sm text-gray-500">
            {error_postulacion}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5! rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
          >
            Volver
          </button>
        </Card>
      </div>
    );
  }

  if (postulacion === undefined) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (postulacion === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Participación no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Postulación no encontrada
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-5! rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-1! w-full">
      <div className="flex! flex-col gap-2! md:flex-row! md:items-center! md:justify-between! mb-4!">
        <div className="flex! items-center! gap-2!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md"
            size={36}
          />
          <h1 className="font-montserrat text-lg! md:text-xl!">
            Información de la Postulación
          </h1>
        </div>

        <Dropdown
          disabled={postulacion?.estado !== "pendiente"}
          open={dropdownOpen}
          onOpenChange={(open) => setDropdownOpen(open)}
          menu={{
            items: [
              {
                key: "aceptada",
                label: "Aceptar Postulación",
                className: "text-green-600!",
              },
              {
                key: "rechazada",
                label: "Rechazar Postulación",
                className: "text-red-600!",
              },
            ],
            onClick: ({ key }) => {
              cambiarEstado(key);
              setDropdownOpen(false);
            },
          }}
        >
          <span
            className={`
              inline-flex items-center gap-1
              cursor-pointer px-4! py-1! rounded-full
              text-xs font-bold select-none
              transition-all duration-200
              hover:opacity-90
              ${estadoStyles[postulacion?.estado]}
            `}
          >
            {postulacion?.estado === "pendiente"
              ? "PENDIENTE POR REVISION"
              : postulacion?.estado.toUpperCase()}

            <ChevronDown
              size={14}
              className={`
                ml-1 opacity-80
                transition-transform duration-300
                ${dropdownOpen ? "rotate-180" : ""}
              `}
            />
          </span>
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={FaUser} titulo="Datos Personales" />
          <DatosParticipante />
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-1">
          <TituloCard
            icon={FaStream}
            titulo="Trayectoria"
            color="text-red-500"
          />
          <TimelinePostulacion participacion={postulacion} />
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <div className="flex flex-col gap-2 lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50">
            <TituloCard
              icon={FaCommentDots}
              titulo="Observación"
              color="text-red-500"
            />
            <p className="text-xs italic text-gray-700 -mt-2! -mb-2! text-justify">
              {capitalizeFirstLetter(postulacion?.observacion) ||
                "No hay una observación"}
            </p>
          </Card>
          <Card className="rounded-xl shadow-sm border border-blue-200 bg-blue-50">
            <TituloCard
              icon={LuLayoutPanelLeft}
              titulo="Panel de Revisión"
              color="text-red-600"
            />
            <div className="flex flex-col gap-3">
              <div className="bg-white border border-red-100 rounded-lg p-3! max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200">
                {postulacion?.comentarios ? (
                  <div className="font-inter">
                    {renderizarComentarios(postulacion?.comentarios)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4!">
                    <FaCommentDots className="text-gray-300 mb-2" size={20} />
                    <p className="text-[11px] text-gray-400 italic">
                      No hay instrucciones de corrección aún.
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setModalComentarioOpen(true)}
                disabled={postulacion?.estado !== "pendiente"}
                className="self-end bg-blue-600 hover:bg-blue-700 text-white p-1! rounded-md text-[11px] font-semibold transition-all disabled:bg-gray-400"
              >
                Agregar Corrección
              </button>
            </div>
          </Card>
        </div>
        <Card className="rounded-xl shadow-sm lg:col-span-4">
          <TituloCard
            icon={FaFolderOpen}
            titulo="Documentos de la Postulación"
          />
          <DocumentosPostulacion />
        </Card>
      </div>
      <Modal
        title="Vista Previa del Requisito"
        open={modalPreviewOpen}
        onCancel={cerrarModal}
        footer={null}
        width={1000}
        destroyOnClose
        centered
      >
        {respuestaPreview && (
          <VistaPreviaRespuesta
            respuesta={respuestaPreview.respuesta}
            pdfUrl={pdfUrl}
          />
        )}
      </Modal>
      <Modal
        open={modalRechazoOpen}
        onCancel={() => setModalRechazoOpen(false)}
        onOk={confirmarRechazo}
        okText="Rechazar Postulación"
        okButtonProps={{
          danger: true,
          loading: loadingCambioEstado,
          className: observacionRechazo ? "bg-red-600! hover:bg-red-700!" : "",
        }}
        cancelText="Cancelar"
        centered
      >
        <div className="flex items-center gap-2 mb-3!">
          <AlertCircle className="text-red-600" size={22} />
          <h2 className="text-lg font-semibold font-poppins">
            ¿Confirmar Rechazo?
          </h2>
        </div>
        <p className="text-sm font-inter text-gray-600 mb-4! text-justify">
          Una vez rechazada la postulación, el estado no podrá revertirse.
          Agregue una observación para aclarar el motivo del rechazo.
        </p>
        <textarea
          rows={4}
          maxLength={200}
          value={observacionRechazo}
          onChange={(e) => setObservacionRechazo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2! text-sm"
          style={{ resize: "none" }}
          placeholder="Ej: No cumple con los requisitos mínimos..."
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {observacionRechazo.length}/200 caracteres
        </div>
      </Modal>
      <Modal
        open={modalAceptarOpen}
        onCancel={() => setModalAceptarOpen(false)}
        onOk={confirmarAceptacionFinal}
        cancelText="Cancelar"
        okText="Aceptar Postulación"
        okButtonProps={{
          disabled: !checkSeguridad,
          loading: loadingCambioEstado,
          className: checkSeguridad ? "bg-green-600! hover:bg-green-700!" : "",
        }}
        centered
      >
        <div className="flex items-center gap-2 mb-3!">
          <AlertCircle className="text-red-600" size={22} />
          <h2 className="text-lg font-semibold font-poppins">
            ¿Confirmar Aceptación?
          </h2>
        </div>

        <p className="text-sm font-inter text-gray-600 mb-4! text-justify">
          Una vez aceptada, el estado no podrá revertirse y el participante
          pasará a la siguiente etapa.
        </p>

        <div className="bg-gray-100 p-4! rounded-lg flex items-start gap-3 border border-gray-200">
          <input
            type="checkbox"
            id="check-seguridad"
            className="mt-1! w-4 h-4 cursor-pointer"
            checked={checkSeguridad}
            onChange={(e) => setCheckSeguridad(e.target.checked)}
          />
          <label
            htmlFor="check-seguridad"
            className="text-xs text-gray-700 leading-tight cursor-pointer select-none text-justify"
          >
            Certifico que he revisado{" "}
            <span className="font-bold">todos los documentos</span> cargados de
            los requisitos Edición y Categoría, y confirmo que el postulado
            cumple con los requisitos.
          </label>
        </div>
      </Modal>
      <Modal
        open={modalComentarioOpen}
        onCancel={() => {
          setModalComentarioOpen(false);
          setNuevoComentario("");
        }}
        onOk={handleGuardarNuevoComentario}
        okText="Guardar Comentario"
        okButtonProps={{ className: "bg-red-600! hover:bg-red-700!" }}
        cancelText="Cancelar"
        centered
      >
        <div className="flex items-center gap-2 mb-2!">
          <h2 className="text-lg font-semibold font-poppins">
            Nuevo Comentario
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-3! text-justify font-inter">
          Este mensaje será visible para el participante para que realice los
          ajustes necesarios.
        </p>
        <textarea
          className="w-full p-3! text-sm border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
          rows={5}
          placeholder="Escriba aquí los detalles de lo que debe corregir..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          style={{ resize: "none" }}
        />
      </Modal>
    </div>
  );
}

export default InformacionPostulacionEdicion;
