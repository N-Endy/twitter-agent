import { describe, expect, it } from "vitest";

import {
  buildWeeklySlots,
  parseSlotWindows,
  pickNextUnscheduledSlot
} from "../../packages/core/src/scheduling";

describe("scheduling helpers", () => {
  it("parses slot windows and respects the experimental toggle", () => {
    const windows = parseSlotWindows("12:30,16:30,20:30,23:00", false);

    expect(windows).toHaveLength(3);
    expect(windows[0]).toMatchObject({ hour: 12, minute: 30, isExperimental: false });
  });

  it("builds a sorted weekly slot list", () => {
    const slots = buildWeeklySlots({
      startDate: new Date("2026-03-24T00:00:00.000Z"),
      timezone: "Africa/Lagos",
      days: 2,
      windows: parseSlotWindows("12:30,16:30", false)
    });

    expect(slots).toHaveLength(4);
    expect(slots[0]!.slotAt.getTime()).toBeLessThan(slots[1]!.slotAt.getTime());
  });

  it("returns the next open slot after now", () => {
    const now = new Date("2026-03-24T10:00:00.000Z");
    const slots = [
      { slotAt: new Date("2026-03-24T09:00:00.000Z"), draftId: null },
      { slotAt: new Date("2026-03-24T11:00:00.000Z"), draftId: null },
      { slotAt: new Date("2026-03-24T12:00:00.000Z"), draftId: "draft_1" }
    ];

    const next = pickNextUnscheduledSlot(slots, now);

    expect(next?.slotAt.toISOString()).toBe("2026-03-24T11:00:00.000Z");
  });
});
