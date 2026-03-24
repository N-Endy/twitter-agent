import { addDays, set } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export type SlotWindow = {
  hour: number;
  minute: number;
  isExperimental: boolean;
};

export function parseSlotWindows(raw: string, includeExperimental: boolean) {
  const windows = raw
    .split(",")
    .map((item, index) => {
      const parts = item.trim().split(":");
      const hour = Number(parts[0]);
      const minute = Number(parts[1]);

      if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
        throw new Error(`Invalid slot definition: ${item}`);
      }

      return {
        hour,
        minute,
        isExperimental: index === 3
      } satisfies SlotWindow;
    })
    .filter((window) => includeExperimental || !window.isExperimental);

  return windows;
}

export function buildWeeklySlots(params: {
  startDate?: Date;
  timezone: string;
  days?: number;
  windows: SlotWindow[];
}) {
  const { timezone, windows, days = 7 } = params;
  const start = params.startDate ?? new Date();
  const zonedStart = toZonedTime(start, timezone);
  const slots: Array<{ slotAt: Date; timezone: string; isExperimental: boolean }> = [];

  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    for (const window of windows) {
      const localDate = set(addDays(zonedStart, dayIndex), {
        hours: window.hour,
        minutes: window.minute,
        seconds: 0,
        milliseconds: 0
      });

      slots.push({
        slotAt: fromZonedTime(localDate, timezone),
        timezone,
        isExperimental: window.isExperimental
      });
    }
  }

  return slots.sort((a, b) => a.slotAt.getTime() - b.slotAt.getTime());
}

export function pickNextUnscheduledSlot<T extends { slotAt: Date; draftId?: string | null }>(
  slots: T[],
  now = new Date()
) {
  return slots.find((slot) => !slot.draftId && slot.slotAt.getTime() > now.getTime()) ?? null;
}
