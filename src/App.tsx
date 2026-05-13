import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  BookOpen, 
  PenTool, 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  Smile, 
  Award, 
  AlertCircle,
  ArrowRight,
  Flame,
  Star,
  Zap,
  Volume2,
  FileText,
  Search,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type Section = 'dashboard' | 'vocab' | 'vocabQuiz' | 'grammar_ppc' | 'grammar_so_that' | 'writing' | 'reading_p1' | 'reading_p2_jiho' | 'reading_p2_somi';

interface VocabWord {
  id: number;
  word: string;
  meaning: string;
  example: string;
  section: 'p1' | 'p2_jiho' | 'p2_somi';
}

interface GrammarQuestion {
  id: number;
  type: 'choice' | 'subjective';
  section: 'ppc' | 'so_that';
  question: string;
  question_ko?: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface WritingQuestion {
  id: number;
  scrambled: string[];
  correct: string;
  translation: string;
  hint: string;
  prefix?: string;
  suffix?: string;
  grammarNote?: string;
}

interface ReadingQuestion {
  id: number;
  type: 'choice' | 'subjective';
  section: 'p1' | 'p2_jiho' | 'p2_somi';
  question: string;
  question_ko: string;
  options?: string[];
  answer: string;
  explanation: string;
}

// --- Constants / Data ---
const VOCAB_DATA: VocabWord[] = [
  // Page 1: Emotional Health Tips
  { id: 1, section: 'p1', word: "protect", meaning: "보호하다", example: "How to protect your emotional health." },
  { id: 2, section: 'p1', word: "emotional health", meaning: "정서적 건강", example: "There are many ways to improve your emotional health." },
  { id: 3, section: 'p1', word: "stressed out", meaning: "스트레스로 지친", example: "Are you so stressed out that it takes hours to fall asleep?" },
  { id: 4, section: 'p1', word: "fall asleep", meaning: "잠이 들다", example: "It's a problem when you can't fall asleep easily." },
  { id: 5, section: 'p1', word: "improve", meaning: "향상시키다, 개선하다", example: "Exercise can help improve your mood." },
  { id: 6, section: 'p1', word: "notice", meaning: "알아차리다, 주목하다", example: "Notice what makes you sad or happy." },
  { id: 7, section: 'p1', word: "inside", meaning: "내면에, 안에", example: "Keeping negative feelings inside can be harmful." },
  { id: 8, section: 'p1', word: "cause", meaning: "원인이 되다, 유발하다", example: "Internal stress can cause problems in relationships." },
  { id: 9, section: 'p1', word: "relationship", meaning: "관계", example: "Communicate well for better relationships." },
  { id: 10, section: 'p1', word: "act", meaning: "행동하다", example: "Think carefully before you act." },
  { id: 11, section: 'p1', word: "calm", meaning: "침착한, 평온한", example: "Try to be calm when you feel angry." },
  { id: 12, section: 'p1', word: "regret", meaning: "후회하다", example: "Don't do something you might regret later." },
  { id: 13, section: 'p1', word: "physical health", meaning: "신체적 건강", example: "Physical health affects your mental state." },
  { id: 14, section: 'p1', word: "affect", meaning: "영향을 미치다", example: "Lack of sleep can affect your concentration." },
  { id: 15, section: 'p1', word: "exercise", meaning: "운동하다, 운동", example: "Exercise regularly to stay fit." },
  { id: 16, section: 'p1', word: "regularly", meaning: "정기적으로", example: "She visits the gym regularly." },
  { id: 17, section: 'p1', word: "meal", meaning: "식사", example: "Eat healthy meals for more energy." },
  { id: 18, section: 'p1', word: "connect", meaning: "연결하다, 접속하다", example: "In addition, connect with other people." },
  { id: 19, section: 'p1', word: "social animal", meaning: "사회적 동물", example: "Humans are social animals by nature." },
  { id: 20, section: 'p1', word: "connection", meaning: "연결, 유대감", example: "We need positive connections with others." },
  { id: 43, section: 'p1', word: "energy", meaning: "에너지", example: "Healthy meals give you more energy." },
  { id: 44, section: 'p1', word: "negative", meaning: "부정적인", example: "Try to let go of negative thoughts." },
  { id: 46, section: 'p1', word: "nature", meaning: "본성, 자연", example: "Humans are social animals by nature." },
  { id: 50, section: 'p1', word: "sharing", meaning: "공유, 나눔", example: "Sharing your feelings with friends is very helpful." },

  // Page 2: Jiho's Case (Gratitude Diary)
  { id: 21, section: 'p2_jiho', word: "focus", meaning: "집중하다", example: "I used to focus only on my problems." },
  { id: 22, section: 'p2_jiho', word: "gratitude diary", meaning: "감사 일기", example: "I started keeping a gratitude diary last month." },
  { id: 23, section: 'p2_jiho', word: "change", meaning: "변화하다, 바꾸다", example: "Everything changed after I met you." },
  { id: 24, section: 'p2_jiho', word: "experience", meaning: "경험하다, 경험", example: "I remember the good moments I experienced." },
  { id: 25, section: 'p2_jiho', word: "moment", meaning: "순간", example: "Cherish every happy moment." },
  { id: 26, section: 'p2_jiho', word: "bloom", meaning: "꽃이 피다", example: "The small flower was blooming between the rocks." },
  { id: 27, section: 'p2_jiho', word: "boring", meaning: "지루한", example: "Some people think writing is boring." },
  { id: 28, section: 'p2_jiho', word: "believe", meaning: "믿다", example: "I believe it is helpful for the mind." },
  { id: 29, section: 'p2_jiho', word: "helpful", meaning: "도움이 되는", example: "This tip is very helpful for study." },
  { id: 30, section: 'p2_jiho', word: "relieve", meaning: "완화하다, 해소하다", example: "Walking helps relieve my stress." },
  { id: 31, section: 'p2_jiho', word: "positive", meaning: "긍정적인", example: "Try to feel more positive about the future." },
  { id: 41, section: 'p2_jiho', word: "consistent", meaning: "일관된, 꾸준한", example: "Consistency is the key to happiness." },
  { id: 42, section: 'p2_jiho', word: "happiness", meaning: "행복", example: "Focus on what brings you happiness." },

  // Page 2: Somi's Case (Healing Art)
  { id: 32, section: 'p2_somi', word: "feel down", meaning: "기분이 울적하다", example: "Whenever I feel down, I listen to music." },
  { id: 33, section: 'p2_somi', word: "brush", meaning: "붓, 솔", example: "She grabbed a brush and started painting." },
  { id: 34, section: 'p2_somi', word: "express", meaning: "표현하다", example: "Art is a way to express your feelings." },
  { id: 35, section: 'p2_somi', word: "inner world", meaning: "내면 세계", example: "Colors can express my inner world." },
  { id: 36, section: 'p2_somi', word: "lately", meaning: "최근에", example: "Lately, I have been painting sunflowers." },
  { id: 37, section: 'p2_somi', word: "remind", meaning: "상기시키다", example: "The song reminds me of my school days." },
  { id: 38, section: 'p2_somi', word: "smoothly", meaning: "부드럽게", example: "The brush moved smoothly on the paper." },
  { id: 39, section: 'p2_somi', word: "comfort", meaning: "위안, 편안함", example: "Painting is one of my greatest comforts." },
  { id: 40, section: 'p2_somi', word: "let go of", meaning: "놓아주다, 떨쳐버리다", example: "I can let go of negative feelings through art." },
  { id: 45, section: 'p2_somi', word: "various", meaning: "다양한", example: "She uses various colors in her paintings." },
  { id: 47, section: 'p2_somi', word: "healing", meaning: "치유, 치료", example: "Her art is known as healing art." },
  { id: 48, section: 'p2_somi', word: "professional", meaning: "전문적인, 전문가", example: "You don't need to be a professional artist." },
  { id: 49, section: 'p2_somi', word: "purpose", meaning: "목적", example: "The purpose of this journal is expressing gratitude." }
];

const GRAMMAR_DATA: GrammarQuestion[] = [
  // Present Perfect Continuous (PPC)
  {
    id: 1, type: 'choice', section: 'ppc',
    question: "다음 중 어법상 옳은 문장을 고르세요.",
    options: [
      "Jiho has been write in his diary since last year.",
      "Somi has been paint sunflowers for six months.",
      "I have been feeling sad lately.",
      "She has being exercise regularly."
    ],
    answer: "I have been feeling sad lately.",
    explanation: "현재완료 진행형은 'have/has + been + V-ing' 형태입니다. 특히 feel과 같은 감각/상태 동사는 주로 진행형으로 쓰지 않지만, '최근의 일시적인 상태나 변화'를 강조할 때는 현재완료 진행형으로도 즐겨 사용합니다. feel의 경우, '감정의 변화 과정'을 강조하고 싶을 때는 현재완료진행형 사용 가능합니다."
  },
  {
    id: 2, type: 'subjective', section: 'ppc',
    question: "괄호 안의 단어를 알맞은 형태로 쓰세요: Jiho (write) in his diary for six months.",
    answer: "has been writing",
    explanation: "주어가 Jiho(3인칭 단수)이므로 has been writing이 적절합니다."
  },
  {
      id: 3, type: 'choice', section: 'ppc',
      question: "문맥상 알맞은 표현을 고르세요: Somi _______ art for years.",
      options: ["has been loving", "has loved", "is loving", "loves"],
      answer: "has loved",
      explanation: "love, know, like와 같은 감정이나 인지의 상태를 나타내는 대다수의 '상태 동사'는 진행의 의미를 포함하지 않으므로, 현재완료 진행형보다는 현재완료(has loved) 시제로 써야 합니다. 반면 feel, stay 등은 진행형으로 써서 일시적인 상태를 강조할 수 있습니다. (feel의 경우, '감정의 변화 과정'을 강조하고 싶을 때는 현재완료진행형 사용 가능)"
  },
  {
      id: 4, type: 'subjective', section: 'ppc',
      question: "우리말과 같은 뜻이 되도록 빈칸을 채우세요: 나는 최근에 해바라기를 그려오고 있다. (I / paint / sunflowers / lately)",
      answer: "I have been painting sunflowers lately",
      explanation: "lately와 함께 현재완료 진행형을 사용하여 지속되는 동작을 표현합니다."
  },
  {
      id: 5, type: 'choice', section: 'ppc',
      question: "다음 질문에 대한 대답으로 적절한 것은? 'Have you been feeling sad lately?'",
      options: ["Yes, I have felt.", "Yes, I have been.", "Yes, I was.", "Yes, I did."],
      answer: "Yes, I have been.",
      explanation: "Have you been~ 으로 묻는 말에 대한 짧은 대답은 Yes, I have been이 적절합니다."
  },
  // So... That...
  {
    id: 6, type: 'choice', section: 'so_that',
    question: "다음 두 문장을 한 문장으로 바르게 연결한 것은? 'The flower was very beautiful. I took a picture of it.'",
    options: [
      "The flower was so beautiful that I took a picture of it.",
      "The flower was very beautiful that I took a picture of it.",
      "The flower was so beautiful that I took a picture.",
      "The flower was beautiful so that I took a picture of it."
    ],
    answer: "The flower was so beautiful that I took a picture of it.",
    explanation: "so ~ that 구문은 '너무 ~해서 ...하다'라는 인과관계를 나타냅니다."
  },
  {
    id: 7, type: 'subjective', section: 'so_that',
    question: "괄호 안의 단어를 배열하여 완성하세요: I was (that / hours / sleep / out / stressed / it / to / so / took).",
    answer: "so stressed out that it took hours to sleep | so stressed out that it tool hours to sleep",
    explanation: "so + 형용사 + that 구문을 사용하여 인과 관계를 만듭니다."
  },
  {
      id: 8, type: 'choice', section: 'so_that',
      question: "다음 중 어법상 틀린 문장을 고르세요.",
      options: [
          "The brush moved so smoothly that it felt like dreaming.",
          "I am so sad that I can't talk to anyone.",
          "He was such calm that he stayed quiet.",
          "The movie was so good that I saw it twice."
      ],
      answer: "He was such calm that he stayed quiet.",
      explanation: "형용사 calm 앞에는 such가 아니라 so를 써야 합니다."
  },
  {
      id: 9, type: 'subjective', section: 'so_that',
      question: "의미가 같도록 문장을 완성하세요: I moved my brush so smoothly that it felt like dreaming. = I moved my brush too smoothly _____ it to feel like anything else.",
      answer: "for",
      explanation: "too ~ to 구문으로의 변형을 묻는 응용 문제입니다. 하지만 본문의 so ~ that 구문 숙지에 집중하세요."
  },
  {
      id: 10, type: 'choice', section: 'so_that',
      question: "다음 빈칸에 공통으로 들어갈 말은? 'Somi was ____ happy ____ she sang a song.'",
      options: ["too, to", "so, that", "enough, to", "as, as"],
      answer: "so, that",
      explanation: "너무 행복해서 노래를 불렀다는 인과관계를 표현하는 so... that이 적절합니다."
  },
  {
      id: 11, type: 'subjective', section: 'so_that',
      question: "의미가 같도록 빈칸을 채우세요: The problem was so hard that I couldn't solve it. = The problem was ____ ____ ____ solve.",
      answer: "too hard to",
      explanation: "so ~ that ... can't 구문은 too ~ to (+ 동사원형) 구문으로 바꾸어 쓸 수 있습니다. '너무 ~해서 ...할 수 없다'는 뜻입니다."
  },
  {
      id: 12, type: 'choice', section: 'so_that',
      question: "문장의 의미가 같도록 알맞게 바꾼 것은? 'He is so smart that he can follow the rules.'",
      options: [
        "He is too smart to follow the rules.",
        "He is enough smart to follow the rules.",
        "He is smart enough to follow the rules.",
        "He is so smart to follow the rules."
      ],
      answer: "He is smart enough to follow the rules.",
      explanation: "so ~ that ... can 구문은 [형용사/부사 + enough to + 동사원형] 구문으로 바꿀 수 있습니다. '...할 만큼 충분히 ~하다'라는 의미입니다."
  },
  {
      id: 13, type: 'subjective', section: 'so_that',
      question: "다음 문장을 so~that 구문을 사용하여 다시 쓰세요 (can/could 활용): He is strong enough to carry the box.",
      answer: "He is so strong that he can carry the box | He is so strong that he could carry the box",
      explanation: "enough to 구문을 so ~ that ... can 구문으로 바꾼 사례입니다. 주어와 시제에 주의하세요."
  },
  {
      id: 14, type: 'choice', section: 'so_that',
      question: "다음 두 문장의 의미가 같지 않은 것은?",
      options: [
        "I was so tired that I could not walk. / I was too tired to walk.",
        "She is so kind that everyone likes her. / She is kind enough for everyone to like.",
        "It was so dark that I couldn't see anything. / It was enough dark to see nothing.",
        "The water is so clean that you can drink it. / The water is clean enough to drink."
      ],
      answer: "It was so dark that I couldn't see anything. / It was enough dark to see nothing.",
      explanation: "enough는 형용사나 부사 뒤에 위치해야 하므로 'dark enough'가 되어야 합니다."
  },
  {
    id: 15, type: 'choice', section: 'so_that',
    question: "의미가 같은 문장을 고르세요: 'The tea is so hot that I can't drink it.'",
    options: [
      "The tea is too hot to drink it.",
      "The tea is too hot to drink.",
      "The tea is enough hot to drink.",
      "The tea is hot so that I can drink."
    ],
    answer: "The tea is too hot to drink.",
    explanation: "so ~ that ... can't 구문은 'too + 형용사 + to부정사'로 바꿀 수 있습니다. 이때 that절의 목적어(it)가 주어(The tea)와 같으면 to부정사 뒤의 목적어는 생략합니다."
  },
  {
    id: 16, type: 'subjective', section: 'so_that',
    question: "너무 피곤해서 나는 공부를 할 수 없다. (so ~ that 사용): I am ____ tired ____ I ____ study.",
    answer: "so, that, can't",
    explanation: "현재 시제(am)에 맞춰 can't를 써야 합니다."
  },
  {
    id: 17, type: 'choice', section: 'so_that',
    question: "'enough ~ to부정사' 구문을 활용해 바르게 바꾼 것은? 'He is so smart that he can solve the riddle.'",
    options: [
      "He is too smart to solve the riddle.",
      "He is smart enough to solve the riddle.",
      "He is so smart to solve the riddle.",
      "He is smart too to solve the riddle."
    ],
    answer: "He is smart enough to solve the riddle.",
    explanation: "긍정 의미인 'so ~ that ... can'은 'enough to' 구문으로 바꿀 수 있습니다. '형용사 + enough to V' 순서에 주의하세요."
  },
  {
    id: 18, type: 'subjective', section: 'so_that',
    question: "빈칸을 채워 의미가 같은 문장을 만드세요: 'The soup is too salty to eat.' = The soup is ____ salty ____ I ____ eat it.",
    answer: "so, that, can't | so, that, can not",
    explanation: "too ~ to는 부정적인 의미를 내포하므로 so ~ that ... can't로 전환됩니다."
  },
  {
    id: 19, type: 'choice', section: 'so_that',
    question: "어법상 옳은 문장을 고르세요.",
    options: [
      "She is too young to watch the movie.",
      "The water is so dirty that we can drink it.",
      "He was enough brave to save the cat.",
      "I am so tired that I can sleep."
    ],
    answer: "She is too young to watch the movie.",
    explanation: "1번은 '너무 어려서 영화를 볼 수 없다'는 뜻으로 어법상 완벽합니다. 3번은 brave enough가 되어야 합니다."
  }
];

const WRITING_DATA: WritingQuestion[] = [
  // Missions 1-3: Present Perfect Continuous (Focus on the grammar part)
  { 
    id: 1, 
    prefix: "I",
    scrambled: ["have", "been", "feeling"], 
    suffix: "sad lately, so I feel so unhealthy that I need to change.",
    correct: "have been feeling", 
    translation: "나는 최근에 슬픔을 느껴오고 있어서, 너무 건강하지 않다고 느껴 변화가 필요하다.", 
    hint: "have been + V-ing (현재완료 진행형)",
    grammarNote: "상태를 나타내는 동사 feel은 진행형으로 잘 쓰이지 않지만, 최근의 일시적인 감정이나 변화를 강조할 때는 현재완료 진행형(have been feeling)으로 활발하게 사용됩니다. feel의 경우, '감정의 변화 과정'을 강조하고 싶을 때는 현재완료진행형 사용 가능합니다."
  },
  { 
    id: 2, 
    prefix: "I",
    scrambled: ["have", "been", "writing"], 
    suffix: "in this diary for six months to remember the good moments.",
    correct: "have been writing", 
    translation: "나는 좋은 순간들을 기억하기 위해 6개월 동안 이 일기를 써오고 있다.", 
    hint: "have been + V-ing (현재완료 진행형)" 
  },
  { 
    id: 3, 
    prefix: "Lately, I",
    scrambled: ["have", "been", "painting"], 
    suffix: "bright yellow sunflowers because they remind me of happy memories.",
    correct: "have been painting", 
    translation: "최근에 나는 행복한 기억들을 떠올리게 해주기 때문에 밝은 노란색 해바라기를 그려오고 있다.", 
    hint: "have been + V-ing (현재완료 진행형)" 
  },
  // Missions 4-6: So... that... (Focus on the grammar part)
  { 
    id: 4, 
    prefix: "Are you",
    scrambled: ["so", "stressed", "out", "that", "it", "takes"], 
    suffix: "hours to fall asleep?",
    correct: "so stressed out that it takes", 
    translation: "당신은 잠드는 데 몇 시간이 걸릴 정도로 그렇게 스트레스를 받나요?", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 5, 
    prefix: "The flower was",
    scrambled: ["so", "beautiful", "that", "I", "took"], 
    suffix: "a picture of it with my phone.",
    correct: "so beautiful that I took", 
    translation: "그 꽃은 너무 아름다워서 나는 내 휴대폰으로 그것의 사진을 찍었다.", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 6, 
    prefix: "I moved my brush",
    scrambled: ["so", "smoothly", "that", "it", "felt"], 
    suffix: "like I was dreaming.",
    correct: "so smoothly that it felt", 
    translation: "나는 붓을 너무 부드럽게 움직여서 마치 내가 꿈을 꾸고 있는 것처럼 느껴졌다.", 
    hint: "so + 부사 + that + 주어 + 동사" 
  },
  // Missions 7-8: Full Sentence Arrangement
  { 
    id: 7, 
    scrambled: ["I", "express", "my", "emotions", "on", "paper", "so", "that", "I", "can", "let", "go", "of", "negative", "feelings."], 
    correct: "I express my emotions on paper so that I can let go of negative feelings.", 
    translation: "부정적인 감정들을 떨쳐버릴 수 있도록 나는 종이 위에 내 감정들을 표현한다.", 
    hint: "express A on B / so that ~ can / let go of" 
  },
  { 
    id: 8, 
    scrambled: ["By", "filling", "my", "mind", "with", "bright", "colors,", "I", "have", "been", "staying", "positive", "every", "day."], 
    correct: "By filling my mind with bright colors, I have been staying positive every day.", 
    translation: "내 마음을 밝은 색들로 채움으로써, 나는 매일 긍정적으로 지내오고 있다.", 
    hint: "By + V-ing / have been + V-ing",
    grammarNote: "'머물다' 혹은 '어떤 상태를 유지하다'라는 의미의 stay 역시 상태 동사의 성격을 갖지만, 현재완료 진행형(have been staying)으로 쓰여 '최근에 꾸준히 노력하여 특정 상태를 유지하고 있음'을 생동감 있게 강조할 수 있습니다."
  }
];

const READING_DATA: ReadingQuestion[] = [
  // Page 1: Protecting Your Emotional Health
  {
    id: 1, section: 'p1', type: 'choice',
    question: "According to the text, what is the first step to improve your emotional health?",
    question_ko: "본문에 따르면, 정서적 건강을 향상시키기 위한 첫 번째 단계는 무엇인가요?",
    options: ["Exercise every day", "Notice what makes you sad or happy", "Eat healthy meals", "Connect with pets"],
    answer: "Notice what makes you sad or happy",
    explanation: "본문은 정서적 건강을 위해 자신을 슬프거나 기쁘게 만드는 것이 무엇인지 알아차리는 것부터 시작하라고 조언합니다."
  },
  {
    id: 2, section: 'p1', type: 'subjective',
    question: "If you keep negative feelings inside, they can cause problems in your __________. (One word)",
    question_ko: "부정적인 감정을 내면에 담아두면, 당신의 _____에 문제를 일으킬 수 있습니다. (한 단어)",
    answer: "relationships",
    explanation: "부정적인 감정은 사람 사이의 관계(relationships)에 문제를 일으킬 수 있다고 설명합니다."
  },
  {
    id: 3, section: 'p1', type: 'choice',
    question: "Which of the following is NOT mentioned for maintaining physical health?",
    question_ko: "신체적 건강을 유지하기 위해 언급되지 않은 것은 무엇인가요?",
    options: ["Exercising regularly", "Eating healthy meals", "Sleeping enough", "Joining a sports club"],
    answer: "Joining a sports club",
    explanation: "본문은 운동, 식사, 수면을 언급하며, 스포츠 클럽 가입은 직접적인 예시로 나오지 않았습니다."
  },
  {
    id: 4, section: 'p1', type: 'subjective',
    question: "Complete the sentence: Humans are social _______ by nature. (One word)",
    question_ko: "문장을 완성하세요: 인간은 본래 사회적 _____입니다. (한 단어)",
    answer: "animals",
    explanation: "인간은 사회적 동물(social animals)이라는 표현이 사용되었습니다."
  },
  {
    id: 5, section: 'p1', type: 'choice',
    question: "Why is connecting with other people important according to the text?",
    question_ko: "본문에 따르면 다른 사람들과 연결되는 것이 왜 중요한가요?",
    options: ["To get new information", "To improve your emotional health", "To finish school work", "To be famous"],
    answer: "To improve your emotional health",
    explanation: "다른 사람들과의 긍정적인 관계를 맺는 것은 정서적 건강(emotional health)에 필수적입니다."
  },

  // Page 2: Jiho's Case (Gratitude Diary)
  {
    id: 11, section: 'p2_jiho', type: 'choice',
    question: "How long has Jiho been writing a gratitude diary?",
    question_ko: "지호는 얼마나 오랫동안 감사 일기를 써오고 있나요?",
    options: ["For six weeks", "For six months", "Since last year", "For one year"],
    answer: "For six months",
    explanation: "지호는 6개월 동안(for six months) 일기를 써왔다고 언급합니다."
  },
  {
    id: 12, section: 'p2_jiho', type: 'subjective',
    question: "What small thing did Jiho notice blooming between the rocks?",
    question_ko: "지호가 바위 사이에서 피어 있는 어떤 작은 것을 발견했나요?",
    answer: "flower",
    explanation: "지호는 바위 사이에 핀 작은 꽃(flower)을 발견하고 활력을 얻었습니다."
  },
  {
    id: 13, section: 'p2_jiho', type: 'choice',
    question: "What was the result of Jiho remembering good moments in his diary?",
    question_ko: "지호가 일기에 좋은 순간들을 기록한 결과는 무엇이었나요?",
    options: ["He became a famous painter", "He won an art contest", "He feels so thankful that he smiles more often", "He decided to travel around the world"],
    answer: "He feels so thankful that he smiles more often",
    explanation: "일기를 통해 감사함을 느껴 더 자주 웃게 되었다고 말합니다."
  },
  {
    id: 14, section: 'p2_jiho', type: 'subjective',
    question: "Fill in the blank: Jiho used to _____ only on his problems. (One word)",
    question_ko: "빈칸을 채우세요: 지호는 예전에 자신의 문제에만 _____하곤 했습니다.",
    answer: "focus",
    explanation: "예전에는 문제에만 집중(focus)했었다는 과거의 습관을 언급합니다."
  },
  {
    id: 15, section: 'p2_jiho', type: 'choice',
    question: "Choose the correct phrase: Jiho _______ (write) his diary since last year.",
    question_ko: "어법상 알맞은 문구를 고르세요: 지호는 작년부터 일기를 써오고 있다.",
    options: ["has wrote", "writes", "is writing", "has been writing"],
    answer: "has been writing",
    explanation: "기간을 나타내는 since와 함께 지속성을 나타내는 현재완료 진행형이 쓰입니다."
  },
  {
    id: 16, section: 'p2_jiho', type: 'subjective',
    question: "What kind of small things does Jiho include in his journal? (Example: delicious ______)",
    question_ko: "지호는 어떤 사소한 일들을 일기에 포함하나요? (예: 맛있는 _____ )",
    answer: "lunch",
    explanation: "맛있는 점심(lunch) 같은 일상의 사소한 행복을 기록합니다."
  },
  {
    id: 17, section: 'p2_jiho', type: 'choice',
    question: "What is the ultimate result of Jiho's gratitude journal?",
    question_ko: "지호의 감사 일기가 가져온 최종적인 결과는 무엇인가요?",
    options: ["He became a famous writer", "He feels so thankful that he smiles more", "He got better grades in English", "He bought a new journal"],
    answer: "He feels so thankful that he smiles more",
    explanation: "너무 감사함을 느껴서 더 많이 웃게 되었다는 결과가 중요합니다."
  },
  {
    id: 18, section: 'p2_jiho', type: 'subjective',
    question: "Jiho says, 'I feel ____ relaxed ____ I can sleep well.' (Fill the blanks)",
    question_ko: "지호는 '나는 매우 편안함을 느껴서 잠을 잘 수 있다'라고 합니다. (빈칸 채우기)",
    answer: "so that",
    explanation: "so + 형용사 + that 구문을 복습하는 문제입니다."
  },
  {
    id: 19, section: 'p2_jiho', type: 'choice',
    question: "When does Jiho write in his journal?",
    question_ko: "지호는 언제 일기를 쓰나요?",
    options: ["Right after waking up", "During lunch break", "Before going to bed", "While riding the bus"],
    answer: "Before going to bed",
    explanation: "지호는 잠자리에 들기 전 하루를 마무리하며 일기를 씁니다."
  },
  {
    id: 20, section: 'p2_jiho', type: 'subjective',
    question: "According to Jiho, 'Consistency is the ___ to mastering English and happiness.' (One word)",
    question_ko: "지호에 따르면, '꾸준함은 영어와 행복을 정복하는 ____입니다.' (한 단어)",
    answer: "key",
    explanation: "꾸준함(Consistency)이 비결/열쇠(key)라는 뜻입니다."
  },

  // Page 2: Somi's Case (Healing Art)
  {
    id: 21, section: 'p2_somi', type: 'choice',
    question: "What activity does Somi enjoy to release her stress?",
    question_ko: "소미가 스트레스를 해소하기 위해 즐기는 활동은 무엇인가요?",
    options: ["Cooking", "Dancing", "Painting bright pictures", "Playing the violin"],
    answer: "Painting bright pictures",
    explanation: "소미는 밝은 그림을 그리는 것을 '힐링 아트'라고 부르며 즐깁니다."
  },
  {
    id: 22, section: 'p2_somi', type: 'subjective',
    question: "Somi uses various ______ to express her inner feelings. (Write one word)",
    question_ko: "소미는 자신의 내면의 감정을 표현하기 위해 다양한 _____를 사용합니다. (한 단어)",
    answer: "colors",
    explanation: "그림에서 색상(colors)은 감정 표현의 주요 수단입니다."
  },
  {
    id: 23, section: 'p2_somi', type: 'choice',
    question: "Who suggested that Somi try painting as a hobby?",
    question_ko: "누가 소미에게 취미로 그림을 그려보라고 제안했나요?",
    options: ["Her parents", "Her teacher", "Her best friend", "Jiho"],
    answer: "Her teacher",
    explanation: "선생님의 권유로 시작했다는 배경이 본문에 등장합니다."
  },
  {
    id: 24, section: 'p2_somi', type: 'subjective',
    question: "When Somi paints, she feels ____ calm ____ she forgets her stress. (Two words)",
    question_ko: "소미가 그림을 그릴 때, 그녀는 너무 평온함을 느껴 스트레스를 잊습니다. (두 단어)",
    answer: "so that",
    explanation: "결과를 나타내는 so... that 구문입니다."
  },
  {
    id: 25, section: 'p2_somi', type: 'choice',
    question: "Does Somi want to be a professional artist?",
    question_ko: "소미는 전문적인 예술가가 되고 싶어 하나요?",
    options: ["Yes, very much", "No, she just paints for herself", "She is already a professional", "She hasn't decided yet"],
    answer: "No, she just paints for herself",
    explanation: "완벽함이나 전업 작가를 추구하기보다 자신을 위해 그린다고 언급합니다."
  },
  {
    id: 26, section: 'p2_somi', type: 'subjective',
    question: "Somi _______ (paint) 'Healing Art' for six months now. (Use PPC)",
    question_ko: "소미는 6개월 전부터 '힐링 아트'를 그려오고 있다. (현재완료 진행형 사용)",
    answer: "has been painting",
    explanation: "has been + V-ing 형태를 정확히 써야 합니다."
  },
  {
    id: 27, section: 'p2_somi', type: 'choice',
    question: "Why does Somi call her work 'Healing Art'?",
    question_ko: "소미는 왜 자신의 작업을 '힐링 아트'라고 부르나요?",
    options: ["Because she sells it to hospitals", "Because it makes her mind healthy and calm", "Because her teacher told her to", "Because she uses special medicine"],
    answer: "Because it makes her mind healthy and calm",
    explanation: "마음을 건강하고 평온하게 만들어주기 때문에 '힐링'이라는 표현을 씁니다."
  },
  {
    id: 28, section: 'p2_somi', type: 'subjective',
    question: "The colors Somi uses are usually _______ to make her feel happy. (Starting with 'b')",
    question_ko: "소미가 행복감을 느끼기 위해 사용하는 색상들은 대개 _____합니다. ('b'로 시작)",
    answer: "bright",
    explanation: "밝은(bright) 색상들이 긍정적인 감정을 유도합니다."
  },
  {
    id: 29, section: 'p2_somi', type: 'choice',
    question: "What happens to Somi's mind while she is painting?",
    question_ko: "소미가 그림을 그리는 동안 그녀의 마음 상태는 어떠한가요?",
    options: ["It becomes busy", "It becomes noisy", "It becomes calm and peaceful", "It becomes angry"],
    answer: "It becomes calm and peaceful",
    explanation: "평온하고 평화로워진다는(calm and peaceful) 표현이 핵심입니다."
  },
  {
    id: 30, section: 'p2_somi', type: 'subjective',
    question: "Somi says, 'Don't worry about being a ______ artist.' (One word)",
    question_ko: "소미는 '_______ 예술가가 되는 것에 대해 걱정하지 마세요'라고 말합니다. (한 단어)",
    answer: "great",
    explanation: "대단한(great) 예술가가 되어야 한다는 부담을 버리라는 조언입니다."
  },

  // Additional Page 1 Questions (IDs 31-40)
  {
    id: 31, section: 'p1', type: 'choice',
    question: "What is described as a natural part of our lives in the text?",
    question_ko: "본문에서 우리 삶의 자연스러운 부분으로 묘사된 것은 무엇인가요?",
    options: ["Winning a lottery", "Stress", "Failure", "Sleep"],
    answer: "Stress",
    explanation: "스트레스는 우리 삶에서 피할 수 없는 자연스러운 반응으로 설명됩니다."
  },
  {
    id: 32, section: 'p1', type: 'subjective',
    question: "To manage stress well, we should first identify the _______ of it. (One word)",
    question_ko: "스트레스를 잘 관리하려면, 먼저 그것의 ______를 파악해야 합니다. (한 단어)",
    answer: "source",
    explanation: "스트레스의 원인이나 근원(source/cause)을 아는 것이 중요합니다."
  },
  {
    id: 33, section: 'p1', type: 'choice',
    question: "What physical change occurs when we are under stress?",
    question_ko: "우리가 스트레스를 받을 때 어떤 신체적 변화가 일어나나요?",
    options: ["Hair turns blue", "Heart beats faster", "Height increases", "Hunger disappears"],
    answer: "Heart beats faster",
    explanation: "스트레스 상황에서 심장 박동이 빨라지는 신체적 반응이 일어납니다."
  },
  {
    id: 34, section: 'p1', type: 'subjective',
    question: "Positive stress can provide us with the _______ to finish difficult tasks. (One word starting with 'e')",
    question_ko: "긍정적인 스트레스는 어려운 일을 마칠 수 있는 ______를 제공할 수 있습니다. ('e'로 시작하는 한 단어)",
    answer: "energy",
    explanation: "적절한 스트레스는 에너지(energy)와 활력을 줍니다."
  },
  {
    id: 35, section: 'p1', type: 'choice',
    question: "Choose the correct preposition: 'Focus _______ the things you can control.'",
    question_ko: "알맞은 전치사를 고르세요: '당신이 통제할 수 있는 일들에 집중하세요.'",
    options: ["in", "at", "on", "with"],
    answer: "on",
    explanation: "focus on은 '~에 집중하다'라는 뜻의 숙어입니다."
  },
  {
    id: 36, section: 'p1', type: 'subjective',
    question: "When stress is too much, it can _______ our health. (One word starting with 'h')",
    question_ko: "스트레스가 너무 심하면, 우리의 건강을 ______할 수 있습니다. ('h'로 시작하는 한 단어)",
    answer: "harm",
    explanation: "과도한 스트레스는 건강을 해치게(harm) 됩니다."
  },
  {
    id: 37, section: 'p1', type: 'choice',
    question: "Which of the following is NOT mentioned as a stress management tip?",
    question_ko: "다음 중 스트레스 관리 팁으로 언급되지 않은 것은 무엇인가요?",
    options: ["Listening to music", "Taking deep breaths", "Buying expensive things", "Exercising regularly"],
    answer: "Buying expensive things",
    explanation: "본문에서는 음악 감상, 호흡, 운동 등은 권장하지만 쇼핑은 언급되지 않았습니다."
  },
  {
    id: 38, section: 'p1', type: 'subjective',
    question: "The phrase 'so... that' is used to show a _______ and its result. (One word)",
    question_ko: "'so... that' 구문은 ______와 그 결과를 나타내기 위해 사용됩니다. (한 단어)",
    answer: "cause",
    explanation: "원인(cause)과 결과의 관계를 표현할 때 사용하는 구문입니다."
  },
  {
    id: 39, section: 'p1', type: 'choice',
    question: "What is the benefit of deep breathing?",
    question_ko: "심호흡의 이점은 무엇인가요?",
    options: ["It makes you taller", "It calms your body and mind", "It helps you run faster", "It improves your math skills"],
    answer: "It calms your body and mind",
    explanation: "심호흡은 신체와 마음을 진정시키는 효과가 있습니다."
  },
  {
    id: 40, section: 'p1', type: 'subjective',
    question: "Don't let stress _______ your life. (One word starting with 'c')",
    question_ko: "스트레스가 당신의 삶을 ______하게 두지 마세요. ('c'로 시작하는 한 단어)",
    answer: "control",
    explanation: "스트레스가 삶을 지배(control)하지 않도록 관리해야 한다는 메시지입니다."
  },

  // Additional Jiho's Case Questions (IDs 41-45)
  {
    id: 41, section: 'p2_jiho', type: 'choice',
    question: "What kind of entries does Jiho write in his journal?",
    question_ko: "지호는 일기에 어떤 종류의 내용을 적나요?",
    options: ["Negative thoughts", "Things he is thankful for", "Math formulas", "Daily weather"],
    answer: "Things he is thankful for",
    explanation: "지호는 감사 일기를 통해 하루 중 감사한 일들을 기록합니다."
  },
  {
    id: 42, section: 'p2_jiho', type: 'subjective',
    question: "Writing the journal helps Jiho see the _______ side of life. (One word starting with 'p')",
    question_ko: "일기를 쓰는 것은 지호가 삶의 ______인 면을 보게 도와줍니다. ('p'로 시작하는 한 단어)",
    answer: "positive",
    explanation: "감사 일기는 긍정적인(positive) 관점을 갖게 해줍니다."
  },
  {
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
  },
  p2_jiho: {
    title: "Jiho, The Power of a Gratitude Diary (Page 2)",
    text: "I used to focus only on my problems, but everything changed after I started keeping a gratitude diary. I have been writing in this diary for six months to remember the good moments that I experienced during the day. Today, I found a small flower blooming between the rocks in the park. It was so beautiful that I took a picture of it with my phone. Although some people think writing a diary is boring, I believe it is helpful for relieving stress. I have known the power of gratitude for a long time, and it always makes me feel more positive.",
    translation: "저는 오직 제 문제에만 집중하곤 했지만, 감사 일기를 쓰기 시작한 후에 모든 것이 변했습니다. 저는 하루 동안 경험한 좋은 순간들을 기억하기 위해 6개월 동안 이 일기를 써왔습니다. 오늘, 저는 공원의 바위들 사이에서 피어난 작은 꽃을 발견했습니다. 그것은 너무 아름다워서 저는 휴대폰으로 사진을 찍었습니다. 비록 어떤 사람들은 일기를 쓰는 것이 지루하다고 생각하지만, 저는 그것이 스트레스를 해소하는 데 도움이 된다고 믿습니다. 저는 오랫동안 감사의 힘을 알고 있었고, 그것은 항상 저를 더 긍정적으로 느끼게 해줍니다."
  },
  p2_somi: {
    title: "Somi, Painting My Emotions (Page 2)",
    text: "Whenever I feel down, I grab a brush and paint something. To me, colors are like feelings that can express my inner world. Lately, I have been painting bright yellow sunflowers because they remind me of happy memories. Yesterday, I worked on my painting for hours. I moved my brush so smoothly that it felt like I was dreaming. Since I have loved art for years, I consider painting one of my greatest comforts. By expressing my emotions on paper, I can let go of negative feelings and fill my mind with bright colors.",
    translation: "기분이 울적할 때마다, 저는 붓을 잡고 무언가를 그립니다. 저에게 색채란 제 내면 세계를 표현할 수 있는 감정과 같습니다. 최근에 저는 행복한 기억들을 떠올리게 해주기 때문에 밝은 노란색 해바라기를 그려오고 있습니다. 어제, 저는 몇 시간 동안 그림을 그렸습니다. 저는 붓을 너무 부드럽게 움직여서 마치 꿈을 꾸는 것처럼 느껴졌습니다. 수년 동안 예술을 사랑해왔기 때문에, 저는 그림 그리기를 저의 가장 큰 위안 중 하나로 여깁니다. 종이 위에 제 감정을 표현함으로써, 저는 부정적인 감정들을 떨쳐내고 마음을 밝은 색들로 채울 수 있습니다."
  }
};

const normalizeStr = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.?!, ]+$/, '') // Remove trailing punctuation and spaces
    .replace(/\s+/g, ' '); // Standardize internal spaces
};

const checkSubjectiveAnswer = (userInput: string, expectedAnswer: string, questionText?: string) => {
  const normUser = normalizeStr(userInput);
  const possibleAnswers = expectedAnswer.split('|').map(s => s.trim());
  
  for (const exp of possibleAnswers) {
    const normExpected = normalizeStr(exp);
    if (normUser === normExpected) return true;
    
    // Try comma-less version of expected answer (e.g. "so, that" -> "so that")
    const normExpectedNoComma = normalizeStr(exp.replace(/,/g, ' '));
    if (normUser === normExpectedNoComma) return true;

    // Try reconstruction from question if placeholders exist
    if (questionText) {
      const targetPart = questionText.includes('=') ? questionText.split('=')[1] : null;
      if (targetPart) {
        const answerParts = exp.split(/[,/ ]+/).filter(s => s.trim().length > 0);
        let reconstructed = targetPart.trim();
        answerParts.forEach(p => {
          reconstructed = reconstructed.replace(/_{2,}/, p);
        });
        if (normalizeStr(reconstructed) === normUser) return true;
      }
    }
  }
  
  return false;
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [vocabQuizConfig, setVocabQuizConfig] = useState<{ section: 'all' | 'p1' | 'p2_jiho' | 'p2_somi', count: number }>({ section: 'all', count: 10 });

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const navTo = (section: Section) => {
    setActiveSection(section);
    setScore(0);
    setIsFinished(false);
  };

  // --- Views ---

  // Views moved outside App component to prevent unmount/remount on state changes
  return (
    <div className="flex h-screen bg-[#2D3748] font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-96 bg-[#2D3748] p-10 flex flex-col h-full border-r border-white/5 relative z-20">
        <div className="flex items-center space-x-4 mb-16 pl-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10">
            <Award className="text-[#4C51BF]" size={30} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-widest leading-none">GRACE's</h1>
            <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">English Class</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarBtn icon={<Zap size={20} />} label="대시보드" active={activeSection === 'dashboard'} onClick={() => navTo('dashboard')} />
          <SidebarBtn icon={<Brain size={20} />} label="어휘마스터" active={activeSection === 'vocab' || activeSection === 'vocabQuiz'} onClick={() => navTo('vocab')} />
          <div className="pt-6 pb-2">
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-6 mb-4">Core Training</p>
             <div className="space-y-2">
                <button 
                  onClick={() => navTo('grammar_ppc')}
                  className={`w-full flex items-center gap-4 px-8 py-3 rounded-2xl font-bold transition-all ${activeSection === 'grammar_ppc' ? "bg-indigo-500/20 text-white" : "text-white/40 hover:text-white"}`}
                >
                   <div className={`w-2 h-2 rounded-full ${activeSection === 'grammar_ppc' ? "bg-indigo-400" : "bg-white/10"}`}></div>
                   현재완료 진행형
                </button>
                <button 
                  onClick={() => navTo('grammar_so_that')}
                  className={`w-full flex items-center gap-4 px-8 py-3 rounded-2xl font-bold transition-all ${activeSection === 'grammar_so_that' ? "bg-indigo-500/20 text-white" : "text-white/40 hover:text-white"}`}
                >
                   <div className={`w-2 h-2 rounded-full ${activeSection === 'grammar_so_that' ? "bg-indigo-400" : "bg-white/10"}`}></div>
                   SO ~ THAT 구문
                </button>
             </div>
          </div>
          <SidebarBtn icon={<PenTool size={20} />} label="영작 트레이닝" active={activeSection === 'writing'} onClick={() => navTo('writing')} />
          <div className="pt-6 pb-2">
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-6 mb-4">Text Analysis</p>
             <div className="space-y-2">
                <button 
                  onClick={() => navTo('reading_p1')}
                  className={`w-full flex items-center gap-4 px-8 py-3 rounded-2xl font-bold transition-all ${activeSection === 'reading_p1' ? "bg-emerald-500/20 text-white" : "text-white/40 hover:text-white"}`}
                >
                   <div className={`w-2 h-2 rounded-full ${activeSection === 'reading_p1' ? "bg-emerald-400" : "bg-white/10"}`}></div>
                   Emotional Health (Page 1)
                </button>
                <button 
                  onClick={() => navTo('reading_p2_jiho')}
                  className={`w-full flex items-center gap-4 px-8 py-3 rounded-2xl font-bold transition-all ${activeSection === 'reading_p2_jiho' ? "bg-emerald-500/20 text-white" : "text-white/40 hover:text-white"}`}
                >
                   <div className={`w-2 h-2 rounded-full ${activeSection === 'reading_p2_jiho' ? "bg-emerald-400" : "bg-white/10"}`}></div>
                   Jiho: Gratitude (Page 2)
                </button>
                <button 
                  onClick={() => navTo('reading_p2_somi')}
                  className={`w-full flex items-center gap-4 px-8 py-3 rounded-2xl font-bold transition-all ${activeSection === 'reading_p2_somi' ? "bg-emerald-500/20 text-white" : "text-white/40 hover:text-white"}`}
                >
                   <div className={`w-2 h-2 rounded-full ${activeSection === 'reading_p2_somi' ? "bg-emerald-400" : "bg-white/10"}`}></div>
                   Somi: Healing Art (Page 2)
                </button>
             </div>
          </div>
        </nav>

        <div className="mt-auto space-y-6">
           <div className="bg-[#3C366B] p-6 rounded-3xl border border-white/10 shadow-inner">
             <p className="text-[10px] text-white/50 mb-3 uppercase tracking-[0.2em] font-black">나의 학습 현황</p>
             <div className="flex justify-between items-end mb-4">
               <span className="text-4xl font-black text-white tracking-tighter">84%</span>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#F6AD55] font-black uppercase">Lv. 12 챌린저</span>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-1 rounded-full ${i <= 4 ? "bg-[#ECC94B]" : "bg-white/10"}`}></div>)}
                  </div>
               </div>
             </div>
             <div className="w-full bg-[#2D3748] h-3 rounded-full overflow-hidden shadow-inner">
               <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="bg-gradient-to-r from-[#ECC94B] to-[#F6AD55] h-full rounded-full shadow-[0_0_10px_rgba(236,201,75,0.5)]"></motion.div>
             </div>
           </div>
           <p className="text-center text-white/30 text-[10px] font-bold italic">© 2026 GRACE's English Class</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F7F9FC]">
        {/* Header bar */}
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-orange-200">LESSON 3</span>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter">Be Positive, Be Happy</h1>
            </div>
            <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="text-sm font-bold text-slate-400 hidden md:block uppercase tracking-widest">Section: {activeSection.toUpperCase()}</div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-2xl border-4 border-white bg-[#4C51BF] flex items-center justify-center text-white font-black text-xs shadow-md">J</div>
              <div className="w-10 h-10 rounded-2xl border-4 border-white bg-[#F6AD55] flex items-center justify-center text-white font-black text-xs shadow-md">S</div>
              <div className="w-10 h-10 rounded-2xl border-4 border-white bg-[#34D399] flex items-center justify-center text-white font-black text-xs shadow-md">M</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-tighter">Today's Streak</span>
              <span className="text-lg font-black text-slate-800 leading-none">🔥 14 DAYS</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="p-12">
          <AnimatePresence mode="wait">
             <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
             >
                {activeSection === 'dashboard' && (
                  <DashboardView 
                    navTo={navTo} 
                  />
                )}
                {activeSection === 'vocab' && <VocabView navTo={navTo} setVocabQuizConfig={setVocabQuizConfig} setIsFinished={setIsFinished} setScore={setScore} handleSpeak={handleSpeak} />}
                {activeSection === 'vocabQuiz' && (
                  <VocabQuizView 
                    isFinished={isFinished}
                    setIsFinished={setIsFinished}
                    score={score}
                    setScore={setScore}
                    vocabQuizConfig={vocabQuizConfig}
                    navTo={navTo}
                    handleSpeak={handleSpeak}
                  />
                )}
                {(activeSection === 'grammar_ppc' || activeSection === 'grammar_so_that') && (
                  <GrammarView 
                    activeSection={activeSection}
                    isFinished={isFinished}
                    setIsFinished={setIsFinished}
                    score={score}
                    setScore={setScore}
                    navTo={navTo}
                    handleSpeak={handleSpeak}
                  />
                )}
                {activeSection === 'writing' && (
                  <WritingView 
                    score={score}
                    setScore={setScore}
                    setIsFinished={setIsFinished}
                    navTo={navTo}
                    handleSpeak={handleSpeak}
                  />
                )}
                {(activeSection === 'reading_p1' || activeSection === 'reading_p2_jiho' || activeSection === 'reading_p2_somi') && (
                  <ReadingView 
                    activeSection={activeSection}
                    isFinished={isFinished}
                    setIsFinished={setIsFinished}
                    score={score}
                    setScore={setScore}
                    navTo={navTo}
                    handleSpeak={handleSpeak}
                  />
                )}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Views ---

const VocabView = ({ 
  navTo, 
  setVocabQuizConfig, 
  setIsFinished, 
  setScore,
  handleSpeak
}: { 
  navTo: (s: Section) => void;
  setVocabQuizConfig: (c: { section: 'all' | 'p1' | 'p2_jiho' | 'p2_somi', count: number }) => void;
  setIsFinished: (v: boolean) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  handleSpeak: (t: string) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'p1' | 'p2_jiho' | 'p2_somi'>('all');

  const filteredData = useMemo(() => {
    if (selectedTab === 'all') return VOCAB_DATA;
    return VOCAB_DATA.filter(word => word.section === selectedTab);
  }, [selectedTab]);

  const tabs = [
    { id: 'all', label: '전체 어휘', icon: <BookOpen size={18} /> },
    { id: 'p1', label: '1페이지 (Emotional Health)', icon: <Smile size={18} /> },
    { id: 'p2_jiho', label: '2페이지 (Jiho)', icon: <FileText size={18} /> },
    { id: 'p2_somi', label: '2페이지 (Somi)', icon: <PenTool size={18} /> },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">VOCABULARY MASTER</h2>
          <p className="text-slate-500 font-bold text-xl uppercase tracking-widest pl-1">핵심 어휘 50가지 완벽 정복</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button 
            onClick={() => {
              let count = 10;
              if (selectedTab === 'all') count = 20;
              else if (selectedTab === 'p1') count = 10;
              else count = 5;
              setVocabQuizConfig({ section: selectedTab, count });
              setIsFinished(false);
              setScore(0);
              navTo('vocabQuiz');
            }}
            className="bg-[#4C51BF] hover:bg-[#3C366B] text-white px-8 py-4 rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-3 mr-4"
          >
            QUIZ START <Zap size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-[32px] w-fit overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[24px] font-bold transition-all whitespace-nowrap ${
              selectedTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredData.map((item) => (
          <motion.div 
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, rotate: 1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-2xl flex items-center justify-center text-slate-200 text-[10px] font-black">
              #{String(item.id).padStart(2, '0')}
            </div>
            <div className="relative z-10 font-black">
              <p className={`text-[10px] uppercase tracking-widest mb-2 italic ${
                item.section === 'p1' ? 'text-emerald-500' :
                item.section === 'p2_jiho' ? 'text-amber-500' : 'text-indigo-500'
              }`}>
                {item.section === 'p1' ? 'Emotional Health' :
                 item.section === 'p2_jiho' ? 'Jiho\'s Case' : 'Somi\'s Case'}
              </p>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-3xl text-slate-800 truncate group-hover:text-indigo-600 transition-colors tracking-tighter">
                  {item.word}
                </h3>
                <button 
                  onClick={() => handleSpeak(item.word)}
                  className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all active:scale-90"
                  title="발음 듣기"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="text-xl text-slate-500 font-bold mb-6 underline decoration-indigo-100 underline-offset-4">{item.meaning}</p>
              <button 
                onClick={() => handleSpeak(item.example)}
                className="w-full text-left bg-slate-50/80 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group/example"
              >
                <div className="flex gap-2">
                  <p className="text-sm italic text-slate-400 font-medium leading-relaxed group-hover/example:text-slate-600 transition-colors flex-1">"{item.example}"</p>
                  <Volume2 size={12} className="text-slate-300 group-hover/example:text-indigo-400 mt-1 shrink-0" />
                </div>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
const VocabQuizView = ({
  isFinished, 
  setIsFinished, 
  score, 
  setScore, 
  vocabQuizConfig, 
  navTo, 
  handleSpeak 
}: { 
  isFinished: boolean;
  setIsFinished: (v: boolean) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  vocabQuizConfig: { section: string; count: number };
  navTo: (s: Section) => void;
  handleSpeak: (t: string) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quizData, setQuizData] = useState(() => {
    const filtered = vocabQuizConfig.section === 'all' 
      ? VOCAB_DATA 
      : VOCAB_DATA.filter(v => v.section === vocabQuizConfig.section);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, vocabQuizConfig.count);
  });
  const [options, setOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isAnswered && selectedIdx !== null) {
      const isCorrect = options[selectedIdx] === quizData[currentIdx].meaning;
      const delay = isCorrect ? 1500 : 3000; 
      const timer = setTimeout(() => {
        handleNext();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, selectedIdx]);

  useEffect(() => {
    if (currentIdx < quizData.length) {
      const correct = quizData[currentIdx].meaning;
      const others = VOCAB_DATA
        .filter(v => v.meaning !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.meaning);
      setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    }
  }, [currentIdx, quizData]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    const isCorrect = options[idx] === quizData[currentIdx].meaning;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedIdx(null);
    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) return (
    <ResultCard 
      score={score} 
      total={quizData.length} 
      onRestart={() => {
        setIsFinished(false);
        setCurrentIdx(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedIdx(null);
        const filtered = vocabQuizConfig.section === 'all' 
          ? VOCAB_DATA 
          : VOCAB_DATA.filter(v => v.section === vocabQuizConfig.section);
        setQuizData([...filtered].sort(() => Math.random() - 0.5).slice(0, vocabQuizConfig.count));
      }} 
      onGoHome={() => navTo('dashboard')} 
    />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <motion.div 
             initial={{ width: 0 }} 
             animate={{ width: `${((currentIdx + 1) / quizData.length) * 100}%` }} 
             className="h-full bg-indigo-500"
          ></motion.div>
        </div>
        <div className="flex justify-between items-center mb-10">
           <span className="bg-indigo-100 text-indigo-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-1">
             QUESTION 
             <AnimatePresence mode="wait">
               <motion.span 
                 key={currentIdx}
                 initial={{ y: 10, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: -10, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className="inline-block min-w-[1.2rem] text-center"
               >
                 {currentIdx + 1}
               </motion.span>
             </AnimatePresence>
             /{quizData.length}
           </span>
           <button 
              onClick={handleNext}
              className="text-slate-400 hover:text-indigo-600 font-black text-sm transition-colors flex items-center gap-1 group"
           >
              SKIP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">What is the meaning of:</p>
        <h3 className="text-7xl font-black text-slate-800 tracking-tighter mb-12 italic">"{quizData[currentIdx].word}"</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`p-8 text-2xl font-black rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${
                isAnswered
                  ? opt === quizData[currentIdx].meaning
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100"
                    : selectedIdx === i
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100"
                      : "bg-white border-slate-100 text-slate-300"
                  : "bg-white border-slate-100 text-slate-700 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <span>{opt}</span>
              {isAnswered && opt === quizData[currentIdx].meaning && <CheckCircle2 className="text-emerald-500" />}
              {!isAnswered && <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-indigo-300" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-end"
            >
              <button 
                onClick={handleNext}
                className="bg-slate-800 text-white px-12 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 shadow-2xl hover:bg-black transition-all active:scale-95"
              >
                {currentIdx === quizData.length - 1 ? "FINISH MISSION" : "NEXT LEVEL"} <ChevronRight size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-4 p-4 rounded-3xl transition-all font-bold tracking-tight text-lg group w-full text-left ${
        active 
          ? "bg-[#667EEA] text-white shadow-xl shadow-indigo-700/20 translate-x-1" 
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className={`transition-transform group-hover:scale-110 ${active ? "text-white" : "text-indigo-300"}`}>{icon}</span>
      <span>{label}</span>
      {active && <motion.div layoutId="sidebar-active" className="ml-auto w-2 h-2 bg-white rounded-full"></motion.div>}
    </button>
  );
}

function MenuCard({ title, tagline, variant, accent, icon, onClick }: { title: string; tagline: string; variant: 'white' | 'slate' | 'amber'; accent: 'purple' | 'indigo' | 'orange' | 'emerald'; icon: React.ReactNode; onClick: () => void }) {
  const themes = {
    white: "bg-white border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)]",
    slate: "bg-[#EDF2F7] border-slate-200 border-2 border-dashed",
    amber: "bg-amber-50 border-amber-100 shadow-sm"
  };

  const accentColors = {
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600"
  };

  const iconBg = {
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    orange: "bg-orange-600",
    emerald: "bg-[#34D399]"
  };

  return (
    <button 
      onClick={onClick}
      className={`group relative p-10 rounded-[40px] border transition-all text-left flex flex-col justify-between h-80 hover:shadow-2xl hover:-translate-y-2 ${themes[variant]}`}
    >
      <div className="space-y-6">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${iconBg[accent]}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter">{title}</h3>
          <p className="text-slate-500 font-bold leading-snug">{tagline}</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 p-1 px-4 rounded-full self-start font-black text-xs transition-colors group-hover:bg-white group-hover:shadow-md ${accentColors[accent]}`}>
        START MISSION <ChevronRight size={14} />
      </div>
      <div className="absolute top-6 right-8 opacity-5 scale-150 grayscale pointer-events-none">{icon}</div>
    </button>
  );
}

function ResultCard({ score, total, onRestart, onGoHome }: { score: number; total: number; onRestart: () => void; onGoHome: () => void }) {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center space-y-8 bg-white p-12 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
      <div className="relative inline-block mt-4">
        <div className="w-40 h-40 rounded-full border-[12px] border-slate-50 flex items-center justify-center bg-white shadow-inner">
          <span className="text-5xl font-black text-indigo-600 tracking-tighter">{percentage}%</span>
        </div>
        <motion.div 
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-4 -right-4 bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white"
        >
          <Trophy className="text-white" size={30} />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter underline decoration-indigo-200 underline-offset-8">MISSION COMPLETED</h2>
        <p className="text-slate-500 font-bold text-lg leading-tight">
          당신은 <span className="font-extrabold text-indigo-600 block text-2xl mt-1">{total}문제 중 {score}문제를 맞췄습니다!</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button 
          onClick={onRestart}
          className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-3 active:scale-95"
        >
          <RotateCcw size={24} /> 한 번 더 도전하기
        </button>
        <button 
          onClick={onGoHome}
          className="w-full py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition active:scale-95"
        >
          메뉴로 돌아가기
        </button>
      </div>
    </motion.div>
  );
}


  const GrammarView = ({ activeSection, setScore, isFinished, setIsFinished, score, navTo, handleSpeak }: { activeSection: Section; setScore: React.Dispatch<React.SetStateAction<number>>; isFinished: boolean; setIsFinished: (v: boolean) => void; score: number; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const isPpc = activeSection === 'grammar_ppc';
    const sectionKey = isPpc ? 'ppc' : 'so_that';
    const filteredQuestions = GRAMMAR_DATA.filter(q => q.section === sectionKey);
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
      if (feedback && feedback.isCorrect) {
        const delay = 1500;
        const timer = setTimeout(() => {
          handleNext();
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [feedback]);

    const handleSubmitSubjective = () => {
      if (feedback) return;
      const q = filteredQuestions[currentQuestion];
      const isCorrect = checkSubjectiveAnswer(inputValue, q.answer, q.question);
      
      if (isCorrect) setScore(prev => prev + 1);
      setFeedback({ isCorrect, explanation: q.explanation });
    };

    const handleChoiceAnswer = (ans: string) => {
      if (feedback) return;
      const isCorrect = ans === filteredQuestions[currentQuestion].answer;
      if (isCorrect) setScore(prev => prev + 1);
      setFeedback({ isCorrect, explanation: filteredQuestions[currentQuestion].explanation });
    };

    const handleNext = () => {
      setFeedback(null);
      setInputValue('');
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    };

    if (showIntro) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <span className="inline-block bg-indigo-100 text-indigo-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-[0.2em] mb-8">Concept Review</span>
              <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-6 leading-tight">
                {isPpc ? "Present Perfect Continuous" : "So ... That ... Clause"}
              </h2>
              <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 mb-10">
                {isPpc ? (
                  <div className="space-y-6 text-xl font-bold text-slate-600 leading-relaxed">
                    <p className="flex items-start gap-4"><Star className="text-orange-400 shrink-0 mt-1" size={24} /> <span className="block italic">형태: have/has + been + V-ing</span></p>
                    <p className="flex items-start gap-4"><Star className="text-orange-400 shrink-0 mt-1" size={24} /> <span className="block italic">의미: 과거에 시작된 동작이 현재까지 지속됨을 강조 (~해오고 있다)</span></p>
                    <div className="flex items-start gap-4 text-rose-600 bg-rose-50 p-6 rounded-[30px] border border-rose-100 shadow-sm">
                      <AlertCircle className="shrink-0 mt-1" size={20} /> 
                      <div className="text-[15px] font-black space-y-3 w-full">
                        <p className="text-rose-700">상태를 나타내는 동사는 진행형으로 쓸 수 없으므로 현재완료(have p.p.)를 사용합니다.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-600 bg-white/50 p-4 rounded-2xl">
                          <p>• 감정: like, hate, prefer</p>
                          <p>• 인식: understand, believe, think, remember, forget</p>
                          <p>• 감각: feel, smell, taste, sound</p>
                          <p>• 소유: own, have, belong to</p>
                          <p>• 상태: be, exist</p>
                        </div>
                        <p className="text-slate-400 italic text-sm mt-2">
                          (예: I have been knowing her. (X) → I have known her. (O))
                        </p>
                      </div>
                    </div>
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl mt-4 italic shadow-lg">예: Claire has been sleeping since nine.</div>
                  </div>
                ) : (
                  <div className="space-y-6 text-xl font-bold text-slate-600 leading-relaxed">
                    <p className="flex items-start gap-4"><Star className="text-orange-400 shrink-0 mt-1" size={24} /> <span className="block italic">형태: so + 형용사/부사 + that + 주어 + 동사</span></p>
                    <p className="flex items-start gap-4"><Star className="text-orange-400 shrink-0 mt-1" size={24} /> <span className="block italic">의미: 너무 ~해서 ...하다 (인과관계 표현)</span></p>
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl mt-4 italic shadow-lg mb-4">예: He was so busy that he forgot his lunch.</div>
                    
                    <div className="h-px bg-slate-200 my-4"></div>
                    
                    <p className="flex items-start gap-4"><Star className="text-indigo-400 shrink-0 mt-1" size={24} /> <span className="block italic underline decoration-indigo-200 underline-offset-4">상황별 문장 전환 (중요!)</span></p>
                    <div className="space-y-4 pl-10 text-base">
                      <div className="text-slate-500 leading-snug">
                        <p className="font-black text-rose-600 mb-1">1. 부정적 결과 (so ~ that ... can't)</p>
                        <p>→ **too + 형용사 + to-부정사** ('너무 ~해서 ...할 수 없다')</p>
                        <p className="text-xs text-rose-400 italic mt-1 font-medium">* The tea is so hot that I can't drink it. = The tea is too hot to drink.</p>
                      </div>
                      <div className="text-slate-500 leading-snug">
                        <p className="font-black text-emerald-600 mb-1">2. 긍정적 결과 (so ~ that ... can)</p>
                        <p>→ **형용사 + enough + to-부정사** ('~할 정도로 충분히 ...하다')</p>
                        <p className="text-xs text-emerald-400 italic mt-1 font-medium">* He is so smart that he can solve it. = He is smart enough to solve it.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowIntro(false)}
                className="w-full py-6 rounded-3xl bg-[#4C51BF] text-white font-black text-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition flex items-center justify-center gap-4 group"
              >
                MISSION START <ArrowRight className="group-hover:translate-x-3 transition-transform" size={28} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (isFinished) return (
      <ResultCard 
        score={score} 
        total={filteredQuestions.length} 
        onRestart={() => {
          setIsFinished(false);
          setCurrentQuestion(0);
          setFeedback(null);
          setScore(0);
          setInputValue('');
        }} 
        onGoHome={() => navTo('dashboard')} 
      />
    );

    const q = filteredQuestions[currentQuestion];

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }} className="h-full bg-indigo-500"></motion.div>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-500 px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-1">
                QUESTION 
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={currentQuestion}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block min-w-[1rem] text-center"
                  >
                    {currentQuestion + 1}
                  </motion.span>
                </AnimatePresence>
                /{filteredQuestions.length}
              </span>
              <button 
                onClick={handleNext}
                className="text-slate-300 hover:text-indigo-600 font-black text-xs transition-colors py-1 px-3 rounded-lg hover:bg-indigo-50"
              >
                SKIP
              </button>
            </div>
            <div className="flex items-center gap-2">
               <Trophy size={20} className="text-yellow-500" />
               <span className="font-black text-slate-400 text-sm">SCORE: {score}</span>
            </div>
          </div>

          <div className="space-y-10 flex-1">
             <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tighter italic">
                    Q: {q.question}
                  </h3>
                  <button 
                    onClick={() => handleSpeak(q.question)}
                    className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all active:scale-90 shrink-0"
                    title="Listen to question"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
                {q.question_ko && (
                  <p className="text-xl font-bold text-slate-400">
                    질문: {q.question_ko}
                  </p>
                )}
             </div>

             {q.type === 'choice' ? (
                <div className="grid grid-cols-1 gap-4">
                   {q.options?.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={feedback === null ? { scale: 1.02, x: 10 } : {}}
                        whileTap={feedback === null ? { scale: 0.98 } : {}}
                        onClick={() => handleChoiceAnswer(opt)}
                        disabled={feedback !== null}
                        className={`p-6 rounded-3xl text-left font-black text-xl border-2 transition-all flex items-center justify-between group ${
                          feedback === null 
                            ? "bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700" 
                            : feedback.isCorrect && opt === q.answer 
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                              : !feedback.isCorrect && opt === q.answer 
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                : !feedback.isCorrect && inputValue === opt
                                  ? "bg-rose-50 border-rose-500 text-rose-700"
                                  : "bg-white border-slate-100 text-slate-300 opacity-50"
                        }`}
                      >
                         <span>{opt}</span>
                         {feedback === null && <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-indigo-400" />}
                      </motion.button>
                   ))}
                </div>
             ) : (
                <div className="space-y-6">
                   <div className="relative">
                      <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your answer here..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitSubjective()}
                        disabled={feedback !== null}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-2xl font-black text-slate-700 placeholder:text-slate-200 focus:outline-none focus:border-indigo-300 focus:bg-white transition-all shadow-inner"
                      />
                      {!feedback && (
                        <button 
                          onClick={handleSubmitSubjective}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition active:scale-90"
                        >
                          <Send size={24} />
                        </button>
                      )}
                   </div>
                   <p className="text-center text-slate-300 font-bold text-sm italic">
                     * 대소문자나 문장 부호(마침표 등)는 채점에 영향을 주지 않습니다.
                   </p>
                </div>
             )}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`mt-8 p-10 rounded-[40px] border-4 ${
                  feedback.isCorrect 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100" 
                    : "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100"
                } shadow-2xl relative overflow-hidden`}
              >
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${feedback.isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}>
                        {feedback.isCorrect ? <CheckCircle2 className="text-white" size={32} /> : <AlertCircle className="text-white" size={32} />}
                      </div>
                      <div>
                        <h4 className="text-3xl font-black tracking-tighter uppercase">{feedback.isCorrect ? "Perfect! ✨" : "Check Again! 💪"}</h4>
                        {!feedback.isCorrect && <p className="text-lg font-bold opacity-80 mt-1">정답: {q.answer}</p>}
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow-inner">
                      <p className="text-lg font-bold leading-relaxed">{feedback.explanation}</p>
                    </div>
                    <button 
                      onClick={handleNext}
                      className={`mt-8 w-full py-5 rounded-2xl font-black text-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-3 ${
                        feedback.isCorrect 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200" 
                          : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200"
                      }`}
                    >
                      {currentQuestion === filteredQuestions.length - 1 ? "FINISH MODULE" : "NEXT STEP"} <ChevronRight size={24} />
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };
  const WritingView = ({ score, setScore, setIsFinished, navTo, handleSpeak }: { score: number; setScore: React.Dispatch<React.SetStateAction<number>>; setIsFinished: (v: boolean) => void; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [userOrder, setUserOrder] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<boolean | null>(null);
    const [showMyStory, setShowMyStory] = useState(false);
    const [isTypingMode, setIsTypingMode] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState('');

    useEffect(() => {
      if (feedback === true) {
        const delay = 2500;
        const timer = setTimeout(() => {
          nextLevel();
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [feedback]);

    useEffect(() => {
      if (!isTypingMode && scrambled.length === 0 && userOrder.length > 0 && feedback === null) {
        checkAnswer();
      }
    }, [scrambled, userOrder, feedback, isTypingMode]);

    useEffect(() => {
      if (currentIdx < WRITING_DATA.length) {
        setScrambled([...WRITING_DATA[currentIdx].scrambled].sort(() => Math.random() - 0.5));
        setUserOrder([]);
        setFeedback(null);
        setTypedAnswer('');
      }
    }, [currentIdx]);

    const handleWordClick = (word: string, fromUser: boolean) => {
      if (feedback !== null) return;
      if (fromUser) {
        setUserOrder(prev => {
          const newOrder = [...prev];
          const lastIdx = newOrder.lastIndexOf(word);
          if (lastIdx !== -1) newOrder.splice(lastIdx, 1);
          return newOrder;
        });
        setScrambled(prev => [...prev, word]);
      } else {
        setScrambled(prev => {
          const newScrambled = [...prev];
          const idx = newScrambled.indexOf(word);
          if (idx !== -1) newScrambled.splice(idx, 1);
          return newScrambled;
        });
        setUserOrder(prev => [...prev, word]);
      }
    };

    const checkAnswer = () => {
      const q = WRITING_DATA[currentIdx];
      let isCorrect = false;
      
      if (isTypingMode) {
        const fullSent = `${q.prefix || ""} ${q.correct} ${q.suffix || ""}`;
        isCorrect = checkSubjectiveAnswer(typedAnswer, fullSent) || 
                    checkSubjectiveAnswer(typedAnswer, q.correct);
      } else {
        isCorrect = normalizeStr(userOrder.join(' ')) === normalizeStr(q.correct);
      }
      
      setFeedback(isCorrect);
      if (isCorrect) setScore(prev => prev + 1);
    };

    const nextLevel = () => {
      setFeedback(null);
      if (currentIdx < WRITING_DATA.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setShowMyStory(true);
      }
    };

    if (showMyStory) return <MyStoryView handleSpeak={handleSpeak} navTo={navTo} />;

    const q = WRITING_DATA[currentIdx];

    return (
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 flex flex-col min-h-[850px] relative overflow-visible">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
             <motion.div initial={{ width: 0 }} animate={{ width: `${((currentIdx + 1) / WRITING_DATA.length) * 100}%` }} className="h-full bg-orange-500"></motion.div>
          </div>

          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-3">
               <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">Writing Mission</span>
               <span className="text-slate-300 font-bold tracking-widest uppercase text-xs">Sentence {currentIdx + 1}/{WRITING_DATA.length}</span>
               <button 
                onClick={nextLevel}
                className="ml-4 text-slate-400 hover:text-orange-600 font-black text-xs transition-colors py-1 px-3 rounded-lg hover:bg-orange-50"
               >
                SKIP
               </button>
               <button 
                onClick={() => setIsTypingMode(!isTypingMode)}
                className={`ml-2 font-black text-xs py-1 px-3 rounded-lg transition-all ${isTypingMode ? "bg-orange-600 text-white" : "text-slate-400 hover:bg-orange-50"}`}
               >
                {isTypingMode ? "USE BLOCKS" : "TYPE ANSWER"}
               </button>
             </div>
             <div className="flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                <span className="font-black text-slate-400 text-sm">SCORE: {score}</span>
             </div>
          </div>

          <div className="space-y-12 flex-1">
             <div className="space-y-6 text-center">
                <p className="text-4xl font-black text-slate-800 tracking-tighter leading-tight">
                  "{q.translation}"
                </p>
                <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold bg-indigo-50 py-3 px-6 rounded-2xl border border-indigo-100 inline-block mx-auto">
                   <Star size={18} /> {q.hint}
                </div>
             </div>

             <div className="space-y-8">
                {/* Answer Area */}
                <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-dashed border-slate-200 min-h-[140px] flex flex-wrap gap-x-3 gap-y-4 justify-center items-center shadow-inner relative group">
                   {isTypingMode ? (
                     <input 
                       type="text"
                       value={typedAnswer}
                       onChange={(e) => setTypedAnswer(e.target.value)}
                       placeholder="여기에 문장을 직접 입력하세요..."
                       disabled={feedback !== null}
                       onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                       className="w-full bg-transparent border-none text-3xl font-black text-slate-700 focus:outline-none text-center placeholder:text-slate-200"
                       autoFocus
                     />
                   ) : (
                     <>
                       {userOrder.length === 0 && !q.prefix && !q.suffix && <p className="text-slate-300 font-black italic select-none">아래 단어들을 클릭하여 문장을 완성하세요.</p>}
                       
                       {q.prefix && (
                         <div className="text-3xl font-black text-slate-400 mr-2 border-b-4 border-slate-200 pb-1">
                           {q.prefix}
                         </div>
                       )}

                       {userOrder.map((word, i) => (
                          <motion.button
                            key={`user-${i}-${word}`}
                            layoutId={`word-${word}-${i}`}
                            onClick={() => handleWordClick(word, true)}
                            className={`px-6 py-3 rounded-2xl font-black text-lg shadow-md transition-all active:scale-90 ${feedback === null ? "bg-white text-slate-700 hover:bg-rose-50" : "bg-white/50 text-slate-400"}`}
                          >
                             {word}
                          </motion.button>
                       ))}

                       {q.suffix && (
                         <div className="text-3xl font-black text-slate-400 ml-2 border-b-4 border-slate-200 pb-1">
                           {q.suffix}
                         </div>
                       )}
                     </>
                   )}
                </div>

                {/* Scrambled Words */}
                <div className={`flex flex-wrap gap-3 justify-center ${feedback !== null ? "opacity-30 pointer-events-none" : ""}`}>
                   {scrambled.map((word, i) => (
                      <motion.button
                        key={`scrambled-${i}-${word}`}
                        layoutId={`word-${word}-${i}`}
                        onClick={() => handleWordClick(word, false)}
                        className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-700 hover:-translate-y-1 transition-all active:scale-95"
                      >
                         {word}
                      </motion.button>
                   ))}
                </div>
             </div>

             <div className="pt-8 text-center">
               <AnimatePresence mode="wait">
                  {feedback === null ? (
                    <button 
                      onClick={checkAnswer}
                      disabled={userOrder.length === 0}
                      className="bg-[#4C51BF] text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50 active:scale-95"
                    >
                      정답 확인하기
                    </button>
                  ) : feedback ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 w-full max-w-2xl mx-auto">
                       <div className="bg-emerald-100 text-emerald-700 p-8 rounded-[40px] border-4 border-emerald-200 block shadow-xl relative group">
                          <p className="text-4xl font-black tracking-tighter mb-4">PERFECT! ✨</p>
                          <div className="flex items-center justify-center gap-3 mb-6 bg-white/40 p-4 rounded-2xl border border-white/40">
                            <p className="font-bold text-xl">
                              {q.prefix ? `${q.prefix} ` : ""}{q.correct}{q.suffix ? ` ${q.suffix}` : ""}
                            </p>
                            <button 
                              onClick={() => handleSpeak(`${q.prefix || ""} ${q.correct} ${q.suffix || ""}`)}
                              className="p-2 text-emerald-400 hover:text-emerald-700 hover:bg-white/50 rounded-full transition-all active:scale-90"
                            >
                              <Volume2 size={20} />
                            </button>
                          </div>
                          {q.grammarNote && (
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-8 p-8 bg-white/90 rounded-[40px] text-left border-2 border-emerald-100 shadow-xl backdrop-blur-md"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <span className="font-black text-emerald-600 text-sm uppercase tracking-[0.2em] block leading-none">Grammar Deep Dive</span>
                                  <span className="text-[10px] text-emerald-400 font-bold">핵심 문법 파고들기</span>
                                </div>
                              </div>
                              <p className="text-lg font-bold text-slate-700 leading-relaxed">
                                {q.grammarNote}
                              </p>
                            </motion.div>
                          )}
                       </div>
                       <button onClick={nextLevel} className="block mx-auto bg-slate-800 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-black transition active:scale-95 flex items-center gap-3">
                          {currentIdx === WRITING_DATA.length - 1 ? "CREATE MY STORY" : "NEXT MISSION"} <ChevronRight size={24} />
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                       <div className="bg-rose-50 text-rose-700 p-8 rounded-[40px] border-4 border-rose-100 inline-block">
                          <p className="text-3xl font-black tracking-tighter mb-2">TRY AGAIN! 💪</p>
                          <p className="font-bold">단어의 순서를 다시 한 번 생각해보세요.</p>
                       </div>
                       <div className="flex justify-center gap-4">
                          <button onClick={() => { setScrambled([...q.scrambled].sort()); setUserOrder([]); setFeedback(null); }} className="bg-slate-100 text-slate-500 px-10 py-5 rounded-3xl font-black hover:bg-slate-200 transition">다시 하기</button>
                          <button onClick={() => setFeedback(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-indigo-700 transition">정답 보기</button>
                       </div>
                       <button onClick={nextLevel} className="mt-4 block mx-auto bg-slate-800 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-black transition active:scale-95 flex items-center gap-3">
                          {currentIdx === WRITING_DATA.length - 1 ? "CREATE MY STORY" : "NEXT MISSION"} <ChevronRight size={24} />
                       </button>
                    </motion.div>
                  )}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const MyStoryView = ({ handleSpeak, navTo }: { handleSpeak: (t: string) => void; navTo: (s: Section) => void }) => {
    const [sentencePPC, setSentencePPC] = useState('');
    const [sentenceSoThat, setSentenceSoThat] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      if (sentencePPC.trim() && sentenceSoThat.trim()) {
        setSubmitted(true);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-full -translate-y-40 translate-x-40"></div>
          
          <div className="relative z-10 space-y-12">
             <div className="space-y-4">
                <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">Final Step</span>
                <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter leading-none mb-4">MY STORY<br/><span className="text-indigo-600">BUILDER</span></h2>
                <p className="text-xl font-bold text-slate-400">학습한 핵심 어법을 활용하여 당신의 감정 건강 이야기를 만들어보세요.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <h4 className="font-black text-indigo-600 mb-2 flex items-center gap-2">
                    <Zap size={18} /> PATTERN 1
                  </h4>
                  <p className="text-slate-700 font-bold mb-1">현재완료 진행형</p>
                  <code className="text-sm bg-white/50 px-2 py-1 rounded">I have been -ing ...</code>
                  <p className="text-xs text-slate-400 mt-2">최근에 해오고 있는 노력을 적어보세요.</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <h4 className="font-black text-emerald-600 mb-2 flex items-center gap-2">
                    <Smile size={18} /> PATTERN 2
                  </h4>
                  <p className="text-slate-700 font-bold mb-1">so ~ that 구문</p>
                  <code className="text-sm bg-white/50 px-2 py-1 rounded">I feel so [형용사] that ...</code>
                  <p className="text-xs text-slate-400 mt-2">노력의 결과로 느끼는 변화를 적어보세요.</p>
                </div>
             </div>

             <div className="space-y-10">
                <div className="space-y-4">
                   <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-4">PART 1: YOUR EFFORTS</label>
                   <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-100 focus-within:border-indigo-300 transition-colors">
                      <textarea 
                         value={sentencePPC}
                         onChange={(e) => setSentencePPC(e.target.value)}
                         disabled={submitted}
                         className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-black text-slate-700 placeholder:text-slate-200 h-24 p-2 cursor-auto"
                         placeholder="e.g. I have been eating healthy meals every day."
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-4">PART 2: THE RESULTS</label>
                   <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-100 focus-within:border-emerald-300 transition-colors">
                      <textarea 
                         value={sentenceSoThat}
                         onChange={(e) => setSentenceSoThat(e.target.value)}
                         disabled={submitted}
                         className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-black text-slate-700 placeholder:text-slate-200 h-24 p-2"
                         placeholder="e.g. I feel so energetic that I can focus better."
                      />
                   </div>
                </div>

                {!submitted ? (
                  <button 
                     onClick={handleSubmit}
                     disabled={!sentencePPC.trim() || !sentenceSoThat.trim()}
                     className="w-full py-7 bg-indigo-600 text-white rounded-[40px] font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-slate-800 transition active:scale-95 disabled:opacity-30"
                   >
                     FINISH MY STORY ✍️
                   </button>
                ) : (
                  <button 
                     onClick={() => setSubmitted(false)}
                     className="w-full py-7 border-2 border-slate-200 text-slate-400 rounded-[40px] font-black text-2xl hover:bg-slate-50 transition active:scale-95"
                   >
                     EDIT STORY
                   </button>
                )}
             </div>
          </div>
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 p-8 md:p-12 rounded-[50px] text-white space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                  <PenTool size={120} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="px-6 py-2 bg-emerald-500 rounded-2xl font-black text-sm uppercase tracking-widest">
                        MY JOURNAL
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter">PUBLISHED STORY</h3>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight underline decoration-indigo-500/50 underline-offset-8">
                      {sentencePPC}
                    </p>
                    <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-[#ECC94B]">
                      {sentenceSoThat}
                    </p>
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button 
                      onClick={() => handleSpeak(`${sentencePPC} ${sentenceSoThat}`)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all"
                    >
                      <Volume2 size={20} /> Listen to My Story
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => navTo('dashboard')}
                  className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition active:scale-95 flex items-center gap-3"
                >
                  RETURN TO DASHBOARD <ArrowRight size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ReadingView = ({ activeSection, isFinished, setIsFinished, score, setScore, navTo, handleSpeak }: { activeSection: Section; isFinished: boolean; setIsFinished: (v: boolean) => void; score: number; setScore: React.Dispatch<React.SetStateAction<number>>; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const isP1 = activeSection === 'reading_p1';
    const sectionKey = isP1 ? 'p1' : activeSection === 'reading_p2_jiho' ? 'p2_jiho' : 'p2_somi' as keyof typeof READING_TEXTS;
    const filteredQuestions = READING_DATA.filter(q => q.section === sectionKey);
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);

    const content = READING_TEXTS[sectionKey];

    useEffect(() => {
      if (feedback && feedback.isCorrect) {
        const delay = 1500;
        const timer = setTimeout(() => {
          handleNext();
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [feedback]);

    const handleNext = () => {
      setFeedback(null);
      setInputValue('');
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    };

    if (isFinished) return (
      <ResultCard 
        score={score} 
        total={filteredQuestions.length} 
        onRestart={() => { 
          setIsFinished(false); 
          setShowQuiz(false); 
          setCurrentQuestion(0); 
          setScore(0);
          setFeedback(null);
          setInputValue('');
        }} 
        onGoHome={() => navTo('dashboard')} 
      />
    );

    if (!showQuiz) {
      return (
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <BookOpen className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{content.title}</h2>
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Main Text Analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-3"
              >
                QUIZ START <Zap size={20} fill="currentColor" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Star className="text-emerald-500" size={16} fill="currentColor" />
                  </span>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">ORIGINAL TEXT</h4>
                </div>
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 min-h-[300px] shadow-inner relative group">
                  <p className="text-2xl font-black text-slate-700 leading-relaxed tracking-tight break-words">
                    {content.text}
                  </p>
                  <button 
                    onClick={() => handleSpeak(content.text)}
                    className="absolute bottom-6 right-6 p-4 bg-white text-emerald-500 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-90"
                    title="전체 본문 듣기"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Search className="text-orange-500" size={16} />
                  </span>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">KOREAN TRANSLATION</h4>
                </div>
                <div className="bg-orange-50/30 p-10 rounded-[40px] border border-orange-100 min-h-[300px] shadow-sm">
                  <p className="text-xl font-bold text-slate-600 leading-relaxed break-words">
                    {content.translation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-emerald-800 font-bold text-lg">본문을 충분히 읽고 이해하셨나요? 이해가 되었다면 오른쪽 상단의 <b>QUIZ START</b> 버튼을 눌러보세요!</p>
            </div>
          </motion.div>
        </div>
      );
    }

    const q = filteredQuestions[currentQuestion];

    return (
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 flex flex-col min-h-[800px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
             <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }} className="h-full bg-emerald-500"></motion.div>
          </div>

          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-3">
               <span className="bg-emerald-100 text-emerald-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">Reading Section</span>
               <span className="text-slate-300 font-bold tracking-widest uppercase text-xs">Page {activeSection.includes('p1') ? '1' : '2'} / {activeSection.replace('reading_', '').toUpperCase()}</span>
               <button 
                onClick={handleNext}
                className="ml-4 text-slate-400 hover:text-emerald-600 font-black text-xs transition-colors py-1 px-3 rounded-lg hover:bg-emerald-50"
               >
                SKIP
               </button>
             </div>
             <div className="text-slate-400 font-black text-sm flex items-center gap-1">
               QUEST: 
               <AnimatePresence mode="wait">
                 <motion.span 
                   key={currentQuestion}
                   initial={{ scale: 1.2, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.8, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                   className="inline-block min-w-[1rem] text-center text-emerald-500"
                 >
                   {currentQuestion + 1}
                 </motion.span>
               </AnimatePresence>
               / {filteredQuestions.length}
             </div>
          </div>

          <div className="space-y-10 flex-1">
             <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tighter italic">
                    Q: {q.question}
                  </h3>
                  <button 
                    onClick={() => handleSpeak(q.question)}
                    className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-slate-50 rounded-full transition-all active:scale-90 shrink-0"
                    title="Listen to question"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
                <p className="text-xl font-bold text-slate-400">
                  질문: {q.question_ko}
                </p>
             </div>

             {q.type === 'choice' ? (
                <div className="grid grid-cols-1 gap-4">
                   {q.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                           if (feedback) return;
                           const isCorrect = opt === q.answer;
                           if (isCorrect) setScore(prev => prev + 1);
                           setFeedback({ isCorrect, explanation: q.explanation });
                        }}
                        disabled={!!feedback}
                        className={`p-6 text-xl font-black rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${
                           feedback
                             ? opt === q.answer
                               ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100"
                               : "bg-white border-slate-100 text-slate-300 opacity-50"
                             : "bg-white border-slate-100 text-slate-700 hover:border-emerald-500 hover:shadow-xl active:scale-95"
                        }`}
                      >
                         <span>{opt}</span>
                         {feedback && opt === q.answer && <CheckCircle2 className="text-emerald-500" size={28} />}
                      </button>
                   ))}
                </div>
             ) : (
                <div className="space-y-6">
                   <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="정답을 입력하신 후 Enter 또는 버튼을 누르세요..."
                      disabled={!!feedback}
                      onKeyDown={(e) => e.key === 'Enter' && (() => {
                       if (feedback) return;
                       const isCorrect = checkSubjectiveAnswer(inputValue, q.answer, q.question);
                       if (isCorrect) setScore(prev => prev + 1);
                       setFeedback({ isCorrect, explanation: q.explanation });
                    })()}
                      className="w-full p-8 text-2xl font-black rounded-3xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none transition-all shadow-inner bg-slate-50/30 text-center"
                   />
                   {!feedback && (
                      <button 
                        onClick={() => {
                          if (feedback) return;
                          const isCorrect = checkSubjectiveAnswer(inputValue, q.answer, q.question);
                          if (isCorrect) setScore(prev => prev + 1);
                          setFeedback({ isCorrect, explanation: q.explanation });
                       }}
                        disabled={!inputValue}
                        className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition disabled:opacity-50 active:scale-95"
                      >
                         제출 및 확인
                      </button>
                   )}
                </div>
             )}

             <AnimatePresence>
               {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-10 p-10 rounded-[40px] border-4 ${
                      feedback.isCorrect 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100" 
                        : "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100"
                    } shadow-2xl relative overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${feedback.isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}>
                          {feedback.isCorrect ? <CheckCircle2 className="text-white" size={32} /> : <AlertCircle className="text-white" size={32} />}
                        </div>
                        <div>
                          <h4 className="text-3xl font-black tracking-tighter uppercase">{feedback.isCorrect ? "Perfect! ✨" : "Check Again! 💪"}</h4>
                          {!feedback.isCorrect && (
                             <p className="text-lg font-bold opacity-80 mt-1">정답: <span className="underline decoration-2 underline-offset-4">{q.answer}</span></p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-inner">
                        <p className="text-xl font-bold leading-relaxed whitespace-pre-wrap">{feedback.explanation}</p>
                      </div>

                      <button 
                        onClick={handleNext}
                        className={`mt-8 w-full py-5 rounded-2xl font-black text-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-3 ${
                          feedback.isCorrect 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200" 
                            : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200"
                        }`}
                      >
                        {currentQuestion < filteredQuestions.length - 1 ? "NEXT QUESTION" : "SEE RESULTS"} <ChevronRight size={24} />
                      </button>
                    </div>
                    <div className={`absolute -bottom-10 -right-10 opacity-5 scale-150 rotate-12 ${feedback.isCorrect ? "text-emerald-500" : "text-rose-500"}`}>
                       {feedback.isCorrect ? <Trophy size={200} /> : <Brain size={200} />}
                    </div>
                  </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = ({ navTo }: { navTo: (s: Section) => void }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-gradient-to-br from-[#4C51BF] to-[#667EEA] p-16 rounded-[60px] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <div className="relative z-10 space-y-8">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-[0.3em]">
                Student of the Month: YOU
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">LESSON 3. <br/><span className="text-[#ECC94B]">BE POSITIVE, BE HAPPY</span></h2>
              <div className="text-lg md:text-xl font-bold text-white/90 max-w-3xl space-y-1">
                <p>이번 단원의 목표:</p>
                <p>1. 감정 건강 지키는 법 알아보기</p>
                <p>2. [현재완료 진행형] 익히기</p>
                <p>3. [so 형/부 that ~] 구문 익히기</p>
              </div>
              <div className="flex gap-4 pt-4">
                 <button className="bg-white text-[#4C51BF] px-10 py-5 rounded-3xl font-black text-xl shadow-xl hover:bg-slate-50 transition-all active:scale-95">GO! TODAYS MISSION</button>
                 <button className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-3xl font-black text-xl hover:bg-white/20 transition-all text-white">MY STATS</button>
              </div>
           </div>
           <div className="absolute bottom-8 right-12 opacity-20 scale-[2.5] grayscale-0 brightness-200 pointer-events-none">
              <Award size={100} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
           <MenuCard 
             title="VOCABULARY" tagline="핵심 어휘 50개와 퀴즈 챌린지" variant="white" accent="purple" 
             icon={<Brain size={42} />} onClick={() => navTo('vocab')} 
           />
           <MenuCard 
             title="GRAMMAR" tagline="PPC & So... That... 완전 정복" variant="white" accent="indigo" 
             icon={<CheckCircle2 size={42} />} onClick={() => navTo('grammar_ppc')} 
           />
           <MenuCard 
             title="WRITING" tagline="조건에 맞는 영작 트레이닝" variant="white" accent="orange" 
             icon={<PenTool size={42} />} onClick={() => navTo('writing')} 
           />
           <MenuCard 
             title="READING" tagline="How to Protect Your Emotional Health" variant="white" accent="emerald" 
             icon={<BookOpen size={42} />} onClick={() => navTo('reading_p1')} 
           />
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-50">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tighter">
              <Flame className="text-orange-500" fill="currentColor" /> TRENDING NOW
            </h3>
            <div className="space-y-6">
               {[
                 { label: "JIHO'S DIARY", desc: "The Power of Gratitude", meta: "+50 XP", color: "bg-indigo-50", icon: <MessageSquare className="text-indigo-500" /> },
                 { label: "PRESENT PERFECT", desc: "Grammar Master", meta: "+30 XP", color: "bg-purple-50", icon: <Zap className="text-purple-500" /> },
                 { label: "SOMI'S ART", desc: "Painting Emotions", meta: "+40 XP", color: "bg-emerald-50", icon: <Smile className="text-emerald-500" /> }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-3xl transition-colors cursor-pointer group">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       {item.icon}
                    </div>
                    <div className="flex-1">
                       <p className="font-black text-slate-800 leading-none mb-1">{item.label}</p>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                    </div>
                    <div className="font-black text-indigo-600 text-xs">{item.meta}</div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#1A202C] p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Flame className="text-[#F6AD55]" fill="currentColor" size={32} />
               </div>
               <h3 className="text-3xl font-black tracking-tighter mb-4">DAILY STREAK</h3>
               <p className="text-white/60 font-bold mb-8 italic">"Consistency is the key to mastering English!"</p>
               <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-4xl tracking-tighter">14 <span className="text-lg opacity-50">DAYS</span></span>
                  <span className="text-[#ECC94B] font-black text-sm uppercase tracking-widest">RANK: 242nd</span>
               </div>
               <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="bg-[#ECC94B] h-full shadow-[0_0_15px_rgba(236,201,75,0.4)]"></motion.div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
         </div>
      </div>
    </div>
  );