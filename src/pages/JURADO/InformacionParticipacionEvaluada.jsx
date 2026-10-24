import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import {
  Card,
  Modal,
  Breadcrumb,
  Select,
  Tag,
  Tooltip,
  InputNumber,
} from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { obtenerParticipacionAEvaluar } from "../../features/participacion/participacion.slice";
import {
  FaUser,
  FaClipboardList,
  FaCommentDots,
  FaCommentAlt,
} from "react-icons/fa";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import dayjs from "dayjs";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { IoIosInformationCircle } from "react-icons/io";
import { obtenerEvaluacion } from "../../features/evaluacion/evaluacion.slice";
import { listarRubricasPorCategoriaEdicion } from "../../features/rubricas/rubricas.slice";
import LoadingData from "@/components/LoadingData";
import imagen_no_data from "../../images/imagen_no_data.jpg";

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

                      <InputNumber
                        min={0}
                        max={5}
                        step={0.1}
                        value={
                          notas[rc.edicionCategoriaRubricaCriterio[0].id_ecr]
                        }
                        disabled={true}
                      />
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
                      OBSERVACIÓN
                    </span>

                    <textarea
                      placeholder="Justifique su calificación aquí..."
                      className="mt-2! w-full text-xs p-3! rounded-xl border border-amber-200 bg-amber-50/30 focus:outline-none focus:border-amber-400 text-gray-700"
                      rows={2}
                      disabled={true}
                      value={
                        observaciones[
                          rc.edicionCategoriaRubricaCriterio[0].id_ecr
                        ]
                      }
                    />
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

function InformacionParticipacionEvaluada() {
  const { id_participacion } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usuario = useSelector((state) => state.autenticacion.usuario);

  const participacion = useSelector(
    (state) => state.participacion.participacion,
  );
  const loading_participacion = useSelector(
    (state) => state.participacion.loadingParticipacion,
  );
  const error_participacion = useSelector(
    (state) => state.participacion.errorParticipacion,
  );

  const rubricas = useSelector(
    (state) => state.rubricas.rubricas_categoria_edicion,
  );

  const [notas, setNotas] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [observacionGeneral, setObservacionGeneral] = useState("");

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    document.title = "PAMCE | Información de la Participación";
    if (!id_participacion) return;

    dispatch(obtenerParticipacionAEvaluar(id_participacion))
      .unwrap()
      .then((res) => {
        toast.success(res.message, {
          toastId: "participacion-success",
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        setObservacionGeneral(
          res.participacion?.juradosAsignados.filter(
            (p) => p.id_jurado === usuario.id_usuario,
          )[0]?.observacion,
        );
        dispatch(
          listarRubricasPorCategoriaEdicion({
            id_edicion_categoria:
              res?.participacion?.edicionCategoria.id_edicion_categoria,
          }),
        );
        dispatch(
          obtenerEvaluacion(
            res.participacion?.juradosAsignados.filter(
              (p) => p.id_jurado === usuario.id_usuario,
            )[0]?.id_participacion_jurado,
          ),
        )
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
          });
      })
      .catch((err) => console.log("Error al obtener la participacion", err));
  }, [id_participacion, dispatch]);

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

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosParticipante = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Documento"
          valor={
            participacion?.usuario?.numero_documento
              ? `CC ${participacion.usuario.numero_documento}`
              : "-"
          }
        />

        <Campo
          label="Nombres"
          valor={[
            capitalizeFirstLetter(participacion?.usuario?.primer_nombre),
            capitalizeFirstLetter(participacion?.usuario?.segundo_nombre),
          ].join(" ")}
        />

        <Campo
          label="Apellidos"
          valor={[
            capitalizeFirstLetter(participacion?.usuario?.primer_apellido),
            capitalizeFirstLetter(participacion?.usuario?.segundo_apellido),
          ].join(" ")}
        />

        <Campo
          label="Código Institucional"
          valor={participacion?.usuario?.codigo_institucional || "No Aplica"}
        />

        <Campo
          label="Nivel Educativo"
          valor={
            capitalizeFirstLetter(
              participacion?.usuario?.nivel_estudio_superior,
            ) || "No Aplica"
          }
        />

        <Campo
          label="Teléfono"
          valor={participacion?.usuario?.telefono || "-"}
        />

        <Campo
          label="Género"
          valor={capitalizeFirstLetter(participacion?.usuario?.genero)}
        />

        <Campo
          label="Dirección"
          valor={
            capitalizeFirstLetter(participacion?.usuario?.direccion) || "-"
          }
        />

        <Campo
          label="Correo"
          valor={participacion?.usuario?.correo_electronico || "-"}
        />
      </div>

      <div className="grid grid-cols-1 hidden lg:flex justify-center">
        <img
          src={imagen_data_postulado}
          alt="Foto de usuario"
          className="h-60 object-contain ml-3!"
        />
      </div>
    </div>
  );

  const DatosParticipacion = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2  gap-2 text-sm font-inter text-gray-700 lg:col-span-2 -mb-2!">
      <Campo
        label="Nombre Edición"
        valor={
          capitalizeFirstLetter(
            participacion?.edicionCategoria?.edicion.nombre_edicion,
          ) || "-"
        }
      />

      <Campo
        label="Nombre Categoría"
        valor={
          capitalizeFirstLetter(
            participacion?.edicionCategoria?.categoria.nombre_categoria,
          ) || "-"
        }
      />

      <Campo
        label="Fecha Inicio Edición"
        valor={
          dayjs(participacion?.edicionCategoria?.edicion.fecha_inicio).format(
            "DD/MM/YYYY",
          ) || "-"
        }
      />

      <Campo
        label="Fecha Fin Edición"
        valor={
          dayjs(participacion?.edicionCategoria?.edicion.fecha_fin).format(
            "DD/MM/YYYY",
          ) || "-"
        }
      />
    </div>
  );

  const Campo = ({ label, valor }) => (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  if (loading_participacion) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (error_participacion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg rounded-2xl text-center shadow-sm">
          <img
            src={imagen_no_data}
            alt="Error al consultar la participación"
            className="mx-auto mb-4 h-40 object-contain"
          />

          <h2 className="font-montserrat text-xl font-semibold text-gray-800">
            No se pudo consultar la participación
          </h2>

          <p className="mt-2! font-inter text-sm text-gray-500">
            {error_participacion}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5! rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
          >
            Volver
          </button>
        </Card>
      </div>
    );
  }

  if (participacion === undefined) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (participacion === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Participación no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Participación no encontrada
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-5! rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-1! w-full">
      <div className="flex! flex-col gap-2! md:flex-row! md:items-center! md:justify-between! mb-4!">
        <div className="flex! items-center! gap-2!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md"
            size={36}
          />
          <h1 className="font-montserrat text-lg! md:text-xl! -ml-3!">
            Información de la Participación
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={FaUser} titulo="Datos del Participante" />
          <DatosParticipante />
        </Card>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50">
            <TituloCard
              icon={IoIosInformationCircle}
              titulo="Datos de la Participación"
              color="text-red-500"
            />
            <DatosParticipacion />
          </Card>
          <Card className="rounded-xl shadow-sm border border-blue-200 bg-blue-50 h-full">
            <TituloCard
              icon={FaClipboardList}
              titulo="Calificación Final"
              color="text-red-600"
            />
            <p
              className={
                participacion?.calificacion_final !== null
                  ? "flex justify-center text-8xl text-blue-700 xl:-mt-4! xl:-mb-4! text-center font-bold -mt-4!"
                  : "flex justify-center text-2xl text-gray-700 3xl:text-4xl 3xl:mt-12! text-center font-semibold font-poppins"
              }
            >
              {capitalizeFirstLetter(participacion?.calificacion_final) ||
                "No hay una calificación"}
            </p>
          </Card>
        </div>
      </div>
      <div className="p-6! mb-3! bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
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
      <RenderEvaluacionModerna
        rubricasCategoriaEdicion={rubricas}
        notas={notas}
        observaciones={observaciones}
        calcularNotaRubrica={calcularNotaRubrica}
        calcularNotaCriterio={calcularNotaCriterio}
      />
      <div className="mt-8! space-y-4">
        <div className="bg-white p-5! rounded-2xl border border-gray-100 shadow-sm mb-4!">
          <div className="flex items-center gap-2 mb-3!">
            <FaCommentAlt className="text-gray-400" size={14} />
            <h4 className="text-sm font-bold text-gray-700 m-0! font-poppins">
              Observaciones Generales de la Participación
            </h4>
          </div>
          <textarea
            className="w-full p-4! rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-sm font-inter"
            placeholder="Escriba un resumen del desempeño general, fortalezas o áreas de mejora..."
            rows={4}
            disabled={true}
            value={observacionGeneral}
            onChange={(e) => setObservacionGeneral(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default InformacionParticipacionEvaluada;
