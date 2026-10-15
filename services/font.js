/**
 * 宋体（Noto Serif SC）加载
 *
 * 微信小程序默认不带 Noto Serif SC，需用 wx.loadFontFace 加载网络字体。
 * 字体源：jsDelivr fontsource（零配置即可跑通）
 * ⚠️ 真机预览必须在小程序后台配置 downloadFile 合法域名：cdn.jsdelivr.net
 * ⚠️ 完整中文 woff2 单字重约 1.5MB，首屏较慢 —— S6 会做子集化优化（pyftsubset）
 */

const BASE = 'https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc/files/'
const FACES = [
  { weight: 400, file: 'noto-serif-sc-chinese-simplified-400-normal.woff2' },
  { weight: 500, file: 'noto-serif-sc-chinese-simplified-500-normal.woff2' },
  { weight: 700, file: 'noto-serif-sc-chinese-simplified-700-normal.woff2' }
]

const FAMILY = 'Noto Serif SC'

let loaded = false

function loadOne(face) {
  return new Promise(resolve => {
    uni.loadFontFace({
      family: FAMILY,
      source: 'url("' + BASE + face.file + '")',
      // #ifdef MP-WEIXIN
      global: true,
      // #endif
      success: () => resolve(true),
      fail: () => resolve(false),
      complete: () => {}
    })
  })
}

/**
 * 预加载宋体（App onLaunch 调用）
 * @param {Function} onReady 加载完成回调（用于刷新 store.ui.serifReady，避免字形闪烁）
 */
export function loadSerifFont(onReady) {
  if (loaded) {
    if (onReady) onReady(true)
    return Promise.resolve(true)
  }
  return Promise.all(FACES.map(loadOne)).then(results => {
    loaded = results.some(Boolean)
    if (onReady) onReady(loaded)
    return loaded
  })
}

export function isSerifLoaded() {
  return loaded
}

export const SERIF_FAMILY = FAMILY
export default { loadSerifFont, isSerifLoaded, SERIF_FAMILY }
