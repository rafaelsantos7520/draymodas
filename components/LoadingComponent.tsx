import React from "react";
import { Heart, Shirt, ShoppingBag, Sun } from "lucide-react";

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  animationSpeed?: "slow" | "normal" | "fast";
  showDots?: boolean;
}

export const LoadingComponent: React.FC<LoadingProps> = ({
  text = "Carregando...",
  size = "md",
  showText = true,
  className = "",
  primaryColor = "#4fcf92",
  secondaryColor = "#3be996",
  animationSpeed = "normal",
  showDots = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const animationSpeedClasses = {
    slow: "animate-[spin_3s_linear_infinite]",
    normal: "animate-spin",
    fast: "animate-[spin_0.5s_linear_infinite]",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] space-y-4 ${className}`}
      role="status"
      aria-label="Carregando"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full ${animationSpeedClasses[animationSpeed]}`}
          style={{ borderTopColor: primaryColor }}
        ></div>
        <div
          className={`absolute ${
            size === "sm" ? "-inset-1" : size === "lg" ? "-inset-3" : "-inset-2"
          } rounded-full opacity-20 animate-ping`}
          style={{ backgroundColor: primaryColor }}
        ></div>
      </div>

      {/* Marca D'Ray Modas */}
      <span
        className="font-bold text-white px-6 py-1 rounded-full"
        style={{ background: primaryColor, letterSpacing: 1 }}
      >{`D'Ray Modas`}</span>

      {/* Ícones de roupas animados do Lucide */}
      <div className="flex items-center justify-center space-x-6 mt-2">
        <span style={{ animation: "bounce 1.2s 0s infinite alternate" }}>
          <Shirt size={iconSize} color={primaryColor} />
        </span>
        <span style={{ animation: "bounce 1.2s 0.3s infinite alternate" }}>
          <ShoppingBag size={iconSize} color={secondaryColor} />
        </span>
        <span style={{ animation: "bounce 1.2s 0.6s infinite alternate" }}>
          <Heart size={iconSize} color={primaryColor} />
        </span>
      </div>

      {showText && (
        <p
          className={`${textSizeClasses[size]} font-medium text-gray-800 mt-2`}
          aria-live="polite"
        >
          {text}
        </p>
      )}

      {showDots && (
        <div className="flex space-x-2 mt-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: primaryColor,
              animation: "bounce 1s infinite alternate",
            }}
          ></span>
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: secondaryColor,
              animation: "bounce 1s 0.2s infinite alternate",
            }}
          ></span>
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: primaryColor,
              animation: "bounce 1s 0.4s infinite alternate",
            }}
          ></span>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};
