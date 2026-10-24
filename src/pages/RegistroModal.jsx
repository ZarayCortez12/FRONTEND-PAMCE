import { useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
} from "antd";
import { IoMdArrowDropright, IoIosSave } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/es"; // solo registra el idioma; no cambia el idioma global
import esES from "antd/es/date-picker/locale/es_ES";
import { crearUsuarioPublico } from "../features/public/public.slice";

const TEMA_REGISTRO = {
  token: {
    colorPrimary: "#e10318",
    fontFamily: "Inter, sans-serif",
    borderRadius: 10,
    borderRadiusLG: 20,
    controlHeight: 34,
    colorBgContainer: "#f3f4f6",
    colorBorder: "#e5e7eb",
    colorTextPlaceholder: "#9ca3af",
  },
  components: {
    Input: {
      activeBg: "#f3f4f6",
      hoverBg: "#f3f4f6",
      activeShadow: "0 0 0 3px rgba(225, 3, 24, 0.12)",
    },
    DatePicker: {
      activeBg: "#f3f4f6",
      hoverBg: "#f3f4f6",
      activeShadow: "0 0 0 3px rgba(225, 3, 24, 0.12)",
    },
    Select: {
      optionSelectedBg: "#fde8ea",
      optionActiveBg: "#f3f4f6",
    },
  },
};

const ESTILOS_MODAL = {
  content: { padding: 0, overflow: "hidden" },
  header: {
    padding: "10px 28px 10px",
    margin: 0,
    borderBottom: "1px solid #f1f2f4",
  },
  body: {
    padding: "22px 28px 8px",
    maxHeight: "calc(100vh - 250px)",
    overflowY: "auto",
  },
  footer: {
    padding: "14px 28px 18px",
    margin: 0,
    borderTop: "1px solid #f1f2f4",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const soloNumeros = (valor) => (valor ?? "").replace(/\D/g, "");

const textoError = (err, porDefecto) =>
  err?.message || (typeof err === "string" ? err : porDefecto);

const OBLIGATORIO = { required: true, message: "Este campo es obligatorio" };

const validarTelefono = (_, value) => {
  if (value && value.length !== 10) {
    return Promise.reject("El teléfono debe tener 10 dígitos.");
  }
  return Promise.resolve();
};

// Campo con etiqueta uniforme (mismo estilo y misma separación en todos)
const Campo = ({ label, requerido, children, ...props }) => (
  <Form.Item
    style={{ marginBottom: 12 }}
    label={
      <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: "13px" }}>
        {label}
        {requerido && <span style={{ color: "red" }}> *</span>}
      </span>
    }
    {...props}
  >
    {children}
  </Form.Item>
);

const Seccion = ({ titulo, children }) => (
  <div style={{ marginBottom: 8 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "2px 0 16px",
      }}
    >
      <span
        style={{
          width: 4,
          height: 16,
          borderRadius: 4,
          background: "#e10318",
        }}
      />
      <span
        style={{
          fontFamily: "Montserrat",
          fontWeight: 700,
          fontSize: 14,
          color: "#1f2937",
        }}
      >
        {titulo}
      </span>
      <span style={{ flex: 1, height: 1, background: "#eef0f3" }} />
    </div>
    {children}
  </div>
);

export default function RegistroModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cerrar = () => {
    if (loading) return;
    onClose?.();
  };

  const irAIniciarSesion = () => {
    onClose?.();
    navigate("/inicio_sesion");
  };

  const guardarRegistro = (values) => {
    const limpio = (v) => v?.trim() || null;

    const payload = {
      numero_documento: values.numero_documento,
      primer_nombre: values.primer_nombre.trim(),
      segundo_nombre: limpio(values.segundo_nombre),
      primer_apellido: values.primer_apellido.trim(),
      segundo_apellido: limpio(values.segundo_apellido),
      fecha_nacimiento: values.fecha_nacimiento.format("YYYY-MM-DD"),
      genero: values.genero,
      codigo_institucional: limpio(values.codigo_institucional),
      correo_electronico: values.correo_electronico.trim().toLowerCase(),
      telefono: values.telefono,
      direccion: values.direccion.trim(),
      nivel_estudio_superior: values.nivel_estudio_superior,
    };

    setLoading(true);

    dispatch(crearUsuarioPublico(payload))
      .unwrap()
      .then((res) => {
        toast.success(textoError(res, "Registro completado correctamente"), {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess?.();
        form.resetFields();
        onClose?.();
      })
      .catch((err) => {
        toast.error(textoError(err, "No fue posible completar el registro"), {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ConfigProvider theme={TEMA_REGISTRO}>
      <Modal
        open={open}
        onCancel={cerrar}
        destroyOnClose
        centered
        width={700}
        maskClosable={false}
        keyboard={!loading}
        styles={ESTILOS_MODAL}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoMdArrowDropright
              size={34}
              color="#e10318"
              style={{
                marginLeft: -8,
                flexShrink: 0,
                filter: "drop-shadow(0px 3px 8px rgba(0,0,0,0.24))",
              }}
            />
            <div style={{ marginLeft: -2 }}>
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1f2937",
                }}
              >
                Crear cuenta en PAMCE
              </div>
            </div>
          </div>
        }
        footer={
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span
              style={{ fontFamily: "Inter", fontSize: 12, color: "#6b7280" }}
            >
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={irAIniciarSesion}
                style={{
                  color: "#e10318",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Iniciar sesión
              </button>
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={cerrar}
                disabled={loading}
                style={{
                  fontFamily: "Poppins",
                  borderRadius: "12px",
                  fontWeight: 600,
                  background: "#fff",
                  borderColor: "#d1d5db",
                }}
              >
                Cancelar
              </Button>

              <Button
                type="primary"
                loading={loading}
                icon={!loading && <IoIosSave style={{ marginRight: 5 }} />}
                onClick={() => form.submit()}
                style={{
                  fontFamily: "Poppins",
                  borderRadius: "12px",
                  backgroundColor: "#e10318",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Guardando..." : "Registrarme"}
              </Button>
            </div>
          </div>
        }
      >
        <Form
          className="formulario-registro"
          layout="vertical"
          form={form}
          onFinish={guardarRegistro}
          requiredMark={false}
          scrollToFirstError
        >
          {/* Datos personales */}
          <Seccion titulo="Datos personales">
            <Row gutter={20}>
              <Col xs={24} md={8}>
                <Campo
                  label="Número de Documento"
                  requerido
                  name="numero_documento"
                  normalize={soloNumeros}
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
                    style={{ fontSize: "13px" }}
                    prefix={
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 600,
                          fontSize: 12,
                          color: "#e10318",
                          paddingRight: 10,
                          marginRight: 2,
                          borderRight: "1px solid #d1d5db",
                        }}
                      >
                        C.C
                      </span>
                    }
                  />
                </Campo>
              </Col>

              <Col xs={24} md={8}>
                <Campo
                  label="Fecha de Nacimiento"
                  requerido
                  name="fecha_nacimiento"
                  rules={[OBLIGATORIO]}
                >
                  <DatePicker
                    className="fecha-nacimiento-datepicker w-full"
                    locale={esES}
                    format="DD [de] MMMM [del] YYYY"
                    placeholder="Fecha de Nacimiento"
                    defaultPickerValue={dayjs().subtract(18, "year")}
                    disabledDate={(current) =>
                      current && current.isAfter(dayjs().subtract(18, "year"))
                    }
                  />
                </Campo>
              </Col>

              <Col xs={24} md={8}>
                <Campo
                  label="Género"
                  requerido
                  name="genero"
                  rules={[OBLIGATORIO]}
                >
                  <Select
                    className="fecha-nacimiento-datepicker"
                    placeholder="Seleccione"
                    popupClassName="font-inter"
                    style={{ fontSize: "13px" }}
                    options={[
                      { label: "Masculino", value: "masculino" },
                      { label: "Femenino", value: "femenino" },
                      { label: "Otro", value: "otro" },
                    ]}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={12}>
                <Campo
                  label="Primer Nombre"
                  requerido
                  name="primer_nombre"
                  rules={[{ ...OBLIGATORIO, whitespace: true }]}
                >
                  <Input
                    placeholder="Ingrese Primer Nombre"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={12}>
                <Campo label="Segundo Nombre" name="segundo_nombre">
                  <Input
                    placeholder="Ingrese Segundo Nombre"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={12}>
                <Campo
                  label="Primer Apellido"
                  requerido
                  name="primer_apellido"
                  rules={[{ ...OBLIGATORIO, whitespace: true }]}
                >
                  <Input
                    placeholder="Ingrese Primer Apellido"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={12}>
                <Campo label="Segundo Apellido" name="segundo_apellido">
                  <Input
                    placeholder="Ingrese Segundo Apellido"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>
            </Row>
          </Seccion>

          {/* Contacto */}
          <Seccion titulo="Contacto y ubicación">
            <Row gutter={20}>
              <Col xs={24} md={8}>
                <Campo
                  label="Correo Electrónico"
                  requerido
                  name="correo_electronico"
                  rules={[
                    OBLIGATORIO,
                    {
                      type: "email",
                      message: "Ingrese un correo electrónico válido",
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Ingrese Correo Electrónico"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={6}>
                <Campo
                  label="Teléfono"
                  requerido
                  name="telefono"
                  normalize={soloNumeros}
                  rules={[OBLIGATORIO, { validator: validarTelefono }]}
                >
                  <Input
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Ingrese el número de teléfono"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={10}>
                <Campo
                  label="Dirección"
                  requerido
                  name="direccion"
                  extra={
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>
                      Formato: Dirección, Barrio, Ciudad
                    </span>
                  }
                  rules={[
                    OBLIGATORIO,
                    {
                      pattern:
                        /^[A-Za-z0-9\s#\-\.\°]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+$/,
                      message: "El formato debe ser: Dirección, Barrio, Ciudad",
                    },
                  ]}
                >
                  <Input
                    placeholder="Ej: Calle 10 #5-20, Centro, Cúcuta"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>
            </Row>
          </Seccion>

          {/* Información académica */}
          <Seccion titulo="Información académica">
            <Row gutter={20}>
              <Col xs={24} md={12}>
                <Campo
                  label="Código Institucional"
                  name="codigo_institucional"
                  normalize={soloNumeros}
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
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Ingrese Código Institucional"
                    style={{ fontSize: "13px" }}
                  />
                </Campo>
              </Col>

              <Col xs={24} md={12}>
                <Campo
                  label="Nivel de Estudio Superior"
                  requerido
                  name="nivel_estudio_superior"
                  rules={[OBLIGATORIO]}
                >
                  <Select
                    className="fecha-nacimiento-datepicker"
                    placeholder="Seleccione"
                    popupClassName="font-inter"
                    options={[
                      { label: "Bachiller", value: "bachiller" },
                      { label: "Técnico", value: "tecnico" },
                      { label: "Tecnólogo", value: "tecnologo" },
                      { label: "Profesional", value: "profesional" },
                      { label: "Especialización", value: "especializacion" },
                      { label: "Maestría", value: "maestria" },
                      { label: "Doctorado", value: "doctorado" },
                    ]}
                  />
                </Campo>
              </Col>
            </Row>
          </Seccion>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
