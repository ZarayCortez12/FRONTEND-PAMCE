import { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { Form, Input, Table, Button, Modal, Select, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearchCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import {
  agregarCategoria,
  agregarCategoriaEdicion,
  editarCategoriaEdicion,
  eliminarCategoriaEdicion,
  cambiarEstado,
  listarCategoriasPorEdicion,
  limpiarCategoriasEdicion,
} from "../../features/categorias/categoria.slice";
import { CloseOutlined } from "@ant-design/icons";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { IoMdAddCircle } from "react-icons/io";
import { Eye, Pencil, Trash2, Ban, CheckCircle } from "lucide-react";
import { Pagination } from "antd";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import { IoMdAlert } from "react-icons/io";
import LoadingInformacion from "@/components/LoadingInformacion";

function ListaCategoriasEdicion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edicion = useSelector((state) => state.ediciones.edicion_en_proceso);
  const categorias = useSelector(
    (state) => state.categorias.categorias_edicion,
  );
  const pagination_categorias = useSelector(
    (state) => state.categorias.pagination,
  );
  const loading = useSelector((state) => state.categorias.loading);

  const [searchText, setSearchText] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    document.title = "PAMCE | Categorías por Edición";

    if (!edicion) return;

    dispatch(limpiarCategoriasEdicion());
    dispatch(
      listarCategoriasPorEdicion({
        id_edicion: edicion.id_edicion,
        params: {
          search: searchText,
          estado: filtroEstado,
          limit: pageSize,
          page: currentPage,
        },
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "listado-categorias-edicion",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          toastId: "listado-categorias",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [searchText, filtroEstado, pageSize, currentPage, edicion, dispatch]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre_categoria",
      key: "nombre_categoria",
      sorter: (a, b) => {
        const descA = a.nombre_categoria || "";
        const descB = b.nombre_categoria || "";
        return descA.localeCompare(descB);
      },
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
      title: "Descripción",
      key: "descripcion",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 text-justify block">
          {capitalizeFirstLetter(record.edicionesCategoria[0]?.descripcion)}
        </span>
      ),
    },
    {
      title: "Número de Ganadores",
      key: "numero_ganadores",
      sorter: (a, b) =>
        (a.EdicionCategoria?.numero_ganadores ?? 0) -
        (b.EdicionCategoria?.numero_ganadores ?? 0),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.edicionesCategoria[0]?.numero_ganadores}
        </span>
      ),
    },
    {
      title: "Estado",
      key: "estado",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => {
        return (
          <span
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs inline-flex items-center justify-center w-20 ${
              record.edicionesCategoria[0]?.estado === "activo"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {capitalizeFirstLetter(record.edicionesCategoria[0]?.estado)}
          </span>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-sm",
      }),
      render: (_, record) => {
        const estado = record.edicionesCategoria[0]?.estado;
        const exists_evaluadas =
          record.edicionesCategoria[0]?.participaciones?.some(
            (cat) => cat.estado === "evaluada",
          );
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Ver Categoría">
              <button
                className={`p-2! rounded-lg transition bg-blue-50 hover:bg-blue-100`}
                onClick={() => {
                  navigate(
                    `${record.edicionesCategoria[0]?.id_edicion_categoria}/informacion-categoria`,
                  );
                }}
              >
                <Eye size={18} className="text-blue-600" />
              </button>
            </Tooltip>
            <Tooltip
              title={
                edicion.fecha_inicio_convocatoria < hoy
                  ? "No se puede editar la categoría"
                  : "Editar Categoría"
              }
            >
              <button
                disabled={edicion.fecha_inicio_convocatoria < hoy}
                onClick={() => {
                  setIsEditMode(true);
                  setCategoriaSeleccionada(record);
                  setIsModalVisible(true);
                  form.setFieldsValue({
                    nombre_categoria: capitalizeFirstLetter(
                      record.nombre_categoria,
                    ),
                    numero_ganadores:
                      record.edicionesCategoria[0].numero_ganadores,
                    descripcion: capitalizeFirstLetter(
                      record.edicionesCategoria[0].descripcion,
                    ),
                  });
                }}
                className={`
                  p-2! rounded-lg transition
                  ${
                    edicion.fecha_inicio_convocatoria < hoy
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-yellow-50 hover:bg-yellow-100"
                  }
                `}
              >
                <Pencil
                  size={18}
                  className={
                    edicion.fecha_inicio_convocatoria < hoy
                      ? "text-gray-400"
                      : "text-yellow-600"
                  }
                />
              </button>
            </Tooltip>
            {edicion.fecha_inicio_convocatoria > hoy ? (
              <Tooltip title="Eliminar Categoría">
                <button
                  className="p-2! rounded-lg transition bg-red-50 hover:bg-red-100"
                  onClick={() => handleDelete(record)}
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </Tooltip>
            ) : estado !== "inactivo" ? (
              <Tooltip title="Desactivar Categoría">
                {}
                <button
                  className="p-2! rounded-lg transition bg-red-50 hover:bg-red-100"
                  disabled={exists_evaluadas}
                  onClick={() => handleDesactivarClick(record)}
                >
                  <Ban size={18} className="text-red-600" />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Activar Categoría">
                <button className="p-2! rounded-lg transition bg-gray-100 cursor-not-allowed">
                  <CheckCircle size={18} className="text-gray-400" />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

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
      const aux = {
        nombre: normalizarTexto(values.nombre_categoria),
        descripcion: normalizarTexto(values.descripcion),
        numero_ganadores: values.numero_ganadores,
      };

      const existe = categorias.some(
        (cat) => normalizarTexto(cat.nombre_categoria) === aux.nombre,
      );

      if (existe) {
        toast.error("Esta categoría ya existe en la edición actual.");
        return;
      }

      dispatch(agregarCategoria({ nombre_categoria: aux.nombre }))
        .unwrap()
        .then((res) => {
          dispatch(
            agregarCategoriaEdicion({
              id_edicion: edicion.id_edicion,
              id_categoria: res.categoria.id_categoria,
              numero_ganadores: aux.numero_ganadores,
              descripcion: aux.descripcion,
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
              form.resetFields();
              dispatch(
                listarCategoriasPorEdicion({
                  id_edicion: edicion.id_edicion,
                  params: {
                    search: searchText,
                    estado: filtroEstado,
                    limit: pageSize,
                    page: currentPage,
                  },
                }),
              );
            })
            .catch((err) => {
              console.error("Error al crear o asociar categoría:", err);
              toast.error(err.message);
            });
        })
        .catch((err) => {
          console.error("Error al crear o asociar categoría:", err);
          toast.error(err.message);
        });
    });
  };

  const handleEditarCategoria = () => {
    form.validateFields().then((values) => {
      const id_edicion_categoria =
        categoriaSeleccionada?.edicionesCategoria[0].id_edicion_categoria;

      if (!id_edicion_categoria) {
        toast.error("No se pudo identificar la categoria a editar");
        return;
      }

      dispatch(
        editarCategoriaEdicion({
          id_edicion_categoria,
          data: {
            descripcion: values.descripcion,
            numero_ganadores: values.numero_ganadores,
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
          setIsEditMode(false);
          setCategoriaSeleccionada(null);
          form.resetFields();
          setIsModalVisible(false);
        });
    });
  };

  const handleDelete = (categoria) => {
    Modal.confirm({
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Estás seguro de eliminar esta categoría de la edición?
        </div>
      ),
      content: (
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <BiSolidCategory
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre Categoría: </strong>
              {capitalizeFirstLetter(categoria.nombre_categoria)}
              <br />
            </div>
          </div>
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
            <IoMdAlert
              className="text-red-500"
              style={{
                fontSize: "70px",
                marginRight: "5px",
                marginTop: "-10px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333" }}>
              <center>
                Recuerda que el acción de eliminar es permanente y no se podrá
                recuperar la información de la categoria.
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
          eliminarCategoriaEdicion(
            categoria.edicionesCategoria[0]?.id_edicion_categoria,
          ),
        )
          .unwrap()
          .then((res) => {
            toast.success(res.message, {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              draggable: true,
            });
            dispatch(
              listarCategoriasPorEdicion({
                id_edicion: edicion.id_edicion,
                params: {
                  search: searchText,
                  estado: filtroEstado,
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

  const handleDesactivarClick = (datos) => {
    let observacion = "";

    Modal.confirm({
      icon: null,
      title: (
        <div
          style={{
            fontFamily: "Inter",
            display: "flex",
            fontSize: "1rem",
          }}
        >
          ¿Está seguro de inactivar esta categoría de la edición en proceso?
        </div>
      ),

      content: (
        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <BiSolidCategory
              style={{
                fontSize: "20px",
                color: "#e10318",
                marginRight: "15px",
              }}
            />
            <div style={{ fontFamily: "Inter", marginLeft: "-10px" }}>
              <strong>Nombre: </strong>
              {capitalizeFirstLetter(datos.nombre_categoria)}
            </div>
          </div>

          <div style={{ fontFamily: "Inter" }}>
            <strong>
              Motivo de Inactivación <span style={{ color: "red" }}>*</span>
            </strong>
            <Input.TextArea
              rows={3}
              placeholder="Ingrese el motivo de la inactivación"
              style={{ marginTop: "5px", resize: "none" }}
              onChange={(e) => {
                observacion = e.target.value;
              }}
              className="bg-gray-200! font-inter"
            />
          </div>
          <span
            style={{
              display: "flex",
              background: "hsl(354, 65%, 85%)",
              padding: "10px",
              borderRadius: "10px",
              fontFamily: "Inter",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <IoMdAlert
              style={{
                fontSize: "65px",
                color: "#e10318",
                marginRight: "8px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#333", margin: 0 }}>
              Recuerda que cancelar esta categoría es una acción permanente y no
              se podrá recuperar la información ni activar de nuevo para
              postulaciones.
            </p>
          </span>
        </div>
      ),

      okText: "Sí, inactivar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        if (!observacion.trim()) {
          toast.warning("Debe ingresar el motivo de la cancelación");
          return Promise.reject();
        }

        return dispatch(
          cambiarEstado({
            id_edicion_categoria:
              datos?.edicionesCategoria[0]?.id_edicion_categoria,
            estado: "inactivo",
            observacion: observacion,
          }),
        )
          .unwrap()
          .then((res) => {
            toast.success(
              res.message ? "Categoria inactivada correctamente" : null,
            );
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
  };

  const hoy = new Date().toLocaleDateString("en-CA");

  if (!edicion) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">Cargando edición...</span>
      </div>
    );
  }

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
            Lista de Categorías
          </span>
        </div>

        <span className="text-xs! md:text-sm! text-gray-500! font-montserrat ml-2 mt-0.5!">
          Categorías de la {capitalizeFirstLetter(edicion.nombre_edicion)}
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
              className="w-full sm:w-17 font-inter"
              options={[
                { label: "10", value: 10 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
            />
          </Tooltip>
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por nombre o descripción..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-white font-inter w-full md:w-auto">
            <div className="flex items-center gap-1">
              <FaFilter />
              <span className="-ml-0.5!">Estado:</span>
            </div>
            <Select
              className="w-full sm:w-24 font-inter"
              value={filtroEstado}
              onChange={(v) => {
                setFiltroEstado(v);
                setCurrentPage(1);
              }}
              options={[
                { value: "TODOS", label: "Todos" },
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" },
              ]}
            />
          </div>
        </div>
        <button
          onClick={() => {
            setCategoriaSeleccionada(null);
            setIsModalVisible(true);
          }}
          className={`bg-white border-2 rounded-xl! py-3! flex! items-center! justify-center! gap-1! font-poppins text-md! shadow-md transition w-full md:w-55! -mt-3!
            ${
              edicion.fecha_inicio_convocatoria < hoy
                ? "border-gray-400 text-gray-400 cursor-not-allowed!"
                : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            }
            `}
        >
          <IoMdAddCircle className="text-xl" />
          Agregar Categoría
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
                  columns={columns}
                  dataSource={categorias}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: <EmptyTable /> }}
                />
              </ConfigProvider>
            )}
          </div>
          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-gray-600 font-inter text-sm">
              Mostrando{" "}
              <strong>
                {pagination_categorias?.total === 0
                  ? 0
                  : (pagination_categorias?.page - 1) *
                      pagination_categorias?.limit +
                    1}{" "}
                -{" "}
                {Math.min(
                  pagination_categorias?.page * pagination_categorias?.limit,
                  pagination_categorias?.total,
                )}
              </strong>{" "}
              de <strong>{pagination_categorias?.total}</strong> registros
            </span>
            <Pagination
              current={pagination_categorias?.page}
              pageSize={pagination_categorias?.limit}
              total={pagination_categorias?.total}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      </div>
      <Modal
        title={
          <div className="flex items-center font-montserrat text-lg">
            <IoMdArrowDropright
              size={30}
              className="text-red-600 drop-shadow-md"
            />
            {isEditMode ? "Editar Información Categoría" : "Agregar Categoría"}
          </div>
        }
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditMode(false);
          form.resetFields();
          setCategoriaSeleccionada(null);
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
          <div className="grid! grid-cols-1! md:grid-cols-2! gap-4!">
            <Form.Item
              label={
                <span className="font-inter font-semibold text-sm">
                  Nombre de la Categoría <span className="text-red-600">*</span>
                </span>
              }
              name="nombre_categoria"
              rules={[
                {
                  required: true,
                  message: "Ingrese el nombre de la categoría",
                },
              ]}
            >
              <Input
                placeholder="Nombre de la categoría"
                disabled={isEditMode}
                className="bg-gray-200! font-inter rounded-lg"
                onChange={(e) => {
                  form.setFieldsValue({ nombre_categoria: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-inter font-semibold text-sm">
                  Número de Ganadores <span className="text-red-600">*</span>
                </span>
              }
              name="numero_ganadores"
              rules={[
                { required: true, message: "Ingrese el número de ganadores" },
              ]}
            >
              <Input
                type="number"
                min={1}
                placeholder="Ej: 3"
                className="bg-gray-200! font-inter rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span className="font-inter font-semibold text-sm">
                Descripción <span className="text-red-600">*</span>
              </span>
            }
            name="descripcion"
            rules={[
              { required: true, message: "Ingrese la descripción" },
              {
                max: 1000,
                message: "La descripción no puede superar los 500 caracteres",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Escribe la descripción de la categoría..."
              className="bg-gray-200! font-inter rounded-lg text-justify resize-none"
              onChange={(e) => {
                form.setFieldsValue({ descripcion: e.target.value });
              }}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <div className="flex justify-center mt-4">
            <Button
              type="primary"
              icon={<IoIosSave className="mr-1" />}
              className="bg-red-600! hover:bg-red-700! border-none font-poppins font-semibold! rounded-xl px-6 py-2"
              onClick={isEditMode ? handleEditarCategoria : handleAdd}
            >
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ListaCategoriasEdicion;
