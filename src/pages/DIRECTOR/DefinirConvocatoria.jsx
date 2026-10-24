import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Form,
  Input,
  InputNumber,
  Table,
  Button,
  Modal,
  Space,
  Switch,
  Select,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  listarRequisitosEdicion,
  crearRequisito,
  agregarRequisitoEdicion,
  eliminarRequisitoEdicion,
  editarRequisitoEdicion,
  editarConfiguracionRequisitoEdicion,
} from "../../features/requisitos/requisitos.slice";
import { listarCategoriasPorEdicion } from "../../features/categorias/categoria.slice";
import { enviarCorreoConvocatoria } from "../../features/ediciones/edicion.slice";
import { CloseOutlined } from "@ant-design/icons";
import { IoIosSave } from "react-icons/io";
import { IoMdAlert } from "react-icons/io";
import { IoSearchCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { Eye, Pencil, Trash2, Paperclip, Download } from "lucide-react";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import { Pagination } from "antd";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import LoadingInformacion from "@/components/LoadingInformacion";

function DefinirConvocatoria() {
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState(null);
  const [isModalEmailVisible, setIsModalEmailVisible] = useState(false);
  const [emails, setEmails] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [isModalViewVisible, setIsModalViewVisible] = useState(false);
  const [emailsManual, setEmailsManual] = useState("");
  const [emailsFile, setEmailsFile] = useState([]);
  const [nombreArchivo, setNombreArchivo] = useState(null);
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const requisitos = useSelector(
    (state) => state.requisitos.requisitos_edicion,
  );
  const categorias = useSelector(
    (state) => state.categorias.categorias_edicion,
  );
  const pagination_requisitos = useSelector(
    (state) => state.requisitos.pagination_requisitos_edicion,
  );
  const loading = useSelector(
    (state) => state.requisitos.loading_requisitos_edicion,
  );
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroObligatorio, setFiltroObligatorio] = useState("TODOS");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!edicion) return;

    document.title = "PAMCE | Inicio de Convocatoria";

    dispatch(listarCategoriasPorEdicion({ id_edicion: edicion.id_edicion }));
    dispatch(
      listarRequisitosEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          tipo_requisito: filtroTipo,
          obligatorio: filtroObligatorio,
          search: searchText,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-requisitos-edicion",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          toastId: "listado-ediciones",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [
    edicion,
    searchText,
    currentPage,
    pageSize,
    filtroTipo,
    filtroObligatorio,
    dispatch,
  ]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const normalizarTexto = (texto) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const requisitoNormalizado = {
        descripcion: normalizarTexto(values.descripcion),
        tipo: normalizarTexto(values.tipo),
      };

      const requisitoMismoNombreYTipo = requisitos.some(
        (req) =>
          normalizarTexto(req.Requisito.descripcion) ===
            requisitoNormalizado?.descripcion &&
          req.tipo_requisito === requisitoNormalizado?.tipo,
      );

      if (requisitoMismoNombreYTipo) {
        toast.error(
          "Este requisito ya existe en esta edición con el mismo tipo.",
        );
        return;
      }

      const requisitoMismoNombreOtroTipo = requisitos.some(
        (req) =>
          normalizarTexto(req.Requisito.descripcion) ===
            requisitoNormalizado?.descripcion &&
          req.tipo_requisito !== requisitoNormalizado?.tipo,
      );

      if (requisitoMismoNombreOtroTipo) {
        toast.warning(
          "Este requisito ya está agregado, pero con otro tipo de requisito.",
        );
        return;
      }

      dispatch(
        crearRequisito({ descripcion: requisitoNormalizado.descripcion }),
      )
        .unwrap()
        .then((res) => {
          dispatch(
            agregarRequisitoEdicion({
              id_edicion: edicion.id_edicion,
              id_requisito: res.requisito.id_requisito,
              tipo: values.tipo,
              obligatorio: values.obligatorio ? values.obligatorio : false,
              config: {
                extensiones_permitidas: values.extensiones_permitidas,
                tamano_max_mb: values.tamano_max_mb,
                max_caracteres: values.max_caracteres,
              },
            }),
          )
            .unwrap()
            .then((res) => {
              toast.success(res.message, {
                toastId: "listado-jurados",
                position: "top-right",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
              });
              setIsModalVisible(false);
              setTipoSeleccionado(null);
              form.resetFields();
              setIsChecked(false);
              dispatch(
                listarRequisitosEdicion({
                  id_edicion: edicion.id_edicion,
                  params: {
                    tipo_requisito: filtroTipo,
                    obligatorio: filtroObligatorio,
                    search: searchText,
                    limit: pageSize,
                    page: currentPage,
                  },
                }),
              );
            });
          form.resetFields();
          setIsChecked(false);
        });
    });
  };

  const handleEditarRequisito = () => {
    form.validateFields().then((values) => {
      if (!requisitoSeleccionado) {
        toast.error("No hay requisito seleccionado");
        return;
      }

      let config = {};

      if (values.tipo === "documento") {
        config = {
          extensiones_permitidas: values.extensiones_permitidas,
          tamano_max_mb: values.tamano_max_mb,
        };
      }

      if (values.tipo === "texto") {
        config = {
          max_caracteres: values.max_caracteres,
        };
      }

      dispatch(
        editarRequisitoEdicion({
          id_requisito_edicion: requisitoSeleccionado.id_requisito_edicion,
          obligatorio: values.obligatorio ? 1 : 0,
          tipo_requisito: values.tipo,
        }),
      )
        .unwrap()
        .then((res) => {
          dispatch(
            editarConfiguracionRequisitoEdicion({
              id_requisito_edicion: requisitoSeleccionado.id_requisito_edicion,
              tipo_requisito: values.tipo,
              config,
            }),
          );
          toast.success(res.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
          setIsModalVisible(false);
          form.resetFields();
          setRequisitoSeleccionado(null);
          setIsEditMode(false);
          setIsChecked(false);
          setTipoSeleccionado(null);
        })
        .catch((err) => {
          console.log("Error al editar", err);
          toast.error("No se pudo actualizar el requisito");
        });
    });
  };

  const handleDelete = (id_requisito_categoria) => {
    Modal.confirm({
      centered: true,
      width: 420,
      icon: null,
      title: (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <IoMdAlert className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="font-inter font-semibold text-base text-gray-800">
              ¿Eliminar este requisito?
            </h3>
          </div>
        </div>
      ),
      content: (
        <div className="mt-4 font-inter text-center text-sm text-gray-600 leading-relaxed">
          Al eliminar este requisito, se perderá toda la información asociada y
          no podrá recuperarse posteriormente.
        </div>
      ),
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        dispatch(eliminarRequisitoEdicion(id_requisito_categoria))
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            dispatch(
              listarRequisitosEdicion({
                id_edicion: edicion.id_edicion,
                params: {
                  tipo_requisito: filtroTipo,
                  obligatorio: filtroObligatorio,
                  search: searchText,
                  limit: pageSize,
                  page: currentPage,
                },
              }),
            );
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const handleSendEmails = () => {
    const listaCorreos = obtenerCorreosFinales();

    if (listaCorreos.length === 0) {
      toast.error("No hay correos para enviar");
      return;
    }

    const invalidos = listaCorreos.filter(
      (correo) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo),
    );

    if (invalidos.length > 0) {
      toast.error(`Correos inválidos: ${invalidos.join(", ")}`);
      return;
    }

    setLoadingSend(true);

    dispatch(
      enviarCorreoConvocatoria({
        listaCorreos,
        id_edicion: edicion.id_edicion,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Invitaciones enviadas correctamente");
        setEmailsManual("");
        setEmailsFile([]);
        setIsModalEmailVisible(false);
      })
      .catch((err) => {
        toast.error(err.message || "Error al enviar correos");
      })
      .finally(() => setLoadingSend(false));
  };

  const columns = [
    {
      title: "Descripción del requisito",
      dataIndex: ["Requisito", "descripcion"],
      key: "descripcion",
      sorter: (a, b) => {
        const descA = a.Requisito?.descripcion || "";
        const descB = b.Requisito?.descripcion || "";
        return descA.localeCompare(descB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex text-justify">
          {capitalizeFirstLetter(text)}
        </span>
      ),
    },
    {
      title: "Tipo de Requisito",
      dataIndex: "tipo_requisito",
      key: "tipo_requisito",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(text)}
        </span>
      ),
    },
    {
      title: "¿Obligatorio?",
      dataIndex: "obligatorio",
      key: "obligatorio",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
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
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <Space>
          <Tooltip title="Visualizar Requisito">
            <button
              className={`p-2! rounded-lg transition bg-blue-50 hover:bg-blue-100`}
              onClick={() => {
                setRequisitoSeleccionado(record);
                setIsModalViewVisible(true);
              }}
            >
              <Eye size={18} className="text-blue-600" />
            </button>
          </Tooltip>
          <Tooltip
            title={
              deshabilitarEditarRequisito
                ? "No se puede editar"
                : "Editar Requisito"
            }
          >
            <button
              className={`p-2! rounded-lg transition
                ${
                  deshabilitarEditarRequisito
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-yellow-50 hover:bg-yellow-100"
                }
              `}
              onClick={() => {
                setIsEditMode(true);
                setRequisitoSeleccionado(record);
                const requisito = record.Requisito;
                const config = record.RequisitosConfig;
                setTipoSeleccionado(record.tipo_requisito);
                setIsChecked(
                  record.obligatorio === true || record.obligatorio === 1,
                );
                form.setFieldsValue({
                  descripcion: capitalizeFirstLetter(requisito.descripcion),
                  tipo: record.tipo_requisito,
                  obligatorio:
                    record.obligatorio === true || record.obligatorio === 1,

                  extensiones_permitidas: config?.extensiones_permitidas
                    ? config.extensiones_permitidas.split(",")
                    : [],
                  tamano_max_mb: config?.tamano_max_mb ?? null,

                  max_caracteres: config?.max_caracteres ?? null,
                });

                setIsModalVisible(true);
              }}
            >
              <Pencil
                size={18}
                className={
                  deshabilitarEditarRequisito
                    ? "text-gray-400"
                    : "text-yellow-600"
                }
              />
            </button>
          </Tooltip>
          <Tooltip
            title={deshabilitarEliminarRequisito ? "No se puede" : "Eliminar"}
          >
            <button
              className={`p-2! rounded-lg transition
                ${
                  deshabilitarEliminarRequisito
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100"
                }
                `}
              onClick={() => handleDelete(record.id_requisito_edicion)}
            >
              <Trash2
                size={18}
                className={
                  deshabilitarEliminarRequisito
                    ? "text-gray-400"
                    : "text-red-600"
                }
              />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const descargarPlantillaCorreos = () => {
    const datos = [["correo_electronico"]];

    const hoja = XLSX.utils.aoa_to_sheet(datos);

    hoja["!cols"] = [{ wch: 35 }];

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Correos");

    XLSX.writeFile(libro, "Plantilla_Correos_Convocatoria.xlsx");
  };

  const procesarCSV = (file) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const regexCorreo = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        const correos = results.data
          .flat()
          .map((e) => e?.toString().trim())
          .filter((correo) => regexCorreo.test(correo));

        setEmailsFile(correos);
        setNombreArchivo(file.name);
      },
    });

    return false;
  };

  const procesarExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const regexCorreo = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      const correos = [
        ...new Set(
          rows
            .flat()
            .map((e) => e?.toString().trim())
            .filter((correo) => regexCorreo.test(correo)),
        ),
      ];

      setEmailsFile(correos);
      setNombreArchivo(file.name);
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const obtenerCorreosFinales = () => {
    const regexCorreo = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const normalizar = (email) => email.trim().toLowerCase();

    const manual = emailsManual
      .split(/[,\n;]+/)
      .map(normalizar)
      .filter((correo) => regexCorreo.test(correo));

    const archivo = emailsFile
      .map(normalizar)
      .filter((correo) => regexCorreo.test(correo));

    return [...new Set([...manual, ...archivo])];
  };

  const hoy = new Date();

  const fechaInicioConvocatoria = edicion?.fecha_inicio_convocatoria
    ? new Date(edicion.fecha_inicio_convocatoria.replace(/\//g, "-"))
    : null;

  const deshabilitarEditarRequisito =
    fechaInicioConvocatoria && fechaInicioConvocatoria < hoy;

  const deshabilitarEliminarRequisito =
    fechaInicioConvocatoria && fechaInicioConvocatoria < hoy;

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

  if (!edicion) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">Cargando edición...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-1! w-full">
        <div className="flex flex-wrap items-center gap-2! mb-2!">
          <div className="flex! items-center!">
            <IoMdArrowDropright
              className="text-red-600 drop-shadow-md!"
              size={40}
            />
            <span className="font-montserrat text-lg! md:text-xl! ml-[-5px]">
              Lista de Requisitos
            </span>
          </div>

          <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
            Requisitos de la {capitalizeFirstLetter(edicion?.nombre_edicion)}
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
            <div className="w-full md:flex-1">
              <Input
                placeholder="Buscar por descripción..."
                value={searchText}
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
                <span className="-ml-0.5!">Tipo:</span>
              </div>
              <Select
                className="w-full sm:w-32 font-inter"
                value={filtroTipo}
                onChange={(value) => {
                  setFiltroTipo(value);
                }}
                options={[
                  { value: "TODOS", label: "Todos" },
                  { value: "documento", label: "Documento" },
                  { value: "texto", label: "Texto" },
                ]}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto -ml-1!">
              <div className="flex items-center gap-1">
                <FaFilter />
                <span className="-ml-0.5!">¿Obligatorio?:</span>
              </div>
              <Select
                className="w-full sm:w-28 font-inter"
                value={filtroObligatorio}
                onChange={(value) => {
                  setFiltroObligatorio(value);
                }}
                options={[
                  { value: "TODOS", label: "Todos" },
                  { value: "true", label: "Sí" },
                  { value: "false", label: "No" },
                ]}
              />
            </div>
            <Tooltip title="Limpiar filtros">
              <button
                onClick={() => {
                  setSearchText("");
                  setFiltroTipo("TODOS");
                  setFiltroObligatorio("TODOS");
                  setCurrentPage(1);
                }}
                className="text-white hover:text-red-300 transition text-xl -ml-1.5!"
              >
                <FaFilterCircleXmark />
              </button>
            </Tooltip>
          </div>
          <button
            onClick={() => setIsModalVisible(true)}
            disabled={
              edicion?.fecha_inicio_convocatoria &&
              edicion?.fecha_inicio_convocatoria < hoy
            }
            className={`-mt-3! bg-white border-2 rounded-xl py-3! flex items-center justify-center font-poppins text-md shadow-md transition w-full md:w-55! gap-1 cursor-pointer
                      ${
                        edicion?.fecha_inicio_convocatoria &&
                        edicion?.fecha_inicio_convocatoria < hoy
                          ? "border-gray-400 text-gray-400 cursor-not-allowed"
                          : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
          >
            <IoMdAddCircle className="text-xl" />
            Agregar Requisito
          </button>
          <button
            onClick={() => {
              setIsModalEmailVisible(true);
            }}
            disabled={
              (edicion?.fecha_inicio_convocatoria &&
                edicion?.fecha_inicio_convocatoria > hoy) ||
              (edicion?.fecha_fin_convocatoria &&
                edicion?.fecha_fin_convocatoria < hoy) ||
              requisitos.length === 0 ||
              categorias.length === 0
            }
            className={`bg-white border-2 rounded-xl! py-3! flex! items-center! justify-center! gap-1! font-poppins text-md! shadow-md transition w-full md:w-40! -mt-3! cursor-pointer
              ${
                (edicion?.fecha_inicio_convocatoria &&
                  edicion?.fecha_inicio_convocatoria > hoy) ||
                (edicion?.fecha_fin_convocatoria &&
                  edicion?.fecha_fin_convocatoria < hoy) ||
                requisitos.length === 0 ||
                categorias.length === 0
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }
            `}
          >
            <MdEmail className="text-xl" />
            Convocar
          </button>
        </div>

        <div className="grid! grid-cols-1! gap-5! w-full!">
          <>
            <div className="w-full overflow-x-auto">
              {loading ? (
                <LoadingInformacion />
              ) : (
                <ConfigProvider locale={esES}>
                  <Table
                    dataSource={requisitos}
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
                  {pagination_requisitos?.total === 0
                    ? 0
                    : (pagination_requisitos?.page - 1) *
                        pagination_requisitos?.limit +
                      1}{" "}
                  -{" "}
                  {Math.min(
                    pagination_requisitos?.page * pagination_requisitos?.limit,
                    pagination_requisitos?.total,
                  )}
                </strong>{" "}
                de <strong>{pagination_requisitos?.total}</strong> registros
              </span>
              <Pagination
                current={pagination_requisitos?.page}
                pageSize={pagination_requisitos?.limit}
                total={pagination_requisitos?.total}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        </div>
        <Modal
          title={
            <div
              style={{
                fontFamily: "Montserrat",
                display: "flex",
                fontSize: "1.2rem",
                marginLeft: "-10px",
              }}
            >
              <IoMdArrowDropright
                size={30}
                color="#e10318"
                style={{
                  filter: "drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.24))",
                }}
              />
              {isEditMode
                ? "Editar Información Requisito"
                : "Agregar Requisito"}
            </div>
          }
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setIsEditMode(false);
            setTipoSeleccionado(null);
            form.resetFields();
            setIsChecked(false);
            setRequisitoSeleccionado(null);
          }}
          footer={null}
          cancelText={
            <span style={{ fontFamily: "Montserrat" }}>
              <CloseOutlined style={{ marginRight: 5 }} />
              Cancelar
            </span>
          }
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Descripción del Requisito{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="descripcion"
              rules={[
                { required: true, message: "Ingrese la descripción" },
                {
                  max: 500,
                  message: "La descripción no puede superar los 500 caracteres",
                },
              ]}
            >
              <Input.TextArea
                maxLength={500}
                style={{
                  fontFamily: "Inter",
                  resize: "none",
                  lineHeight: "1.5",
                  textAlign: "justify",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
                placeholder="Ingresa la descripción del requisito..."
                rows={3}
                disabled={isEditMode}
                onChange={(e) => {
                  let texto = e.target.value
                    .replace(/[\r\n]+/g, " ")
                    .replace(/\s{2,}/g, " ")
                    .trim();

                  if (texto.length > 500) {
                    texto = texto.slice(0, 500);
                  }

                  form.setFieldsValue({ descripcion: texto });
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (pasted.length > 500) {
                    e.preventDefault();
                    toast.warning("Máximo 500 caracteres");
                  }
                }}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: "20px", marginTop: "-10px" }}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Tipo de Requisito <span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="tipo"
                style={{ flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: "Seleccione el tipo de requisito",
                  },
                ]}
              >
                <Select
                  style={{ fontFamily: "Inter" }}
                  placeholder="Seleccione el tipo"
                  onChange={(value) => setTipoSeleccionado(value)}
                >
                  <Select.Option value="documento">Documento</Select.Option>
                  <Select.Option value="texto">Texto</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    ¿Es obligatorio? <span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="obligatorio"
                valuePropName="checked"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                }}
              >
                <Switch
                  checked={isChecked}
                  onChange={(checked) => setIsChecked(checked)}
                  initialValue={false}
                  style={{
                    backgroundColor: isChecked ? "#e10318" : "#ccc",
                  }}
                  checkedChildren="Sí"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </div>
            {tipoSeleccionado === "documento" && (
              <div className="-mt-2! p-3 rounded-xl">
                <Form.Item
                  label={
                    <span
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Extensiones Permitidas{" "}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="extensiones_permitidas"
                  rules={[
                    {
                      required: true,
                      message: "Indique al menos una extensión",
                    },
                  ]}
                >
                  <Select
                    style={{ fontFamily: "Inter" }}
                    mode="multiple"
                    placeholder="Ej: PDF, DOCX, JPG"
                    options={[
                      { value: "pdf", label: "PDF" },
                      { value: "docx", label: "DOCX" },
                      { value: "xlsx", label: "XLSX" },
                      { value: "jpg", label: "JPG" },
                      { value: "png", label: "PNG" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Tamaño máximo (MB) <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="tamano_max_mb"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione el tamaño máximo permitido",
                    },
                    {
                      type: "enum",
                      enum: [5, 10],
                      message: "Seleccione un tamaño de 5 o 10 MB",
                    },
                  ]}
                  className="-mt-2!"
                >
                  <Select
                    style={{ width: "100%", fontFamily: "Inter" }}
                    placeholder="Seleccione el tamaño máximo"
                    options={[
                      { value: 5, label: "5 MB" },
                      { value: 10, label: "10 MB" },
                    ]}
                  />
                </Form.Item>
              </div>
            )}
            {tipoSeleccionado === "texto" && (
              <div className="-mt-2! p-3 rounded-xl">
                <Form.Item
                  label={
                    <span
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Cantidad máxima de caracteres{" "}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="max_caracteres"
                  rules={[
                    {
                      required: true,
                      message: "Ingrese el máximo de caracteres",
                    },
                    {
                      type: "number",
                      min: 500,
                      max: 10000,
                      message: "Debe ser un número entre 500 y 10000",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%", fontFamily: "Inter" }}
                    placeholder="Ej: 500"
                  />
                </Form.Item>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                icon={<IoIosSave style={{ marginRight: 5 }} />}
                style={{
                  fontFamily: "Poppins",
                  borderRadius: "12px",
                  backgroundColor: "#e10318",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={isEditMode ? handleEditarRequisito : handleAdd}
              >
                {isEditMode ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal
          visible={isModalEmailVisible}
          centered
          footer={null}
          onCancel={() => {
            setIsModalEmailVisible(false);
            setEmailsManual("");
            setEmailsFile([]);
          }}
          title={
            <div className="flex! items-center! gap-2! font-montserrat text-lg">
              <MdEmail className="text-blue-600" />
              Enviar Invitaciones
            </div>
          }
        >
          <p className="font-inter text-sm text-gray-600 mb-2!">
            Ingresa correos manualmente o carga un archivo CSV / Excel.
          </p>

          <Input.TextArea
            rows={4}
            value={emailsManual}
            onChange={(e) => setEmailsManual(e.target.value)}
            placeholder="correo1@gmail.com, correo2@gmail.com"
            className="mb-3! bg-gray-200! font-inter resize-none!"
          />

          <div className="bg-blue-50! border! border-blue-200! p-3! rounded-lg! mb-3! text-sm text-blue-700 font-inter">
            El archivo debe contener <strong>solo correos electrónicos</strong>,
            uno por fila o en una sola columna.
          </div>

          <div className="flex! gap-1! mb-3!">
            <Upload
              beforeUpload={(file) =>
                file.name.endsWith(".csv")
                  ? procesarCSV(file)
                  : procesarExcel(file)
              }
              accept=".csv,.xlsx"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} className="font-inter">
                Cargar archivo CSV o Excel
              </Button>
            </Upload>

            <Button
              icon={<Download size={16} />}
              onClick={descargarPlantillaCorreos}
              className="font-inter"
            >
              Descargar Plantilla Archivo
            </Button>
          </div>
          {nombreArchivo && (
            <div className="flex! items-center! justify-between! bg-gray-100! p-2! rounded-lg! mb-3!">
              <span className=" flex! items-center! text-sm font-inter text-gray-700 gap-2">
                <Paperclip size={16} />
                {nombreArchivo}
              </span>
              <Button
                type="text"
                danger
                onClick={() => {
                  setEmailsFile([]);
                  setNombreArchivo(null);
                }}
              >
                Eliminar
              </Button>
            </div>
          )}

          {(emailsFile.length > 0 || emailsManual) && (
            <div className="text-sm text-gray-500 mb-3!">
              Correos validos cargados:{" "}
              <strong>{obtenerCorreosFinales().length}</strong>
            </div>
          )}
          <Button
            type="primary"
            block
            loading={loadingSend}
            onClick={handleSendEmails}
            icon={<MdEmail />}
            style={{
              backgroundColor: "#e10318",
              borderRadius: "12px",
              fontFamily: "Poppins",
              fontWeight: "bold",
            }}
          >
            Enviar Invitaciones
          </Button>
        </Modal>
        <Modal
          title={
            <div
              style={{
                fontFamily: "Montserrat",
                display: "flex",
                fontSize: "1.2rem",
              }}
            >
              <IoMdArrowDropright
                size={30}
                color="#e10318"
                style={{ marginRight: 10 }}
              />
              Información del Requisito
            </div>
          }
          visible={isModalViewVisible}
          onCancel={() => setIsModalViewVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsModalViewVisible(false)}
              style={{
                fontFamily: "Poppins",
                borderRadius: "12px",
                backgroundColor: "#e10318",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Cerrar
            </Button>,
          ]}
          centered
        >
          {requisitoSeleccionado && (
            <div
              style={{
                fontFamily: "Inter",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <p>
                <strong>Descripción:</strong>{" "}
                {requisitoSeleccionado.Requisito.descripcion}
              </p>
              <p>
                <strong>Tipo:</strong>{" "}
                {capitalizeFirstLetter(requisitoSeleccionado.tipo_requisito)}
              </p>
              <p>
                <strong>Obligatorio:</strong>{" "}
                {requisitoSeleccionado.obligatorio === true ||
                requisitoSeleccionado.obligatorio === 1
                  ? "Sí"
                  : "No"}
              </p>

              {requisitoSeleccionado.tipo_requisito === "documento" && (
                <>
                  <p>
                    <strong>Extensiones Permitidas:</strong>{" "}
                    {requisitoSeleccionado.RequisitosConfig
                      ?.extensiones_permitidas || "-"}
                  </p>
                  <p>
                    <strong>Tamaño Máximo (MB):</strong>{" "}
                    {requisitoSeleccionado.RequisitosConfig?.tamano_max_mb ||
                      "-"}
                  </p>
                </>
              )}

              {requisitoSeleccionado.tipo_requisito === "texto" && (
                <p>
                  <strong>Máximo de caracteres:</strong>{" "}
                  {requisitoSeleccionado.RequisitosConfig?.max_caracteres ||
                    "-"}
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default DefinirConvocatoria;
