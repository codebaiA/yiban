/**
 * 语音朗读抽象层（当前 = Mock 演示模式，无真实音频）
 *
 * 背景：原方案「微信同声传译插件（WechatSI）」实测不可用；其余小程序 TTS 插件生态不成熟；
 * 腾讯云 / 讯飞 / 百度 TTS 都需要服务端存放 SecretKey，与「本阶段只做前端 + Mock」冲突。
 * 因此当前为演示模式：
 *   - 不发声，但完整模拟朗读过程（开始 → 进度 → 结束），UI 交互可完整演示
 *   - isAvailable() 恒为 false —— 页面据此走「文字优先」降级，不假装有声音
 *   - 音量设置仍然生效并持久化（store.ui.volume），接真引擎时调用方不用改
 *
 * 升级路径（换真 TTS 只需改本文件，调用方不变）：
 *   A. 腾讯云 TTS + 微信云函数中转 —— 音色好、支持长文本；需开通云开发，SecretKey 放云函数环境变量
 *   B. 预生成音频 —— 固定话术（问候 / 用药播报 / 章节名）用 edge-tts 本地生成 mp3 放 static，
 *      动态文案（回忆正文）仍走 A
 *   C. 生态里出现可用的官方 / 第三方 TTS 小程序插件
 */

export const TTS_MODE = 'MOCK'

let volume = 0.8
let timer = null
let progressTimer = null
let pending = null

export function isAvailable() {
  return false
}

export function setVolume(v) {
  volume = Math.min(1, Math.max(0, Number(v) || 0))
}

export function getVolume() {
  return volume
}

/** 估算朗读时长：按老年人语速约 4.5 字/秒，最短 1.2s，最长 30s */
export function estimateDuration(text) {
  const len = String(text || '').trim().length
  if (!len) return 0
  return Math.min(30000, Math.max(1200, Math.round(len * 220) + 600))
}

export function stop() {
  if (timer) { clearTimeout(timer); timer = null }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
  if (pending) {
    const p = pending
    pending = null
    if (p.opt.onFallback) p.opt.onFallback('已停止朗读')
    p.resolve(false)
  }
}

/**
 * 朗读文本（演示模式：无声，仅模拟过程）
 * @param {string} text 待朗读文本
 * @param {object} opt { volume, onStart, onProgress(0~1), onDone, onFallback }
 * @returns {Promise<boolean>} false = 未产生真实音频（演示模式）
 */
export function speak(text, opt = {}) {
  const content = String(text || '').trim()
  if (!content) return Promise.resolve(false)
  if (typeof opt.volume === 'number') setVolume(opt.volume)

  stop() // 打断上一段
  const total = estimateDuration(content)
  const startedAt = Date.now()
  if (opt.onStart) opt.onStart()

  progressTimer = setInterval(() => {
    if (!pending) return
    const p = Math.min(1, (Date.now() - startedAt) / total)
    if (opt.onProgress) opt.onProgress(p)
  }, 200)

  return new Promise(resolve => {
    pending = { resolve, opt }
    timer = setTimeout(() => {
      stop()
      if (opt.onProgress) opt.onProgress(1)
      if (opt.onDone) opt.onDone()
      resolve(false)
    }, total)
  })
}

/** 语音识别（预留：AI 语音陪伴在 PRD V1.1 第一版不做范围内） */
export function recognize() {
  return Promise.reject({ code: 'NOT_IMPLEMENTED', message: '语音识别暂未启用' })
}

export default { TTS_MODE, speak, stop, setVolume, getVolume, isAvailable, estimateDuration, recognize }
