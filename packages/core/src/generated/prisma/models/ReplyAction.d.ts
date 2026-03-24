import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ReplyAction
 *
 */
export type ReplyActionModel = runtime.Types.Result.DefaultSelection<Prisma.$ReplyActionPayload>;
export type AggregateReplyAction = {
    _count: ReplyActionCountAggregateOutputType | null;
    _min: ReplyActionMinAggregateOutputType | null;
    _max: ReplyActionMaxAggregateOutputType | null;
};
export type ReplyActionMinAggregateOutputType = {
    id: string | null;
    mentionId: string | null;
    suggestionId: string | null;
    sentForMentionId: string | null;
    xReplyPostId: string | null;
    actionType: $Enums.ReplyActionType | null;
    actor: string | null;
    notes: string | null;
    createdAt: Date | null;
};
export type ReplyActionMaxAggregateOutputType = {
    id: string | null;
    mentionId: string | null;
    suggestionId: string | null;
    sentForMentionId: string | null;
    xReplyPostId: string | null;
    actionType: $Enums.ReplyActionType | null;
    actor: string | null;
    notes: string | null;
    createdAt: Date | null;
};
export type ReplyActionCountAggregateOutputType = {
    id: number;
    mentionId: number;
    suggestionId: number;
    sentForMentionId: number;
    xReplyPostId: number;
    actionType: number;
    actor: number;
    notes: number;
    createdAt: number;
    _all: number;
};
export type ReplyActionMinAggregateInputType = {
    id?: true;
    mentionId?: true;
    suggestionId?: true;
    sentForMentionId?: true;
    xReplyPostId?: true;
    actionType?: true;
    actor?: true;
    notes?: true;
    createdAt?: true;
};
export type ReplyActionMaxAggregateInputType = {
    id?: true;
    mentionId?: true;
    suggestionId?: true;
    sentForMentionId?: true;
    xReplyPostId?: true;
    actionType?: true;
    actor?: true;
    notes?: true;
    createdAt?: true;
};
export type ReplyActionCountAggregateInputType = {
    id?: true;
    mentionId?: true;
    suggestionId?: true;
    sentForMentionId?: true;
    xReplyPostId?: true;
    actionType?: true;
    actor?: true;
    notes?: true;
    createdAt?: true;
    _all?: true;
};
export type ReplyActionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ReplyAction to aggregate.
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReplyActions to fetch.
     */
    orderBy?: Prisma.ReplyActionOrderByWithRelationInput | Prisma.ReplyActionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ReplyActionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReplyActions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReplyActions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ReplyActions
    **/
    _count?: true | ReplyActionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ReplyActionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ReplyActionMaxAggregateInputType;
};
export type GetReplyActionAggregateType<T extends ReplyActionAggregateArgs> = {
    [P in keyof T & keyof AggregateReplyAction]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReplyAction[P]> : Prisma.GetScalarType<T[P], AggregateReplyAction[P]>;
};
export type ReplyActionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReplyActionWhereInput;
    orderBy?: Prisma.ReplyActionOrderByWithAggregationInput | Prisma.ReplyActionOrderByWithAggregationInput[];
    by: Prisma.ReplyActionScalarFieldEnum[] | Prisma.ReplyActionScalarFieldEnum;
    having?: Prisma.ReplyActionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReplyActionCountAggregateInputType | true;
    _min?: ReplyActionMinAggregateInputType;
    _max?: ReplyActionMaxAggregateInputType;
};
export type ReplyActionGroupByOutputType = {
    id: string;
    mentionId: string;
    suggestionId: string | null;
    sentForMentionId: string | null;
    xReplyPostId: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes: string | null;
    createdAt: Date;
    _count: ReplyActionCountAggregateOutputType | null;
    _min: ReplyActionMinAggregateOutputType | null;
    _max: ReplyActionMaxAggregateOutputType | null;
};
type GetReplyActionGroupByPayload<T extends ReplyActionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReplyActionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReplyActionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReplyActionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReplyActionGroupByOutputType[P]>;
}>>;
export type ReplyActionWhereInput = {
    AND?: Prisma.ReplyActionWhereInput | Prisma.ReplyActionWhereInput[];
    OR?: Prisma.ReplyActionWhereInput[];
    NOT?: Prisma.ReplyActionWhereInput | Prisma.ReplyActionWhereInput[];
    id?: Prisma.StringFilter<"ReplyAction"> | string;
    mentionId?: Prisma.StringFilter<"ReplyAction"> | string;
    suggestionId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    sentForMentionId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    xReplyPostId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    actionType?: Prisma.EnumReplyActionTypeFilter<"ReplyAction"> | $Enums.ReplyActionType;
    actor?: Prisma.StringFilter<"ReplyAction"> | string;
    notes?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ReplyAction"> | Date | string;
    mention?: Prisma.XOR<Prisma.MentionScalarRelationFilter, Prisma.MentionWhereInput>;
    suggestion?: Prisma.XOR<Prisma.ReplySuggestionNullableScalarRelationFilter, Prisma.ReplySuggestionWhereInput> | null;
};
export type ReplyActionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    mentionId?: Prisma.SortOrder;
    suggestionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentForMentionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    xReplyPostId?: Prisma.SortOrderInput | Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    mention?: Prisma.MentionOrderByWithRelationInput;
    suggestion?: Prisma.ReplySuggestionOrderByWithRelationInput;
};
export type ReplyActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sentForMentionId?: string;
    xReplyPostId?: string;
    AND?: Prisma.ReplyActionWhereInput | Prisma.ReplyActionWhereInput[];
    OR?: Prisma.ReplyActionWhereInput[];
    NOT?: Prisma.ReplyActionWhereInput | Prisma.ReplyActionWhereInput[];
    mentionId?: Prisma.StringFilter<"ReplyAction"> | string;
    suggestionId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    actionType?: Prisma.EnumReplyActionTypeFilter<"ReplyAction"> | $Enums.ReplyActionType;
    actor?: Prisma.StringFilter<"ReplyAction"> | string;
    notes?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ReplyAction"> | Date | string;
    mention?: Prisma.XOR<Prisma.MentionScalarRelationFilter, Prisma.MentionWhereInput>;
    suggestion?: Prisma.XOR<Prisma.ReplySuggestionNullableScalarRelationFilter, Prisma.ReplySuggestionWhereInput> | null;
}, "id" | "sentForMentionId" | "xReplyPostId">;
export type ReplyActionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    mentionId?: Prisma.SortOrder;
    suggestionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentForMentionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    xReplyPostId?: Prisma.SortOrderInput | Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ReplyActionCountOrderByAggregateInput;
    _max?: Prisma.ReplyActionMaxOrderByAggregateInput;
    _min?: Prisma.ReplyActionMinOrderByAggregateInput;
};
export type ReplyActionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReplyActionScalarWhereWithAggregatesInput | Prisma.ReplyActionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReplyActionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReplyActionScalarWhereWithAggregatesInput | Prisma.ReplyActionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ReplyAction"> | string;
    mentionId?: Prisma.StringWithAggregatesFilter<"ReplyAction"> | string;
    suggestionId?: Prisma.StringNullableWithAggregatesFilter<"ReplyAction"> | string | null;
    sentForMentionId?: Prisma.StringNullableWithAggregatesFilter<"ReplyAction"> | string | null;
    xReplyPostId?: Prisma.StringNullableWithAggregatesFilter<"ReplyAction"> | string | null;
    actionType?: Prisma.EnumReplyActionTypeWithAggregatesFilter<"ReplyAction"> | $Enums.ReplyActionType;
    actor?: Prisma.StringWithAggregatesFilter<"ReplyAction"> | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"ReplyAction"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ReplyAction"> | Date | string;
};
export type ReplyActionCreateInput = {
    id?: string;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
    mention: Prisma.MentionCreateNestedOneWithoutReplyActionsInput;
    suggestion?: Prisma.ReplySuggestionCreateNestedOneWithoutReplyActionsInput;
};
export type ReplyActionUncheckedCreateInput = {
    id?: string;
    mentionId: string;
    suggestionId?: string | null;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mention?: Prisma.MentionUpdateOneRequiredWithoutReplyActionsNestedInput;
    suggestion?: Prisma.ReplySuggestionUpdateOneWithoutReplyActionsNestedInput;
};
export type ReplyActionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionId?: Prisma.StringFieldUpdateOperationsInput | string;
    suggestionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionCreateManyInput = {
    id?: string;
    mentionId: string;
    suggestionId?: string | null;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionId?: Prisma.StringFieldUpdateOperationsInput | string;
    suggestionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionListRelationFilter = {
    every?: Prisma.ReplyActionWhereInput;
    some?: Prisma.ReplyActionWhereInput;
    none?: Prisma.ReplyActionWhereInput;
};
export type ReplyActionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReplyActionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    mentionId?: Prisma.SortOrder;
    suggestionId?: Prisma.SortOrder;
    sentForMentionId?: Prisma.SortOrder;
    xReplyPostId?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReplyActionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    mentionId?: Prisma.SortOrder;
    suggestionId?: Prisma.SortOrder;
    sentForMentionId?: Prisma.SortOrder;
    xReplyPostId?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReplyActionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    mentionId?: Prisma.SortOrder;
    suggestionId?: Prisma.SortOrder;
    sentForMentionId?: Prisma.SortOrder;
    xReplyPostId?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    actor?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReplyActionCreateNestedManyWithoutMentionInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput> | Prisma.ReplyActionCreateWithoutMentionInput[] | Prisma.ReplyActionUncheckedCreateWithoutMentionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutMentionInput | Prisma.ReplyActionCreateOrConnectWithoutMentionInput[];
    createMany?: Prisma.ReplyActionCreateManyMentionInputEnvelope;
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
};
export type ReplyActionUncheckedCreateNestedManyWithoutMentionInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput> | Prisma.ReplyActionCreateWithoutMentionInput[] | Prisma.ReplyActionUncheckedCreateWithoutMentionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutMentionInput | Prisma.ReplyActionCreateOrConnectWithoutMentionInput[];
    createMany?: Prisma.ReplyActionCreateManyMentionInputEnvelope;
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
};
export type ReplyActionUpdateManyWithoutMentionNestedInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput> | Prisma.ReplyActionCreateWithoutMentionInput[] | Prisma.ReplyActionUncheckedCreateWithoutMentionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutMentionInput | Prisma.ReplyActionCreateOrConnectWithoutMentionInput[];
    upsert?: Prisma.ReplyActionUpsertWithWhereUniqueWithoutMentionInput | Prisma.ReplyActionUpsertWithWhereUniqueWithoutMentionInput[];
    createMany?: Prisma.ReplyActionCreateManyMentionInputEnvelope;
    set?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    disconnect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    delete?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    update?: Prisma.ReplyActionUpdateWithWhereUniqueWithoutMentionInput | Prisma.ReplyActionUpdateWithWhereUniqueWithoutMentionInput[];
    updateMany?: Prisma.ReplyActionUpdateManyWithWhereWithoutMentionInput | Prisma.ReplyActionUpdateManyWithWhereWithoutMentionInput[];
    deleteMany?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
};
export type ReplyActionUncheckedUpdateManyWithoutMentionNestedInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput> | Prisma.ReplyActionCreateWithoutMentionInput[] | Prisma.ReplyActionUncheckedCreateWithoutMentionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutMentionInput | Prisma.ReplyActionCreateOrConnectWithoutMentionInput[];
    upsert?: Prisma.ReplyActionUpsertWithWhereUniqueWithoutMentionInput | Prisma.ReplyActionUpsertWithWhereUniqueWithoutMentionInput[];
    createMany?: Prisma.ReplyActionCreateManyMentionInputEnvelope;
    set?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    disconnect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    delete?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    update?: Prisma.ReplyActionUpdateWithWhereUniqueWithoutMentionInput | Prisma.ReplyActionUpdateWithWhereUniqueWithoutMentionInput[];
    updateMany?: Prisma.ReplyActionUpdateManyWithWhereWithoutMentionInput | Prisma.ReplyActionUpdateManyWithWhereWithoutMentionInput[];
    deleteMany?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
};
export type ReplyActionCreateNestedManyWithoutSuggestionInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput> | Prisma.ReplyActionCreateWithoutSuggestionInput[] | Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput | Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput[];
    createMany?: Prisma.ReplyActionCreateManySuggestionInputEnvelope;
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
};
export type ReplyActionUncheckedCreateNestedManyWithoutSuggestionInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput> | Prisma.ReplyActionCreateWithoutSuggestionInput[] | Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput | Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput[];
    createMany?: Prisma.ReplyActionCreateManySuggestionInputEnvelope;
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
};
export type ReplyActionUpdateManyWithoutSuggestionNestedInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput> | Prisma.ReplyActionCreateWithoutSuggestionInput[] | Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput | Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput[];
    upsert?: Prisma.ReplyActionUpsertWithWhereUniqueWithoutSuggestionInput | Prisma.ReplyActionUpsertWithWhereUniqueWithoutSuggestionInput[];
    createMany?: Prisma.ReplyActionCreateManySuggestionInputEnvelope;
    set?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    disconnect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    delete?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    update?: Prisma.ReplyActionUpdateWithWhereUniqueWithoutSuggestionInput | Prisma.ReplyActionUpdateWithWhereUniqueWithoutSuggestionInput[];
    updateMany?: Prisma.ReplyActionUpdateManyWithWhereWithoutSuggestionInput | Prisma.ReplyActionUpdateManyWithWhereWithoutSuggestionInput[];
    deleteMany?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
};
export type ReplyActionUncheckedUpdateManyWithoutSuggestionNestedInput = {
    create?: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput> | Prisma.ReplyActionCreateWithoutSuggestionInput[] | Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput[];
    connectOrCreate?: Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput | Prisma.ReplyActionCreateOrConnectWithoutSuggestionInput[];
    upsert?: Prisma.ReplyActionUpsertWithWhereUniqueWithoutSuggestionInput | Prisma.ReplyActionUpsertWithWhereUniqueWithoutSuggestionInput[];
    createMany?: Prisma.ReplyActionCreateManySuggestionInputEnvelope;
    set?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    disconnect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    delete?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    connect?: Prisma.ReplyActionWhereUniqueInput | Prisma.ReplyActionWhereUniqueInput[];
    update?: Prisma.ReplyActionUpdateWithWhereUniqueWithoutSuggestionInput | Prisma.ReplyActionUpdateWithWhereUniqueWithoutSuggestionInput[];
    updateMany?: Prisma.ReplyActionUpdateManyWithWhereWithoutSuggestionInput | Prisma.ReplyActionUpdateManyWithWhereWithoutSuggestionInput[];
    deleteMany?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
};
export type EnumReplyActionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReplyActionType;
};
export type ReplyActionCreateWithoutMentionInput = {
    id?: string;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
    suggestion?: Prisma.ReplySuggestionCreateNestedOneWithoutReplyActionsInput;
};
export type ReplyActionUncheckedCreateWithoutMentionInput = {
    id?: string;
    suggestionId?: string | null;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionCreateOrConnectWithoutMentionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput>;
};
export type ReplyActionCreateManyMentionInputEnvelope = {
    data: Prisma.ReplyActionCreateManyMentionInput | Prisma.ReplyActionCreateManyMentionInput[];
    skipDuplicates?: boolean;
};
export type ReplyActionUpsertWithWhereUniqueWithoutMentionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReplyActionUpdateWithoutMentionInput, Prisma.ReplyActionUncheckedUpdateWithoutMentionInput>;
    create: Prisma.XOR<Prisma.ReplyActionCreateWithoutMentionInput, Prisma.ReplyActionUncheckedCreateWithoutMentionInput>;
};
export type ReplyActionUpdateWithWhereUniqueWithoutMentionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReplyActionUpdateWithoutMentionInput, Prisma.ReplyActionUncheckedUpdateWithoutMentionInput>;
};
export type ReplyActionUpdateManyWithWhereWithoutMentionInput = {
    where: Prisma.ReplyActionScalarWhereInput;
    data: Prisma.XOR<Prisma.ReplyActionUpdateManyMutationInput, Prisma.ReplyActionUncheckedUpdateManyWithoutMentionInput>;
};
export type ReplyActionScalarWhereInput = {
    AND?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
    OR?: Prisma.ReplyActionScalarWhereInput[];
    NOT?: Prisma.ReplyActionScalarWhereInput | Prisma.ReplyActionScalarWhereInput[];
    id?: Prisma.StringFilter<"ReplyAction"> | string;
    mentionId?: Prisma.StringFilter<"ReplyAction"> | string;
    suggestionId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    sentForMentionId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    xReplyPostId?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    actionType?: Prisma.EnumReplyActionTypeFilter<"ReplyAction"> | $Enums.ReplyActionType;
    actor?: Prisma.StringFilter<"ReplyAction"> | string;
    notes?: Prisma.StringNullableFilter<"ReplyAction"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ReplyAction"> | Date | string;
};
export type ReplyActionCreateWithoutSuggestionInput = {
    id?: string;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
    mention: Prisma.MentionCreateNestedOneWithoutReplyActionsInput;
};
export type ReplyActionUncheckedCreateWithoutSuggestionInput = {
    id?: string;
    mentionId: string;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionCreateOrConnectWithoutSuggestionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput>;
};
export type ReplyActionCreateManySuggestionInputEnvelope = {
    data: Prisma.ReplyActionCreateManySuggestionInput | Prisma.ReplyActionCreateManySuggestionInput[];
    skipDuplicates?: boolean;
};
export type ReplyActionUpsertWithWhereUniqueWithoutSuggestionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReplyActionUpdateWithoutSuggestionInput, Prisma.ReplyActionUncheckedUpdateWithoutSuggestionInput>;
    create: Prisma.XOR<Prisma.ReplyActionCreateWithoutSuggestionInput, Prisma.ReplyActionUncheckedCreateWithoutSuggestionInput>;
};
export type ReplyActionUpdateWithWhereUniqueWithoutSuggestionInput = {
    where: Prisma.ReplyActionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReplyActionUpdateWithoutSuggestionInput, Prisma.ReplyActionUncheckedUpdateWithoutSuggestionInput>;
};
export type ReplyActionUpdateManyWithWhereWithoutSuggestionInput = {
    where: Prisma.ReplyActionScalarWhereInput;
    data: Prisma.XOR<Prisma.ReplyActionUpdateManyMutationInput, Prisma.ReplyActionUncheckedUpdateManyWithoutSuggestionInput>;
};
export type ReplyActionCreateManyMentionInput = {
    id?: string;
    suggestionId?: string | null;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionUpdateWithoutMentionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    suggestion?: Prisma.ReplySuggestionUpdateOneWithoutReplyActionsNestedInput;
};
export type ReplyActionUncheckedUpdateWithoutMentionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    suggestionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionUncheckedUpdateManyWithoutMentionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    suggestionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionCreateManySuggestionInput = {
    id?: string;
    mentionId: string;
    sentForMentionId?: string | null;
    xReplyPostId?: string | null;
    actionType: $Enums.ReplyActionType;
    actor: string;
    notes?: string | null;
    createdAt?: Date | string;
};
export type ReplyActionUpdateWithoutSuggestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mention?: Prisma.MentionUpdateOneRequiredWithoutReplyActionsNestedInput;
};
export type ReplyActionUncheckedUpdateWithoutSuggestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionId?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionUncheckedUpdateManyWithoutSuggestionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionId?: Prisma.StringFieldUpdateOperationsInput | string;
    sentForMentionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    xReplyPostId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumReplyActionTypeFieldUpdateOperationsInput | $Enums.ReplyActionType;
    actor?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReplyActionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    mentionId?: boolean;
    suggestionId?: boolean;
    sentForMentionId?: boolean;
    xReplyPostId?: boolean;
    actionType?: boolean;
    actor?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
}, ExtArgs["result"]["replyAction"]>;
export type ReplyActionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    mentionId?: boolean;
    suggestionId?: boolean;
    sentForMentionId?: boolean;
    xReplyPostId?: boolean;
    actionType?: boolean;
    actor?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
}, ExtArgs["result"]["replyAction"]>;
export type ReplyActionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    mentionId?: boolean;
    suggestionId?: boolean;
    sentForMentionId?: boolean;
    xReplyPostId?: boolean;
    actionType?: boolean;
    actor?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
}, ExtArgs["result"]["replyAction"]>;
export type ReplyActionSelectScalar = {
    id?: boolean;
    mentionId?: boolean;
    suggestionId?: boolean;
    sentForMentionId?: boolean;
    xReplyPostId?: boolean;
    actionType?: boolean;
    actor?: boolean;
    notes?: boolean;
    createdAt?: boolean;
};
export type ReplyActionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "mentionId" | "suggestionId" | "sentForMentionId" | "xReplyPostId" | "actionType" | "actor" | "notes" | "createdAt", ExtArgs["result"]["replyAction"]>;
export type ReplyActionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
};
export type ReplyActionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
};
export type ReplyActionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    mention?: boolean | Prisma.MentionDefaultArgs<ExtArgs>;
    suggestion?: boolean | Prisma.ReplyAction$suggestionArgs<ExtArgs>;
};
export type $ReplyActionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReplyAction";
    objects: {
        mention: Prisma.$MentionPayload<ExtArgs>;
        suggestion: Prisma.$ReplySuggestionPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        mentionId: string;
        suggestionId: string | null;
        sentForMentionId: string | null;
        xReplyPostId: string | null;
        actionType: $Enums.ReplyActionType;
        actor: string;
        notes: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["replyAction"]>;
    composites: {};
};
export type ReplyActionGetPayload<S extends boolean | null | undefined | ReplyActionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload, S>;
export type ReplyActionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReplyActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReplyActionCountAggregateInputType | true;
};
export interface ReplyActionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReplyAction'];
        meta: {
            name: 'ReplyAction';
        };
    };
    /**
     * Find zero or one ReplyAction that matches the filter.
     * @param {ReplyActionFindUniqueArgs} args - Arguments to find a ReplyAction
     * @example
     * // Get one ReplyAction
     * const replyAction = await prisma.replyAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReplyActionFindUniqueArgs>(args: Prisma.SelectSubset<T, ReplyActionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ReplyAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReplyActionFindUniqueOrThrowArgs} args - Arguments to find a ReplyAction
     * @example
     * // Get one ReplyAction
     * const replyAction = await prisma.replyAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReplyActionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReplyActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ReplyAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionFindFirstArgs} args - Arguments to find a ReplyAction
     * @example
     * // Get one ReplyAction
     * const replyAction = await prisma.replyAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReplyActionFindFirstArgs>(args?: Prisma.SelectSubset<T, ReplyActionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ReplyAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionFindFirstOrThrowArgs} args - Arguments to find a ReplyAction
     * @example
     * // Get one ReplyAction
     * const replyAction = await prisma.replyAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReplyActionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReplyActionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ReplyActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReplyActions
     * const replyActions = await prisma.replyAction.findMany()
     *
     * // Get first 10 ReplyActions
     * const replyActions = await prisma.replyAction.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const replyActionWithIdOnly = await prisma.replyAction.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ReplyActionFindManyArgs>(args?: Prisma.SelectSubset<T, ReplyActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ReplyAction.
     * @param {ReplyActionCreateArgs} args - Arguments to create a ReplyAction.
     * @example
     * // Create one ReplyAction
     * const ReplyAction = await prisma.replyAction.create({
     *   data: {
     *     // ... data to create a ReplyAction
     *   }
     * })
     *
     */
    create<T extends ReplyActionCreateArgs>(args: Prisma.SelectSubset<T, ReplyActionCreateArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ReplyActions.
     * @param {ReplyActionCreateManyArgs} args - Arguments to create many ReplyActions.
     * @example
     * // Create many ReplyActions
     * const replyAction = await prisma.replyAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ReplyActionCreateManyArgs>(args?: Prisma.SelectSubset<T, ReplyActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ReplyActions and returns the data saved in the database.
     * @param {ReplyActionCreateManyAndReturnArgs} args - Arguments to create many ReplyActions.
     * @example
     * // Create many ReplyActions
     * const replyAction = await prisma.replyAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ReplyActions and only return the `id`
     * const replyActionWithIdOnly = await prisma.replyAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ReplyActionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReplyActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ReplyAction.
     * @param {ReplyActionDeleteArgs} args - Arguments to delete one ReplyAction.
     * @example
     * // Delete one ReplyAction
     * const ReplyAction = await prisma.replyAction.delete({
     *   where: {
     *     // ... filter to delete one ReplyAction
     *   }
     * })
     *
     */
    delete<T extends ReplyActionDeleteArgs>(args: Prisma.SelectSubset<T, ReplyActionDeleteArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ReplyAction.
     * @param {ReplyActionUpdateArgs} args - Arguments to update one ReplyAction.
     * @example
     * // Update one ReplyAction
     * const replyAction = await prisma.replyAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ReplyActionUpdateArgs>(args: Prisma.SelectSubset<T, ReplyActionUpdateArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ReplyActions.
     * @param {ReplyActionDeleteManyArgs} args - Arguments to filter ReplyActions to delete.
     * @example
     * // Delete a few ReplyActions
     * const { count } = await prisma.replyAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ReplyActionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReplyActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ReplyActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReplyActions
     * const replyAction = await prisma.replyAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ReplyActionUpdateManyArgs>(args: Prisma.SelectSubset<T, ReplyActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ReplyActions and returns the data updated in the database.
     * @param {ReplyActionUpdateManyAndReturnArgs} args - Arguments to update many ReplyActions.
     * @example
     * // Update many ReplyActions
     * const replyAction = await prisma.replyAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ReplyActions and only return the `id`
     * const replyActionWithIdOnly = await prisma.replyAction.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReplyActionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReplyActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ReplyAction.
     * @param {ReplyActionUpsertArgs} args - Arguments to update or create a ReplyAction.
     * @example
     * // Update or create a ReplyAction
     * const replyAction = await prisma.replyAction.upsert({
     *   create: {
     *     // ... data to create a ReplyAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReplyAction we want to update
     *   }
     * })
     */
    upsert<T extends ReplyActionUpsertArgs>(args: Prisma.SelectSubset<T, ReplyActionUpsertArgs<ExtArgs>>): Prisma.Prisma__ReplyActionClient<runtime.Types.Result.GetResult<Prisma.$ReplyActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ReplyActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionCountArgs} args - Arguments to filter ReplyActions to count.
     * @example
     * // Count the number of ReplyActions
     * const count = await prisma.replyAction.count({
     *   where: {
     *     // ... the filter for the ReplyActions we want to count
     *   }
     * })
    **/
    count<T extends ReplyActionCountArgs>(args?: Prisma.Subset<T, ReplyActionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReplyActionCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ReplyAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReplyActionAggregateArgs>(args: Prisma.Subset<T, ReplyActionAggregateArgs>): Prisma.PrismaPromise<GetReplyActionAggregateType<T>>;
    /**
     * Group by ReplyAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReplyActionGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ReplyActionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReplyActionGroupByArgs['orderBy'];
    } : {
        orderBy?: ReplyActionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReplyActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReplyActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ReplyAction model
     */
    readonly fields: ReplyActionFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ReplyAction.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ReplyActionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    mention<T extends Prisma.MentionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MentionDefaultArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    suggestion<T extends Prisma.ReplyAction$suggestionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ReplyAction$suggestionArgs<ExtArgs>>): Prisma.Prisma__ReplySuggestionClient<runtime.Types.Result.GetResult<Prisma.$ReplySuggestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ReplyAction model
 */
export interface ReplyActionFieldRefs {
    readonly id: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly mentionId: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly suggestionId: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly sentForMentionId: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly xReplyPostId: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly actionType: Prisma.FieldRef<"ReplyAction", 'ReplyActionType'>;
    readonly actor: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly notes: Prisma.FieldRef<"ReplyAction", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ReplyAction", 'DateTime'>;
}
/**
 * ReplyAction findUnique
 */
export type ReplyActionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter, which ReplyAction to fetch.
     */
    where: Prisma.ReplyActionWhereUniqueInput;
};
/**
 * ReplyAction findUniqueOrThrow
 */
export type ReplyActionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter, which ReplyAction to fetch.
     */
    where: Prisma.ReplyActionWhereUniqueInput;
};
/**
 * ReplyAction findFirst
 */
export type ReplyActionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter, which ReplyAction to fetch.
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReplyActions to fetch.
     */
    orderBy?: Prisma.ReplyActionOrderByWithRelationInput | Prisma.ReplyActionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReplyActions.
     */
    cursor?: Prisma.ReplyActionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReplyActions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReplyActions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReplyActions.
     */
    distinct?: Prisma.ReplyActionScalarFieldEnum | Prisma.ReplyActionScalarFieldEnum[];
};
/**
 * ReplyAction findFirstOrThrow
 */
export type ReplyActionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter, which ReplyAction to fetch.
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReplyActions to fetch.
     */
    orderBy?: Prisma.ReplyActionOrderByWithRelationInput | Prisma.ReplyActionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReplyActions.
     */
    cursor?: Prisma.ReplyActionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReplyActions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReplyActions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReplyActions.
     */
    distinct?: Prisma.ReplyActionScalarFieldEnum | Prisma.ReplyActionScalarFieldEnum[];
};
/**
 * ReplyAction findMany
 */
export type ReplyActionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter, which ReplyActions to fetch.
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReplyActions to fetch.
     */
    orderBy?: Prisma.ReplyActionOrderByWithRelationInput | Prisma.ReplyActionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ReplyActions.
     */
    cursor?: Prisma.ReplyActionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReplyActions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReplyActions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReplyActions.
     */
    distinct?: Prisma.ReplyActionScalarFieldEnum | Prisma.ReplyActionScalarFieldEnum[];
};
/**
 * ReplyAction create
 */
export type ReplyActionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * The data needed to create a ReplyAction.
     */
    data: Prisma.XOR<Prisma.ReplyActionCreateInput, Prisma.ReplyActionUncheckedCreateInput>;
};
/**
 * ReplyAction createMany
 */
export type ReplyActionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReplyActions.
     */
    data: Prisma.ReplyActionCreateManyInput | Prisma.ReplyActionCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ReplyAction createManyAndReturn
 */
export type ReplyActionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * The data used to create many ReplyActions.
     */
    data: Prisma.ReplyActionCreateManyInput | Prisma.ReplyActionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ReplyAction update
 */
export type ReplyActionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * The data needed to update a ReplyAction.
     */
    data: Prisma.XOR<Prisma.ReplyActionUpdateInput, Prisma.ReplyActionUncheckedUpdateInput>;
    /**
     * Choose, which ReplyAction to update.
     */
    where: Prisma.ReplyActionWhereUniqueInput;
};
/**
 * ReplyAction updateMany
 */
export type ReplyActionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ReplyActions.
     */
    data: Prisma.XOR<Prisma.ReplyActionUpdateManyMutationInput, Prisma.ReplyActionUncheckedUpdateManyInput>;
    /**
     * Filter which ReplyActions to update
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * Limit how many ReplyActions to update.
     */
    limit?: number;
};
/**
 * ReplyAction updateManyAndReturn
 */
export type ReplyActionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * The data used to update ReplyActions.
     */
    data: Prisma.XOR<Prisma.ReplyActionUpdateManyMutationInput, Prisma.ReplyActionUncheckedUpdateManyInput>;
    /**
     * Filter which ReplyActions to update
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * Limit how many ReplyActions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ReplyAction upsert
 */
export type ReplyActionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * The filter to search for the ReplyAction to update in case it exists.
     */
    where: Prisma.ReplyActionWhereUniqueInput;
    /**
     * In case the ReplyAction found by the `where` argument doesn't exist, create a new ReplyAction with this data.
     */
    create: Prisma.XOR<Prisma.ReplyActionCreateInput, Prisma.ReplyActionUncheckedCreateInput>;
    /**
     * In case the ReplyAction was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ReplyActionUpdateInput, Prisma.ReplyActionUncheckedUpdateInput>;
};
/**
 * ReplyAction delete
 */
export type ReplyActionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
    /**
     * Filter which ReplyAction to delete.
     */
    where: Prisma.ReplyActionWhereUniqueInput;
};
/**
 * ReplyAction deleteMany
 */
export type ReplyActionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ReplyActions to delete
     */
    where?: Prisma.ReplyActionWhereInput;
    /**
     * Limit how many ReplyActions to delete.
     */
    limit?: number;
};
/**
 * ReplyAction.suggestion
 */
export type ReplyAction$suggestionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplySuggestion
     */
    select?: Prisma.ReplySuggestionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplySuggestion
     */
    omit?: Prisma.ReplySuggestionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplySuggestionInclude<ExtArgs> | null;
    where?: Prisma.ReplySuggestionWhereInput;
};
/**
 * ReplyAction without action
 */
export type ReplyActionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReplyAction
     */
    select?: Prisma.ReplyActionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReplyAction
     */
    omit?: Prisma.ReplyActionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReplyActionInclude<ExtArgs> | null;
};
export {};
