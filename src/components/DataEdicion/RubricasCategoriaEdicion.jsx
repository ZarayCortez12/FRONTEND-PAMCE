import { useEffect, useState } from "react";
import {
  Input,
  Table,
  Modal,
  Space,
  Select,
  Tooltip,
  ConfigProvider,
  Pagination,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchCircle } from "react-icons/io5";
import esES from "antd/es/locale/es_ES";
import { Eye, FileText } from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { listarRubricasPorCategoriaEdicion } from "../../features/rubricas/rubricas.slice";
import { listarCriteriosPorRubricaPorCategoriaEdicion } from "../../features/criterios/criterios.slice";
import { MdRule } from "react-icons/md";
import LoadingInformacion from "@/components/LoadingInformacion";

function RubricasCategoriaEdicion({ id_edicion_categoria }) {
  const dispatch = useDispatch();
  const rubricas = useSelector(
    (state) => state.rubricas.rubricas_categoria_edicion,
  );
  const pagination_rubricas = useSelector(
    (state) => state.rubricas.pagination_rubricas_categoria_edicion,
  );
  const loading = useSelector((state) => state.rubricas.loading);

  const [searchTextRubricas, setSearchTextRubricas] = useState("");
  const [pageSizeRubricas, setPageSizeRubricas] = useState(10);
  const [currentPageRubricas, setCurrentPageRubricas] = useState(1);

  const criterios = useSelector((state) => state.criterios.criterios);
  const pagination_criterios = useSelector(
    (state) => state.criterios.pagination_criterios,
  );
  const loading_criterios = useSelector((state) => state.criterios.loading);
  const [currentPageCriterios, setCurrentPageCriterios] = useState(1);
  const [modalCriteriosVisible, setModalCriteriosVisible] = useState(false);
  const [rubricaSeleccionada, setRubricaSeleccionada] = useState(null);

  useEffect(() => {
    if (!id_edicion_categoria) return;
    dispatch(
      listarRubricasPorCategoriaEdicion({
        id_edicion_categoria: id_edicion_categoria,
        params: {
          search: searchTextRubricas,
          limit: pageSizeRubricas,
          page: currentPageRubricas,
        },
      }),
    );
  }, [
    searchTextRubricas,
    pageSizeRubricas,
    currentPageRubricas,
    id_edicion_categoria,
    dispatch,
  ]);

  useEffect(() => {
    if (!rubricaSeleccionada) return;
    dispatch(
      listarCriteriosPorRubricaPorCategoriaEdicion({
        id_edicion_categoria: id_edicion_categoria,
        id_rubrica: rubricaSeleccionada.id_rubrica,
        params: {
          limit: 5,
          page: currentPageCriterios,
        },
      }),
    );
  }, [
    id_edicion_categoria,
    currentPageCriterios,
    rubricaSeleccionada,
    dispatch,
  ]);

  const columnsRubricas = [
    {
      title: "Nombre",
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
          {capitalizeFirstLetter(record.rubrica.descripcion) ||
            "No hay descripción"}
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
                setModalCriteriosVisible(true);
              }}
            >
              <Eye size={18} className="text-blue-600" />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsCriterios = [
    {
      title: "Nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.nombre)}
        </span>
      ),
    },
    {
      title: "Descripción",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      onHeaderCell: () => ({
        className: "bg-gray-200! font-inter text-center! text-sm",
      }),
      render: (_, record) => (
        <span className="font-inter text-sm text-gray-700 flex justify-center text-center">
          {capitalizeFirstLetter(record.descripcion)}
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
        return (
          <div className="flex justify-center items-center gap-2">
            <span className="font-inter text-sm text-gray-700">
              {parseFloat(
                record.rubricaCriterio[0]?.edicionCategoriaRubricaCriterio[0]
                  ?.porcentaje || 0,
              )}
              %
            </span>
          </div>
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

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-2">
        <div className="w-full bg-red-600 rounded-xl p-2! flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3!">
          <Tooltip title="Filtrar por cantidad de registros">
            <Select
              value={pageSizeRubricas}
              onChange={(value) => {
                setPageSizeRubricas(value);
                setCurrentPageRubricas(1);
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
              placeholder="Buscar por nombre..."
              value={searchTextRubricas}
              onChange={(e) => {
                setSearchTextRubricas(e.target.value);
                setCurrentPageRubricas(1);
              }}
              prefix={<IoSearchCircle className="text-red-600 text-xl" />}
              className="w-full rounded-xl! shadow-sm"
            />
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        {loading ? (
          <LoadingInformacion />
        ) : (
          <ConfigProvider locale={esES}>
            <Table
              dataSource={rubricas}
              columns={columnsRubricas}
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
              {pagination_rubricas?.total === 0
                ? 0
                : (pagination_rubricas?.page - 1) * pagination_rubricas?.limit +
                  1}{" "}
              -{" "}
              {Math.min(
                pagination_rubricas?.page * pagination_rubricas?.limit,
                pagination_rubricas?.total,
              )}
            </strong>{" "}
            de <strong>{pagination_rubricas?.total}</strong> registros
          </span>
          <Pagination
            current={pagination_rubricas?.page}
            pageSize={pagination_rubricas?.limit}
            total={pagination_rubricas?.total}
            onChange={(page) => setCurrentPageRubricas(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
      <Modal
        title={null}
        open={modalCriteriosVisible}
        onCancel={() => setModalCriteriosVisible(false)}
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
                {capitalizeFirstLetter(rubricaSeleccionada.rubrica.descripcion)}
              </p>
            </div>

            <h3 className="text-sm! font-bold text-gray-700 mb-3! px-1! flex items-center gap-2">
              <MdRule className="text-red-500" /> Criterios de Evaluación
            </h3>

            <p className="text-xs text-gray-500 mb-2!">
              Total criterios:
              {criterios.reduce((total, criterio) => {
                const valor = parseFloat(
                  criterio.rubricaCriterio[0]
                    ?.edicionCategoriaRubricaCriterio[0]?.porcentaje || 0,
                );
                return total + valor;
              }, 0)}
              %
            </p>

            <div className="w-full overflow-x-auto overflow-y-hidden">
              <ConfigProvider locale={esES}>
                <Table
                  rowKey="id"
                  dataSource={criterios}
                  columns={columnsCriterios}
                  pagination={false}
                  locale={{
                    emptyText: <EmptyTable />,
                  }}
                />
              </ConfigProvider>
              {loading_criterios && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <LoadingInformacion />
                </div>
              )}
              <div className="flex justify-between items-center px-1! mt-2!">
                <span className="text-gray-600 font-inter text-sm">
                  Mostrando{" "}
                  <strong>
                    {pagination_criterios?.total === 0
                      ? 0
                      : (pagination_criterios?.page - 1) *
                          pagination_criterios?.limit +
                        1}{" "}
                    -{" "}
                    {Math.min(
                      pagination_criterios?.page * pagination_criterios?.limit,
                      pagination_criterios?.total,
                    )}
                  </strong>{" "}
                  de <strong>{pagination_criterios?.total}</strong> registros
                </span>

                <Pagination
                  current={pagination_criterios?.page}
                  pageSize={pagination_criterios?.limit}
                  total={pagination_criterios?.total}
                  onChange={(page) => setCurrentPageCriterios(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default RubricasCategoriaEdicion;
