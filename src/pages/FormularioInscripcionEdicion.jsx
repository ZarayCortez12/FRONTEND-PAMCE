import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select, DatePicker, Button, Spin } from "antd";
import { IoMdArrowDropright } from "react-icons/io";
import dayjs from "dayjs";
import esES from "antd/es/date-picker/locale/es_ES";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import imagen_fondo from "../images/fondo_inicio.jpg";
import { Steps } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../images/logo_pamce.png";
import { ArrowRight, ArrowLeft, UploadCloud, FileText, X } from "lucide-react";
import {
  obtenerEdicionEnProcesoPublico,
  obtenerUsuarioPorCedulaPublico,
  listarRequisitosEdicionPublico,
  listarCategoriasPorEdicionPublico,
  listarRequisitosPorCategoriaEdicionPublico,
  crearParticipantePublico,
  obtenerEdicionEnProcesoFanPage,
  registrarParticipacionPublico,
} from "../features/public/public.slice";
import LoadingComponent from "@/components/LoadingComponent";

function FormularioInscripcionEdicion({ modo = "invitacion" }) {
  const { token, id_edicion } = useParams();

  const esPublica = modo === "publica";
  const identificadorEdicion = esPublica ? id_edicion : null;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const edicion = useSelector((state) => state.public.edicion_en_proceso);
  const usuario = useSelector((state) => state.public.usuario);
  const requisitos_edicion = useSelector(
    (state) => state.public.requisitos_edicion,
  );
  const requisitos_categoria_edicion = useSelector(
    (state) => state.public.requisitos_categoria_edicion,
  );
  const categorias = useSelector((state) => state.public.categorias);

  const valoresFormulario = Form.useWatch([], form);

  const [invalido, setInvalido] = useState(false);
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
  const [categoriaSeleccionadaNombre, setCategoriaSeleccionadaNombre] =
    useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingRequisitosCategoria, setLoadingRequisitosCategoria] =
    useState(false);
  const [puedeEnviar, setPuedeEnviar] = useState(false);
  const [datosParticipante, setDatosParticipante] = useState();
  const toggleRequisito = (id) => {
    setRequisitoAbierto((prev) => (prev === id ? null : id));
  };

  const validarArchivo = (file, config) => {
    if (!config) return true;

    const extensionesPermitidas = config.extensiones_permitidas
      ?.split(",")
      .map((ext) => ext.trim().toLowerCase());

    const extensionArchivo = file.name.split(".").pop().toLowerCase();

    if (
      extensionesPermitidas &&
      !extensionesPermitidas.includes(extensionArchivo)
    ) {
      toast.error(
        `Formato no permitido. Use: ${extensionesPermitidas
          .map((e) => e.toUpperCase())
          .join(", ")}`,
      );
      return false;
    }

    if (config.tamano_max_mb) {
      const maxBytes = config.tamano_max_mb * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error(
          `El archivo supera el tamaño máximo permitido (${config.tamano_max_mb} MB)`,
        );
        return false;
      }
    }

    return true;
  };

  const [cargandoEdicion, setCargandoEdicion] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const cargarEdicion = async () => {
      setCargandoEdicion(true);
      setTokenValido(null);
      setFormularioDisponible(null);

      try {
        if (esPublica) {
          await dispatch(obtenerEdicionEnProcesoFanPage()).unwrap();
        } else {
          await dispatch(obtenerEdicionEnProcesoPublico(token)).unwrap();
        }
      } catch (error) {
        console.error("Error al cargar la edición:", error);

        if (!cancelado) {
          setTokenValido(false);
        }
      } finally {
        if (!cancelado) {
          setCargandoEdicion(false);
        }
      }
    };

    cargarEdicion();

    return () => {
      cancelado = true;
    };
  }, [dispatch, esPublica, token, id_edicion]);

  useEffect(() => {
    document.title = "PAMCE | Registrar Participación";

    if (cargandoEdicion || !edicion) return;

    try {
      const ahora = new Date();

      const fechaActual = `${ahora.getFullYear()}-${String(
        ahora.getMonth() + 1,
      ).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

      const coincideEdicion = esPublica
        ? Number(id_edicion) === Number(edicion.id_edicion)
        : Number(jwtDecode(token)?.id_edicion) === Number(edicion.id_edicion);

      if (!coincideEdicion) {
        setTokenValido(false);
        return;
      }

      setTokenValido(true);

      const convocatoriaAbierta =
        edicion.fecha_inicio_convocatoria <= fechaActual &&
        edicion.fecha_fin_convocatoria >= fechaActual;

      if (esPublica) {
        setFormularioDisponible(convocatoriaAbierta);
      } else {
        const decoded = jwtDecode(token);

        setFormularioDisponible(
          Boolean(decoded.exp && decoded.exp > Date.now() / 1000) &&
            convocatoriaAbierta,
        );
      }
    } catch (error) {
      console.error("Error al validar el acceso:", error);
      setTokenValido(false);
    }
  }, [token, id_edicion, edicion, esPublica, cargandoEdicion]);

  useEffect(() => {
    if (!edicion?.id_edicion) return;

    const cargarDatos = async () => {
      if (pasoActual === 1) {
        setLoadingRequisitos(true);

        try {
          await dispatch(
            listarRequisitosEdicionPublico({
              id_edicion: edicion.id_edicion,
              ...(esPublica ? {} : { token }),
            }),
          ).unwrap();
        } catch (err) {
          console.error("Error al cargar requisitos:", err);
          toast.error("Error al cargar los requisitos de la edición");
        } finally {
          setLoadingRequisitos(false);
        }
      }

      if (pasoActual === 2) {
        setLoadingCategorias(true);

        try {
          await dispatch(
            listarCategoriasPorEdicionPublico({
              id_edicion: edicion.id_edicion,
              ...(esPublica ? {} : { token }),
            }),
          ).unwrap();
        } catch (err) {
          console.error("Error al cargar categorías:", err);
          toast.error("Error al cargar las categorías");
        } finally {
          setLoadingCategorias(false);
        }
      }
    };

    cargarDatos();
  }, [pasoActual, edicion?.id_edicion, dispatch, token, esPublica]);

  useEffect(() => {
    if (!numero_documento) return;

    if (numero_documento.length < 6 || numero_documento.length > 10) {
      setUsuarioExiste(false);
      setInvalido(true);
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
        }
        setInvalido(false);
      })
      .catch((err) => {
        if (err.usuario) {
          form.setFieldsValue({
            ...err.usuario,
            primer_nombre: capitalizeFirstLetter(err.usuario.primer_nombre),
            segundo_nombre: capitalizeFirstLetter(err.usuario.segundo_nombre),
            primer_apellido: capitalizeFirstLetter(err.usuario.primer_apellido),
            segundo_apellido: capitalizeFirstLetter(
              err.usuario.segundo_apellido,
            ),
            fecha_nacimiento: err.usuario.fecha_nacimiento
              ? dayjs(err.usuario.fecha_nacimiento)
              : null,
            nivel_estudio_superior: capitalizeFirstLetter(
              err.usuario.nivel_estudio_superior,
            ),
            genero: err.usuario.genero === "M" ? "Masculino" : "Femenino",
          });
          setUsuarioExiste(true);
        }

        toast.error(err.message, {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          form.resetFields([
            "numero_documento",
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
          setUsuarioExiste(false);
        }, 4000);

        setInvalido(true);
      });
  };

  const validarTelefono = (rule, value) => {
    if (value && value.length !== 10) {
      return Promise.reject("El teléfono debe tener 10 dígitos.");
    }
    return Promise.resolve();
  };

  const onSeleccionarCategoria = (id_edicion_categoria) => {
    const limpiarCampos = {};

    requisitos_categoria_edicion?.forEach((req) => {
      limpiarCampos[
        `requisito_categoria_${req.id_requisito_edicion_categoria}`
      ] = null;
    });

    if (Object.keys(limpiarCampos).length > 0) {
      form.setFieldsValue(limpiarCampos);

      setArchivos((prev) => {
        const nuevosArchivos = { ...prev };

        requisitos_categoria_edicion?.forEach((req) => {
          delete nuevosArchivos[
            `requisito_categoria_${req.id_requisito_edicion_categoria}`
          ];
        });

        return nuevosArchivos;
      });
    }

    setCategoriaSeleccionada(id_edicion_categoria);
    setRequisitoAbierto(null);

    if (!id_edicion_categoria) return;

    setLoadingRequisitosCategoria(true);

    dispatch(
      listarRequisitosPorCategoriaEdicionPublico({
        id_edicion_categoria,
        id_edicion: edicion.id_edicion,
        ...(esPublica ? {} : { token }),
      }),
    )
      .unwrap()
      .catch(() => {
        toast.error("Error al cargar los requisitos de la categoría");
      })
      .finally(() => setLoadingRequisitosCategoria(false));
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
            `requisito_categoria_${req.id_requisito_edicion_categoria}`
          ];

        if (!valor) return false;

        if (req.tipo_requisito === "documento") {
          return (
            archivos[
              `requisito_categoria_${req.id_requisito_edicion_categoria}`
            ] instanceof File
          );
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

  if (cargandoEdicion || tokenValido === null) {
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

  const validarRequisitosObligatoriosEdicion = async () => {
    const camposObligatorios = requisitos_edicion
      ?.filter((req) => req.obligatorio)
      .map((req) => `requisito_edicion_${req.id_requisito_edicion}`);

    if (camposObligatorios.length === 0) return true;

    try {
      await form.validateFields(camposObligatorios, {
        scrollToFirstError: true,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const siguientePaso = async () => {
    if (pasoActual === 0) {
      try {
        await form.validateFields({ scrollToFirstError: true });
        toast.success("Datos personales guardados correctamente", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          setPasoActual(1);
        }, 2100);
        setDatosParticipante(valoresFormulario);
      } catch (error) {
        toast.error("Debe completar todos los datos obligatorios");
      }
      return;
    }
    if (pasoActual === 1) {
      const esValido = await validarRequisitosObligatoriosEdicion();

      if (!esValido) {
        toast.error(
          "Debe completar todos los requisitos obligatorios antes de continuar",
          {
            position: "top-right",
            autoClose: 3000,
          },
        );
        return;
      }

      toast.success("Requisitos de la edición completos", {
        autoClose: 1500,
      });

      setTimeout(() => {
        setPasoActual(2);
      }, 2100);
      return;
    }
  };

  const enviarPostulacion = async () => {
    try {
      setLoading(true);

      const valores = form.getFieldsValue(true);

      const formData = new FormData();

      const participantePayload = {
        id_edicion: edicion.id_edicion,
        numero_documento: datosParticipante.numero_documento,
        primer_nombre: datosParticipante.primer_nombre,
        segundo_nombre: datosParticipante.segundo_nombre || null,
        primer_apellido: datosParticipante.primer_apellido,
        segundo_apellido: datosParticipante.segundo_apellido || null,
        fecha_nacimiento: datosParticipante.fecha_nacimiento
          ? datosParticipante.fecha_nacimiento.format("YYYY-MM-DD")
          : null,
        correo_electronico: datosParticipante.correo_electronico,
        telefono: datosParticipante.telefono,
        direccion: datosParticipante.direccion,
        genero: datosParticipante.genero,
        nivel_estudio_superior: datosParticipante.nivel_estudio_superior,
        codigo_institucional: datosParticipante.codigo_institucional,
      };

      const res = await dispatch(
        crearParticipantePublico({
          data: participantePayload,
          ...(esPublica ? {} : { token }),
        }),
      ).unwrap();

      formData.append("id_usuario", res.usuario.id_usuario);
      formData.append("numero_documento", res.usuario.numero_documento);
      formData.append("id_edicion", edicion.id_edicion);
      formData.append("nombre_edicion", edicion.nombre_edicion.toUpperCase());
      formData.append(
        "nombre_categoria",
        categorias
          .find(
            (item) =>
              item.edicionesCategoria[0]?.id_edicion_categoria ===
              categoriaSeleccionada,
          )
          ?.nombre_categoria.toUpperCase(),
      );
      formData.append("id_edicion_categoria", categoriaSeleccionada);

      requisitos_edicion?.forEach((req) => {
        const valor = valores[`requisito_edicion_${req.id_requisito_edicion}`];
        if (!valor) return;

        if (req.tipo_requisito === "texto") {
          formData.append(
            "requisitos_edicion_texto[]",
            JSON.stringify({
              id_requisito_edicion: req.id_requisito_edicion,
              valor_texto: valor,
            }),
          );
        } else {
          formData.append(
            `requisitos_edicion_documentos[${req.id_requisito_edicion}]`,
            archivos[`requisito_edicion_${req.id_requisito_edicion}`],
          );
        }
      });

      requisitos_categoria_edicion?.forEach((req) => {
        const valor =
          valores[`requisito_categoria_${req.id_requisito_edicion_categoria}`];
        if (!valor) return;

        if (req.tipo_requisito === "texto") {
          formData.append(
            "requisitos_categoria_texto[]",
            JSON.stringify({
              id_requisito_edicion_categoria:
                req.id_requisito_edicion_categoria,
              valor_texto: valor,
            }),
          );
        } else {
          formData.append(
            `requisitos_categoria_documentos[${req.id_requisito_edicion_categoria}]`,
            archivos[
              `requisito_categoria_${req.id_requisito_edicion_categoria}`
            ],
          );
        }
      });

      // Se espera la respuesta para que el botón siga deshabilitado
      // (antes se podía enviar la postulación varias veces)
      const respuesta = await dispatch(
        registrarParticipacionPublico({
          formData,
          ...(esPublica ? {} : { token }),
        }),
      ).unwrap();

      toast.success(respuesta.message, {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/postulacion/confirmacion", {
          replace: true,
          state: {
            nombreEdicion: edicion.nombre_edicion,
          },
        });
      }, 2100);
    } catch (error) {
      toast.error(error?.message || "Error al enviar la postulación");
      // Solo se reactiva el botón si hubo error; si se envió, sigue
      // deshabilitado hasta la redirección
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${imagen_fondo})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl px-12! py-8!">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-montserrat text-2xl text-red-600 font-bold">
              Formulario de Postulación
            </h1>
            <p className="text-gray-500 font-inter">
              {capitalizeFirstLetter(edicion?.nombre_edicion)}
            </p>
          </div>

          <img src={logo} alt="Logo PAMCE" className="h-18 object-contain" />
        </div>

        <hr className="my-4! border-red-600" />

        <Steps
          current={pasoActual}
          className="mb-4! font-poppins"
          items={[
            { title: "Datos Personales" },
            { title: "Requisitos Edición" },
            { title: "Requisitos Categoría" },
          ]}
        />
        <Form
          form={form}
          layout="vertical"
          requiredMark={pasoActual === 0 ? false : undefined}
        >
          {pasoActual === 0 && (
            <>
              <div
                className="space-y-4 overflow-y-auto pr-4!"
                style={{
                  maxHeight: "min(500px, calc(100vh - 270px))",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
              >
                <div>
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
                            Número de Documento{" "}
                            <span style={{ color: "red" }}>*</span>
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
                            Primer Nombre{" "}
                            <span style={{ color: "red" }}>*</span>
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
                            Fecha de Nacimiento{" "}
                            <span style={{ color: "red" }}>*</span>
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
                            current &&
                            current.isAfter(dayjs().subtract(18, "year"))
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
                            Primer Apellido{" "}
                            <span style={{ color: "red" }}>*</span>
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
                            Correo Electrónico{" "}
                            <span style={{ color: "red" }}>*</span>
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
                            message:
                              "El formato debe ser: Dirección, Barrio, Ciudad",
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
                </div>
              </div>
            </>
          )}

          {pasoActual === 1 && (
            <div
              className="space-y-4 overflow-y-auto pr-2!"
              style={{
                maxHeight: "min(500px, calc(100vh - 270px))",
              }}
            >
              <div
                className={`transition-all duration-1000 ease-in-out ${
                  loadingRequisitos
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {loadingRequisitos ? (
                  <LoadingComponent mensaje="Cargando requisitos de la edición..." />
                ) : requisitos_edicion?.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No hay requisitos configurados para esta edición
                  </p>
                ) : (
                  requisitos_edicion?.map((req) => {
                    const abierto =
                      requisitoAbierto === req.id_requisito_edicion;

                    return (
                      <div
                        key={req.id_requisito_edicion}
                        className="border border-gray-200 rounded-xl shadow-sm mb-3!"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleRequisito(req.id_requisito_edicion)
                          }
                          className="w-full flex items-center justify-between px-4! py-3! gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-inter text-sm font-semibold text-justify leading-snug flex-1">
                            {capitalizeFirstLetter(req.Requisito.descripcion)}
                            {req.obligatorio && (
                              <span className="text-red-600 ml-1">*</span>
                            )}
                          </span>

                          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                            <IoMdArrowDropright
                              className={`text-2xl transition-transform duration-300 ${
                                abierto
                                  ? "rotate-90 text-red-600"
                                  : "text-gray-500"
                              }`}
                            />
                          </span>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            abierto
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-3!">
                            <Form.Item
                              requiredMark={false}
                              name={`requisito_edicion_${req.id_requisito_edicion}`}
                              rules={[
                                {
                                  required: req.obligatorio,
                                  message: "Este requisito es obligatorio",
                                },
                              ]}
                            >
                              {req.tipo_requisito === "documento" && (
                                <div className="space-y-2!">
                                  <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4! text-center cursor-pointer
                                           hover:border-red-500 transition-colors bg-gray-50"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const file = e.dataTransfer.files[0];
                                      if (!file) return;

                                      const esValido = validarArchivo(
                                        file,
                                        req.RequisitosConfig,
                                      );

                                      if (!esValido) return;

                                      setArchivos((prev) => ({
                                        ...prev,
                                        [`requisito_edicion_${req.id_requisito_edicion}`]:
                                          file,
                                      }));

                                      form.setFieldValue(
                                        `requisito_edicion_${req.id_requisito_edicion}`,
                                        file,
                                      );
                                    }}
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `file-edicion-${req.id_requisito_edicion}`,
                                        )
                                        .click()
                                    }
                                  >
                                    <input
                                      id={`file-edicion-${req.id_requisito_edicion}`}
                                      type="file"
                                      hidden
                                      accept={
                                        req.RequisitosConfig
                                          ?.extensiones_permitidas
                                          ? req.RequisitosConfig.extensiones_permitidas
                                              .split(",")
                                              .map((ext) => `.${ext.trim()}`)
                                              .join(",")
                                          : undefined
                                      }
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const esValido = validarArchivo(
                                          file,
                                          req.RequisitosConfig,
                                        );

                                        if (!esValido) {
                                          e.target.value = null;
                                          return;
                                        }

                                        setArchivos((prev) => ({
                                          ...prev,
                                          [`requisito_edicion_${req.id_requisito_edicion}`]:
                                            file,
                                        }));

                                        form.setFieldValue(
                                          `requisito_edicion_${req.id_requisito_edicion}`,
                                          file,
                                        );
                                      }}
                                    />

                                    {!archivos[
                                      `requisito_edicion_${req.id_requisito_edicion}`
                                    ] ? (
                                      <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <UploadCloud
                                          size={36}
                                          className="text-red-500"
                                        />
                                        <p className="text-xs font-inter">
                                          Arrastra tu archivo aquí o{" "}
                                          <span className="text-red-600 font-semibold">
                                            haz clic para seleccionar
                                          </span>
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between bg-white rounded-lg px-3! py-2! shadow-sm">
                                        <div className="flex items-center gap-2">
                                          <FileText
                                            className="text-red-600"
                                            size={18}
                                          />
                                          <span className="text-xs font-inter truncate max-w-[350px]">
                                            {
                                              archivos[
                                                `requisito_edicion_${req.id_requisito_edicion}`
                                              ].name
                                            }
                                          </span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setArchivos((prev) => {
                                              const copia = { ...prev };
                                              delete copia[
                                                `requisito_edicion_${req.id_requisito_edicion}`
                                              ];
                                              return copia;
                                            });
                                            form.setFieldValue(
                                              `requisito_edicion_${req.id_requisito_edicion}`,
                                              null,
                                            );
                                          }}
                                          className="text-gray-400 hover:text-red-600"
                                        >
                                          <X size={18} />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <p className="text-xs text-gray-500">
                                    Formatos permitidos:{" "}
                                    <strong>
                                      {req.RequisitosConfig?.extensiones_permitidas
                                        ?.split(",")
                                        .map((ext) => ext.trim().toUpperCase())
                                        .join(", ")}
                                    </strong>{" "}
                                    · Tamaño máximo:{" "}
                                    <strong>
                                      {req.RequisitosConfig?.tamano_max_mb} MB
                                    </strong>
                                  </p>
                                </div>
                              )}

                              {req.tipo_requisito === "texto" && (
                                <Form.Item required={false}>
                                  <div className="space-y-2!">
                                    <Form.Item
                                      noStyle
                                      name={`requisito_edicion_${req.id_requisito_edicion}`}
                                      rules={[
                                        {
                                          required: req.obligatorio,
                                          message:
                                            "Este requisito es obligatorio",
                                        },
                                      ]}
                                    >
                                      <Input.TextArea
                                        rows={4}
                                        maxLength={
                                          req.RequisitosConfig?.max_caracteres
                                        }
                                        showCount
                                        placeholder="Ingrese su respuesta"
                                        style={{
                                          resize: "none",
                                        }}
                                      />
                                    </Form.Item>

                                    {req.RequisitosConfig?.max_caracteres && (
                                      <p className="text-xs text-gray-500">
                                        Máximo{" "}
                                        <strong>
                                          {req.RequisitosConfig.max_caracteres}
                                        </strong>{" "}
                                        caracteres
                                      </p>
                                    )}
                                  </div>
                                </Form.Item>
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {pasoActual === 2 && (
            <div
              className="space-y-4 overflow-y-auto pr-2!"
              style={{ maxHeight: "min(500px, calc(100vh - 270px))" }}
            >
              <Form.Item
                label={
                  <span className="font-inter font-semibold text-sm">
                    Seleccione la categoría de la postulación
                    <span className="text-red-600">*</span>
                  </span>
                }
                requiredMark={false}
              >
                <Select
                  placeholder={
                    loadingCategorias
                      ? "Cargando categorías..."
                      : "Seleccione una categoría"
                  }
                  loading={loadingCategorias}
                  onChange={onSeleccionarCategoria}
                  value={categoriaSeleccionada}
                  allowClear
                >
                  {categorias?.map((cat) => (
                    <Select.Option
                      key={cat.edicionesCategoria[0]?.id_edicion_categoria}
                      value={cat.edicionesCategoria[0]?.id_edicion_categoria}
                    >
                      {capitalizeFirstLetter(cat.nombre_categoria)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {!categoriaSeleccionada ? (
                <p className="text-center text-gray-500 text-sm">
                  Seleccione una categoría para ver los requisitos
                </p>
              ) : loadingRequisitosCategoria ? (
                <p className="text-center text-gray-500">
                  Cargando requisitos de la categoría...
                </p>
              ) : requisitos_categoria_edicion?.length === 0 ? (
                <p className="text-center text-gray-500">
                  Esta categoría no tiene requisitos configurados
                </p>
              ) : (
                requisitos_categoria_edicion?.map((req) => {
                  const abierto =
                    requisitoAbierto === req.id_requisito_edicion_categoria;

                  return (
                    <div
                      key={req.id_requisito_edicion_categoria}
                      className="border border-gray-200 rounded-xl shadow-sm mb-3!"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleRequisito(req.id_requisito_edicion_categoria)
                        }
                        className="w-full flex items-center justify-between px-4! py-3! gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-inter text-sm font-semibold text-justify leading-snug flex-1">
                          {capitalizeFirstLetter(req.Requisito.descripcion)}
                          {req.obligatorio && (
                            <span className="text-red-600 ml-1">*</span>
                          )}
                        </span>

                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                          <IoMdArrowDropright
                            className={`text-2xl transition-transform duration-300 ${
                              abierto
                                ? "rotate-90 text-red-600"
                                : "text-gray-500"
                            }`}
                          />
                        </span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          abierto
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-3!">
                          <Form.Item
                            requiredMark={false}
                            name={`requisito_categoria_${req.id_requisito_edicion_categoria}`}
                            rules={[
                              {
                                required: req.obligatorio,
                                message: "Este requisito es obligatorio",
                              },
                            ]}
                          >
                            {req.tipo_requisito === "documento" && (
                              <div className="space-y-2!">
                                <div
                                  className="border-2 border-dashed border-gray-300 rounded-xl p-4! text-center cursor-pointer
                                           hover:border-red-500 transition-colors bg-gray-50"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (!file) return;

                                    const esValido = validarArchivo(
                                      file,
                                      req.RequisitosCategoriaConfig,
                                    );

                                    if (!esValido) return;

                                    setArchivos((prev) => ({
                                      ...prev,
                                      [`requisito_categoria_${req.id_requisito_edicion_categoria}`]:
                                        file,
                                    }));

                                    form.setFieldValue(
                                      `requisito_categoria_${req.id_requisito_edicion_categoria}`,
                                      file,
                                    );
                                  }}
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `file-categoria-${req.id_requisito_edicion_categoria}`,
                                      )
                                      .click()
                                  }
                                >
                                  <input
                                    id={`file-categoria-${req.id_requisito_edicion_categoria}`}
                                    type="file"
                                    hidden
                                    accept={
                                      req.RequisitosCategoriaConfig
                                        ?.extensiones_permitidas
                                        ? req.RequisitosCategoriaConfig.extensiones_permitidas
                                            .split(",")
                                            .map((ext) => `.${ext.trim()}`)
                                            .join(",")
                                        : undefined
                                    }
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;

                                      const esValido = validarArchivo(
                                        file,
                                        req.RequisitosCategoriaConfig,
                                      );

                                      if (!esValido) {
                                        e.target.value = null;
                                        return;
                                      }

                                      setArchivos((prev) => ({
                                        ...prev,
                                        [`requisito_categoria_${req.id_requisito_edicion_categoria}`]:
                                          file,
                                      }));

                                      form.setFieldValue(
                                        `requisito_categoria_${req.id_requisito_edicion_categoria}`,
                                        file,
                                      );
                                    }}
                                  />

                                  {!archivos[
                                    `requisito_categoria_${req.id_requisito_edicion_categoria}`
                                  ] ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                      <UploadCloud
                                        size={36}
                                        className="text-red-500"
                                      />
                                      <p className="text-xs font-inter">
                                        Arrastra tu archivo aquí o{" "}
                                        <span className="text-red-600 font-semibold">
                                          haz clic para seleccionar
                                        </span>
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between bg-white rounded-lg px-3! py-2! shadow-sm">
                                      <div className="flex items-center gap-2">
                                        <FileText
                                          className="text-red-600"
                                          size={18}
                                        />
                                        <span className="text-xs font-inter truncate max-w-[350px]">
                                          {
                                            archivos[
                                              `requisito_categoria_${req.id_requisito_edicion_categoria}`
                                            ].name
                                          }
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setArchivos((prev) => {
                                            const copia = { ...prev };
                                            delete copia[
                                              `requisito_categoria_${req.id_requisito_edicion_categoria}`
                                            ];
                                            return copia;
                                          });

                                          form.setFieldValue(
                                            `requisito_categoria_${req.id_requisito_edicion_categoria}`,
                                            null,
                                          );
                                        }}
                                        className="text-gray-400 hover:text-red-600"
                                      >
                                        <X size={18} />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <p className="text-xs text-gray-500">
                                  Formatos permitidos:{" "}
                                  <strong>
                                    {req.RequisitosCategoriaConfig?.extensiones_permitidas
                                      ?.split(",")
                                      .map((ext) => ext.trim().toUpperCase())
                                      .join(", ")}
                                  </strong>{" "}
                                  · Tamaño máximo:{" "}
                                  <strong>
                                    {
                                      req.RequisitosCategoriaConfig
                                        ?.tamano_max_mb
                                    }{" "}
                                    MB
                                  </strong>
                                </p>
                              </div>
                            )}

                            {req.tipo_requisito === "texto" && (
                              <Form.Item required={false}>
                                <div className="space-y-2!">
                                  <Form.Item
                                    noStyle
                                    name={`requisito_categoria_${req.id_requisito_edicion_categoria}`}
                                    rules={[
                                      {
                                        required: req.obligatorio,
                                        message:
                                          "Este requisito es obligatorio",
                                      },
                                    ]}
                                  >
                                    <Input.TextArea
                                      rows={4}
                                      maxLength={
                                        req.RequisitosCategoriaConfig
                                          ?.max_caracteres
                                      }
                                      showCount
                                      placeholder="Ingrese su respuesta"
                                      style={{
                                        resize: "none",
                                      }}
                                    />
                                  </Form.Item>

                                  {req.RequisitosCategoriaConfig
                                    ?.max_caracteres && (
                                    <p className="text-xs text-gray-500">
                                      Máximo{" "}
                                      <strong>
                                        {
                                          req.RequisitosCategoriaConfig
                                            .max_caracteres
                                        }
                                      </strong>{" "}
                                      caracteres
                                    </p>
                                  )}
                                </div>
                              </Form.Item>
                            )}
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          <div className="flex justify-between mt-2!">
            {pasoActual > 0 && (
              <Button
                className="gap-1! flex items-center group"
                onClick={() => setPasoActual(pasoActual - 1)}
              >
                <ArrowLeft
                  size={20}
                  className="text-black transition-colors duration-200 group-hover:text-blue-600"
                />
                <span className="font-poppins group-hover:text-blue-600 transition-colors">
                  Anterior
                </span>
              </Button>
            )}

            {pasoActual < 2 ? (
              <Button
                type="primary"
                onClick={siguientePaso}
                className="bg-red-600 gap-1!"
                disabled={invalido}
              >
                <span className="font-poppins">Siguiente</span>{" "}
                <ArrowRight className="text-white" size={20} />
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="primary"
                loading={loading}
                disabled={!puedeEnviar}
                onClick={enviarPostulacion}
                className={`${
                  puedeEnviar
                    ? "bg-red-600! hover:bg-red-700 font-poppins"
                    : "bg-gray-300 cursor-not-allowed font-poppins"
                }`}
              >
                Enviar Postulación
              </Button>
            )}
          </div>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default FormularioInscripcionEdicion;
