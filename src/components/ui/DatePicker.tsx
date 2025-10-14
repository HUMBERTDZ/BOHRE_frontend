import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
  id?: string;
}

export function DatePicker({
  label,
  placeholder = "Seleccionar fecha",
  value,
  onChange,
  error,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="block text-sm font-medium">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={`w-full justify-between font-normal`}
          >
            {value ? value.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs block relative -top-1 text-red-400">{error}</span>}
    </div>
  );
}
