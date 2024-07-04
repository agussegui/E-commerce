"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
}

//Define una columna con un identificador actions que no usa un accessorKey sino que define una función para renderizar la celda.
//La función cell recibe un objeto row y retorna el componente CellAction pasando como propiedad data el objeto original de la fila (row.original).

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "billboard",
    header: "Cartelera",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
  
]
