/**
 * MedicationPlan / MedicationConfirmation（Mock）
 * 药物信息以设计稿为准：硝苯地平控释片（中午12:30）、盐酸多奈哌齐片（下午15:00）
 * 注意：系统不提供任何剂量/用药建议，所有内容均为家属按医嘱录入（PRD 12.2）
 */
export const plans = [
  {
    id: 'mp1', patientId: 'p1',
    drugName: '硝苯地平控释片',
    dosage: '按医嘱服用',
    frequency: '每日1次',
    planTime: '12:30',
    startDate: '2026-04-01',
    endDate: '',
    enabled: true,
    note: '午饭后',
    createdAt: '2026-04-01 09:00:00',
    updatedAt: '2026-04-01 09:00:00'
  },
  {
    id: 'mp2', patientId: 'p1',
    drugName: '盐酸多奈哌齐片',
    dosage: '按医嘱服用',
    frequency: '每日1次',
    planTime: '15:00',
    startDate: '2026-04-01',
    endDate: '',
    enabled: true,
    note: '下午',
    createdAt: '2026-04-01 09:00:00',
    updatedAt: '2026-04-01 09:00:00'
  }
]

/**
 * 用药确认记录：按 yyyy-mm-dd 隔离（只保留近 30 天）
 * status: PENDING | CONFIRMED
 */
export const confirmations = []

export default { plans, confirmations }
