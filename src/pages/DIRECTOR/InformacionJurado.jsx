import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Card, Breadcrumb, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import imagen_no_data from "../../images/imagen_no_data.jpg";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  obtenerJurado,
  obtenerEdicionesParticipacionJurado,
  obtenerCategoriasEdicionesParticipacionJurado,
  limpiarCategoriasParticionJurado,
} from "../../features/jurados/jurado.slice";
import { listarCategorias } from "../../features/categorias/categoria.slice";
import { listarEdiciones } from "../../features/ediciones/edicion.slice";
import { BiSolidCategory } from "react-icons/bi";
import ParticipacionesJurado from "@/components/DataJurado/ParticipacionesJurado";
import LoadingData from "@/components/LoadingData";

function InformacionJurado() {
  const { id_usuario } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jurado = useSelector((state) => state.jurados.jurado);
  const loading_jurado = useSelector((state) => state.jurados.loadingJurado);
  const ediciones = useSelector((state) => state.jurados.ediciones);
  const categorias = useSelector((state) => state.jurados.categorias);

  const location = useLocation();

  const [edicionSeleccionada, setEdicionSeleccionada] = useState(null);

  const fromJuradoEdicion = location.state?.from === "jurado-edicion";

  useEffect(() => {
    document.title = "PAMCE | Información Jurado";
    if (!id_usuario) return;
    dispatch(limpiarCategoriasParticionJurado());

    dispatch(obtenerJurado(id_usuario));
    dispatch(obtenerEdicionesParticipacionJurado({ id_jurado: id_usuario }));
    dispatch(listarCategorias());
    dispatch(listarEdiciones());
  }, [id_usuario, dispatch]);

  useEffect(() => {
    if (!edicionSeleccionada) return;
    dispatch(
      obtenerCategoriasEdicionesParticipacionJurado({
        id_edicion: edicionSeleccionada.id_edicion,
        id_jurado: id_usuario,
      }),
    );
  }, [edicionSeleccionada, dispatch, id_usuario]);

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

  const DatosPersonales = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Documento"
          valor={
            jurado?.numero_documento ? `CC ${jurado?.numero_documento}` : "-"
          }
        />
        <Campo
          label="Nombres"
          valor={[
            capitalizeFirstLetter(jurado?.primer_nombre),
            capitalizeFirstLetter(jurado?.segundo_nombre),
          ].join(" ")}
        />
        <Campo
          label="Apellidos"
          valor={[
            capitalizeFirstLetter(jurado?.primer_apellido),
            capitalizeFirstLetter(jurado?.segundo_apellido),
          ].join(" ")}
        />
        <Campo
          label="Código Institucional"
          valor={jurado?.codigo_institucional || "No Aplica"}
        />
        <Campo
          label="Nivel Educativo"
          valor={
            capitalizeFirstLetter(jurado?.nivel_estudio_superior) || "No Aplica"
          }
        />
        <Campo label="Teléfono" valor={jurado?.telefono || "-"} />
        <Campo label="Género" valor={capitalizeFirstLetter(jurado?.genero)} />
        <Campo
          label="Dirección"
          valor={capitalizeFirstLetter(jurado?.direccion) || "-"}
        />
        <Campo
          label="Correo Electrónico"
          valor={jurado?.correo_electronico || "-"}
        />
      </div>
      <div className="hidden lg:flex justify-center">
        <img
          src={imagen_data_postulado}
          alt="Foto de usuario"
          className="h-60 object-contain ml-3!"
        />
      </div>
    </div>
  );

  const Campo = ({ label, valor }) => (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  if (loading_jurado || jurado === undefined) {
    return <LoadingData mensaje="Cargando información del jurado..." />;
  }

  if (jurado === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Jurado no encontrado"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Jurado no encontrado
        </h2>

        <button
          onClick={() => navigate("/director/lista-jurados")}
          className="rounded-lg bg-[#C21111] px-5! py-2.5! text-sm font-medium text-white transition hover:bg-red-800"
        >
          Volver a la lista de jurados
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
          <h1 className="font-montserrat text-lg! md:text-xl!">
            Información del Jurado
          </h1>
        </div>

        <Breadcrumb className="font-montserrat text-xs! md:text-sm!">
          {fromJuradoEdicion ? (
            <>
              <Breadcrumb.Item
                className="cursor-pointer"
                onClick={() => navigate("/director/jurados-edicion")}
              >
                Jurados Edicion
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item
              className="cursor-pointer"
              onClick={() => navigate("/director/lista-jurados")}
            >
              Jurados
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>
            {capitalizeFirstLetter(jurado?.primer_nombre)}{" "}
            {capitalizeFirstLetter(jurado?.segundo_nombre)}{" "}
            {capitalizeFirstLetter(jurado?.primer_apellido)}{" "}
            {capitalizeFirstLetter(jurado?.segundo_apellido)}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3!">
        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <TituloCard icon={FaUser} titulo="Datos Personales" />
          <DatosPersonales />
        </Card>
        <div className="flex flex-col gap-2 lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-red-200 bg-red-50 h-full">
            <TituloCard
              icon={FaAward}
              titulo="Ediciones"
              color="text-red-500"
            />
            <div className="flex flex-wrap gap-2">
              {ediciones?.length ? (
                ediciones.map((edicion) => (
                  <button
                    key={edicion.id_edicion}
                    onClick={() => setEdicionSeleccionada(edicion)}
                    className={`text-left px-3! py-2! rounded-lg font-inter text-sm transition
                    ${
                      edicionSeleccionada?.id_edicion === edicion.id_edicion
                        ? "bg-red-600 text-white"
                        : "bg-white hover:bg-red-100"
                    }`}
                  >
                    {capitalizeFirstLetter(edicion.nombre_edicion)}
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-500 font-inter">
                  No ha participado en ninguna edición
                </span>
              )}
            </div>
          </Card>
          <Card className="rounded-xl shadow-sm border border-blue-200 bg-blue-50 h-full">
            <TituloCard
              icon={BiSolidCategory}
              titulo="Categorías"
              color="text-red-600"
            />
            {categorias?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {categorias.map((cat) => (
                  <span
                    key={cat.id_edicion_categoria}
                    className=" inline-flex items-center gap-1 px-3! py-1.5! rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm font-inter"
                  >
                    {capitalizeFirstLetter(cat.nombre_categoria)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500 font-inter">
                No ha participado en ninguna categoría
              </span>
            )}
          </Card>
        </div>
      </div>
      <ParticipacionesJurado
        id_usuario={id_usuario}
        location={"jurados-edicion"}
      />
    </div>
  );
}

export default InformacionJurado;
