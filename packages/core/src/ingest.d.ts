export declare function extractTextFromHtml(html: string): Promise<string>;
export declare function ingestUrlSource(url: string): Promise<{
    title: string;
    rawText: string;
    metadata: {};
}[]>;
export declare function ingestRssSource(url: string): Promise<{
    title: string;
    rawText: string;
    metadata: {
        link: string | null;
        isoDate: string | null;
    };
}[]>;
export declare function ingestXPostSource(url: string): Promise<{
    title: string;
    rawText: string;
    metadata: Record<string, unknown>;
}[]>;
export declare function ingestXAccountSource(username: string): Promise<{
    title: string;
    rawText: string;
    metadata: {
        id?: string;
        text?: string;
    };
}[]>;
