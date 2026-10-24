import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Table,
  Button,
  Modal,
  Space,
  Tooltip,
  ConfigProvider,
  Pagination,
  InputNumber,
  Collapse,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { obtenerCategoria } from "../features/categorias/categoria.slice";
import { CloseOutlined } from "@ant-design/icons";
import {
  IoIosSave,
  IoMdArrowDropright,
  IoIosInformationCircle,
  IoMdAddCircle,
} from "react-icons/io";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import { Eye, Pencil, FileText, Trash2 } from "lucide-react";
import imagen_no_data from "../images/imagen_no_data.jpg";
import {
  listarRubricasPorCategoriaEdicion,
  editarPorcentajeCriterio,
  listarRubricasFiltradasPorCategoria,
  agregarRubricaAEdicionCategoria,
  agregarPorcentajeCriterio,
  editarPorcentajeRubrica,
  eliminarRubricaAEdicionCategoria,
  crearRubrica,
  crearCriterio,
  crearRubricaCriterio,
  obtenerRubricaCriterio,
} from "../features/evaluacion/evaluacion.slice";
import {
  MdRule,
  MdDescription,
  MdListAlt,
  MdDeleteSweep,
} from "react-icons/md";

function RubricaCategoriaEdicion({ edicionEnProceso, id_edicion_categoria }) {
  const rubricaCreada = useSelector((state) => state.evaluacion.rubricaCreada);
  const [crearNueva, setCrearNueva] = useState(false);
  const [nuevaRubrica, setNuevaRubrica] = useState({
    nombre: "",
    descripcion: "",
  });
  const [criteriosNuevaRubrica, setCriteriosNuevaRubrica] = useState([
    { nombre: "", descripcion: "" },
  ]);
  const [pasoAgregar, setPasoAgregar] = useState(1);
  const [rubricaAConfigurar, setRubricaAConfigurar] = useState(null);
  const [porcentajesCriterios, setPorcentajesCriterios] = useState({});
  const [porcentajeTotalRubrica, setPorcentajeTotalRubrica] = useState(0);
  const [modalEditarRubrica, setModalEditarRubrica] = useState(false);
  const [rubricaEditar, setRubricaEditar] = useState(null);
  const [nuevoPorcentajeRubrica, setNuevoPorcentajeRubrica] = useState(null);
  const [modalEliminarRubrica, setModalEliminarRubrica] = useState(false);
  const [rubricaAEliminar, setRubricaAEliminar] = useState(null);

  const iniciarConfiguracion = (rubrica) => {
    setRubricaAConfigurar(rubrica);
    const iniciales = {};
    rubrica.RubricaCriterios.forEach((rc) => {
      iniciales[rc.id_rubrica_criterio] = 0;
    });
    setPorcentajesCriterios(iniciales);
    setPasoAgregar(2);
  };
  const [modalAgregarRubrica, setModalAgregarRubrica] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [pageSizeRubricasCategoria, setPageSizeRubricasCategoria] = useState(5);
  const [searchTextRubricasCategoria, setSearchTextRubricasCategoria] =
    useState("");
  const rubricasCategoriaEdicion = useSelector(
    (state) => state.evaluacion.rubricasCategoriaEdicion,
  );
  const rubricas = useSelector((state) => state.evaluacion.rubricas);
  const [currentPageRubricasCategoria, setCurrentPageRubricasCategoria] =
    useState(1);
  const listaRubricasCategoria = Array.isArray(rubricasCategoriaEdicion)
    ? rubricasCategoriaEdicion
    : [];
  const listaRubricasCategoriaFiltrados = listaRubricasCategoria.filter((r) => {
    const nombre = r.rubrica.nombre.toLowerCase();
    const descripcion = r.rubrica.descripcion.toLowerCase();
    return (
      nombre.includes(searchTextRubricasCategoria) ||
      descripcion.includes(searchTextRubricasCategoria)
    );
  });
  const startIndexRubricasCategoria =
    (currentPageRubricasCategoria - 1) * pageSizeRubricasCategoria;
  const endIndexRubricasCategoria =
    startIndexRubricasCategoria + pageSizeRubricasCategoria;
  const datosPaginadosRubricasCategoria = listaRubricasCategoriaFiltrados.slice(
    startIndexRubricasCategoria,
    endIndexRubricasCategoria,
  );
  const [modalRubricaVisible, setModalRubricaVisible] = useState(false);
  const [rubricaSeleccionada, setRubricaSeleccionada] = useState(null);
  const columnsRubricas = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.rubrica.nombre.localeCompare(b.rubrica.nombre),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.rubrica.nombre)}
        </span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) =>
        a.rubrica.descripcion.localeCompare(b.rubrica.descripcion),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.rubrica.descripcion)}
        </span>
      ),
    },
    {
      title: "Valor",
      key: "valor",
      align: "center",
      sorter: (a, b) => a.porcentaje - b.porcentaje,
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => {
        const porcentaje = parseFloat(record.porcentaje || 0);

        return (
          <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
            {porcentaje % 1 === 0
              ? porcentaje.toFixed(0)
              : porcentaje.toFixed(2)}
            %
          </span>
        );
      },
    },
    {
      title: "Nº de Criterios",
      key: "numero_criterios",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.rubrica.RubricaCriterios.length}
        </span>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver Rubrica">
            <button
              className={`p-2! rounded-lg transition bg-blue-50 hover:bg-blue-100`}
              onClick={() => {
                setRubricaSeleccionada(record);
                setModalRubricaVisible(true);
              }}
            >
              <Eye size={18} className="text-blue-600" />
            </button>
          </Tooltip>

          <Tooltip
            title={
              deshabilitarEditarPorcentajeRubrica
                ? "No se puede editar porcentaje"
                : "Editar porcentaje"
            }
          >
            <button
              disabled={deshabilitarEditarPorcentajeRubrica}
              onClick={() => abrirModalEditarRubrica(record)}
              className={`p-2! rounded-lg transition
                ${
                  deshabilitarEditarPorcentajeRubrica
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-yellow-50 hover:bg-yellow-100"
                }
              `}
            >
              <Pencil
                size={18}
                className={
                  deshabilitarEditarPorcentajeRubrica
                    ? "text-gray-400"
                    : "text-yellow-600"
                }
              />
            </button>
          </Tooltip>
          <Tooltip
            title={
              deshabilitarEliminarRubrica ? "No se puede eliminar" : "Eliminar"
            }
          >
            <button
              className={`p-2! rounded-lg transition
                ${
                  deshabilitarEliminarRubrica
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100"
                }
                `}
              onClick={() => abrirModalEliminarRubrica(record)}
            >
              <Trash2
                size={18}
                className={
                  deshabilitarEliminarRubrica ? "text-gray-400" : "text-red-600"
                }
              />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const [pageSizeRubricaCriterios, setPageSizeRubricaCriterios] = useState(4);
  const [currentPageRubricaCriterios, setCurrentPageRubricaCriterios] =
    useState(1);
  const startIndexRubricaCriterios =
    (currentPageRubricaCriterios - 1) * pageSizeRubricaCriterios;
  const endIndexRubricaCriterios =
    startIndexRubricaCriterios + pageSizeRubricaCriterios;
  const datosPaginadosRubricaCriterios =
    rubricaSeleccionada?.rubrica.RubricaCriterios.slice(
      startIndexRubricaCriterios,
      endIndexRubricaCriterios,
    );
  useEffect(() => {
    if (!rubricaSeleccionada) return;

    const rubricaActualizada = rubricasCategoriaEdicion.find(
      (r) => r.id === rubricaSeleccionada.id,
    );

    if (rubricaActualizada) {
      setRubricaSeleccionada(rubricaActualizada);
    }
  }, [rubricasCategoriaEdicion]);

  const columnsCriterios = [
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) => a.Criterio.nombre.localeCompare(b.Criterio.nombre),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.Criterio.nombre)}
        </span>
      ),
    },
    {
      title: "Descripción",
      key: "descripcion",
      sorter: (a, b) =>
        a.Criterio.descripcion.localeCompare(b.Criterio.descripcion),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.Criterio.descripcion)}
        </span>
      ),
    },
    {
      title: "Peso (%)",
      key: "peso",
      align: "center",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),

      render: (_, record) => {
        const porcentajeActual = parseFloat(record.porcentaje || 0);
        if (editandoCriterioId === record.id_ecrc) {
          return (
            <div className="flex justify-center items-center gap-2">
              <InputNumber
                min={0}
                max={100}
                value={nuevoPorcentaje}
                onChange={(v) => setNuevoPorcentaje(v)}
                size="small"
                className="w-full md:w-23"
                addonAfter="%"
              />
              <Button
                type="primary"
                size="small"
                icon={<IoIosSave />}
                onClick={() => guardarPorcentajeCriterio(record)}
              />
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditandoCriterioId(null);
                  setNuevoPorcentaje(null);
                }}
              />
            </div>
          );
        }
        return (
          <div className="flex justify-center items-center gap-2">
            <span className="font-inter text-sm text-gray-700">
              {porcentajeActual}%
            </span>

            <Tooltip title="Editar porcentaje">
              <Button
                size="small"
                type="text"
                icon={<Pencil size={14} />}
                //disabled={deshabilitarEditarPorcentajeCriterio}
                hidden={deshabilitarEditarPorcentajeCriterio}
                onClick={() => {
                  setEditandoCriterioId(record.id_ecrc);
                  setNuevoPorcentaje(porcentajeActual);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const [editandoCriterioId, setEditandoCriterioId] = useState(null);
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState(null);
  const calcularTotalCriterios = (rubrica) => {
    if (!rubrica?.rubrica?.RubricaCriterios) return 0;

    return rubrica?.rubrica?.RubricaCriterios.reduce((total, criterio) => {
      const valor = parseFloat(criterio.porcentaje || 0);
      return total + valor;
    }, 0);
  };
  const guardarPorcentajeCriterio = (record) => {
    if (nuevoPorcentaje === null) {
      toast.error("Ingrese un porcentaje");
      return;
    }

    if (nuevoPorcentaje < 0 || nuevoPorcentaje > 100) {
      toast.error("El porcentaje debe estar entre 0 y 100");
      return;
    }

    const totalActual = calcularTotalCriterios(rubricaSeleccionada);

    const porcentajeAnterior = parseFloat(record.porcentaje || 0);

    const nuevoTotal =
      totalActual - porcentajeAnterior + Number(nuevoPorcentaje);

    if (nuevoTotal > 100) {
      toast.error(
        `La suma de los criterios no puede superar 100%. Actualmente sería: ${nuevoTotal}%`,
      );
      return;
    }

    dispatch(
      editarPorcentajeCriterio({
        id_ecrc: record.id_ecrc,
        porcentaje: nuevoPorcentaje,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Porcentaje del criterio actualizado");
        dispatch(listarRubricasPorCategoriaEdicion(id_edicion_categoria));
        setEditandoCriterioId(null);
        setNuevoPorcentaje(null);
      })
      .catch(() => {
        toast.error("Error al actualizar");
      });
  };

  const guardarPorcentajeRubrica = () => {
    if (nuevoPorcentajeRubrica === null) {
      toast.error("Ingrese un porcentaje");
      return;
    }

    if (nuevoPorcentajeRubrica <= 0 || nuevoPorcentajeRubrica > 100) {
      toast.error("El porcentaje debe estar entre 1 y 100");
      return;
    }

    const totalSinEsta = listaRubricasCategoria.reduce((sum, r) => {
      if (r.id_rubrica === rubricaEditar.id_rubrica) return sum;
      return sum + Number(r.porcentaje || 0);
    }, 0);

    const nuevoTotal = totalSinEsta + Number(nuevoPorcentajeRubrica);

    if (nuevoTotal > 100) {
      toast.error(
        `No se puede editar el porcentaje de la rúbrica, se supera el 100%. Total sería: ${nuevoTotal}%`,
      );
      return;
    }

    dispatch(
      editarPorcentajeRubrica({
        id_ecr: rubricaEditar.id_ecr,
        porcentaje: nuevoPorcentajeRubrica,
      }),
    )
      .unwrap()
      .then((res) => {
        toast.success("Rúbrica editada");
        dispatch(listarRubricasPorCategoriaEdicion(id_edicion_categoria));
        setModalEditarRubrica(false);
        setRubricaEditar(null);
        setNuevoPorcentajeRubrica(null);
      })
      .catch((err) => {
        console.log("Error al editar", err);
      });
  };

  useEffect(() => {
    if (!edicionEnProceso?.id_edicion) return;
    document.title = "PAMCE | Información de la Categoría";
    dispatch(obtenerCategoria(id_edicion_categoria))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "categoria-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => console.log("Error al obtener la categoria", err));

    dispatch(listarRubricasPorCategoriaEdicion(id_edicion_categoria))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => console.log("Error al obtener la categoria", err));
    dispatch(listarRubricasFiltradasPorCategoria(id_edicion_categoria));
  }, [edicionEnProceso?.id_edicion, id_edicion_categoria, dispatch]);

  const hoy = new Date();
  const fechaInicioEvaluacion = edicionEnProceso?.fecha_inicio_evaluacion
    ? new Date(edicionEnProceso.fecha_inicio_evaluacion.replace(/\//g, "-"))
    : null;
  const deshabilitarAgregarRubrica =
    fechaInicioEvaluacion && fechaInicioEvaluacion < hoy;
  const deshabilitarEditarPorcentajeRubrica =
    fechaInicioEvaluacion && fechaInicioEvaluacion < hoy;
  const deshabilitarEditarPorcentajeCriterio =
    fechaInicioEvaluacion && fechaInicioEvaluacion < hoy;
  const deshabilitarEliminarRubrica =
    fechaInicioEvaluacion && fechaInicioEvaluacion < hoy;

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

  const calcularTotalRubricas = () => {
    return listaRubricasCategoria.reduce((total, r) => {
      return total + Number(r.porcentaje || 0);
    }, 0);
  };

  const calcularDisponibleEdicion = () => {
    if (!rubricaEditar) return 0;

    const total = listaRubricasCategoria.reduce((sum, r) => {
      return sum + Number(r.porcentaje || 0);
    }, 0);

    const actual = Number(rubricaEditar.porcentaje || 0);

    return 100 - (total - actual);
  };

  const totalUsadoRubricas = calcularTotalRubricas();

  const maxDisponibleRubrica = 100 - totalUsadoRubricas;

  const abrirModalEditarRubrica = (record) => {
    setRubricaEditar(record);
    setNuevoPorcentajeRubrica(Number(record.porcentaje || 0));
    setModalEditarRubrica(true);
  };

  const rubricasIncompletas = totalUsadoRubricas !== 100;

  const abrirModalEliminarRubrica = (record) => {
    setRubricaAEliminar(record);
    setModalEliminarRubrica(true);
  };

  const normalizarTexto = (texto = "") => {
    return texto
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[\r\n]+/g, " ");
  };

  const guardarNuevaRubrica = () => {
    const rubricaNormalizada = {
      ...nuevaRubrica,
      nombre: normalizarTexto(nuevaRubrica.nombre),
      descripcion: normalizarTexto(nuevaRubrica.descripcion),
    };

    if (!rubricaNormalizada.nombre) {
      toast.error("Ingrese nombre de la rúbrica");
      return;
    }

    const criteriosNormalizados = criteriosNuevaRubrica.map((c) => ({
      ...c,
      nombre: normalizarTexto(c.nombre),
      descripcion: normalizarTexto(c.descripcion),
    }));

    for (let c of criteriosNormalizados) {
      if (!c.nombre) {
        toast.error("Todos los criterios deben tener nombre");
        return;
      }
    }

    dispatch(crearRubrica(rubricaNormalizada))
      .unwrap()
      .then(async (res) => {

        const idRubrica = res.rubrica.id_rubrica;

        try {
          const criteriosCreados = await Promise.all(
            criteriosNormalizados.map((c) =>
              dispatch(crearCriterio(c)).unwrap(),
            ),
          );

          await Promise.all(
            criteriosCreados.map((criterio) =>
              dispatch(
                crearRubricaCriterio({
                  id_rubrica: idRubrica,
                  id_criterio: criterio.criterio.id_criterio,
                }),
              ).unwrap(),
            ),
          );

          const rubrica = await dispatch(
            obtenerRubricaCriterio(idRubrica),
          ).unwrap()

          setRubricaAConfigurar(rubrica.rubrica);

          const iniciales = {};
          rubrica.rubrica.RubricaCriterios.forEach((rc) => {
            iniciales[rc.id_rubrica_criterio] = 0;
          });

          setPorcentajesCriterios(iniciales);
          setPasoAgregar(2);
          setCrearNueva(false);

          toast.success("Rúbrica creada correctamente");
        } catch (error) {
          console.log(error)
          toast.error("Error al guardar los criterios");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  if (!edicionEnProceso) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">Cargando edición...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
        <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
          <div className="w-full md:flex-1">
            <Input
              placeholder="Buscar por descripción..."
              value={searchTextRubricasCategoria}
              onChange={(e) => {
                setSearchTextRubricasCategoria(e.target.value);
                setCurrentPageRubricasCategoria(1);
              }}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
            />
          </div>
          <button
            onClick={() => {
              if (maxDisponibleRubrica === 0) {
                toast.error("No se pueden agregar más rúbricas");
                return;
              }
              setModalAgregarRubrica(true);
            }}
            disabled={deshabilitarAgregarRubrica}
            className={`bg-white border-2 rounded-xl! py-1.5! flex! items-center! justify-center! gap-1! font-poppins text-sm shadow-md transition w-full md:w-47!
            ${
              deshabilitarAgregarRubrica
                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            }
            `}
          >
            <IoMdAddCircle className="text-xl" />
            Agregar Rúbrica
          </button>
        </div>
      </div>
      {rubricasIncompletas && (
        <div className="mb-3! bg-amber-50 border border-amber-200 rounded-xl p-3! flex items-center gap-2">
          <IoIosInformationCircle className="text-amber-500" size={20} />

          <div>
            <p className="text-xs font-bold text-amber-700 m-0!">
              Las rúbricas no completan el 100%
            </p>
            <p className="text-[11px] text-amber-600 m-0!">
              Total actual: {totalUsadoRubricas}%. Debe sumar exactamente 100%.
            </p>
          </div>
        </div>
      )}
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <ConfigProvider locale={esES}>
          <Table
            dataSource={datosPaginadosRubricasCategoria}
            columns={columnsRubricas}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: <EmptyTable />,
            }}
          />
        </ConfigProvider>
        <div className="flex justify-between items-center px-1! mt-2!">
          <span className="text-gray-600 font-inter text-sm">
            Mostrando{" "}
            <strong>
              {rubricasCategoriaEdicion.length === 0
                ? 0
                : startIndexRubricasCategoria + 1}{" "}
              -{" "}
              {Math.min(
                endIndexRubricasCategoria,
                rubricasCategoriaEdicion.length,
              )}
            </strong>{" "}
            de <strong>{rubricasCategoriaEdicion.length}</strong> registros
          </span>

          <Pagination
            current={currentPageRubricasCategoria}
            pageSize={pageSizeRubricasCategoria}
            total={rubricasCategoriaEdicion.length}
            onChange={(page) => setCurrentPageRubricasCategoria(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
      <Modal
        title={null}
        open={modalRubricaVisible}
        onCancel={() => setModalRubricaVisible(false)}
        width={850}
        centered
        className="modal-rubrica-custom"
        footer={null}
      >
        {rubricaSeleccionada && (
          <div className="py-2!">
            <div className="flex items-center justify-between mb-3!">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3! rounded-2xl">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 font-poppins m-0!">
                    Detalle de Rúbrica
                  </h2>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                    {capitalizeFirstLetter(rubricaSeleccionada.rubrica.nombre)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 px-4! py-1! rounded-2xl border border-gray-200">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Valor Rúbrica
                  </span>
                  <span className={`text-xl font-black ${"text-red-600"}`}>
                    {rubricaSeleccionada.porcentaje}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3! border border-gray-100 mb-3!">
              <p className="text-sm text-gray-600 font-inter font-bold m-0!">
                Descripción Rúbrica:
              </p>
              <p className="text-sm text-gray-600 font-inter italic m-0!">
                "
                {capitalizeFirstLetter(rubricaSeleccionada.rubrica.descripcion)}
                "
              </p>
            </div>

            <h3 className="text-sm! font-bold text-gray-700 mb-3! px-1! flex items-center gap-2">
              <MdRule className="text-red-500" /> Criterios de Evaluación
            </h3>

            <p className="text-xs text-gray-500 mb-2!">
              Total criterios: {calcularTotalCriterios(rubricaSeleccionada)}%
            </p>

            <div className="w-full overflow-x-auto overflow-y-hidden">
              <ConfigProvider locale={esES}>
                <Table
                  rowKey={(record) => record.id_ecrc}
                  dataSource={datosPaginadosRubricaCriterios}
                  columns={columnsCriterios}
                  pagination={false}
                  locale={{
                    emptyText: <EmptyTable />,
                  }}
                />
              </ConfigProvider>
              <div className="flex justify-between items-center px-1! mt-2!">
                <span className="text-gray-600 font-inter text-sm">
                  Mostrando{" "}
                  <strong>
                    {rubricaSeleccionada.rubrica.RubricaCriterios.length === 0
                      ? 0
                      : startIndexRubricaCriterios + 1}{" "}
                    -{" "}
                    {Math.min(
                      endIndexRubricaCriterios,
                      rubricaSeleccionada.rubrica.RubricaCriterios.length,
                    )}
                  </strong>{" "}
                  de{" "}
                  <strong>
                    {rubricaSeleccionada.rubrica.RubricaCriterios.length}
                  </strong>{" "}
                  registros
                </span>

                <Pagination
                  current={currentPageRubricaCriterios}
                  pageSize={pageSizeRubricaCriterios}
                  total={rubricaSeleccionada.rubrica.RubricaCriterios.length}
                  onChange={(page) => setCurrentPageRubricaCriterios(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={modalAgregarRubrica}
        onCancel={() => {
          setModalAgregarRubrica(false);
          setPasoAgregar(1);
        }}
        width={pasoAgregar === 1 ? 650 : 650}
        centered
        footer={null}
        title={
          <div className="flex items-center justify-between w-full pr-8!">
            <div className="flex items-center gap-2">
              {pasoAgregar === 2 && (
                <Button
                  type="text"
                  size="small"
                  icon={
                    <IoMdArrowDropright
                      className="rotate-180 text-gray-400"
                      size={20}
                    />
                  }
                  onClick={() => setPasoAgregar(1)}
                  className="flex items-center justify-center"
                />
              )}
              <span className="font-poppins text-xl font-bold text-gray-800">
                {crearNueva
                  ? "Crear Rúbrica"
                  : pasoAgregar === 1
                    ? "Seleccionar Rúbrica"
                    : "Configurar Pesos"}
              </span>
            </div>
            {pasoAgregar === 1 && !crearNueva && (
              <Button
                type="dashed"
                onClick={() => {
                  setCrearNueva(true);
                  setPasoAgregar(1);
                }}
                className="border-blue-200! hover:border-blue-400! hover:text-blue-600! bg-blue-50/50! font-bold rounded-xl! flex items-center gap-2! h-9!"
              >
                <IoMdAddCircle className="text-blue-600" size={18} />
                <span className="font-inter text-xs">Crear Nueva</span>
              </Button>
            )}
          </div>
        }
      >
        {pasoAgregar === 1 ? (
          <div className="space-y-4! mt-2!">
            {crearNueva ? (
              <div className="space-y-6! animate-in fade-in duration-300">
                <div className="relative border-2 border-red-100 rounded-2xl p-5! pt-4! bg-red-50/10 top-2! mb-8!">
                  <div className="absolute -top-3 left-2 bg-white px-2! flex items-center gap-2">
                    <span className="text-red-600 bg-red-100 rounded-lg p-1!">
                      <MdDescription size={16} />
                    </span>
                    <span className="font-poppins font-black text-sm uppercase tracking-widest text-red-600">
                      Datos de la Rúbrica
                    </span>
                  </div>

                  <div className="space-y-3!">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1! font-inter">
                        Nombre de la Rúbrica{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Ej: Evaluación de Desempeño Técnico"
                        maxLength={50}
                        showCount
                        className="rounded-xl! border-gray-200! hover:border-red-300! focus:border-red-400! font-inter"
                        value={nuevaRubrica.nombre}
                        onChange={(e) =>
                          setNuevaRubrica({
                            ...nuevaRubrica,
                            nombre: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1! font-inter">
                        Descripción General{" "}
                      </label>
                      <Input.TextArea
                        rows={3}
                        placeholder="¿Qué se evalúa en esta rúbrica?"
                        maxLength={500}
                        showCount
                        className="rounded-xl! border-gray-200! hover:border-red-300! focus:border-red-400! font-inter mb-2!"
                        value={nuevaRubrica.descripcion}
                        onChange={(e) =>
                          setNuevaRubrica({
                            ...nuevaRubrica,
                            descripcion: e.target.value,
                          })
                        }
                        style={{ resize: "none" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative border-2 border-slate-200 rounded-2xl p-5! pt-5! bg-slate-50/30">
                  <div className="absolute -top-3 left-2 bg-white px-2! flex items-center gap-2">
                    <span className="text-slate-600 bg-slate-100 rounded-lg p-1!">
                      <MdListAlt size={16} />
                    </span>
                    <span className="font-poppins font-black text-sm uppercase tracking-widest text-slate-600">
                      Criterios de Evaluación
                    </span>
                  </div>

                  <div className="space-y-3! max-h-[40vh] overflow-y-auto pr-2!">
                    {criteriosNuevaRubrica.map((c, index) => (
                      <div
                        key={index}
                        className="group relative bg-white border border-gray-100 py-3! px-5! rounded-xl shadow-sm hover:border-red-200 transition-all"
                      >
                        <div className="absolute -left-2.5 top-2 bg-white border border-gray-200 text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full text-gray-400">
                          {index + 1}
                        </div>

                        <div className="grid grid-cols-1 gap-3!">
                          <div>
                            <label className="block text-xs font-black text-gray-400 mb-1! font-inter">
                              Nombre del Criterio{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Input
                              placeholder="Ej: Puntualidad"
                              size="small"
                              maxLength={50}
                              showCount
                              className="rounded-lg! border-gray-100! font-inter"
                              value={c.nombre}
                              onChange={(e) => {
                                const copia = [...criteriosNuevaRubrica];
                                copia[index].nombre = e.target.value;
                                setCriteriosNuevaRubrica(copia);
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-black text-gray-400 mb-1! font-inter">
                              Descripción del Criterio{" "}
                            </label>
                            <Input.TextArea
                              placeholder="Define qué se considera en este punto"
                              size="small"
                              rows={3}
                              maxLength={500}
                              showCount
                              className="rounded-lg! border-gray-100! font-inter mb-4!"
                              value={c.descripcion}
                              onChange={(e) => {
                                const copia = [...criteriosNuevaRubrica];
                                copia[index].descripcion = e.target.value;
                                setCriteriosNuevaRubrica(copia);
                              }}
                              style={{ resize: "none" }}
                            />
                          </div>
                        </div>

                        {criteriosNuevaRubrica.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<MdDeleteSweep size={18} />}
                            className="absolute top-1 bg-white shadow-md rounded-full hover:scale-110 transition-transform flex items-center justify-center h-8! w-8!"
                            onClick={() => {
                              setCriteriosNuevaRubrica(
                                criteriosNuevaRubrica.filter(
                                  (_, i) => i !== index,
                                ),
                              );
                            }}
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      block
                      icon={<IoMdAddCircle />}
                      onClick={() =>
                        setCriteriosNuevaRubrica([
                          ...criteriosNuevaRubrica,
                          { nombre: "", descripcion: "" },
                        ])
                      }
                      className="rounded-xl! border-dashed border-gray-300! text-gray-500! hover:text-red-500! hover:border-red-300! h-10! font-montserrat"
                    >
                      Agregar un nuevo criterio
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3! border-t border-gray-100">
                  <Button
                    className="rounded-xl! font-bold text-gray-500 font-poppins"
                    onClick={() => {
                      setCrearNueva(false);
                      setNuevaRubrica({ nombre: "", descripcion: "" });
                      setCriteriosNuevaRubrica([
                        { nombre: "", descripcion: "" },
                      ]);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    danger
                    className="rounded-xl! font-bold px-2! shadow-md shadow-red-100 gap-1! font-poppins"
                    onClick={guardarNuevaRubrica}
                  >
                    Guardar y Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4! max-h-[60vh] overflow-y-auto pr-2! mt-2!">
                <div className="bg-amber-50 border border-amber-100 p-3! rounded-2xl flex items-center gap-3 mb-2!">
                  <IoIosInformationCircle
                    className="text-amber-500"
                    size={20}
                  />
                  <p className="text-[13px] text-amber-700 m-0! font-medium">
                    Puedes seleccionar una rúbrica existente de la base de datos
                    o crear una nueva.
                  </p>
                </div>

                {rubricas?.length === 0 ? (
                  <div className="py-10!">
                    <EmptyTable />
                  </div>
                ) : (
                  rubricas?.map((rubrica) => (
                    <div
                      key={rubrica.id_rubrica}
                      className="border border-gray-100 rounded-2xl p-4! bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3!">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 font-poppins text-base m-0! group-hover:text-blue-600 transition-colors">
                            {capitalizeFirstLetter(rubrica.nombre)}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1! line-clamp-2">
                            {rubrica.descripcion}
                          </p>
                        </div>

                        <Button
                          type="primary"
                          danger
                          className="rounded-xl! font-bold flex gap-2! h-9! shadow-sm hover:shadow-red-200"
                          onClick={() => iniciarConfiguracion(rubrica)}
                        >
                          <IoMdAddCircle size={18} />
                          <span className="font-inter">Agregar</span>
                        </Button>
                      </div>

                      <ConfigProvider
                        theme={{
                          token: {
                            colorBgContainer: "#f8fafc",
                            borderRadiusLG: 12,
                          },
                        }}
                      >
                        <Collapse
                          ghost
                          expandIcon={({ isActive }) => (
                            <IoMdArrowDropright
                              className={`transition-transform duration-300 text-blue-600 text-xl ${
                                isActive ? "rotate-90" : ""
                              }`}
                            />
                          )}
                          className="bg-slate-50! rounded-xl!"
                        >
                          <Collapse.Panel
                            header={
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-inter">
                                Ver {rubrica.RubricaCriterios.length} criterios
                                asociados
                              </span>
                            }
                            key="1"
                          >
                            <div className="grid grid-cols-1 gap-2! pb-2!">
                              {rubrica.RubricaCriterios.map((rc, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center bg-white p-3! rounded-lg border border-gray-100 shadow-sm"
                                >
                                  <div className="flex-1 pr-4!">
                                    <p className="text-sm font-bold text-gray-700 m-0! font-montserrat">
                                      {capitalizeFirstLetter(
                                        rc.Criterio.nombre,
                                      )}
                                    </p>
                                    <p className="text-[11px] text-gray-400 m-0! line-clamp-1 font-inter italic">
                                      {capitalizeFirstLetter(
                                        rc.Criterio.descripcion,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      </ConfigProvider>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5!">
            <div className="bg-blue-50 p-4! rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-800 m-0!">
                {capitalizeFirstLetter(rubricaAConfigurar?.nombre)}
              </h4>
              <p className="text-sm text-blue-600 m-0!">
                {capitalizeFirstLetter(rubricaAConfigurar?.descripcion)}
              </p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4! rounded-2xl border border-gray-200">
              <div>
                <span className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                  Valor de esta rúbrica
                </span>
                <span className="text-xs text-gray-500 italic">
                  ¿Cuánto pesa esta rúbrica en la categoría?
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Disponible: {maxDisponibleRubrica}%
                </p>
              </div>
              <InputNumber
                min={1}
                addonAfter="%"
                className="w-32! font-bold"
                value={porcentajeTotalRubrica}
                onChange={(val) => {
                  if (val === null) {
                    setPorcentajeTotalRubrica(null);
                    return;
                  }
                  if (val > maxDisponibleRubrica) {
                    toast.error(
                      `No colocar un valor mayor a ${maxDisponibleRubrica}`,
                    );
                    setPorcentajeTotalRubrica(null);
                    return;
                  }
                  setPorcentajeTotalRubrica(val);
                }}
              />
            </div>

            <div className="space-y-3!">
              <h5 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <MdRule /> Distribuir pesos por criterio (Debe sumar 100%)
              </h5>

              <div className="max-h-[30vh] overflow-y-auto space-y-2! pr-2!">
                {rubricaAConfigurar?.RubricaCriterios.map((rc) => (
                  <div
                    key={rc.id_criterio}
                    className="flex items-center justify-between p-3! bg-white border border-gray-100 rounded-xl shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-bold text-gray-700 m-0!">
                        {capitalizeFirstLetter(rc.Criterio.nombre)}
                      </p>
                    </div>
                    <InputNumber
                      min={0}
                      size="small"
                      addonAfter="%"
                      className="w-24!"
                      value={porcentajesCriterios[rc.id_rubrica_criterio]}
                      onChange={(val) => {
                        if (val === null) {
                          setPorcentajesCriterios({
                            ...porcentajesCriterios,
                            [rc.id_rubrica_criterio]: null,
                          });
                          return;
                        }

                        const totalActual = Object.entries(
                          porcentajesCriterios,
                        ).reduce((sum, [id, valor]) => {
                          if (id === rc.id_rubrica_criterio.toString())
                            return sum;
                          return sum + (valor || 0);
                        }, 0);

                        const maxPermitido = 100 - totalActual;

                        if (val > maxPermitido) {
                          toast.error(`Máximo permitido: ${maxPermitido}%`);

                          setPorcentajesCriterios({
                            ...porcentajesCriterios,
                            [rc.id_rubrica_criterio]: null,
                          });

                          return;
                        }

                        setPorcentajesCriterios({
                          ...porcentajesCriterios,
                          [rc.id_rubrica_criterio]: val,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4! border-t border-gray-100">
              <Button
                onClick={() => setPasoAgregar(1)}
                className="rounded-xl! font-bold text-gray-500"
              >
                Atrás
              </Button>
              <Button
                type="primary"
                danger
                className="rounded-xl! font-bold px-8! font-inter"
                onClick={() => {
                  const suma = Object.values(porcentajesCriterios).reduce(
                    (a, b) => a + (b || 0),
                    0,
                  );
                  if (suma !== 100)
                    return toast.warning(
                      `Los criterios deben sumar 100%. Actual: ${suma}%`,
                    );
                  if (porcentajeTotalRubrica <= 0)
                    return toast.warning("Asigna un valor a la rúbrica");

                  dispatch(
                    agregarRubricaAEdicionCategoria({
                      id_edicion_categoria: id_edicion_categoria,
                      datos: {
                        id_rubrica: rubricaAConfigurar.id_rubrica,
                        porcentaje: porcentajeTotalRubrica,
                      },
                    }),
                  )
                    .unwrap()
                    .then((res) => {
                      dispatch(
                        agregarPorcentajeCriterio({
                          id_edicion_categoria: id_edicion_categoria,
                          datos: {
                            porcentajesCriterios,
                          },
                        }),
                      )
                        .unwrap()
                        .then((res) => {
                          toast.success("Rúbrica agregada a la categoría", {
                            toastId: "agregar-rubrica-success",
                            position: "top-right",
                            autoClose: 2500,
                            pauseOnHover: true,
                            draggable: true,
                          });
                          dispatch(
                            listarRubricasPorCategoriaEdicion(
                              id_edicion_categoria,
                            ),
                          );
                          setTimeout(() => {
                            setModalAgregarRubrica(false);
                            setPorcentajeTotalRubrica(null);
                            setPorcentajesCriterios({});
                            setPasoAgregar(1);
                          }, 3000);
                        })
                        .catch((err) => {
                          console.log("Error al agregar", err);
                        });
                    });
                }}
              >
                Confirmar y Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={modalEditarRubrica}
        onCancel={() => {
          setModalEditarRubrica(false);
          setRubricaEditar(null);
          setNuevoPorcentajeRubrica(null);
        }}
        centered
        width={400}
        footer={null}
        title={
          <div className="flex! items-center! gap-2">
            <IoMdArrowDropright
              className="text-red-600 drop-shadow-md"
              size={36}
            />
            <span className="font-poppins font-bold text-lg -ml-2!">
              Editar porcentaje de rúbrica
            </span>
          </div>
        }
      >
        {rubricaEditar && (
          <div className="space-y-4! mt-2!">
            <div className="bg-gray-50 p-3! rounded-xl border">
              <p className="text-sm font-bold text-gray-700 m-0!">
                {capitalizeFirstLetter(rubricaEditar.rubrica.nombre)}
              </p>
              <p className="text-xs text-gray-500 m-0!">
                {capitalizeFirstLetter(rubricaEditar.rubrica.descripcion)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Nuevo porcentaje
              </label>

              <InputNumber
                min={1}
                addonAfter="%"
                className="w-full font-bold"
                value={nuevoPorcentajeRubrica}
                onChange={(val) => {
                  if (val === null) {
                    setNuevoPorcentajeRubrica(null);
                    return;
                  }

                  if (val > 100) {
                    toast.error("Máximo 100%");
                    return;
                  }

                  setNuevoPorcentajeRubrica(val);
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              Disponible: {calcularDisponibleEdicion()}%
            </p>

            <div className="flex justify-end gap-3 pt-3! border-t">
              <Button
                onClick={() => {
                  setModalEditarRubrica(false);
                  setRubricaEditar(null);
                  setNuevoPorcentajeRubrica(null);
                }}
                className="font-poppins"
              >
                Cancelar
              </Button>

              <Button
                type="primary"
                danger
                className="font-poppins"
                onClick={guardarPorcentajeRubrica}
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={modalEliminarRubrica}
        onCancel={() => {
          setModalEliminarRubrica(false);
          setRubricaAEliminar(null);
        }}
        centered
        width={420}
        footer={null}
        title={
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Trash2 size={22} />
            Confirmar eliminación
          </div>
        }
      >
        {rubricaAEliminar && (
          <div className="space-y-4! mt-2!">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3!">
              <p className="text-sm font-bold text-red-700 m-0!">
                ¿Seguro que deseas eliminar esta rúbrica?
              </p>

              <p className="text-xs text-red-600 m-0! mt-1">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="bg-gray-50 p-3! rounded-xl border">
              <p className="text-sm font-bold text-gray-700 m-0!">
                {capitalizeFirstLetter(rubricaAEliminar.rubrica.nombre)}
              </p>

              <p className="text-xs text-gray-500 m-0!">
                {capitalizeFirstLetter(rubricaAEliminar.rubrica.descripcion)}
              </p>

              <p className="text-xs text-gray-400 mt-1!">
                Valor: {rubricaAEliminar.porcentaje}%
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3! border-t">
              <Button
                onClick={() => {
                  setModalEliminarRubrica(false);
                  setRubricaAEliminar(null);
                }}
                className="font-poppins"
              >
                Cancelar
              </Button>

              <Button
                type="primary"
                danger
                className="font-poppins"
                onClick={() => {
                  dispatch(
                    eliminarRubricaAEdicionCategoria({
                      id_ecr: rubricaAEliminar.id_ecr,
                      id_edicion_categoria: id_edicion_categoria,
                    }),
                  )
                    .unwrap()
                    .then(() => {
                      toast.success("Rúbrica eliminada correctamente");

                      dispatch(
                        listarRubricasPorCategoriaEdicion(id_edicion_categoria),
                      );

                      setModalEliminarRubrica(false);
                      setRubricaAEliminar(null);
                    })
                    .catch((error) => {
                      toast.error("Error al eliminar la rúbrica");
                    });
                }}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default RubricaCategoriaEdicion;
