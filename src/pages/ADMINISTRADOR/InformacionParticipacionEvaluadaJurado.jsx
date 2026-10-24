import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Table, Tooltip, Card, Modal, Breadcrumb, Select, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  obtenerParticipacion,
  listarJuradosParticipacion,
} from "../../features/participacion/participacion.slice";
import { Eye } from "lucide-react";
import {
  FaUser,
  FaStream,
  FaFolderOpen,
  FaClipboardList,
} from "react-icons/fa";
import { Tabs, Timeline } from "antd";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import dayjs from "dayjs";
import { motion } from "framer-motion";
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
  FileText,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CircleCheck,
} from "lucide-react";
import { IoIosInformationCircle } from "react-icons/io";
import { PiGavelFill } from "react-icons/pi";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import ListaJuradosParticipacion from "@/components/DataJurado/ListaJuradosParticipacion.jsx";
import LoadingData from "@/components/LoadingData";

const TimelineParticipacion = React.memo(({ participacion }) => {
  const items = [];

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const agruparJuradosPorFecha = (jurados = []) => {
    if (!jurados.length) return null;

    const fechaBase = jurados
      .map((j) => new Date(j.fecha_asignacion))
      .sort((a, b) => a - b)[0];

    return {
      fecha: fechaBase,
      jurados,
    };
  };

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

  const grupoJurados = agruparJuradosPorFecha(participacion?.juradosAsignados);

  if (grupoJurados) {
    items.push({
      fecha: grupoJurados.fecha,
      titulo: "Jurados asignados",
      descripcion: `Se asignaron ${grupoJurados.jurados.length} jurados`,
      icon: <PiGavelFill />,
      jurados: grupoJurados.jurados,
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
            <span className="text-xs text-gray-400 font-inter">
              {dayjs(item.fecha).format("DD/MM/YYYY")}
            </span>

            <div className="font-semibold text-sm text-gray-800 font-poppins">
              {item.titulo}
            </div>

            <div className="text-xs text-gray-600 font-inter">
              {item.descripcion}

              {item.jurados && (
                <details className="mt-2 text-[11px] text-gray-500 cursor-pointer">
                  <summary className="hover:text-red-500">
                    Ver jurados asignados
                  </summary>
                  <ul className="mt-1! ml-4! list-disc">
                    {item.jurados.map((j) => (
                      <li key={j.jurado.id_usuario}>
                        {capitalizeFirstLetter(j.jurado.primer_nombre)}{" "}
                        {capitalizeFirstLetter(j.jurado.segundo_nombre)}{" "}
                        {capitalizeFirstLetter(j.jurado.primer_apellido)}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </motion.div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
});

function InformacionParticipacionEvaluadaJurado() {
  const { id_participacion } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const participacion = useSelector(
    (state) => state.participacion.participacion,
  );
  const loading_participacion = useSelector(
    (state) => state.participacion.loadingParticipacion,
  );
  const error_participacion = useSelector(
    (state) => state.participacion.errorParticipacion,
  );
  const requisitos_categoria = useSelector(
    (state) => state.requisitos.requisitos_categoria,
  );
  const requisitos_edicion = useSelector(
    (state) => state.requisitos.requisitos_edicion,
  );
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [respuestaPreview, setRespuestaPreview] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeTabDocumentacion, setActiveTabDocumentacion] = useState("1");
  const location = useLocation();

  const fromJurado = location.state?.from === "jurado";
  const fromJuradoAdmin = location.state?.from === "jurado-admin";
  const fromConvocado = location.state?.from === "convocado";
  const fromGanador = location.state?.from === "ganador-edicion";

  const juradoId = location.state?.juradoId;

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    document.title = "PAMCE | Participación";
    if (!id_participacion) return;

    dispatch(obtenerParticipacion(id_participacion))
      .unwrap()
      .then((res) => {
        if (!res?.participacion) return;

        toast.success(res.message, {
          toastId: "participacion-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });

        dispatch(
          listarRequisitosEdicion({
            id_edicion: res.participacion.id_edicion,
          }),
        );

        dispatch(
          listarRequisitosPorCategoriaEdicion({
            id_edicion_categoria:
              res.participacion.edicionCategoria?.id_edicion_categoria,
          }),
        );

        dispatch(
          listarJuradosParticipacion({
            id_participacion: res.participacion.id_participacion,
          }),
        );
      })
      .catch((err) => console.log("Error al obtener la participación", err));
  }, [edicion?.id_edicion, id_participacion, dispatch]);

  const requisitosCategoriaConRespuesta = React.useMemo(() => {
    if (
      !requisitos_categoria ||
      participacion?.respuestas.filter(
        (item) => item.id_requisito_edicion_categoria !== null,
      ).length === 0
    )
      return [];

    return requisitos_categoria.map((req) => {
      const respuesta = participacion?.respuestas
        .filter((item) => item.id_requisito_edicion_categoria !== null)
        .find(
          (r) =>
            r.id_requisito_edicion_categoria ===
            req.id_requisito_edicion_categoria,
        );
      return {
        id_requisito_edicion_categoria: req.id_requisito_edicion_categoria,
        descripcion: req.Requisito.descripcion,
        tipo: capitalizeFirstLetter(req.tipo_requisito),
        fecha_envio: respuesta?.fecha_envio ?? "",
        obligatorio: req.obligatorio,
        estado_entrega: respuesta ? true : false,
        respuesta: respuesta ?? "No respondió",
      };
    });
  }, [requisitos_categoria, participacion]);

  const requisitosEdicionConRespuesta = React.useMemo(() => {
    if (
      !requisitos_edicion ||
      participacion?.respuestas.filter(
        (item) => item.id_requisito_edicion !== null,
      ).length === 0
    )
      return [];

    return requisitos_edicion.map((req) => {
      const respuesta = participacion?.respuestas
        .filter((item) => item.id_requisito_edicion !== null)
        .find((r) => r.id_requisito_edicion === req.id_requisito_edicion);

      return {
        id_requisito_edicion: req.id_requisito_edicion,
        descripcion: req.Requisito.descripcion,
        tipo: capitalizeFirstLetter(req.tipo_requisito),
        fecha_envio: respuesta?.fecha_envio ?? "",
        obligatorio: req.obligatorio,
        estado_entrega: respuesta ? true : false,
        respuesta: respuesta ?? "No respondió",
      };
    });
  }, [requisitos_edicion, participacion]);

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
      title: "Descripción del requisito",
      dataIndex: "descripcion",
      key: "descripcion",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (record) => (
        <span className="flex items-center gap-1 font-inter text-sm text-gray-700 text-justify">
          {capitalizeFirstLetter(record)}
        </span>
      ),
    },
    {
      title: "Fecha de Entrega",
      dataIndex: "fecha_envio",
      key: "fecha_envio",
      sorter: (a, b) => dayjs(a.fecha_envio).isBefore(dayjs(b.fecha_envio)),
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (value) => {
        const fecha = dayjs(value);
        return (
          <span className="flex items-center gap-1 font-inter text-sm text-gray-700 text-center">
            {fecha.format("DD/MM/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700">
          {capitalizeFirstLetter(record.tipo)}
        </span>
      ),
    },

    {
      title: "¿Obligatorio?",
      dataIndex: "obligatorio",
      key: "obligatorio",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
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
        className: "bg-gray-200! font-inter text-center! text-sm",
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
        className: "bg-gray-200! font-inter text-center! text-sm",
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
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosParticipante = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Documento"
          valor={
            participacion?.usuario?.numero_documento
              ? `CC ${participacion.usuario.numero_documento}`
              : "-"
          }
        />

        <Campo
          label="Nombres"
          valor={[
            capitalizeFirstLetter(participacion?.usuario?.primer_nombre),
            capitalizeFirstLetter(participacion?.usuario?.segundo_nombre),
          ].join(" ")}
        />

        <Campo
          label="Apellidos"
          valor={[
            capitalizeFirstLetter(participacion?.usuario?.primer_apellido),
            capitalizeFirstLetter(participacion?.usuario?.segundo_apellido),
          ].join(" ")}
        />

        <Campo
          label="Código Institucional"
          valor={participacion?.usuario?.codigo_institucional || "No Aplica"}
        />

        <Campo
          label="Nivel Educativo"
          valor={
            capitalizeFirstLetter(
              participacion?.usuario?.nivel_estudio_superior,
            ) || "No Aplica"
          }
        />

        <Campo
          label="Teléfono"
          valor={participacion?.usuario?.telefono || "-"}
        />

        <Campo
          label="Género"
          valor={capitalizeFirstLetter(participacion?.usuario?.genero)}
        />

        <Campo
          label="Dirección"
          valor={
            capitalizeFirstLetter(participacion?.usuario?.direccion) || "-"
          }
        />

        <Campo
          label="Correo"
          valor={participacion?.usuario?.correo_electronico || "-"}
        />
      </div>

      <div className="grid grid-cols-1 hidden lg:flex justify-center">
        <img
          src={imagen_data_postulado}
          alt="Foto de usuario"
          className="h-60 object-contain ml-3!"
        />
      </div>
    </div>
  );

  const DatosParticipacion = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2  gap-2 text-sm font-inter text-gray-700 lg:col-span-2 -mb-2!">
      <Campo
        label="Nombre Edición"
        valor={
          capitalizeFirstLetter(
            participacion?.edicionCategoria?.edicion.nombre_edicion,
          ) || "-"
        }
      />

      <Campo
        label="Nombre Categoría"
        valor={
          capitalizeFirstLetter(
            participacion?.edicionCategoria?.categoria.nombre_categoria,
          ) || "-"
        }
      />

      <Campo
        label="Fecha Inicio Edición"
        valor={
          dayjs(participacion?.edicionCategoria?.edicion.fecha_inicio).format(
            "DD/MM/YYYY",
          ) || "-"
        }
      />

      <Campo
        label="Fecha Fin Edición"
        valor={
          dayjs(participacion?.edicionCategoria?.edicion.fecha_fin).format(
            "DD/MM/YYYY",
          ) || "-"
        }
      />
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

  const DocumentosParticipacion = () => (
    <Tabs
      activeKey={activeTabDocumentacion}
      onChange={(key) => setActiveTabDocumentacion(key)}
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
        <div className="w-full overflow-x-auto">
          <ConfigProvider locale={esES}>
            <Table
              columns={columnsRequisitos}
              dataSource={requisitosEdicionConRespuesta}
              pagination={false}
              locale={{ emptyText: <EmptyTable /> }}
            />
          </ConfigProvider>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Requisitos de la Categoría" key="2">
        <div className="w-full overflow-x-auto">
          <ConfigProvider locale={esES}>
            <Table
              columns={columnsRequisitos}
              dataSource={requisitosCategoriaConRespuesta}
              pagination={false}
              locale={{ emptyText: <EmptyTable /> }}
            />
          </ConfigProvider>
        </div>
      </Tabs.TabPane>
    </Tabs>
  );

  if (loading_participacion) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (error_participacion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg rounded-2xl text-center shadow-sm">
          <img
            src={imagen_no_data}
            alt="Error al consultar la participación"
            className="mx-auto mb-4 h-40 object-contain"
          />

          <h2 className="font-montserrat text-xl font-semibold text-gray-800">
            No se pudo consultar la participación
          </h2>

          <p className="mt-2! font-inter text-sm text-gray-500">
            {error_participacion}
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

  if (participacion === undefined) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (participacion === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Participación no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Participación no encontrada
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
          <h1 className="font-montserrat text-lg! md:text-xl! -ml-3!">
            Información de la Participación
          </h1>
        </div>

        <Breadcrumb className="font-montserrat">
          {fromJurado ? (
            <>
              <Breadcrumb.Item
                onClick={() => navigate("/administrador/lista-jurados")}
                className="cursor-pointer"
              >
                Jurados
              </Breadcrumb.Item>

              <Breadcrumb.Item
                onClick={() =>
                  navigate(
                    `/administrador/lista-jurados/${juradoId}/informacion-jurado`,
                  )
                }
                className="cursor-pointer"
              >
                Información Jurado
              </Breadcrumb.Item>
            </>
          ) : fromConvocado ? (
            <>
              <Breadcrumb.Item
                onClick={() => navigate("/administrador/convocados-edicion")}
                className="cursor-pointer"
              >
                Convocados
              </Breadcrumb.Item>
            </>
          ) : fromGanador ? (
            <>
              <Breadcrumb.Item
                onClick={() => navigate("/administrador/ganadores")}
                className="cursor-pointer"
              >
                Ganadores
              </Breadcrumb.Item>
            </>
          ) : fromJuradoAdmin ? (
            <>
              <Breadcrumb.Item
                onClick={() => navigate("/administrador/lista-jurados")}
                className="cursor-pointer"
              >
                Jurados
              </Breadcrumb.Item>

              <Breadcrumb.Item
                onClick={() =>
                  navigate(
                    `/administrador/lista-jurados/${juradoId}/informacion-jurado`,
                  )
                }
                className="cursor-pointer"
              >
                Información Jurado
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item
              onClick={() => navigate("/administrador/participaciones-edicion")}
              className="cursor-pointer"
            >
              Participaciones
            </Breadcrumb.Item>
          )}

          <Breadcrumb.Item>Información Participación</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={FaUser} titulo="Datos del Participante" />
          <DatosParticipante />
        </Card>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50">
            <TituloCard
              icon={IoIosInformationCircle}
              titulo="Datos de la Participación"
              color="text-red-500"
            />
            <DatosParticipacion />
          </Card>
          <Card className="rounded-xl shadow-sm border border-blue-200 bg-blue-50 h-full">
            <TituloCard
              icon={FaClipboardList}
              titulo="Calificación Final"
              color="text-red-600"
            />
            <p
              className={
                participacion?.calificacion_final !== null
                  ? "flex justify-center text-8xl text-blue-700 xl:-mt-4! xl:-mb-4! text-center font-bold -mt-4!"
                  : "flex justify-center text-2xl text-gray-700 3xl:text-4xl 3xl:mt-12! text-center font-semibold font-poppins"
              }
            >
              {capitalizeFirstLetter(participacion?.calificacion_final) ||
                "No hay una calificación"}
            </p>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-1">
          <TituloCard
            icon={FaStream}
            titulo="Trayectoria"
            color="text-red-500"
          />
          <TimelineParticipacion participacion={participacion} />
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-4">
          <TituloCard icon={PiGavelFill} titulo="Jurados de la Participación" />
          <ListaJuradosParticipacion
            id_participacion={id_participacion}
            id_edicion_categoria={
              participacion?.edicionCategoria?.id_edicion_categoria
            }
            id_edicion={participacion?.id_edicion}
          />
        </Card>
      </div>
      <Card className="rounded-xl shadow-sm lg:col-span-5">
        <TituloCard icon={FaFolderOpen} titulo="Documentos de la Postulación" />
        <DocumentosParticipacion />
      </Card>
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
    </div>
  );
}

export default InformacionParticipacionEvaluadaJurado;
