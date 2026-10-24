import { useEffect } from "react";
import { FaUserShield } from "react-icons/fa";

function Inicio() {
  useEffect(() => {
    document.title = "PAMCE | Inicio Administrador";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-[-25px] h-[80vh] text-center">
      <FaUserShield className="text-[#e10318]" size={60} />
      <h1 className="text-[2.5rem] font-bold font-poppins mt-2.5">
        ¡Bienvenido de nuevo, Administrador!
      </h1>
      <p className="text-[1.2rem] text-[#666] max-w-[600px] mt-2.5">
        Este es tu módulo. Explora las opciones del menú para gestionar a los
        actores del sistema.
      </p>
    </div>
  );
}

export default Inicio;
