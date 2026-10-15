/**
 * TrainingRecord（Mock）
 * PRD 11.3：只记录训练类型、完成时间、答题数量、结果摘要；不做排名与疾病进展曲线
 */
export const records = [
  {
    id: 'tr1', patientId: 'p1',
    trainType: '生活认知',
    finishedAt: '2026-10-13 09:20:00',
    questionCount: 8,
    correctCount: 6,
    resultSummary: '答对 6 题，很不错',
    durationSec: 210
  },
  {
    id: 'tr2', patientId: 'p1',
    trainType: '人物识别',
    finishedAt: '2026-10-12 15:40:00',
    questionCount: 6,
    correctCount: 5,
    resultSummary: '答对 5 题，家人都认得出来',
    durationSec: 150
  },
  {
    id: 'tr3', patientId: 'p1',
    trainType: '图片记忆',
    finishedAt: '2026-10-11 10:05:00',
    questionCount: 5,
    correctCount: 3,
    resultSummary: '答对 3 题，再试一次会更熟练',
    durationSec: 130
  }
]

/**
 * 训练题库（第一版：题型混合，不分类别）
 * type: FACE(人物识别) | MEMORY(图片记忆) | MATCH(图片配对) | LIFE(生活认知)
 * 做题页视觉沿用 Figma「脑力训练」系列（1:3859 / 1:3934 / 1:4102 / 1:4172 / 1:4221 / 1:4285）
 */
export const questions = [
  {
    id: 'q1', type: 'LIFE',
    title: '刚吃完药，间隔 4 小时吃一次，下次几点吃？',
    options: ['10点15', '9点15', '9点半'],
    answerIndex: 0,
    tip: '慢慢来，不用着急'
  },
  {
    id: 'q2', type: 'LIFE',
    title: '现在是下午，该吃第二次药的时间是几点？',
    options: ['12点', '15点', '18点'],
    answerIndex: 1,
    tip: '下午三点，记得喝口水'
  },
  {
    id: 'q3', type: 'LIFE',
    title: '口渴了应该喝什么？',
    options: ['温水', '冰镇饮料', '酒'],
    answerIndex: 0,
    tip: '喝温水对身体最好'
  },
  {
    id: 'q4', type: 'LIFE',
    title: '现在是秋天，接下来是哪个季节？',
    options: ['春天', '夏天', '冬天'],
    answerIndex: 2,
    tip: '秋天过后就是冬天了'
  },
  {
    id: 'q5', type: 'FACE',
    title: '这是谁？',
    image: '/static/s1开发/芳芳小头像.png',
    options: ['女儿芳芳', '老伴秀兰', '弟弟建军'],
    answerIndex: 0,
    tip: '她每周六都来陪你'
  },
  {
    id: 'q6', type: 'FACE',
    title: '这是谁？',
    image: '/static/s1开发/王建国.png',
    options: ['王振华', '王建国', '周淑芬'],
    answerIndex: 1,
    tip: '这就是你自己呀'
  }
]

export default { records, questions }
