import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, DatePicker, Button } from "antd";
import { IoMdArrowDropright, IoIosSave } from "react-icons/io";
import dayjs from "dayjs";
import esES from "antd/es/date-picker/locale/es_ES";
import {
  crearEdicion,
  editarEdicion,
  obtenerEdicion,
} from "../features/ediciones/edicion.slice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export default function EdicionFormulario({
  visible,
  onClose,
  onSubmit,
  id_edicion,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const isEditMode = !!id_edicion;
  const edicion = useSelector((state) => state.ediciones.edicion);

  const formatDate = (d) => (d ? d.format("YYYY/MM/DD") : null);
  const toDayjs = (d) => (d ? dayjs(d) : null);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => {
        if (/^[ivxlcdm]+$/i.test(word)) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  useEffect(() => {
    if (isEditMode) {
      dispatch(obtenerEdicion(id_edicion));
    }
  }, [id_edicion]);

  useEffect(() => {
    if (!visible) return;
    if (isEditMode && edicion) {
      form.setFieldsValue({
        ...edicion,
        nombre_edicion: capitalizeWords(edicion.nombre_edicion),
        fecha_inicio: toDayjs(edicion.fecha_inicio),
        fecha_fin: toDayjs(edicion.fecha_fin),
        fecha_inicio_convocatoria: toDayjs(edicion.fecha_inicio_convocatoria),
        fecha_fin_convocatoria: toDayjs(edicion.fecha_fin_convocatoria),
        fecha_inicio_evaluacion: toDayjs(edicion.fecha_inicio_evaluacion),
        fecha_fin_evaluacion: toDayjs(edicion.fecha_fin_evaluacion),
        fecha_inicio_premiacion: toDayjs(edicion.fecha_inicio_premiacion),
        fecha_fin_premiacion: toDayjs(edicion.fecha_fin_premiacion),
      });
      setData(edicion);
    } else {
      form.resetFields();
    }
  }, [visible, edicion]);

  const validar = (values) => {
    const errores = [];

    if (
      values.fecha_inicio &&
      values.fecha_fin &&
      values.fecha_inicio.isAfter(values.fecha_fin)
    ) {
      errores.push("La fecha inicio no puede ser mayor a la fecha fin");
    }

    return errores;
  };

  const onFinish = async (values) => {
    const errores = validar(values);

    if (errores.length) {
      errores.forEach((e) => toast.error(e));
      return;
    }

    setLoading(true);

    const payload = {
      nombre_edicion: values.nombre_edicion?.trim().toLowerCase(),
      fecha_inicio: formatDate(values.fecha_inicio),
      fecha_fin: formatDate(values.fecha_fin),
      fecha_inicio_convocatoria: formatDate(values.fecha_inicio_convocatoria),
      fecha_fin_convocatoria: formatDate(values.fecha_fin_convocatoria),
      fecha_inicio_evaluacion: formatDate(values.fecha_inicio_evaluacion),
      fecha_fin_evaluacion: formatDate(values.fecha_fin_evaluacion),
      fecha_inicio_premiacion: formatDate(values.fecha_inicio_premiacion),
      fecha_fin_premiacion: formatDate(values.fecha_fin_premiacion),
    };

    try {
      const res = isEditMode
        ? await dispatch(editarEdicion({ id_edicion, datos: payload })).unwrap()
        : await dispatch(crearEdicion(payload)).unwrap();

      toast.success(res.message);

      if (!isEditMode) form.resetFields();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularDiferencia = (inicio, fin) => {
    const i = toDayjs(inicio);
    const f = toDayjs(fin);
    if (!i || !f || !i.isValid() || !f.isValid()) return 0;
    return f.startOf("day").diff(i.startOf("day"), "day");
  };

  return (
    <Modal
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
              filter: "drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.24))",
            }}
          />{" "}
          {isEditMode ? "Editar Información Edición" : "Crear Edición"}
        </div>
      }
      open={visible}
      onCancel={onClose}
      destroyOnHidden={true}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label={
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "13px",
              }}
            >
              Nombre de la Edición <span style={{ color: "red" }}>*</span>
            </span>
          }
          name="nombre_edicion"
          rules={[{ required: true, message: "El nombre es obligatorio" }]}
        >
          <Input
            disabled={isEditMode}
            style={{ backgroundColor: "#EEEEEE", fontFamily: "Inter" }}
            placeholder="Ingrese el nombre de la edición"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Inicio de la Edición
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_inicio"
              rules={[
                {
                  required: true,
                  message: "La fecha de inicio de la edición es obligatoria",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Seleccione fecha"
                onChange={(date) => {
                  form.setFieldsValue({
                    fecha_inicio_convocatoria: date.add(30, "day"),
                  });
                  if (isEditMode) {
                    form.setFieldsValue({
                      fecha_fin_convocatoria: form
                        .getFieldValue("fecha_inicio_convocatoria")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_convocatoria,
                            data.fecha_fin_convocatoria,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_inicio_evaluacion: form
                        .getFieldValue("fecha_fin_convocatoria")
                        .add(1, "day"),
                    });
                    form.setFieldsValue({
                      fecha_fin_evaluacion: form
                        .getFieldValue("fecha_inicio_evaluacion")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_evaluacion,
                            data.fecha_fin_evaluacion,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_inicio_premiacion: form
                        .getFieldValue("fecha_fin_evaluacion")
                        .add(1, "day"),
                    });
                    form.setFieldsValue({
                      fecha_fin_premiacion: form
                        .getFieldValue("fecha_inicio_premiacion")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_premiacion,
                            data.fecha_fin_premiacion,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_fin: form
                        .getFieldValue("fecha_fin_premiacion")
                        .add(1, "day"),
                    });
                    return;
                  }
                  form.setFieldsValue({
                    fecha_fin_convocatoria: "",
                    fecha_inicio_evaluacion: "",
                    fecha_fin_evaluacion: "",
                    fecha_inicio_premiacion: "",
                    fecha_fin_premiacion: "",
                    fecha_fin: "",
                  });
                }}
                disabledDate={(current) => {
                  if (!current) return false;
                  if (isEditMode && data?.fecha_inicio) {
                    const inicio = dayjs(data.fecha_inicio);

                    if (!inicio.isValid()) return false;

                    const max = inicio.add(15, "day");

                    return (
                      current.isBefore(inicio, "day") ||
                      current.isAfter(max, "day")
                    );
                  }
                  return current.isBefore(dayjs().add(1, "day"), "day");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Fin de la Edición
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_fin"
              rules={[
                {
                  required: true,
                  message: "La fecha de fin de la edición es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Seleccione fecha"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Inicio de la Convocatoria
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_inicio_convocatoria"
              rules={[
                {
                  required: true,
                  message:
                    "La fecha de inicio de la convocatoria es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Fin de la Convocatoria
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_fin_convocatoria"
              rules={[
                {
                  required: true,
                  message: "La fecha de fin de la convocatoria es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                disabledDate={(current) => {
                  if (!current) return false;
                  if (isEditMode && data?.fecha_fin_convocatoria) {
                    const inicio = dayjs(data.fecha_fin_convocatoria);
                    if (!inicio.isValid()) return false;
                    return (
                      current.isBefore(
                        dayjs(data.fecha_fin_convocatoria),
                        "day",
                      ) ||
                      current.isAfter(
                        dayjs(data.fecha_fin_convocatoria).add(15, "day"),
                        "day",
                      )
                    );
                  }
                  const inicioConv = form.getFieldValue(
                    "fecha_inicio_convocatoria",
                  );

                  if (!inicioConv) return false;
                  const inicio = dayjs(inicioConv);

                  if (!inicio.isValid()) return false;

                  return (
                    current.isBefore(inicio.add(15, "day"), "day") ||
                    current.isAfter(inicio.add(20, "day"), "day")
                  );
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Seleccione fecha"
                onChange={(date, dateString) => {
                  form.setFieldsValue({
                    fecha_inicio_evaluacion: date.add(1, "day"),
                  });
                  if (isEditMode) {
                    form.setFieldsValue({
                      fecha_fin_evaluacion: form
                        .getFieldValue("fecha_fin_evaluacion")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_evaluacion,
                            data.fecha_fin_evaluacion,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_inicio_premiacion: form
                        .getFieldValue("fecha_inicio_premiacion")
                        .add(1, "day"),
                    });
                    form.setFieldsValue({
                      fecha_fin_premiacion: form
                        .getFieldValue("fecha_inicio_premiacion")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_premiacion,
                            data.fecha_fin_premiacion,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_fin: form
                        .getFieldValue("fecha_fin_premiacion")
                        .add(1, "day"),
                    });
                    return;
                  }
                  form.setFieldsValue({
                    fecha_fin_evaluacion: "",
                    fecha_inicio_premiacion: "",
                    fecha_fin_premiacion: "",
                    fecha_fin: "",
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Inicio de Evaluación{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_inicio_evaluacion"
              rules={[
                {
                  required: true,
                  message: "La fecha de inicio de evaluación es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Fin de Evaluación{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_fin_evaluacion"
              rules={[
                {
                  required: true,
                  message: "La fecha de fin de evaluación es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Seleccione fecha"
                onChange={(date, dateString) => {
                  form.setFieldsValue({
                    fecha_inicio_premiacion: date.add(1, "day"),
                  });
                  if (isEditMode) {
                    form.setFieldsValue({
                      fecha_fin_premiacion: form
                        .getFieldValue("fecha_inicio_premiacion")
                        .add(
                          calcularDiferencia(
                            data.fecha_inicio_premiacion,
                            data.fecha_fin_premiacion,
                          ),
                          "day",
                        ),
                    });
                    form.setFieldsValue({
                      fecha_fin: form
                        .getFieldValue("fecha_fin_premiacion")
                        .add(1, "day"),
                    });
                    return;
                  }
                  form.setFieldsValue({
                    fecha_fin_premiacion: "",
                    fecha_fin: "",
                  });
                }}
                disabledDate={(current) => {
                  if (!current) return false;
                  if (isEditMode && data?.fecha_fin_evaluacion) {
                    const inicio = dayjs(data.fecha_fin_evaluacion);
                    if (!inicio.isValid()) return false;
                    return (
                      current.isBefore(
                        dayjs(data.fecha_fin_evaluacion),
                        "day",
                      ) ||
                      current.isAfter(
                        dayjs(data.fecha_fin_evaluacion).add(10, "day"),
                        "day",
                      )
                    );
                  }
                  const inicioConv = form.getFieldValue(
                    "fecha_inicio_evaluacion",
                  );

                  if (!inicioConv) return false;
                  const inicio = dayjs(inicioConv);

                  if (!inicio.isValid()) return false;

                  return (
                    current.isBefore(inicio.add(18, "day"), "day") ||
                    current.isAfter(inicio.add(20, "day"), "day")
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Inicio de la Premiación{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_inicio_premiacion"
              rules={[
                {
                  required: true,
                  message: "La fecha de inicio de la premiación es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Fecha Fin de la Premiación{" "}
                  <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="fecha_fin_premiacion"
              rules={[
                {
                  required: true,
                  message: "La fecha de fin de la premiación es obligatorio",
                },
              ]}
              style={{ marginTop: "-10px" }}
            >
              <DatePicker
                locale={esES}
                style={{
                  width: "100%",
                  backgroundColor: "#EEEEEE",
                  fontFamily: "Inter",
                }}
                format="DD [de] MMMM [del] YYYY"
                placeholder="Seleccione fecha"
                onChange={(date) => {
                  form.setFieldsValue({
                    fecha_fin: date.add(1, "day"),
                  });
                }}
                disabledDate={(current) => {
                  if (!current) return false;
                  if (isEditMode && data?.fecha_fin_premiacion) {
                    const inicio = dayjs(data.fecha_fin_premiacion);
                    if (!inicio.isValid()) return false;
                    return (
                      current.isBefore(
                        dayjs(data.fecha_fin_premiacion),
                        "day",
                      ) ||
                      current.isAfter(
                        dayjs(data.fecha_fin_premiacion).add(3, "day"),
                        "day",
                      )
                    );
                  }
                  const inicioConv = form.getFieldValue(
                    "fecha_inicio_premiacion",
                  );

                  if (!inicioConv) return false;
                  const inicio = dayjs(inicioConv);

                  if (!inicio.isValid()) return false;

                  return (
                    current.isBefore(inicio.add(1, "day"), "day") ||
                    current.isAfter(inicio.add(3, "day"), "day")
                  );
                }}
                disabled={isEditMode}
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
            onClick={() => form.submit()}
          >
            {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
