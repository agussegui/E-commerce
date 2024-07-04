"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

//Define una columna con un identificador actions que no usa un accessorKey sino que define una función para renderizar la celda.
//La función cell recibe un objeto row y retorna el componente CellAction pasando como propiedad data el objeto original de la fila (row.original).

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div className="h-6 w-6 rounded-full border" style={{backgroundColor: row.original.value}}/>
      </div>
    )
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
