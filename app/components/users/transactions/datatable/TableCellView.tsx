import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { z } from "zod"
import { schema } from "./DataTable"
import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Separator } from "@/components/ui/separator"
import { TrendingUpIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--primary)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--primary)",
    },
} satisfies ChartConfig

export default function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
    const isMobile = useIsMobile()
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="w-fit px-0 text-left text-foreground">
            {item.stripe_id}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle>{item.stripe_id}</SheetTitle>
            <SheetDescription>
              Showing total visitors for the last 6 months
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
            {!isMobile && (
              <>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    //data={chartData}
                    margin={{
                      left: 0,
                      right: 10,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                      hide
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="var(--color-mobile)"
                      fillOpacity={0.6}
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="var(--color-desktop)"
                      fillOpacity={0.4}
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Showing total visitors for the last 6 months. This is just
                    some random text to test the layout. It spans multiple lines
                    and should wrap around.
                  </div>
                </div>
                <Separator />
              </>
            )}
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="header">Header</Label>
                <Input id="header" defaultValue={item.stripe_id} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem value="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem value="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="target">Target</Label>
                  <Input id="target" />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="limit">Limit</Label>
                  <Input id="limit" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="reviewer">Reviewer</Label>
                <Select >
                  <SelectTrigger id="reviewer" className="w-full">
                    <SelectValue placeholder="Select a reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Jamik Tashpulatov">
                      Jamik Tashpulatov
                    </SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            <Button className="w-full">Submit</Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Done
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }