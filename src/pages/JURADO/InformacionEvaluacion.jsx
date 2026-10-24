import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Table, Tooltip, Card, Modal, Tag } from "antd";
import { InputNumber } from "antd";
import { FaCommentAlt, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { obtenerParticipacionAEvaluar } from "../../features/participacion/participacion.slice";
import { Eye } from "lucide-react";
import {
  FaUser,
  FaCommentDots,
  FaFolderOpen,
  FaClipboardList,
} from "react-icons/fa";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  listarRequisitosPorCategoriaEdicion,
  listarRequisitosEdicion,
} from "../../features/requisitos/requisitos.slice";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import ParticipacionService from "../../features/participacion/participacion.service";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FileText, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { obtenerEvaluacion } from "../../features/evaluacion/evaluacion.slice";
import {
  registrarEvaluacion,
  editarEvaluacion,
} from "../../features/jurados/jurado.slice";
import { listarRubricasPorCategoriaEdicion } from "../../features/rubricas/rubricas.slice";
import { Tabs, Timeline } from "antd";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import LoadingData from "@/components/LoadingData";
import { useNavigate } from "react-router-dom";

const RenderEvaluacionModerna = ({
  rubricasCategoriaEdicion,
  editando,
  notas,
  setNotas,
  observaciones,
  setObservaciones,
  calcularNotaRubrica,
  calcularNotaCriterio,
  isEvaluado,
}) => {
  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const [visibles, setVisibles] = useState({});
  return (
    <div className="flex flex-col gap-4">
      {rubricasCategoriaEdicion?.map((item, index) => (
        <div
          key={index}
          className="border border-gray-100 rounded-2xl shadow-sm bg-white overflow-hidden"
        >
          <div className="bg-gray-50/80 p-4! border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center bg-red-600 text-white rounded-xl px-3! py-1! shadow-sm">
                <span className="text-[10px] uppercase font-bold leading-none">
                  Ponderación
                </span>
                <span className="text-sm font-black">{item.porcentaje}%</span>
              </div>
              <div className="text-[13px]">
                <h4 className="font-poppins font-bold text-gray-800 m-0">
                  {capitalizeFirstLetter(item.rubrica.nombre)}
                </h4>
                <p className="text-gray-400 m-0 italic">
                  {capitalizeFirstLetter(item.rubrica.descripcion)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 self-end md:self-center">
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="text-[11px] text-gray-400 uppercase font-black mb-1!">
                  Calificación Final Rúbrica
                </span>
                <div className="bg-gray-100 px-3! py-1! rounded-lg">
                  <span className="font-poppins font-bold text-gray-700">
                    {calcularNotaRubrica(item).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2! space-y-2">
            {item.rubrica.RubricaCriterios.map((rc, idx) => (
              <div
                key={idx}
                className="group flex flex-col gap-3 p-4! rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="text-[13px] font-bold text-gray-700 font-poppins">
                        {capitalizeFirstLetter(rc.Criterio.nombre)}
                      </span>
                      <Tag
                        color="default"
                        className="text-[9px] border-none bg-gray-100 font-bold rounded-full"
                      >
                        PESO:{" "}
                        {rc.edicionCategoriaRubricaCriterio[0].porcen || 0}%
                      </Tag>
                    </div>
                    <p className="text-[13px] text-gray-500 ml-3.5 leading-relaxed">
                      {capitalizeFirstLetter(rc.Criterio.descripcion)}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-center">
                    <Tooltip title="Añadir justificación/observación">
                      <button
                        onClick={() =>
                          setVisibles((prev) => ({
                            ...prev,
                            [rc.edicionCategoriaRubricaCriterio[0].id_ecr]:
                              !prev[
                                rc.edicionCategoriaRubricaCriterio[0].id_ecr
                              ],
                          }))
                        }
                        className={`p-2! rounded-lg transition-all ${
                          visibles[rc.edicionCategoriaRubricaCriterio[0].id_ecr]
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <FaCommentDots size={14} />
                      </button>
                    </Tooltip>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 uppercase font-black mb-1!">
                        Calificación
                      </span>

                      <InputNumber
                        min={0}
                        max={5}
                        step={0.1}
                        value={
                          notas[rc.edicionCategoriaRubricaCriterio[0].id_ecr]
                        }
                        disabled={isEvaluado && !editando}
                        onChange={(val) => {
                          setNotas((prev) => ({
                            ...prev,
                            [rc.edicionCategoriaRubricaCriterio[0].id_ecr]:
                              val || 0,
                          }));
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-center min-w-[70px]">
                      <span className="text-[9px] text-gray-400 uppercase font-black mb-1!">
                        Calificación Final
                      </span>
                      <div className="bg-gray-100 px-3! py-1! rounded-lg">
                        <span className="font-poppins font-bold text-gray-700">
                          {Number.isNaN(
                            calcularNotaCriterio(
                              notas[
                                rc.edicionCategoriaRubricaCriterio[0].id_ecr
                              ],
                              item.porcentaje,
                              rc.edicionCategoriaRubricaCriterio[0].porcen,
                            ),
                          )
                            ? "0.00"
                            : calcularNotaCriterio(
                                notas[
                                  rc.edicionCategoriaRubricaCriterio[0].id_ecr
                                ],
                                item.porcentaje,
                                rc.edicionCategoriaRubricaCriterio[0].porcen,
                              ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {visibles[rc.edicionCategoriaRubricaCriterio[0].id_ecr] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3!"
                  >
                    <span className="text-[10px] text-gray-400 uppercase font-black mb-3!">
                      OBSERVACIÓN
                    </span>

                    <textarea
                      placeholder="Justifique su calificación aquí..."
                      className="mt-2! w-full text-xs p-3! rounded-xl border border-amber-200 bg-amber-50/30 focus:outline-none focus:border-amber-400 text-gray-700"
                      rows={2}
                      disabled={isEvaluado && !editando}
                      value={
                        observaciones[
                          rc.edicionCategoriaRubricaCriterio[0].id_ecr
                        ]
                      }
                      onChange={(e) =>
                        setObservaciones((prev) => ({
                          ...prev,
                          [rc.edicionCategoriaRubricaCriterio[0].id_ecr]:
                            e.target.value,
                        }))
                      }
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function InformacionEvaluacion() {
  const { id_participacion } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const usuario = useSelector((state) => state.autenticacion.usuario);
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
  const [activeTabDocumentacion, setActiveTabDocumentacion] = useState("1");
  const [respuestaPreview, setRespuestaPreview] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [notas, setNotas] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [observacionGeneral, setObservacionGeneral] = useState("");
  const juradoAsignado = participacion?.juradosAsignados?.find(
    (p) => Number(p.id_jurado) === Number(usuario?.id_usuario),
  );
  const rubricas = useSelector(
    (state) => state.rubricas.rubricas_categoria_edicion,
  );

  const [isEvaluado, setIsEvaluado] = useState(false);

  useEffect(() => {
    setIsEvaluado(juradoAsignado?.estado === "evaluado");
  }, [juradoAsignado?.estado, usuario?.id_usuario, id_participacion]);

  useEffect(() => {
    document.title = "PAMCE | Información de la Participación";

    if (!edicion?.id_edicion || !id_participacion || !usuario?.id_usuario) {
      return;
    }

    setEditando(false);
    setIsEvaluado(false);

    dispatch(obtenerParticipacionAEvaluar(id_participacion))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "postulacion-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        const asignacionJurado = res.participacion?.juradosAsignados?.find(
          (p) => Number(p.id_jurado) === Number(usuario.id_usuario),
        );

        setIsEvaluado(asignacionJurado?.estado === "evaluado");
        setObservacionGeneral(asignacionJurado?.observacion ?? "");
        dispatch(
          listarRequisitosPorCategoriaEdicion({
            id_edicion_categoria:
              res?.participacion?.edicionCategoria?.id_edicion_categoria,
          }),
        );
        dispatch(listarRequisitosEdicion({ id_edicion: edicion.id_edicion }));
        dispatch(
          listarRubricasPorCategoriaEdicion({
            id_edicion_categoria:
              res?.participacion?.edicionCategoria.id_edicion_categoria,
          }),
        );
        dispatch(
          obtenerEvaluacion(
            res.participacion?.juradosAsignados.filter(
              (p) => p.id_jurado === usuario.id_usuario,
            )[0]?.id_participacion_jurado,
          ),
        )
          .unwrap()
          .then((res) => {
            res.evaluaciones.forEach((e) =>
              setNotas((prev) => ({
                ...prev,
                [e.edicionCategoriaRubricaCriterio.id_ecrc]: e.calificacion,
              })),
            );
            res.evaluaciones.forEach((e) =>
              setObservaciones((prev) => ({
                ...prev,
                [e.edicionCategoriaRubricaCriterio.id_ecrc]: e.observacion,
              })),
            );
            toast.success(res.message, {
              toastId: "postulacion-success",
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch((err) => {
            console.log("Error al obtener la evaluacion", err);
          });
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [edicion?.id_edicion, dispatch]);

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
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
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
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
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
        style: {
          backgroundColor: "#F3F2F2",
          fontFamily: "Inter",
          textAlign: "center",
          fontSize: "0.8rem",
        },
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

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={14} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosParticipante = () => {
    const usuario = participacion?.usuario;
    const categoria = participacion?.edicionCategoria?.categoria;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2!">
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-500 rounded-full"></span> Identidad
          </h4>
          <div className="grid grid-cols-1 gap-3  mt-1!">
            <Campo
              label="Nombre Completo"
              valor={`${capitalizeFirstLetter(usuario?.primer_nombre)} ${capitalizeFirstLetter(usuario?.segundo_nombre)} ${capitalizeFirstLetter(usuario?.primer_apellido)} ${capitalizeFirstLetter(usuario?.segundo_apellido)}`}
            />
            <Campo
              label="Documento de Identidad"
              valor={
                usuario?.numero_documento
                  ? `CC ${usuario.numero_documento}`
                  : "-"
              }
            />
            <Campo
              label="Género"
              valor={capitalizeFirstLetter(usuario?.genero)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
            <span className="w-1 h-3 bg-green-500 rounded-full"></span> Contacto
          </h4>
          <div className="grid grid-cols-1 gap-3  mt-1!">
            <Campo
              label="Correo Electrónico"
              valor={usuario?.correo_electronico || "-"}
            />
            <Campo
              label="Teléfono / Celular"
              valor={usuario?.telefono || "-"}
            />
            <Campo
              label="Dirección de Residencia"
              valor={usuario?.direccion || "-"}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
            <span className="w-1 h-3 bg-purple-500 rounded-full"></span>{" "}
            Institucional
          </h4>
          <div className="grid grid-cols-1 gap-3 mt-1!">
            <Campo
              label="Categoría de Postulación"
              valor={capitalizeFirstLetter(categoria?.nombre_categoria) || "-"}
            />
            <Campo
              label="Código Institucional"
              valor={usuario?.codigo_institucional || "No Aplica"}
            />
            <Campo
              label="Nivel Educativo"
              valor={
                capitalizeFirstLetter(usuario?.nivel_estudio_superior) ||
                "No Aplica"
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const Campo = ({ label, valor, colorValor = "text-gray-800" }) => (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium text-gray-400 font-inter">
        {label}
      </span>
      <span className={`${colorValor} text-sm font-semibold truncate`}>
        {valor || "—"}
      </span>
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

  if (!edicion) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">
          Cargando Información...
        </span>
      </div>
    );
  }

  const calcularNotaCriterio = (nota, pesoRubrica, pesoCriterio) => {
    return (pesoRubrica / 100) * (pesoCriterio / 100) * (nota || 0);
  };

  const calcularNotaRubrica = (rubricaItem) => {
    return rubricaItem.rubrica.RubricaCriterios.reduce((acc, rc) => {
      const nota = notas[rc.edicionCategoriaRubricaCriterio[0].id_ecr] || 0;

      return (
        acc +
        calcularNotaCriterio(
          nota,
          rubricaItem.porcentaje,
          rc.edicionCategoriaRubricaCriterio[0].porcen,
        )
      );
    }, 0);
  };

  const notaFinal = rubricas?.reduce((acc, item) => {
    return acc + calcularNotaRubrica(item);
  }, 0);

  const construirPayload = () => {
    return {
      id_participacion_jurado: participacion?.juradosAsignados?.find(
        (p) => p.id_jurado === usuario.id_usuario,
      )?.id_participacion_jurado,

      observacion_general: observacionGeneral,

      evaluaciones: Object.entries(notas).map(([id_ecrc, nota]) => ({
        id_ecrc: Number(id_ecrc),
        calificacion: nota,
        observacion: observaciones[id_ecrc] || null,
      })),
    };
  };

  const validarTodasLasNotas = () => {
    const criterios = rubricas?.flatMap(
      (rubrica) => rubrica.rubrica?.RubricaCriterios || [],
    );

    const criteriosSinNota = criterios.filter((rc) => {
      const id_ecrc = rc.edicionCategoriaRubricaCriterio[0]?.id_ecr;

      const nota = notas[id_ecrc];

      return nota === undefined || nota === null || nota === "";
    });

    if (criteriosSinNota.length > 0) {
      toast.warning(
        `Debes calificar todos los criterios. Faltan ${criteriosSinNota.length} criterios por calificar.`,
        {
          position: "top-right",
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true,
        },
      );

      return false;
    }

    return true;
  };

  const guardarEvaluacion = async () => {
    try {
      if (!validarTodasLasNotas()) {
        return;
      }

      const payload = construirPayload();

      const res = await dispatch(registrarEvaluacion(payload)).unwrap();

      setIsEvaluado(true);

      toast.success(res.message, {
        toastId: "postulacion-success",
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error al guardar la evaluación", error);

      toast.error(error?.message || "Error al guardar la evaluación", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const editarNotas = async () => {
    try {
      if (!validarTodasLasNotas()) {
        return;
      }

      const payload = construirPayload();

      const res = await dispatch(editarEvaluacion(payload)).unwrap();

      toast.success(res.message, {
        toastId: "postulacion-success",
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });

      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar la evaluación", error);

      toast.error(error?.message || "Error al actualizar la evaluación", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Participación no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          No se pudo consultar la participación
        </h2>

        <p className="mt-2 font-inter text-sm text-gray-500">
          {error_participacion}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-5! rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
        >
          Volver
        </button>
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
          <h1 className="font-montserrat text-lg! md:text-xl!">
            Información de la Participación
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6!">
        <Card className="rounded-2xl shadow-sm border-none bg-white lg:col-span-3 overflow-hidden">
          <div className="border-b border-gray-50 pb-2">
            <TituloCard
              icon={FaUser}
              titulo="Ficha Técnica del Participante"
              color="text-red-600"
            />
          </div>
          <div className="pt-4">
            <DatosParticipante />
          </div>
        </Card>

        <Card className="rounded-2xl shadow-md border-none bg-gradient-to-br from-blue-600 to-blue-800 lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
          <TituloCard
            icon={FaClipboardList}
            titulo="Calificación Final"
            color="text-red-600"
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="text-8xl font-black drop-shadow-md">
              {participacion?.calificacion_final ?? "0.0"}
            </span>

            <span className="text-blue-100 text-[10px] mt-2! font-bold uppercase tracking-tighter">
              Puntaje Total Obtenido
            </span>
          </div>

          <div className="mt-auto pt-4! border-t border-white/10 relative z-10">
            <div className="flex justify-between items-center text-[10px] text-blue-200 font-bold uppercase">
              <span>Estado: </span>
              <Tag
                color="cyan"
                className="m-0 border-none text-[9px] px-2 leading-tight"
              >
                {participacion?.estado !== "evaluado"
                  ? "EN EVALUACIÓN"
                  : "EVALUADO"}
              </Tag>
            </div>
          </div>
        </Card>
      </div>
      <Card className="rounded-xl shadow-sm lg:col-span-2 mb-6!">
        <TituloCard icon={FaFolderOpen} titulo="Documentos de la Postulación" />
        <DocumentosParticipacion />
      </Card>
      <Card className="rounded-2xl shadow-sm border-none bg-transparent">
        <div className="flex items-center justify-between mb-6">
          <TituloCard
            icon={FaClipboardList}
            titulo="Criterios de Evaluación"
            color="text-red-600"
          />

          {/* Opcional: Una leyenda rápida */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Rúbrica
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Criterio
              </span>
            </div>
          </div>
        </div>
        <RenderEvaluacionModerna
          editando={editando}
          rubricasCategoriaEdicion={rubricas}
          notas={notas}
          setNotas={setNotas}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          calcularNotaRubrica={calcularNotaRubrica}
          calcularNotaCriterio={calcularNotaCriterio}
          isEvaluado={isEvaluado}
        />
        <div className="mt-8! space-y-4">
          <div className="bg-white p-5! rounded-2xl border border-gray-100 shadow-sm mb-4!">
            <div className="flex items-center gap-2 mb-3!">
              <FaCommentAlt className="text-gray-400" size={14} />
              <h4 className="text-sm font-bold text-gray-700 m-0! font-poppins">
                Observaciones Generales de la Participación
              </h4>
            </div>
            <textarea
              className="w-full p-4! rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-sm font-inter"
              placeholder="Escriba un resumen del desempeño general, fortalezas o áreas de mejora..."
              rows={4}
              disabled={isEvaluado && !editando}
              value={observacionGeneral}
              onChange={(e) => setObservacionGeneral(e.target.value)}
            />
          </div>

          <div className="p-6! bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
            <div className="mb-4! md:mb-0">
              <h3 className="text-lg font-bold m-0! font-poppins text-white!">
                Resultado de la Evaluación
              </h3>
              <p className="text-gray-400 text-xs m-0! font-inter">
                El puntaje se calcula basado en la ponderación de cada rúbrica.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                  Total
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-poppins text-white">
                    {notaFinal.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-gray-500">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2!">
            <button
              onClick={() => {
                if (isEvaluado && !editando) {
                  setEditando(true);
                } else if (isEvaluado && editando) {
                  editarNotas();
                } else {
                  guardarEvaluacion();
                }
              }}
              className={`group relative flex items-center gap-3 px-8! py-3! ${
                participacion?.participacion?.juradosAsignados?.find(
                  (p) => p.id_jurado === usuario.id_usuario,
                )?.estado === "evaluado"
                  ? "bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0"
                  : "bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-xl shadow-green-200 transition-all hover:-translate-y-1 active:translate-y-0"
              }`}
            >
              <FaCheckCircle />
              <span className="text-sm">
                {isEvaluado
                  ? editando
                    ? "Guardar Cambios"
                    : "Editar Evaluación"
                  : "Finalizar y Guardar Evaluación"}
              </span>
            </button>
          </div>
        </div>
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

export default InformacionEvaluacion;
