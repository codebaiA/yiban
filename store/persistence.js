/**
 * 持久化：uni.setStorageSync 封装
 * key 统一前缀 yb:，带数据版本号，结构变更时自动清缓存重新播种（调试期很省事）
 */

const PREFIX = 'yb:'
const VERSION_KEY = PREFIX + 'dataVersion'
const DATA_VERSION = '1'

/** 需要落盘的切片 */
export const SLICES = ['ui', 'session', 'patient', 'family', 'memoir', 'medication', 'training', 'emergency', 'categoryRequests', 'helpVideos']

export function read(key, fallback) {
  try {
    const v = uni.getStorageSync(PREFIX + key)
    return (v === '' || v === null || v === undefined) ? fallback : v
  } catch (e) {
    return fallback
  }
}

export function write(key, value) {
  try {
    uni.setStorageSync(PREFIX + key, JSON.parse(JSON.stringify(value)))
    return true
  } catch (e) {
    return false
  }
}

export function remove(key) {
  try {
    uni.removeStorageSync(PREFIX + key)
  } catch (e) {
    /* 忽略 */
  }
}

/** 版本不一致时清空全部业务缓存 */
export function checkVersion() {
  const v = read('dataVersion', null)
  if (v !== DATA_VERSION) {
    SLICES.forEach(remove)
    write('dataVersion', DATA_VERSION)
    return false
  }
  return true
}

export function clearAll() {
  SLICES.forEach(remove)
  remove('dataVersion')
}

export function todayKey(d = new Date()) {
  const p = n => (n < 10 ? '0' + n : '' + n)
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
}

export default { read, write, remove, checkVersion, clearAll, todayKey, SLICES, DATA_VERSION }
