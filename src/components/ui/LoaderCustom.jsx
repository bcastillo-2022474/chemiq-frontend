import { Loader2 } from 'lucide-react'

export default function LoaderCustom() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos...</span>
    </div>
  )
}
