import DetalleParticipacion from "@/components/DetalleParticipacion";

// Director: participación evaluada vista desde la información de un jurado
function InformacionParticipacionEvaluadaJurado() {
  return (
    <DetalleParticipacion
      migasPorDefecto={[{ titulo: "Jurados", ruta: "/director/lista-jurados" }]}
    />
  );
}

export default InformacionParticipacionEvaluadaJurado;
