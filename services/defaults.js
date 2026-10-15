/**
 * 系统默认配置
 * 章节（MemoirChapter）≠ 主要分类（MemoryCategory），二者通过 categoryIds 映射关联
 * PRD 8.8：不得把章节名称硬编码为数据库分类
 */

/** 回忆录 7 个默认章节（PRD 8.2） */
export const chapters = [
  {
    id: 'ch1', name: '我的个人简介', sort: 1, type: 'PROFILE', fixed: false,
    subtitle: '老伴秀兰与女儿芳芳 · 温暖的家',
    page: '01 页',
    categoryIds: []
  },
  {
    id: 'ch2', name: '认识我的家人', sort: 2, type: 'FAMILY', fixed: false,
    subtitle: '老伴秀兰与女儿芳芳 · 温暖的家',
    page: '02 页',
    categoryIds: ['c1']
  },
  {
    id: 'ch3', name: '我的人生阶段', sort: 3, type: 'STAGE', fixed: false,
    subtitle: '青年时代与知青岁月 · 工厂奋斗年华',
    page: '12 页',
    categoryIds: ['c2']
  },
  {
    id: 'ch4', name: '我生活过的地方', sort: 4, type: 'PLACE', fixed: false,
    subtitle: '老家小四合院、青杠树街与蓉城记忆',
    page: '20 页',
    categoryIds: ['c3']
  },
  {
    id: 'ch5', name: '那些重要的日子', sort: 5, type: 'EVENT', fixed: false,
    subtitle: '结婚、子女出生、节日聚会',
    page: '28 页',
    categoryIds: ['c4']
  },
  {
    id: 'ch6', name: '我的老相册', sort: 6, type: 'ALBUM', fixed: false,
    subtitle: '照片与影像',
    page: '36 页',
    categoryIds: ['c5', 'c1'] // 一个章节可汇集多个分类（PRD 8.8）
  },
  {
    id: 'ch7', name: '新增回忆', sort: 7, type: 'ADD', fixed: true,
    subtitle: '让家人帮您添加一段回忆',
    page: '',
    categoryIds: [] // 固定入口，不能被动态分类挤出（PRD 8.3 / 8.7）
  }
]

/** 字号三档（在 8 档基准上整体缩放），以 CSS 变量形式运行时生效 */
export const fontLevels = [
  { key: 'md', label: '标准', scale: 1 },
  { key: 'lg', label: '大字', scale: 1.2 },
  { key: 'xl', label: '超大', scale: 1.4 }
]

/** 家属授权：长按 3 秒 + 两次确认 */
export const caregiverAuth = {
  holdMs: 3000,
  confirmTitle1: '进入家属维护模式',
  confirmContent1: '进入后可以修改患者的资料与回忆内容，请确认你是患者的家属或照护者。',
  confirmTitle2: '确认修改权限',
  confirmContent2: '确认后将获得编辑权限，修改内容会同步到患者端。'
}

/** 首屏问候（按小时） */
export function greetingByHour(h) {
  if (h < 6) return '夜深了'
  if (h < 11) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export default { chapters, fontLevels, caregiverAuth }
