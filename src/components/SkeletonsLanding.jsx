import { cn } from "@/lib/utils"

// Componente base de Skeleton
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-tertiary/70", className)}
      {...props}
    />
  )
}

// Efecto de shimmer que se puede aplicar a cualquier skeleton
function ShimmerEffect() {
  return (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-subase/30 to-transparent" />
  )
}

// Skeleton para el Carousel
function CarouselSkeleton({ className }) {
  return (
    <div className={cn("w-full relative overflow-hidden", className)}>
      <div className="w-full h-[400px] bg-gradient-to-r from-tertiary via-background to-tertiary rounded-lg relative overflow-hidden">
        <ShimmerEffect />

        {/* Indicadores de navegación */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full bg-subase/50 ${
                index === 0 ? "w-6 bg-base/70" : ""
              }`}
            />
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-base/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-accent/30" />
          </div>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-base/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-accent/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton para Member Cards
function MemberCardSkeleton({ count = 9, className }) {
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
            className="flex flex-col items-center group relative overflow-hidden rounded-lg bg-gradient-to-b from-tertiary to-background transition-all duration-300 hover:shadow-xl"
          >
            {/* Imagen */}
            <div className="w-full aspect-square bg-gradient-to-br from-tertiary via-subase/20 to-tertiary relative overflow-hidden">
              <ShimmerEffect />

              {/* Silueta de persona */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-subase/40"></div>
                <div className="absolute w-16 h-28 rounded-t-full bg-subase/40 top-[45%]"></div>
              </div>
            </div>

            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="h-6 w-3/4 bg-tertiary/80 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-background/80 rounded"></div>
            </div>

            {/* Información debajo */}
            <div className="p-4 text-center w-full">
              <div className="h-6 w-3/4 bg-base/30 rounded mx-auto mb-2"></div>
              <div className="h-4 w-1/2 bg-subase/30 rounded mx-auto"></div>
            </div>
          </div>
        ))}
    </div>
  )
}

// Skeleton para Secciones de Texto
function TextSectionSkeleton({ lines = 4, title = true, className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="h-8 bg-gradient-to-r from-tertiary via-subase/20 to-tertiary rounded-lg w-3/4 mx-auto relative overflow-hidden">
          <ShimmerEffect />
        </div>
      )}

      <div className="space-y-2">
        {Array(lines)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gradient-to-r from-tertiary via-subase/20 to-tertiary rounded-lg relative overflow-hidden"
              style={{ width: `${100 - i * 5}%` }}
            >
              <ShimmerEffect />
            </div>
          ))}
      </div>
    </div>
  )
}

// Skeleton para Formularios
function FormSkeleton({ className }) {
  return (
    <div className={cn("space-y-4 w-full max-w-md mx-auto", className)}>
      {/* Campos de entrada */}
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-4 w-24 bg-base/30 rounded-md"></div>
          <div className="h-10 w-full bg-gradient-to-r from-tertiary via-background to-tertiary rounded-md relative overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>
      ))}

      {/* Área de texto */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-base/30 rounded-md"></div>
        <div className="h-32 w-full bg-gradient-to-r from-tertiary via-background to-tertiary rounded-md relative overflow-hidden">
          <ShimmerEffect />
        </div>
      </div>

      {/* Botón */}
      <div className="h-10 w-full bg-gradient-to-r from-base/50 via-subase/50 to-base/50 rounded-md relative overflow-hidden">
        <ShimmerEffect />
      </div>
    </div>
  )
}

// Skeleton para Características (Features)
function FeatureSkeleton({ count = 3, className }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", className)}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Icono */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-base/40 to-subase/40 mb-4 relative overflow-hidden flex items-center justify-center">
              <ShimmerEffect />
              <div className="h-8 w-8 rounded-sm bg-accent/10"></div>
            </div>

            {/* Título */}
            <div className="h-6 w-[180px] bg-gradient-to-r from-tertiary via-subase/20 to-tertiary rounded-md mb-3 relative overflow-hidden">
              <ShimmerEffect />
            </div>

            {/* Texto */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gradient-to-r from-tertiary via-background to-tertiary rounded-md relative overflow-hidden">
                <ShimmerEffect />
              </div>
              <div className="h-4 w-full bg-gradient-to-r from-tertiary via-background to-tertiary rounded-md relative overflow-hidden">
                <ShimmerEffect />
              </div>
              <div className="h-4 w-3/4 bg-gradient-to-r from-tertiary via-background to-tertiary rounded-md relative overflow-hidden">
                <ShimmerEffect />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

// Skeleton para Título
function TitleSkeleton({ className }) {
  return (
    <div
      className={cn(
        "h-10 w-[300px] mx-auto mb-8 bg-gradient-to-r from-tertiary via-subase/30 to-tertiary rounded-lg relative overflow-hidden",
        className
      )}
    >
      <ShimmerEffect />
    </div>
  )
}

// Skeleton para Footer (adaptado a fondo oscuro)
function FooterSkeleton({ columns = 4, className }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-8", className)}>
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-[180px] bg-gradient-to-r from-accent/80 via-accent/60 to-accent/80 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base/20 to-transparent" />
            </div>
            <div className="h-4 w-full bg-gradient-to-r from-accent/80 via-accent/60 to-accent/80 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base/20 to-transparent" />
            </div>
            <div className="h-4 w-full bg-gradient-to-r from-accent/80 via-accent/60 to-accent/80 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base/20 to-transparent" />
            </div>
            <div className="h-4 w-3/4 bg-gradient-to-r from-accent/80 via-accent/60 to-accent/80 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base/20 to-transparent" />
            </div>
          </div>
        ))}
    </div>
  )
}

// Exportamos todos los skeletons
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
