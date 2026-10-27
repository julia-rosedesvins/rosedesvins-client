"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ALL_BOOKING_SOURCES,
  BOOKING_SOURCE_LABELS,
  useBookingSourceFilter,
} from "./BookingSourceFilterContext"

export function BookingSourceFilterDropdown() {
  const { selectedSources, toggleSource } = useBookingSourceFilter()

  const triggerLabel =
    selectedSources.length === ALL_BOOKING_SOURCES.length
      ? "Type de réservation"
      : selectedSources.length === 0
        ? "Aucun type sélectionné"
        : `Type de réservation (${selectedSources.length})`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 flex items-center gap-2 bg-white">
          <Filter className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Filtrer par type de réservation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_BOOKING_SOURCES.map((source) => (
          <DropdownMenuCheckboxItem
            key={source}
            checked={selectedSources.includes(source)}
            onCheckedChange={() => toggleSource(source)}
            onSelect={(e) => e.preventDefault()}
          >
            {BOOKING_SOURCE_LABELS[source]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
