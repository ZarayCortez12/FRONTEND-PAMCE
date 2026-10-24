import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Table, Breadcrumb, Select, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { obtenerCategoria } from "../../features/categorias/categoria.slice";
import { IoMdArrowDropright, IoIosInformationCircle } from "react-icons/io";
import { MdAssessment } from "react-icons/md";
import dayjs from "dayjs";
import { Trophy, ClipboardList } from "lucide-react";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import { useNavigate } from "react-router-dom";
import RubricasCategoriaEdicion from "@/components/CategoriasEdicionInfo/RubricasCategoriaEdicion";
import RequisitosCategoriaEdicion from "@/components/CategoriasEdicionInfo/RequisitosCategoriaEdicion";
import imagen_info_edicion from "./../../images/imagen_info_edicion.jpg";
import {
  limpiarParticipacionesGanadorasPorEdicionCategoria,
  listarParticipacionesGanadorasPorEdicionCategoria,
} from "../../features/participacion/participacion.slice";
import LoadingData from "@/components/LoadingData";

function InformacionCategoriaEnProceso() {
  const { id_edicion_categoria } = useParams();
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();

  const categoria = useSelector((state) => state.categorias?.categoria);
  const loading_categoria = useSelector(
    (state) => state.categorias.loadingCategoria,
  );
  const participaciones_ganadoras = useSelector(
    (state) => state.participacion.participaciones_ganadoras,
  );

  useEffect(() => {
    document.title = "PAMCE | Información de la Categoría";

    if (!id_edicion_categoria) return;
    setReady(false);

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

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const postulacionesPorEdicionCategoria = useSelector(
    (state) => state.participacion.postulacionesPorEdicionCategoria,
  );

  const ganadoresEdicionCategoria = useSelector(
    (state) => state.ganadores.ganadoresEdicionCategoria,
  );

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={16} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const CampoEstado = ({ estado }) => {
    const isActivo = estado === "activo";

    return (
      <div>
        <p className="text-sm text-gray-500 mb-1! font-inter">Estado</p>

        <span
          className={`
          inline-flex items-center px-3! py-1! rounded-full
          text-xs font-semibold font-inter
          ${
            isActivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }
        `}
        >
          {capitalizeFirstLetter(estado) || "-"}
        </span>
      </div>
    );
  };

  const DatosCategoria = () => {
    const estado = categoria?.edicionesCategoria?.[0]?.estado;

    return (
      <div className="space-y-2!">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
          <Campo
            label="Nombre Categoría"
            valor={capitalizeFirstLetter(categoria?.nombre_categoria) || "-"}
          />

          <CampoEstado estado={estado} />

          <Campo
            label="Número de Ganadores"
            valor={categoria?.edicionesCategoria?.[0]?.numero_ganadores || "-"}
          />

          <Campo
            label="Fecha de Registro"
            valor={
              categoria?.edicionesCategoria?.[0]?.fecha_registro
                ? dayjs(categoria.edicionesCategoria[0].fecha_registro).format(
                    "DD/MM/YYYY",
                  )
                : "-"
            }
          />
        </div>

        <Campo
          label="Descripción"
          valor={
            capitalizeFirstLetter(
              categoria?.edicionesCategoria?.[0]?.descripcion,
            ) || "-"
          }
          className="leading-relaxed mt-1!"
        />

        {estado === "inactivo" && (
          <Campo
            label="Observación"
            valor={
              capitalizeFirstLetter(
                categoria?.edicionesCategoria?.[0]?.observacion_inactivacion,
              ) || "-"
            }
            className="leading-relaxed"
          />
        )}
      </div>
    );
  };

  const Campo = ({ label, valor, className = "" }) => (
    <div>
      <p className="text-sm text-gray-500 mb-1! font-inter">{label}</p>
      <p className={`text-gray-900 font-medium  font-inter ${className}`}>
        {valor}
      </p>
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

  if (!id_edicion_categoria) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="font-inter text-gray-500">
          Cargando información...
        </span>
      </div>
    );
  }

  if (loading_categoria || categoria === undefined) {
    return <LoadingData mensaje="Cargando información de la categoría..." />;
  }

  if (categoria === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Categoría no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Categoría no encontrada
        </h2>

        <button
          onClick={() => navigate("/director/categorias-edicion")}
          className="rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
        >
          Volver a la lista de categorías
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
            Información de la Categoría
          </h1>
        </div>

        <Breadcrumb className="font-montserrat text-xs! md:text-sm!">
          <Breadcrumb.Item
            className="cursor-pointer"
            onClick={() => navigate("/director/categorias-edicion")}
          >
            {"Categorías"}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {capitalizeFirstLetter(categoria?.nombre_categoria)}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-4">
          <TituloCard
            icon={IoIosInformationCircle}
            titulo="Datos de la Categoría"
          />
          <DatosCategoria />
        </Card>
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={Trophy} titulo="Ganadores" />
          <SeccionGanadores participaciones={participaciones_ganadoras} />
        </Card>
      </div>
      <Card className="rounded-xl shadow-sm lg:col-span-6 mb-3!">
        <TituloCard icon={MdAssessment} titulo="Rubrícas" />
        <RubricasCategoriaEdicion id_edicion_categoria={id_edicion_categoria} />
      </Card>
      <Card className="grid grid-cols-1 rounded-xl shadow-sm  mb-3!">
        <TituloCard icon={ClipboardList} titulo="Requisitos" />
        <RequisitosCategoriaEdicion
          id_edicion_categoria={id_edicion_categoria}
        />
      </Card>
    </div>
  );
}

export default InformacionCategoriaEnProceso;
