import DetalleParticipacion from "@/components/DetalleParticipacion";

// Administrador: participación evaluada vista desde la información de un jurado
function InformacionParticipacionEvaluadaJurado() {
  return (
    <DetalleParticipacion
      migasPorDefecto={[{ titulo: "Jurados", ruta: "/administrador/lista-jurados" }]}
    />
  );
}

export default InformacionParticipacionEvaluadaJurado;
