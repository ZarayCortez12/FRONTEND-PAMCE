import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select, DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import esES from "antd/es/date-picker/locale/es_ES";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { registrarParticipacion } from "../features/participacion/participacion.slice";
import {
  obtenerEdicionEnProcesoPublico,
  obtenerUsuarioPorCedulaPublico,
  listarRequisitosEdicionPublico,
  listarCategoriasPorEdicionPublico,
  listarRequisitosPorCategoriaEdicionPublico,
  crearParticipantePublico,
} from "../features/public/public.slice";
import LoadingComponent from "@/components/LoadingComponent";

function PasoCeroRegistro({ guardarInformacionJurado, setNumeroDocumento }) {
  const { token } = useParams();
  const edicion = useSelector((state) => state.public.edicion_en_proceso);
  const usuario = useSelector((state) => state.public.usuario);
  const requisitos_edicion = useSelector(
    (state) => state.public.requisitos_edicion,
  );
  const requisitos_categoria_edicion = useSelector(
    (state) => state.public.requisitos_categoria_edicion,
  );
  const [invalido, setInvalido] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const valoresFormulario = Form.useWatch([], form);
  const dispatch = useDispatch();
  const [numero_documento, setNumeroDocumento] = useState("");
  const [usuarioExiste, setUsuarioExiste] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [tokenValido, setTokenValido] = useState(null);
  const [formularioDisponible, setFormularioDisponible] = useState(null);
  const [loadingRequisitos, setLoadingRequisitos] = useState(false);
  const [requisitoAbierto, setRequisitoAbierto] = useState(null);
  const [archivos, setArchivos] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [requisitosCategoria, setRequisitosCategoria] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingRequisitosCategoria, setLoadingRequisitosCategoria] =
    useState(false);
  const [puedeEnviar, setPuedeEnviar] = useState(false);

  useEffect(() => {
    try {
      if (!edicion) {
        dispatch(obtenerEdicionEnProcesoPublico(token))
          .unwrap()
          .catch((err) => {
            console.error(err);
            setTokenValido(false);
          });
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [dispatch, token, edicion]);

  useEffect(() => {
    document.title = "PAMCE | Registrar Participación";
    if (!edicion) return;

    try {
      const decoded = jwtDecode(token);

      setFormularioDisponible(decoded.exp && decoded.exp > Date.now() / 1000);

      setTokenValido(decoded?.id_edicion === edicion.id_edicion);
    } catch (error) {
      console.error("Token inválido o error:", error);
      setTokenValido(false);
    }
  }, [token, edicion]);

  useEffect(() => {
    if (pasoActual === 1 && edicion?.id_edicion) {
      setLoadingRequisitos(true);
      dispatch(
        listarRequisitosEdicionPublico({
          id_edicion: edicion.id_edicion,
          token,
        }),
      )
        .unwrap()
        .catch((err) => {
          console.error("Error al cargar requisitos:", err);
        })
        .finally(() => setLoadingRequisitos(false));
    }
  }, [pasoActual, edicion, dispatch]);

  useEffect(() => {
    if (pasoActual === 2 && edicion?.id_edicion) {
      setLoadingCategorias(true);

      dispatch(
        listarCategoriasPorEdicionPublico({
          id_edicion: edicion.id_edicion,
          token,
        }),
      )
        .unwrap()
        .catch(() => {
          toast.error("Error al cargar las categorías");
        })
        .finally(() => setLoadingCategorias(false));
    }
  }, [pasoActual, edicion, dispatch, token]);

  useEffect(() => {
    if (!numero_documento) return;

    if (numero_documento.length < 6 || numero_documento.length > 10) {
      setUsuarioExiste(false);
      return;
    }

    const timeout = setTimeout(() => {
      buscarUsuario(numero_documento);
    }, 600);

    return () => clearTimeout(timeout);
  }, [numero_documento]);

  const capitalizeFirstLetter = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const buscarUsuario = async (numero_documento) => {
    dispatch(
      obtenerUsuarioPorCedulaPublico({
        numero_documento,
        id_edicion: edicion.id_edicion,
        token,
      }),
    )
      .unwrap()
      .then((res) => {
        if (res.usuario) {
          form.setFieldsValue({
            ...res.usuario,
            primer_nombre: capitalizeFirstLetter(res.usuario.primer_nombre),
            segundo_nombre: capitalizeFirstLetter(res.usuario.segundo_nombre),
            primer_apellido: capitalizeFirstLetter(res.usuario.primer_apellido),
            segundo_apellido: capitalizeFirstLetter(
              res.usuario.segundo_apellido,
            ),
            fecha_nacimiento: res.usuario.fecha_nacimiento
              ? dayjs(res.usuario.fecha_nacimiento)
              : null,
            nivel_estudio_superior: capitalizeFirstLetter(
              res.usuario.nivel_estudio_superior,
            ),
            genero: res.usuario.genero === "M" ? "Masculino" : "Femenino",
          });

          setUsuarioExiste(true);
        } else {
          setUsuarioExiste(false);
          form.resetFields([
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "correo_electronico",
            "telefono",
            "direccion",
            "genero",
            "fecha_nacimiento",
            "nivel_estudio_superior",
            "codigo_institucional",
          ]);
        }
        if (
          res.usuario.roles.some((rol) => rol.nombre_rol === "administrador")
        ) {
          setInvalido(true);
          toast.error(
            "No es posible registrar la participación porque el usuario ingresado tiene asignado el rol de administrador en PAMCE.",
            { toastId: "invalido" },
          );
        } else {
          setInvalido(false);
        }
      })
      .catch((err) => {
        setUsuarioExiste(false);
      });
  };

  const validarTelefono = (rule, value) => {
    if (value && value.length !== 10) {
      return Promise.reject("El teléfono debe tener 10 dígitos.");
    }
    return Promise.resolve();
  };

  const validarRequisitosCategoriaCompletos = () => {
    if (!categoriaSeleccionada) return false;

    if (
      requisitos_categoria_edicion?.filter((req) => req.obligatorio).length ===
      0
    )
      return true;

    return requisitos_categoria_edicion
      ?.filter((req) => req.obligatorio)
      .every((req) => {
        const valor =
          valoresFormulario?.[
            `requisito_${req.id_requisito_edicion_categoria}`
          ];

        if (!valor) return false;

        if (req.tipo_requisito === "documento") {
          return archivos[req.id_requisito_edicion_categoria] instanceof File;
        }

        if (req.tipo_requisito === "texto") {
          return typeof valor === "string" && valor.trim().length > 0;
        }

        return false;
      });
  };

  useEffect(() => {
    const esValido = validarRequisitosCategoriaCompletos();
    setPuedeEnviar(esValido);
  }, [valoresFormulario, requisitos_categoria_edicion, categoriaSeleccionada]);

  if (tokenValido === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600">404</h1>
          <p className="text-lg text-gray-600 mt-2">
            La convocatoria no existe o ya no está disponible
          </p>
        </div>
      </div>
    );
  }

  if (tokenValido === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white px-10! py-8! rounded-xl shadow-md flex flex-col items-center gap-4!">
          <Spin size="large" />
          <p className="text-gray-600 font-inter text-sm">
            Validando acceso al formulario...
          </p>
        </div>
      </div>
    );
  }

  if (!edicion || tokenValido === null) {
    return <LoadingComponent mensaje="Cargando Formulario..." />;
  }

  if (formularioDisponible === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600">404</h1>
          <p className="text-lg text-gray-600 mt-2">
            Este formulario ya no está disponible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4 overflow-y-auto pr-4!"
      style={{
        maxHeight: "min(500px, calc(100vh - 270px))",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => guardarInformacionJurado(values)}
        requiredMark={false}
      >
        <Row gutter={[28, 16]}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Número de Documento <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="numero_documento"
              rules={[
                {
                  required: true,
                  message: "El número de documento es obligatorio",
                },
                { min: 6, message: "Debe tener mínimo 6 dígitos" },
                { max: 10, message: "Debe tener máximo 10 dígitos" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              ]}
            >
              <Input
                maxLength={10}
                inputMode="numeric"
                placeholder="Ingrese el número"
                addonBefore="C.C"
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "");
                  setNumeroDocumento(valor);
                  form.setFieldValue("numero_documento", valor);
                }}
              />
            </Form.Item>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Primer Nombre <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="primer_nombre"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className="-mt-50! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Primer Nombre"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Segundo Nombre
                </span>
              }
              name="segundo_nombre"
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Segundo Nombre"
              />
            </Form.Item>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Fecha de Nacimiento <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_nacimiento"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
              ]}
            >
              <DatePicker
                disabled={usuarioExiste}
                locale={esES}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Fecha de Nacimiento"
                className="rounded-l-none w-full bg-gray-200! font-inter"
                disabledDate={(current) =>
                  current && current.isAfter(dayjs().subtract(18, "year"))
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Primer Apellido <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="primer_apellido"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Primer Apellido"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Segundo Apellido
                </span>
              }
              name="segundo_apellido"
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Segundo Apellido"
              />
            </Form.Item>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Código Institucional
                </span>
              }
              name="codigo_institucional"
              rules={[
                { min: 6, message: "Debe tener mínimo 6 dígitos" },
                { max: 10, message: "Debe tener máximo 10 dígitos" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Código Institucional"
              />
            </Form.Item>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Nivel de Estudio Superior{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="nivel_estudio_superior"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
              ]}
            >
              <Select
                disabled={usuarioExiste}
                placeholder="Seleccione"
                className="custom-ant-select w-full font-inter -mt-2!"
                popupClassName="font-inter"
                options={[
                  { label: "Técnico", value: "técnico" },
                  { label: "Tecnólogo", value: "tecnólogo" },
                  { label: "Profesional", value: "profesional" },
                  {
                    label: "Especialización",
                    value: "especialización",
                  },
                  { label: "Maestría", value: "maestría" },
                  { label: "Doctorado", value: "doctorado" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Correo Electrónico <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="correo_electronico"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
                {
                  type: "email",
                  message: "Ingrese un correo electrónico válido",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                type="email"
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Correo Electrónico"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Teléfono <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="telefono"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
                !usuarioExiste && { validator: validarTelefono },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese el número de teléfono"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Dirección <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="direccion"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
                {
                  pattern:
                    /^[A-Za-z0-9\s#\-\.\°]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+$/,
                  message: "El formato debe ser: Dirección, Barrio, Ciudad",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className="rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese la dirección"
              />
            </Form.Item>

            <Form.Item
              className="mb-4!"
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Género <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="genero"
              rules={[
                {
                  required: true,
                  message: "Este campo es obligatorio",
                },
              ]}
            >
              <Select
                disabled={usuarioExiste}
                placeholder="Seleccione un género"
                className="custom-ant-select w-full font-inter -mt-2"
                popupClassName="font-inter"
                options={[
                  { label: "Masculino", value: "masculino" },
                  { label: "Femenino", value: "femenino" },
                  { label: "Otro", value: "Otro" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default PasoCeroRegistro;
