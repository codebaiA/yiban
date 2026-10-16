/**
 * 图标 / 素材别名映射
 * 目的：代码里只用英文 key，不直接写中文文件名（避免 URL 编码与跨平台问题）
 * 注意：原素材文件名一律不改动
 */

const S1 = '/static/s1开发/'
const ICONS = '/static/icons/'
const BRAIN = S1 + '脑力训练 · 简单生活识钟（一页一题极简版）_slices/'

const MAP = {
  // —— S1 素材 ——
  medication: S1 + '吃药.png',
  family: S1 + '家人们.png',
  whereILive: S1 + '我住哪儿.png',
  date: S1 + '日期.png',
  game: S1 + '游戏.png',
  patient: S1 + '王建国.png',
  avatarFangfang: S1 + '芳芳小头像.png',
  lookBack: S1 + '看看从前.png',
  arrowRight: S1 + '进入箭头.png',
  read: S1 + '阅读.png',

  // —— 根级素材 ——
  logo: '/static/logo.png',
  portrait: '/static/芳芳.jpg',
  brainTime: S1 + '脑力时光icon.png',
  // —— 新增素材（e896a34 补充）——
  playSmall: S1 + '播放.png',
  phoneSmall: S1 + '拨号.png',
  arrowIn: S1 + '进入.png',

  // —— 识钟游戏（clock.vue 用，蓝湖「脑力训练 · 简单生活识钟」）——
  clockBack: S1 + 'clock_slices/back.png',
  clockSpeaker: S1 + 'clock_slices/speaker.png',
  clockHelp: S1 + 'clock_slices/help.png',
  clockCenter: S1 + 'clock_slices/center.png',

  // —— 脑力训练 · 简单生活识钟切片（homepage-1to1 新增，保留备用）——
  trainingBack: BRAIN + '脑力锻炼返回icon.png',
  trainingHelp: BRAIN + '帮助icon.png',
  trainingReplay: BRAIN + '重新听题icon.png',
  clockFace: BRAIN + '钟表.png',
  countApples: BRAIN + '数苹果.png',

  // —— 功能图标 ——
  switchView: ICONS + 'icon-switch-view.png',
  write: ICONS + '写字.png',
  publish: ICONS + '发布.png',
  send: ICONS + '发送.png',
  camera: ICONS + '拍照.png',
  video: ICONS + '视频.png',

  // —— TabBar ——
  tabHome: 'static/TabBar_icons/首页.png',
  tabMemoir: 'static/TabBar_icons/我的回忆tab.png',
  tabMine: 'static/TabBar_icons/我的tab.png'
}

// 未启用：static/icons/语音条 (3) 5.png —— 文件名含空格，URL 编码有风险
// 如需使用请先重命名为 voice-bar.png，再在此处登记别名

export function icon(name) {
  return MAP[name] || ''
}

export default MAP
