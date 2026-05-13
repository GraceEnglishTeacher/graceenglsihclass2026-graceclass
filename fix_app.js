import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');
const fixedLines = [
  ...lines.slice(0, 660),
  `  {
    id: 43, section: 'p2_jiho', type: 'choice',
    question: "How does Jiho feel now compared to before starting the journal?",
    question_ko: "일기를 시작하기 전과 비교하여 지호는 현재 어떻게 느끼나요?",
    options: ["More negative", "More positive", "More tired", "More angry"],
    answer: "More positive",
    explanation: "지호는 일기를 쓴 후 더 긍정적인(positive) 기분을 갖게 되었다고 했습니다."
  }
];

const READING_TEXTS = {
  p1: {
    title: "How to Protect Your Emotional Health (Page 1)",
    text: "Emotional health is as important as physical health. It starts with noticing what makes you feel sad or happy. When you notice these feelings, you should talk about them with someone you trust. Some people keep their feelings inside, but this can cause problems in your relationships later. To be emotionally healthy, it is also essential to maintain your physical health by exercising regularly and getting enough sleep. Lastly, remember that humans are social animals by nature. Connecting with other people is a necessary part of staying happy and strong.",
    translation: "정서적 건강은 신체적 건강만큼이나 중요합니다. 그것은 무엇이 당신을 슬프게 하거나 기쁘게 만드는지 알아차리는 것에서부터 시작됩니다. 이러한 감정들을 알아차렸을 때, 당신이 신뢰하는 사람과 그것들에 대해 이야기해야 합니다. 어떤 사람들은 자신의 감정을 내면에 담아두지만, 이것은 나중에 당신의 관계에 문제를 일으킬 수 있습니다. 정서적으로 건강해지기 위해서는 정기적으로 운동하고 충분한 수면을 취함으로써 신체적 건강을 유지하는 것도 필수적입니다. 마지막으로, 인간은 본래 사회적 동물이라는 것을 기억하세요. 다른 사람들과 연결되는 것은 행복하고 강하게 지내기 위한 필수적인 부분입니다."
  },`,
  ...lines.slice(666)
];
fs.writeFileSync('src/App.tsx', fixedLines.join('\n'));
