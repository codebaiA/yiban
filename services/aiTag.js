/**
 * AI 标签提取（Mock）
 *
 * PRD 16 约束：
 * - 输入仅包含家属主动填写的文字描述
 * - 输出为有限数量的关键词标签
 * - AI 标签仅为建议，必须允许家属编辑
 * - 禁止推断原文未支持的事实
 * - AI 调用失败时允许手动添加标签并保存
 *
 * 本文件是 Mock 实现：用词典匹配模拟「从描述中提取关键词」
 * FAIL_RATE 用于演示「AI 失败 → 手动加标签 → 仍可保存」（AC-07 / AC-08）
 */

/** 可调开关：把 FAIL_RATE 设为 1 可现场演示 AI 不可用 */
const CONFIG = {
  FAIL_RATE: 0,      // 0 ~ 1
  MAX_TAGS: 8,
  DELAY_MS: 600
}

/** 关键词词典：命中即作为候选标签 */
const DICTIONARY = [
  // 人物 / 称谓
  '爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '老伴', '妻子', '丈夫',
  '儿子', '女儿', '孙子', '孙女', '哥哥', '姐姐', '弟弟', '妹妹',
  '秀兰', '芳芳', '建军', '志强', '王建国', '王振华', '周淑芬', '王承德', '赵玉兰',
  // 地点
  '老家', '四合院', '胡同', '院子', '公园', '城南', '海淀', '北京', '上海',
  '工厂', '机械厂', '单位', '学校', '医院',
  // 人生阶段
  '童年', '少年', '青年', '青年时代', '中年', '晚年', '退休', '知青', '下乡',
  // 事件
  '结婚', '婚礼', '生日', '寿宴', '除夕', '春节', '过年', '中秋', '端午',
  '团圆', '聚会', '毕业', '上学', '工作', '旅行', '旅游',
  // 时间
  '春天', '夏天', '秋天', '冬天', '早上', '上午', '中午', '下午', '晚上'
]

/** 正则补捞：四位年份 */
const YEAR_RE = /(19|20)\d{2}\s*年?/g

export function extractTags(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < CONFIG.FAIL_RATE) {
        reject({ code: 'AI_UNAVAILABLE', message: '智能标签服务暂时不可用' })
        return
      }

      const src = String(text || '').trim()
      if (!src) {
        resolve([])
        return
      }

      const found = []
      const push = (t) => {
        const v = String(t).trim()
        if (v && !found.includes(v)) found.push(v)
      }

      DICTIONARY.forEach(word => {
        if (src.includes(word)) push(word)
      })

      const years = src.match(YEAR_RE) || []
      years.forEach(y => push(y.replace(/\s/g, '')))

      resolve(found.slice(0, CONFIG.MAX_TAGS))
    }, CONFIG.DELAY_MS)
  })
}

/** 供演示：手动添加标签（PRD 16.3） */
export function makeUserTag(tagName) {
  return { tagName: String(tagName || '').trim(), sourceType: 'USER', confirmed: true }
}

export const aiTagConfig = CONFIG
export default { extractTags, makeUserTag, aiTagConfig }
