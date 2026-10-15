/**
 * Patient — 患者主档案（Mock）
 * 数据以 Figma 设计稿为准：王建国 / 74岁 / 王爷爷
 */
export default {
  id: 'p1',
  name: '王建国',
  nickname: '王爷爷',
  age: 74,
  gender: '男',
  birthDate: '1952-03-08',
  avatar: '/static/s1开发/王建国.png',
  // 与回忆录「我的个人简介」共享同一份数据（PRD 17.1）
  intro: '我是一名受人尊敬的退休老工程师，性格温厚，大家都特别敬重你。',
  identity: '退休老工程师',
  diagnosisStage: '轻度',
  // 首页「我住哪」/ 看看从前「我在哪」
  residence: {
    name: '海淀老家小院',
    desc: '这里是你和家人生活的地方，非常安全。',
    detail: '老藤椅就在窗边，常喝的茉莉花茶泡好了，温热着呢。',
    photo: '/static/s1开发/我住哪儿.png'
  },
  createdAt: '2026-04-01 09:00:00',
  updatedAt: '2026-10-09 15:40:00'
}
