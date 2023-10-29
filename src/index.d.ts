type Callback<Parameters extends unknown[], ReturnType> = (...args: Parameters) => ReturnType | Promise<ReturnType>;
export type MemoizeOptionType<Parameters extends unknown[]> = {
    persist?: boolean;
    duration?: number;
    log?: ('dedupe' | 'datacache' | 'verbose')[];
    logid?: string;
    revalidateTags?: ((...params: Parameters) => string[]) | string[];
    additionalCacheKey?: ((...params: Parameters) => string[]) | string[];
};
/**   ###  MEMOIZE: unstable_cache() + cache()
         A way to generalize the data caching function in Next.js
**/
export declare function memoize<P extends unknown[], R>(cb: Callback<P, R>, opts?: MemoizeOptionType<P>): (...args: P) => Promise<R>;
export {};
