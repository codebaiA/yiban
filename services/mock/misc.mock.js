/**
 * EmergencyContact / CategoryRequest / HelpVideo / UserAccount / AppPreference（Mock）
 */

/** 紧急联系人：同一患者仅允许一个当前有效联系人（PRD 13.2） */
export const emergencyContact = {
  id: 'ec1',
  patientId: 'p1',
  familyMemberId: 'm7',
  name: '芳芳',
  relation: '女儿',
  phone: '13900002156',
  status: 'ACTIVE',
  updatedAt: '2026-10-09 15:40:00'
}

/** 新增分类申请（PRD 9.2 / A3） */
export const categoryRequests = [
  {
    id: 'cr1',
    patientId: 'p1',
    requestName: '我的工作岁月',
    reason: '记录知青下乡及在机械厂三十年的奋斗故事与老工友合照。',
    status: 'APPROVED',
    auditor: '系统管理员',
    auditComment: '符合归档规范，已通过',
    submittedAt: '2026-10-09 15:40:00',
    handledAt: '2026-10-09 16:20:00'
  }
]

/** 使用帮助视频（PRD 14.1：固定教学素材，与患者回忆媒体分开管理） */
export const helpVideos = [
  {
    id: 'hv1',
    title: '怎么跟小忆说话',
    cover: '/static/s1开发/阅读.png',
    url: '',
    sort: 1,
    enabled: true
  },
  {
    id: 'hv2',
    title: '怎么看我的回忆录',
    cover: '/static/s1开发/阅读.png',
    url: '',
    sort: 2,
    enabled: true
  }
]

/** 登录账号（Mock：默认以患者身份进入） */
export const userAccount = {
  id: 'u1',
  platform: 'WECHAT_MP',
  nickname: '王建国',
  patientId: 'p1',
  role: 'PATIENT',
  status: 'ACTIVE'
}

/** 用户偏好 */
export const appPreference = {
  id: 'ap1',
  accountId: 'u1',
  patientId: 'p1',
  fontLevel: 'lg',
  voiceEnabled: true,
  volume: 0.8
}

export default { emergencyContact, categoryRequests, helpVideos, userAccount, appPreference }
