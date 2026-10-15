/**
 * Mock 统一播种入口
 * seedAll() 返回一份完整、可深拷贝的初始数据快照
 */
import patient from './patient.mock.js'
import family from './family.mock.js'
import memoir from './memoir.mock.js'
import medication from './medication.mock.js'
import training from './training.mock.js'
import misc from './misc.mock.js'

export function seedAll() {
  return {
    patient: JSON.parse(JSON.stringify(patient)),
    family: {
      members: JSON.parse(JSON.stringify(family.members)),
      relations: JSON.parse(JSON.stringify(family.relations))
    },
    memoir: {
      categories: JSON.parse(JSON.stringify(memoir.categories)),
      memories: JSON.parse(JSON.stringify(memoir.memories)),
      media: JSON.parse(JSON.stringify(memoir.media)),
      tags: JSON.parse(JSON.stringify(memoir.tags))
    },
    medication: {
      plans: JSON.parse(JSON.stringify(medication.plans)),
      confirmations: []
    },
    training: {
      records: JSON.parse(JSON.stringify(training.records)),
      questions: JSON.parse(JSON.stringify(training.questions))
    },
    emergency: JSON.parse(JSON.stringify(misc.emergencyContact)),
    categoryRequests: JSON.parse(JSON.stringify(misc.categoryRequests)),
    helpVideos: JSON.parse(JSON.stringify(misc.helpVideos)),
    userAccount: JSON.parse(JSON.stringify(misc.userAccount))
  }
}

export { patient, family, memoir, medication, training, misc }
