/**
 * MemoryCategory / Memory / MemoryMedia / MemoryTag（Mock）
 *
 * 注意：主要分类（Category）与回忆录章节（Chapter）是两个不同实体，
 * 章节配置见 services/defaults.js，二者通过映射关联（PRD 8.8 / 17.1）
 */

/** 主要分类：家属上传回忆时必须选择的归档分类 */
export const categories = [
  { id: 'c7', name: '我的个人简介', desc: '关于我自己的基础介绍', parentId: null, sort: 0, enabled: true, scope: 'PATIENT' },
  { id: 'c1', name: '我的家人', desc: '家人的照片与故事', parentId: null, sort: 1, enabled: true, scope: 'PATIENT' },
  { id: 'c2', name: '人生阶段', desc: '童年、青年、工作、晚年', parentId: null, sort: 2, enabled: true, scope: 'PATIENT' },
  { id: 'c3', name: '生活过的地方', desc: '家乡、老房子、工作单位', parentId: null, sort: 3, enabled: true, scope: 'PATIENT' },
  { id: 'c4', name: '重要的日子', desc: '结婚、生子、节日聚会', parentId: null, sort: 4, enabled: true, scope: 'PATIENT' },
  { id: 'c5', name: '老相册', desc: '老照片与影像', parentId: null, sort: 5, enabled: true, scope: 'PATIENT' },
  { id: 'c6', name: '我的工作岁月', desc: '知青下乡及机械厂三十年', parentId: null, sort: 6, enabled: true, scope: 'PATIENT', fromRequest: true }
]

/** 回忆内容 */
export const memories = [
  {
    id: 'mem1', patientId: 'p1', categoryId: 'c1',
    title: '老伴秀兰与女儿芳芳',
    desc: '老伴秀兰与女儿芳芳 · 温暖的家。她们一直在你身边。',
    date: '2024-05-12', status: 'NORMAL',
    createdAt: '2026-04-10 10:00:00', updatedAt: '2026-04-10 10:00:00'
  },
  {
    id: 'mem2', patientId: 'p1', categoryId: 'c2',
    title: '我的青年时代',
    desc: '青年时代与知青岁月 · 工厂奋斗年华。那时候你还很年轻。',
    date: '1975-06-01', status: 'NORMAL',
    createdAt: '2026-04-11 10:00:00', updatedAt: '2026-04-11 10:00:00'
  },
  {
    id: 'mem3', patientId: 'p1', categoryId: 'c3',
    title: '我生活过的地方',
    desc: '老家小四合院、青杠树街与蓉城记忆。',
    date: '1980-03-20', status: 'NORMAL',
    createdAt: '2026-04-12 10:00:00', updatedAt: '2026-04-12 10:00:00'
  },
  {
    id: 'mem4', patientId: 'p1', categoryId: 'c4',
    title: '1982年和老伴结婚的日子',
    desc: '那一天你牵着秀兰的手，院子里摆了三桌酒席。',
    date: '1982-10-01', status: 'NORMAL',
    createdAt: '2026-04-13 10:00:00', updatedAt: '2026-04-13 10:00:00'
  },
  {
    id: 'mem5', patientId: 'p1', categoryId: 'c5',
    title: '除夕夜一家人团聚照',
    desc: '2000年除夕，一家人围在一起吃年夜饭。',
    date: '2000-01-31', status: 'NORMAL',
    createdAt: '2026-04-14 10:00:00', updatedAt: '2026-04-14 10:00:00'
  },
  {
    id: 'mem6', patientId: 'p1', categoryId: 'c5',
    title: '秀兰老伴60岁生日宴',
    desc: '秀兰60岁那年，孩子们都回来了，蛋糕上插了六根蜡烛。',
    date: '2019-08-15', status: 'NORMAL',
    createdAt: '2026-04-15 10:00:00', updatedAt: '2026-04-15 10:00:00'
  },
  {
    id: 'mem7', patientId: 'p1', categoryId: 'c5',
    title: '和老伴秀兰结婚当日和家人的合照',
    desc: '1982年，结婚当天的合影，你穿的是那件崭新的中山装。',
    date: '1982-10-01', status: 'NORMAL',
    createdAt: '2026-04-16 10:00:00', updatedAt: '2026-04-16 10:00:00'
  },
  {
    id: 'mem8', patientId: 'p1', categoryId: 'c5',
    title: '城南老家照片',
    desc: '老街胡同口，小时候你常在那儿玩耍。',
    date: '1965-05-01', status: 'NORMAL',
    createdAt: '2026-04-17 10:00:00', updatedAt: '2026-04-17 10:00:00'
  },
  {
    id: 'mem9', patientId: 'p1', categoryId: 'c5',
    title: '我和女儿在公园',
    desc: '2005年金秋，你带着芳芳去公园看菊花展。',
    date: '2005-10-20', status: 'NORMAL',
    createdAt: '2026-04-18 10:00:00', updatedAt: '2026-04-18 10:00:00'
  },
  {
    id: 'mem10', patientId: 'p1', categoryId: 'c2',
    title: '王建国年轻时候',
    desc: '年轻时的你，意气风发，刚进机械厂不久。',
    date: '1972-09-01', status: 'NORMAL',
    createdAt: '2026-04-19 10:00:00', updatedAt: '2026-04-19 10:00:00'
  }
]

/** 回忆媒体：与元数据分离存储（PRD 17.1） */
export const media = [
  { id: 'md1',  memoryId: 'mem1', type: 'IMAGE', url: '/static/s1开发/家人们.png', cover: '', sort: 1 },
  { id: 'md2',  memoryId: 'mem2', type: 'IMAGE', url: '/static/s1开发/王建国.png', cover: '', sort: 1 },
  { id: 'md3',  memoryId: 'mem3', type: 'IMAGE', url: '/static/s1开发/我住哪儿.png', cover: '', sort: 1 },
  { id: 'md4',  memoryId: 'mem4', type: 'IMAGE', url: '/static/芳芳.jpg', cover: '', sort: 1 },
  { id: 'md5',  memoryId: 'mem5', type: 'IMAGE', url: '/static/s1开发/家人们.png', cover: '', sort: 1 },
  { id: 'md6',  memoryId: 'mem6', type: 'IMAGE', url: '/static/s1开发/芳芳小头像.png', cover: '', sort: 1 },
  { id: 'md7',  memoryId: 'mem7', type: 'IMAGE', url: '/static/芳芳.jpg', cover: '', sort: 1 },
  { id: 'md8',  memoryId: 'mem8', type: 'IMAGE', url: '/static/s1开发/我住哪儿.png', cover: '', sort: 1 },
  { id: 'md9',  memoryId: 'mem9', type: 'IMAGE', url: '/static/s1开发/芳芳小头像.png', cover: '', sort: 1 },
  { id: 'md10', memoryId: 'mem10', type: 'IMAGE', url: '/static/s1开发/王建国.png', cover: '', sort: 1 }
]

/** 回忆标签：sourceType = AI | USER（PRD 16.3） */
export const tags = [
  { id: 't1', memoryId: 'mem1', tagName: '秀兰', sourceType: 'USER', confirmed: true },
  { id: 't2', memoryId: 'mem1', tagName: '芳芳', sourceType: 'USER', confirmed: true },
  { id: 't3', memoryId: 'mem2', tagName: '青年时代', sourceType: 'AI', confirmed: true },
  { id: 't4', memoryId: 'mem2', tagName: '1975年', sourceType: 'AI', confirmed: true },
  { id: 't5', memoryId: 'mem3', tagName: '老家', sourceType: 'AI', confirmed: true },
  { id: 't6', memoryId: 'mem4', tagName: '结婚', sourceType: 'AI', confirmed: true },
  { id: 't7', memoryId: 'mem4', tagName: '1982年', sourceType: 'AI', confirmed: true },
  { id: 't8', memoryId: 'mem5', tagName: '除夕', sourceType: 'AI', confirmed: true },
  { id: 't9', memoryId: 'mem6', tagName: '生日', sourceType: 'AI', confirmed: true },
  { id: 't10', memoryId: 'mem9', tagName: '公园', sourceType: 'AI', confirmed: true }
]

export default { categories, memories, media, tags }
