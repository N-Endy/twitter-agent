import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model DraftReview
 *
 */
export type DraftReviewModel = runtime.Types.Result.DefaultSelection<Prisma.$DraftReviewPayload>;
export type AggregateDraftReview = {
    _count: DraftReviewCountAggregateOutputType | null;
    _avg: DraftReviewAvgAggregateOutputType | null;
    _sum: DraftReviewSumAggregateOutputType | null;
    _min: DraftReviewMinAggregateOutputType | null;
    _max: DraftReviewMaxAggregateOutputType | null;
};
export type DraftReviewAvgAggregateOutputType = {
    voiceScore: number | null;
    clarityScore: number | null;
    noveltyScore: number | null;
    safetyScore: number | null;
    sourceConfidenceScore: number | null;
};
export type DraftReviewSumAggregateOutputType = {
    voiceScore: number | null;
    clarityScore: number | null;
    noveltyScore: number | null;
    safetyScore: number | null;
    sourceConfidenceScore: number | null;
};
export type DraftReviewMinAggregateOutputType = {
    id: string | null;
    draftId: string | null;
    reviewer: string | null;
    status: $Enums.ReviewStatus | null;
    notes: string | null;
    rewrite: string | null;
    voiceScore: number | null;
    clarityScore: number | null;
    noveltyScore: number | null;
    safetyScore: number | null;
    sourceConfidenceScore: number | null;
    createdAt: Date | null;
};
export type DraftReviewMaxAggregateOutputType = {
    id: string | null;
    draftId: string | null;
    reviewer: string | null;
    status: $Enums.ReviewStatus | null;
    notes: string | null;
    rewrite: string | null;
    voiceScore: number | null;
    clarityScore: number | null;
    noveltyScore: number | null;
    safetyScore: number | null;
    sourceConfidenceScore: number | null;
    createdAt: Date | null;
};
export type DraftReviewCountAggregateOutputType = {
    id: number;
    draftId: number;
    reviewer: number;
    status: number;
    notes: number;
    issues: number;
    rewrite: number;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules: number;
    createdAt: number;
    _all: number;
};
export type DraftReviewAvgAggregateInputType = {
    voiceScore?: true;
    clarityScore?: true;
    noveltyScore?: true;
    safetyScore?: true;
    sourceConfidenceScore?: true;
};
export type DraftReviewSumAggregateInputType = {
    voiceScore?: true;
    clarityScore?: true;
    noveltyScore?: true;
    safetyScore?: true;
    sourceConfidenceScore?: true;
};
export type DraftReviewMinAggregateInputType = {
    id?: true;
    draftId?: true;
    reviewer?: true;
    status?: true;
    notes?: true;
    rewrite?: true;
    voiceScore?: true;
    clarityScore?: true;
    noveltyScore?: true;
    safetyScore?: true;
    sourceConfidenceScore?: true;
    createdAt?: true;
};
export type DraftReviewMaxAggregateInputType = {
    id?: true;
    draftId?: true;
    reviewer?: true;
    status?: true;
    notes?: true;
    rewrite?: true;
    voiceScore?: true;
    clarityScore?: true;
    noveltyScore?: true;
    safetyScore?: true;
    sourceConfidenceScore?: true;
    createdAt?: true;
};
export type DraftReviewCountAggregateInputType = {
    id?: true;
    draftId?: true;
    reviewer?: true;
    status?: true;
    notes?: true;
    issues?: true;
    rewrite?: true;
    voiceScore?: true;
    clarityScore?: true;
    noveltyScore?: true;
    safetyScore?: true;
    sourceConfidenceScore?: true;
    triggeredRules?: true;
    createdAt?: true;
    _all?: true;
};
export type DraftReviewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DraftReview to aggregate.
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DraftReviews to fetch.
     */
    orderBy?: Prisma.DraftReviewOrderByWithRelationInput | Prisma.DraftReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.DraftReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DraftReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DraftReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned DraftReviews
    **/
    _count?: true | DraftReviewCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: DraftReviewAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: DraftReviewSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: DraftReviewMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: DraftReviewMaxAggregateInputType;
};
export type GetDraftReviewAggregateType<T extends DraftReviewAggregateArgs> = {
    [P in keyof T & keyof AggregateDraftReview]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDraftReview[P]> : Prisma.GetScalarType<T[P], AggregateDraftReview[P]>;
};
export type DraftReviewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DraftReviewWhereInput;
    orderBy?: Prisma.DraftReviewOrderByWithAggregationInput | Prisma.DraftReviewOrderByWithAggregationInput[];
    by: Prisma.DraftReviewScalarFieldEnum[] | Prisma.DraftReviewScalarFieldEnum;
    having?: Prisma.DraftReviewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DraftReviewCountAggregateInputType | true;
    _avg?: DraftReviewAvgAggregateInputType;
    _sum?: DraftReviewSumAggregateInputType;
    _min?: DraftReviewMinAggregateInputType;
    _max?: DraftReviewMaxAggregateInputType;
};
export type DraftReviewGroupByOutputType = {
    id: string;
    draftId: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues: string[];
    rewrite: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules: string[];
    createdAt: Date;
    _count: DraftReviewCountAggregateOutputType | null;
    _avg: DraftReviewAvgAggregateOutputType | null;
    _sum: DraftReviewSumAggregateOutputType | null;
    _min: DraftReviewMinAggregateOutputType | null;
    _max: DraftReviewMaxAggregateOutputType | null;
};
type GetDraftReviewGroupByPayload<T extends DraftReviewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DraftReviewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DraftReviewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DraftReviewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DraftReviewGroupByOutputType[P]>;
}>>;
export type DraftReviewWhereInput = {
    AND?: Prisma.DraftReviewWhereInput | Prisma.DraftReviewWhereInput[];
    OR?: Prisma.DraftReviewWhereInput[];
    NOT?: Prisma.DraftReviewWhereInput | Prisma.DraftReviewWhereInput[];
    id?: Prisma.StringFilter<"DraftReview"> | string;
    draftId?: Prisma.StringFilter<"DraftReview"> | string;
    reviewer?: Prisma.StringFilter<"DraftReview"> | string;
    status?: Prisma.EnumReviewStatusFilter<"DraftReview"> | $Enums.ReviewStatus;
    notes?: Prisma.StringFilter<"DraftReview"> | string;
    issues?: Prisma.StringNullableListFilter<"DraftReview">;
    rewrite?: Prisma.StringNullableFilter<"DraftReview"> | string | null;
    voiceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    clarityScore?: Prisma.FloatFilter<"DraftReview"> | number;
    noveltyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    safetyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    sourceConfidenceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    triggeredRules?: Prisma.StringNullableListFilter<"DraftReview">;
    createdAt?: Prisma.DateTimeFilter<"DraftReview"> | Date | string;
    draft?: Prisma.XOR<Prisma.DraftScalarRelationFilter, Prisma.DraftWhereInput>;
};
export type DraftReviewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    draftId?: Prisma.SortOrder;
    reviewer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    issues?: Prisma.SortOrder;
    rewrite?: Prisma.SortOrderInput | Prisma.SortOrder;
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
    triggeredRules?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    draft?: Prisma.DraftOrderByWithRelationInput;
};
export type DraftReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DraftReviewWhereInput | Prisma.DraftReviewWhereInput[];
    OR?: Prisma.DraftReviewWhereInput[];
    NOT?: Prisma.DraftReviewWhereInput | Prisma.DraftReviewWhereInput[];
    draftId?: Prisma.StringFilter<"DraftReview"> | string;
    reviewer?: Prisma.StringFilter<"DraftReview"> | string;
    status?: Prisma.EnumReviewStatusFilter<"DraftReview"> | $Enums.ReviewStatus;
    notes?: Prisma.StringFilter<"DraftReview"> | string;
    issues?: Prisma.StringNullableListFilter<"DraftReview">;
    rewrite?: Prisma.StringNullableFilter<"DraftReview"> | string | null;
    voiceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    clarityScore?: Prisma.FloatFilter<"DraftReview"> | number;
    noveltyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    safetyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    sourceConfidenceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    triggeredRules?: Prisma.StringNullableListFilter<"DraftReview">;
    createdAt?: Prisma.DateTimeFilter<"DraftReview"> | Date | string;
    draft?: Prisma.XOR<Prisma.DraftScalarRelationFilter, Prisma.DraftWhereInput>;
}, "id">;
export type DraftReviewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    draftId?: Prisma.SortOrder;
    reviewer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    issues?: Prisma.SortOrder;
    rewrite?: Prisma.SortOrderInput | Prisma.SortOrder;
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
    triggeredRules?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DraftReviewCountOrderByAggregateInput;
    _avg?: Prisma.DraftReviewAvgOrderByAggregateInput;
    _max?: Prisma.DraftReviewMaxOrderByAggregateInput;
    _min?: Prisma.DraftReviewMinOrderByAggregateInput;
    _sum?: Prisma.DraftReviewSumOrderByAggregateInput;
};
export type DraftReviewScalarWhereWithAggregatesInput = {
    AND?: Prisma.DraftReviewScalarWhereWithAggregatesInput | Prisma.DraftReviewScalarWhereWithAggregatesInput[];
    OR?: Prisma.DraftReviewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DraftReviewScalarWhereWithAggregatesInput | Prisma.DraftReviewScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DraftReview"> | string;
    draftId?: Prisma.StringWithAggregatesFilter<"DraftReview"> | string;
    reviewer?: Prisma.StringWithAggregatesFilter<"DraftReview"> | string;
    status?: Prisma.EnumReviewStatusWithAggregatesFilter<"DraftReview"> | $Enums.ReviewStatus;
    notes?: Prisma.StringWithAggregatesFilter<"DraftReview"> | string;
    issues?: Prisma.StringNullableListFilter<"DraftReview">;
    rewrite?: Prisma.StringNullableWithAggregatesFilter<"DraftReview"> | string | null;
    voiceScore?: Prisma.FloatWithAggregatesFilter<"DraftReview"> | number;
    clarityScore?: Prisma.FloatWithAggregatesFilter<"DraftReview"> | number;
    noveltyScore?: Prisma.FloatWithAggregatesFilter<"DraftReview"> | number;
    safetyScore?: Prisma.FloatWithAggregatesFilter<"DraftReview"> | number;
    sourceConfidenceScore?: Prisma.FloatWithAggregatesFilter<"DraftReview"> | number;
    triggeredRules?: Prisma.StringNullableListFilter<"DraftReview">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DraftReview"> | Date | string;
};
export type DraftReviewCreateInput = {
    id?: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
    draft: Prisma.DraftCreateNestedOneWithoutReviewsInput;
};
export type DraftReviewUncheckedCreateInput = {
    id?: string;
    draftId: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
};
export type DraftReviewUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    draft?: Prisma.DraftUpdateOneRequiredWithoutReviewsNestedInput;
};
export type DraftReviewUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    draftId?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewCreateManyInput = {
    id?: string;
    draftId: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
};
export type DraftReviewUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    draftId?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewListRelationFilter = {
    every?: Prisma.DraftReviewWhereInput;
    some?: Prisma.DraftReviewWhereInput;
    none?: Prisma.DraftReviewWhereInput;
};
export type DraftReviewOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DraftReviewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    draftId?: Prisma.SortOrder;
    reviewer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    issues?: Prisma.SortOrder;
    rewrite?: Prisma.SortOrder;
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
    triggeredRules?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DraftReviewAvgOrderByAggregateInput = {
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
};
export type DraftReviewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    draftId?: Prisma.SortOrder;
    reviewer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    rewrite?: Prisma.SortOrder;
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DraftReviewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    draftId?: Prisma.SortOrder;
    reviewer?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    rewrite?: Prisma.SortOrder;
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DraftReviewSumOrderByAggregateInput = {
    voiceScore?: Prisma.SortOrder;
    clarityScore?: Prisma.SortOrder;
    noveltyScore?: Prisma.SortOrder;
    safetyScore?: Prisma.SortOrder;
    sourceConfidenceScore?: Prisma.SortOrder;
};
export type DraftReviewCreateNestedManyWithoutDraftInput = {
    create?: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput> | Prisma.DraftReviewCreateWithoutDraftInput[] | Prisma.DraftReviewUncheckedCreateWithoutDraftInput[];
    connectOrCreate?: Prisma.DraftReviewCreateOrConnectWithoutDraftInput | Prisma.DraftReviewCreateOrConnectWithoutDraftInput[];
    createMany?: Prisma.DraftReviewCreateManyDraftInputEnvelope;
    connect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
};
export type DraftReviewUncheckedCreateNestedManyWithoutDraftInput = {
    create?: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput> | Prisma.DraftReviewCreateWithoutDraftInput[] | Prisma.DraftReviewUncheckedCreateWithoutDraftInput[];
    connectOrCreate?: Prisma.DraftReviewCreateOrConnectWithoutDraftInput | Prisma.DraftReviewCreateOrConnectWithoutDraftInput[];
    createMany?: Prisma.DraftReviewCreateManyDraftInputEnvelope;
    connect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
};
export type DraftReviewUpdateManyWithoutDraftNestedInput = {
    create?: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput> | Prisma.DraftReviewCreateWithoutDraftInput[] | Prisma.DraftReviewUncheckedCreateWithoutDraftInput[];
    connectOrCreate?: Prisma.DraftReviewCreateOrConnectWithoutDraftInput | Prisma.DraftReviewCreateOrConnectWithoutDraftInput[];
    upsert?: Prisma.DraftReviewUpsertWithWhereUniqueWithoutDraftInput | Prisma.DraftReviewUpsertWithWhereUniqueWithoutDraftInput[];
    createMany?: Prisma.DraftReviewCreateManyDraftInputEnvelope;
    set?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    disconnect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    delete?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    connect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    update?: Prisma.DraftReviewUpdateWithWhereUniqueWithoutDraftInput | Prisma.DraftReviewUpdateWithWhereUniqueWithoutDraftInput[];
    updateMany?: Prisma.DraftReviewUpdateManyWithWhereWithoutDraftInput | Prisma.DraftReviewUpdateManyWithWhereWithoutDraftInput[];
    deleteMany?: Prisma.DraftReviewScalarWhereInput | Prisma.DraftReviewScalarWhereInput[];
};
export type DraftReviewUncheckedUpdateManyWithoutDraftNestedInput = {
    create?: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput> | Prisma.DraftReviewCreateWithoutDraftInput[] | Prisma.DraftReviewUncheckedCreateWithoutDraftInput[];
    connectOrCreate?: Prisma.DraftReviewCreateOrConnectWithoutDraftInput | Prisma.DraftReviewCreateOrConnectWithoutDraftInput[];
    upsert?: Prisma.DraftReviewUpsertWithWhereUniqueWithoutDraftInput | Prisma.DraftReviewUpsertWithWhereUniqueWithoutDraftInput[];
    createMany?: Prisma.DraftReviewCreateManyDraftInputEnvelope;
    set?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    disconnect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    delete?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    connect?: Prisma.DraftReviewWhereUniqueInput | Prisma.DraftReviewWhereUniqueInput[];
    update?: Prisma.DraftReviewUpdateWithWhereUniqueWithoutDraftInput | Prisma.DraftReviewUpdateWithWhereUniqueWithoutDraftInput[];
    updateMany?: Prisma.DraftReviewUpdateManyWithWhereWithoutDraftInput | Prisma.DraftReviewUpdateManyWithWhereWithoutDraftInput[];
    deleteMany?: Prisma.DraftReviewScalarWhereInput | Prisma.DraftReviewScalarWhereInput[];
};
export type DraftReviewCreateissuesInput = {
    set: string[];
};
export type DraftReviewCreatetriggeredRulesInput = {
    set: string[];
};
export type EnumReviewStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReviewStatus;
};
export type DraftReviewUpdateissuesInput = {
    set?: string[];
    push?: string | string[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DraftReviewUpdatetriggeredRulesInput = {
    set?: string[];
    push?: string | string[];
};
export type DraftReviewCreateWithoutDraftInput = {
    id?: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
};
export type DraftReviewUncheckedCreateWithoutDraftInput = {
    id?: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
};
export type DraftReviewCreateOrConnectWithoutDraftInput = {
    where: Prisma.DraftReviewWhereUniqueInput;
    create: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput>;
};
export type DraftReviewCreateManyDraftInputEnvelope = {
    data: Prisma.DraftReviewCreateManyDraftInput | Prisma.DraftReviewCreateManyDraftInput[];
    skipDuplicates?: boolean;
};
export type DraftReviewUpsertWithWhereUniqueWithoutDraftInput = {
    where: Prisma.DraftReviewWhereUniqueInput;
    update: Prisma.XOR<Prisma.DraftReviewUpdateWithoutDraftInput, Prisma.DraftReviewUncheckedUpdateWithoutDraftInput>;
    create: Prisma.XOR<Prisma.DraftReviewCreateWithoutDraftInput, Prisma.DraftReviewUncheckedCreateWithoutDraftInput>;
};
export type DraftReviewUpdateWithWhereUniqueWithoutDraftInput = {
    where: Prisma.DraftReviewWhereUniqueInput;
    data: Prisma.XOR<Prisma.DraftReviewUpdateWithoutDraftInput, Prisma.DraftReviewUncheckedUpdateWithoutDraftInput>;
};
export type DraftReviewUpdateManyWithWhereWithoutDraftInput = {
    where: Prisma.DraftReviewScalarWhereInput;
    data: Prisma.XOR<Prisma.DraftReviewUpdateManyMutationInput, Prisma.DraftReviewUncheckedUpdateManyWithoutDraftInput>;
};
export type DraftReviewScalarWhereInput = {
    AND?: Prisma.DraftReviewScalarWhereInput | Prisma.DraftReviewScalarWhereInput[];
    OR?: Prisma.DraftReviewScalarWhereInput[];
    NOT?: Prisma.DraftReviewScalarWhereInput | Prisma.DraftReviewScalarWhereInput[];
    id?: Prisma.StringFilter<"DraftReview"> | string;
    draftId?: Prisma.StringFilter<"DraftReview"> | string;
    reviewer?: Prisma.StringFilter<"DraftReview"> | string;
    status?: Prisma.EnumReviewStatusFilter<"DraftReview"> | $Enums.ReviewStatus;
    notes?: Prisma.StringFilter<"DraftReview"> | string;
    issues?: Prisma.StringNullableListFilter<"DraftReview">;
    rewrite?: Prisma.StringNullableFilter<"DraftReview"> | string | null;
    voiceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    clarityScore?: Prisma.FloatFilter<"DraftReview"> | number;
    noveltyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    safetyScore?: Prisma.FloatFilter<"DraftReview"> | number;
    sourceConfidenceScore?: Prisma.FloatFilter<"DraftReview"> | number;
    triggeredRules?: Prisma.StringNullableListFilter<"DraftReview">;
    createdAt?: Prisma.DateTimeFilter<"DraftReview"> | Date | string;
};
export type DraftReviewCreateManyDraftInput = {
    id?: string;
    reviewer: string;
    status: $Enums.ReviewStatus;
    notes: string;
    issues?: Prisma.DraftReviewCreateissuesInput | string[];
    rewrite?: string | null;
    voiceScore: number;
    clarityScore: number;
    noveltyScore: number;
    safetyScore: number;
    sourceConfidenceScore: number;
    triggeredRules?: Prisma.DraftReviewCreatetriggeredRulesInput | string[];
    createdAt?: Date | string;
};
export type DraftReviewUpdateWithoutDraftInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewUncheckedUpdateWithoutDraftInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewUncheckedUpdateManyWithoutDraftInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reviewer?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    issues?: Prisma.DraftReviewUpdateissuesInput | string[];
    rewrite?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    voiceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    clarityScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    noveltyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    safetyScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    sourceConfidenceScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    triggeredRules?: Prisma.DraftReviewUpdatetriggeredRulesInput | string[];
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DraftReviewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    draftId?: boolean;
    reviewer?: boolean;
    status?: boolean;
    notes?: boolean;
    issues?: boolean;
    rewrite?: boolean;
    voiceScore?: boolean;
    clarityScore?: boolean;
    noveltyScore?: boolean;
    safetyScore?: boolean;
    sourceConfidenceScore?: boolean;
    triggeredRules?: boolean;
    createdAt?: boolean;
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["draftReview"]>;
export type DraftReviewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    draftId?: boolean;
    reviewer?: boolean;
    status?: boolean;
    notes?: boolean;
    issues?: boolean;
    rewrite?: boolean;
    voiceScore?: boolean;
    clarityScore?: boolean;
    noveltyScore?: boolean;
    safetyScore?: boolean;
    sourceConfidenceScore?: boolean;
    triggeredRules?: boolean;
    createdAt?: boolean;
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["draftReview"]>;
export type DraftReviewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    draftId?: boolean;
    reviewer?: boolean;
    status?: boolean;
    notes?: boolean;
    issues?: boolean;
    rewrite?: boolean;
    voiceScore?: boolean;
    clarityScore?: boolean;
    noveltyScore?: boolean;
    safetyScore?: boolean;
    sourceConfidenceScore?: boolean;
    triggeredRules?: boolean;
    createdAt?: boolean;
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["draftReview"]>;
export type DraftReviewSelectScalar = {
    id?: boolean;
    draftId?: boolean;
    reviewer?: boolean;
    status?: boolean;
    notes?: boolean;
    issues?: boolean;
    rewrite?: boolean;
    voiceScore?: boolean;
    clarityScore?: boolean;
    noveltyScore?: boolean;
    safetyScore?: boolean;
    sourceConfidenceScore?: boolean;
    triggeredRules?: boolean;
    createdAt?: boolean;
};
export type DraftReviewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "draftId" | "reviewer" | "status" | "notes" | "issues" | "rewrite" | "voiceScore" | "clarityScore" | "noveltyScore" | "safetyScore" | "sourceConfidenceScore" | "triggeredRules" | "createdAt", ExtArgs["result"]["draftReview"]>;
export type DraftReviewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
};
export type DraftReviewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
};
export type DraftReviewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    draft?: boolean | Prisma.DraftDefaultArgs<ExtArgs>;
};
export type $DraftReviewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DraftReview";
    objects: {
        draft: Prisma.$DraftPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        draftId: string;
        reviewer: string;
        status: $Enums.ReviewStatus;
        notes: string;
        issues: string[];
        rewrite: string | null;
        voiceScore: number;
        clarityScore: number;
        noveltyScore: number;
        safetyScore: number;
        sourceConfidenceScore: number;
        triggeredRules: string[];
        createdAt: Date;
    }, ExtArgs["result"]["draftReview"]>;
    composites: {};
};
export type DraftReviewGetPayload<S extends boolean | null | undefined | DraftReviewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload, S>;
export type DraftReviewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DraftReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DraftReviewCountAggregateInputType | true;
};
export interface DraftReviewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DraftReview'];
        meta: {
            name: 'DraftReview';
        };
    };
    /**
     * Find zero or one DraftReview that matches the filter.
     * @param {DraftReviewFindUniqueArgs} args - Arguments to find a DraftReview
     * @example
     * // Get one DraftReview
     * const draftReview = await prisma.draftReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DraftReviewFindUniqueArgs>(args: Prisma.SelectSubset<T, DraftReviewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one DraftReview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DraftReviewFindUniqueOrThrowArgs} args - Arguments to find a DraftReview
     * @example
     * // Get one DraftReview
     * const draftReview = await prisma.draftReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DraftReviewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DraftReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DraftReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewFindFirstArgs} args - Arguments to find a DraftReview
     * @example
     * // Get one DraftReview
     * const draftReview = await prisma.draftReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DraftReviewFindFirstArgs>(args?: Prisma.SelectSubset<T, DraftReviewFindFirstArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DraftReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewFindFirstOrThrowArgs} args - Arguments to find a DraftReview
     * @example
     * // Get one DraftReview
     * const draftReview = await prisma.draftReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DraftReviewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DraftReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more DraftReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DraftReviews
     * const draftReviews = await prisma.draftReview.findMany()
     *
     * // Get first 10 DraftReviews
     * const draftReviews = await prisma.draftReview.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const draftReviewWithIdOnly = await prisma.draftReview.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DraftReviewFindManyArgs>(args?: Prisma.SelectSubset<T, DraftReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a DraftReview.
     * @param {DraftReviewCreateArgs} args - Arguments to create a DraftReview.
     * @example
     * // Create one DraftReview
     * const DraftReview = await prisma.draftReview.create({
     *   data: {
     *     // ... data to create a DraftReview
     *   }
     * })
     *
     */
    create<T extends DraftReviewCreateArgs>(args: Prisma.SelectSubset<T, DraftReviewCreateArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many DraftReviews.
     * @param {DraftReviewCreateManyArgs} args - Arguments to create many DraftReviews.
     * @example
     * // Create many DraftReviews
     * const draftReview = await prisma.draftReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DraftReviewCreateManyArgs>(args?: Prisma.SelectSubset<T, DraftReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many DraftReviews and returns the data saved in the database.
     * @param {DraftReviewCreateManyAndReturnArgs} args - Arguments to create many DraftReviews.
     * @example
     * // Create many DraftReviews
     * const draftReview = await prisma.draftReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many DraftReviews and only return the `id`
     * const draftReviewWithIdOnly = await prisma.draftReview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends DraftReviewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DraftReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a DraftReview.
     * @param {DraftReviewDeleteArgs} args - Arguments to delete one DraftReview.
     * @example
     * // Delete one DraftReview
     * const DraftReview = await prisma.draftReview.delete({
     *   where: {
     *     // ... filter to delete one DraftReview
     *   }
     * })
     *
     */
    delete<T extends DraftReviewDeleteArgs>(args: Prisma.SelectSubset<T, DraftReviewDeleteArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one DraftReview.
     * @param {DraftReviewUpdateArgs} args - Arguments to update one DraftReview.
     * @example
     * // Update one DraftReview
     * const draftReview = await prisma.draftReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DraftReviewUpdateArgs>(args: Prisma.SelectSubset<T, DraftReviewUpdateArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more DraftReviews.
     * @param {DraftReviewDeleteManyArgs} args - Arguments to filter DraftReviews to delete.
     * @example
     * // Delete a few DraftReviews
     * const { count } = await prisma.draftReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DraftReviewDeleteManyArgs>(args?: Prisma.SelectSubset<T, DraftReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more DraftReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DraftReviews
     * const draftReview = await prisma.draftReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DraftReviewUpdateManyArgs>(args: Prisma.SelectSubset<T, DraftReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more DraftReviews and returns the data updated in the database.
     * @param {DraftReviewUpdateManyAndReturnArgs} args - Arguments to update many DraftReviews.
     * @example
     * // Update many DraftReviews
     * const draftReview = await prisma.draftReview.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more DraftReviews and only return the `id`
     * const draftReviewWithIdOnly = await prisma.draftReview.updateManyAndReturn({
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
    updateManyAndReturn<T extends DraftReviewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DraftReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one DraftReview.
     * @param {DraftReviewUpsertArgs} args - Arguments to update or create a DraftReview.
     * @example
     * // Update or create a DraftReview
     * const draftReview = await prisma.draftReview.upsert({
     *   create: {
     *     // ... data to create a DraftReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DraftReview we want to update
     *   }
     * })
     */
    upsert<T extends DraftReviewUpsertArgs>(args: Prisma.SelectSubset<T, DraftReviewUpsertArgs<ExtArgs>>): Prisma.Prisma__DraftReviewClient<runtime.Types.Result.GetResult<Prisma.$DraftReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of DraftReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewCountArgs} args - Arguments to filter DraftReviews to count.
     * @example
     * // Count the number of DraftReviews
     * const count = await prisma.draftReview.count({
     *   where: {
     *     // ... the filter for the DraftReviews we want to count
     *   }
     * })
    **/
    count<T extends DraftReviewCountArgs>(args?: Prisma.Subset<T, DraftReviewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DraftReviewCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a DraftReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DraftReviewAggregateArgs>(args: Prisma.Subset<T, DraftReviewAggregateArgs>): Prisma.PrismaPromise<GetDraftReviewAggregateType<T>>;
    /**
     * Group by DraftReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftReviewGroupByArgs} args - Group by arguments.
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
    groupBy<T extends DraftReviewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DraftReviewGroupByArgs['orderBy'];
    } : {
        orderBy?: DraftReviewGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DraftReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDraftReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the DraftReview model
     */
    readonly fields: DraftReviewFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for DraftReview.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__DraftReviewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    draft<T extends Prisma.DraftDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DraftDefaultArgs<ExtArgs>>): Prisma.Prisma__DraftClient<runtime.Types.Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the DraftReview model
 */
export interface DraftReviewFieldRefs {
    readonly id: Prisma.FieldRef<"DraftReview", 'String'>;
    readonly draftId: Prisma.FieldRef<"DraftReview", 'String'>;
    readonly reviewer: Prisma.FieldRef<"DraftReview", 'String'>;
    readonly status: Prisma.FieldRef<"DraftReview", 'ReviewStatus'>;
    readonly notes: Prisma.FieldRef<"DraftReview", 'String'>;
    readonly issues: Prisma.FieldRef<"DraftReview", 'String[]'>;
    readonly rewrite: Prisma.FieldRef<"DraftReview", 'String'>;
    readonly voiceScore: Prisma.FieldRef<"DraftReview", 'Float'>;
    readonly clarityScore: Prisma.FieldRef<"DraftReview", 'Float'>;
    readonly noveltyScore: Prisma.FieldRef<"DraftReview", 'Float'>;
    readonly safetyScore: Prisma.FieldRef<"DraftReview", 'Float'>;
    readonly sourceConfidenceScore: Prisma.FieldRef<"DraftReview", 'Float'>;
    readonly triggeredRules: Prisma.FieldRef<"DraftReview", 'String[]'>;
    readonly createdAt: Prisma.FieldRef<"DraftReview", 'DateTime'>;
}
/**
 * DraftReview findUnique
 */
export type DraftReviewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter, which DraftReview to fetch.
     */
    where: Prisma.DraftReviewWhereUniqueInput;
};
/**
 * DraftReview findUniqueOrThrow
 */
export type DraftReviewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter, which DraftReview to fetch.
     */
    where: Prisma.DraftReviewWhereUniqueInput;
};
/**
 * DraftReview findFirst
 */
export type DraftReviewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter, which DraftReview to fetch.
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DraftReviews to fetch.
     */
    orderBy?: Prisma.DraftReviewOrderByWithRelationInput | Prisma.DraftReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DraftReviews.
     */
    cursor?: Prisma.DraftReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DraftReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DraftReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DraftReviews.
     */
    distinct?: Prisma.DraftReviewScalarFieldEnum | Prisma.DraftReviewScalarFieldEnum[];
};
/**
 * DraftReview findFirstOrThrow
 */
export type DraftReviewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter, which DraftReview to fetch.
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DraftReviews to fetch.
     */
    orderBy?: Prisma.DraftReviewOrderByWithRelationInput | Prisma.DraftReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DraftReviews.
     */
    cursor?: Prisma.DraftReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DraftReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DraftReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DraftReviews.
     */
    distinct?: Prisma.DraftReviewScalarFieldEnum | Prisma.DraftReviewScalarFieldEnum[];
};
/**
 * DraftReview findMany
 */
export type DraftReviewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter, which DraftReviews to fetch.
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DraftReviews to fetch.
     */
    orderBy?: Prisma.DraftReviewOrderByWithRelationInput | Prisma.DraftReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing DraftReviews.
     */
    cursor?: Prisma.DraftReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DraftReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DraftReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DraftReviews.
     */
    distinct?: Prisma.DraftReviewScalarFieldEnum | Prisma.DraftReviewScalarFieldEnum[];
};
/**
 * DraftReview create
 */
export type DraftReviewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * The data needed to create a DraftReview.
     */
    data: Prisma.XOR<Prisma.DraftReviewCreateInput, Prisma.DraftReviewUncheckedCreateInput>;
};
/**
 * DraftReview createMany
 */
export type DraftReviewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many DraftReviews.
     */
    data: Prisma.DraftReviewCreateManyInput | Prisma.DraftReviewCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * DraftReview createManyAndReturn
 */
export type DraftReviewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * The data used to create many DraftReviews.
     */
    data: Prisma.DraftReviewCreateManyInput | Prisma.DraftReviewCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * DraftReview update
 */
export type DraftReviewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * The data needed to update a DraftReview.
     */
    data: Prisma.XOR<Prisma.DraftReviewUpdateInput, Prisma.DraftReviewUncheckedUpdateInput>;
    /**
     * Choose, which DraftReview to update.
     */
    where: Prisma.DraftReviewWhereUniqueInput;
};
/**
 * DraftReview updateMany
 */
export type DraftReviewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update DraftReviews.
     */
    data: Prisma.XOR<Prisma.DraftReviewUpdateManyMutationInput, Prisma.DraftReviewUncheckedUpdateManyInput>;
    /**
     * Filter which DraftReviews to update
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * Limit how many DraftReviews to update.
     */
    limit?: number;
};
/**
 * DraftReview updateManyAndReturn
 */
export type DraftReviewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * The data used to update DraftReviews.
     */
    data: Prisma.XOR<Prisma.DraftReviewUpdateManyMutationInput, Prisma.DraftReviewUncheckedUpdateManyInput>;
    /**
     * Filter which DraftReviews to update
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * Limit how many DraftReviews to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * DraftReview upsert
 */
export type DraftReviewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * The filter to search for the DraftReview to update in case it exists.
     */
    where: Prisma.DraftReviewWhereUniqueInput;
    /**
     * In case the DraftReview found by the `where` argument doesn't exist, create a new DraftReview with this data.
     */
    create: Prisma.XOR<Prisma.DraftReviewCreateInput, Prisma.DraftReviewUncheckedCreateInput>;
    /**
     * In case the DraftReview was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.DraftReviewUpdateInput, Prisma.DraftReviewUncheckedUpdateInput>;
};
/**
 * DraftReview delete
 */
export type DraftReviewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
    /**
     * Filter which DraftReview to delete.
     */
    where: Prisma.DraftReviewWhereUniqueInput;
};
/**
 * DraftReview deleteMany
 */
export type DraftReviewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DraftReviews to delete
     */
    where?: Prisma.DraftReviewWhereInput;
    /**
     * Limit how many DraftReviews to delete.
     */
    limit?: number;
};
/**
 * DraftReview without action
 */
export type DraftReviewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftReview
     */
    select?: Prisma.DraftReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DraftReview
     */
    omit?: Prisma.DraftReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DraftReviewInclude<ExtArgs> | null;
};
export {};
