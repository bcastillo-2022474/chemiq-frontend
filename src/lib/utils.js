import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return Intl.DateTimeFormat("es-GT").format(new Date(date))
}

export const formatDuration = duration => {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/
  const match = duration.match(regex)

  const hours = match[1] ? match[1].slice(0, -1) : null
  const minutes = match[2] ? match[2].slice(0, -1) : "00"
  const seconds = match[3] ? match[3].slice(0, -1).padStart(2, "0") : "00"

  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds}`
  } else {
    return `${minutes}:${seconds}`
  }
}
