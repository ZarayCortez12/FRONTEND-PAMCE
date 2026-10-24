import DetalleParticipacion from "@/components/DetalleParticipacion";

// Director: participación de la edición en curso, con asignación de jurados
function InformacionParticipacionEdicion() {
  return (
    <DetalleParticipacion
      permitirAsignarJurados
      migasPorDefecto={[{ titulo: "Participaciones", ruta: "/director/participaciones-edicion" }]}
    />
  );
}

export default InformacionParticipacionEdicion;
