"use client"

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react"

export const ALL_BOOKING_SOURCES = ["manual", "widget", "platform"] as const

export type BookingSource = (typeof ALL_BOOKING_SOURCES)[number]

export const BOOKING_SOURCE_LABELS: Record<BookingSource, string> = {
  manual: "Réservation manuelle",
  widget: "Réservation widget",
  platform: "Réservation plateforme",
}

interface BookingSourceFilterContextValue {
  selectedSources: BookingSource[]
  toggleSource: (source: BookingSource) => void
}

const BookingSourceFilterContext = createContext<BookingSourceFilterContextValue | undefined>(undefined)

export function BookingSourceFilterProvider({ children }: { children: ReactNode }) {
  const [selectedSources, setSelectedSources] = useState<BookingSource[]>([...ALL_BOOKING_SOURCES])

  const toggleSource = useCallback((source: BookingSource) => {
    setSelectedSources((current) =>
      current.includes(source)
        ? current.filter((s) => s !== source)
        : [...current, source],
    )
  }, [])

  const value = useMemo(() => ({ selectedSources, toggleSource }), [selectedSources, toggleSource])

  return (
    <BookingSourceFilterContext.Provider value={value}>
      {children}
    </BookingSourceFilterContext.Provider>
  )
}

export function useBookingSourceFilter(): BookingSourceFilterContextValue {
  const context = useContext(BookingSourceFilterContext)
  if (!context) {
    throw new Error("useBookingSourceFilter must be used within a BookingSourceFilterProvider")
  }
  return context
}
