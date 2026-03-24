import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ResearchSnapshot
 *
 */
export type ResearchSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$ResearchSnapshotPayload>;
export type AggregateResearchSnapshot = {
    _count: ResearchSnapshotCountAggregateOutputType | null;
    _min: ResearchSnapshotMinAggregateOutputType | null;
    _max: ResearchSnapshotMaxAggregateOutputType | null;
};
export type ResearchSnapshotMinAggregateOutputType = {
    id: string | null;
    sourceItemId: string | null;
    title: string | null;
    rawText: string | null;
    summary: string | null;
    sourcePublishedAt: Date | null;
    createdAt: Date | null;
};
export type ResearchSnapshotMaxAggregateOutputType = {
    id: string | null;
    sourceItemId: string | null;
    title: string | null;
    rawText: string | null;
    summary: string | null;
    sourcePublishedAt: Date | null;
    createdAt: Date | null;
};
export type ResearchSnapshotCountAggregateOutputType = {
    id: number;
    sourceItemId: number;
    title: number;
    rawText: number;
    summary: number;
    keyFacts: number;
    quoteCandidates: number;
    hookIdeas: number;
    pillarCandidates: number;
    safetyFlags: number;
    sourcePublishedAt: number;
    metadata: number;
    createdAt: number;
    _all: number;
};
export type ResearchSnapshotMinAggregateInputType = {
    id?: true;
    sourceItemId?: true;
    title?: true;
    rawText?: true;
    summary?: true;
    sourcePublishedAt?: true;
    createdAt?: true;
};
export type ResearchSnapshotMaxAggregateInputType = {
    id?: true;
    sourceItemId?: true;
    title?: true;
    rawText?: true;
    summary?: true;
    sourcePublishedAt?: true;
    createdAt?: true;
};
export type ResearchSnapshotCountAggregateInputType = {
    id?: true;
    sourceItemId?: true;
    title?: true;
    rawText?: true;
    summary?: true;
    keyFacts?: true;
    quoteCandidates?: true;
    hookIdeas?: true;
    pillarCandidates?: true;
    safetyFlags?: true;
    sourcePublishedAt?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
};
export type ResearchSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ResearchSnapshot to aggregate.
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ResearchSnapshots to fetch.
     */
    orderBy?: Prisma.ResearchSnapshotOrderByWithRelationInput | Prisma.ResearchSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ResearchSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ResearchSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ResearchSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ResearchSnapshots
    **/
    _count?: true | ResearchSnapshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ResearchSnapshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ResearchSnapshotMaxAggregateInputType;
};
export type GetResearchSnapshotAggregateType<T extends ResearchSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateResearchSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateResearchSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateResearchSnapshot[P]>;
};
export type ResearchSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ResearchSnapshotWhereInput;
    orderBy?: Prisma.ResearchSnapshotOrderByWithAggregationInput | Prisma.ResearchSnapshotOrderByWithAggregationInput[];
    by: Prisma.ResearchSnapshotScalarFieldEnum[] | Prisma.ResearchSnapshotScalarFieldEnum;
    having?: Prisma.ResearchSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ResearchSnapshotCountAggregateInputType | true;
    _min?: ResearchSnapshotMinAggregateInputType;
    _max?: ResearchSnapshotMaxAggregateInputType;
};
export type ResearchSnapshotGroupByOutputType = {
    id: string;
    sourceItemId: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts: string[];
    quoteCandidates: string[];
    hookIdeas: string[];
    pillarCandidates: string[];
    safetyFlags: string[];
    sourcePublishedAt: Date | null;
    metadata: runtime.JsonValue;
    createdAt: Date;
    _count: ResearchSnapshotCountAggregateOutputType | null;
    _min: ResearchSnapshotMinAggregateOutputType | null;
    _max: ResearchSnapshotMaxAggregateOutputType | null;
};
type GetResearchSnapshotGroupByPayload<T extends ResearchSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ResearchSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ResearchSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ResearchSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ResearchSnapshotGroupByOutputType[P]>;
}>>;
export type ResearchSnapshotWhereInput = {
    AND?: Prisma.ResearchSnapshotWhereInput | Prisma.ResearchSnapshotWhereInput[];
    OR?: Prisma.ResearchSnapshotWhereInput[];
    NOT?: Prisma.ResearchSnapshotWhereInput | Prisma.ResearchSnapshotWhereInput[];
    id?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    sourceItemId?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    title?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    rawText?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    summary?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    keyFacts?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    quoteCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    hookIdeas?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    pillarCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    safetyFlags?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    sourcePublishedAt?: Prisma.DateTimeNullableFilter<"ResearchSnapshot"> | Date | string | null;
    metadata?: Prisma.JsonFilter<"ResearchSnapshot">;
    createdAt?: Prisma.DateTimeFilter<"ResearchSnapshot"> | Date | string;
    sourceItem?: Prisma.XOR<Prisma.SourceItemScalarRelationFilter, Prisma.SourceItemWhereInput>;
    contentIdeas?: Prisma.ContentIdeaListRelationFilter;
};
export type ResearchSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceItemId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    rawText?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    keyFacts?: Prisma.SortOrder;
    quoteCandidates?: Prisma.SortOrder;
    hookIdeas?: Prisma.SortOrder;
    pillarCandidates?: Prisma.SortOrder;
    safetyFlags?: Prisma.SortOrder;
    sourcePublishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    sourceItem?: Prisma.SourceItemOrderByWithRelationInput;
    contentIdeas?: Prisma.ContentIdeaOrderByRelationAggregateInput;
};
export type ResearchSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ResearchSnapshotWhereInput | Prisma.ResearchSnapshotWhereInput[];
    OR?: Prisma.ResearchSnapshotWhereInput[];
    NOT?: Prisma.ResearchSnapshotWhereInput | Prisma.ResearchSnapshotWhereInput[];
    sourceItemId?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    title?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    rawText?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    summary?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    keyFacts?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    quoteCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    hookIdeas?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    pillarCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    safetyFlags?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    sourcePublishedAt?: Prisma.DateTimeNullableFilter<"ResearchSnapshot"> | Date | string | null;
    metadata?: Prisma.JsonFilter<"ResearchSnapshot">;
    createdAt?: Prisma.DateTimeFilter<"ResearchSnapshot"> | Date | string;
    sourceItem?: Prisma.XOR<Prisma.SourceItemScalarRelationFilter, Prisma.SourceItemWhereInput>;
    contentIdeas?: Prisma.ContentIdeaListRelationFilter;
}, "id">;
export type ResearchSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceItemId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    rawText?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    keyFacts?: Prisma.SortOrder;
    quoteCandidates?: Prisma.SortOrder;
    hookIdeas?: Prisma.SortOrder;
    pillarCandidates?: Prisma.SortOrder;
    safetyFlags?: Prisma.SortOrder;
    sourcePublishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ResearchSnapshotCountOrderByAggregateInput;
    _max?: Prisma.ResearchSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.ResearchSnapshotMinOrderByAggregateInput;
};
export type ResearchSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.ResearchSnapshotScalarWhereWithAggregatesInput | Prisma.ResearchSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.ResearchSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ResearchSnapshotScalarWhereWithAggregatesInput | Prisma.ResearchSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ResearchSnapshot"> | string;
    sourceItemId?: Prisma.StringWithAggregatesFilter<"ResearchSnapshot"> | string;
    title?: Prisma.StringWithAggregatesFilter<"ResearchSnapshot"> | string;
    rawText?: Prisma.StringWithAggregatesFilter<"ResearchSnapshot"> | string;
    summary?: Prisma.StringWithAggregatesFilter<"ResearchSnapshot"> | string;
    keyFacts?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    quoteCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    hookIdeas?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    pillarCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    safetyFlags?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    sourcePublishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ResearchSnapshot"> | Date | string | null;
    metadata?: Prisma.JsonWithAggregatesFilter<"ResearchSnapshot">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ResearchSnapshot"> | Date | string;
};
export type ResearchSnapshotCreateInput = {
    id?: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    sourceItem: Prisma.SourceItemCreateNestedOneWithoutResearchSnapshotsInput;
    contentIdeas?: Prisma.ContentIdeaCreateNestedManyWithoutSnapshotInput;
};
export type ResearchSnapshotUncheckedCreateInput = {
    id?: string;
    sourceItemId: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    contentIdeas?: Prisma.ContentIdeaUncheckedCreateNestedManyWithoutSnapshotInput;
};
export type ResearchSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceItem?: Prisma.SourceItemUpdateOneRequiredWithoutResearchSnapshotsNestedInput;
    contentIdeas?: Prisma.ContentIdeaUpdateManyWithoutSnapshotNestedInput;
};
export type ResearchSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceItemId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    contentIdeas?: Prisma.ContentIdeaUncheckedUpdateManyWithoutSnapshotNestedInput;
};
export type ResearchSnapshotCreateManyInput = {
    id?: string;
    sourceItemId: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ResearchSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResearchSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceItemId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResearchSnapshotListRelationFilter = {
    every?: Prisma.ResearchSnapshotWhereInput;
    some?: Prisma.ResearchSnapshotWhereInput;
    none?: Prisma.ResearchSnapshotWhereInput;
};
export type ResearchSnapshotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type ResearchSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceItemId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    rawText?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    keyFacts?: Prisma.SortOrder;
    quoteCandidates?: Prisma.SortOrder;
    hookIdeas?: Prisma.SortOrder;
    pillarCandidates?: Prisma.SortOrder;
    safetyFlags?: Prisma.SortOrder;
    sourcePublishedAt?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ResearchSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceItemId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    rawText?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    sourcePublishedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ResearchSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceItemId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    rawText?: Prisma.SortOrder;
    summary?: Prisma.SortOrder;
    sourcePublishedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ResearchSnapshotNullableScalarRelationFilter = {
    is?: Prisma.ResearchSnapshotWhereInput | null;
    isNot?: Prisma.ResearchSnapshotWhereInput | null;
};
export type ResearchSnapshotCreateNestedManyWithoutSourceItemInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput> | Prisma.ResearchSnapshotCreateWithoutSourceItemInput[] | Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput[];
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput | Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput[];
    createMany?: Prisma.ResearchSnapshotCreateManySourceItemInputEnvelope;
    connect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
};
export type ResearchSnapshotUncheckedCreateNestedManyWithoutSourceItemInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput> | Prisma.ResearchSnapshotCreateWithoutSourceItemInput[] | Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput[];
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput | Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput[];
    createMany?: Prisma.ResearchSnapshotCreateManySourceItemInputEnvelope;
    connect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
};
export type ResearchSnapshotUpdateManyWithoutSourceItemNestedInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput> | Prisma.ResearchSnapshotCreateWithoutSourceItemInput[] | Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput[];
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput | Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput[];
    upsert?: Prisma.ResearchSnapshotUpsertWithWhereUniqueWithoutSourceItemInput | Prisma.ResearchSnapshotUpsertWithWhereUniqueWithoutSourceItemInput[];
    createMany?: Prisma.ResearchSnapshotCreateManySourceItemInputEnvelope;
    set?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    disconnect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    delete?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    connect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    update?: Prisma.ResearchSnapshotUpdateWithWhereUniqueWithoutSourceItemInput | Prisma.ResearchSnapshotUpdateWithWhereUniqueWithoutSourceItemInput[];
    updateMany?: Prisma.ResearchSnapshotUpdateManyWithWhereWithoutSourceItemInput | Prisma.ResearchSnapshotUpdateManyWithWhereWithoutSourceItemInput[];
    deleteMany?: Prisma.ResearchSnapshotScalarWhereInput | Prisma.ResearchSnapshotScalarWhereInput[];
};
export type ResearchSnapshotUncheckedUpdateManyWithoutSourceItemNestedInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput> | Prisma.ResearchSnapshotCreateWithoutSourceItemInput[] | Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput[];
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput | Prisma.ResearchSnapshotCreateOrConnectWithoutSourceItemInput[];
    upsert?: Prisma.ResearchSnapshotUpsertWithWhereUniqueWithoutSourceItemInput | Prisma.ResearchSnapshotUpsertWithWhereUniqueWithoutSourceItemInput[];
    createMany?: Prisma.ResearchSnapshotCreateManySourceItemInputEnvelope;
    set?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    disconnect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    delete?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    connect?: Prisma.ResearchSnapshotWhereUniqueInput | Prisma.ResearchSnapshotWhereUniqueInput[];
    update?: Prisma.ResearchSnapshotUpdateWithWhereUniqueWithoutSourceItemInput | Prisma.ResearchSnapshotUpdateWithWhereUniqueWithoutSourceItemInput[];
    updateMany?: Prisma.ResearchSnapshotUpdateManyWithWhereWithoutSourceItemInput | Prisma.ResearchSnapshotUpdateManyWithWhereWithoutSourceItemInput[];
    deleteMany?: Prisma.ResearchSnapshotScalarWhereInput | Prisma.ResearchSnapshotScalarWhereInput[];
};
export type ResearchSnapshotCreatekeyFactsInput = {
    set: string[];
};
export type ResearchSnapshotCreatequoteCandidatesInput = {
    set: string[];
};
export type ResearchSnapshotCreatehookIdeasInput = {
    set: string[];
};
export type ResearchSnapshotCreatepillarCandidatesInput = {
    set: string[];
};
export type ResearchSnapshotCreatesafetyFlagsInput = {
    set: string[];
};
export type ResearchSnapshotUpdatekeyFactsInput = {
    set?: string[];
    push?: string | string[];
};
export type ResearchSnapshotUpdatequoteCandidatesInput = {
    set?: string[];
    push?: string | string[];
};
export type ResearchSnapshotUpdatehookIdeasInput = {
    set?: string[];
    push?: string | string[];
};
export type ResearchSnapshotUpdatepillarCandidatesInput = {
    set?: string[];
    push?: string | string[];
};
export type ResearchSnapshotUpdatesafetyFlagsInput = {
    set?: string[];
    push?: string | string[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type ResearchSnapshotCreateNestedOneWithoutContentIdeasInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedCreateWithoutContentIdeasInput>;
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutContentIdeasInput;
    connect?: Prisma.ResearchSnapshotWhereUniqueInput;
};
export type ResearchSnapshotUpdateOneWithoutContentIdeasNestedInput = {
    create?: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedCreateWithoutContentIdeasInput>;
    connectOrCreate?: Prisma.ResearchSnapshotCreateOrConnectWithoutContentIdeasInput;
    upsert?: Prisma.ResearchSnapshotUpsertWithoutContentIdeasInput;
    disconnect?: Prisma.ResearchSnapshotWhereInput | boolean;
    delete?: Prisma.ResearchSnapshotWhereInput | boolean;
    connect?: Prisma.ResearchSnapshotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ResearchSnapshotUpdateToOneWithWhereWithoutContentIdeasInput, Prisma.ResearchSnapshotUpdateWithoutContentIdeasInput>, Prisma.ResearchSnapshotUncheckedUpdateWithoutContentIdeasInput>;
};
export type ResearchSnapshotCreateWithoutSourceItemInput = {
    id?: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    contentIdeas?: Prisma.ContentIdeaCreateNestedManyWithoutSnapshotInput;
};
export type ResearchSnapshotUncheckedCreateWithoutSourceItemInput = {
    id?: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    contentIdeas?: Prisma.ContentIdeaUncheckedCreateNestedManyWithoutSnapshotInput;
};
export type ResearchSnapshotCreateOrConnectWithoutSourceItemInput = {
    where: Prisma.ResearchSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput>;
};
export type ResearchSnapshotCreateManySourceItemInputEnvelope = {
    data: Prisma.ResearchSnapshotCreateManySourceItemInput | Prisma.ResearchSnapshotCreateManySourceItemInput[];
    skipDuplicates?: boolean;
};
export type ResearchSnapshotUpsertWithWhereUniqueWithoutSourceItemInput = {
    where: Prisma.ResearchSnapshotWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResearchSnapshotUpdateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedUpdateWithoutSourceItemInput>;
    create: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedCreateWithoutSourceItemInput>;
};
export type ResearchSnapshotUpdateWithWhereUniqueWithoutSourceItemInput = {
    where: Prisma.ResearchSnapshotWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateWithoutSourceItemInput, Prisma.ResearchSnapshotUncheckedUpdateWithoutSourceItemInput>;
};
export type ResearchSnapshotUpdateManyWithWhereWithoutSourceItemInput = {
    where: Prisma.ResearchSnapshotScalarWhereInput;
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateManyMutationInput, Prisma.ResearchSnapshotUncheckedUpdateManyWithoutSourceItemInput>;
};
export type ResearchSnapshotScalarWhereInput = {
    AND?: Prisma.ResearchSnapshotScalarWhereInput | Prisma.ResearchSnapshotScalarWhereInput[];
    OR?: Prisma.ResearchSnapshotScalarWhereInput[];
    NOT?: Prisma.ResearchSnapshotScalarWhereInput | Prisma.ResearchSnapshotScalarWhereInput[];
    id?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    sourceItemId?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    title?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    rawText?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    summary?: Prisma.StringFilter<"ResearchSnapshot"> | string;
    keyFacts?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    quoteCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    hookIdeas?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    pillarCandidates?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    safetyFlags?: Prisma.StringNullableListFilter<"ResearchSnapshot">;
    sourcePublishedAt?: Prisma.DateTimeNullableFilter<"ResearchSnapshot"> | Date | string | null;
    metadata?: Prisma.JsonFilter<"ResearchSnapshot">;
    createdAt?: Prisma.DateTimeFilter<"ResearchSnapshot"> | Date | string;
};
export type ResearchSnapshotCreateWithoutContentIdeasInput = {
    id?: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    sourceItem: Prisma.SourceItemCreateNestedOneWithoutResearchSnapshotsInput;
};
export type ResearchSnapshotUncheckedCreateWithoutContentIdeasInput = {
    id?: string;
    sourceItemId: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ResearchSnapshotCreateOrConnectWithoutContentIdeasInput = {
    where: Prisma.ResearchSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedCreateWithoutContentIdeasInput>;
};
export type ResearchSnapshotUpsertWithoutContentIdeasInput = {
    update: Prisma.XOR<Prisma.ResearchSnapshotUpdateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedUpdateWithoutContentIdeasInput>;
    create: Prisma.XOR<Prisma.ResearchSnapshotCreateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedCreateWithoutContentIdeasInput>;
    where?: Prisma.ResearchSnapshotWhereInput;
};
export type ResearchSnapshotUpdateToOneWithWhereWithoutContentIdeasInput = {
    where?: Prisma.ResearchSnapshotWhereInput;
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateWithoutContentIdeasInput, Prisma.ResearchSnapshotUncheckedUpdateWithoutContentIdeasInput>;
};
export type ResearchSnapshotUpdateWithoutContentIdeasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceItem?: Prisma.SourceItemUpdateOneRequiredWithoutResearchSnapshotsNestedInput;
};
export type ResearchSnapshotUncheckedUpdateWithoutContentIdeasInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceItemId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResearchSnapshotCreateManySourceItemInput = {
    id?: string;
    title: string;
    rawText: string;
    summary: string;
    keyFacts?: Prisma.ResearchSnapshotCreatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotCreatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotCreatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotCreatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotCreatesafetyFlagsInput | string[];
    sourcePublishedAt?: Date | string | null;
    metadata: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ResearchSnapshotUpdateWithoutSourceItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    contentIdeas?: Prisma.ContentIdeaUpdateManyWithoutSnapshotNestedInput;
};
export type ResearchSnapshotUncheckedUpdateWithoutSourceItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    contentIdeas?: Prisma.ContentIdeaUncheckedUpdateManyWithoutSnapshotNestedInput;
};
export type ResearchSnapshotUncheckedUpdateManyWithoutSourceItemInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    rawText?: Prisma.StringFieldUpdateOperationsInput | string;
    summary?: Prisma.StringFieldUpdateOperationsInput | string;
    keyFacts?: Prisma.ResearchSnapshotUpdatekeyFactsInput | string[];
    quoteCandidates?: Prisma.ResearchSnapshotUpdatequoteCandidatesInput | string[];
    hookIdeas?: Prisma.ResearchSnapshotUpdatehookIdeasInput | string[];
    pillarCandidates?: Prisma.ResearchSnapshotUpdatepillarCandidatesInput | string[];
    safetyFlags?: Prisma.ResearchSnapshotUpdatesafetyFlagsInput | string[];
    sourcePublishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type ResearchSnapshotCountOutputType
 */
export type ResearchSnapshotCountOutputType = {
    contentIdeas: number;
};
export type ResearchSnapshotCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    contentIdeas?: boolean | ResearchSnapshotCountOutputTypeCountContentIdeasArgs;
};
/**
 * ResearchSnapshotCountOutputType without action
 */
export type ResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshotCountOutputType
     */
    select?: Prisma.ResearchSnapshotCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ResearchSnapshotCountOutputType without action
 */
export type ResearchSnapshotCountOutputTypeCountContentIdeasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContentIdeaWhereInput;
};
export type ResearchSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceItemId?: boolean;
    title?: boolean;
    rawText?: boolean;
    summary?: boolean;
    keyFacts?: boolean;
    quoteCandidates?: boolean;
    hookIdeas?: boolean;
    pillarCandidates?: boolean;
    safetyFlags?: boolean;
    sourcePublishedAt?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
    contentIdeas?: boolean | Prisma.ResearchSnapshot$contentIdeasArgs<ExtArgs>;
    _count?: boolean | Prisma.ResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["researchSnapshot"]>;
export type ResearchSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceItemId?: boolean;
    title?: boolean;
    rawText?: boolean;
    summary?: boolean;
    keyFacts?: boolean;
    quoteCandidates?: boolean;
    hookIdeas?: boolean;
    pillarCandidates?: boolean;
    safetyFlags?: boolean;
    sourcePublishedAt?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["researchSnapshot"]>;
export type ResearchSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceItemId?: boolean;
    title?: boolean;
    rawText?: boolean;
    summary?: boolean;
    keyFacts?: boolean;
    quoteCandidates?: boolean;
    hookIdeas?: boolean;
    pillarCandidates?: boolean;
    safetyFlags?: boolean;
    sourcePublishedAt?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["researchSnapshot"]>;
export type ResearchSnapshotSelectScalar = {
    id?: boolean;
    sourceItemId?: boolean;
    title?: boolean;
    rawText?: boolean;
    summary?: boolean;
    keyFacts?: boolean;
    quoteCandidates?: boolean;
    hookIdeas?: boolean;
    pillarCandidates?: boolean;
    safetyFlags?: boolean;
    sourcePublishedAt?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
};
export type ResearchSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceItemId" | "title" | "rawText" | "summary" | "keyFacts" | "quoteCandidates" | "hookIdeas" | "pillarCandidates" | "safetyFlags" | "sourcePublishedAt" | "metadata" | "createdAt", ExtArgs["result"]["researchSnapshot"]>;
export type ResearchSnapshotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
    contentIdeas?: boolean | Prisma.ResearchSnapshot$contentIdeasArgs<ExtArgs>;
    _count?: boolean | Prisma.ResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ResearchSnapshotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
};
export type ResearchSnapshotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceItem?: boolean | Prisma.SourceItemDefaultArgs<ExtArgs>;
};
export type $ResearchSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ResearchSnapshot";
    objects: {
        sourceItem: Prisma.$SourceItemPayload<ExtArgs>;
        contentIdeas: Prisma.$ContentIdeaPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sourceItemId: string;
        title: string;
        rawText: string;
        summary: string;
        keyFacts: string[];
        quoteCandidates: string[];
        hookIdeas: string[];
        pillarCandidates: string[];
        safetyFlags: string[];
        sourcePublishedAt: Date | null;
        metadata: runtime.JsonValue;
        createdAt: Date;
    }, ExtArgs["result"]["researchSnapshot"]>;
    composites: {};
};
export type ResearchSnapshotGetPayload<S extends boolean | null | undefined | ResearchSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload, S>;
export type ResearchSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ResearchSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ResearchSnapshotCountAggregateInputType | true;
};
export interface ResearchSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ResearchSnapshot'];
        meta: {
            name: 'ResearchSnapshot';
        };
    };
    /**
     * Find zero or one ResearchSnapshot that matches the filter.
     * @param {ResearchSnapshotFindUniqueArgs} args - Arguments to find a ResearchSnapshot
     * @example
     * // Get one ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResearchSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ResearchSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResearchSnapshotFindUniqueOrThrowArgs} args - Arguments to find a ResearchSnapshot
     * @example
     * // Get one ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResearchSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ResearchSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotFindFirstArgs} args - Arguments to find a ResearchSnapshot
     * @example
     * // Get one ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResearchSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ResearchSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotFindFirstOrThrowArgs} args - Arguments to find a ResearchSnapshot
     * @example
     * // Get one ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResearchSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ResearchSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResearchSnapshots
     * const researchSnapshots = await prisma.researchSnapshot.findMany()
     *
     * // Get first 10 ResearchSnapshots
     * const researchSnapshots = await prisma.researchSnapshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const researchSnapshotWithIdOnly = await prisma.researchSnapshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ResearchSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ResearchSnapshot.
     * @param {ResearchSnapshotCreateArgs} args - Arguments to create a ResearchSnapshot.
     * @example
     * // Create one ResearchSnapshot
     * const ResearchSnapshot = await prisma.researchSnapshot.create({
     *   data: {
     *     // ... data to create a ResearchSnapshot
     *   }
     * })
     *
     */
    create<T extends ResearchSnapshotCreateArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ResearchSnapshots.
     * @param {ResearchSnapshotCreateManyArgs} args - Arguments to create many ResearchSnapshots.
     * @example
     * // Create many ResearchSnapshots
     * const researchSnapshot = await prisma.researchSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ResearchSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ResearchSnapshots and returns the data saved in the database.
     * @param {ResearchSnapshotCreateManyAndReturnArgs} args - Arguments to create many ResearchSnapshots.
     * @example
     * // Create many ResearchSnapshots
     * const researchSnapshot = await prisma.researchSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ResearchSnapshots and only return the `id`
     * const researchSnapshotWithIdOnly = await prisma.researchSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ResearchSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ResearchSnapshot.
     * @param {ResearchSnapshotDeleteArgs} args - Arguments to delete one ResearchSnapshot.
     * @example
     * // Delete one ResearchSnapshot
     * const ResearchSnapshot = await prisma.researchSnapshot.delete({
     *   where: {
     *     // ... filter to delete one ResearchSnapshot
     *   }
     * })
     *
     */
    delete<T extends ResearchSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ResearchSnapshot.
     * @param {ResearchSnapshotUpdateArgs} args - Arguments to update one ResearchSnapshot.
     * @example
     * // Update one ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ResearchSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ResearchSnapshots.
     * @param {ResearchSnapshotDeleteManyArgs} args - Arguments to filter ResearchSnapshots to delete.
     * @example
     * // Delete a few ResearchSnapshots
     * const { count } = await prisma.researchSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ResearchSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, ResearchSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ResearchSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResearchSnapshots
     * const researchSnapshot = await prisma.researchSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ResearchSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ResearchSnapshots and returns the data updated in the database.
     * @param {ResearchSnapshotUpdateManyAndReturnArgs} args - Arguments to update many ResearchSnapshots.
     * @example
     * // Update many ResearchSnapshots
     * const researchSnapshot = await prisma.researchSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ResearchSnapshots and only return the `id`
     * const researchSnapshotWithIdOnly = await prisma.researchSnapshot.updateManyAndReturn({
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
    updateManyAndReturn<T extends ResearchSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ResearchSnapshot.
     * @param {ResearchSnapshotUpsertArgs} args - Arguments to update or create a ResearchSnapshot.
     * @example
     * // Update or create a ResearchSnapshot
     * const researchSnapshot = await prisma.researchSnapshot.upsert({
     *   create: {
     *     // ... data to create a ResearchSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResearchSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends ResearchSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, ResearchSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__ResearchSnapshotClient<runtime.Types.Result.GetResult<Prisma.$ResearchSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ResearchSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotCountArgs} args - Arguments to filter ResearchSnapshots to count.
     * @example
     * // Count the number of ResearchSnapshots
     * const count = await prisma.researchSnapshot.count({
     *   where: {
     *     // ... the filter for the ResearchSnapshots we want to count
     *   }
     * })
    **/
    count<T extends ResearchSnapshotCountArgs>(args?: Prisma.Subset<T, ResearchSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ResearchSnapshotCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ResearchSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResearchSnapshotAggregateArgs>(args: Prisma.Subset<T, ResearchSnapshotAggregateArgs>): Prisma.PrismaPromise<GetResearchSnapshotAggregateType<T>>;
    /**
     * Group by ResearchSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearchSnapshotGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ResearchSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ResearchSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: ResearchSnapshotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ResearchSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResearchSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ResearchSnapshot model
     */
    readonly fields: ResearchSnapshotFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ResearchSnapshot.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ResearchSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sourceItem<T extends Prisma.SourceItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SourceItemDefaultArgs<ExtArgs>>): Prisma.Prisma__SourceItemClient<runtime.Types.Result.GetResult<Prisma.$SourceItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    contentIdeas<T extends Prisma.ResearchSnapshot$contentIdeasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ResearchSnapshot$contentIdeasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContentIdeaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the ResearchSnapshot model
 */
export interface ResearchSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"ResearchSnapshot", 'String'>;
    readonly sourceItemId: Prisma.FieldRef<"ResearchSnapshot", 'String'>;
    readonly title: Prisma.FieldRef<"ResearchSnapshot", 'String'>;
    readonly rawText: Prisma.FieldRef<"ResearchSnapshot", 'String'>;
    readonly summary: Prisma.FieldRef<"ResearchSnapshot", 'String'>;
    readonly keyFacts: Prisma.FieldRef<"ResearchSnapshot", 'String[]'>;
    readonly quoteCandidates: Prisma.FieldRef<"ResearchSnapshot", 'String[]'>;
    readonly hookIdeas: Prisma.FieldRef<"ResearchSnapshot", 'String[]'>;
    readonly pillarCandidates: Prisma.FieldRef<"ResearchSnapshot", 'String[]'>;
    readonly safetyFlags: Prisma.FieldRef<"ResearchSnapshot", 'String[]'>;
    readonly sourcePublishedAt: Prisma.FieldRef<"ResearchSnapshot", 'DateTime'>;
    readonly metadata: Prisma.FieldRef<"ResearchSnapshot", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"ResearchSnapshot", 'DateTime'>;
}
/**
 * ResearchSnapshot findUnique
 */
export type ResearchSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which ResearchSnapshot to fetch.
     */
    where: Prisma.ResearchSnapshotWhereUniqueInput;
};
/**
 * ResearchSnapshot findUniqueOrThrow
 */
export type ResearchSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which ResearchSnapshot to fetch.
     */
    where: Prisma.ResearchSnapshotWhereUniqueInput;
};
/**
 * ResearchSnapshot findFirst
 */
export type ResearchSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which ResearchSnapshot to fetch.
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ResearchSnapshots to fetch.
     */
    orderBy?: Prisma.ResearchSnapshotOrderByWithRelationInput | Prisma.ResearchSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ResearchSnapshots.
     */
    cursor?: Prisma.ResearchSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ResearchSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ResearchSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ResearchSnapshots.
     */
    distinct?: Prisma.ResearchSnapshotScalarFieldEnum | Prisma.ResearchSnapshotScalarFieldEnum[];
};
/**
 * ResearchSnapshot findFirstOrThrow
 */
export type ResearchSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which ResearchSnapshot to fetch.
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ResearchSnapshots to fetch.
     */
    orderBy?: Prisma.ResearchSnapshotOrderByWithRelationInput | Prisma.ResearchSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ResearchSnapshots.
     */
    cursor?: Prisma.ResearchSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ResearchSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ResearchSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ResearchSnapshots.
     */
    distinct?: Prisma.ResearchSnapshotScalarFieldEnum | Prisma.ResearchSnapshotScalarFieldEnum[];
};
/**
 * ResearchSnapshot findMany
 */
export type ResearchSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which ResearchSnapshots to fetch.
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ResearchSnapshots to fetch.
     */
    orderBy?: Prisma.ResearchSnapshotOrderByWithRelationInput | Prisma.ResearchSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ResearchSnapshots.
     */
    cursor?: Prisma.ResearchSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ResearchSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ResearchSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ResearchSnapshots.
     */
    distinct?: Prisma.ResearchSnapshotScalarFieldEnum | Prisma.ResearchSnapshotScalarFieldEnum[];
};
/**
 * ResearchSnapshot create
 */
export type ResearchSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * The data needed to create a ResearchSnapshot.
     */
    data: Prisma.XOR<Prisma.ResearchSnapshotCreateInput, Prisma.ResearchSnapshotUncheckedCreateInput>;
};
/**
 * ResearchSnapshot createMany
 */
export type ResearchSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResearchSnapshots.
     */
    data: Prisma.ResearchSnapshotCreateManyInput | Prisma.ResearchSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ResearchSnapshot createManyAndReturn
 */
export type ResearchSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to create many ResearchSnapshots.
     */
    data: Prisma.ResearchSnapshotCreateManyInput | Prisma.ResearchSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ResearchSnapshot update
 */
export type ResearchSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * The data needed to update a ResearchSnapshot.
     */
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateInput, Prisma.ResearchSnapshotUncheckedUpdateInput>;
    /**
     * Choose, which ResearchSnapshot to update.
     */
    where: Prisma.ResearchSnapshotWhereUniqueInput;
};
/**
 * ResearchSnapshot updateMany
 */
export type ResearchSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ResearchSnapshots.
     */
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateManyMutationInput, Prisma.ResearchSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which ResearchSnapshots to update
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * Limit how many ResearchSnapshots to update.
     */
    limit?: number;
};
/**
 * ResearchSnapshot updateManyAndReturn
 */
export type ResearchSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to update ResearchSnapshots.
     */
    data: Prisma.XOR<Prisma.ResearchSnapshotUpdateManyMutationInput, Prisma.ResearchSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which ResearchSnapshots to update
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * Limit how many ResearchSnapshots to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ResearchSnapshot upsert
 */
export type ResearchSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * The filter to search for the ResearchSnapshot to update in case it exists.
     */
    where: Prisma.ResearchSnapshotWhereUniqueInput;
    /**
     * In case the ResearchSnapshot found by the `where` argument doesn't exist, create a new ResearchSnapshot with this data.
     */
    create: Prisma.XOR<Prisma.ResearchSnapshotCreateInput, Prisma.ResearchSnapshotUncheckedCreateInput>;
    /**
     * In case the ResearchSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ResearchSnapshotUpdateInput, Prisma.ResearchSnapshotUncheckedUpdateInput>;
};
/**
 * ResearchSnapshot delete
 */
export type ResearchSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
    /**
     * Filter which ResearchSnapshot to delete.
     */
    where: Prisma.ResearchSnapshotWhereUniqueInput;
};
/**
 * ResearchSnapshot deleteMany
 */
export type ResearchSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ResearchSnapshots to delete
     */
    where?: Prisma.ResearchSnapshotWhereInput;
    /**
     * Limit how many ResearchSnapshots to delete.
     */
    limit?: number;
};
/**
 * ResearchSnapshot.contentIdeas
 */
export type ResearchSnapshot$contentIdeasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentIdea
     */
    select?: Prisma.ContentIdeaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContentIdea
     */
    omit?: Prisma.ContentIdeaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContentIdeaInclude<ExtArgs> | null;
    where?: Prisma.ContentIdeaWhereInput;
    orderBy?: Prisma.ContentIdeaOrderByWithRelationInput | Prisma.ContentIdeaOrderByWithRelationInput[];
    cursor?: Prisma.ContentIdeaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContentIdeaScalarFieldEnum | Prisma.ContentIdeaScalarFieldEnum[];
};
/**
 * ResearchSnapshot without action
 */
export type ResearchSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearchSnapshot
     */
    select?: Prisma.ResearchSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ResearchSnapshot
     */
    omit?: Prisma.ResearchSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResearchSnapshotInclude<ExtArgs> | null;
};
export {};
