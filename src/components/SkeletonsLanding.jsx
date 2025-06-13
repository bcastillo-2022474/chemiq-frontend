import { cn } from "@/lib/utils"
import { useColors } from "./colorProvider"
import { color } from "framer-motion";
// Componente base de Skeleton
function Skeleton({ className, ...props }) {

  const result = useColors();
  const colors = result.colors; // Aquí tienes el array con los 5 colores
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";

    return (
      <div
        className={cn("animate-pulse rounded-md", className)}
        style={{ backgroundColor: `${tertiary}B3` }}
        {...props}
      />
    )
  }
}

// Efecto de shimmer que se puede aplicar a cualquier skeleton
function ShimmerEffect() {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";


    return (
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: `linear-gradient(to right, transparent, ${subase}4D, transparent)`,
        }}
      />
    )
  }

}

// Skeleton para el Carousel
function CarouselSkeleton({ className }) {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";

    return (

      <div className={cn("w-full relative overflow-hidden", className)}>

        <div
          className="w-full h-[400px] rounded-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`,
          }}
        >
          <ShimmerEffect />

          {/* Indicadores de navegación */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="h-2 rounded-full"
                style={{
                  width: index === 0 ? 24 : 8,
                  backgroundColor: index === 0 ? `${base}B3` : `${subase}80`,
                }}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${base}4D` }}
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: `${accent}4D` }}
              />
            </div>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${base}4D` }}
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: `${accent}4D` }}
              />
            </div>
          </div>
        </div>
      </div>
    );

  }


}

// Skeleton para Member Cards
function MemberCardSkeleton({ count = 9, className }) {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";

    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4",
          className
        )}
      >
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${tertiary}, ${background})`
              }}
            >
              {/* Imagen */}
              <div
                className="w-full aspect-square relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${tertiary}, ${subase}20, ${tertiary})`
                }}
              >
                <ShimmerEffect />

                {/* Silueta de persona */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full"
                    style={{ backgroundColor: `${subase}66` }} // 40% opacity
                  />
                  <div
                    className="absolute w-16 h-28 rounded-t-full top-[45%]"
                    style={{ backgroundColor: `${subase}66` }}
                  />
                </div>
              </div>

              {/* Overlay con información */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                style={{
                  backgroundImage: `linear-gradient(to top, ${accent}B3, transparent, transparent)` // B3 = 70% opacity
                }}
              >
                <div
                  className="h-6 w-3/4 rounded mb-2"
                  style={{ backgroundColor: `${tertiary}CC` }} // 80%
                />
                <div
                  className="h-4 w-1/2 rounded"
                  style={{ backgroundColor: `${background}CC` }}
                />
              </div>

              {/* Información debajo */}
              <div className="p-4 text-center w-full">
                <div
                  className="h-6 w-3/4 rounded mx-auto mb-2"
                  style={{ backgroundColor: `${base}4D` }} // 30%
                />
                <div
                  className="h-4 w-1/2 rounded mx-auto"
                  style={{ backgroundColor: `${subase}4D` }}
                />
              </div>
            </div>
          ))}
      </div>
    )
  }


}


// Skeleton para Secciones de Texto
function TextSectionSkeleton({ lines = 4, title = true, className }) {

  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div
            className="h-8 rounded-lg w-3/4 mx-auto relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${tertiary}, ${subase}33, ${tertiary})`
            }}
          >
            <ShimmerEffect />
          </div>
        )}

        <div className="space-y-2">
          {Array(lines)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-4 rounded-lg relative overflow-hidden"
                style={{
                  width: `${100 - i * 5}%`,
                  background: `linear-gradient(to right, ${tertiary}, ${subase}33, ${tertiary})`
                }}
              >
                <ShimmerEffect />
              </div>
            ))}
        </div>
      </div>
    )


  }
}

// Skeleton para Formularios
function FormSkeleton({ className }) {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";

    return (
      <div className={cn("space-y-4 w-full max-w-md mx-auto", className)}>
        {/* Campos de entrada */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="space-y-1">
            <div
              className="h-4 w-24 rounded-md"
              style={{ backgroundColor: `${base}4D` }}
            ></div>
            <div
              className="h-10 w-full rounded-md relative overflow-hidden"
              style={{
                background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`
              }}
            >
              <ShimmerEffect />
            </div>
          </div>
        ))}

        {/* Área de texto */}
        <div className="space-y-1">
          <div
            className="h-4 w-24 rounded-md"
            style={{ backgroundColor: `${base}4D` }}
          ></div>
          <div
            className="h-32 w-full rounded-md relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`
            }}
          >
            <ShimmerEffect />
          </div>
        </div>

        {/* Botón */}
        <div
          className="h-10 w-full rounded-md relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${base}80, ${subase}80, ${base}80)`
          }}
        >
          <ShimmerEffect />
        </div>
      </div>
    )

  }
}

// Skeleton para Características 
function FeatureSkeleton({ count = 3, className }) {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", className)}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* Icono */}
              <div
                className="h-16 w-16 rounded-full mb-4 relative overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${base}66, ${subase}66)`,
                }}
              >
                <ShimmerEffect />
                <div
                  className="h-8 w-8 rounded-sm"
                  style={{ backgroundColor: `${accent}1A` }}
                />
              </div>

              {/* Título */}
              <div
                className="h-6 w-[180px] rounded-md mb-3 relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${tertiary}, ${subase}33, ${tertiary})`,
                }}
              >
                <ShimmerEffect />
              </div>

              {/* Texto */}
              <div className="space-y-2">
                <div
                  className="h-4 w-full rounded-md relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`,
                  }}
                >
                  <ShimmerEffect />
                </div>
                <div
                  className="h-4 w-full rounded-md relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`,
                  }}
                >
                  <ShimmerEffect />
                </div>
                <div
                  className="h-4 w-3/4 rounded-md relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${tertiary}, ${background}, ${tertiary})`,
                  }}
                >
                  <ShimmerEffect />
                </div>
              </div>
            </div>
          ))}
      </div>
    )

  }

}

// Skeleton para Título
function TitleSkeleton({ className }) {
  const result = useColors();
  const colors = result.colors; // Aquí tienes el array con los 5 colores
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";
    return (
      <div
        className={cn(
          "h-10 w-[300px] mx-auto mb-8 rounded-lg relative overflow-hidden",
          className
        )}
        style={{
          background: `linear-gradient(to right, ${base}, ${subase}4D, ${base})`
        }}
      >
        <ShimmerEffect />
      </div>
    )

  }
}

// Skeleton para Footer
function FooterSkeleton({ columns = 4, className }) {
  const result = useColors();
  const colors = result.colors;
  if (colors && Array.isArray(colors) && colors.length > 1 && colors[1]) {
    const coloresArray = colors[1];

    const tertiary = coloresArray[1].hex || "#d1d5db";
    const background = coloresArray[2].hex || "#f3f4f6";
    const subase = coloresArray[3].hex || "#9ca3af";
    const base = coloresArray[0].hex || "#6b7280";
    const accent = coloresArray[4].hex || "#3b82f6";
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-8", className)}>
        {Array(columns)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-4">
              <div
                className="h-6 w-[180px] rounded relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${accent}CC, ${accent}99, ${accent}CC)`,
                }}
              >
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${base}33, transparent)`,
                  }}
                />
              </div>
              <div
                className="h-4 w-full rounded relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${accent}CC, ${accent}99, ${accent}CC)`,
                }}
              >
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${base}33, transparent)`,
                  }}
                />
              </div>
              <div
                className="h-4 w-full rounded relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${accent}CC, ${accent}99, ${accent}CC)`,
                }}
              >
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${base}33, transparent)`,
                  }}
                />
              </div>
              <div
                className="h-4 w-3/4 rounded relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${accent}CC, ${accent}99, ${accent}CC)`,
                }}
              >
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: `linear-gradient(to right, transparent, ${base}33, transparent)`,
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    )

  }
}

export {
  Skeleton,
  ShimmerEffect,
  CarouselSkeleton,
  MemberCardSkeleton,
  TextSectionSkeleton,
  FormSkeleton,
  FeatureSkeleton,
  TitleSkeleton,
  FooterSkeleton
}
