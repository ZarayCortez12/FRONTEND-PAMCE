import { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, DatePicker, Button } from "antd";
import { IoMdArrowDropright } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import dayjs from "dayjs";
import esES from "antd/es/date-picker/locale/es_ES";
import {
  agregarDirector,
  editarInformacionDirector,
} from "../features/directores/director.slice";
import { useDispatch } from "react-redux";
import { obtenerUsuarioPorCedula } from "../features/autenticacion.slice";
import { toast } from "react-toastify";

export default function DirectorFormulario({
  visible,
  onClose,
  isEditMode,
  initialValues,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [numero_documento, setNumeroDocumento] = useState("");
  const [usuarioExiste, setUsuarioExiste] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (isEditMode && initialValues) {
        form.setFieldsValue({
          ...initialValues,
          fecha_nacimiento: initialValues.fecha_nacimiento
            ? dayjs(initialValues.fecha_nacimiento)
            : null,
        });
      } else {
        form.resetFields();
        setUsuarioExiste(false);
        setNumeroDocumento("");
      }
    } else {
      form.resetFields();
      setUsuarioExiste(false);
      setNumeroDocumento("");
    }
  }, [visible, isEditMode, initialValues]);

  const camposDeshabilitados = isEditMode ? true : usuarioExiste;

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const buscarUsuario = async (numero_documento) => {
    dispatch(obtenerUsuarioPorCedula(numero_documento))
      .unwrap()
      .then((res) => {
        if (res.exists && res.usuario) {
          form.setFieldsValue({
            ...res.usuario,
            fecha_nacimiento: res.usuario.fecha_nacimiento
              ? dayjs(res.usuario.fecha_nacimiento)
              : null,
            nivel_estudio_superior: capitalizeWords(
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

  const guardarInformacionDirector = (values) => {
    setLoading(true);

    if (isEditMode) {
      const payload = {
        ...values,
        fecha_nacimiento: values.fecha_nacimiento
          ? values.fecha_nacimiento.format("YYYY-MM-DD")
          : null,
      };
      dispatch(editarInformacionDirector(payload))
        .unwrap()
        .then((res) => {
          res.status === 201
            ? toast.info(res.message, {
                position: "top-right",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
              })
            : toast.success(res.message, {
                position: "top-right",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
              });
          onSuccess?.();
          form.resetFields();
          onClose();
        })
        .catch((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
          form.setFieldsValue({
            ...initialValues,
            fecha_nacimiento: initialValues.fecha_nacimiento
              ? dayjs(initialValues.fecha_nacimiento)
              : null,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(agregarDirector(values))
        .unwrap()
        .then((res) => {
          toast.success(res.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
          onSuccess?.();
          form.resetFields();
          onClose();
        })
        .catch((err) => {
          toast.error(err.message, {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      style={{ marginTop: "-15px" }}
      title={
        <div
          style={{
            fontFamily: "Montserrat",
            display: "flex",
            fontSize: "1.2rem",
            marginLeft: "-10px",
          }}
        >
          <IoMdArrowDropright
            size={30}
            color="#e10318"
            style={{
              filter: "drop-shadow(0px 3px 8px rgba(0,0,0,0.24))",
            }}
          />
          {isEditMode
            ? "Editar Información del Director"
            : "Registrar Director"}
        </div>
      }
      open={visible}
      onCancel={onClose}
      destroyOnClose={true}
      footer={null}
    >
      <Form
        key={visible ? "visible" : "hidden"}
        layout="vertical"
        form={form}
        onFinish={(values) => guardarInformacionDirector(values)}
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
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
                { pattern: /^[0-9]+$/, message: "Solo se permiten números" },
              ]}
            >
              <Input
                disabled={isEditMode}
                maxLength={10}
                inputMode="numeric"
                placeholder="Ingrese el número"
                addonBefore="C.C"
                onChange={(e) => {
                  const valor = e.target.value;
                  if (!isEditMode) {
                    form.setFieldsValue({ numero_documento: valor });
                    if (valor.length >= 6) buscarUsuario(valor);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
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
              rules={[{ required: true, message: "Este campo es obligatorio" }]}
            >
              <Input
                disabled={camposDeshabilitados}
                className="-mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Primer Nombre"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Segundo Nombre
                </span>
              }
              name="segundo_nombre"
            >
              <Input
                disabled={camposDeshabilitados}
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Segundo Nombre"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Primer Apellido <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="primer_apellido"
              rules={[{ required: true, message: "Este campo es obligatorio" }]}
            >
              <Input
                disabled={camposDeshabilitados}
                className="-mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Primer Apellido"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Segundo Apellido
                </span>
              }
              name="segundo_apellido"
            >
              <Input
                disabled={camposDeshabilitados}
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Segundo Apellido"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Fecha de Nacimiento <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_nacimiento"
              rules={[{ required: true, message: "Este campo es obligatorio" }]}
            >
              <DatePicker
                disabled={camposDeshabilitados}
                locale={esES}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Fecha de Nacimiento"
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                disabledDate={(current) =>
                  current && current.isAfter(dayjs().subtract(18, "year"))
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Código Institucional
                </span>
              }
              name="codigo_institucional"
            >
              <Input
                disabled={camposDeshabilitados}
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Código Institucional"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Correo Electrónico <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="correo_electronico"
              rules={[
                { required: true, message: "Este campo es obligatorio" },
                !usuarioExiste && {
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                  },
                },
              ].filter(Boolean)}
            >
              <Input
                disabled={usuarioExiste}
                type="email"
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese Correo Electrónico"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Nivel de Estudio Superior{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="nivel_estudio_superior"
              rules={[{ required: true, message: "Este campo es obligatorio" }]}
            >
              <Select
                disabled={camposDeshabilitados}
                placeholder="Seleccione"
                className="custom-ant-select w-full font-inter -mt-2!"
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
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Teléfono <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="telefono"
              rules={[
                { required: true, message: "Este campo es obligatorio" },
                !usuarioExiste && { validator: validarTelefono },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese el número de teléfono"
              />
            </Form.Item>

            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Dirección <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="direccion"
              rules={[
                { required: true, message: "Este campo es obligatorio" },
                {
                  pattern:
                    /^[A-Za-z0-9\s#\-\.\°]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+$/,
                  message: "El formato debe ser: Dirección, Barrio, Ciudad",
                },
              ]}
            >
              <Input
                disabled={usuarioExiste}
                className=" -mt-2! rounded-l-none w-full bg-gray-200! font-inter"
                placeholder="Ingrese la dirección"
              />
            </Form.Item>
            <Form.Item
              style={{ marginTop: "-10px" }}
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: "-10px",
                    marginBottom: "-15px",
                  }}
                >
                  Género <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="genero"
              rules={[{ required: true, message: "Este campo es obligatorio" }]}
            >
              <Select
                disabled={camposDeshabilitados}
                placeholder="Seleccione"
                className="custom-ant-select w-full font-inter -mt-2"
                popupClassName="font-inter"
                options={[
                  { label: "Masculino", value: "masculino" },
                  { label: "Femenino", value: "femenino" },
                  { label: "Otro", value: "otro" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            loading={loading}
            icon={!loading && <IoIosSave style={{ marginRight: 5 }} />}
            style={{
              fontFamily: "Poppins",
              borderRadius: "12px",
              backgroundColor: "#e10318",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              !loading && guardarInformacionDirector(form.getFieldsValue());
            }}
          >
            {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
