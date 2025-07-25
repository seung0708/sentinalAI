 import { schema } from "./DataTable"
 import { Row, flexRender } from "@tanstack/react-table"
 import { useSortable } from "@dnd-kit/sortable"
 import { TableRow, TableCell } from "@/components/ui/table"
 import { z } from "zod"
 import { CSS } from "@dnd-kit/utilities" 
 
 export default function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id,
    })
    return (
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    )
  }