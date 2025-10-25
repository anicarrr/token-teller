"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock } from "lucide-react";

interface BirthDateFormProps {
  onSubmit: (birthDate: Date) => void;
  onBack?: () => void;
  isLoading?: boolean;
  showBackButton?: boolean;
  initialBirthDate?: Date | null;
}

export function BirthDateForm({ onSubmit, onBack, isLoading = false, showBackButton = false, initialBirthDate }: BirthDateFormProps) {
  const [date, setDate] = useState(() => {
    if (initialBirthDate) {
      return initialBirthDate.toISOString().split('T')[0];
    }
    return "";
  });
  
  const [time, setTime] = useState(() => {
    if (initialBirthDate) {
      const hours = initialBirthDate.getHours().toString().padStart(2, '0');
      const minutes = initialBirthDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return "";
  });
  
  const [includeTime, setIncludeTime] = useState(() => {
    if (initialBirthDate) {
      // Check if time is not noon (12:00) - indicating time was specifically set
      return initialBirthDate.getHours() !== 12 || initialBirthDate.getMinutes() !== 0;
    }
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;

    let birthDate: Date;
    
    if (includeTime && time) {
      // Combine date and time
      birthDate = new Date(`${date}T${time}`);
    } else {
      // Use date only, set to noon to avoid timezone issues
      birthDate = new Date(`${date}T12:00:00`);
    }

    onSubmit(birthDate);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="border-primary/20 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Enter Your Birth Date</span>
          </div>
          {showBackButton && onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              ← Back
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your birth date helps us generate a more accurate BaZi fortune reading
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="birth-date" className="block text-sm font-medium mb-2">
              Birth Date *
            </label>
            <Input
              id="birth-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              required
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-time"
              checked={includeTime}
              onChange={(e) => setIncludeTime(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="include-time" className="text-sm">
              Include birth time (optional, for more precise reading)
            </label>
          </div>

          {includeTime && (
            <div>
              <label htmlFor="birth-time" className="block text-sm font-medium mb-2 flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Birth Time</span>
              </label>
              <Input
                id="birth-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={!date || isLoading}
            className="w-full mystical-gradient text-white"
          >
            {isLoading ? "Generating Fortune..." : "Generate My Fortune"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}