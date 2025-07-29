import { Button } from "@/components/ui/button"
import {useSortable} from "@dnd-kit/sortable";
import { GripVerticalIcon } from "lucide-react";

export default function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({id})
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}