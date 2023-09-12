type MemoizePropType = {
    persist?: boolean;
    duration?: number;
    log?: ('dedupe' | 'datacache')[];
    revalidateTags?: string[];
    additionalCacheKey?: string[];
};
/**   ###  MEMOIZE: unstable_cache() + cache()
         A way to generalize the data caching function in Next.js
**/
export declare function memoize(cb: Function, opts?: MemoizePropType): (...args: any) => Promise<any>;
export {};
