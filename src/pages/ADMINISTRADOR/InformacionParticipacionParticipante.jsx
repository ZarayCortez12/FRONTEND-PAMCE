import DetalleParticipacion from "@/components/DetalleParticipacion";

// Administrador: participación vista desde la información de un participante
function InformacionParticipacionParticipante() {
  return (
    <DetalleParticipacion
      mostrarEstado
      migasPorDefecto={[{ titulo: "Participantes", ruta: "/administrador/lista-participantes" }]}
    />
  );
}

export default InformacionParticipacionParticipante;
