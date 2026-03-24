import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ModerationEvent
 *
 */
export type ModerationEventModel = runtime.Types.Result.DefaultSelection<Prisma.$ModerationEventPayload>;
export type AggregateModerationEvent = {
    _count: ModerationEventCountAggregateOutputType | null;
    _min: ModerationEventMinAggregateOutputType | null;
    _max: ModerationEventMaxAggregateOutputType | null;
};
export type ModerationEventMinAggregateOutputType = {
    id: string | null;
    targetType: string | null;
    targetId: string | null;
    decision: $Enums.ModerationDecision | null;
    riskLevel: string | null;
    createdAt: Date | null;
};
export type ModerationEventMaxAggregateOutputType = {
    id: string | null;
    targetType: string | null;
    targetId: string | null;
    decision: $Enums.ModerationDecision | null;
    riskLevel: string | null;
    createdAt: Date | null;
};
export type ModerationEventCountAggregateOutputType = {
    id: number;
    targetType: number;
    targetId: number;
    decision: number;
    riskLevel: number;
    reasons: number;
    metadata: number;
    createdAt: number;
    _all: number;
};
export type ModerationEventMinAggregateInputType = {
    id?: true;
    targetType?: true;
    targetId?: true;
    decision?: true;
    riskLevel?: true;
    createdAt?: true;
};
export type ModerationEventMaxAggregateInputType = {
    id?: true;
    targetType?: true;
    targetId?: true;
    decision?: true;
    riskLevel?: true;
    createdAt?: true;
};
export type ModerationEventCountAggregateInputType = {
    id?: true;
    targetType?: true;
    targetId?: true;
    decision?: true;
    riskLevel?: true;
    reasons?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
};
export type ModerationEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ModerationEvent to aggregate.
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ModerationEvents to fetch.
     */
    orderBy?: Prisma.ModerationEventOrderByWithRelationInput | Prisma.ModerationEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ModerationEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ModerationEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ModerationEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ModerationEvents
    **/
    _count?: true | ModerationEventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ModerationEventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ModerationEventMaxAggregateInputType;
};
export type GetModerationEventAggregateType<T extends ModerationEventAggregateArgs> = {
    [P in keyof T & keyof AggregateModerationEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateModerationEvent[P]> : Prisma.GetScalarType<T[P], AggregateModerationEvent[P]>;
};
export type ModerationEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModerationEventWhereInput;
    orderBy?: Prisma.ModerationEventOrderByWithAggregationInput | Prisma.ModerationEventOrderByWithAggregationInput[];
    by: Prisma.ModerationEventScalarFieldEnum[] | Prisma.ModerationEventScalarFieldEnum;
    having?: Prisma.ModerationEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ModerationEventCountAggregateInputType | true;
    _min?: ModerationEventMinAggregateInputType;
    _max?: ModerationEventMaxAggregateInputType;
};
export type ModerationEventGroupByOutputType = {
    id: string;
    targetType: string;
    targetId: string;
    decision: $Enums.ModerationDecision;
    riskLevel: string;
    reasons: string[];
    metadata: runtime.JsonValue;
    createdAt: Date;
    _count: ModerationEventCountAggregateOutputType | null;
    _min: ModerationEventMinAggregateOutputType | null;
    _max: ModerationEventMaxAggregateOutputType | null;
};
type GetModerationEventGroupByPayload<T extends ModerationEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ModerationEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ModerationEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ModerationEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ModerationEventGroupByOutputType[P]>;
}>>;
export type ModerationEventWhereInput = {
    AND?: Prisma.ModerationEventWhereInput | Prisma.ModerationEventWhereInput[];
    OR?: Prisma.ModerationEventWhereInput[];
    NOT?: Prisma.ModerationEventWhereInput | Prisma.ModerationEventWhereInput[];
    id?: Prisma.StringFilter<"ModerationEvent"> | string;
    targetType?: Prisma.StringFilter<"ModerationEvent"> | string;
    targetId?: Prisma.StringFilter<"ModerationEvent"> | string;
    decision?: Prisma.EnumModerationDecisionFilter<"ModerationEvent"> | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFilter<"ModerationEvent"> | string;
    reasons?: Prisma.StringNullableListFilter<"ModerationEvent">;
    metadata?: Prisma.JsonFilter<"ModerationEvent">;
    createdAt?: Prisma.DateTimeFilter<"ModerationEvent"> | Date | string;
};
export type ModerationEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    reasons?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ModerationEventWhereInput | Prisma.ModerationEventWhereInput[];
    OR?: Prisma.ModerationEventWhereInput[];
    NOT?: Prisma.ModerationEventWhereInput | Prisma.ModerationEventWhereInput[];
    targetType?: Prisma.StringFilter<"ModerationEvent"> | string;
    targetId?: Prisma.StringFilter<"ModerationEvent"> | string;
    decision?: Prisma.EnumModerationDecisionFilter<"ModerationEvent"> | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFilter<"ModerationEvent"> | string;
    reasons?: Prisma.StringNullableListFilter<"ModerationEvent">;
    metadata?: Prisma.JsonFilter<"ModerationEvent">;
    createdAt?: Prisma.DateTimeFilter<"ModerationEvent"> | Date | string;
}, "id">;
export type ModerationEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    reasons?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ModerationEventCountOrderByAggregateInput;
    _max?: Prisma.ModerationEventMaxOrderByAggregateInput;
    _min?: Prisma.ModerationEventMinOrderByAggregateInput;
};
export type ModerationEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.ModerationEventScalarWhereWithAggregatesInput | Prisma.ModerationEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.ModerationEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ModerationEventScalarWhereWithAggregatesInput | Prisma.ModerationEventScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ModerationEvent"> | string;
    targetType?: Prisma.StringWithAggregatesFilter<"ModerationEvent"> | string;
    targetId?: Prisma.StringWithAggregatesFilter<"ModerationEvent"> | string;
    decision?: Prisma.EnumModerationDecisionWithAggregatesFilter<"ModerationEvent"> | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringWithAggregatesFilter<"ModerationEvent"> | string;
    reasons?: Prisma.StringNullableListFilter<"ModerationEvent">;
    metadata?: Prisma.JsonWithAggregatesFilter<"ModerationEvent">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ModerationEvent"> | Date | string;
};
export type ModerationEventCreateInput = {
    id?: string;
    targetType: string;
    targetId: string;
    decision: $Enums.ModerationDecision;
    riskLevel: string;
    reasons?: Prisma.ModerationEventCreatereasonsInput | string[];
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ModerationEventUncheckedCreateInput = {
    id?: string;
    targetType: string;
    targetId: string;
    decision: $Enums.ModerationDecision;
    riskLevel: string;
    reasons?: Prisma.ModerationEventCreatereasonsInput | string[];
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ModerationEventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.StringFieldUpdateOperationsInput | string;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumModerationDecisionFieldUpdateOperationsInput | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    reasons?: Prisma.ModerationEventUpdatereasonsInput | string[];
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationEventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.StringFieldUpdateOperationsInput | string;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumModerationDecisionFieldUpdateOperationsInput | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    reasons?: Prisma.ModerationEventUpdatereasonsInput | string[];
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationEventCreateManyInput = {
    id?: string;
    targetType: string;
    targetId: string;
    decision: $Enums.ModerationDecision;
    riskLevel: string;
    reasons?: Prisma.ModerationEventCreatereasonsInput | string[];
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ModerationEventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.StringFieldUpdateOperationsInput | string;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumModerationDecisionFieldUpdateOperationsInput | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    reasons?: Prisma.ModerationEventUpdatereasonsInput | string[];
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationEventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.StringFieldUpdateOperationsInput | string;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    decision?: Prisma.EnumModerationDecisionFieldUpdateOperationsInput | $Enums.ModerationDecision;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    reasons?: Prisma.ModerationEventUpdatereasonsInput | string[];
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModerationEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    reasons?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    decision?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ModerationEventCreatereasonsInput = {
    set: string[];
};
export type EnumModerationDecisionFieldUpdateOperationsInput = {
    set?: $Enums.ModerationDecision;
};
export type ModerationEventUpdatereasonsInput = {
    set?: string[];
    push?: string | string[];
};
export type ModerationEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    decision?: boolean;
    riskLevel?: boolean;
    reasons?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["moderationEvent"]>;
export type ModerationEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    decision?: boolean;
    riskLevel?: boolean;
    reasons?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["moderationEvent"]>;
export type ModerationEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    decision?: boolean;
    riskLevel?: boolean;
    reasons?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["moderationEvent"]>;
export type ModerationEventSelectScalar = {
    id?: boolean;
    targetType?: boolean;
    targetId?: boolean;
    decision?: boolean;
    riskLevel?: boolean;
    reasons?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
};
export type ModerationEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "targetType" | "targetId" | "decision" | "riskLevel" | "reasons" | "metadata" | "createdAt", ExtArgs["result"]["moderationEvent"]>;
export type $ModerationEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ModerationEvent";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        targetType: string;
        targetId: string;
        decision: $Enums.ModerationDecision;
        riskLevel: string;
        reasons: string[];
        metadata: runtime.JsonValue;
        createdAt: Date;
    }, ExtArgs["result"]["moderationEvent"]>;
    composites: {};
};
export type ModerationEventGetPayload<S extends boolean | null | undefined | ModerationEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload, S>;
export type ModerationEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ModerationEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModerationEventCountAggregateInputType | true;
};
export interface ModerationEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ModerationEvent'];
        meta: {
            name: 'ModerationEvent';
        };
    };
    /**
     * Find zero or one ModerationEvent that matches the filter.
     * @param {ModerationEventFindUniqueArgs} args - Arguments to find a ModerationEvent
     * @example
     * // Get one ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModerationEventFindUniqueArgs>(args: Prisma.SelectSubset<T, ModerationEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ModerationEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModerationEventFindUniqueOrThrowArgs} args - Arguments to find a ModerationEvent
     * @example
     * // Get one ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModerationEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModerationEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ModerationEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventFindFirstArgs} args - Arguments to find a ModerationEvent
     * @example
     * // Get one ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModerationEventFindFirstArgs>(args?: Prisma.SelectSubset<T, ModerationEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ModerationEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventFindFirstOrThrowArgs} args - Arguments to find a ModerationEvent
     * @example
     * // Get one ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModerationEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModerationEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ModerationEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ModerationEvents
     * const moderationEvents = await prisma.moderationEvent.findMany()
     *
     * // Get first 10 ModerationEvents
     * const moderationEvents = await prisma.moderationEvent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const moderationEventWithIdOnly = await prisma.moderationEvent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ModerationEventFindManyArgs>(args?: Prisma.SelectSubset<T, ModerationEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ModerationEvent.
     * @param {ModerationEventCreateArgs} args - Arguments to create a ModerationEvent.
     * @example
     * // Create one ModerationEvent
     * const ModerationEvent = await prisma.moderationEvent.create({
     *   data: {
     *     // ... data to create a ModerationEvent
     *   }
     * })
     *
     */
    create<T extends ModerationEventCreateArgs>(args: Prisma.SelectSubset<T, ModerationEventCreateArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ModerationEvents.
     * @param {ModerationEventCreateManyArgs} args - Arguments to create many ModerationEvents.
     * @example
     * // Create many ModerationEvents
     * const moderationEvent = await prisma.moderationEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ModerationEventCreateManyArgs>(args?: Prisma.SelectSubset<T, ModerationEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ModerationEvents and returns the data saved in the database.
     * @param {ModerationEventCreateManyAndReturnArgs} args - Arguments to create many ModerationEvents.
     * @example
     * // Create many ModerationEvents
     * const moderationEvent = await prisma.moderationEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ModerationEvents and only return the `id`
     * const moderationEventWithIdOnly = await prisma.moderationEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ModerationEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ModerationEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ModerationEvent.
     * @param {ModerationEventDeleteArgs} args - Arguments to delete one ModerationEvent.
     * @example
     * // Delete one ModerationEvent
     * const ModerationEvent = await prisma.moderationEvent.delete({
     *   where: {
     *     // ... filter to delete one ModerationEvent
     *   }
     * })
     *
     */
    delete<T extends ModerationEventDeleteArgs>(args: Prisma.SelectSubset<T, ModerationEventDeleteArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ModerationEvent.
     * @param {ModerationEventUpdateArgs} args - Arguments to update one ModerationEvent.
     * @example
     * // Update one ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ModerationEventUpdateArgs>(args: Prisma.SelectSubset<T, ModerationEventUpdateArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ModerationEvents.
     * @param {ModerationEventDeleteManyArgs} args - Arguments to filter ModerationEvents to delete.
     * @example
     * // Delete a few ModerationEvents
     * const { count } = await prisma.moderationEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ModerationEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModerationEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ModerationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ModerationEvents
     * const moderationEvent = await prisma.moderationEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ModerationEventUpdateManyArgs>(args: Prisma.SelectSubset<T, ModerationEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ModerationEvents and returns the data updated in the database.
     * @param {ModerationEventUpdateManyAndReturnArgs} args - Arguments to update many ModerationEvents.
     * @example
     * // Update many ModerationEvents
     * const moderationEvent = await prisma.moderationEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ModerationEvents and only return the `id`
     * const moderationEventWithIdOnly = await prisma.moderationEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ModerationEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ModerationEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ModerationEvent.
     * @param {ModerationEventUpsertArgs} args - Arguments to update or create a ModerationEvent.
     * @example
     * // Update or create a ModerationEvent
     * const moderationEvent = await prisma.moderationEvent.upsert({
     *   create: {
     *     // ... data to create a ModerationEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ModerationEvent we want to update
     *   }
     * })
     */
    upsert<T extends ModerationEventUpsertArgs>(args: Prisma.SelectSubset<T, ModerationEventUpsertArgs<ExtArgs>>): Prisma.Prisma__ModerationEventClient<runtime.Types.Result.GetResult<Prisma.$ModerationEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ModerationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventCountArgs} args - Arguments to filter ModerationEvents to count.
     * @example
     * // Count the number of ModerationEvents
     * const count = await prisma.moderationEvent.count({
     *   where: {
     *     // ... the filter for the ModerationEvents we want to count
     *   }
     * })
    **/
    count<T extends ModerationEventCountArgs>(args?: Prisma.Subset<T, ModerationEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ModerationEventCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ModerationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ModerationEventAggregateArgs>(args: Prisma.Subset<T, ModerationEventAggregateArgs>): Prisma.PrismaPromise<GetModerationEventAggregateType<T>>;
    /**
     * Group by ModerationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModerationEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends ModerationEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ModerationEventGroupByArgs['orderBy'];
    } : {
        orderBy?: ModerationEventGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ModerationEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModerationEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ModerationEvent model
     */
    readonly fields: ModerationEventFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ModerationEvent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ModerationEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the ModerationEvent model
 */
export interface ModerationEventFieldRefs {
    readonly id: Prisma.FieldRef<"ModerationEvent", 'String'>;
    readonly targetType: Prisma.FieldRef<"ModerationEvent", 'String'>;
    readonly targetId: Prisma.FieldRef<"ModerationEvent", 'String'>;
    readonly decision: Prisma.FieldRef<"ModerationEvent", 'ModerationDecision'>;
    readonly riskLevel: Prisma.FieldRef<"ModerationEvent", 'String'>;
    readonly reasons: Prisma.FieldRef<"ModerationEvent", 'String[]'>;
    readonly metadata: Prisma.FieldRef<"ModerationEvent", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"ModerationEvent", 'DateTime'>;
}
/**
 * ModerationEvent findUnique
 */
export type ModerationEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter, which ModerationEvent to fetch.
     */
    where: Prisma.ModerationEventWhereUniqueInput;
};
/**
 * ModerationEvent findUniqueOrThrow
 */
export type ModerationEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter, which ModerationEvent to fetch.
     */
    where: Prisma.ModerationEventWhereUniqueInput;
};
/**
 * ModerationEvent findFirst
 */
export type ModerationEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter, which ModerationEvent to fetch.
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ModerationEvents to fetch.
     */
    orderBy?: Prisma.ModerationEventOrderByWithRelationInput | Prisma.ModerationEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ModerationEvents.
     */
    cursor?: Prisma.ModerationEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ModerationEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ModerationEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ModerationEvents.
     */
    distinct?: Prisma.ModerationEventScalarFieldEnum | Prisma.ModerationEventScalarFieldEnum[];
};
/**
 * ModerationEvent findFirstOrThrow
 */
export type ModerationEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter, which ModerationEvent to fetch.
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ModerationEvents to fetch.
     */
    orderBy?: Prisma.ModerationEventOrderByWithRelationInput | Prisma.ModerationEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ModerationEvents.
     */
    cursor?: Prisma.ModerationEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ModerationEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ModerationEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ModerationEvents.
     */
    distinct?: Prisma.ModerationEventScalarFieldEnum | Prisma.ModerationEventScalarFieldEnum[];
};
/**
 * ModerationEvent findMany
 */
export type ModerationEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter, which ModerationEvents to fetch.
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ModerationEvents to fetch.
     */
    orderBy?: Prisma.ModerationEventOrderByWithRelationInput | Prisma.ModerationEventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ModerationEvents.
     */
    cursor?: Prisma.ModerationEventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ModerationEvents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ModerationEvents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ModerationEvents.
     */
    distinct?: Prisma.ModerationEventScalarFieldEnum | Prisma.ModerationEventScalarFieldEnum[];
};
/**
 * ModerationEvent create
 */
export type ModerationEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * The data needed to create a ModerationEvent.
     */
    data: Prisma.XOR<Prisma.ModerationEventCreateInput, Prisma.ModerationEventUncheckedCreateInput>;
};
/**
 * ModerationEvent createMany
 */
export type ModerationEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ModerationEvents.
     */
    data: Prisma.ModerationEventCreateManyInput | Prisma.ModerationEventCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ModerationEvent createManyAndReturn
 */
export type ModerationEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * The data used to create many ModerationEvents.
     */
    data: Prisma.ModerationEventCreateManyInput | Prisma.ModerationEventCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ModerationEvent update
 */
export type ModerationEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * The data needed to update a ModerationEvent.
     */
    data: Prisma.XOR<Prisma.ModerationEventUpdateInput, Prisma.ModerationEventUncheckedUpdateInput>;
    /**
     * Choose, which ModerationEvent to update.
     */
    where: Prisma.ModerationEventWhereUniqueInput;
};
/**
 * ModerationEvent updateMany
 */
export type ModerationEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ModerationEvents.
     */
    data: Prisma.XOR<Prisma.ModerationEventUpdateManyMutationInput, Prisma.ModerationEventUncheckedUpdateManyInput>;
    /**
     * Filter which ModerationEvents to update
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * Limit how many ModerationEvents to update.
     */
    limit?: number;
};
/**
 * ModerationEvent updateManyAndReturn
 */
export type ModerationEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * The data used to update ModerationEvents.
     */
    data: Prisma.XOR<Prisma.ModerationEventUpdateManyMutationInput, Prisma.ModerationEventUncheckedUpdateManyInput>;
    /**
     * Filter which ModerationEvents to update
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * Limit how many ModerationEvents to update.
     */
    limit?: number;
};
/**
 * ModerationEvent upsert
 */
export type ModerationEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * The filter to search for the ModerationEvent to update in case it exists.
     */
    where: Prisma.ModerationEventWhereUniqueInput;
    /**
     * In case the ModerationEvent found by the `where` argument doesn't exist, create a new ModerationEvent with this data.
     */
    create: Prisma.XOR<Prisma.ModerationEventCreateInput, Prisma.ModerationEventUncheckedCreateInput>;
    /**
     * In case the ModerationEvent was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ModerationEventUpdateInput, Prisma.ModerationEventUncheckedUpdateInput>;
};
/**
 * ModerationEvent delete
 */
export type ModerationEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
    /**
     * Filter which ModerationEvent to delete.
     */
    where: Prisma.ModerationEventWhereUniqueInput;
};
/**
 * ModerationEvent deleteMany
 */
export type ModerationEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ModerationEvents to delete
     */
    where?: Prisma.ModerationEventWhereInput;
    /**
     * Limit how many ModerationEvents to delete.
     */
    limit?: number;
};
/**
 * ModerationEvent without action
 */
export type ModerationEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModerationEvent
     */
    select?: Prisma.ModerationEventSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ModerationEvent
     */
    omit?: Prisma.ModerationEventOmit<ExtArgs> | null;
};
export {};
