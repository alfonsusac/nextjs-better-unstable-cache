import chalk from "chalk"
import { unstable_cache } from "next/cache"
import { cache } from "react"
//@ts-expect-error
import type { cache as cacheType } from "react/canary.d.ts"

type Callback<Parameters extends unknown[], ReturnType> = (...args: Parameters) => ReturnType | Promise<ReturnType>

type MemoizePropType<Parameters extends unknown[]> = {
  persist?: boolean,
  duration?: number,
  log?: ('dedupe' | 'datacache' | 'verbose')[],
  logid?: string
  revalidateTags?: ((...params: Parameters) => string[]) | string[],
  additionalCacheKey?: ((...params: Parameters) => string[]) | string[]
}

/**   ###  MEMOIZE: unstable_cache() + cache()
         A way to generalize the data caching function in Next.js     
**/

export function memoize<P extends unknown[], R>(
  cb: Callback<P, R>,
  opts?: MemoizePropType<P>
) {
  const { // default values
    persist = true,
    duration = Infinity,
    log = [],
    revalidateTags: revalidateTagsFn,
    additionalCacheKey: additionalCacheKeyFn
  } = opts ?? {}
  const logDataCache = log.includes('datacache')
  const logDedupe = log.includes('dedupe')
  const logVerbose = log.includes('verbose')
  const logID = opts?.logid ? `${opts.logid} ` : ''

  let oldData: any
  let renderCacheHit: boolean
  renderCacheHit = false

  const cachedFn = cache(
    async (...args: P) => {
      renderCacheHit = true
      if (persist) {
        // Initialize unstable_cache
        const additionalCacheKey =
          additionalCacheKeyFn ?
            typeof additionalCacheKeyFn === 'function' ?
              additionalCacheKeyFn(...args) : additionalCacheKeyFn
            : []
        const revalidateTags =
          revalidateTagsFn ?
            typeof revalidateTagsFn === 'function' ?
              revalidateTagsFn(...args) : revalidateTagsFn
            : [];
        const cacheKey = [cb.toString(), JSON.stringify(args), ...additionalCacheKey]
        const nextOpts = {
          revalidate: duration,
          tags: ['all', ...revalidateTags]
        }
        if (logDataCache) {
          let dataCacheMiss = false
          const audit = new Audit()
          const data = await unstable_cache(
            async () => {
              dataCacheMiss = true
              return cb(...args)
            },
            cacheKey, nextOpts
          )()
          const time = audit!.getSec()
          const isSame = oldData === data
          console.log(
              `${chalk.hex('AA7ADB').bold("Data Cache")} - `
            + `${chalk.hex('A0AFBF')(`${logID}${cb.name}`)} ${chalk.hex('#AA7ADB').bold(dataCacheMiss ? "MISS" : "HIT")} `
            + `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} `
            + `${chalk.hex('AA7ADB').bold(dataCacheMiss ? isSame ? 'background-revalidation' : 'on-demand revalidation' : "")} `
          )
          if (logVerbose)
            console.log(`${chalk.hex('6A7C8E').bold(` └ ${cb.name ?? "Anon Func"} ${JSON.stringify(args)}`)}`)
          oldData = data
          return data

        } else {
          const data = await unstable_cache(
            async () => {
              return cb(...args)
            }, [cb.toString(), JSON.stringify(args), ...additionalCacheKey], {
            revalidate: duration,
            tags: ['all', ...revalidateTags]
          }
          )()
          return data
        }
      } else {
        // return callback directly
        return cb(...args)
      }

    }
  )
  return async (...args: P) => {

    if (logDedupe) {
      let audit2 = new Audit()
      let data = await cachedFn(...args)
      let time = audit2.getSec()
      console.log(
          `${chalk.hex('#FFB713').bold("Memoization")} - `
        + `${chalk.hex('A0AFBF')(`${logID}${cb.name}`)} ${chalk.hex('#FFC94E').bold(renderCacheHit ? "MISS" : "HIT")} `
        + `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} `
      )
      renderCacheHit = false
      return data
    } else {
      return await cachedFn(...args)
    }
  }
}



class Audit {
  private _start: number = performance.now()
  private _end: number | null = null
  getSec() {
    this._end = performance.now()
    return ((this._end - this._start) / 1000)
  }
}