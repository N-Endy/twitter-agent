export type SlotWindow = {
    hour: number;
    minute: number;
    isExperimental: boolean;
};
export declare function parseSlotWindows(raw: string, includeExperimental: boolean): {
    hour: number;
    minute: number;
    isExperimental: boolean;
}[];
export declare function buildWeeklySlots(params: {
    startDate?: Date;
    timezone: string;
    days?: number;
    windows: SlotWindow[];
}): {
    slotAt: Date;
    timezone: string;
    isExperimental: boolean;
}[];
export declare function pickNextUnscheduledSlot<T extends {
    slotAt: Date;
    draftId?: string | null;
}>(slots: T[], now?: Date): T | null;
