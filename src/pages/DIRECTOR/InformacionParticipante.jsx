import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Card, Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import imagen_data_postulado from "../../images/imagen_informacion_usuario.jpg";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  limpiarCategoriasEdicionesParticipacionParticipante,
  obtenerParticipante,
  obtenerCategoriasEdicionesParticipacionParticipante,
  obtenerEdicionesParticipacionParticipante,
} from "../../features/participantes/participante.slice";
import { BiSolidCategory } from "react-icons/bi";
import { listarEdiciones } from "../../features/ediciones/edicion.slice";
import { listarCategorias } from "../../features/categorias/categoria.slice";
import ConvocatoriasParticipante from "@/components/DataParticipante/ConvocatoriasParticipante";
import ParticipacionesParticipante from "@/components/DataParticipante/ParticipacionesParticipante";

function InformacionParticipante() {
  const { id_usuario } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participante = useSelector((state) => state.participantes.participante);
  const ediciones = useSelector((state) => state.participantes.ediciones);
  const categorias = useSelector((state) => state.participantes.categorias);

  const [edicionSeleccionada, setEdicionSeleccionada] = useState(null);

  useEffect(() => {
    document.title = "PAMCE | Información Participante";
    if (!id_usuario) return;
    dispatch(limpiarCategoriasEdicionesParticipacionParticipante());

    dispatch(obtenerParticipante(id_usuario));
    dispatch(obtenerEdicionesParticipacionParticipante(id_usuario));
    dispatch(listarEdiciones());
    dispatch(listarCategorias());
  }, [id_usuario, dispatch]);

  useEffect(() => {
    if (edicionSeleccionada)
      dispatch(
        obtenerCategoriasEdicionesParticipacionParticipante({
          id_edicion: edicionSeleccionada.id_edicion,
          id_participante: id_usuario,
        }),
      );
  }, [edicionSeleccionada, dispatch, id_usuario]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const TituloCard = ({ icon: Icon, titulo, color = "text-red-600" }) => (
    <div className="flex items-center gap-2 mb-3! -mt-2!">
      <Icon className={color} size={14} />
      <h3 className="font-semibold font-poppins text-sm!">{titulo}</h3>
    </div>
  );

  const DatosPersonales = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 text-sm font-inter text-gray-700 lg:col-span-2">
        <Campo
          label="Documento"
          valor={
            participante?.numero_documento
              ? `CC ${participante?.numero_documento}`
              : "-"
          }
        />

        <Campo
          label="Nombres"
          valor={[
            capitalizeFirstLetter(participante?.primer_nombre),
            capitalizeFirstLetter(participante?.segundo_nombre),
          ].join(" ")}
        />

        <Campo
          label="Apellidos"
          valor={[
            capitalizeFirstLetter(participante?.primer_apellido),
            capitalizeFirstLetter(participante?.segundo_apellido),
          ].join(" ")}
        />

        <Campo
          label="Código Institucional"
          valor={participante?.codigo_institucional || "No Aplica"}
        />

        <Campo
          label="Nivel Educativo"
          valor={
            capitalizeFirstLetter(participante?.nivel_estudio_superior) ||
            "No Aplica"
          }
        />

        <Campo label="Teléfono" valor={participante?.telefono || "-"} />
        <Campo
          label="Género"
          valor={capitalizeFirstLetter(participante?.genero)}
        />

        <Campo
          label="Dirección"
          valor={capitalizeFirstLetter(participante?.direccion) || "-"}
        />

        <Campo
          label="Correo Electrónico"
          valor={participante?.correo_electronico || "-"}
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

  return (
    <div className="p-1! w-full">
      <div className="flex! flex-col gap-2! md:flex-row! md:items-center! md:justify-between! mb-4!">
        <div className="flex! items-center! gap-2!">
          <IoMdArrowDropright
            className="text-red-600 drop-shadow-md"
            size={36}
          />
          <h1 className="font-montserrat text-lg! md:text-xl!">
            Información del Participante
          </h1>
        </div>

        <Breadcrumb className="font-montserrat text-xs! md:text-sm!">
          <Breadcrumb.Item
            className="cursor-pointer"
            onClick={() => navigate("/director/lista-participantes")}
          >
            {"Participantes"}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {capitalizeFirstLetter(participante?.primer_nombre)}{" "}
            {capitalizeFirstLetter(participante?.segundo_nombre)}{" "}
            {capitalizeFirstLetter(participante?.primer_apellido)}{" "}
            {capitalizeFirstLetter(participante?.segundo_apellido)}
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
                <span className="text-xs text-gray-500">
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
                    className=" inline-flex items-center gap-1 px-3! py-1.5! rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm"
                  >
                    {capitalizeFirstLetter(cat.nombre_categoria)}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                No ha participado en ninguna categoría
              </span>
            )}
          </Card>
        </div>
      </div>
      <ConvocatoriasParticipante id_usuario={id_usuario} />
      <ParticipacionesParticipante id_usuario={id_usuario} />
    </div>
  );
}

export default InformacionParticipante;
