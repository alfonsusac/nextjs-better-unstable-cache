var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import chalk from "chalk";
import { unstable_cache } from "next/cache";
// @ts-expect-error
import { cache } from "react";
/**   ###  MEMOIZE: unstable_cache() + cache()
         A way to generalize the data caching function in Next.js
**/
export function memoize(cb, opts) {
    var _this = this;
    var _a = opts !== null && opts !== void 0 ? opts : {}, // default values
    _b = _a.persist, // default values
    persist = _b === void 0 ? true : _b, _c = _a.duration, duration = _c === void 0 ? Infinity : _c, _d = _a.log, log = _d === void 0 ? ['datacache', 'dedupe'] : _d, _e = _a.revalidateTags, revalidateTags = _e === void 0 ? [] : _e, _f = _a.additionalCacheKey, additionalCacheKey = _f === void 0 ? [] : _f;
    var logDataCache = log.includes('datacache');
    var logDedupe = log.includes('dedupe');
    var oldData;
    var renderCacheHit;
    renderCacheHit = false;
    var cachedFn = cache(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var cacheKey, nextOpts, dataCacheMiss_1, audit, data, time, isSame, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderCacheHit = true;
                        if (!persist) return [3 /*break*/, 5];
                        cacheKey = __spreadArray([cb.toString(), JSON.stringify(args)], additionalCacheKey, true);
                        nextOpts = {
                            revalidate: duration,
                            tags: __spreadArray(['all'], revalidateTags, true)
                        };
                        if (!logDataCache) return [3 /*break*/, 2];
                        dataCacheMiss_1 = false;
                        audit = new Audit();
                        return [4 /*yield*/, unstable_cache(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    dataCacheMiss_1 = true;
                                    return [2 /*return*/, cb.apply(void 0, args)];
                                });
                            }); }, cacheKey, nextOpts)()];
                    case 1:
                        data = _a.sent();
                        time = audit.getSec();
                        isSame = oldData === data;
                        console.log("".concat(chalk.hex('#AA7ADB').bold("Data Cache"), " - ") +
                            "".concat(cb.name, " ").concat(chalk.hex('#AA7ADB').bold(dataCacheMiss_1 ? "MISS" : "HIT"), " ") +
                            "".concat(chalk.hex('A0AFBF')(time.toPrecision(3) + 's'), " ") +
                            "".concat(chalk.hex('#AA7ADB').bold(dataCacheMiss_1 ? isSame ? 'background-revalidation' : 'on-demand revalidation' : ""), " ") +
                            '');
                        oldData = data;
                        return [2 /*return*/, data];
                    case 2: return [4 /*yield*/, unstable_cache(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, cb.apply(void 0, args)];
                            });
                        }); }, __spreadArray([cb.toString(), JSON.stringify(args)], additionalCacheKey, true), {
                            revalidate: duration,
                            tags: __spreadArray(['all'], revalidateTags, true)
                        })()];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 4: return [3 /*break*/, 6];
                    case 5: 
                    // return callback directly
                    return [2 /*return*/, cb.apply(void 0, args)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    });
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var audit2, data, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!logDedupe) return [3 /*break*/, 2];
                        audit2 = new Audit();
                        return [4 /*yield*/, cachedFn.apply(void 0, args)];
                    case 1:
                        data = _a.sent();
                        time = audit2.getSec();
                        console.log("".concat(chalk.hex('#FFB713').bold("Memoization"), " - ") +
                            "".concat(cb.name, " ").concat(chalk.hex('#FFC94E').bold(renderCacheHit ? "MISS" : "HIT"), " ") +
                            "".concat(chalk.hex('A0AFBF')(time.toPrecision(3) + 's'), " ") +
                            '');
                        renderCacheHit = false;
                        return [2 /*return*/, data];
                    case 2: return [4 /*yield*/, cachedFn.apply(void 0, args)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
}
var Audit = /** @class */ (function () {
    function Audit() {
        this._start = performance.now();
        this._end = null;
    }
    Audit.prototype.getSec = function () {
        this._end = performance.now();
        return ((this._end - this._start) / 1000);
    };
    return Audit;
}());
