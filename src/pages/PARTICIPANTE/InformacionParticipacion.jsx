import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Table,
  Tooltip,
  Card,
  Modal,
  Breadcrumb,
  Input,
  Button,
  Upload,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  obtenerParticipacionParticipante,
  listarJuradosParticipacion,
} from "../../features/participacion/participacion.slice";
import { Eye, Pencil, CircleCheck } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import {
  FaUser,
  FaStream,
  FaCommentDots,
  FaFolderOpen,
  FaClipboardList,
  FaDownload,
} from "react-icons/fa";
import { Tabs, Timeline } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// utcOffset necesita el plugin utc; antes funcionaba solo porque otra página
// (ListaAuditoria) lo registraba al cargarse
dayjs.extend(utc);
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
import { FileText, FileSpreadsheet, Download, AlertCircle } from "lucide-react";
import { IoIosInformationCircle } from "react-icons/io";
import { PiGavelFill } from "react-icons/pi";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import ListaJuradosParticipacionEvaluacion from "@/components/ListaJuradosParticipacionEvaluacion.jsx";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { editarRespuestaRequisitoDocumento } from "../../features/participacion/participacion.slice";
import { generarCertificadoParticipacion } from "../../features/participantes/participante.slice";
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

// Valida extensión y tamaño según la configuración del requisito.
// Antes, al editar una respuesta se aceptaba cualquier archivo aunque la
// pantalla mostrara los formatos y el tamaño permitidos.
const validarArchivoRequisito = (file, config) => {
  if (!config) return true;

  const extensionesPermitidas = config.extensiones_permitidas
    ?.split(",")
    .map((ext) => ext.trim().toLowerCase().replace(/^\./, ""));

  const extensionArchivo = file.name.split(".").pop().toLowerCase();

  if (
    extensionesPermitidas?.length &&
    !extensionesPermitidas.includes(extensionArchivo)
  ) {
    toast.error(
      `Formato no permitido. Use: ${extensionesPermitidas
        .map((e) => e.toUpperCase())
        .join(", ")}`,
    );
    return false;
  }

  if (config.tamano_max_mb && file.size > config.tamano_max_mb * 1024 * 1024) {
    toast.error(
      `El archivo supera el tamaño máximo permitido (${config.tamano_max_mb} MB)`,
    );
    return false;
  }

  return true;
};

function EditarRespuestaView({
  respuesta,
  textoRespuesta,
  setTextoRespuesta,
  archivoNuevo,
  setArchivoNuevo,
  requisitoSeleccionado,
  editarDocumento,
  setAbrirModalEditarRequisito,
}) {
  if (!respuesta) return null;

  if (respuesta.tipo_respuesta === "texto") {
    return (
      <div className="space-y-5">
        <div className="mb-2!">
          <Input.TextArea
            rows={8}
            value={textoRespuesta}
            onChange={(e) => {
              setTextoRespuesta(e.target.value);
            }}
            placeholder="Ingrese la respuesta..."
            className="font-inter"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setAbrirModalEditarRequisito(false)}>
            Cancelar
          </Button>

          <Button type="primary" onClick={editarDocumento}>
            Guardar cambios
          </Button>
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
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4! mb-3!">
          <span className="text-xs uppercase text-gray-500 font-semibold">
            Archivo actual
          </span>

          <div className="flex items-center gap-3 mt-3!">
            <div className="rounded-lg bg-white p-3! border">
              {esPdf && <FileText className="text-red-500" size={24} />}

              {esImagen && <Eye className="text-blue-500" size={24} />}

              {esOffice &&
                (ext.includes("xl") ? (
                  <FileSpreadsheet className="text-green-600" size={24} />
                ) : (
                  <FileText className="text-blue-600" size={24} />
                ))}
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                {respuesta.nombre_archivo}
              </p>

              <span className="text-xs text-gray-500">
                {respuesta.extension_archivo} •{" "}
                {(respuesta.tamano_bytes / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4! hover:border-blue-400 transition-colors">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2!">
                Nuevo archivo
              </label>
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  if (
                    !validarArchivoRequisito(
                      file,
                      requisitoSeleccionado?.RequisitosConfig,
                    )
                  ) {
                    return Upload.LIST_IGNORE;
                  }
                  setArchivoNuevo(file);
                  return false;
                }}
                onRemove={() => {
                  setArchivoNuevo(null);
                }}
                showUploadList={false}
                className="w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="w-full h-11 border-dashed font-medium text-gray-600 hover:text-blue-600"
                >
                  {archivoNuevo
                    ? "Cambiar archivo seleccionado"
                    : "Seleccionar o arrastrar archivo"}
                </Button>
              </Upload>
              <div className="mt-4! pt-3! border-t border-gray-200/60 space-y-2! text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">
                    Formatos permitidos:
                  </span>
                  <span className="font-semibold text-gray-700 bg-gray-200/60 px-2! py-0.5! rounded">
                    {
                      requisitoSeleccionado.RequisitosConfig
                        .extensiones_permitidas
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">
                    Tamaño máximo:
                  </span>
                  <span className="font-semibold text-gray-700">
                    {requisitoSeleccionado.RequisitosConfig.tamano_max_mb} MB
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">Carácter:</span>
                  <span
                    className={`font-semibold px-2! py-0.5! rounded ${
                      requisitoSeleccionado.obligatorio
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {requisitoSeleccionado.obligatorio
                      ? "Obligatorio"
                      : "Opcional"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-4! mb-2!">
            <span className="text-xs text-center uppercase text-gray-400 font-semibold mb-2! block">
              Vista previa del nuevo archivo
            </span>

            {archivoNuevo ? (
              <div className="flex items-center gap-3 p-3! rounded-lg bg-green-50/80 border border-green-200">
                <div className="rounded-lg bg-white p-2.5! shadow-sm border border-green-100 flex items-center justify-center">
                  <FileText className="text-green-600" size={24} />
                </div>

                <div className="overflow-hidden flex-1">
                  <p className="font-semibold text-sm text-green-900 truncate">
                    {archivoNuevo.name}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5!">
                    {(archivoNuevo.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  onClick={() => setArchivoNuevo(null)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2! py-1! rounded hover:bg-red-50 transition-colors"
                  type="button"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6! text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                <UploadOutlined className="text-2xl mb-1! text-gray-300" />
                <p className="text-xs">Sin archivo nuevo seleccionado</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setAbrirModalEditarRequisito(false)}>
            Cancelar
          </Button>

          <Button type="primary" onClick={editarDocumento}>
            Guardar cambios
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function EditarRespuestaCategoriaView({
  respuesta,
  textoRespuesta,
  setTextoRespuesta,
  archivoNuevo,
  setArchivoNuevo,
  requisitoSeleccionado,
  editarDocumento,
  setAbrirModalEditarRequisito,
}) {
  if (!respuesta) return null;

  if (respuesta.tipo_respuesta === "texto") {
    return (
      <div className="space-y-5">
        <div className="mb-2!">
          <Input.TextArea
            rows={8}
            value={textoRespuesta}
            onChange={(e) => {
              setTextoRespuesta(e.target.value);
            }}
            placeholder="Ingrese la respuesta..."
            className="font-inter"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setAbrirModalEditarRequisito(false)}>
            Cancelar
          </Button>

          <Button type="primary" onClick={editarDocumento}>
            Guardar cambios
          </Button>
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
      <div className="space-y-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4! mb-3!">
          <span className="text-xs uppercase text-gray-500 font-semibold">
            Archivo actual
          </span>

          <div className="flex items-center gap-3 mt-3!">
            <div className="rounded-lg bg-white p-3! border">
              {esPdf && <FileText className="text-red-500" size={24} />}

              {esImagen && <Eye className="text-blue-500" size={24} />}

              {esOffice &&
                (ext.includes("xl") ? (
                  <FileSpreadsheet className="text-green-600" size={24} />
                ) : (
                  <FileText className="text-blue-600" size={24} />
                ))}
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                {respuesta.nombre_archivo}
              </p>

              <span className="text-xs text-gray-500">
                {respuesta.extension_archivo} •{" "}
                {(respuesta.tamano_bytes / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4! hover:border-blue-400 transition-colors">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2!">
                Nuevo archivo
              </label>
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  if (
                    !validarArchivoRequisito(
                      file,
                      requisitoSeleccionado?.RequisitosCategoriaConfig,
                    )
                  ) {
                    return Upload.LIST_IGNORE;
                  }
                  setArchivoNuevo(file);
                  return false;
                }}
                onRemove={() => {
                  setArchivoNuevo(null);
                }}
                showUploadList={false}
                className="w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="w-full h-11 border-dashed font-medium text-gray-600 hover:text-blue-600"
                >
                  {archivoNuevo
                    ? "Cambiar archivo seleccionado"
                    : "Seleccionar o arrastrar archivo"}
                </Button>
              </Upload>
              <div className="mt-4! pt-3! border-t border-gray-200/60 space-y-2! text-xs">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">
                    Formatos permitidos:
                  </span>
                  <span className="font-semibold text-gray-700 bg-gray-200/60 px-2! py-0.5! rounded">
                    {
                      requisitoSeleccionado.RequisitosCategoriaConfig
                        .extensiones_permitidas
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">
                    Tamaño máximo:
                  </span>
                  <span className="font-semibold text-gray-700">
                    {
                      requisitoSeleccionado.RequisitosCategoriaConfig
                        .tamano_max_mb
                    }{" "}
                    MB
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="font-medium text-gray-500">Carácter:</span>
                  <span
                    className={`font-semibold px-2! py-0.5! rounded ${
                      requisitoSeleccionado.obligatorio
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {requisitoSeleccionado.obligatorio
                      ? "Obligatorio"
                      : "Opcional"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-4! mb-2!">
            <span className="text-xs text-center uppercase text-gray-400 font-semibold mb-2! block">
              Vista previa del nuevo archivo
            </span>

            {archivoNuevo ? (
              <div className="flex items-center gap-3 p-3! rounded-lg bg-green-50/80 border border-green-200">
                <div className="rounded-lg bg-white p-2.5! shadow-sm border border-green-100 flex items-center justify-center">
                  <FileText className="text-green-600" size={24} />
                </div>

                <div className="overflow-hidden flex-1">
                  <p className="font-semibold text-sm text-green-900 truncate">
                    {archivoNuevo.name}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5!">
                    {(archivoNuevo.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  onClick={() => setArchivoNuevo(null)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2! py-1! rounded hover:bg-red-50 transition-colors"
                  type="button"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6! text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                <UploadOutlined className="text-2xl mb-1! text-gray-300" />
                <p className="text-xs">Sin archivo nuevo seleccionado</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setAbrirModalEditarRequisito(false)}>
            Cancelar
          </Button>

          <Button type="primary" onClick={editarDocumento}>
            Guardar cambios
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function InformacionParticipacion() {
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
  const hoy = dayjs().utcOffset(-300).format("YYYY-MM-DD");
  const [abrirModalEditarRequisito, setAbrirModalEditarRequisito] =
    useState(false);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState(null);
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");

  const fromJurado = location.state?.from === "jurado";
  const fromConvocado = location.state?.from === "convocado";
  const fromGanador = location.state?.from === "ganador-edicion";

  const juradoId = location.state?.juradoId;

  useEffect(() => {
    document.title = "PAMCE | Información de la Participación";
    if (!id_participacion) return;

    dispatch(obtenerParticipacionParticipante(id_participacion))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "participacion-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        dispatch(
          listarRequisitosEdicion({
            id_edicion: res.participacion?.edicionCategoria?.edicion.id_edicion,
          }),
        );
        dispatch(
          listarRequisitosPorCategoriaEdicion({
            id_edicion_categoria:
              res?.participacion?.edicionCategoria?.id_edicion_categoria,
          }),
        );
        dispatch(
          listarJuradosParticipacion({
            id_participacion: res?.participacion?.id_participacion,
          }),
        );
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [id_participacion, dispatch]);

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
        ...req,
        id_requisito_edicion_categoria: req.id_requisito_edicion_categoria,
        descripcion: req.Requisito.descripcion,
        obligatorio: req.obligatorio,
        tipo_requisito: req.tipo_requisito,
        respuesta: respuesta ?? "No respondió",
        clasificacion: "categoria",
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
        ...req,
        id_requisito_edicion: req.id_requisito_edicion,
        descripcion: req.Requisito.descripcion,
        tipo_requisito: req.tipo_requisito,
        obligatorio: req.obligatorio,
        respuesta: respuesta ?? "No respondió",
        clasificacion: "edicion",
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
        console.log(error);
        toast.error("Error al cargar el archivo");
      }
    }
  };

  const editarRespuesta = async (record) => {
    if (!record?.respuesta || record.respuesta === "No respondió") {
      toast.info("Este requisito no tiene respuesta");
      return;
    }

    setRequisitoSeleccionado(record);
    setTextoRespuesta(record.respuesta.valor_texto || "");
    setAbrirModalEditarRequisito(true);

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
          {record}
        </span>
      ),
    },
    {
      title: "Fecha de Entrega",
      key: "fecha_envio",
      sorter: (a, b) => dayjs(a.fecha_envio).isBefore(dayjs(b.fecha_envio)),
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => {
        const fechaEnvio = record.respuesta?.fecha_envio;

        return (
          <span className="items-center gap-1 font-inter text-sm text-gray-700 text-center">
            {fechaEnvio && dayjs(fechaEnvio).isValid()
              ? dayjs(fechaEnvio).format("DD/MM/YYYY")
              : "-"}
          </span>
        );
      },
    },
    {
      title: "Tipo",
      key: "tipo_requisito",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.tipo_requisito)}
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
      title: "Acción",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="Vista previa del requisito">
            <button
              className="p-2! rounded-lg bg-blue-50 hover:bg-blue-100 transition"
              onClick={() => {
                abrirVistaPrevia(record);
              }}
            >
              <Eye size={18} className="text-blue-600" />
            </button>
          </Tooltip>
          <Tooltip
            title={
              hoy >
                participacion?.edicionCategoria?.edicion
                  .fecha_fin_convocatoria ||
              participacion?.estado !== "pendiente"
                ? "No se puede editar el archivo"
                : "Editar archivo"
            }
          >
            <button
              disabled={
                hoy >
                  participacion?.edicionCategoria?.edicion
                    .fecha_fin_convocatoria ||
                participacion?.estado !== "pendiente"
              }
              onClick={() => {
                if (
                  hoy >
                    participacion?.edicionCategoria?.edicion
                      .fecha_fin_convocatoria ||
                  participacion?.estado !== "pendiente"
                )
                  return;
                editarRespuesta(record);
              }}
              className={`p-2! rounded-lg ${
                hoy >
                  participacion?.edicionCategoria?.edicion
                    .fecha_fin_convocatoria ||
                participacion?.estado !== "pendiente"
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-yellow-50 hover:bg-yellow-100"
              }
                  `}
            >
              <Pencil
                size={18}
                className={
                  hoy >
                    participacion?.edicionCategoria?.edicion
                      .fecha_fin_convocatoria ||
                  participacion?.estado !== "pendiente"
                    ? "text-gray-400"
                    : "text-yellow-600"
                }
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

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

  const editarDocumento = async () => {
    try {
      const formData = new FormData();

      if (requisitoSeleccionado.tipo_requisito === "texto") {
        if (!textoRespuesta.trim()) {
          toast.warning("Ingrese una respuesta.");
          return;
        }

        formData.append("valor_texto", textoRespuesta.trim());
      } else {
        if (!archivoNuevo) {
          toast.warning("Seleccione un archivo.");
          return;
        }

        formData.append("archivo", archivoNuevo);
      }

      const res = await dispatch(
        editarRespuestaRequisitoDocumento({
          id_participacion_requisito:
            requisitoSeleccionado.respuesta.id_participacion_requisito,
          formData,
        }),
      ).unwrap();

      toast.success(res.message);

      setAbrirModalEditarRequisito(false);
      setArchivoNuevo(null);
      setTextoRespuesta("");

      dispatch(obtenerParticipacionParticipante(id_participacion));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cerrarModal = () => {
    setPdfUrl(null);
    setModalPreviewOpen(false);
  };

  const handleDescargarCertificado = async () => {
    try {
      const blob = await dispatch(
        generarCertificadoParticipacion(id_participacion),
      ).unwrap();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `certificado-participacion-${id_participacion}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Certificado generado correctamente.");
    } catch (error) {
      console.error("Error al descargar certificado:", error);

      toast.error(error?.message || "No fue posible generar el certificado.");
    }
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

  const fechaInicioPremiacion =
    participacion?.edicionCategoria?.edicion?.fecha_inicio_premiacion;

  const premiacionIniciada =
    fechaInicioPremiacion &&
    hoy >= dayjs(fechaInicioPremiacion).format("YYYY-MM-DD");

  const calificacionFinal = participacion?.calificacion_final;

  const tieneCalificacion =
    calificacionFinal !== null &&
    calificacionFinal !== undefined &&
    Number(calificacionFinal) !== 0;

  const certificadoDeshabilitado = !premiacionIniciada || !tieneCalificacion;

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
          ) : (
            <Breadcrumb.Item
              onClick={() => navigate("/participante/participaciones")}
              className="cursor-pointer"
            >
              Participaciones
            </Breadcrumb.Item>
          )}

          <Breadcrumb.Item>Información Participación</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 mb-3!">
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
              icon={FaCommentDots}
              titulo="Observación"
              color="text-red-600"
            />
            <p>
              {capitalizeFirstLetter(participacion?.observacion) ||
                "No hay una observación"}
            </p>
          </Card>
        </div>
        <Card className="rounded-xl shadow-sm lg:col-span-2">
          <TituloCard icon={LuLayoutPanelLeft} titulo="Panel de Revisión" />
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-red-100 rounded-lg p-3! max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200">
              {participacion?.comentarios ? (
                <div className="font-inter">
                  {renderizarComentarios(participacion?.comentarios)}
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
          </div>
        </Card>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={handleDescargarCertificado}
            disabled={certificadoDeshabilitado}
            title={
              !premiacionIniciada
                ? "El certificado estará disponible cuando inicie la etapa de premiación."
                : !tieneCalificacion
                  ? "No puedes descargar el certificado porque aún no tienes una calificación válida."
                  : "Descargar certificado"
            }
            className={`flex items-center justify-center gap-4 rounded-xl border px-6! py-5! shadow-sm transition-all duration-200 ${
              certificadoDeshabilitado
                ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                : "cursor-pointer border-green-200 bg-green-50 hover:bg-green-100 hover:shadow-md"
            }`}
          >
            <FaDownload
              className={`text-3xl ${
                certificadoDeshabilitado ? "text-gray-400" : "text-green-600"
              }`}
            />

            <div className="flex flex-col">
              <span
                className={`font-poppins text-lg font-semibold ${
                  certificadoDeshabilitado ? "text-gray-400" : "text-green-700"
                }`}
              >
                Descargar certificado
              </span>
            </div>
          </button>
          <Card className="rounded-xl shadow-sm border border-blue-200 bg-blue-50 h-full">
            <TituloCard
              icon={FaClipboardList}
              titulo="Calificación Final"
              color="text-red-600"
            />
            <p
              className={
                participacion?.calificacion_final !== null
                  ? "flex justify-center text-8xl text-blue-700 xl:-mt-4! xl:-mb-4! text-center font-bold"
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
          <TituloCard
            icon={FaFolderOpen}
            titulo="Documentos de la Postulación"
          />
          <DocumentosParticipacion />
        </Card>
      </div>
      <Card className="rounded-xl shadow-sm lg:col-span-5">
        <TituloCard icon={PiGavelFill} titulo="Jurados de la Participación" />
        <ListaJuradosParticipacionEvaluacion
          id_participacion={id_participacion}
          id_edicion_categoria={
            participacion?.edicionCategoria?.id_edicion_categoria
          }
        />
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
      <Modal
        title={
          <div className="font-inter">
            <h4 className="font-semibold">Editar respuesta</h4>

            {requisitoSeleccionado?.tipo_requisito === "documento" && (
              <p className="text-sm text-gray-600 mt-1!">
                Seleccione un nuevo archivo para reemplazar el que envió
                anteriormente.
              </p>
            )}

            {requisitoSeleccionado?.tipo_requisito === "texto" && (
              <p className="text-sm text-gray-600 mt-1!">
                Modifique el contenido de la respuesta y guarde los cambios.
              </p>
            )}
          </div>
        }
        open={abrirModalEditarRequisito}
        onCancel={() => setAbrirModalEditarRequisito(false)}
        footer={null}
        width={600}
        destroyOnClose
        centered
      >
        {requisitoSeleccionado &&
          (requisitoSeleccionado.clasificacion === "edicion" ? (
            <EditarRespuestaView
              respuesta={requisitoSeleccionado.respuesta}
              textoRespuesta={textoRespuesta}
              setTextoRespuesta={setTextoRespuesta}
              archivoNuevo={archivoNuevo}
              setArchivoNuevo={setArchivoNuevo}
              requisitoSeleccionado={requisitoSeleccionado}
              editarDocumento={editarDocumento}
              setAbrirModalEditarRequisito={setAbrirModalEditarRequisito}
            />
          ) : requisitoSeleccionado.clasificacion === "categoria" ? (
            <EditarRespuestaCategoriaView
              respuesta={requisitoSeleccionado.respuesta}
              textoRespuesta={textoRespuesta}
              setTextoRespuesta={setTextoRespuesta}
              archivoNuevo={archivoNuevo}
              setArchivoNuevo={setArchivoNuevo}
              requisitoSeleccionado={requisitoSeleccionado}
              editarDocumento={editarDocumento}
              setAbrirModalEditarRequisito={setAbrirModalEditarRequisito}
            />
          ) : null)}
      </Modal>
    </div>
  );
}

export default InformacionParticipacion;
