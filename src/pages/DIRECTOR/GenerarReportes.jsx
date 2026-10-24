import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input, Table, Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import "../../styles/custom.css";
import { Funnel, FileSpreadsheet, FileDown } from "lucide-react";
import { Pagination } from "antd";
import es from "dayjs/locale/es";
import { ConfigProvider } from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import LoadingInformacion from "@/components/LoadingInformacion";
import {
  SlidersHorizontal,
  CalendarDays,
  Binary,
  Settings,
} from "lucide-react";
import esES from "antd/es/date-picker/locale/es_ES";
import { listarEdiciones } from "../../features/ediciones/edicion.slice";
import { listarCategorias } from "../../features/categorias/categoria.slice";
import { listarParticipantes } from "../../features/participantes/participante.slice";
import { listarJurados } from "../../features/jurados/jurado.slice";
import {
  limpiarReportes,
  reportesParticipaciones,
  reportesPostulaciones,
  reportesConvocatorias,
  reportesUsuarios,
} from "../../features/reportes/reportes.slice";
import ReportesService from "../../features/reportes/reportes.service";

function ListaParticipantes() {
  const dispatch = useDispatch();
  const [tipoReporte, setTipoReporte] = useState(null);
  const [filtros, setFiltros] = useState({
    page: 1,
  });

  const ediciones = useSelector((state) => state.ediciones?.ediciones || []);
  const categorias = useSelector((state) => state.categorias?.categorias || []);
  const participantes = useSelector(
    (state) => state.participantes?.participantes || [],
  );
  const jurados = useSelector((state) => state.jurados?.jurados || []);
  const informacion = useSelector((state) => state.reportes.informacion);
  const pagination = useSelector((state) => state.reportes.pagination);
  const loading = useSelector((state) => state.reportes.loading);

  useEffect(() => {
    document.title = "PAMCE | Reportes";

    dispatch(limpiarReportes());

    dispatch(listarEdiciones());
    dispatch(listarCategorias());
    dispatch(listarParticipantes());
    dispatch(listarJurados());

    if (tipoReporte === "participaciones") {
      dispatch(reportesParticipaciones(filtros));
    }

    if (tipoReporte === "postulaciones") {
      dispatch(reportesPostulaciones(filtros));
    }

    if (tipoReporte === "convocatorias") {
      dispatch(reportesConvocatorias(filtros));
    }

    if (tipoReporte === "usuarios") {
      dispatch(reportesUsuarios(filtros));
    }
  }, [dispatch, tipoReporte, filtros]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const options = {
    participaciones: {
      configuracion: {
        cantidad: {
          type: "number",
          label: "Cantidad de registros",
          min: 1,
          placeholder: "Ej. 100",
        },
        ordenar_por: {
          type: "select",
          label: "Ordenar por",
          options: [
            { value: "fecha_revision", label: "Fecha de revisión" },
            { value: "calificacion_final", label: "Calificación" },
          ],
        },
        direccion: {
          type: "select",
          label: "Dirección",
          options: [
            { value: "ASC", label: "Ascendente" },
            { value: "DESC", label: "Descendente" },
          ],
        },
      },
      filtros: {
        edicion: {
          type: "select",
          options: ediciones.map((e) => ({
            value: e.id_edicion,
            label: capitalizeFirstLetter(e.nombre_edicion),
          })),
        },
        categoria: {
          type: "select",
          options: [
            ...categorias.map((e) => ({
              value: e.edicionesCategoria[0].id_edicion_categoria,
              label: capitalizeFirstLetter(e.nombre_categoria),
            })),
          ],
        },
        participante: {
          type: "select",
          options: participantes.map((e) => ({
            value: e.id_usuario,
            label: [
              e.primer_nombre,
              e.segundo_nombre,
              e.primer_apellido,
              e.segundo_apellido,
            ]
              .filter(
                (nombre) => nombre != null && String(nombre).trim() !== "",
              )
              .join(" "),
          })),
        },
        genero: {
          type: "select",
          options: [
            { value: "femenino", label: "Femenino" },
            { value: "masculino", label: "Masculino" },
          ],
        },
        nivel_estudio_superior: {
          type: "select",
          options: [
            { label: "Bachiller", value: "bachiller" },
            { label: "Técnico", value: "tecnico" },
            { label: "Tecnólogo", value: "tecnologo" },
            { label: "Profesional", value: "profesional" },
            { label: "Especialización", value: "especializacion" },
            { label: "Maestría", value: "maestria" },
            { label: "Doctorado", value: "doctorado" },
          ],
        },
        fechas: {
          type: "date-range",
        },
      },
      columnas: [
        {
          title: "Documento",
          dataIndex: "numero_documento",
          key: "numero_documento",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record?.usuario?.tipo_documento}{" "}
              {record?.usuario?.numero_documento}
            </span>
          ),
        },
        {
          title: "Nombre",
          key: "nombre",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(record?.usuario?.primer_nombre)}{" "}
              {capitalizeFirstLetter(record?.usuario?.segundo_nombre)}{" "}
              {capitalizeFirstLetter(record?.usuario?.primer_apellido)}{" "}
              {capitalizeFirstLetter(record?.usuario?.segundo_apellido)}
            </span>
          ),
        },
        {
          title: "Correo Electrónico",
          dataIndex: "correo_electronico",
          key: "email",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record.usuario?.correo_electronico}
            </span>
          ),
        },
        {
          title: "Categoría",
          key: "categoria",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(
                record?.edicionCategoria?.categoria?.nombre_categoria,
              )}
            </span>
          ),
        },
        {
          title: "Edición",
          key: "edicion",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(record?.edicion?.nombre_edicion)}
            </span>
          ),
        },
        {
          title: "Fecha de Revisión",
          dataIndex: "fecha_revision",
          key: "fecha_revision",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record?.fecha_revision && dayjs(record?.fecha_revision).isValid()
                ? dayjs(record?.fecha_revision).format("DD/MM/YYYY")
                : "—"}
            </span>
          ),
        },
        {
          title: "Calificación",
          dataIndex: "calificacion",
          key: "calificacion",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record.calificacion_final ?? "0.0"}
            </span>
          ),
        },
      ],
    },
    postulaciones: {
      configuracion: {
        cantidad: {
          type: "number",
          label: "Cantidad de registros",
          min: 1,
          placeholder: "Ej. 100",
        },
        ordenar_por: {
          type: "select",
          label: "Ordenar por",
          options: [
            {
              value: "fecha_postulacion",
              label: "Fecha de postulación",
            },
          ],
        },
        direccion: {
          type: "select",
          label: "Dirección",
          options: [
            { value: "ASC", label: "Ascendente" },
            { value: "DESC", label: "Descendente" },
          ],
        },
      },
      filtros: {
        edicion: {
          type: "select",
          options: ediciones.map((e) => ({
            value: e.id_edicion,
            label: capitalizeFirstLetter(e.nombre_edicion),
          })),
        },
        categoria: {
          type: "select",
          options: [
            ...categorias.map((e) => ({
              value: e.edicionesCategoria[0].id_edicion_categoria,
              label: capitalizeFirstLetter(e.nombre_categoria),
            })),
          ],
        },
        participante: {
          type: "select",
          options: participantes.map((e) => ({
            value: e.id_usuario,
            label: `${e.primer_nombre || ""} ${e.segundo_nombre || ""} ${e.primer_apellido || ""} ${e.segundo_apellido || ""}`,
          })),
        },
        genero: {
          type: "select",
          options: [
            { value: "femenino", label: "Femenino" },
            { value: "masculino", label: "Masculino" },
          ],
        },
        nivel_estudio_superior: {
          type: "select",
          options: [
            { label: "Bachiller", value: "bachiller" },
            { label: "Técnico", value: "tecnico" },
            { label: "Tecnólogo", value: "tecnologo" },
            { label: "Profesional", value: "profesional" },
            { label: "Especialización", value: "especializacion" },
            { label: "Maestría", value: "maestria" },
            { label: "Doctorado", value: "doctorado" },
          ],
        },
        estado: {
          type: "select",
          options: [
            { value: "pendiente", label: "Pendiente" },
            { value: "aceptada", label: "Aceptada" },
            { value: "rechazada", label: "Rechazada" },
            { value: "evaluada", label: "Evaluada" },
          ],
        },
        fechas: {
          type: "date-range",
        },
      },
      columnas: [
        {
          title: "Documento",
          dataIndex: "numero_documento",
          key: "numero_documento",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="flex items-center gap-1 font-inter text-xs text-gray-700 justify-center">
              {record.usuario?.tipo_documento}{" "}
              {record.usuario?.numero_documento}
            </span>
          ),
        },
        {
          title: "Nombre",
          key: "nombre",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(record.usuario?.primer_nombre)}{" "}
              {capitalizeFirstLetter(record.usuario?.segundo_nombre)}{" "}
              {capitalizeFirstLetter(record.usuario?.primer_apellido)}{" "}
              {capitalizeFirstLetter(record.usuario?.segundo_apellido)}
            </span>
          ),
        },
        {
          title: "Correo Electrónico",
          dataIndex: "correo_electronico",
          key: "email",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record.usuario?.correo_electronico}
            </span>
          ),
        },
        {
          title: "Categoría",
          key: "categoria",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(
                record.edicionCategoria?.categoria?.nombre_categoria,
              )}
            </span>
          ),
        },
        {
          title: "Edición",
          key: "edicion",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(
                record.edicionCategoria?.edicion?.nombre_edicion,
              )}
            </span>
          ),
        },
        {
          title: "Fecha de Postulación",
          dataIndex: "fecha_postulacion",
          key: "fecha_postulacion",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {dayjs(record.fecha_postulacion).format("DD/MM/YYYY")}
            </span>
          ),
        },
        {
          title: "Estado",
          key: "estado",
          align: "center",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm",
          }),
          render: (_, record) => {
            return (
              <span
                className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
                  record.estado === "aceptada"
                    ? "bg-green-600"
                    : record.estado === "pendiente"
                      ? "bg-blue-600"
                      : record.estado === "evaluada"
                        ? "bg-purple-600"
                        : "bg-red-600"
                }`}
              >
                {capitalizeFirstLetter(record.estado)}
              </span>
            );
          },
        },
      ],
    },
    convocatorias: {
      configuracion: {
        cantidad: {
          type: "number",
          label: "Cantidad máxima de registros",
          min: 1,
          placeholder: "Ej. 100",
        },
        ordenar_por: {
          type: "select",
          label: "Ordenar por",
          options: [
            {
              value: "fecha_envio",
              label: "Fecha de envío",
            },
            {
              value: "intentos_envio",
              label: "Número de envíos",
            },
          ],
        },
        direccion: {
          type: "select",
          label: "Dirección",
          options: [
            { value: "ASC", label: "Ascendente" },
            { value: "DESC", label: "Descendente" },
          ],
        },
      },
      filtros: {
        edicion: {
          type: "select",
          options: ediciones.map((e) => ({
            value: e.id_edicion,
            label: capitalizeFirstLetter(e.nombre_edicion),
          })),
        },
        estado: {
          type: "select",
          options: [
            { value: "enviado", label: "Enviado" },
            { value: "postulado", label: "Postulado" },
          ],
        },
        participante: {
          type: "select",
          options: participantes.map((e) => ({
            value: e.correo_electronico,
            label: `${e.primer_nombre} ${e.segundo_nombre} ${e.primer_apellido} ${e.segundo_apellido}`,
          })),
        },
        numeros_envios: {
          type: "numeric",
        },
        fechas: {
          type: "date-range",
        },
      },
      columnas: [
        {
          title: "Correo Electrónico",
          dataIndex: "correo_electronico",
          key: "email",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record.correo_electronico}
            </span>
          ),
        },
        {
          title: "Edición",
          key: "edicion",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeFirstLetter(record.edicion?.nombre_edicion)}
            </span>
          ),
        },
        {
          title: "N° de Envios",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {record.intentos_envio}
            </span>
          ),
        },
        {
          title: "Fecha de Envio",
          dataIndex: "fecha_envio",
          key: "fecha_envio",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-center! text-sm!",
          }),
          render: (_, record) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {dayjs(record.fecha_envio).format("DD/MM/YYYY")}
            </span>
          ),
        },
        {
          title: "Estado",
          key: "estado",
          align: "center",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm",
          }),
          render: (_, record) => {
            return (
              <span
                className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
                  record.estado_envio === "enviado"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
              >
                {capitalizeWords(record.estado_envio)}
              </span>
            );
          },
        },
      ],
    },
    usuarios: {
      configuracion: {
        cantidad: {
          type: "number",
          label: "Cantidad máxima de registros",
          min: 1,
          placeholder: "Ej. 100",
        },
        ordenar_por: {
          type: "select",
          label: "Ordenar por",
          options: [
            { value: "numero_documento", label: "Documento" },
            { value: "primer_nombre", label: "Nombres" },
            { value: "primer_apellido", label: "Apellidos" },
            { value: "correo_electronico", label: "Correo electrónico" },
            { value: "codigo_institucional", label: "Código institucional" },
            { value: "nivel_estudio_superior", label: "Nivel de estudio" },
          ],
        },
        direccion: {
          type: "select",
          label: "Dirección",
          options: [
            { value: "ASC", label: "Ascendente" },
            { value: "DESC", label: "Descendente" },
          ],
        },
      },
      filtros: {
        tipo: {
          type: "select",
          options: [
            { value: 3, label: "Jurado" },
            { value: 4, label: "Participante" },
          ],
        },
        edicion: {
          type: "select",
          options: ediciones.map((e) => ({
            value: e.id_edicion,
            label: capitalizeFirstLetter(e.nombre_edicion),
          })),
        },
        categoria: {
          type: "select",
          options: [
            ...categorias.map((e) => ({
              value: e.edicionesCategoria[0].id_edicion_categoria,
              label: capitalizeFirstLetter(e.nombre_categoria),
            })),
          ],
        },
        genero: {
          type: "select",
          options: [
            { value: "femenino", label: "Femenino" },
            { value: "masculino", label: "Masculino" },
          ],
        },
        nivel_estudio_superior: {
          type: "select",
          options: [
            { label: "Bachiller", value: "bachiller" },
            { label: "Técnico", value: "tecnico" },
            { label: "Tecnólogo", value: "tecnologo" },
            { label: "Profesional", value: "profesional" },
            { label: "Especialización", value: "especializacion" },
            { label: "Maestría", value: "maestria" },
            { label: "Doctorado", value: "doctorado" },
          ],
        },
      },
      columnas: [
        {
          title: "Documento",
          key: "numero_documento",
          align: "center",
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
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (text) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {text ?? "-"}
            </span>
          ),
        },
        {
          title: "Nivel de Estudio",
          dataIndex: "nivel_estudio_superior",
          key: "nivel",
          onHeaderCell: () => ({
            className: "bg-gray-200! font-inter text-sm text-center!",
          }),
          render: (text) => (
            <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
              {capitalizeWords(text)}
            </span>
          ),
        },
      ],
    },
  };

  const reportOptions = [
    { value: "participaciones", label: "Participaciones" },
    { value: "postulaciones", label: "Postulaciones" },
    { value: "convocatorias", label: "Convocatorias" },
    { value: "usuarios", label: "Usuarios" },
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

  const descargarReporte = async (tipo) => {
    try {
      if (!tipoReporte) {
        toast.error("Seleccione un tipo de reporte");
        return;
      }

      let response;

      if (tipoReporte === "participaciones") {
        if (tipo === "pdf") {
          response = await ReportesService.reportesParticipacionesPDF(filtros);
        }

        if (tipo === "excel") {
          response =
            await ReportesService.reportesParticipacionesExcel(filtros);
        }
      }

      if (tipoReporte === "postulaciones") {
        if (tipo === "pdf") {
          response = await ReportesService.reportesPostulacionesPDF(filtros);
        }

        if (tipo === "excel") {
          response = await ReportesService.reportesPostulacionesExcel(filtros);
        }
      }

      if (tipoReporte === "convocatorias") {
        if (tipo === "pdf") {
          response = await ReportesService.reportesConvocatoriasPDF(filtros);
        }

        if (tipo === "excel") {
          response = await ReportesService.reportesConvocatoriasExcel(filtros);
        }
      }

      if (tipoReporte === "usuarios") {
        if (tipo === "pdf") {
          response = await ReportesService.reportesUsuariosPDF(filtros);
        }

        if (tipo === "excel") {
          response = await ReportesService.reportesUsuariosExcel(filtros);
        }
      }

      const tiposArchivo = {
        pdf: {
          mime: "application/pdf",
          extension: "pdf",
        },

        excel: {
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          extension: "xlsx",
        },
      };

      const archivo = tiposArchivo[tipo];

      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: archivo.mime,
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `reporte_${tipoReporte}_${dayjs().format(
          "YYYYMMDD_HHmmss",
        )}.${archivo.extension}`,
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Reporte descargado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar el reporte");
    }
  };

  return (
    <div className="p-1! w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4!">
        <div className="flex flex-wrap items-center gap-2!">
          <div className="flex! items-center!">
            <IoMdArrowDropright
              className="text-red-600 drop-shadow-md!"
              size={40}
            />
            <span className="font-montserrat text-lg! md:text-xl!">
              Reportes
            </span>
          </div>
          <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
            Generar reportes de PAMCE UFPS
          </span>
        </div>
        <div className="w-full sm:w-72">
          <Select
            size="small"
            value={tipoReporte}
            onChange={(val) => {
              setTipoReporte(val);

              const configuracion = options[val]?.configuracion || {};

              const valoresIniciales = Object.fromEntries(
                Object.entries(configuracion).map(([key, config]) => [
                  key,
                  config.defaultValue,
                ]),
              );

              setFiltros({
                page: 1,
                limit: 10,
                ...valoresIniciales,
              });
            }}
            options={reportOptions}
            placeholder="Seleccionar tipo de reporte..."
            className="w-full font-inter text-xs"
            dropdownClassName="rounded-xl text-xs"
            style={{ height: "32px" }}
          />
        </div>
      </div>

      {tipoReporte && options[tipoReporte] && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-md shadow-gray-100/40 overflow-hidden transition-all duration-300 mt-3!">
          <div className="bg-gray-50/70 border-b border-gray-100 px-6! py-3.5! flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <SlidersHorizontal size={16} className="text-red-500" />

              <span className="font-poppins font-bold text-xs uppercase tracking-wider">
                Filtros y configuración del reporte
              </span>
            </div>

            <span className="text-[10px] font-semibold font-inter bg-blue-50 text-blue-600 px-2.5! py-0.5! rounded-full uppercase">
              {tipoReporte}
            </span>
          </div>

          <div className="px-6! pt-5!">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Object.entries(options[tipoReporte].filtros).map(
                ([key, config]) => {
                  const labelLimpio = key.replaceAll("_", " ");

                  switch (config.type) {
                    case "select":
                      return (
                        <div key={key} className="flex flex-col gap-1.5 group">
                          <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 capitalize flex items-center gap-1 transition-colors">
                            <Funnel size={13} className="text-gray-400" />
                            {config.label || labelLimpio}
                          </label>

                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="label"
                            options={config.options}
                            placeholder={`Todos los / las ${labelLimpio}`}
                            className="w-full font-inter capitalize"
                            value={filtros[key]}
                            disabled={
                              tipoReporte === "usuarios" &&
                              ["edicion", "categoria"].includes(key) &&
                              !filtros.tipo
                            }
                            onChange={(value) => {
                              setFiltros((prev) => ({
                                ...prev,
                                [key]: value,
                                page: 1,
                              }));
                            }}
                          />
                        </div>
                      );

                    case "date-range":
                      return (
                        <React.Fragment key={key}>
                          <div className="flex flex-col gap-1.5 group">
                            <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 flex items-center gap-1 transition-colors">
                              <CalendarDays
                                size={13}
                                className="text-gray-400"
                              />
                              Fecha Inicial
                            </label>

                            <DatePicker
                              locale={esES}
                              format="DD [de] MMMM [del] YYYY"
                              className="w-full rounded-lg h-[32px] border-gray-200 font-inter"
                              placeholder="Seleccionar inicio"
                              allowClear
                              value={
                                filtros.fecha_inicio
                                  ? dayjs(filtros.fecha_inicio)
                                  : null
                              }
                              onChange={(date) => {
                                setFiltros((prev) => ({
                                  ...prev,
                                  fecha_inicio: date
                                    ? dayjs(date).format("YYYY-MM-DD HH:mm:ss")
                                    : null,
                                  page: 1,
                                }));
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 group">
                            <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 flex items-center gap-1 transition-colors">
                              <CalendarDays
                                size={13}
                                className="text-gray-400"
                              />
                              Fecha Final
                            </label>

                            <DatePicker
                              locale={esES}
                              format="DD [de] MMMM [del] YYYY"
                              className="w-full rounded-lg h-[32px] border-gray-200 font-inter"
                              placeholder="Seleccionar fin"
                              allowClear
                              value={
                                filtros.fecha_fin
                                  ? dayjs(filtros.fecha_fin)
                                  : null
                              }
                              onChange={(date) => {
                                setFiltros((prev) => ({
                                  ...prev,
                                  fecha_fin: date
                                    ? dayjs(date).format("YYYY-MM-DD HH:mm:ss")
                                    : null,
                                  page: 1,
                                }));
                              }}
                            />
                          </div>
                        </React.Fragment>
                      );

                    case "numeric":
                      return (
                        <div key={key} className="flex flex-col gap-1.5 group">
                          <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 flex items-center gap-1 transition-colors">
                            <Binary size={13} className="text-gray-400" />
                            {config.label || labelLimpio}
                          </label>

                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            className="w-full rounded-lg border-gray-200"
                            placeholder="Ej. 3"
                            value={filtros[key]}
                            onChange={(value) => {
                              setFiltros((prev) => ({
                                ...prev,
                                [key]: value,
                                page: 1,
                              }));
                            }}
                          />
                        </div>
                      );

                    default:
                      return null;
                  }
                },
              )}
            </div>
          </div>

          <div className="mx-6! my-6! border-t border-gray-100" />

          <div className="px-6! pb-6!">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Object.entries(options[tipoReporte].configuracion || {}).map(
                ([key, config]) => {
                  const labelLimpio = key.replaceAll("_", " ");

                  switch (config.type) {
                    case "select":
                      return (
                        <div key={key} className="flex flex-col gap-1.5 group">
                          <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 capitalize flex items-center gap-1 transition-colors">
                            <Settings size={13} className="text-gray-400" />
                            {config.label || labelLimpio}
                          </label>

                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="label"
                            options={config.options}
                            placeholder={`Seleccionar ${labelLimpio}`}
                            className="w-full font-inter capitalize"
                            value={filtros[key] ?? config.defaultValue}
                            onChange={(value) => {
                              setFiltros((prev) => ({
                                ...prev,
                                [key]: value,
                                page: 1,
                              }));
                            }}
                          />
                        </div>
                      );

                    case "number":
                      return (
                        <div key={key} className="flex flex-col gap-1.5 group">
                          <label className="text-xs font-semibold font-inter text-gray-500 group-hover:text-gray-700 capitalize flex items-center gap-1 transition-colors">
                            <Settings size={13} className="text-gray-400" />
                            {config.label || labelLimpio}
                          </label>

                          <InputNumber
                            min={config.min ?? 1}
                            max={config.max}
                            precision={0}
                            step={1}
                            controls
                            className="w-full rounded-lg border-gray-200"
                            style={{ width: "100%" }}
                            placeholder={config.placeholder || "Ej. 100"}
                            value={filtros[key] ?? config.defaultValue}
                            onChange={(value) => {
                              setFiltros((prev) => ({
                                ...prev,
                                [key]: value,
                                page: 1,
                              }));
                            }}
                          />
                        </div>
                      );

                    default:
                      return null;
                  }
                },
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 mt-4!">
        <button
          onClick={() => descargarReporte("pdf")}
          disabled={!tipoReporte}
          className="
      flex items-center gap-2
      bg-red-600 hover:bg-red-700
      disabled:bg-gray-300 disabled:cursor-not-allowed
      text-white font-inter text-sm font-medium
      px-4! py-2!
      rounded-xl
      shadow-sm
      transition-all duration-200
    "
        >
          <FileDown size={18} />
          Descargar PDF
        </button>

        <button
          onClick={() => descargarReporte("excel")}
          disabled={!tipoReporte}
          className="
      flex items-center gap-2
      bg-emerald-600 hover:bg-emerald-700
      disabled:bg-gray-300 disabled:cursor-not-allowed
      text-white font-inter text-sm font-medium
      px-4! py-2!
      rounded-xl
      shadow-sm
      transition-all duration-200
    "
        >
          <FileSpreadsheet size={18} />
          Descargar Excel
        </button>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4!">
        {loading ? (
          <LoadingInformacion />
        ) : informacion.length > 0 ? (
          <>
            <ConfigProvider locale={esES}>
              <Table
                dataSource={informacion}
                columns={tipoReporte ? options[tipoReporte]?.columnas : []}
                rowKey={(record) =>
                  record.id ||
                  record.id_postulacion ||
                  record.id_usuario ||
                  Math.random()
                }
                pagination={false}
                locale={{ emptyText: <EmptyTable /> }}
              />
            </ConfigProvider>
            <div className="flex justify-between items-center px-1! mt-2!">
              <span className="text-gray-600 font-inter text-sm ml-4!">
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
                de <strong>{pagination?.total || 0}</strong> registros
              </span>
              <Pagination
                current={pagination?.page || 1}
                pageSize={pagination?.limit || 10}
                total={pagination?.total || 0}
                onChange={(page) => {
                  setFiltros((prev) => ({
                    ...prev,
                    page,
                  }));
                }}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <EmptyTable />
        )}
      </div>
    </div>
  );
}

export default ListaParticipantes;
