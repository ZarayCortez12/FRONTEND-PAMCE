import { Settings } from "lucide-react";

const LoadingComponent = ({ mensaje }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <Settings
          size={56}
          className="text-blue-600 animate-spin"
          style={{ animationDuration: "4s" }}
        />
        <Settings
          size={28}
          className="absolute top-2 right-2 text-blue-400 animate-spin-reverse"
          style={{ animationDuration: "2s" }}
        />
        <Settings
          size={20}
          className="absolute bottom-4 left-3 text-blue-300 animate-spin-reverse"
          style={{ animationDuration: "1.5s" }}
        />
      </div>
      <div className="text-center">
        <p className="text-gray-500 font-semibold text-lg animate-pulse tracking-wide">
          {mensaje}
        </p>
        <span className="text-gray-400 text-sm italic font-light">
          Cargando Información...
        </span>
      </div>
    </div>
  );
};

export default LoadingComponent;
