/**
 * FamilyMember / FamilyRelation（Mock）
 * 数据以 Figma 设计稿为准：
 *   第一代·祖辈   王承德 / 赵玉兰
 *   第二代·父母辈 王振华 / 周淑芬
 *   第三代·本辈   王建国(本人) / 秀兰(老伴) / 建军(弟弟)
 *   第四代·子女辈 芳芳(女儿) / 志强(女婿)
 *
 * generation 用于「看看从前 · 家人们」的四代图谱分组（Figma 1:1642）
 */

export const members = [
  {
    id: 'm1', patientId: 'p1',
    name: '王承德', relation: '祖父', generation: 1, generationName: '第一代 · 祖辈',
    avatar: '', intro: '德高望重 · 严谨笃实', phone: '',
    status: 'NORMAL', createdAt: '2026-04-02 10:00:00', updatedAt: '2026-04-02 10:00:00'
  },
  {
    id: 'm2', patientId: 'p1',
    name: '赵玉兰', relation: '祖母', generation: 1, generationName: '第一代 · 祖辈',
    avatar: '', intro: '慈眉善目 · 勤劳持家', phone: '',
    status: 'NORMAL', createdAt: '2026-04-02 10:00:00', updatedAt: '2026-04-02 10:00:00'
  },
  {
    id: 'm3', patientId: 'p1',
    name: '王振华', relation: '父亲', generation: 2, generationName: '第二代 · 父母辈',
    avatar: '', intro: '一生正直', phone: '',
    status: 'NORMAL', createdAt: '2026-04-02 10:05:00', updatedAt: '2026-04-02 10:05:00'
  },
  {
    id: 'm4', patientId: 'p1',
    name: '周淑芬', relation: '母亲', generation: 2, generationName: '第二代 · 父母辈',
    avatar: '', intro: '勤俭一生', phone: '',
    status: 'NORMAL', createdAt: '2026-04-02 10:05:00', updatedAt: '2026-04-02 10:05:00'
  },
  {
    id: 'm5', patientId: 'p1',
    name: '秀兰', relation: '老伴', generation: 3, generationName: '第三代 · 本辈',
    avatar: '', intro: '和你相伴四十多年', phone: '138****6721',
    status: 'NORMAL', createdAt: '2026-04-02 10:10:00', updatedAt: '2026-10-09 15:40:00'
  },
  {
    id: 'm6', patientId: 'p1',
    name: '建军', relation: '弟弟', generation: 3, generationName: '第三代 · 本辈',
    avatar: '', intro: '住在城南，常来串门', phone: '137****3308',
    status: 'NORMAL', createdAt: '2026-04-02 10:12:00', updatedAt: '2026-04-02 10:12:00'
  },
  {
    id: 'm7', patientId: 'p1',
    name: '芳芳', relation: '女儿', generation: 4, generationName: '第四代 · 子女辈',
    avatar: '/static/s1开发/芳芳小头像.png',
    intro: '每周六陪你', phone: '139****2156',
    age: 45, city: '同城居住',
    status: 'NORMAL', createdAt: '2026-04-02 10:15:00', updatedAt: '2026-10-09 15:40:00'
  },
  {
    id: 'm8', patientId: 'p1',
    name: '志强', relation: '女婿', generation: 4, generationName: '第四代 · 子女辈',
    avatar: '', intro: '孝顺常操持家务', phone: '136****9042',
    status: 'NORMAL', createdAt: '2026-04-02 10:18:00', updatedAt: '2026-04-02 10:18:00'
  },
  {
    id: 'm9', patientId: 'p1',
    name: '浩然', relation: '侄子', generation: 4, generationName: '第四代 · 子女辈',
    avatar: '', intro: '', phone: '',
    status: 'NORMAL', createdAt: '2026-04-02 10:20:00', updatedAt: '2026-04-02 10:20:00'
  },
  {
    id: 'm10', patientId: 'p1',
    name: '天天', relation: '外孙', generation: 5, generationName: '第五代 · 孙辈',
    avatar: '', intro: '爱笑常给姥爷敲背', phone: '', age: 10,
    status: 'NORMAL', createdAt: '2026-04-02 10:22:00', updatedAt: '2026-04-02 10:22:00'
  },
  {
    id: 'm11', patientId: 'p1',
    name: '朵朵', relation: '外孙女', generation: 5, generationName: '第五代 · 孙辈',
    avatar: '', intro: '', phone: '', age: 7,
    status: 'NORMAL', createdAt: '2026-04-02 10:24:00', updatedAt: '2026-04-02 10:24:00'
  }
]

/**
 * 关系以患者为参照（PRD 9.2）
 * source = 患者本人，target = 成员
 */
export const relations = members.map(m => ({
  id: 'r' + m.id.slice(1),
  patientId: 'p1',
  sourceMemberId: 'self',
  targetMemberId: m.id,
  relationType: m.relation,
  generation: m.generation,
  sort: Number(m.id.slice(1))
}))

export default { members, relations }
