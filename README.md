# Better Unstable Cache

Current implementation of `unstable_cache()` is only deduped within a scope. 
This version dedupe `unstable_cache()` using React's cache() while also 
providing useful logs.

```
npm i nextjs-better-unstable-cache
```
```javascript
import { memoize } from 'nextjs-better-unstable-cache' 

const cachedFn = memoize(
  async (slug: string) => {
    const data = await db.query('...', slug)
    return data
  },
  {
    // Enable persistance between requests, default true
    persist: true, 
    // Invalidation period, default Infinity
    duration: 60,
    // For next's revalidateTags() purposes. 
    revalidateTags: (slug) => ['articles', slug], 
    // Enable logs to see timer or whether it triggers ODR or BR
    logs: ['datacache', 'dedupe'],
    // Extra cache identifier to make cache unique from others
    additionalCacheKey: ['articles'],

    // `revalidateTags` and `additionalCache` can also receive 
    //   callbacks to retrieve the slug from the primary function 
  } 
)
```
