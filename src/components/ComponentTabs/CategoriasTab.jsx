import { useEffect, useState } from "react";
import esES from "antd/es/locale/es_ES";
import {
  ConfigProvider,
  Input,
  Table,
  Modal,
  Space,
  Select,
  Tooltip,
  Card,
  Pagination,
} from "antd";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import imagen_info_edicion from "../../images/imagen_info_edicion.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoSearchCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import {
  Eye,
  ArrowLeft,
  Trophy,
  ClipboardList,
  Users,
  UserCheck,
  Gavel,
} from "lucide-react";
import { IoIosInformationCircle, IoMdArrowDropright } from "react-icons/io";
import dayjs from "dayjs";
import { MdAssessment } from "react-icons/md";
import LoadingComponent from "@/components/LoadingComponent";
import {
  obtenerCategoria,
  listarCategoriasPorEdicion,
  limpiarCategoriasEdicion,
} from "../../features/categorias/categoria.slice";
import {
  listarParticipacionesGanadorasPorEdicionCategoria,
  limpiarParticipacionesGanadorasPorEdicionCategoria,
} from "../../features/participacion/participacion.slice";

import RubricasCategoriaEdicion from "@/components/DataEdicion/RubricasCategoriaEdicion";
import RequisitosCategoriaEdicion from "@/components/DataEdicion/RequisitosCategoriaEdicion";
import PostulacionesCategoriaEdicion from "@/components/DataEdicion/PostulacionesCategoriaEdicion";
import ParticipacionesCategoriaEdicion from "@/components/DataEdicion/ParticipacionesCategoriaEdicion";
import JuradosCategoriaEdicion from "@/components/DataEdicion/JuradosCategoriaEdicion";
import LoadingInformacion from "@/components/LoadingInformacion";

const DetalleCategoria = ({ id_edicion_categoria, alVolver }) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const categoria = useSelector((state) => state.categorias?.categoria);
  const participaciones_ganadoras = useSelector(
    (state) => state.participacion.participaciones_ganadoras,
  );

  useEffect(() => {
    if (!id_edicion_categoria) return;
    setReady(false);

    dispatch(obtenerCategoria(id_edicion_categoria));
    dispatch(limpiarParticipacionesGanadorasPorEdicionCategoria());

    Promise.all([
      dispatch(
        listarParticipacionesGanadorasPorEdicionCategoria({
          id_edicion_categoria: id_edicion_categoria,
        }),
      ),
    ]).finally(() => {
      setReady(true);
    });
  }, [id_edicion_categoria, dispatch]);

  if (!ready) {
    return <LoadingInformacion />;
  }

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const Campo = ({ label, valor, className }) => (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className={`font-medium text-justify ${className}`}>{valor}</span>
    </div>
  );

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

  const DatosCategoria = () => (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <Campo
          label="Nombre Categoría"
          valor={capitalizeFirstLetter(categoria?.nombre_categoria) || "-"}
        />
        <Campo
          label="Estado"
          valor={
            capitalizeFirstLetter(categoria?.edicionesCategoria[0]?.estado) ||
            "-"
          }
        />
        <Campo
          label="Número de Ganadores"
          valor={categoria?.edicionesCategoria[0]?.numero_ganadores || "-"}
        />
        <Campo
          label="Fecha de Registro"
          valor={
            categoria?.edicionesCategoria[0]?.fecha_registro
              ? dayjs(categoria.edicionesCategoria[0].fecha_registro).format(
                  "DD/MM/YYYY",
                )
              : "-"
          }
        />
      </div>
      <div className="hidden lg:flex justify-center items-center">
        <img
          src={imagen_info_edicion}
          alt="info"
          className="h-40 object-contain opacity-90"
        />
      </div>
    </div>
  );

  const SeccionGanadores = ({ participaciones }) => {
    if (!participaciones || participaciones.length === 0) return <EmptyTable />;
    const getBadgeProps = (index) => {
      switch (index) {
        case 0:
          return {
            color: "from-yellow-400 to-yellow-600",
            icon: "🥇",
            label: "1er Puesto",
            shadow: "shadow-yellow-200",
          };
        case 1:
          return {
            color: "from-gray-300 to-gray-500",
            icon: "🥈",
            label: "2do Puesto",
            shadow: "shadow-gray-200",
          };
        case 2:
          return {
            color: "from-orange-400 to-orange-600",
            icon: "🥉",
            label: "3er Puesto",
            shadow: "shadow-orange-200",
          };
        default:
          return {
            color: "from-blue-400 to-blue-600",
            icon: "🎖️",
            label: `${index + 1}º Puesto`,
            shadow: "shadow-blue-100",
          };
      }
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4!">
        {participaciones.map((ganador, index) => {
          const props = getBadgeProps(index);
          const { usuario } = ganador;
          return (
            <div
              key={ganador.id_ganador || index}
              className={`relative group bg-white rounded-2xl p-5! border border-gray-100 shadow-xl transition-all duration-300 hover:-translate-y-2 ${props.shadow}`}
            >
              <div
                className={`absolute -top-4 bg-gradient-to-br ${props.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white z-10 animate-bounce-slow`}
              >
                {props.icon}
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1! mt-4!">
                  {props.label}
                </span>

                <h4 className="text-lg font-bold text-gray-800 leading-tight mb-1">
                  {`${capitalizeFirstLetter(usuario.primer_nombre)} ${capitalizeFirstLetter(usuario.primer_apellido)}`}
                </h4>

                <div className="w-full pt-3! border-t border-gray-50 flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase ">
                      Puntaje
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      {ganador.calificacion_final || "-"}
                    </p>
                  </div>
                  <Trophy
                    size={20}
                    className="text-gray-200 group-hover:text-yellow-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button
        onClick={alVolver}
        className="mb-2! text-blue-600 hover:text-blue-800 flex items-center gap-2 font-inter font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Volver a la lista
      </button>

      <div className="bg-white rounded-xl shadow-md p-4! border border-gray-100">
        <div className="flex items-center gap-2 mb-3!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md"
            size={36}
          />
          <h1 className="font-montserrat text-lg! md:text-xl -ml-3!">
            Información de la Categoría
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 mb-3!">
          <Card className="rounded-xl shadow-sm lg:col-span-3">
            <TituloCard
              icon={IoIosInformationCircle}
              titulo="Datos de la Categoría"
            />
            <DatosCategoria />
          </Card>
          <Card className="rounded-xl shadow-sm lg:col-span-4">
            <TituloCard icon={Trophy} titulo="Ganadores" />
            <SeccionGanadores participaciones={participaciones_ganadoras} />
          </Card>
        </div>
        <Card className="rounded-xl shadow-sm lg:col-span-4 mb-3!">
          <TituloCard icon={MdAssessment} titulo="Rubrícas" />
          <RubricasCategoriaEdicion
            id_edicion_categoria={id_edicion_categoria}
          />
        </Card>
        <Card className="grid grid-cols-1 rounded-xl shadow-sm mb-3!">
          <TituloCard icon={ClipboardList} titulo="Requisitos" />
          <RequisitosCategoriaEdicion
            id_edicion_categoria={id_edicion_categoria}
          />
        </Card>
        <Card className="grid grid-cols-1 rounded-xl shadow-sm  mb-3!">
          <TituloCard icon={Users} titulo="Postulaciones" />
          <PostulacionesCategoriaEdicion
            id_edicion_categoria={id_edicion_categoria}
          />
        </Card>
        <Card className="grid grid-cols-1 rounded-xl shadow-sm  mb-3!">
          <TituloCard icon={UserCheck} titulo="Participaciones" />
          <ParticipacionesCategoriaEdicion
            id_edicion_categoria={id_edicion_categoria}
          />
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-5">
          <TituloCard icon={Gavel} titulo="Jurados" />
          <JuradosCategoriaEdicion
            id_edicion_categoria={id_edicion_categoria}
          />
        </Card>
      </div>
    </div>
  );
};

function CategoriasTab({ edicion }) {
  const dispatch = useDispatch();

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

  const categoriasEdicion = useSelector(
    (state) => state.categorias.categoriasEdicion,
  );
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [verDetalle, setVerDetalle] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaId = searchParams.get("categoria");

  useEffect(() => {
    if (!edicion.id_edicion) return;
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
    );
  }, [
    searchText,
    filtroEstado,
    pageSize,
    currentPage,
    edicion.id_edicion,
    dispatch,
  ]);

  useEffect(() => {
    if (!categoriaId || categoriasEdicion?.length === 0) return;

    const categoria = categoriasEdicion?.find(
      (c) =>
        String(c.edicionesCategoria[0]?.id_edicion_categoria) ===
        String(categoriaId),
    );

    if (categoria) {
      setCategoriaSeleccionada(categoria);
      setVerDetalle(true);
    }
  }, [categoriaId, categoriasEdicion]);

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
        className: "bg-gray-200! font-inter text-center! text-sm",
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
      render: (_, record) => {
        return (
          <span className="font-inter text-sm text-gray-700 flex justify-center text-justify">
            {capitalizeFirstLetter(record.edicionesCategoria[0]?.descripcion)}
          </span>
        );
      },
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
            className={`px-3! py-1! rounded-xl font-inter text-white text-xs flex items-center justify-center ${
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
        return (
          <div className="flex items-center justify-center gap-4">
            <Tooltip title="Ver Categoría">
              <button
                className="p-2! rounded-lg transition bg-blue-50 hover:bg-blue-100"
                onClick={() => {
                  setVerDetalle(true);
                  setCategoriaSeleccionada(
                    record.edicionesCategoria[0]?.id_edicion_categoria,
                  );
                  navigate(
                    `?tab=2&categoria=${record.edicionesCategoria[0]?.id_edicion_categoria}`,
                  );
                }}
              >
                <Eye size={18} className="text-blue-600" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (!edicion) {
    return <LoadingComponent mensaje="Cargando Información..." />;
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

  if (!categorias) {
    return <LoadingInformacion />;
  }

  return (
    <div className="p-4! bg-gray-50 w-full">
      {verDetalle ? (
        <DetalleCategoria
          id_edicion_categoria={categoriaSeleccionada}
          alVolver={() => {
            setSearchParams({ tab: "2" });
            setVerDetalle(false);
            setCategoriaSeleccionada(null);
          }}
        />
      ) : (
        <div className="rounded-xl shadow-sm bg-white p-4!">
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-white font-inter w-full md:w-auto">
                <div className="flex items-center gap-1">
                  <FaFilter />
                  <span>Estado:</span>
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
          </div>
          <div className="grid! grid-cols-1! gap-5! w-full! mt-4!">
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
                      pagination_categorias?.page *
                        pagination_categorias?.limit,
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
        </div>
      )}
    </div>
  );
}

export default CategoriasTab;
