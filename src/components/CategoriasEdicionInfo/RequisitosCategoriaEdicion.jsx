import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Modal,
  Space,
  Tooltip,
  ConfigProvider,
  Pagination,
  Select,
  Form,
  Switch,
  InputNumber,
  Button,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import { Eye, Trash2, Pencil } from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import {
  listarRequisitosPorCategoriaEdicion,
  obtenerConfiguracionRequisitoDeCategoriaEdicion,
} from "../../features/requisitos/requisitos.slice";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { IoIosSave, IoMdArrowDropright, IoMdAddCircle } from "react-icons/io";
import {
  crearRequisito,
  agregarRequisitoCategoriaEdicion,
  editarRequisitoCategoriaEdicion,
  editarConfiguracionRequisitoCategoriaEdicion,
  eliminarRequisitoCategoriaEdicion,
} from "../../features/requisitos/requisitos.slice";

function RequisitosCategoriaEdicion({ id_edicion_categoria }) {
  const dispatch = useDispatch();
  const hoy = new Date().toLocaleDateString("en-CA");
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const requisitos = useSelector(
    (state) => state.requisitos.requisitos_categoria,
  );
  const pagination_requisitos = useSelector(
    (state) => state.requisitos.pagination_requisitos_categoria,
  );
  const loading = useSelector(
    (state) => state.requisitos.loading_requisitos_categoria,
  );
  const configuracion = useSelector((state) => state.requisitos.configuracion);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroObligatorio, setFiltroObligatorio] = useState("TODOS");
  const [visible, setVisible] = useState(false);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [form] = Form.useForm();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!id_edicion_categoria) return;
    dispatch(
      listarRequisitosPorCategoriaEdicion({
        id_edicion_categoria: id_edicion_categoria,
        params: {
          tipo_requisito: filtroTipo,
          obligatorio: filtroObligatorio,
          search: searchText,
          limit: pageSize,
          page: currentPage,
        },
      }),
    );
  }, [
    searchText,
    currentPage,
    pageSize,
    filtroTipo,
    filtroObligatorio,
    id_edicion_categoria,
    dispatch,
  ]);

  useEffect(() => {
    if (!requisitoSeleccionado) return;
    dispatch(
      obtenerConfiguracionRequisitoDeCategoriaEdicion(
        requisitoSeleccionado.id_requisito_edicion_categoria,
      ),
    );
  }, [requisitoSeleccionado, dispatch]);

  const columnsRequisitos = [
    {
      title: "Descripción del Requisito",
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
        <span className="font-inter text-sm text-gray-700 text-justify block ">
          {capitalizeFirstLetter(text)}
        </span>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "tipo_requisito",
      key: "tipo_requisito",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (text) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center">
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
                setVisible(true);
              }}
            >
              <Eye size={18} className="text-blue-600" />
            </button>
          </Tooltip>
          <Tooltip
            title={
              edicion?.fecha_inicio_convocatoria &&
              edicion?.fecha_inicio_convocatoria <= hoy
                ? "No se puede editar"
                : "Editar Requisito"
            }
          >
            <button
              className={`p-2! rounded-lg transition
                ${
                  edicion?.fecha_inicio_convocatoria &&
                  edicion?.fecha_inicio_convocatoria <= hoy
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-yellow-50 hover:bg-yellow-100"
                }
              `}
              disabled={
                edicion?.fecha_inicio_convocatoria &&
                edicion?.fecha_inicio_convocatoria <= hoy
              }
              onClick={() => {
                setIsEditMode(true);
                setRequisitoSeleccionado(record);

                const requisito = record.Requisito;
                const config = record.RequisitosCategoriaConfig;

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
                  edicion?.fecha_inicio_convocatoria &&
                  edicion?.fecha_inicio_convocatoria <= hoy
                    ? "text-gray-400"
                    : "text-yellow-600"
                }
              />
            </button>
          </Tooltip>
          <Tooltip
            title={
              edicion?.fecha_inicio_convocatoria &&
              edicion?.fecha_inicio_convocatoria <= hoy
                ? "No se puede"
                : "Eliminar"
            }
          >
            <button
              className={`p-2! rounded-lg transition
                ${
                  edicion?.fecha_inicio_convocatoria &&
                  edicion?.fecha_inicio_convocatoria <= hoy
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100"
                }
                `}
              disabled={
                edicion?.fecha_inicio_convocatoria &&
                edicion?.fecha_inicio_convocatoria <= hoy
              }
              onClick={() =>
                handleDelete(record.id_requisito_edicion_categoria)
              }
            >
              <Trash2
                size={18}
                className={
                  edicion?.fecha_inicio_convocatoria &&
                  edicion?.fecha_inicio_convocatoria <= hoy
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
          "Este requisito ya existe en esta categoría con el mismo tipo.",
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
            agregarRequisitoCategoriaEdicion({
              id_edicion_categoria: id_edicion_categoria,
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
                listarRequisitosPorCategoriaEdicion({
                  id_edicion_categoria: id_edicion_categoria,
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
        editarRequisitoCategoriaEdicion({
          id_requisito_edicion_categoria:
            requisitoSeleccionado.id_requisito_edicion_categoria,
          obligatorio: values.obligatorio ? 1 : 0,
          tipo_requisito: values.tipo,
        }),
      )
        .unwrap()
        .then((res) => {
          dispatch(
            editarConfiguracionRequisitoCategoriaEdicion({
              id_requisito_edicion_categoria:
                requisitoSeleccionado.id_requisito_edicion_categoria,
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

  const handleDelete = (id_requisito_edicion_categoria) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de eliminar este requisito?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <span
            style={{
              display: "flex",
              background: "hsl(354, 65%, 85%)",
              padding: "10px",
              borderRadius: "10px",
              marginLeft: "-30px",
              fontFamily: "Inter",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <p style={{ fontSize: "12px", color: "#333" }}>
              <center>
                Recuerda que el acción de eliminar es permanente y no se podrá
                recuperar la información de este requisito.
              </center>
            </p>
          </span>
        </div>
      ),
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        dispatch(
          eliminarRequisitoCategoriaEdicion(id_requisito_edicion_categoria),
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span>Tipo:</span>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span>¿Obligatorio?:</span>
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
              className="text-white hover:text-red-300 transition text-xl"
            >
              <FaFilterCircleXmark />
            </button>
          </Tooltip>
        </div>
        <button
          onClick={() => setIsModalVisible(true)}
          disabled={
            edicion?.fecha_inicio_convocatoria &&
            edicion?.fecha_inicio_convocatoria <= hoy
          }
          className={`-mt-3! bg-white border-2 rounded-xl py-3! flex items-center justify-center font-poppins text-md shadow-md transition w-full md:w-47! gap-1 cursor-pointer
                      ${
                        edicion?.fecha_inicio_convocatoria &&
                        edicion?.fecha_inicio_convocatoria <= hoy
                          ? "border-gray-400 text-gray-400 cursor-not-allowed"
                          : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Requisito
        </button>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        {loading ? (
          <LoadingInformacion />
        ) : (
          <ConfigProvider locale={esES}>
            <Table
              dataSource={requisitos}
              columns={columnsRequisitos}
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
      </div>
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
              style={{ marginRight: -5 }}
            />
            Información del Requisito
          </div>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[]}
        centered
      >
        {configuracion && (
          <div
            style={{ fontFamily: "Inter", fontSize: "14px", lineHeight: "1.6" }}
          >
            <p className="text-justify">
              <strong>Descripción:</strong>{" "}
              {requisitoSeleccionado?.Requisito.descripcion}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              {capitalizeFirstLetter(requisitoSeleccionado?.tipo_requisito)}
            </p>
            <p>
              <strong>Obligatorio:</strong>{" "}
              {requisitoSeleccionado?.obligatorio === true ||
              requisitoSeleccionado?.obligatorio === 1
                ? "Sí"
                : "No"}
            </p>

            {requisitoSeleccionado?.tipo_requisito === "documento" && (
              <>
                <p>
                  <strong>Extensiones Permitidas:</strong>{" "}
                  {configuracion?.extensiones_permitidas || "-"}
                </p>
                <p>
                  <strong>Tamaño Máximo (MB):</strong>{" "}
                  {configuracion?.tamano_max_mb || "-"}
                </p>
              </>
            )}
            {requisitoSeleccionado?.tipo_requisito === "texto" && (
              <p>
                <strong>Máximo de caracteres:</strong>{" "}
                {configuracion?.max_caracteres || "-"}
              </p>
            )}
          </div>
        )}
      </Modal>
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
            />{" "}
            {isEditMode ? "Editar Información Requisito" : "Agregar Requisito"}
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
                { required: true, message: "Seleccione el tipo de requisito" },
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
    </>
  );
}

export default RequisitosCategoriaEdicion;
