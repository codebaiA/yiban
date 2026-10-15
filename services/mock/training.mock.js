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
 * 训练题库（第一版：简单生活识钟 · 一页一题极简版）
 * type: CLOCK(识钟) —— 页内用 CSS 钟面渲染 clock.hour/clock.minute，无需外部图片
 * 未来接真后端：字段保持一致，图片题可加 image 字段
 */
export const questions = [
  {
    id: 'q1', type: 'CLOCK',
    title: '这个钟显示几点？',
    clock: { hour: 3, minute: 0 },
    options: ['3点', '6点', '12点'],
    answerIndex: 0,
    tip: '短针指 3，长针指 12，是 3 点整'
  },
  {
    id: 'q2', type: 'CLOCK',
    title: '这个钟显示几点半？',
    clock: { hour: 6, minute: 30 },
    options: ['5点半', '6点半', '7点半'],
    answerIndex: 1,
    tip: '长针指向 6，表示半点'
  },
  {
    id: 'q3', type: 'CLOCK',
    title: '这个钟显示几点？',
    clock: { hour: 9, minute: 0 },
    options: ['9点', '8点', '10点'],
    answerIndex: 0,
    tip: '短针指 9，长针指 12'
  },
  {
    id: 'q4', type: 'CLOCK',
    title: '这个钟显示几点？',
    clock: { hour: 12, minute: 0 },
    options: ['6点', '3点', '12点'],
    answerIndex: 2,
    tip: '两根针都指向 12'
  },
  {
    id: 'q5', type: 'CLOCK',
    title: '这个钟显示几点？',
    clock: { hour: 7, minute: 0 },
    options: ['7点', '5点', '9点'],
    answerIndex: 0,
    tip: '短针指向 7'
  },
  {
    id: 'q6', type: 'CLOCK',
    title: '这个钟显示几点半？',
    clock: { hour: 10, minute: 30 },
    options: ['9点半', '10点半', '11点半'],
    answerIndex: 1,
    tip: '短针刚过 10，长针指 6'
  }
]

export default { records, questions }
