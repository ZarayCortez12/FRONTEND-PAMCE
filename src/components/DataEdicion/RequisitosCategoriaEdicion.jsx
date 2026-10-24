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
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import { Eye, FileText } from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import {
  listarRequisitosPorCategoriaEdicion,
  obtenerConfiguracionRequisitoDeCategoriaEdicion,
} from "../../features/requisitos/requisitos.slice";
import LoadingInformacion from "@/components/LoadingInformacion";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";

function RequisitosCategoriaEdicion({ id_edicion_categoria }) {
  const dispatch = useDispatch();
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
    </>
  );
}

export default RequisitosCategoriaEdicion;
