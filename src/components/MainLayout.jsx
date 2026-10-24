import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Modal, Badge } from "antd";
import Logo from "../images/icono_pamce.png";
import "../styles/custom.css";
import { useMenusPorRol } from "../utils/menuConfig";
import { FaUser, FaRegEdit } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";
import { PiUserSwitch } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import {
  obtenerUsuarioActual,
  editarInformacionContacto,
  cambiarRolActivo,
  logout,
} from "../features/autenticacion.slice";
import { obtenerEdicionEnProceso } from "../features/ediciones/edicion.slice";
import { IoIosInformationCircle } from "react-icons/io";
import { toast } from "react-toastify";
import ScrollToTop from "./ScrollToTop";
import LoadingComponent from "@/components/LoadingComponent";
import { listarNotificacionesSinLeer } from "../features/notificaciones/notificaciones.slice.js";
const { Header, Sider, Content } = Layout;
import logo_carrera from "../images/nombre_carrera_blanco.png";
import nombre_carrera_blanco from "../images/nombre_carrera_blanco.png";
import logo_universidad_vertical from "../images/logo_universidad_vertical.png";
import logo_universidad from "../images/logo_universidad.jpg";

const InfoInput = ({
  label,
  name,
  value,
  displayValue,
  isEditing,
  onChange,
  error,
}) => (
  <div className="flex flex-col">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </label>
    {isEditing ? (
      <>
        <input
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4! py-2.5! border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-200 outline-none ${
            error
              ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500"
              : "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:bg-white"
          }`}
        />
        {error && (
          <p className="text-red-600 text-xs mt-1.5! font-medium pl-1! flex items-center gap-1">
            {error}
          </p>
        )}
      </>
    ) : (
      <p className="font-medium text-gray-800 py-1! text-sm">{displayValue}</p>
    )}
  </div>
);

const InfoDisplay = ({ label, value }) => {
  const hasValue =
    value !== null && value !== undefined && String(value).trim() !== "";

  return (
    <div>
      <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1!">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-800">
        {hasValue ? (
          capitalizeWords(String(value).trim())
        ) : (
          <span className="text-gray-400 italic">No disponible</span>
        )}
      </dd>
    </div>
  );
};

const InfoDocumento = ({ label, value }) => {
  const hasValue =
    value !== null && value !== undefined && String(value).trim() !== "";

  return (
    <div>
      <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1!">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-800">
        {hasValue ? (
          String(value).trim()
        ) : (
          <span className="text-gray-400 italic">No disponible</span>
        )}
      </dd>
    </div>
  );
};

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuario = useSelector((state) => state.autenticacion.usuario);
  const edicion_en_proceso = useSelector(
    (state) => state.ediciones.edicion_en_proceso,
  );
  const menusPorRol = useMenusPorRol();
  const [selectedKey, setSelectedKey] = useState(
    () => localStorage.getItem("selectedMenuKey") || "inicio",
  );
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [errors, setErrors] = useState([]);
  const notificaciones_sin_leer = useSelector(
    (state) => state.notificaciones.notificaciones_sin_leer,
  );

  const [form, setForm] = useState({
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    direccion: usuario?.direccion || "",
  });

  const handleSelect = ({ key }) => {
    setSelectedKey(key);
    localStorage.setItem("selectedMenuKey", key);
  };

  useEffect(() => {
    if (!usuario) {
      dispatch(obtenerUsuarioActual());
    }

    setLoading(false);
  }, [dispatch, usuario]);

  useEffect(() => {
    if (!edicion_en_proceso) {
      dispatch(obtenerEdicionEnProceso());
    }
  }, [dispatch, edicion_en_proceso]);

  useEffect(() => {
    if (!usuario?.id_usuario) return;

    dispatch(
      listarNotificacionesSinLeer({
        id_usuario: usuario.id_usuario,
        id_rol: usuario.rol_activo?.id_rol,
      }),
    );

    const interval = setInterval(() => {
      dispatch(
        listarNotificacionesSinLeer({
          id_usuario: usuario.id_usuario,
          id_rol: usuario.rol_activo?.id_rol,
        }),
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, usuario]);

  useEffect(() => {
    if (usuario) {
      setForm({
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
      });
    }
  }, [usuario]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const [year, month, day] = fecha.split("T")[0].split("-");

    const fechaLocal = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fechaLocal);
  };

  const cambiarRolActivoUsuario = async (nuevoRol) => {
    try {
      const res = await dispatch(
        cambiarRolActivo({
          id_usuario: usuario.id_usuario,
          nuevoRol: nuevoRol.id_rol,
        }),
      ).unwrap();

      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(`/${res.usuario.rol_activo.nombre_rol}/inicio`, {
        replace: true,
      });
    } catch (err) {
      console.error("Error cambiando rol:", err);

      toast.error(err?.message || "Error al cambiar de rol", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const cerrarSesion = async () => {
    try {
      const res = await dispatch(logout()).unwrap();

      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });

      localStorage.removeItem("selectedMenuKey");

      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Error al cerrar sesión", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const validarCorreo = (correo) => {
    if (!correo || !correo.trim()) {
      return "Este campo es obligatorio";
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(correo.trim())) {
      return "Ingrese un correo electrónico válido";
    }

    return "";
  };

  const validarTelefono = (telefono) => {
    if (!telefono || !telefono.trim()) {
      return "Este campo es obligatorio";
    }

    if (!/^\d+$/.test(telefono)) {
      return "El teléfono solo debe contener números";
    }

    return "";
  };

  const validarDireccion = (direccion) => {
    const regex = /^[A-Za-z0-9\s#\-\.\°]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+$/;

    if (!direccion || !direccion.trim()) {
      return "Este campo es obligatorio";
    }

    if (!regex.test(direccion.trim())) {
      return "El formato debe ser: Dirección, Barrio, Ciudad";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let mensaje = "";

    if (name === "correo") {
      mensaje = validarCorreo(value);
    }

    if (name === "telefono") {
      mensaje = validarTelefono(value);
    }

    if (name === "direccion") {
      mensaje = validarDireccion(value);
    }

    setErrors((prev) => {
      const nuevosErrores = prev.filter((error) => error.campo !== name);

      if (!mensaje) {
        return nuevosErrores;
      }

      return [
        ...nuevosErrores,
        {
          campo: name,
          mensaje,
        },
      ];
    });
  };

  return (
    <>
      {loading ? (
        <LoadingComponent mensaje="Cargando Información..." />
      ) : !usuario ? (
        <Navigate to="/" replace />
      ) : (
        <Layout onContextMenu={(e) => e.preventDefault()}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="bg-white! border-r-2 border-[#e10318] transition-all! duration-300! overflow-y-auto!"
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="logo bg-[#e10318]! h-[60px] flex! !items-center! justify-center!">
              <h2 className="text-white text-xl! font-bold!">
                {collapsed ? (
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-10! h-10! mx-auto! transition-all! duration-300"
                  />
                ) : (
                  <span className="text-white font-poppins md:text-[28px] transition-all! duration-300!">
                    PAMCE UFPS
                  </span>
                )}
              </h2>
            </div>
            <div className="flex flex-col" style={{ height: "90vh" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[""]}
                onClick={({ key }) => {
                  navigate(`/${usuario.rol_activo.nombre_rol}/${key}`);
                }}
                items={menusPorRol[usuario.rol_activo.nombre_rol] || []}
                selectedKeys={[selectedKey]}
                onSelect={handleSelect}
                className="[&_.ant-menu-item]:my-1! [&_.ant-menu-item]:h-9! [&_.ant-menu-item]:leading-9!"
              />

              <div
                className={`mt-auto! border-t border-gray-200 ${
                  collapsed ? "mx-2! px-1! py-1!" : "mx-4! px-2! py-2!"
                }`}
              >
                <img
                  src={collapsed ? logo_universidad_vertical : logo_universidad}
                  alt={
                    collapsed
                      ? "Logo vertical de la Universidad"
                      : "Logo del programa de Ingeniería de Sistemas"
                  }
                  className={`mx-auto! block! object-contain transition-all duration-300 ${
                    collapsed ? "h-11 w-full max-w-12" : "w-full max-w-48"
                  }`}
                />
              </div>
            </div>
          </Sider>
          <Layout style={{ background: "#C9C2C2" }}>
            <Header
              className="flex! items-center! justify-between! bg-[#e10318]! shadow-[0px_3px_8px_rgba(0,0,0,0.24)]! h-[60px]!"
              style={{ padding: "3px 15px 0px 0px" }}
            >
              <div className="flex shrink-0 items-center gap-3">
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className:
                      "!text-white !text-xl !cursor-pointer !transition",
                    onClick: () => setCollapsed(!collapsed),
                  },
                )}

                <img
                  src={nombre_carrera_blanco}
                  alt="Logo de Ingeniería de Sistemas"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "profile",
                      icon: <GrUserSettings />,
                      label: "Ver Perfil",
                      onClick: () => {
                        setMostrarPerfil(true);
                        setModoEdicion(false);
                      },
                    },
                    {
                      key: "notificaciones",
                      icon: <BellOutlined />,
                      label: (
                        <span>
                          Notificaciones
                          {notificaciones_sin_leer?.length > 0 && (
                            <Badge
                              count={notificaciones_sin_leer.length}
                              size="small"
                              style={{ marginLeft: 10 }}
                            />
                          )}
                        </span>
                      ),
                      onClick: () => {
                        navigate(
                          `/${usuario.rol_activo.nombre_rol}/notificaciones`,
                        );
                      },
                    },
                    ...usuario.roles
                      ?.filter(
                        (r) => r.nombre_rol !== usuario.rol_activo.nombre_rol,
                      )
                      .map((r) => ({
                        key: `role-${r.id_rol}`,
                        icon: <PiUserSwitch />,
                        label: (
                          <span className="block w-full">
                            Cambiar a {capitalizeWords(r.nombre_rol)}
                          </span>
                        ),
                        onClick: () => {
                          cambiarRolActivoUsuario(r);
                        },
                      })),
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: <span className="block w-full">Salir</span>,
                      onClick: () => {
                        cerrarSesion();
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer">
                  <div className="flex flex-col justify-center text-white min-w-0 overflow-hidden">
                    <span className="font-bold text-xs sm:text-sm truncate max-w-[160px] sm:max-w-[180px] md:max-w-[220px]">
                      {capitalizeWords(
                        `${usuario?.primer_nombre || ""} ${
                          usuario?.segundo_nombre || ""
                        } ${usuario?.primer_apellido || ""} ${
                          usuario?.segundo_apellido || ""
                        }`.trim() || "Usuario",
                      )}
                    </span>
                    <span className="text-xs sm:text-sm truncate max-w-[160px] sm:max-w-[180px] md:max-w-[220px] text-right">
                      {capitalizeWords(
                        usuario?.rol_activo.nombre_rol ||
                          "No hay correo registrado",
                      )}
                    </span>
                  </div>
                  <Badge
                    count={notificaciones_sin_leer?.length || 0}
                    size="small"
                    offset={[-5, 5]}
                  >
                    <Avatar
                      size={35}
                      icon={<FaUser className="text-red-600!" />}
                      className="bg-white!"
                    />
                  </Badge>
                  <DownOutlined className="text-white! text-[12px]!" />
                </div>
              </Dropdown>
            </Header>
            <Content
              id="main-content-scroll"
              style={{
                margin: "7px 7px",
                padding: 24,
                minHeight: 300,
              }}
            >
              <ScrollToTop />
              <Outlet />
            </Content>

            <Modal
              open={mostrarPerfil}
              onCancel={() => setMostrarPerfil(false)}
              footer={null}
              width={950}
              closable={false}
              centered
            >
              <div className="bg-white rounded-2xl overflow-hidden font-inter shadow-xl">
                <div className="px-5! py-4! border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5! rounded-xl text-red-600 text-xl border border-red-100">
                      <IoIosInformationCircle />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
                        Detalles del Perfil
                      </h2>
                      <p className="text-xs text-gray-500 -mt-0.5!">
                        Información personal y de contacto registrada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModoEdicion(!modoEdicion)}
                      className={`flex items-center gap-2 px-4! py-2! rounded-lg text-sm font-semibold transition-all duration-200 border ${
                        modoEdicion
                          ? "bg-amber-50 text-amber-700 border-amber-200 shadow-inner"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <FaRegEdit
                        className={modoEdicion ? "animate-pulse" : ""}
                      />
                      {modoEdicion ? "Editando Campos" : "Editar Información"}
                    </button>

                    <button
                      onClick={() => {
                        setMostrarPerfil(false);
                        setErrors([]);
                      }}
                      className="text-gray-400 hover:text-red-600 text-2xl p-1 ml-2 transition"
                      aria-label="Cerrar"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <div className="p-6! bg-gray-50/50 space-y-8">
                  <section className="bg-white py-4! px-6! rounded-2xl border border-gray-100 shadow-sm mb-4!">
                    <h3 className=" font-bold uppercase text-gray-500 tracking-wider mb-4! flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-gray-300 rounded "></span>
                      <span className="text-base">
                        Información de Identidad
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                      <InfoDisplay
                        label="Nombre Completo"
                        value={[
                          usuario?.primer_nombre,
                          usuario?.segundo_nombre,
                          usuario?.primer_apellido,
                          usuario?.segundo_apellido,
                        ]
                          .filter((nombre) => nombre?.trim())
                          .join(" ")}
                      />
                      <InfoDocumento
                        label="Documento"
                        value={[
                          usuario?.tipo_documento,
                          usuario?.numero_documento
                            ? new Intl.NumberFormat("es-CO").format(
                                usuario.numero_documento,
                              )
                            : "",
                        ]
                          .filter((valor) => valor?.toString().trim())
                          .join(" ")}
                      />
                      <InfoDisplay
                        label="Código Institucional"
                        value={usuario?.codigo_institucional}
                      />
                      <InfoDisplay
                        label="Nivel de Educación"
                        value={capitalizeWords(usuario?.nivel_educativo)}
                      />
                      <InfoDisplay
                        label="Género"
                        value={capitalizeWords(usuario?.genero)}
                      />
                      <InfoDisplay
                        label="Fecha de Nacimiento"
                        value={formatearFecha(usuario.fecha_nacimiento)}
                      />
                    </div>
                  </section>

                  <section className="bg-white p-5! rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-bold uppercase text-red-600 tracking-wider mb-4! flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-red-200 rounded"></span>
                      <span className="text-base">Contacto y Registro</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb-2!">
                      <InfoInput
                        label="Correo Electrónico"
                        name="correo"
                        value={form.correo}
                        displayValue={usuario.correo}
                        isEditing={modoEdicion}
                        onChange={handleChange}
                        error={
                          errors?.find((e) => e.campo === "correo")?.mensaje
                        }
                      />
                      <InfoInput
                        label="Número de Teléfono"
                        name="telefono"
                        value={form.telefono}
                        displayValue={usuario.telefono}
                        isEditing={modoEdicion}
                        onChange={handleChange}
                        error={
                          errors?.find((e) => e.campo === "telefono")?.mensaje
                        }
                      />
                      <InfoInput
                        label="Dirección Residencia"
                        name="direccion"
                        value={form.direccion}
                        displayValue={usuario.direccion || "No registrada"}
                        isEditing={modoEdicion}
                        onChange={handleChange}
                        error={
                          errors?.find((e) => e.campo === "direccion")?.mensaje
                        }
                      />
                    </div>
                  </section>
                </div>

                {modoEdicion && (
                  <div className="bg-gray-100 px-8! py-4! flex justify-end gap-3 border-t border-gray-200">
                    <button
                      className="px-5! py-2.5! rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition active:scale-95"
                      onClick={() => {
                        setModoEdicion(false);
                        setErrors([]);
                        setForm({
                          correo: usuario.correo || "",
                          telefono: usuario.telefono || "",
                          direccion: usuario.direccion || "",
                        });
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-8! py-2.5! bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition transform active:scale-95 flex items-center gap-2"
                      onClick={() => {
                        dispatch(
                          editarInformacionContacto({
                            usuarioId: usuario.id_usuario,
                            datos: {
                              correo: form.correo,
                              telefono: form.telefono,
                              direccion: form.direccion,
                            },
                          }),
                        )
                          .unwrap()
                          .then((res) => {
                            toast.success(res.message, {
                              position: "top-right",
                              autoClose: 3000,
                              pauseOnHover: true,
                              draggable: true,
                            });

                            setModoEdicion(false);
                            setMostrarPerfil(false);
                          })
                          .catch((err) => {
                            if (err.message) {
                              toast.error(err.message, {
                                position: "top-right",
                                autoClose: 3000,
                                pauseOnHover: true,
                                draggable: true,
                              });
                            }
                            setErrors(err.errores || []);
                          });
                      }}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </Modal>
          </Layout>
        </Layout>
      )}
    </>
  );
}

export default MainLayout;
