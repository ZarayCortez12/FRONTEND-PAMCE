import { useEffect, useState } from "react";
import { Tooltip, Modal, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaCommentDots, FaClipboardList } from "react-icons/fa";
import { motion } from "framer-motion";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { obtenerEvaluacion } from "../features/evaluacion/evaluacion.slice";
import { listarRubricasPorCategoriaEdicion } from "../features/rubricas/rubricas.slice";

const RenderEvaluacionModerna = ({
  rubricasCategoriaEdicion,
  notas,
  observaciones,
  calcularNotaRubrica,
  calcularNotaCriterio,
}) => {
  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const [visibles, setVisibles] = useState({});
  return (
    <div className="flex flex-col gap-4">
      {rubricasCategoriaEdicion?.map((item, index) => (
        <div
          key={index}
          className="border border-gray-100 rounded-2xl shadow-sm bg-white overflow-hidden"
        >
          <div className="bg-gray-50/80 p-4! border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center bg-red-600 text-white rounded-xl px-3! py-1! shadow-sm">
                <span className="text-[10px] uppercase font-bold leading-none">
                  Ponderación
                </span>
                <span className="text-sm font-black">{item.porcentaje}%</span>
              </div>
              <div className="text-[13px]">
                <h4 className="font-poppins font-bold text-gray-800 m-0">
                  {capitalizeFirstLetter(item.rubrica.nombre)}
                </h4>
                <p className="text-gray-400 m-0 italic">
                  {capitalizeFirstLetter(item.rubrica.descripcion)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 self-end md:self-center">
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="text-[11px] text-gray-400 uppercase font-black mb-1!">
                  Calificación Final Rúbrica
                </span>
                <div className="bg-gray-100 px-3! py-1! rounded-lg">
                  <span className="font-poppins font-bold text-gray-700">
                    {calcularNotaRubrica(item).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2! space-y-2">
            {item.rubrica.RubricaCriterios.map((rc, idx) => (
              <div
                key={idx}
                className="group flex flex-col gap-3 p-4! rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="text-[13px] font-bold text-gray-700 font-poppins">
                        {capitalizeFirstLetter(rc.Criterio.nombre)}
                      </span>
                      <Tag
                        color="default"
                        className="text-[9px] border-none bg-gray-100 font-bold rounded-full"
                      >
                        PESO:{" "}
                        {rc.edicionCategoriaRubricaCriterio[0].porcen || 0}%
                      </Tag>
                    </div>
                    <p className="text-[13px] text-gray-500 ml-3.5 leading-relaxed">
                      {capitalizeFirstLetter(rc.Criterio.descripcion)}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-center">
                    <Tooltip title="Añadir justificación/observación">
                      <button
                        onClick={() =>
                          setVisibles((prev) => ({
                            ...prev,
                            [rc.edicionCategoriaRubricaCriterio[0].id_ecr]:
                              !prev[
                                rc.edicionCategoriaRubricaCriterio[0].id_ecr
                              ],
                          }))
                        }
                        className={`p-2! rounded-lg transition-all ${
                          visibles[rc.edicionCategoriaRubricaCriterio[0].id_ecr]
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <FaCommentDots size={14} />
                      </button>
                    </Tooltip>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 uppercase font-black mb-1!">
                        Calificación
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {notas[rc.edicionCategoriaRubricaCriterio[0].id_ecr]}
                      </span>
                    </div>

                    <div className="flex flex-col items-center min-w-[70px]">
                      <span className="text-[9px] text-gray-400 uppercase font-black mb-1!">
                        Calificación Final
                      </span>
                      <div className="bg-gray-100 px-3! py-1! rounded-lg">
                        <span className="font-poppins font-bold text-gray-700">
                          {Number.isNaN(
                            calcularNotaCriterio(
                              notas[
                                rc.edicionCategoriaRubricaCriterio[0].id_ecr
                              ],
                              item.porcentaje,
                              rc.edicionCategoriaRubricaCriterio[0].porcen,
                            ),
                          )
                            ? "0.00"
                            : calcularNotaCriterio(
                                notas[
                                  rc.edicionCategoriaRubricaCriterio[0].id_ecr
                                ],
                                item.porcentaje,
                                rc.edicionCategoriaRubricaCriterio[0].porcen,
                              ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {visibles[rc.edicionCategoriaRubricaCriterio[0].id_ecr] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3!"
                  >
                    <span className="text-[10px] text-gray-400 uppercase font-black mb-3!">
                      OBSERVACIÓN{" "}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {
                        observaciones[
                          rc.edicionCategoriaRubricaCriterio[0].id_ecr
                        ]
                      }
                    </span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function InformacionEvaluacion({
  abrirModal,
  setAbrirModal,
  id_edicion_categoria,
  id_participacion_jurado,
}) {
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const participacion = useSelector(
    (state) => state.participacion.participacion,
  );
  const [notas, setNotas] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const juradoAsignado = participacion?.juradosAsignados?.find(
    (p) => p.id_jurado === usuario.id_usuario,
  );
  const evaluacion = useSelector((state) => state.evaluacion.evaluacion);
  const rubricas = useSelector(
    (state) => state.rubricas.rubricas_categoria_edicion,
  );
  const isEvaluado = juradoAsignado?.estado === "evaluado";

  useEffect(() => {
    if (!id_edicion_categoria || !id_participacion_jurado) return;
    dispatch(
      listarRubricasPorCategoriaEdicion({
        id_edicion_categoria,
      }),
    );
    dispatch(obtenerEvaluacion(id_participacion_jurado))
      .unwrap()
      .then((res) => {
        res.evaluaciones.forEach((e) =>
          setNotas((prev) => ({
            ...prev,
            [e.edicionCategoriaRubricaCriterio.id_ecrc]: e.calificacion,
          })),
        );
        res.evaluaciones.forEach((e) =>
          setObservaciones((prev) => ({
            ...prev,
            [e.edicionCategoriaRubricaCriterio.id_ecrc]: e.observacion,
          })),
        );
      })
      .catch((err) => {
        console.log("Error al obtener la evaluacion", err);
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [id_edicion_categoria, id_participacion_jurado, dispatch]);

  const calcularNotaCriterio = (nota, pesoRubrica, pesoCriterio) => {
    return (pesoRubrica / 100) * (pesoCriterio / 100) * (nota || 0);
  };

  const calcularNotaRubrica = (rubricaItem) => {
    return rubricaItem.rubrica.RubricaCriterios.reduce((acc, rc) => {
      const nota = notas[rc.edicionCategoriaRubricaCriterio[0].id_ecr] || 0;

      return (
        acc +
        calcularNotaCriterio(
          nota,
          rubricaItem.porcentaje,
          rc.edicionCategoriaRubricaCriterio[0].porcen,
        )
      );
    }, 0);
  };

  const notaFinal = rubricas?.reduce((acc, item) => {
    return acc + calcularNotaRubrica(item);
  }, 0);

  return (
    <Modal
      open={abrirModal}
      onCancel={() => {
        setAbrirModal(false);
      }}
      footer={null}
      width={900}
      centered
      title={
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-600 font-poppins  mb-2!">
            <FaClipboardList /> Información de la Evaluación
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Rúbrica
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Criterio
              </span>
            </div>
          </div>
        </div>
      }
      className="py-8!"
    >
      <div className="p-1! w-full">
        <RenderEvaluacionModerna
          editando={editando}
          rubricasCategoriaEdicion={rubricas}
          notas={notas}
          setNotas={setNotas}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          calcularNotaRubrica={calcularNotaRubrica}
          calcularNotaCriterio={calcularNotaCriterio}
          isEvaluado={isEvaluado}
        />
        <div className="mt-8! space-y-4">
          <div className="p-6! bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
            <div className="mb-4! md:mb-0">
              <h3 className="text-lg font-bold m-0! font-poppins text-white!">
                Resultado de la Evaluación
              </h3>
              <p className="text-gray-400 text-xs m-0! font-inter">
                El puntaje se calcula basado en la ponderación de cada rúbrica.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                  Total
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-poppins text-white">
                    {notaFinal.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-gray-500">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InformacionEvaluacion;
