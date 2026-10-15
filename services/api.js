/**
 * 假接口层（唯一数据出入口）
 *
 * 现在读 Mock；将来接真后端只改本文件，页面与 store 不用动（PRD 18.4）
 * 统一返回 Promise，带模拟网络延迟；写操作校验家属授权（AC-15）
 */

import { seedAll } from './mock/index.js'
import * as persist from '../store/persistence.js'
import { todayKey } from '../store/persistence.js'

let db = null
let saveTimer = null

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function rand() {
  return 180 + Math.floor(Math.random() * 220)
}

/** 落盘（防抖 200ms） */
function flush() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    persist.SLICES.forEach(k => {
      if (db[k] !== undefined) persist.write(k, db[k])
    })
  }, 200)
}

/** 权限校验：非授权家属不得写（AC-15 / PRD 18.2） */
function assertCaregiver() {
  const s = db.session
  if (!s || !s.caregiverAuthorized) {
    return Promise.reject({ code: 'FORBIDDEN', message: '未获得家属授权，不能修改数据' })
  }
  return null
}

/** 初始化：读缓存，无缓存则播种 */
export function init() {
  const ok = persist.checkVersion()
  const cached = ok ? persist.read('patient', null) : null
  if (cached) {
    db = {
      session: persist.read('session', { accountId: 'u1', patientId: 'p1', role: 'PATIENT', caregiverAuthorized: false, authAt: null }),
      ui: Object.assign(
        { fontLevel: 'lg', voiceEnabled: true, volume: 0.8, viewMode: 'toc', serifReady: false },
        persist.read('ui', {})
      ),
      patient: cached,
      family: persist.read('family', { members: [], relations: [] }),
      memoir: persist.read('memoir', { categories: [], memories: [], media: [], tags: [] }),
      medication: persist.read('medication', { plans: [], confirmations: [] }),
      training: persist.read('training', { records: [], questions: [] }),
      emergency: persist.read('emergency', null),
      categoryRequests: persist.read('categoryRequests', []),
      helpVideos: persist.read('helpVideos', [])
    }
    // 题库不落盘（属于静态配置），缺失时补种
    if (!db.training.questions || !db.training.questions.length) {
      db.training.questions = seedAll().training.questions
    }
  } else {
    const seed = seedAll()
    db = Object.assign(seed, {
      session: { accountId: 'u1', patientId: 'p1', role: 'PATIENT', caregiverAuthorized: false, authAt: null },
      ui: { fontLevel: 'lg', voiceEnabled: true, volume: 0.8, viewMode: 'toc', serifReady: false }
    })
    flush()
  }
  return db
}

/** 取全量快照（store 用来做响应式镜像） */
export function getSnapshot() {
  if (!db) init()
  return JSON.parse(JSON.stringify(db))
}

/* ---------------- 患者 / 偏好 ---------------- */

export async function getPatient() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.patient))
}

export async function updatePatient(patch) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  db.patient = Object.assign({}, db.patient, patch, { updatedAt: now() })
  flush()
  return JSON.parse(JSON.stringify(db.patient))
}

export async function updatePreference(patch) {
  await delay(rand())
  db.ui = Object.assign({}, db.ui, patch)
  flush()
  return JSON.parse(JSON.stringify(db.ui))
}

/* ---------------- 家属授权 ---------------- */

export async function authorizeCaregiver() {
  await delay(rand())
  db.session = Object.assign({}, db.session, { caregiverAuthorized: true, authAt: now() })
  flush()
  return JSON.parse(JSON.stringify(db.session))
}

export async function revokeCaregiver() {
  await delay(rand())
  db.session = Object.assign({}, db.session, { caregiverAuthorized: false, authAt: null })
  flush()
  return JSON.parse(JSON.stringify(db.session))
}

/* ---------------- 家庭成员 ---------------- */

export async function getFamily() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.family))
}

export async function addMember(member) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const m = Object.assign({}, member, {
    id: 'm' + (db.family.members.length + 100),
    patientId: db.session.patientId,
    status: 'NORMAL',
    createdAt: now(),
    updatedAt: now()
  })
  db.family.members.push(m)
  flush()
  return JSON.parse(JSON.stringify(m))
}

export async function updateMember(id, patch) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const i = db.family.members.findIndex(m => m.id === id)
  if (i < 0) return Promise.reject({ code: 'NOT_FOUND' })
  db.family.members[i] = Object.assign({}, db.family.members[i], patch, { updatedAt: now() })
  flush()
  return JSON.parse(JSON.stringify(db.family.members[i]))
}

/** 删除前检查是否被回忆引用（PRD 9.2） */
export async function deleteMember(id) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const used = db.memoir.tags.some(t => t.tagName === (db.family.members.find(m => m.id === id) || {}).name)
  if (used) return Promise.reject({ code: 'IN_USE', message: '该成员已被回忆引用，不能删除' })
  db.family.members = db.family.members.filter(m => m.id !== id)
  db.family.relations = db.family.relations.filter(r => r.targetMemberId !== id)
  flush()
  return { ok: true }
}

/* ---------------- 回忆 / 回忆录 ---------------- */

export async function getMemoir() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.memoir))
}

export async function addMemory(payload) {
  const denied = assertCaregiver()
  if (denied) return denied
  // 未选主要分类禁止保存（AC-07）
  if (!payload || !payload.categoryId) {
    return Promise.reject({ code: 'NO_CATEGORY', message: '请先选择一个主要分类' })
  }
  await delay(rand())
  const n = db.memoir.memories.length + 1
  const memory = {
    id: 'mem' + (100 + n),
    patientId: db.session.patientId,
    categoryId: payload.categoryId,
    title: payload.title || '',
    desc: payload.desc || '',
    date: payload.date || '',
    status: 'NORMAL',
    createdAt: now(),
    updatedAt: now()
  }
  db.memoir.memories.push(memory)
  ;(payload.media || []).forEach((url, i) => {
    db.memoir.media.push({
      id: 'md' + (100 + db.memoir.media.length + i),
      memoryId: memory.id,
      type: 'IMAGE',
      url,
      cover: '',
      sort: i + 1
    })
  })
  ;(payload.tags || []).forEach((t, i) => {
    db.memoir.tags.push({
      id: 't' + (100 + db.memoir.tags.length + i),
      memoryId: memory.id,
      tagName: t.tagName,
      sourceType: t.sourceType || 'USER',
      confirmed: true
    })
  })
  flush()
  return JSON.parse(JSON.stringify(memory))
}

export async function deleteMemory(id) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  db.memoir.memories = db.memoir.memories.filter(m => m.id !== id)
  db.memoir.media = db.memoir.media.filter(m => m.memoryId !== id)
  db.memoir.tags = db.memoir.tags.filter(t => t.memoryId !== id)
  flush()
  return { ok: true }
}

export async function getCategories() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.memoir.categories.filter(c => c.enabled)))
}

/* ---------------- 分类申请 ---------------- */

export async function submitCategoryRequest(payload) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const req = {
    id: 'cr' + (db.categoryRequests.length + 100),
    patientId: db.session.patientId,
    requestName: payload.requestName,
    reason: payload.reason || '',
    status: 'PENDING',
    auditor: '',
    auditComment: '',
    submittedAt: now(),
    handledAt: ''
  }
  db.categoryRequests.push(req)
  flush()
  return JSON.parse(JSON.stringify(req))
}

export async function getCategoryRequests() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.categoryRequests))
}

/* ---------------- 用药 ---------------- */

export async function getMedication() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.medication))
}

export async function confirmMedication(planId) {
  await delay(rand())
  const day = todayKey()
  const exist = db.medication.confirmations.find(c => c.planId === planId && c.day === day)
  if (exist) {
    exist.status = 'CONFIRMED'
    exist.confirmedAt = now()
  } else {
    db.medication.confirmations.push({
      id: 'mc' + (db.medication.confirmations.length + 100),
      planId,
      day,
      status: 'CONFIRMED',
      confirmedAt: now()
    })
  }
  // 只保留近 30 天
  db.medication.confirmations = db.medication.confirmations.slice(-200)
  flush()
  return { ok: true }
}

export async function addPlan(plan) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const p = Object.assign({}, plan, {
    id: 'mp' + (db.medication.plans.length + 100),
    patientId: db.session.patientId,
    enabled: plan.enabled !== false,
    createdAt: now(),
    updatedAt: now()
  })
  db.medication.plans.push(p)
  flush()
  return JSON.parse(JSON.stringify(p))
}

export async function updatePlan(id, patch) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  const i = db.medication.plans.findIndex(p => p.id === id)
  if (i < 0) return Promise.reject({ code: 'NOT_FOUND' })
  db.medication.plans[i] = Object.assign({}, db.medication.plans[i], patch, { updatedAt: now() })
  flush()
  return JSON.parse(JSON.stringify(db.medication.plans[i]))
}

export async function deletePlan(id) {
  const denied = assertCaregiver()
  if (denied) return denied
  await delay(rand())
  db.medication.plans = db.medication.plans.filter(p => p.id !== id)
  flush()
  return { ok: true }
}

/* ---------------- 紧急联系人 ---------------- */

export async function getEmergency() {
  await delay(rand())
  return db.emergency ? JSON.parse(JSON.stringify(db.emergency)) : null
}

export async function setEmergency(payload) {
  const denied = assertCaregiver()
  if (denied) return denied
  // 电话号码格式校验（PRD 13.2）
  if (!/^1[3-9]\d{9}$/.test(String(payload.phone || ''))) {
    return Promise.reject({ code: 'BAD_PHONE', message: '请输入正确的11位手机号' })
  }
  await delay(rand())
  db.emergency = Object.assign({}, payload, { id: 'ec1', patientId: db.session.patientId, status: 'ACTIVE', updatedAt: now() })
  flush()
  return JSON.parse(JSON.stringify(db.emergency))
}

/* ---------------- 训练 ---------------- */

export async function getTrainingQuestions() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.training.questions))
}

export async function getTrainingRecords() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.training.records))
}

export async function addTrainingRecord(rec) {
  await delay(rand())
  const r = Object.assign({}, rec, {
    id: 'tr' + (db.training.records.length + 100),
    patientId: db.session.patientId,
    finishedAt: now()
  })
  db.training.records.unshift(r)
  flush()
  return JSON.parse(JSON.stringify(r))
}

/* ---------------- 帮助视频 ---------------- */

export async function getHelpVideos() {
  await delay(rand())
  return JSON.parse(JSON.stringify(db.helpVideos))
}

/* ---------------- 工具 ---------------- */

function now() {
  const d = new Date()
  const p = n => (n < 10 ? '0' + n : '' + n)
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
    ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
}

export default {
  init, getSnapshot,
  getPatient, updatePatient, updatePreference,
  authorizeCaregiver, revokeCaregiver,
  getFamily, addMember, updateMember, deleteMember,
  getMemoir, addMemory, deleteMemory, getCategories,
  submitCategoryRequest, getCategoryRequests,
  getMedication, confirmMedication, addPlan, updatePlan, deletePlan,
  getEmergency, setEmergency,
  getTrainingQuestions, getTrainingRecords, addTrainingRecord,
  getHelpVideos
}
