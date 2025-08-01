//import DragHandle from "./DragHandle"
//import TableCellViewer from "./TableCellView"

import { ColumnDef } from "@tanstack/react-table"
import {schema} from './DataTable'
import { z } from "zod"
//import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
//import { Button } from "@/components/ui/button"
import { CheckCircle2Icon, LoaderIcon } from "lucide-react"
//import { Label } from "@/components/ui/label"
//import { Input } from "@/components/ui/input"
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
//import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  // {
  //   id: "drag",
  //   header: () => null,
  //   cell: ({ row }) => <DragHandle id={row.original.id} />,
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //       <div className="flex items-center justify-center">
  //         <Checkbox
  //           checked={row.getIsSelected()}
  //           onCheckedChange={(value) => row.toggleSelected(!!value)}
  //           aria-label="Select row"
  //         />
  //       </div>
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
    {
      accessorKey: "stripe_id",
      header: "Stripe ID",
      size: 100,
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.stripe_id}</span>
      },
      enableHiding: false,
    },
    {
      accessorKey: "customer_id",
      header: "Customer ID",
      size: 150,
      minSize: 120,
      maxSize: 200,
      cell: ({ row }) => (
        <span className="block truncate">{row.original.customer_id}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 80,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 [&_svg]:size-3"
        >
          {row.original.status === "Done" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: () => "Amount",
      size: 100,
      minSize: 80,
      maxSize: 120,
      cell: ({ row }) => (
        <span className="block truncate">${row.original.amount.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      size: 100,
      minSize: 80,
      maxSize: 120,
      cell: ({ row }) => (
        <span className="block truncate">{row.original.currency}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 150,
      minSize: 120,
      maxSize: 200,
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_name}</span>
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 150,
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_email}</span>
      },
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      size: 100,
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_phone}</span>
      },
    },
    {
      accessorKey: "line1",
      header: "Line 1",
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_line1}</span>
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_city}</span>
      },
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_state}</span>
      },
    },
    {
      accessorKey: "zip code",
      header: "Zip Code",
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.billing_postal_code}</span>
      },
    },
    {
      accessorKey: "risk",
      header: "Predicted Risk",
      cell: ({ row }) => {
        return <span className="block truncate">{row.original.predicted_risk}</span>
      },
    },
    // {
    //   id: "actions",
    //   cell: () => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           variant="ghost"
    //           className="flex size-8 text-muted-foreground data-[state=open]:bg-mute"
    //           size="icon"
    //         >
    //           <MoreVerticalIcon />
    //           <span className="sr-only">Open menu</span>
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end" className="w-32">
    //         <DropdownMenuItem>Edit</DropdownMenuItem>
    //         <DropdownMenuItem>Make a copy</DropdownMenuItem>
    //         <DropdownMenuItem>Favorite</DropdownMenuItem>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>Delete</DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ]

  /**
    was under what is now Amount
    <form
          onSubmit={(e) => {
            e.preventDefault()
            // toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            //   loading: `Saving ${row.original.header}`,
            //   success: "Done",
            //   error: "Error",
            // })
          }}
        >
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            Target
          </Label>
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
            defaultValue={row.original}
            id={`${row.original.id}-target`}
          />
        </form>

    was under what is now Currency

     <form
          onSubmit={(e) => {
            e.preventDefault()
            // toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            //   loading: `Saving ${row.original.header}`,
            //   success: "Done",
            //   error: "Error",
            // })
          }}
        >
          <Label htmlFor={`${row.original.id}-currency`} className="sr-only">
            Currency
          </Label>
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
            defaultValue={row.original.currency}
            id={`${row.original.id}-limit`}
          />
        </form>

  //was under now Email
   const isAssigned = row.original.reviewer !== "Assign reviewer"
        if (isAssigned) {
          return row.original.reviewer
        }
        return (
          <>
            <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
              Reviewer
            </Label>
            <Select>
              <SelectTrigger
                className="h-8 w-40"
                id={`${row.original.id}-reviewer`}
              >
                <SelectValue placeholder="Assign reviewer" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                <SelectItem value="Jamik Tashpulatov">
                  Jamik Tashpulatov
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        )

*/