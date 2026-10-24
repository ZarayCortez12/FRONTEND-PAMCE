import { RiHome6Fill } from "react-icons/ri";
import { FaAward } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { GiBugleCall } from "react-icons/gi";
import { HiTrophy } from "react-icons/hi2";
import { BiSolidCategory } from "react-icons/bi";
import { CiBoxList } from "react-icons/ci";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaClipboardList } from "react-icons/fa";
import { LuLogs } from "react-icons/lu";

export const useMenusPorRol = () => {
  const edicion_en_proceso = useSelector(
    (state) => state.ediciones.edicion_en_proceso,
  );

  const ahora = new Date();

  const hoy = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, "0"),
    String(ahora.getDate()).padStart(2, "0"),
  ].join("-");

  const menusPorRol = useMemo(() => {
    const menuAdministrador = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "director",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Directores</span>,
        children: [
          {
            key: "lista-directores",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Directores</span>,
          },
        ],
      },
      {
        key: "jurado",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Jurados</span>,
        children: [
          {
            key: "lista-jurados",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Jurados</span>,
          },
        ],
      },
      {
        key: "participante",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Participantes</span>,
        children: [
          {
            key: "lista-participantes",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Participantes</span>,
          },
        ],
      },
      {
        key: "auditoria",
        icon: <LuLogs style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Auditoria</span>,
      },
    ];

    const menuDirector = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "edicion",
        icon: <FaAward style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Ediciones</span>,
        children: [
          {
            key: "ediciones",
            icon: <CiBoxList style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Ediciones</span>,
          },
        ],
      },
      {
        key: "jurado",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Jurados</span>,
        children: [
          {
            key: "lista-jurados",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Jurados</span>,
          },
        ],
      },
      {
        key: "participante",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Participantes</span>,
        children: [
          {
            key: "lista-participantes",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Participantes</span>,
          },
        ],
      },
    ];

    const menuJurado = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "edicion",
        icon: <FaAward style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Ediciones</span>,
        children: [
          {
            key: "ediciones",
            icon: <CiBoxList style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Ediciones</span>,
          },
        ],
      },
      {
        key: "participante",
        icon: <HiUserGroup style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Participaciones</span>,
        children: [
          {
            key: "lista-participantes",
            icon: <PiUsersThreeFill style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Participaciones</span>,
          },
        ],
      },
    ];

    const menuParticipante = [
      {
        key: "inicio",
        icon: <RiHome6Fill style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Inicio</span>,
      },
      {
        key: "edicion",
        icon: <FaAward style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Ediciones</span>,
        children: [
          {
            key: "ediciones",
            icon: <CiBoxList style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Ediciones</span>,
          },
        ],
      },
      {
        key: "participaciones",
        icon: <FaClipboardList style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Participaciones</span>,
      },
    ];

    if (edicion_en_proceso) {
      if (
        edicion_en_proceso.fecha_inicio_evaluacion &&
        edicion_en_proceso.fecha_inicio_evaluacion <= hoy
      ) {
        menuJurado.push({
          key: "evaluaciones",
          icon: <FaClipboardList style={{ fontSize: "20px" }} />,
          label: <span style={estiloLabel}>Evaluaciones</span>,
        });
      }

      menuDirector.push({
        key: "categoria",
        icon: <BiSolidCategory style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Categorias</span>,
        children: [
          {
            key: "categorias-edicion",
            icon: <CiBoxList style={estiloIconoHijo} />,
            label: <span style={estiloLabelHijo}>Listar Categorias</span>,
          },
        ],
      });

      menuDirector.push({
        key: "convocatoria",
        icon: <GiBugleCall style={{ fontSize: "20px" }} />,
        label: <span style={estiloLabel}>Convocatoria</span>,
      });

      if (edicion_en_proceso.fecha_inicio_convocatoria <= hoy) {
        menuDirector.push({
          key: "convocados",
          icon: <HiUserGroup style={{ fontSize: "20px" }} />,
          label: <span style={estiloLabel}>Convocados</span>,
        });
        const indexConvocados = menuDirector.findIndex(
          (item) => item.key === "convocados",
        );
        if (indexConvocados !== -1) {
          menuDirector[indexConvocados].children = [
            ...(menuDirector[indexConvocados].children || []),
            {
              key: "convocados-edicion",
              icon: <PiUsersThreeFill style={estiloIconoHijo} />,
              label: <span style={estiloLabelHijo}>Listar Convocados</span>,
            },
          ];
        }

        menuDirector.push({
          key: "postulaciones",
          icon: <HiUserGroup style={{ fontSize: "20px" }} />,
          label: <span style={estiloLabel}>Postulaciones</span>,
        });

        const indexPostulaciones = menuDirector.findIndex(
          (item) => item.key === "postulaciones",
        );

        if (indexPostulaciones !== -1) {
          menuDirector[indexPostulaciones].children = [
            ...(menuDirector[indexPostulaciones].children || []),
            {
              key: "postulados-edicion",
              icon: <PiUsersThreeFill style={estiloIconoHijo} />,
              label: <span style={estiloLabelHijo}>Listar Postulaciones</span>,
            },
          ];
        }

        menuDirector.push({
          key: "participaciones",
          icon: <HiUserGroup style={{ fontSize: "20px" }} />,
          label: <span style={estiloLabel}>Participaciones</span>,
        });
        const indexParticipaciones = menuDirector.findIndex(
          (item) => item.key === "participaciones",
        );
        if (indexParticipaciones !== -1) {
          menuDirector[indexParticipaciones].children = [
            ...(menuDirector[indexParticipaciones].children || []),
            {
              key: "participaciones-edicion",
              icon: <PiUsersThreeFill style={estiloIconoHijo} />,
              label: (
                <span style={estiloLabelHijo}>Listar Participaciones</span>
              ),
            },
          ];
        }
      }

      if (edicion_en_proceso.fecha_inicio_evaluacion <= hoy) {
        const indexJurados = menuDirector.findIndex(
          (item) => item.key === "jurado",
        );

        if (indexJurados !== -1) {
          menuDirector[indexJurados].children = [
            ...(menuDirector[indexJurados].children || []),
            {
              key: "jurados-edicion",
              icon: <PiUsersThreeFill style={estiloIconoHijo} />,
              label: <span style={estiloLabelHijo}>Jurados Edición</span>,
            },
          ];
        }
      }

      if (edicion_en_proceso.fecha_inicio_premiacion <= hoy) {
        menuDirector.push({
          key: "ganadores",
          icon: <HiTrophy style={{ fontSize: "20px" }} />,
          label: <span style={estiloLabel}>Ganadores</span>,
        });
      }
    }

    menuDirector.push({
      key: "reportes",
      icon: <HiClipboardDocumentList style={{ fontSize: "20px" }} />,
      label: <span style={estiloLabel}>Reportes</span>,
    });

    return {
      administrador: menuAdministrador,
      director: menuDirector,
      jurado: menuJurado,
      participante: menuParticipante,
    };
  }, [edicion_en_proceso, hoy]);

  return menusPorRol;
};

const estiloLabel = {
  fontSize: "15.5px",
  fontFamily: "Inter",
  color: "currentColor",
};

const estiloLabelHijo = {
  fontSize: "13.5px",
  fontFamily: "Inter",
  color: "currentColor",
};

const estiloIconoHijo = {
  fontSize: "16px",
  color: "currentColor",
  marginRight: "-6px",
  marginLeft: "-17px",
};
