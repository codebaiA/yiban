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
 * 训练题库（题型混合，针对阿尔茨海默症患者的脑力锻炼）
 * type: FACE(人物识别) | MEMORY(图片记忆) | MATCH(图片配对) | LIFE(生活认知)
 * visual: clock(识钟，用表盘渲染) | image(看图作答) | text(纯文字选择)
 * 说明：image 类题的图片后期从后端下发，Mock 阶段留空即可；识钟题表盘为前端 CSS 自绘。
 */
export const questions = [
  {
    id: 'q1', type: 'FACE', visual: 'image',
    title: '这是谁？',
    image: '/static/s1开发/芳芳小头像.png',
    options: ['女儿芳芳', '老伴秀兰', '弟弟建军'],
    answerIndex: 0,
    tip: '她每周六都来陪你'
  },
  {
    id: 'q2', type: 'LIFE', visual: 'text',
    title: '口渴了应该喝什么？',
    options: ['温水', '冰镇饮料', '酒'],
    answerIndex: 0,
    tip: '喝温水对身体最好'
  },
  {
    id: 'q3', type: 'LIFE', visual: 'clock',
    title: '刚吃完药，间隔4小时\n吃一次，下次几点吃',
    options: ['10点15', '9点15', '9点半'],
    answerIndex: 0,
    tip: '慢慢来，不用着急'
  },
  {
    id: 'q4', type: 'FACE', visual: 'image',
    title: '这是谁？',
    image: '/static/s1开发/王建国.png',
    options: ['王振华', '王建国', '周淑芬'],
    answerIndex: 1,
    tip: '这就是你自己呀'
  },
  {
    id: 'q5', type: 'MEMORY', visual: 'image',
    title: '刚才看过的水果是哪一个？',
    image: '',
    options: ['苹果', '香蕉', '橘子'],
    answerIndex: 0,
    tip: '圆圆的、红红的那个'
  },
  {
    id: 'q6', type: 'MATCH', visual: 'image',
    title: '找出和左边相同的一个？',
    image: '',
    options: ['甲', '乙', '丙'],
    answerIndex: 1,
    tip: '仔细看看颜色和形状'
  },
  {
    id: 'q7', type: 'LIFE', visual: 'clock',
    title: '现在该吃下午药了，表上是几点？',
    options: ['12点', '15点', '18点'],
    answerIndex: 1,
    tip: '下午三点，记得喝口水'
  },
  {
    id: 'q8', type: 'LIFE', visual: 'text',
    title: '现在是秋天，接下来是哪个季节？',
    options: ['春天', '夏天', '冬天'],
    answerIndex: 2,
    tip: '秋天过后就是冬天了'
  },
  {
    id: 'q9', type: 'LIFE', visual: 'clock',
    title: '表上是几点？',
    options: ['上午9点', '下午3点', '上午3点'],
    answerIndex: 1,
    tip: '时针和分针都在3的方向'
  },
  {
    id: 'q10', type: 'LIFE', visual: 'text',
    title: '感冒了应该先做什么？',
    options: ['卧床休息多喝水', '去跑步出汗', '继续工作'],
    answerIndex: 0,
    tip: '多休息、多喝水，身体才好得快'
  }
]

export default { records, questions }
