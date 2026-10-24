import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Table, Card, ConfigProvider } from "antd";
import {
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { BiSolidCategory } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import dayjs from "dayjs";
import esES from "antd/es/locale/es_ES";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import imagen_info_edicion from "../../images/imagen_info_edicion.jpg";
import { IoBarChart } from "react-icons/io5";
import {
  listarCategoriasPorEdicion,
  limpiarCategoriasEdicion,
} from "../../features/categorias/categoria.slice";
import {
  limpiarParticipacionesPorEdicion,
  listarParticipacionesPorEdicion,
  limpiarConvocatoriasPorEdicion,
  listarConvocatoriasPorEdicion,
} from "../../features/participacion/participacion.slice";
import {
  listarJuradosPorEdicion,
  limpiarJuradosPorEdicion,
} from "../../features/jurados/jurado.slice";
import LoadingInformacion from "@/components/LoadingInformacion";

function ResumenTab({ edicion }) {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const categorias = useSelector(
    (state) => state.categorias.categorias_edicion,
  );
  const pagination_categorias = useSelector(
    (state) => state.categorias.pagination,
  );
  const participaciones = useSelector(
    (state) => state.participacion.participaciones_edicion,
  );
  const pagination_participaciones = useSelector(
    (state) => state.participacion.pagination_participaciones_edicion,
  );
  const pagination_convocatorias = useSelector(
    (state) => state.participacion.pagination_convocatorias,
  );
  const jurados_edicion = useSelector((state) => state.jurados.jurados_edicion);
  const pagination_jurados_edicion = useSelector(
    (state) => state.jurados.pagination_jurados_edicion,
  );

  useEffect(() => {
    if (!edicion?.id_edicion) return;

    setReady(false);

    const id = edicion.id_edicion;

    dispatch(limpiarCategoriasEdicion());
    dispatch(limpiarParticipacionesPorEdicion());
    dispatch(limpiarConvocatoriasPorEdicion());
    dispatch(limpiarJuradosPorEdicion());

    Promise.all([
      dispatch(listarCategoriasPorEdicion({ id_edicion: id })),
      dispatch(listarParticipacionesPorEdicion({ id_edicion: id })),
      dispatch(listarConvocatoriasPorEdicion({ id_edicion: id })),
      dispatch(listarJuradosPorEdicion({ id_edicion: id })),
    ]).finally(() => {
      setReady(true);
    });
  }, [edicion?.id_edicion, dispatch]);

  if (!ready) {
    return <LoadingInformacion />;
  }

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={14} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const dataPie = (categorias || []).map((cat, index) => {
    const tonosRojos = [
      "#8B0000",
      "#B22222",
      "#DC143C",
      "#E34234",
      "#FF4D4D",
      "#FF8080",
    ];
    return {
      name: cat.nombre_categoria.toUpperCase(),
      value: participaciones?.filter(
        (part) =>
          part?.edicionCategoria?.id_edicion_categoria ===
          cat?.edicionesCategoria?.[0]?.id_edicion_categoria,
      ).length,
      color: tonosRojos[index % tonosRojos.length],
    };
  });

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const Campo = ({ label, valor }) => (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  const columnsCategorias = [
    {
      title: "Nombre",
      key: "nombre_categoria",
      sorter: (a, b) => {
        const descA = a.categoria.nombre_categoria || "";
        const descB = b.categoria.nombre_categoria || "";
        return descA.localeCompare(descB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.nombre_categoria)}
        </span>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-justify">
          {capitalizeFirstLetter(record.edicionesCategoria[0].descripcion)}
        </span>
      ),
    },
  ];

  const columnsJurados = [
    {
      title: "Documento",
      dataIndex: "numero_documento",
      key: "numero_documento",
      sorter: (a, b) =>
        (a.numero_documento || "").localeCompare(b.numero_documento || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-xs text-gray-700 justify-center text-center">
          {record.tipo_documento} {record.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) => {
        const nombreA = `${a.primer_nombre} ${
          a.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.primer_nombre} ${
          b.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.segundo_nombre)}{" "}
          {record.primer_apellido} {record.segundo_apellido}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "email",
      sorter: (a, b) =>
        (a.correo_electronico || "").localeCompare(b.correo_electronico || ""),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.correo_electronico}
        </span>
      ),
    },
  ];

  const columnsParticipantes = [
    {
      title: "Documento",
      dataIndex: "numero_documento",
      key: "numero_documento",
      sorter: (a, b) =>
        (a.usuario.numero_documento || "").localeCompare(
          b.usuario.numero_documento || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="flex items-center gap-1 font-inter text-xs text-gray-700 justify-center text-center">
          {record.usuario.tipo_documento} {record.usuario.numero_documento}
        </span>
      ),
    },
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) => {
        const nombreA = `${a.usuario.primer_nombre} ${
          a.usuario.segundo_nombre || ""
        }`.toLowerCase();
        const nombreB = `${b.usuario.primer_nombre} ${
          b.usuario.segundo_nombre || ""
        }`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      },
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.usuario.primer_nombre)}{" "}
          {capitalizeFirstLetter(record.usuario.segundo_nombre)}{" "}
          {record.usuario.primer_apellido} {record.usuario.segundo_apellido}
        </span>
      ),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_electronico",
      key: "email",
      sorter: (a, b) =>
        (a.usuario.correo_electronico || "").localeCompare(
          b.usuario.correo_electronico || "",
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {record.usuario.correo_electronico}
        </span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) =>
        a.edicionCategoria.categoria.nombre_categoria.localeCompare(
          b.edicionCategoria.categoria.nombre_categoria,
        ),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm!",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(
            record.edicionCategoria.categoria.nombre_categoria,
          )}
        </span>
      ),
    },
  ];

  const DatosEdicion = () => (
    <div className="flex justify-center 2xl:gap-20">
      <div className="grid grid-cols-1 sm:grid-cols-5 text-sm font-inter text-gray-700 lg:col-span-2 gap-y-2 gap-x-8">
        <Campo
          label="Nombre Edición"
          valor={capitalizeFirstLetter(edicion?.nombre_edicion) || "-"}
        />
        <Campo
          label="Fecha Registro"
          valor={dayjs(edicion?.fecha_registro).format("DD/MM/YYYY") || "-"}
        />
        <Campo
          label="Fecha Inicio"
          valor={dayjs(edicion?.fecha_inicio).format("DD/MM/YYYY") || "-"}
        />
        <Campo
          label="Fecha Fin"
          valor={dayjs(edicion?.fecha_fin).format("DD/MM/YYYY") || "-"}
        />
        <Campo
          label="Fecha Inicio de Convocatoria"
          valor={
            dayjs(edicion?.fecha_inicio_convocatoria).format("DD/MM/YYYY") ||
            "-"
          }
        />
        <Campo
          label="Fecha Fin de Convocatoria"
          valor={
            dayjs(edicion?.fecha_fin_convocatoria).format("DD/MM/YYYY") || "-"
          }
        />
        <Campo
          label="Fecha Inicio de Evaluación"
          valor={
            dayjs(edicion?.fecha_inicio_evaluacion).format("DD/MM/YYYY") || "-"
          }
        />
        <Campo
          label="Fecha Fin de Evaluación"
          valor={
            dayjs(edicion?.fecha_fin_evaluacion).format("DD/MM/YYYY") || "-"
          }
        />
        <Campo
          label="Fecha Inicio de Premiación"
          valor={
            dayjs(edicion?.fecha_inicio_premiacion).format("DD/MM/YYYY") || "-"
          }
        />
        <Campo
          label="Fecha Fin de Premiación"
          valor={
            dayjs(edicion?.fecha_fin_premiacion).format("DD/MM/YYYY") || "-"
          }
        />
      </div>
      <div className="hidden lg:flex justify-center lg:col-span-1">
        <img
          src={imagen_info_edicion}
          alt="Foto de usuario"
          className="h-31 -mt-7!"
        />
      </div>
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

  return (
    <div className="p-4! bg-gray-50">
      <Card className="rounded-xl shadow-sm lg:col-span-1 mb-4!">
        <TituloCard
          icon={IoIosInformationCircle}
          titulo="Datos de la Edición"
        />
        <DatosEdicion />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-1">
          <TituloCard icon={BiSolidCategory} titulo="Categorías" />
          <div className="w-full overflow-x-auto">
            <ConfigProvider locale={esES}>
              <Table
                columns={columnsCategorias}
                dataSource={categorias.slice(0, 3)}
                pagination={false}
                locale={{ emptyText: <EmptyTable /> }}
              />
            </ConfigProvider>
          </div>
          <div className="flex justify-between items-center mt-3! px-1!">
            <span className="text-gray-600 font-inter text-sm">
              Mostrando <strong>{(categorias || []).slice(0, 3).length}</strong>{" "}
              de <strong>{pagination_categorias?.total}</strong> registros
            </span>
          </div>
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-1">
          <TituloCard icon={FaUserGroup} titulo="Jurados" />
          <div className="w-full overflow-x-auto">
            <ConfigProvider locale={esES}>
              <Table
                columns={columnsJurados}
                dataSource={(jurados_edicion || []).slice(0, 5)}
                pagination={false}
                locale={{ emptyText: <EmptyTable /> }}
              />
            </ConfigProvider>
          </div>
          <div className="flex justify-between items-center mt-3! px-1!">
            <span className="text-gray-600 font-inter text-sm">
              Mostrando{" "}
              <strong>{(jurados_edicion || []).slice(0, 5).length}</strong> de{" "}
              <strong>{pagination_jurados_edicion?.total}</strong> registros
            </span>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-3 mb-3!">
        <div className="flex flex-col gap-2 lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50 h-full items-center justify-center">
            <span className="text-6xl font-black text-red-600 font-poppins flex items-center justify-center">
              {pagination_convocatorias?.total}
            </span>
            <p className="text-[10px] font-inter font-bold uppercase leading-none mt-1! flex items-center justify-center text-center">
              Personas Convocadas
            </p>
          </Card>
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50 h-full items-center justify-center">
            <span className="text-6xl font-black text-red-600 font-poppins flex items-center justify-center">
              {pagination_participaciones?.total}
            </span>
            <p className="text-[10px] font-inter font-bold uppercase leading-none mt-1! flex items-center justify-center text-center">
              Participaciones Registradas
            </p>
          </Card>
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50 h-full items-center justify-center">
            <span className="text-6xl font-black text-red-600 font-poppins flex items-center justify-center">
              {pagination_jurados_edicion?.total}
            </span>
            <p className="text-[10px] font-inter font-bold uppercase leading-none mt-1! flex items-center justify-center text-center">
              Jurados Registrados
            </p>
          </Card>
        </div>
        <Card className="rounded-xl shadow-sm lg:col-span-2 p-4">
          <TituloCard
            icon={IoBarChart}
            titulo="Participaciones por Categoría"
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataPie}
                layout="vertical"
                margin={{ top: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis type="number" hide />{" "}
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{
                    fontSize: 9,
                    fontWeight: 700,
                    fill: "#9ca3af",
                    fontFamily: "Inter",
                  }}
                  width={80}
                />
                <RechartsTooltip
                  cursor={{ fill: "#fef2f2" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4! border-t border-gray-50 flex justify-between items-center">
            <span className="text-[10px] font-black font-poppins text-gray-400 uppercase">
              Total Categorías
            </span>
            <span className="text-sm font-black text-red-600">
              {dataPie.length}
            </span>
          </div>
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-5">
          <TituloCard icon={MdGroups} titulo="Participaciones" />
          <div className="w-full overflow-x-auto">
            <ConfigProvider locale={esES}>
              <Table
                columns={columnsParticipantes}
                dataSource={(participaciones || []).slice(0, 3)}
                pagination={false}
                locale={{ emptyText: <EmptyTable /> }}
              />
            </ConfigProvider>
          </div>
          <div className="flex justify-between items-center mt-3! px-1!">
            <span className="text-gray-600 font-inter text-sm">
              Mostrando{" "}
              <strong>{(participaciones || []).slice(0, 3).length}</strong> de{" "}
              <strong>{pagination_participaciones?.total}</strong> registros
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ResumenTab;
