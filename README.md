# Better Unstable Cache

Current implementation of `unstable_cache()` is only deduped within a scope. 
This version dedupe `unstable_cache()` using React's `cache()` while also 
providing useful logs. Note that all instability from unstable_cache() is still
carries to this library.

```
npm i nextjs-better-unstable-cache
```
```javascript
import { memoize } from 'nextjs-better-unstable-cache' 

const cachedFn = memoize(
  async (slug) =>  await db.query('...', slug),
  {
    // Enable persistance between requests, default true
    persist: true, 
    // Invalidation period, default Infinity
    duration: 60,
    // For next's revalidateTags() purposes. 
    revalidateTags: (slug) => ['articles', slug], 
    // Extra cache identifier to make cache unique from others
    additionalCacheKey: ['articles'],

    // Enable logs to see timer or whether it triggers ODR or BR
    log:['dedupe' , 'datacache' , 'verbose'],
    // Add custom string for logging
    logID: "Query Data"

    // Suppress warning if used in client side or 
    // . without caching function
    suppressWarnings: true // default fals

    // `revalidateTags` and `additionalCache` can also receive 
    //   callbacks to retrieve the slug from the primary function 
  } 
)

```

## Usage
```javascript
// app/article/[slug]/data.js
import getPageDetails from "@/lib/data"
import { memoize } from 'nextjs-better-unstable-cache' 

export const getCachedPageDetails = memoize(
  getPageDetails,
  {
    duration: 3600
    revalidateTags: (slug) => ['articles', slug],
    log: ['datacache', 'verbose'],
  }
)

// ---
// app/article/[slug]/page.jsx
import { getCachedPageDetails } from './data' 

export default async function Page({ params }) {
  const res = await getCachedPageDetails(params.slug) // 3600 BGR + ODR
  return (
    ...
  )
}

```
Read more about the gotchas of unstable_cache [here](https://alfonsusardani.notion.site/unstable_cache-from-next-cache-f300b3184d6a472ea5282543d50b9f02)
