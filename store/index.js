/**
 * 轻量全局 store（零依赖，Vue3 reactive 单例）
 *
 * 模块顶层 reactive → import 即单例，天然跨页共享，无需 provide/inject
 * 页面只读 useStore()，写入一律走 actions（actions 内部调 services/api.js）
 */

import { reactive } from 'vue'
import api from '../services/api.js'

const EMPTY_MEMOIR = { categories: [], memories: [], media: [], tags: [] }

const state = reactive({
  /** 登录态与家属授权态 */
  session: { accountId: 'u1', patientId: 'p1', role: 'PATIENT', caregiverAuthorized: false, authAt: null },

  /** 用户偏好（PRD 14） */
  ui: {
    fontLevel: 'lg',      // md | lg | xl
    voiceEnabled: true,
    volume: 0.8,
    viewMode: 'toc',      // toc | gallery（回忆录双视图）
    serifReady: false     // 宋体是否已加载完成（避免字形闪烁）
  },

  patient: {},
  family: { members: [], relations: [] },
  memoir: JSON.parse(JSON.stringify(EMPTY_MEMOIR)),
  medication: { plans: [], confirmations: [] },
  training: { records: [], questions: [] },
  emergency: null,
  categoryRequests: [],
  helpVideos: [],

  /** 全局 UI 状态 */
  loading: false,
  lastError: ''
})

export function useStore() {
  return state
}

/** 应用启动：读缓存 / 播种 */
export function hydrate() {
  const snap = api.init()
  state.session = Object.assign(state.session, snap.session || {})
  state.ui = Object.assign(state.ui, snap.ui || {})
  state.patient = snap.patient || {}
  state.family = snap.family || { members: [], relations: [] }
  state.memoir = snap.memoir || JSON.parse(JSON.stringify(EMPTY_MEMOIR))
  state.medication = snap.medication || { plans: [], confirmations: [] }
  state.training = snap.training || { records: [], questions: [] }
  state.emergency = snap.emergency || null
  state.categoryRequests = snap.categoryRequests || []
  state.helpVideos = snap.helpVideos || []
  return state
}

function setLoading(v) {
  state.loading = v
}

function fail(e) {
  state.lastError = (e && e.message) || '操作失败'
  return Promise.reject(e)
}

export const actions = {
  /* ---- 偏好 ---- */
  async setFontLevel(level) {
    state.ui.fontLevel = level
    try {
      await api.updatePreference({ fontLevel: level })
    } catch (e) {
      return fail(e)
    }
  },
  async setVoice(enabled) {
    state.ui.voiceEnabled = !!enabled
    try {
      await api.updatePreference({ voiceEnabled: state.ui.voiceEnabled })
    } catch (e) {
      return fail(e)
    }
  },
  async setVolume(v) {
    state.ui.volume = v
    try {
      await api.updatePreference({ volume: v })
    } catch (e) {
      return fail(e)
    }
  },
  async setViewMode(mode) {
    state.ui.viewMode = mode
    try {
      await api.updatePreference({ viewMode: mode })
    } catch (e) {
      return fail(e)
    }
  },
  markSerifReady(v) {
    state.ui.serifReady = !!v
  },

  /* ---- 家属授权（长按 3 秒 + 两次确认）---- */
  async authorizeCaregiver() {
    try {
      const s = await api.authorizeCaregiver()
      state.session = Object.assign(state.session, s)
      return s
    } catch (e) {
      return fail(e)
    }
  },
  async revokeCaregiver() {
    try {
      const s = await api.revokeCaregiver()
      state.session = Object.assign(state.session, s)
      return s
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 患者 ---- */
  async refreshPatient() {
    try {
      state.patient = await api.getPatient()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 家庭 ---- */
  async refreshFamily() {
    try {
      state.family = await api.getFamily()
    } catch (e) {
      return fail(e)
    }
  },
  async addMember(m) {
    try {
      await api.addMember(m)
      await actions.refreshFamily()
    } catch (e) {
      return fail(e)
    }
  },
  async updateMember(id, patch) {
    try {
      await api.updateMember(id, patch)
      await actions.refreshFamily()
    } catch (e) {
      return fail(e)
    }
  },
  async deleteMember(id) {
    try {
      await api.deleteMember(id)
      await actions.refreshFamily()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 回忆录 ---- */
  async refreshMemoir() {
    try {
      state.memoir = await api.getMemoir()
    } catch (e) {
      return fail(e)
    }
  },
  async addMemory(payload) {
    try {
      const m = await api.addMemory(payload)
      await actions.refreshMemoir()
      return m
    } catch (e) {
      return fail(e)
    }
  },
  async deleteMemory(id) {
    try {
      await api.deleteMemory(id)
      await actions.refreshMemoir()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 分类申请 ---- */
  async refreshCategoryRequests() {
    try {
      state.categoryRequests = await api.getCategoryRequests()
    } catch (e) {
      return fail(e)
    }
  },
  async submitCategoryRequest(payload) {
    try {
      const r = await api.submitCategoryRequest(payload)
      await actions.refreshCategoryRequests()
      return r
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 用药 ---- */
  async refreshMedication() {
    try {
      state.medication = await api.getMedication()
    } catch (e) {
      return fail(e)
    }
  },
  async confirmMedication(planId) {
    try {
      await api.confirmMedication(planId)
      await actions.refreshMedication()
    } catch (e) {
      return fail(e)
    }
  },
  async addPlan(p) {
    try {
      await api.addPlan(p)
      await actions.refreshMedication()
    } catch (e) {
      return fail(e)
    }
  },
  async updatePlan(id, patch) {
    try {
      await api.updatePlan(id, patch)
      await actions.refreshMedication()
    } catch (e) {
      return fail(e)
    }
  },
  async deletePlan(id) {
    try {
      await api.deletePlan(id)
      await actions.refreshMedication()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 紧急联系人 ---- */
  async refreshEmergency() {
    try {
      state.emergency = await api.getEmergency()
    } catch (e) {
      return fail(e)
    }
  },
  async setEmergency(payload) {
    try {
      await api.setEmergency(payload)
      await actions.refreshEmergency()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 训练 ---- */
  async refreshTraining() {
    try {
      const [questions, records] = await Promise.all([
        api.getTrainingQuestions(),
        api.getTrainingRecords()
      ])
      state.training.questions = questions
      state.training.records = records
    } catch (e) {
      return fail(e)
    }
  },
  async addTrainingRecord(rec) {
    try {
      await api.addTrainingRecord(rec)
      await actions.refreshTraining()
    } catch (e) {
      return fail(e)
    }
  },

  /* ---- 帮助视频 ---- */
  async refreshHelpVideos() {
    try {
      state.helpVideos = await api.getHelpVideos()
    } catch (e) {
      return fail(e)
    }
  },

  setLoading
}

export default { state, useStore, hydrate, actions }
