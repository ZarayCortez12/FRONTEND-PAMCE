import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { Breadcrumb, Tabs, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Layers,
  Gavel,
  UserPlus,
  Trophy,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";
import {
  obtenerEdicion,
  limpiarEdicionObtenida,
} from "../../features/ediciones/edicion.slice";
import ResumenTab from "../../components/ComponentTabs/ResumenTab";
import CategoriasTab from "../../components/ComponentTabs/CategoriasTab";
import JuradosTab from "../../components/ComponentTabs/JuradosTab";
import ParticipacionesTab from "../../components/ComponentTabs/ParticipacionesTab";
import PostulacionesTab from "../../components/ComponentTabs/Postulaciones";
import GanadoresTab from "../../components/ComponentTabs/GanadoresTab";
import ConvocadosTab from "../../components/ComponentTabs/ConvocadosTab";
import LoadingData from "@/components/LoadingData";
import { useLocation } from "react-router-dom";
import imagen_no_data from "../../images/imagen_no_data.jpg";

function InformacionEdicion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id_edicion } = useParams();
  const edicion = useSelector((state) => state.ediciones.edicion);
  const loading_edicion = useSelector(
    (state) => state.ediciones.loadingEdicion,
  );
  const error_edicion = useSelector((state) => state.ediciones.errorEdicion);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab") || "1";

  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    document.title = "PAMCE | Información de la Edición";
    dispatch(limpiarEdicionObtenida());
    dispatch(obtenerEdicion(id_edicion));
  }, [id_edicion, dispatch]);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <LayoutDashboard size={16} /> Resumen
        </span>
      ),
      children: <ResumenTab edicion={edicion} />,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <Layers size={16} /> Categorías
        </span>
      ),
      children: <CategoriasTab edicion={edicion} />,
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <Gavel size={16} /> Jurados
        </span>
      ),
      children: <JuradosTab edicion={edicion} />,
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <Users size={16} /> Participaciones
        </span>
      ),
      children: <ParticipacionesTab edicion={edicion} />,
    },
    {
      key: "5",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <UserPlus size={16} /> Postulaciones
        </span>
      ),
      children: <PostulacionesTab edicion={edicion} />,
    },
    {
      key: "6",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <Trophy size={16} /> Ganadores
        </span>
      ),
      children: <GanadoresTab edicion={edicion} />,
    },
    {
      key: "7",
      label: (
        <span className="flex items-center gap-2 px-2! font-poppins">
          <Megaphone size={16} /> Convocados
        </span>
      ),
      children: <ConvocadosTab edicion={edicion} />,
    },
  ];

  const validTabs = items.map((i) => i.key);

  useEffect(() => {
    if (!validTabs.includes(activeTab)) {
      setActiveTab("1");
      setSearchParams({ tab: "1" });
    }
  }, [activeTab]);

  if (loading_edicion) {
    return <LoadingData mensaje="Cargando información de edición..." />;
  }

  if (error_edicion) {
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
            {error_edicion}
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

  if (edicion === undefined) {
    return <LoadingData mensaje="Cargando información..." />;
  }

  if (edicion === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <img
          src={imagen_no_data}
          alt="Participación no encontrada"
          className="h-40 object-contain"
        />

        <h2 className="font-montserrat text-xl font-semibold text-gray-800">
          Edición no encontrada
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
            {capitalizeFirstLetter(edicion.nombre_edicion)}
          </h1>

          <span
            className={`ml-2! text-xs md:text-sm text-white font-montserrat font-bold px-2! py-0.5! rounded-full ${
              edicion.estado_edicion === "finalizada"
                ? "bg-red-600"
                : "bg-green-600"
            }`}
          >
            {capitalizeFirstLetter(edicion.estado_edicion)}
          </span>
        </div>

        <Breadcrumb className="font-montserrat text-xs! md:text-sm!">
          <Breadcrumb.Item
            className="cursor-pointer"
            onClick={() => {
              location.pathname.startsWith("/jurado")
                ? navigate("/jurado/ediciones")
                : navigate("/director/ediciones");
            }}
          >
            {"Ediciones"}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{"Información de la Edición"}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="rounded-2xl shadow-sm border border-gray-100">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setSearchParams({ tab: key });
          }}
          items={items}
          className="custom-tabs"
          size="large"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{
            marginBottom: 0,
            padding: "0 20px",
            background: "#fcfcfc",
            borderBottom: "1px solid #f0f0f0",
          }}
        />
      </div>
    </div>
  );
}

export default InformacionEdicion;
