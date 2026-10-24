import { Loader2 } from "lucide-react";

const LoadingInformacion = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <div className="relative flex items-center justify-center">
        <Loader2
          size={60}
          className="text-blue-600 animate-spin"
          strokeWidth={1.5}
        />
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full w-[60px] h-[60px] -z-10" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-gray-700 font-medium text-lg tracking-tight">
          Cargando Información...
        </p>
        <p className="text-blue-500 text-sm font-medium animate-pulse">
          Por favor, espera un momento
        </p>
      </div>
    </div>
  );
};

export default LoadingInformacion;
