import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function TimeRangeSelector({timeRange, setTimeRange,}: {timeRange: string; setTimeRange: (value: string) => void;}) {
    return (
        <div className="my-4 flex items-center justify-between border border-muted rounded-md p-1">
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(value) => value && setTimeRange(value)}
                className="space-x-2"
            >
                <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
                <ToggleGroupItem value="30d">30 days </ToggleGroupItem>
                <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
            </ToggleGroup>
        </div>
  );
}
