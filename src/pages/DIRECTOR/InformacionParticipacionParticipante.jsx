import DetalleParticipacion from "@/components/DetalleParticipacion";

// Director: participación vista desde la información de un participante
function InformacionParticipacionParticipante() {
  return (
    <DetalleParticipacion
      mostrarEstado
      migasPorDefecto={[{ titulo: "Participantes", ruta: "/director/lista-participantes" }]}
    />
  );
}

export default InformacionParticipacionParticipante;
