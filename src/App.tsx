import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard,
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
  Send,
  Heart,
  User,
  RefreshCw,
  Edit,
  Trash2,
  Brush,
  Palette,
  Eraser,
  Undo,
  Languages,
  Sparkles,
  Menu,
  Users,
  Quote,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dogTemplate from './assets/images/puppy_cute_zentangle_template_1779095376379.png';
import dogExample from './assets/images/dog_zentangle_simple_example_1779094661261.png';
import catTemplate from './assets/images/cat_cute_zentangle_template_1779095394772.png';
import catExample from './assets/images/cat_zentangle_simple_example_v2_1779094682528.png';
import heartTemplate from './assets/images/heart_structured_template_1779094260287.png';
import heartExample from './assets/images/heart_zentangle_example_1779094285713.png';

// --- Types ---
type Section = 'dashboard' | 'vocab' | 'vocabQuiz' | 'grammar_ppc' | 'grammar_so_that' | 'writing' | 'reading' | 'reading_warmup' | 'reading_p1' | 'reading_p2_jiho' | 'reading_p2_somi' | 'gratitude' | 'zentangle';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
  ppcSentence?: string;
  soThatSentence?: string;
  author?: string;
  avatar?: string;
  reactions?: { [emoji: string]: number };
  comments?: Comment[];
  contentKo?: string;
  ppcSentenceKo?: string;
  soThatSentenceKo?: string;
}

interface ZentangleEntry {
  id: string;
  author: string;
  imageData: string;
  date: string;
  reactions?: { [emoji: string]: number };
  comments?: Comment[];
}

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
  section: 'warmup' | 'p1' | 'p2_jiho' | 'p2_somi';
  question: string;
  question_ko?: string;
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
  // Present Perfect Continuous (PPC) - Refined
  {
    id: 1, type: 'choice', section: 'ppc',
    question: "다음 중 어법상 옳은 문장을 고르세요.",
    options: [
      "Jiho has been write in his diary since last year.",
      "Somi have been painting sunflowers for six months.",
      "I have been feeling sad lately.",
      "She has being exercise regularly."
    ],
    answer: "I have been feeling sad lately.",
    explanation: "현재완료 진행형은 'have/has + been + V-ing' 형태입니다. feel은 감각 동사이지만 최근의 일시적인 감정을 강조할 때 진행형으로 쓰기도 합니다."
  },
  {
    id: 2, type: 'subjective', section: 'ppc',
    question: "I (play) soccer since 2 p.m. (현재완료진행형으로 쓰세요)",
    answer: "have been playing",
    explanation: "주어 I에 맞추어 have been V-ing 형태인 have been playing을 씁니다."
  },
  {
      id: 3, type: 'choice', section: 'ppc',
      question: "문맥상 알맞은 표현을 고르세요: Somi _______ art for years.",
      options: ["has been loving", "has loved", "is loving", "loves"],
      answer: "has loved",
      explanation: "love, know, have(소유)와 같은 상태 동사는 진행형을 쓰지 않고 현재완료형(have p.p.)을 씁니다."
  },
  {
      id: 4, type: 'subjective', section: 'ppc',
      question: "It (rain) for three hours. (현재완료진행형으로 쓰세요)",
      answer: "has been raining",
      explanation: "비인칭 주어 It은 3인칭 단수 취급하므로 has been raining을 씁니다."
  },
  {
      id: 5, type: 'choice', section: 'ppc',
      question: "We ______ here for a long time.",
      options: ["have been staying", "has been staying", "are staying", "stayed"],
      answer: "have been staying",
      explanation: "복수 주어 We에 맞춰 have been staying을 사용합니다."
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
    explanation: "so + 형용사 + that 구문은 '너무 ~해서 ...하다'라는 결과를 나타냅니다."
  },
  {
    id: 7, type: 'subjective', section: 'so_that',
    question: "Somi was (happy / she / that / so / a / sang / song). (순서대로 배열하세요)",
    answer: "so happy that she sang a song",
    explanation: "so + 형용사 + that + 주어 + 동사 어순으로 문장을 완성합니다."
  },
  {
    id: 8, type: 'choice', section: 'so_that',
    question: "다음 중 어법상 틀린 문장을 고르세요.",
    options: [
      "The brush moved so smoothly that it felt like dreaming.",
      "I am so sad that I can't talk to anyone.",
      "He was so calm that he stayed quiet.",
      "The movie was very good that I saw it twice."
    ],
    answer: "The movie was very good that I saw it twice.",
    explanation: "that절 앞에는 very가 아니라 so를 사용하여 'so ~ that' 구문을 만듭니다."
  },
  {
    id: 9, type: 'subjective', section: 'so_that',
    question: "The problem was so hard that I couldn't solve it. (의미가 같도록 빈칸을 채우세요) = The problem was ____ to solve.",
    answer: "too hard",
    explanation: "so ~ that ... can't(과거는 couldn't) 구문은 'too + 형용사 + to부정사' 구문으로 바꿀 수 있습니다."
  },
  {
    id: 10, type: 'choice', section: 'so_that',
    question: "의미가 같은 문장을 고르세요: 'He is so smart that he can follow the rules.'",
    options: [
      "He is too smart to follow the rules.",
      "He is smart enough to follow the rules.",
      "He is enough smart to follow the rules.",
      "He is so smart to follow the rules."
    ],
    answer: "He is smart enough to follow the rules.",
    explanation: "so ~ that ... can(긍정)은 '형용사 + enough to' 구문으로 바꿀 수 있습니다. enough는 형용사 뒤에 위치합니다."
  },
  {
    id: 11, type: 'subjective', section: 'ppc',
    question: "She (study) English since last year. (현재완료진행형으로 쓰세요)",
    answer: "has been studying",
    explanation: "주어 She에 맞춰 has been V-ing 형태를 사용합니다."
  },
  {
    id: 12, type: 'choice', section: 'ppc',
    question: "다음 빈칸에 들어갈 말이 바르게 짝지어진 것은? 'He has been waiting ______ 3 o'clock ______ two hours.'",
    options: ["since - for", "for - since", "since - since", "for - for"],
    answer: "since - for",
    explanation: "since 뒤에는 시작 시점, for 뒤에는 기간이 옵니다."
  },
  {
    id: 15, type: 'subjective', section: 'ppc',
    question: "They (wait) for the bus for 30 minutes. (현재완료진행형으로 쓰세요)",
    answer: "have been waiting",
    explanation: "주어 They에 맞춰 have been waiting을 씁니다."
  },
  {
    id: 16, type: 'choice', section: 'ppc',
    question: "Mom ______ dinner for three hours. She looks tired.",
    options: ["has been cooking", "have been cooking", "is cooking", "cooked"],
    answer: "has been cooking",
    explanation: "단수 주어 Mom에 맞춰 has been cooking을 씁니다."
  },
  {
    id: 17, type: 'subjective', section: 'ppc',
    question: "He (watch) TV since morning. (현재완료진행형으로 쓰세요)",
    answer: "has been watching",
    explanation: "주어 He에 맞춰 has been V-ing 형태를 사용합니다."
  },
  {
    id: 13, type: 'subjective', section: 'so_that',
    question: "Jiho is so tall that he can reach the shelf. (의미가 같도록 빈칸을 채우세요) = Jiho is tall ____ to reach the shelf.",
    answer: "enough",
    explanation: "긍정의 의미인 '너무 ~해서 ...할 수 있다(so ~ that ... can)'는 '형용사 + enough to'로 바꿔 쓸 수 있습니다."
  },
  {
    id: 14, type: 'choice', section: 'so_that',
    question: "다음 중 'I was so busy that I couldn't call you'와 의미가 같은 것은?",
    options: ["I was too busy to call you", "I was busy enough to call you", "I was so busy to call you", "I was enough busy to call you"],
    answer: "I was too busy to call you",
    explanation: "부정의 의미인 '너무 ~해서 ...할 수 없다(so ~ that ... can't)'는 'too + 형용사 + to' 구문과 의미가 같습니다."
  },
  {
    id: 18, type: 'choice', section: 'so_that',
    question: "The music was ______ loud ______ I couldn't hear you.",
    options: ["so - that", "very - that", "too - that", "so - so"],
    answer: "so - that",
    explanation: "'너무 ~해서 ...하다'라는 뜻의 so ... that 구문입니다."
  },
  {
    id: 19, type: 'subjective', section: 'so_that',
    question: "The box was (heavy / so / that / I / lift / couldn't / it). (어순에 맞게 배열하세요)",
    answer: "so heavy that I couldn't lift it",
    explanation: "so + 형용사 + that + 주어 + 동사 어순입니다."
  },
  {
    id: 20, type: 'choice', section: 'so_that',
    question: "The movie was so boring ______ I fell asleep.",
    options: ["that", "so", "because", "to"],
    answer: "that",
    explanation: "so ~ that 구문에서 결과를 이끄는 접속사 that을 씁니다."
  },
  {
    id: 21, type: 'subjective', section: 'ppc',
    question: "They (exercise) in the gym since 2 PM. (현재완료진행형으로 쓰세요)",
    answer: "have been exercising",
    explanation: "주어 They에 맞춰 have been exercising을 사용합니다."
  },
  {
    id: 22, type: 'choice', section: 'ppc',
    question: "I ______ for my glasses for half an hour. I can't find them.",
    options: ["have been looking", "has been looking", "am looking", "looked"],
    answer: "have been looking",
    explanation: "주어 I에 맞춰 have been looking을 사용합니다."
  },
  {
    id: 23, type: 'subjective', section: 'so_that',
    question: "The tea was too hot to drink. (의미가 같도록 빈칸을 채우세요) = The tea was ____ hot ____ I couldn't drink it.",
    answer: "so that | so, that",
    explanation: "too ~ to 구문은 'so ~ that ... can't/couldn't' 구문으로 바꿀 수 있습니다."
  },
  {
    id: 24, type: 'choice', section: 'so_that',
    question: "의미가 같은 문장을 고르세요: 'He is old enough to drive a car.'",
    options: [
      "He is so old that he can drive a car.",
      "He is too old to drive a car.",
      "He is old that he can drive a car.",
      "He is so old to drive a car."
    ],
    answer: "He is so old that he can drive a car.",
    explanation: "enough to 구문은 'so ~ that ... can' 구문으로 바꿀 수 있습니다."
  },
  {
    id: 25, type: 'subjective', section: 'so_that',
    question: "The soup is (hot / so / it / that / eat / can't / I). (어순에 맞게 배열하세요)",
    answer: "so hot that I can't eat it",
    explanation: "so + 형용사 + that 구문을 사용하여 인과관계를 나타냅니다."
  },
  {
    id: 26, type: 'choice', section: 'so_that',
    question: "다음 두 문장을 한 문장으로 만들 때, 빈칸에 알맞은 것은? 'It was a very cold day. We stayed indoors.' -> It was ______ cold ______ we stayed indoors.",
    options: ["so - that", "too - to", "very - that", "so - as"],
    answer: "so - that",
    explanation: "결과를 나타내는 so ~ that 구문을 사용합니다."
  },
  {
    id: 27, type: 'subjective', section: 'so_that',
    question: "He is so rich that he can buy anything. (의미가 같도록 빈칸을 채우세요) = He is rich ____ to buy anything.",
    answer: "enough",
    explanation: "긍정 결과(so ~ that ... can)는 '형용사 + enough to'로 전환 가능합니다."
  },
  {
    id: 28, type: 'choice', section: 'so_that',
    question: "문장의 빈칸에 들어갈 말이 바르게 짝지어진 것은? 'I was ______ tired ______ I couldn't finish my homework.'",
    options: ["so - that", "too - that", "very - that", "so - because"],
    answer: "so - that",
    explanation: "원인과 결과를 나타내는 핵심 표현은 so ... that 입니다."
  }
];

const WRITING_DATA: WritingQuestion[] = [
  // Missions 1-5: Present Perfect Continuous (PPC)
  { 
    id: 1, 
    prefix: "I",
    scrambled: ["have", "been", "feeling", "sad", "lately"], 
    suffix: ", so I feel so unhealthy that I need to change.",
    correct: "have been feeling sad lately", 
    translation: "나는 최근에 슬픔을 느껴오고 있어서, 너무 건강하지 않다고 느껴 변화가 필요하다.", 
    hint: "have been + V-ing (현재완료 진행형)",
    grammarNote: "상태를 나타내는 동사 feel은 진행형으로 잘 쓰이지 않지만, 최근의 일시적인 감정이나 변화를 강조할 때는 현재완료 진행형(have been feeling)으로 활발하게 사용됩니다."
  },
  { 
    id: 2, 
    prefix: "I",
    scrambled: ["have", "been", "writing", "in", "this", "diary"], 
    suffix: "for six months to remember the good moments.",
    correct: "have been writing in this diary", 
    translation: "나는 좋은 순간들을 기억하기 위해 6개월 동안 이 일기를 써오고 있다.", 
    hint: "have been + V-ing (현재완료 진행형)" 
  },
  { 
    id: 3, 
    prefix: "Lately, I",
    scrambled: ["have", "been", "painting", "bright", "yellow", "sunflowers"], 
    suffix: "because they remind me of happy memories.",
    correct: "have been painting bright yellow sunflowers", 
    translation: "최근에 나는 행복한 기억들을 떠올리게 해주기 때문에 밝은 노란색 해바라기를 그려오고 있다.", 
    hint: "have been + V-ing (현재완료 진행형)" 
  },
  { 
    id: 4, 
    prefix: "Jiho",
    scrambled: ["has", "been", "studying", "for", "the", "math", "test"], 
    suffix: "all night without sleeping.",
    correct: "has been studying for the math test", 
    translation: "지호는 잠도 자지 않고 밤새도록 수학 시험 공부를 해오고 있다.", 
    hint: "has been + V-ing (현재완료 진행형)" 
  },
  { 
    id: 5, 
    prefix: "The children",
    scrambled: ["have", "been", "playing", "in", "the", "park"], 
    suffix: "since early this morning.",
    correct: "have been playing in the park", 
    translation: "아이들은 오늘 아침 일찍부터 공원에서 놀고 있다.", 
    hint: "have been + V-ing (현재완료 진행형)" 
  },
  // Missions 6-10: So... that...
  { 
    id: 6, 
    prefix: "Are you",
    scrambled: ["so", "stressed", "out", "that", "it", "takes"], 
    suffix: "hours to fall asleep?",
    correct: "so stressed out that it takes", 
    translation: "당신은 잠드는 데 몇 시간이 걸릴 정도로 그렇게 스트레스를 받나요?", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 7, 
    prefix: "The flower was",
    scrambled: ["so", "beautiful", "that", "I", "took"], 
    suffix: "a picture of it with my phone.",
    correct: "so beautiful that I took", 
    translation: "그 꽃은 너무 아름다워서 나는 내 휴대폰으로 그것의 사진을 찍었다.", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 8, 
    prefix: "I moved my brush",
    scrambled: ["so", "smoothly", "that", "it", "felt"], 
    suffix: "like I was dreaming.",
    correct: "so smoothly that it felt", 
    translation: "나는 붓을 너무 부드럽게 움직여서 마치 내가 꿈을 꾸고 있는 것처럼 느껴졌다.", 
    hint: "so + 부사 + that + 주어 + 동사" 
  },
  { 
    id: 9, 
    prefix: "The weather was",
    scrambled: ["so", "cold", "that", "the", "river", "froze"], 
    suffix: "completely last night.",
    correct: "so cold that the river froze", 
    translation: "어젯밤에 날씨가 너무 추워서 강이 완전히 얼어버렸다.", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 10, 
    prefix: "She spoke",
    scrambled: ["so", "fast", "that", "I", "couldn't", "understand"], 
    suffix: "what she was saying.",
    correct: "so fast that I couldn't understand", 
    translation: "그녀는 말을 너무 빨리 해서 나는 그녀가 무슨 말을 하는지 이해할 수 없었다.", 
    hint: "so + 부사 + that + 주어 + couldn't" 
  },
  // Mixed / Extra
  { 
    id: 11, 
    prefix: "I",
    scrambled: ["have", "been", "waiting", "for", "the", "bus"], 
    suffix: "for over thirty minutes.",
    correct: "have been waiting for the bus", 
    translation: "나는 30분 넘게 버스를 기다려오고 있다.", 
    hint: "have been + V-ing" 
  },
  { 
    id: 12, 
    prefix: "It was",
    scrambled: ["so", "hot", "that", "he", "drank"], 
    suffix: "cold water quickly.",
    correct: "so hot that he drank", 
    translation: "날씨가 너무 더워서 그는 차가운 물을 빨리 마셨다.", 
    hint: "so + 형용사 + that + 주어 + 동사" 
  },
  { 
    id: 13, 
    scrambled: ["I", "express", "my", "emotions", "on", "paper", "so", "that", "I", "can", "let", "go", "of", "negative", "feelings."], 
    correct: "I express my emotions on paper so that I can let go of negative feelings.", 
    translation: "부정적인 감정들을 떨쳐버릴 수 있도록 나는 종이 위에 내 감정들을 표현한다.", 
    hint: "express A on B / so that ~ can / let go of" 
  },
  { 
    id: 14, 
    scrambled: ["By", "filling", "my", "mind", "with", "bright", "colors,", "I", "have", "been", "staying", "positive", "every", "day."], 
    correct: "By filling my mind with bright colors, I have been staying positive every day.", 
    translation: "내 마음을 밝은 색들로 채움으로써, 나는 매일 긍정적으로 지내오고 있다.", 
    hint: "By + V-ing / have been + V-ing",
    grammarNote: "'머물다' 혹은 '어떤 상태를 유지하다'라는 의미의 stay 역시 상태 동사의 성격을 갖지만, 현재완료 진행형(have been staying)으로 쓰여 '최근에 꾸준히 노력하여 특정 상태를 유지하고 있음'을 생동감 있게 강조할 수 있습니다."
  }
];

const READING_DATA: ReadingQuestion[] = [
  // Warm-up Reading: Want to Be Happy?
  {
    id: 1001, 
    section: 'warmup', 
    type: 'subjective',
    question: "What do all people want according to the speaker? (All people want ...)",
    question_ko: "연설자에 따르면 모든 사람들이 원하는 것은 무엇인가요? (모든 사람들은 ...을 원한다)",
    answer: "to be happy",
    explanation: "연설자는 모든 사람들이 공통적으로 '행복해지기를 원한다(all of us want to be happy)'고 말합니다."
  },
  {
    id: 1002, 
    section: 'warmup', 
    type: 'subjective',
    question: "According to the speaker, what makes people happy? (It's ________ makes people happy.)",
    question_ko: "연설자에 따르면 무엇이 사람들을 행복하게 만드나요? (...이 사람들을 행복하게 만든다.)",
    answer: "gratefulness",
    explanation: "연설자는 행복이 우리를 감사하게 만드는 것이 아니라, '감사함(gratefulness)'이 우리를 행복하게 만든다고 강조합니다."
  },
  {
    id: 1003, 
    section: 'warmup', 
    type: 'subjective',
    question: "Why are some rich or successful people not happy? (Because they want ...)",
    question_ko: "왜 몇몇 부유하거나 성공한 사람들이 행복하지 않은가요? (왜냐하면 그들은 ...을 원하기 때문이다.)",
    answer: "something else or more of the same",
    explanation: "그들은 이미 가진 것에 만족하지 못하고 '다른 무언가나 혹은 같은 것을 더 많이' 원하기 때문입니다."
  },
  // Page 1: Protecting Your Emotional Health
  {
    id: 1, section: 'p1', type: 'subjective',
    question: "Emotional health is as important as _______ health. (One word)",
    question_ko: "정서적 건강은 _____ 건강만큼이나 중요합니다. (한 단어)",
    answer: "physical",
    explanation: "본문 첫 문장에서 정서적 건강이 신체적(physical) 건강만큼 중요하다고 말합니다."
  },
  {
    id: 2, section: 'p1', type: 'subjective',
    question: "Improving emotional health starts with ________ what makes you feel sad or happy. (One word starting with 'n')",
    question_ko: "정서적 건강을 향상시키는 것은 무엇이 당신을 슬프거나 기쁘게 만드는지 ________ 하는 것에서 시작됩니다. ('n'으로 시작하는 한 단어)",
    answer: "noticing",
    explanation: "자신의 감정을 알아차리는 것(noticing)이 시작 단계입니다."
  },
  {
    id: 3, section: 'p1', type: 'choice',
    question: "What should you do when you notice your feelings, according to the text?",
    question_ko: "본문에 따르면, 자신의 감정을 알아차렸을 때 무엇을 해야 하나요?",
    options: ["Keep them secret", "Talk about them with someone you trust", "Try to forget them", "Exercise alone"],
    answer: "Talk about them with someone you trust",
    explanation: "신뢰하는 사람과 감정에 대해 이야기하라고 권장합니다."
  },
  {
    id: 4, section: 'p1', type: 'subjective',
    question: "Keeping negative feelings inside can cause _______ in your relationships later. (One word)",
    question_ko: "부정적인 감정을 내면에 담아두면 나중에 _____에 문제를 일으킬 수 있습니다. (한 단어)",
    answer: "problems",
    explanation: "내면에 감정을 쌓아두면 관계에 문제(problems)가 생길 수 있습니다."
  },
  {
    id: 5, section: 'p1', type: 'choice',
    question: "What is essential to maintain your physical health for emotional wellness?",
    question_ko: "정서적 건강을 위해 신체 건강을 유지하는 데 필수적인 것은 무엇인가요?",
    options: ["Watching TV", "Exercising regularly and getting enough sleep", "Eating a lot of snacks", "Playing mobile games"],
    answer: "Exercising regularly and getting enough sleep",
    explanation: "규칙적인 운동과 충분한 수면이 필수적이라고 언급됩니다."
  },
  {
    id: 6, section: 'p1', type: 'subjective',
    question: "To be emotionally healthy, you should maintain your physical health by ________ regularly. (One word)",
    question_ko: "정서적으로 건강해지기 위해서는 정기적인 _____을 통해 신체 건강을 유지해야 합니다. (한 단어)",
    answer: "exercising",
    explanation: "정기적인 운동(exercising)이 신체 및 정서 건강에 도움이 됩니다."
  },
  {
    id: 7, section: 'p1', type: 'subjective',
    question: "Besides exercise, getting enough _______ is also necessary for physical health. (One word)",
    question_ko: "운동 외에도, 신체 건강을 위해 충분한 _______이 필요합니다. (한 단어)",
    answer: "sleep",
    explanation: "충분한 수면(sleep) 역시 건강 유지의 필수 요소입니다."
  },
  {
    id: 8, section: 'p1', type: 'subjective',
    question: "Complete the sentence: Humans are social _______ by nature. (One word)",
    question_ko: "문장을 완성하세요: 인간은 본래 사회적 _____입니다. (한 단어)",
    answer: "animals",
    explanation: "인간은 사회적 동물(social animals)이라는 점을 강조합니다."
  },
  {
    id: 9, section: 'p1', type: 'choice',
    question: "What is a necessary part of staying happy and strong?",
    question_ko: "행복하고 강하게 지내기 위한 필수적인 부분은 무엇인가요?",
    options: ["Staying home alone", "Connecting with other people", "Working all day", "Avoiding feelings"],
    answer: "Connecting with other people",
    explanation: "다른 사람들과 연결되는 것(connecting)이 필요하다고 설명합니다."
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
    id: 13, section: 'p2_jiho', type: 'subjective',
    question: "Fill in the blank: Jiho used to _____ only on his problems. (One word)",
    question_ko: "빈칸을 채우세요: 지호는 예전에 자신의 문제에만 _____하곤 했습니다.",
    answer: "focus",
    explanation: "예전에는 문제에만 집중(focus)했었다는 과거의 습관을 언급합니다."
  },
  {
    id: 14, section: 'p2_jiho', type: 'choice',
    question: "According to Jiho, why is writing a diary helpful?",
    question_ko: "지호에 따르면, 일기를 쓰는 것이 왜 도움이 되나요?",
    options: ["It helps him sleep better", "It is helpful for relieving stress", "It makes him a better painter", "It helps him remember vocabulary"],
    answer: "It is helpful for relieving stress",
    explanation: "지호는 일기를 쓰는 것이 스트레스 해소(relieving stress)에 도움이 된다고 명시합니다."
  },
  {
    id: 15, section: 'p2_jiho', type: 'subjective',
    question: "What does Jiho use to remember the good moments of his day?",
    question_ko: "지호는 하루의 좋은 순간들을 기억하기 위해 무엇을 사용하나요?",
    answer: "gratitude diary | diary",
    explanation: "지호는 좋은 순간들을 기억하기 위해 감사 일기(gratitude diary)를 씁니다."
  },
  {
    id: 16, section: 'p2_jiho', type: 'subjective',
    question: "Complete the sentence: Everything _______ after I started keeping a gratitude diary.",
    question_ko: "문장을 완성하세요: 감사 일기를 쓰기 시작한 후에 모든 것이 _______.",
    answer: "changed",
    explanation: "감사 일기를 시작한 후 '모든 것이 변했다(everything changed)'고 말했습니다."
  },
  {
    id: 17, section: 'p2_jiho', type: 'choice',
    question: "What action did Jiho take when he saw the flower?",
    question_ko: "지호가 꽃을 보았을 때 어떤 행동을 했나요?",
    options: ["He picked it up", "He drew a picture of it", "He took a picture with his phone", "He sat and watched it"],
    answer: "He took a picture with his phone",
    explanation: "꽃이 너무 아름다워서 휴대폰으로 사진을 찍었다고 언급합니다."
  },
  {
    id: 18, section: 'p2_jiho', type: 'subjective',
    question: "Jiho says he has known the _______ of gratitude for a long time. (One word)",
    question_ko: "지호는 오랫동안 감사의 ____을 알고 있었다고 합니다. (한 단어)",
    answer: "power",
    explanation: "지호는 감사의 힘(power of gratitude)을 오랫동안 알고 있었다고 했습니다."
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
    id: 23, section: 'p2_somi', type: 'subjective',
    question: "How long did Somi work on her painting yesterday?",
    question_ko: "소미는 어제 얼마나 오랫동안 그림을 그렸나요?",
    answer: "hours",
    explanation: "어제 몇 시간 동안(for hours) 그림을 그렸다고 언급합니다."
  },
  {
    id: 24, section: 'p2_somi', type: 'subjective',
    question: "Somi moved her brush so _______ that it felt like dreaming.",
    question_ko: "소미는 붓을 너무 _______하게 움직여서 꿈을 꾸는 것 같았다.",
    answer: "smoothly",
    explanation: "붓을 매우 부드럽게(smoothly) 움직였다는 묘사가 있습니다."
  },
  {
    id: 25, section: 'p2_somi', type: 'subjective',
    question: "What does Somi consider painting as?",
    question_ko: "소미는 그림 그리기를 무엇으로 여기나요?",
    answer: "one of my greatest comforts | comfort",
    explanation: "수년 동안 예술을 사랑했기에 그림 그리기를 가장 큰 위안(comfort) 중 하나로 여깁니다."
  },
  {
    id: 26, section: 'p2_somi', type: 'subjective',
    question: "According to the text, Somi has loved _______ for years.",
    question_ko: "본문에 따르면, 소미는 수년 동안 _______를 사랑해 왔습니다.",
    answer: "art",
    explanation: "수년 동안 예술(art)을 사랑해 왔다고 언급합니다."
  },
  {
    id: 27, section: 'p2_somi', type: 'subjective',
    question: "What can Somi let go of by expressing her emotions on paper?",
    question_ko: "종이에 감정을 표현함으로써 소미는 무엇을 떨쳐낼 수 있나요?",
    answer: "negative feelings",
    explanation: "감정을 표현함으로써 부정적인 감정(negative feelings)을 떨쳐낼 수 있다고 합니다."
  },
  {
    id: 28, section: 'p2_somi', type: 'subjective',
    question: "Somi says colors are like _______ that can express her inner world.",
    question_ko: "소미는 색채가 자신의 내면 세계를 표현하는 _______와 같다고 말합니다.",
    answer: "feelings",
    explanation: "색채를 자신의 감정(feelings)에 비유하고 있습니다."
  },
  {
    id: 29, section: 'p2_somi', type: 'choice',
    question: "Why has Somi been painting sunflowers lately?",
    question_ko: "소미는 왜 최근에 해바라기를 그려오고 있나요?",
    options: ["Because they are easy to draw", "Because they remind her of happy memories", "Because she wants to sell them", "Because they are her favorite flower"],
    answer: "Because they remind her of happy memories",
    explanation: "해바라기가 행복한 기억들을 떠올리게 해주기 때문에 그리고 있습니다."
  },
  {
    id: 30, section: 'p2_somi', type: 'subjective',
    question: "Fill in the blank: Whenever I feel _____, I grab a brush and paint.",
    question_ko: "빈칸을 채우세요: 기분이 _____ 때마다, 나는 붓을 잡고 그림을 그린다.",
    answer: "down",
    explanation: "기분이 울적할(down) 때마다 그림을 그린다고 설명합니다."
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
  }
];

const READING_TEXTS = {
  warmup: {
    title: "Warm-up Reading: Want to Be Happy?",
    text: "There is something you know about me, something very personal, and there is something I know about every one of you and that’s very central to your concerns. There is also something that we know about everyone we meet anywhere in the world, or on the street. That is very mainspring of whatever they do and whatever they put up with. And that is that all of us want to be happy. In this, we are all together. How we imagine our happiness, that differs from one another, but it’s already a lot that we have all in common that we want to be happy. Now my topic is gratefulness.\n\nWhat is the connection between happiness and gratefulness? Many people would say, “Well, that’s very easy.” When you are happy, you are grateful. But think again. Is it really the happy people that are grateful? We all know quite a number of people who have everything that it would take to be happy, and they are not happy because they want something else or they want more of the same. And we all know people who have lots of misfortune, misfortune that we ourselves would not want to have, and they are deeply happy. They radiate happiness. You are surprised. Why? Because they are grateful.\n\nSo it is not happiness that makes us grateful. It's gratefulness that makes us happy. If you think it’s happiness that makes you grateful, think again. It's gratefulness that makes us happy.",
    translation: "여러분이 저에 대해 알고 있는 것이 하나 있습니다. 아주 개인적인 어떤 것입니다. 그리고 제가 여러분 모두에 대해 알고 있는 것이 하나 있는데, 그것은 여러분의 관심사에서 매우 핵심적인 것입니다. 또한 우리는 세상 어디에서든 길에서 만나는 모든 사람들에 대해 알고 있는 것이 있는데, 그것은 그들이 하는 모든 행동과 견디어 내는 모든 것의 가장 중요한 원동력입니다. 그것은 바로 우리 모두가 행복해지고 싶어한다는 것입니다. 이 점에서 우리는 모두 같습니다. 우리가 행복을 어떻게 생각하는지는 사람마다 다릅니다. 하지만 우리가 행복해지고 싶어한다는 공통점을 가지고 있다는 것만으로도 이미 매우 큰 의미가 있습니다. 이제 제 주제는 감사함(gratefulness)입니다.\n\n행복과 감사함 사이에는 어떤 관계가 있을까요? 많은 사람들은 '아, 그건 아주 쉽죠'라고 말할 것입니다. 행복할 때 사람은 감사하게 됩니다. 하지만 다시 생각해 보세요. 정말 행복한 사람들이 감사하는 사람들일까요? 우리는 행복하기 위해 필요한 모든 것을 가진 많은 사람들을 알고 있지만, 그들은 다른 무언가를 원하거나 이미 가진 것을 더 많이 원하기 때문 에 행복하지 않습니다. 그리고 우리는 많은 불행을 겪고 있는데도 매우 행복한 사람들도 알고 있습니다. 그들은 행복을 발산합니다. 여러분은 놀라게 됩니다. 왜일까요? 왜냐하면 그들은 감사하기 때문입니다. 그러므로 우리를 감사하게 만드는 것은 행복이 아닙니다. 우리를 행복하게 만드는 것이 바로 감사함입니다. 만약 행복이 여러분을 감사하게 만든다고 생각한다면, 다시 생각해 보세요. 여러분을 행복하게 만드는 것은 감사함입니다."
  },
  p1: {
    title: "How to Protect Your Emotional Health",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="flex flex-col md:flex-row h-screen bg-[#2D3748] font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#2D3748] border-b border-white/5 z-[60] shrink-0">
        <div className="flex items-center space-x-3">
          <Award className="text-[#4C51BF]" size={24} fill="currentColor" />
          <span className="text-white font-black tracking-widest text-[10px]">GRACE'S ENGLISH CLASS</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white bg-white/5 rounded-lg active:scale-95 transition-all">
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[35] md:hidden backdrop-blur-sm transition-all" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative top-0 left-0 w-72 md:w-80 bg-[#2D3748] py-6 md:py-8 flex flex-col h-full border-r border-white/5 z-40 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center space-x-4 mb-8 md:mb-10 px-6 md:px-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10 shrink-0">
            <Award className="text-[#4C51BF]" size={26} fill="currentColor" />
          </div>
          <div className="md:block">
            <h1 className="text-xl font-black text-white tracking-widest leading-none">GRACE's</h1>
            <p className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mt-1 shrink-0">English Class</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 md:space-y-2 overflow-y-auto custom-scrollbar px-2">
          <SidebarBtn 
            icon={<LayoutDashboard className="w-5 h-5 text-white" />} 
            label="DASHBOARD" 
            active={activeSection === 'dashboard'} 
            onClick={() => { navTo('dashboard'); setMobileMenuOpen(false); }} 
          />
          <SidebarBtn 
            icon={<Languages className="w-5 h-5 text-white" />} 
            label="VOCA MASTER" 
            active={activeSection === 'vocab' || activeSection === 'vocabQuiz'} 
            onClick={() => { navTo('vocab'); setMobileMenuOpen(false); }} 
          />
          
          <div className="pt-4 md:pt-6 pb-1">
             <div className="flex items-center space-x-3 p-4 px-6 rounded-3xl font-black uppercase tracking-widest text-lg text-white whitespace-nowrap">
                <Brain className="w-6 h-6 text-indigo-300 shrink-0" />
                <span>GRAMMAR MASTER</span>
             </div>
             <div className="space-y-1 md:space-y-1.5 px-2">
                <button 
                  onClick={() => { navTo('grammar_ppc'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-xl md:text-2xl transition-all whitespace-nowrap ${activeSection === 'grammar_ppc' ? "bg-cyan-500 text-white shadow-lg" : "text-cyan-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'grammar_ppc' ? "bg-white" : "bg-cyan-400"}`}></div>
                   현재완료 진행형
                </button>
                <button 
                  onClick={() => { navTo('grammar_so_that'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-xl md:text-2xl transition-all whitespace-nowrap ${activeSection === 'grammar_so_that' ? "bg-pink-600 text-white shadow-lg" : "text-pink-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'grammar_so_that' ? "bg-white" : "bg-pink-400"}`}></div>
                   so ~ that 구문
                </button>
             </div>
          </div>

          <SidebarBtn 
            icon={<PenTool className="w-5 h-5 text-white" />} 
            label="WRITING MASTER" 
            active={activeSection === 'writing'} 
            onClick={() => { navTo('writing'); setMobileMenuOpen(false); }} 
          />
          
          <div className="pt-2 md:pt-4">
             <div className="flex items-center space-x-3 p-4 rounded-3xl font-black uppercase tracking-widest text-lg text-white whitespace-nowrap">
                <BookOpen className="w-6 h-6 text-indigo-300 shrink-0" />
                <span>READING MASTER</span>
             </div>
             <div className="space-y-1 md:space-y-1.5 px-2">
                <button 
                  onClick={() => { navTo('reading_warmup'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'reading_warmup' ? "bg-amber-500 text-white shadow-lg translate-x-1" : "text-amber-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'reading_warmup' ? "bg-white" : "bg-amber-400"}`}></div>
                   Warm-up Reading
                </button>
                <button 
                  onClick={() => { navTo('reading_p1'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'reading_p1' ? "bg-cyan-500 text-white shadow-lg translate-x-1" : "text-cyan-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'reading_p1' ? "bg-white" : "bg-cyan-400"}`}></div>
                   Emotional Health
                </button>
                <button 
                  onClick={() => { navTo('reading_p2_jiho'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'reading_p2_jiho' ? "bg-pink-600 text-white shadow-lg translate-x-1" : "text-pink-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'reading_p2_jiho' ? "bg-white" : "bg-pink-400"}`}></div>
                   Jiho's Story
                </button>
                <button 
                  onClick={() => { navTo('reading_p2_somi'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'reading_p2_somi' ? "bg-cyan-500 text-white shadow-lg translate-x-1" : "text-cyan-100 hover:text-white hover:bg-white/10"}`}
                >
                   <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'reading_p2_somi' ? "bg-white" : "bg-cyan-400"}`}></div>
                   Somi's Story
                </button>
             </div>
          </div>

          <div className="pt-2 md:pt-4 pb-1">
             <div className="flex items-center space-x-3 p-4 rounded-3xl font-black uppercase tracking-widest text-lg text-white whitespace-nowrap">
                <Sparkles className="w-6 h-6 text-indigo-300 shrink-0" />
                <span>ACTIVITIES</span>
             </div>
             <div className="space-y-1 md:space-y-1.5 px-2">
                 <button 
                   onClick={() => { navTo('gratitude'); setMobileMenuOpen(false); }}
                   className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'gratitude' ? "bg-pink-600 text-white shadow-lg translate-x-1" : "text-pink-100 hover:text-white hover:bg-white/10"}`}
                 >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'gratitude' ? "bg-white" : "bg-pink-400"}`}></div>
                    Gratitude Diary
                 </button>
                 <button 
                   onClick={() => { navTo('zentangle'); setMobileMenuOpen(false); }}
                   className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-black text-lg md:text-xl transition-all whitespace-nowrap ${activeSection === 'zentangle' ? "bg-cyan-500 text-white shadow-lg translate-x-1" : "text-cyan-100 hover:text-white hover:bg-white/10"}`}
                 >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${activeSection === 'zentangle' ? "bg-white" : "bg-cyan-400"}`}></div>
                    Zentangles
                 </button>
             </div>
          </div>
        </nav>

        <div className="mt-4 md:mt-6 space-y-3">
           <div className="bg-[#3C366B] p-4 md:p-5 rounded-2xl border border-white/10 shadow-inner">
             <div className="flex justify-between items-end mb-2">
               <span className="text-2xl font-black text-white tracking-tighter">84%</span>
               <div className="flex flex-col items-end">
                  <span className="text-[8px] text-[#F6AD55] font-black uppercase">Lv. 12 챌린저</span>
               </div>
             </div>
             <div className="w-full bg-[#2D3748] h-1.5 rounded-full overflow-hidden shadow-inner">
               <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="bg-gradient-to-r from-[#ECC94B] to-[#F6AD55] h-full rounded-full"></motion.div>
             </div>
           </div>
           <p className="text-center text-white/30 text-[8px] font-medium tracking-widest italic uppercase">© 2026 GRACE's English Class</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F7F9FC]">
        {/* Header bar */}
        <header className="h-16 md:h-24 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-12 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-3">
              <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-orange-200 shrink-0">LESSON 3</span>
              <h1 className="text-sm md:text-2xl font-black text-slate-800 tracking-tighter">Be Positive, Be Happy</h1>
            </div>
            <div className="h-8 w-[1px] bg-slate-100 hidden lg:block"></div>
            <div className="text-[10px] md:text-sm font-bold text-slate-400 hidden lg:block uppercase tracking-widest">Section: {activeSection.toUpperCase()}</div>
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
                {(activeSection === 'reading' || activeSection === 'reading_warmup' || activeSection === 'reading_p1' || activeSection === 'reading_p2_jiho' || activeSection === 'reading_p2_somi') && (
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
                {activeSection === 'gratitude' && (
                  <GratitudeDiaryView 
                    handleSpeak={handleSpeak}
                    navTo={navTo}
                  />
                )}
                {activeSection === 'zentangle' && (
                  <ZentangleView />
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

  const quizBtnColors = {
    all: 'bg-[#4C51BF] hover:bg-[#3C366B] shadow-indigo-200',
    p1: 'bg-[#10B981] hover:bg-[#059669] shadow-emerald-200',
    p2_jiho: 'bg-[#F69665] hover:bg-[#ED8936] shadow-orange-200',
    p2_somi: 'bg-[#805AD5] hover:bg-[#6B46C1] shadow-purple-200',
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-4 uppercase whitespace-nowrap">VOCA MASTER</h2>
          <p className="text-indigo-500 font-bold text-2xl uppercase tracking-[0.2em] pl-1 whitespace-nowrap">핵심 어휘 50가지 완벽 정복</p>
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
            className={`${quizBtnColors[selectedTab]} text-white px-8 py-4 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 mr-4`}
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
const VocabReviewView = ({ words, onFinish, handleSpeak }: { words: VocabWord[], onFinish: () => void, handleSpeak: (t: string) => void }) => {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [attempts, setAttempts] = useState([
    { english: '', korean: '' },
    { english: '', korean: '' },
    { english: '', korean: '' }
  ]);
  const [feedback, setFeedback] = useState<(boolean | null)[]>([null, null, null]);
  const [shake, setShake] = useState(false);

  if (!words || words.length === 0) {
    onFinish();
    return null;
  }

  const currentWord = words[currentWordIdx];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newFeedback = attempts.map(att => 
      normalizeStr(att.english) === normalizeStr(currentWord.word) &&
      normalizeStr(att.korean) === normalizeStr(currentWord.meaning)
    );
    setFeedback(newFeedback);

    if (newFeedback.every(f => f === true)) {
      handleSpeak("Perfect");
      if (currentWordIdx < words.length - 1) {
        setTimeout(() => {
          setCurrentWordIdx(prev => prev + 1);
          setAttempts([{ english: '', korean: '' }, { english: '', korean: '' }, { english: '', korean: '' }]);
          setFeedback([null, null, null]);
        }, 800);
      } else {
        setTimeout(() => onFinish(), 800);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      handleSpeak("Check your answers");
    }
  };

  const handleInputChange = (idx: number, field: 'english' | 'korean', value: string) => {
    const nextAttempts = [...attempts];
    nextAttempts[idx] = { ...nextAttempts[idx], [field]: value };
    setAttempts(nextAttempts);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-[50px] shadow-2xl border-4 border-indigo-100 relative overflow-hidden"
      >
        <div className="mb-10 text-center">
          <span className="bg-rose-100 text-rose-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">틀린 단어 복습</span>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter mt-4">오답 정복하기 (3번씩 완성)</h2>
          <p className="text-slate-400 font-bold mt-2">각 단어를 3번씩 정확하게 입력하여 완벽하게 외워보세요.</p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="text-center space-y-4 bg-indigo-50/50 p-10 rounded-[40px] border-2 border-indigo-100 w-full">
            <div className="flex items-center justify-center gap-6">
              <p className="text-7xl font-black text-indigo-600 tracking-tighter leading-none">{currentWord.word}</p>
              <button 
                onClick={() => handleSpeak(currentWord.word)}
                className="p-4 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all active:scale-90 shadow-sm"
              >
                <Volume2 size={40} />
              </button>
            </div>
            <p className="text-4xl font-bold text-slate-500">{currentWord.meaning}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <motion.div 
                  key={idx}
                  animate={{ x: shake && feedback[idx] === false ? [0, -5, 5, -5, 5, 0] : 0 }}
                  className={`p-6 rounded-[32px] border-2 transition-all space-y-4 ${
                    feedback[idx] === true ? "bg-emerald-50 border-emerald-200" : 
                    feedback[idx] === false ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Attempt {idx + 1}</span>
                    {feedback[idx] === true && <Zap size={16} className="text-emerald-500 fill-current" />}
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={attempts[idx].english}
                      onChange={(e) => handleInputChange(idx, 'english', e.target.value)}
                      placeholder="English"
                      className={`w-full bg-white border-2 rounded-2xl p-4 text-xl font-black outline-none transition-all ${
                        feedback[idx] === true ? "border-emerald-100 text-emerald-700" : "border-slate-100 text-slate-700 focus:border-indigo-300"
                      }`}
                    />
                    <input 
                      type="text" 
                      value={attempts[idx].korean}
                      onChange={(e) => handleInputChange(idx, 'korean', e.target.value)}
                      placeholder="뜻 (Korean)"
                      className={`w-full bg-white border-2 rounded-2xl p-4 text-xl font-black outline-none transition-all ${
                        feedback[idx] === true ? "border-emerald-100 text-emerald-700" : "border-slate-100 text-slate-700 focus:border-indigo-300"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button 
              type="submit"
              className="w-full py-7 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-200 hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              {currentWordIdx < words.length - 1 ? (
                <>다음 단어로 넘어가기 <ArrowRight size={24} /></>
              ) : (
                <>복습 완료! 대시보드로 이동 <CheckCircle2 size={24} /></>
              )}
            </button>
          </form>
          
          <div className="bg-slate-50 px-10 py-4 rounded-3xl border border-slate-100">
            <span className="text-slate-400 font-black text-sm uppercase tracking-widest">
              WORD <span className="text-indigo-600 text-xl mx-1">{currentWordIdx + 1}</span> OF {words.length}
            </span>
          </div>
        </div>
      </motion.div>
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
  const [missedWords, setMissedWords] = useState<VocabWord[]>([]);
  const [showReview, setShowReview] = useState(false);
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
    const correctWord = quizData[currentIdx];
    const isCorrect = options[idx] === correctWord.meaning;
    
    let currentMissed = [...missedWords];
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      currentMissed.push(correctWord);
      setMissedWords(prev => [...prev, correctWord]);
    }
    
    // Auto-advance after 1.5s
    setTimeout(() => {
      handleNext(false, true, isCorrect, currentMissed);
    }, 1500);
  };

  const handleNext = (isSkip = false, fromAnswer = false, wasCorrect = true, latestMissed?: VocabWord[]) => {
    const activeMissed = latestMissed || missedWords;
    // Determine if there are mistakes including the current one if skipping
    let hasMistakes = activeMissed.length > 0;
    
    if (isSkip && !isAnswered) {
      setMissedWords(prev => {
        const updated = [...prev, quizData[currentIdx]];
        hasMistakes = updated.length > 0;
        return updated;
      });
    }
    
    setIsAnswered(false);
    setSelectedIdx(null);

    if (currentIdx < quizData.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Quiz finished - always show result card first
      setIsFinished(true);
    }
  };

  if (showReview) {
    return <VocabReviewView words={missedWords} onFinish={() => navTo('dashboard')} handleSpeak={handleSpeak} />;
  }

  if (quizData.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[50px] shadow-2xl border border-slate-100">
      <h2 className="text-4xl font-black text-slate-800 mb-4">No words found!</h2>
      <p className="text-slate-500 mb-8">This section currently has no vocabulary data.</p>
      <button onClick={() => navTo('dashboard')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black">Go Back</button>
    </div>
  );

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
        setMissedWords([]);
        setShowReview(false);
        const filtered = vocabQuizConfig.section === 'all' 
          ? VOCAB_DATA 
          : VOCAB_DATA.filter(v => v.section === vocabQuizConfig.section);
        setQuizData([...filtered].sort(() => Math.random() - 0.5).slice(0, vocabQuizConfig.count));
      }} 
      onGoHome={() => navTo('dashboard')} 
      missedWords={missedWords}
      onReviewMistakes={() => setShowReview(true)}
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
             QUEST {currentIdx + 1} / {quizData.length}
           </span>
           <button 
              onClick={() => handleNext(true)}
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
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className={`text-2xl font-black ${options[selectedIdx!] === quizData[currentIdx].meaning ? "text-emerald-500" : "text-rose-500"}`}>
                {options[selectedIdx!] === quizData[currentIdx].meaning ? "Great Job! 🎉" : "Keep Going! 💪"}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">잠시 후 다음 퀴즈로 이동합니다...</p>
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
      className={`flex items-center space-x-4 p-4 px-6 rounded-3xl transition-all font-black uppercase tracking-widest text-lg md:text-xl group w-full text-left ${
        active 
          ? "bg-[#667EEA] text-white shadow-xl shadow-indigo-700/20 translate-x-0" 
          : "text-white hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className={`transition-transform group-hover:scale-110 text-white`}>{icon}</span>
      <span className={`whitespace-nowrap text-white`}>{label}</span>
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

function ResultCard({ 
  score, 
  total, 
  onRestart, 
  onGoHome, 
  missedWords, 
  onReviewMistakes,
  userName
}: { 
  score: number; 
  total: number; 
  onRestart: () => void; 
  onGoHome: () => void;
  missedWords?: VocabWord[];
  onReviewMistakes?: () => void;
  userName?: string;
}) {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto text-center space-y-8 bg-white p-12 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden"
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
          className="absolute -top-4 -right-4 bg-yellow-300 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white"
        >
          <Trophy className="text-white" size={30} />
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center gap-1">
          {userName && <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-1">{userName}'S SCORE</span>}
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter underline decoration-indigo-200 underline-offset-8 uppercase">MISSION COMPLETED</h2>
        </div>
        <p className="text-slate-500 font-bold text-lg leading-tight">
          {userName ? (
            <><span className="text-indigo-600">{userName}</span>님은 </>
          ) : (
            <>당신은 </>
          )}
          <span className="font-extrabold text-indigo-600 block text-2xl mt-1">{total}문제 중 {score}문제를 맞췄습니다!</span>
        </p>
      </div>

      {missedWords && missedWords.length > 0 && (
         <div className="bg-rose-50/50 p-6 rounded-[32px] border border-rose-100 text-left">
            <p className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <RotateCcw size={14} /> REVIEW WORDS ({missedWords.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {missedWords.map((w, idx) => (
                <span key={idx} className="bg-white px-3 py-1.5 rounded-xl text-slate-700 font-bold text-sm border border-rose-50 shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  {w.word}
                </span>
              ))}
            </div>
         </div>
      )}

      <div className="flex flex-col gap-3 pt-4">
        {onReviewMistakes && missedWords && missedWords.length > 0 && (
          <button 
            onClick={onReviewMistakes}
            className="w-full py-5 bg-rose-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-rose-200 hover:bg-rose-700 transition flex items-center justify-center gap-3 active:scale-95"
          >
            <PenTool size={24} /> 오답 노트 작성하기
          </button>
        )}
        <button 
          onClick={onRestart}
          className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-3 active:scale-95"
        >
          <RotateCcw size={24} /> 한 번 더 도전하기
        </button>
        {(!onReviewMistakes || !missedWords || missedWords.length === 0) && (
          <button 
            onClick={onGoHome}
            className="w-full py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition active:scale-95"
          >
            대시보드로 돌아가기
          </button>
        )}
      </div>
    </motion.div>
  );
}


    const GrammarView = ({ activeSection, setScore, isFinished, setIsFinished, score, navTo, handleSpeak }: { activeSection: Section; setScore: React.Dispatch<React.SetStateAction<number>>; isFinished: boolean; setIsFinished: (v: boolean) => void; score: number; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const isPpc = activeSection === 'grammar_ppc';
    const sectionKey = isPpc ? 'ppc' : 'so_that';
    
    const filteredQuestions = useMemo(() => {
      const all = GRAMMAR_DATA.filter(q => q.section === sectionKey);
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 10);
    }, [activeSection]);
    
    // Create a stable mapping of actual index to fake index (1-5) for display if required 
    // but the request asks to "change numbers to 1-5 to match question count" 
    // and I'm already providing 5 questions.
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const [mistakes, setMistakes] = useState<number[]>([]);

    const handleSubmitSubjective = () => {
      if (feedback) return;
      const q = filteredQuestions[currentQuestion];
      const isCorrect = checkSubjectiveAnswer(inputValue, q.answer, q.question);
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        setMistakes(prev => prev.includes(currentQuestion) ? prev : [...prev, currentQuestion]);
      }
      setFeedback({ isCorrect, explanation: q.explanation });
    };

    const handleChoiceAnswer = (ans: string) => {
      if (feedback) return;
      setInputValue(ans);
      const isCorrect = ans === filteredQuestions[currentQuestion].answer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        setMistakes(prev => prev.includes(currentQuestion) ? prev : [...prev, currentQuestion]);
      }
      setFeedback({ isCorrect, explanation: filteredQuestions[currentQuestion].explanation });
    };

    const handleNext = () => {
      // If skipped (no feedback yet), add to mistakes so it can be reviewed/retried
      if (!feedback) {
        setMistakes(prev => prev.includes(currentQuestion) ? prev : [...prev, currentQuestion]);
      }
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
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter mb-8 leading-tight uppercase">
                {isPpc ? "Present Perfect Continuous" : "so ... that ... Clause"}
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

    const q = filteredQuestions[currentQuestion];

    if (isFinished) return (
      <div className="max-w-5xl mx-auto space-y-12">
        <ResultCard 
          score={score} 
          total={filteredQuestions.length} 
          onRestart={() => {
            setIsFinished(false);
            setCurrentQuestion(0);
            setFeedback(null);
            setScore(0);
            setInputValue('');
            setMistakes([]);
          }} 
          onGoHome={() => navTo('dashboard')} 
        />

        {(mistakes.length > 0 || score < filteredQuestions.length) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100"
          >
             <h3 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <AlertCircle className="text-rose-500" /> 오답노트 & 다시 풀어보기 (Incorrect Answer Note)
             </h3>
             <div className="space-y-6">
                {mistakes.map((idx) => {
                  const questionData = filteredQuestions[idx];
                  return (
                    <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
                       <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <p className="text-rose-500 font-black text-sm uppercase tracking-widest px-4 py-1 bg-rose-50 rounded-full inline-block">Question {idx + 1}</p>
                            {/* Check if it was skipped or wrong - if score wasn't incremented and it wasn't in mistakes before? 
                                Actually, we just treat them all as review items. */}
                          </div>
                          <button 
                            onClick={() => {
                              setCurrentQuestion(idx);
                              setIsFinished(false);
                              setFeedback(null);
                              setInputValue('');
                            }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                          >
                            <RotateCcw size={14} /> 다시 풀어보기
                          </button>
                       </div>
                       <p className="text-xl font-black text-slate-800 italic">{questionData.question}</p>
                       {questionData.question_ko && <p className="text-slate-400 font-bold">{questionData.question_ko}</p>}
                       <div className="flex flex-col md:flex-row gap-4 mt-4">
                          <div className="flex-1 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <p className="text-emerald-700 font-black text-sm uppercase mb-1">정답 (Correct Answer)</p>
                             <p className="text-emerald-800 font-black text-lg">{questionData.answer}</p>
                          </div>
                          <div className="flex-1 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                             <p className="text-amber-700 font-black text-sm uppercase mb-1">해설 (Explanation)</p>
                             <p className="text-amber-800 font-bold">{questionData.explanation}</p>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </motion.div>
        )}
      </div>
    );

    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
             <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }} className="h-full bg-indigo-500"></motion.div>
          </div>
          
          <div className="flex justify-between items-center mb-10">
             <span className="bg-indigo-100 text-indigo-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-1">
               QUEST {currentQuestion + 1} / {filteredQuestions.length}
             </span>
             <button 
                onClick={handleNext}
                className="text-slate-400 hover:text-indigo-600 font-black text-sm transition-colors flex items-center gap-1 group"
             >
                SKIP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight italic">
              {q.question}
            </h3>
            {q.question_ko && (
              <p className="text-xl font-bold text-slate-400">
                {q.question_ko}
              </p>
            )}

            {q.type === 'choice' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoiceAnswer(opt)}
                    disabled={!!feedback}
                    className={`p-8 text-xl font-black rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${
                      feedback
                        ? opt === q.answer
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100"
                          : inputValue === opt
                            ? "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100"
                            : "bg-white border-slate-100 text-slate-300"
                        : "bg-white border-slate-100 text-slate-700 hover:border-indigo-500 hover:shadow-xl active:scale-95"
                    }`}
                  >
                    <span>{opt}</span>
                    {feedback && opt === q.answer && <CheckCircle2 className="text-emerald-500" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="정답을 입력하세요 (Type your answer...)"
                  disabled={!!feedback}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitSubjective()}
                  className="w-full p-8 text-2xl font-black rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all shadow-inner bg-slate-50/30 text-center"
                />
                {!feedback && (
                  <button 
                    onClick={handleSubmitSubjective}
                    disabled={!inputValue}
                    className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50 active:scale-95"
                  >
                    제출 및 확인 (Submit)
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
                           <p className="text-lg font-bold opacity-80 mt-1">정답: <span className="underline underline-offset-4 decoration-2">{q.answer}</span></p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-inner">
                      <p className="text-xl font-bold leading-relaxed">{feedback.explanation}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      {!feedback.isCorrect && (
                        <button 
                          onClick={() => {
                            setFeedback(null);
                            setInputValue('');
                          }}
                          className="flex-1 py-5 rounded-2xl font-black text-xl bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50 transition active:scale-95 flex items-center justify-center gap-3"
                        >
                          <RotateCcw size={24} /> 다시 도전하기 (Retry)
                        </button>
                      )}
                      <button 
                        onClick={handleNext}
                        className={`flex-1 py-5 rounded-2xl font-black text-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-3 ${
                          feedback.isCorrect 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200" 
                            : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200"
                        }`}
                      >
                        {currentQuestion < filteredQuestions.length - 1 ? "NEXT QUESTION" : "SEE RESULTS"} <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const WritingView = ({ score, setScore, setIsFinished, navTo, handleSpeak }: { score: number; setScore: React.Dispatch<React.SetStateAction<number>>; setIsFinished: (v: boolean) => void; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const [subSection, setSubSection] = useState<'menu' | 'practice' | 'review' | 'story'>('menu');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userOrder, setUserOrder] = useState<string[]>([]);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<boolean | null>(null);
    const [isTypingMode, setIsTypingMode] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [alreadyScored, setAlreadyScored] = useState<number[]>([]);
    const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
    const [showAnswerIdx, setShowAnswerIdx] = useState<number | null>(null);

    const filteredQuestions = WRITING_DATA;

    useEffect(() => {
      if (subSection === 'practice' && currentIdx < filteredQuestions.length) {
        const q = filteredQuestions[currentIdx];
        setScrambled([...q.scrambled].sort());
        setUserOrder([]);
        setFeedback(null);
        setTypedAnswer('');
        setShowAnswerIdx(null);
      }
    }, [currentIdx, subSection]);

    const handleWordClick = (word: string, fromUser: boolean) => {
      if (feedback !== null) return;
      if (fromUser) {
        setUserOrder(prev => {
          const newOrder = [...prev];
          const lastIdx = newOrder.lastIndexOf(word);
          if (lastIdx !== -1) newOrder.splice(lastIdx, 1);
          return newOrder;
        });
        setScrambled(prev => [...prev, word].sort());
      } else {
        setScrambled(prev => {
          const newScrambled = [...prev];
          const idx = newScrambled.indexOf(word);
          if (idx !== -1) newScrambled.splice(idx, 1);
          return newScrambled;
        });
        setUserOrder(prev => {
           const newOrder = [...prev, word];
           const q = filteredQuestions[currentIdx];
           if (newOrder.length === q.scrambled.length) {
              setTimeout(() => {
                 const isCorrect = normalizeStr(newOrder.join(' ')) === normalizeStr(q.correct);
                 setFeedback(isCorrect);
                 if (isCorrect) {
                   if (!alreadyScored.includes(currentIdx)) {
                     setScore(s => s + 1);
                     setAlreadyScored(prev => [...prev, currentIdx]);
                   }
                   handleSpeak("Perfect");
                 } else {
                    if (!wrongAnswers.includes(currentIdx)) {
                      setWrongAnswers(prev => [...prev, currentIdx]);
                    }
                    handleSpeak("Try again");
                 }
              }, 300);
           }
           return newOrder;
        });
      }
    };

    const checkAnswer = () => {
      const q = filteredQuestions[currentIdx];
      let isCorrect = false;
      
      if (isTypingMode) {
        const normInput = normalizeStr(typedAnswer);
        const normCorrect = normalizeStr(q.correct);
        const fullSent = `${q.prefix || ""} ${q.correct} ${q.suffix || ""}`;
        const normFull = normalizeStr(fullSent);
        isCorrect = normInput === normCorrect || normInput === normFull;
      } else {
        isCorrect = normalizeStr(userOrder.join(' ')) === normalizeStr(q.correct);
      }
      
      setFeedback(isCorrect);
      if (isCorrect) {
        if (!alreadyScored.includes(currentIdx)) {
           setScore(prev => prev + 1);
           setAlreadyScored(prev => [...prev, currentIdx]);
        }
      } else {
        if (!wrongAnswers.includes(currentIdx)) {
          setWrongAnswers(prev => [...prev, currentIdx]);
        }
      }
    };

    const nextLevel = () => {
      if (currentIdx < filteredQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        setSubSection('review');
      }
    };

    if (subSection === 'menu') {
      return (
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-4 uppercase">WRITING MASTER</h2>
              <p className="text-orange-500 font-bold text-2xl uppercase tracking-[0.2em] pl-1">어법을 활용한 완벽한 문장 만들기</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MenuCard 
              title="WRITING PRACTICE" 
              tagline="핵심 어법이 포함된 문장들을 바르게 배열하고 직접 입력하는 연습을 합니다." 
              variant="white" accent="orange" 
              icon={<FileText size={42} />} 
              onClick={() => setSubSection('practice')} 
            />
            <MenuCard 
              title="MY STORY BUILDER" 
              tagline="학습한 어법(PPC, so~that)을 활용하여 자신의 건강 이야기를 영작해봅니다." 
              variant="white" accent="indigo" 
              icon={<PenTool size={42} />} 
              onClick={() => setSubSection('story')} 
            />
          </div>
          
          <div className="bg-orange-50 p-10 rounded-[50px] border border-orange-100 mt-12">
             <h4 className="text-xl font-black text-orange-800 mb-4 flex items-center gap-3">
                <Star size={24} fill="currentColor" /> WRITING TIPS
             </h4>
             <ul className="space-y-3 text-lg font-bold text-orange-700/80">
                <li className="flex items-start gap-2">• 현재완료 진행형(have been -ing) 어순에 주의하세요.</li>
                <li className="flex items-start gap-2">• so ~ that 절에서 원인과 결과의 논리적 흐름을 파악하세요.</li>
                <li className="flex items-start gap-2">• <b>TYPE ANSWER</b> 모드를 활성화하면 단어 블록 없이 직접 입력하여 실력을 테스트할 수 있습니다.</li>
             </ul>
          </div>
        </div>
      );
    }

    if (subSection === 'review') {
      return (
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 min-h-[600px]">
            <div className="text-center space-y-6 mb-12">
               <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 text-orange-600 rounded-full mb-4">
                  <Trophy size={48} />
               </div>
               <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase">MISSION COMPLETED!</h2>
               <p className="text-2xl font-bold text-slate-400">당신의 학습 결과를 확인해보세요.</p>
               <div className="flex justify-center gap-12 mt-8">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm font-black uppercase tracking-widest mb-1">Total Score</p>
                    <p className="text-5xl font-black text-orange-500">{score} / {filteredQuestions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-sm font-black uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-5xl font-black text-indigo-500">{Math.round((score / filteredQuestions.length) * 100)}%</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-700 flex items-center gap-3">
                <BookOpen className="text-indigo-500" /> 오답 노트 (Incorrect Answers)
              </h3>
              
              {wrongAnswers.length === 0 ? (
                <div className="bg-emerald-50 p-10 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-xl font-bold text-emerald-600">축하합니다! 모든 문제를 완벽하게 맞혔습니다. ✨</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {wrongAnswers.map((idx) => {
                     const item = filteredQuestions[idx];
                     return (
                       <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                          <div className="space-y-2 flex-1">
                             <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Sentence {idx + 1}</p>
                             <p className="text-xl font-black text-slate-800">"{item.translation}"</p>
                             <p className="text-lg font-bold text-indigo-600">
                                {item.prefix ? item.prefix + " " : ""}{item.correct}{item.suffix ? " " + item.suffix : ""}
                             </p>
                          </div>
                          <button 
                            onClick={() => {
                              setCurrentIdx(idx);
                              setSubSection('practice');
                              setFeedback(null);
                              setUserOrder([]);
                              setScrambled([...item.scrambled].sort());
                              setShowAnswerIdx(null);
                            }}
                            className="px-8 py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition active:scale-95 flex items-center gap-2 whitespace-nowrap self-start md:self-center"
                          >
                            <RotateCcw size={18} /> 다시 도전하기
                          </button>
                       </div>
                     );
                   })}
                </div>
              )}
            </div>

            <div className="mt-16 flex flex-col md:flex-row gap-4">
               <button 
                onClick={() => {
                  setSubSection('menu');
                  setScore(0);
                  setCurrentIdx(0);
                  setWrongAnswers([]);
                  setAlreadyScored([]);
                }}
                className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-3xl font-black text-xl hover:bg-slate-200 transition"
               >
                 메뉴로 돌아가기
               </button>
               <button 
                onClick={() => setSubSection('story')}
                className="flex-1 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
               >
                 MY STORY 만들러 가기 <ChevronRight className="inline ml-1" />
               </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (subSection === 'story') return <MyStoryView handleSpeak={handleSpeak} navTo={navTo} onBack={() => setSubSection('menu')} />;

  // --- Practice View (Word Scramble and Direct Typing) ---
  const q = filteredQuestions[currentIdx];
  const qCorrectFull = `${q.prefix || ""} ${q.correct} ${q.suffix || ""}`;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Level Indicators */}
      <div className="flex flex-wrap gap-3 scrollbar-hide py-2">
        {filteredQuestions.map((_, i) => {
          const isDone = alreadyScored.includes(i) || wrongAnswers.includes(i);
          return (
            <button
              key={i}
              onClick={() => {
                setCurrentIdx(i);
                setFeedback(null);
                setTypedAnswer('');
                setSubSection('practice');
              }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${
                i === currentIdx
                  ? "bg-slate-800 text-white shadow-xl scale-110"
                  : isDone
                  ? (alreadyScored.includes(i) ? "bg-indigo-50 text-indigo-500" : "bg-rose-50 text-rose-500")
                  : "bg-white text-slate-300 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-12 md:p-20 rounded-[60px] shadow-3xl border border-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -z-0">
          <PenTool size={200} />
        </div>

        <div className="relative z-10 space-y-12">
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="px-5 py-2 bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest">Sentence {currentIdx + 1}</span>
              <span className="hidden md:inline-block px-5 py-2 bg-indigo-50 text-indigo-500 rounded-xl font-black text-xs uppercase tracking-widest">{q.hint}</span>
            </div>
            <button 
              onClick={() => {
                setIsTypingMode(!isTypingMode);
                setFeedback(null);
                setUserOrder([]);
                setScrambled([...q.scrambled].sort());
                setTypedAnswer('');
              }}
              className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-sm ${isTypingMode ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {isTypingMode ? <Zap size={18} fill="currentColor" /> : <Edit size={18} />}
              {isTypingMode ? "SWITCH TO BLOCKS" : "DIRECT TYPING"}
            </button>
          </div>

          {/* Translation */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-slate-300"></div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Korean Translation</p>
             </div>
             <p className="text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
               "{q.translation}"
             </p>
          </div>

          {/* Prefix (if exists) */}
          {q.prefix && (
            <div className="py-4 border-b-2 border-slate-50">
              <p className="text-2xl font-black text-slate-400 italic">{q.prefix} ...</p>
            </div>
          )}

          {/* Answer Display */}
          <div className="min-h-[140px] flex flex-wrap items-center gap-4 p-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 shadow-inner relative group">
            {isTypingMode ? (
              <input 
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="여기에 직접 영작하여 입력하세요..."
                className="w-full bg-transparent border-none focus:ring-0 text-3xl font-black text-slate-700 placeholder:text-slate-200"
              />
            ) : (
              userOrder.length === 0 ? (
                <p className="text-slate-200 font-black text-2xl italic">아래 단어 블록을 클릭하여 문장을 만드세요.</p>
              ) : (
                userOrder.map((word, i) => (
                  <motion.button
                    layoutId={`word-${word}-${i}`}
                    key={`user-${i}`}
                    onClick={() => handleWordClick(word, true)}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-2xl shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1"
                  >
                    {word}
                  </motion.button>
                ))
              )
            )}
            {feedback !== null && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className={`absolute -top-6 right-6 px-10 py-4 rounded-3xl font-black text-xl shadow-2xl flex items-center gap-3 ${feedback ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
               >
                 {feedback ? <CheckCircle2 size={32} /> : <Zap size={32} fill="currentColor" />}
                 {feedback ? "PRRFECT!" : "TRY AGAIN!"}
               </motion.div>
            )}
          </div>

          {/* Suffix (if exists) */}
          {q.suffix && (
            <div className="py-4 border-t-2 border-slate-50">
              <p className="text-2xl font-black text-slate-400 italic">... {q.suffix}</p>
            </div>
          )}

          {/* Scrambled Area */}
          {!isTypingMode && (
             <div className="flex flex-wrap justify-center gap-4 p-8 bg-white border border-slate-100 rounded-[40px]">
                <AnimatePresence>
                  {scrambled.map((word, i) => (
                    <motion.button
                      layoutId={`word-${word}-${i}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      key={`scramble-${i}`}
                      onClick={() => handleWordClick(word, false)}
                      className="px-8 py-4 bg-slate-50 text-slate-800 rounded-2xl font-black text-xl border-2 border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all shadow-sm active:scale-95"
                    >
                      {word}
                    </motion.button>
                  ))}
                </AnimatePresence>
             </div>
          )}

          {/* Feedback & Actions */}
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 w-full md:w-auto">
                {feedback === false && (
                  <div className="flex items-center gap-4 bg-rose-50 p-6 rounded-[30px] border border-rose-100">
                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-rose-900 font-black text-lg">HINT AVAILABLE</p>
                      <button onClick={() => setShowAnswerIdx(currentIdx)} className="text-rose-400 font-bold hover:text-rose-600 transition underline underline-offset-4 decoration-rose-200">정답 보기</button>
                    </div>
                  </div>
                )}
                {showAnswerIdx === currentIdx && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[35px] shadow-sm">
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">Model Answer</p>
                    <p className="text-2xl font-black text-indigo-700 leading-tight">
                       {qCorrectFull}
                    </p>
                  </motion.div>
                )}
             </div>

             <div className="flex items-center gap-4 w-full md:w-auto">
                {isTypingMode && feedback === null && (
                  <button 
                    onClick={checkAnswer}
                    disabled={!typedAnswer.trim()}
                    className="flex-1 md:flex-none bg-slate-800 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-black transition active:scale-95 shadow-xl disabled:opacity-30"
                  >
                    CHECK ANSWER
                  </button>
                )}
                {(feedback === true || showAnswerIdx === currentIdx) && (
                   <button 
                    onClick={nextLevel}
                    className="flex-1 md:flex-none bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-slate-800 transition active:scale-95 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                   >
                    {currentIdx === filteredQuestions.length - 1 ? "FINISH MISSION" : "NEXT MISSION"}
                    <ChevronRight size={24} />
                   </button>
                )}
             </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
         <button 
          onClick={() => navTo('dashboard')}
          className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-3xl font-black text-xl hover:bg-slate-200 transition"
         >
           메뉴로 돌아가기
         </button>
         <button 
          onClick={() => setSubSection('menu')}
          className="flex-1 py-6 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl font-black text-xl hover:bg-slate-50 transition"
         >
           미션 목록 보기
         </button>
      </div>
    </div>
  );
};

  const MyStoryView = ({ handleSpeak, navTo, onBack }: { handleSpeak: (t: string) => void; navTo: (s: Section) => void; onBack: () => void }) => {
    const [sentencePPC, setSentencePPC] = useState('');
    const [sentenceSoThat, setSentenceSoThat] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [storyEntries, setStoryEntries] = useState<any[]>(() => {
      try {
        const saved = localStorage.getItem('mental_health_stories');
        let parsed = saved ? JSON.parse(saved) : [];
        const excluded = ['o', 'tth', 'thht', 'test', 'asdf', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'a', 'b', 'c', '123'];
        return parsed.filter((e: any) => !excluded.includes(e.author?.toLowerCase()));
      } catch {
        return [];
      }
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [storyTab, setStoryTab] = useState<'build' | 'wall'>('build');
    const [commentInput, setCommentInput] = useState<{[key: string]: string}>({});

    const handleSubmit = () => {
      if (!authorName.trim()) {
        alert("Please enter your name!");
        return;
      }
      if (sentencePPC.trim() && sentenceSoThat.trim()) {
        if (editingId) {
          const updated = storyEntries.map(e => e.id === editingId ? {
            ...e,
            author: authorName,
            ppc: sentencePPC,
            soThat: sentenceSoThat
          } : e);
          setStoryEntries(updated);
          localStorage.setItem('mental_health_stories', JSON.stringify(updated));
        } else {
          const newId = Date.now().toString();
          const newEntry = {
            id: newId,
            author: authorName,
            ppc: sentencePPC,
            soThat: sentenceSoThat,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: {},
            comments: []
          };
          const updated = [newEntry, ...storyEntries];
          setStoryEntries(updated);
          localStorage.setItem('mental_health_stories', JSON.stringify(updated));
          setEditingId(newId);
        }
        setSubmitted(true);
      }
    };

    const handleReaction = (id: string, emoji: string) => {
      const updated = storyEntries.map(e => {
        if (e.id === id) {
          const reactions = { ...(e.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...e, reactions };
        }
        return e;
      });
      setStoryEntries(updated);
      localStorage.setItem('mental_health_stories', JSON.stringify(updated));
    };

    const handleAddComment = (id: string) => {
      const text = commentInput[id];
      if (!text?.trim()) return;
      const newComment = {
        id: Date.now().toString(),
        author: authorName || 'Anonymous',
        text: text,
        date: new Date().toISOString()
      };
      const updated = storyEntries.map(e => {
        if (e.id === id) {
          return { ...e, comments: [...(e.comments || []), newComment] };
        }
        return e;
      });
      setStoryEntries(updated);
      setCommentInput({ ...commentInput, [id]: '' });
      localStorage.setItem('mental_health_stories', JSON.stringify(updated));
    };

    if (storyTab === 'wall') {
      return (
        <div className="max-w-7xl mx-auto space-y-16 pb-32">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-[200px] blur-3xl opacity-60"></div>
            
            <div className="flex flex-col items-center text-center space-y-8 pt-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-white rounded-[32px] shadow-2xl overflow-hidden flex items-center justify-center border border-indigo-100 mb-2 ring-8 ring-indigo-50/30"
              >
                <Users size={44} className="text-indigo-600" />
              </motion.div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase leading-none">My Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Story</span></h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-20 bg-indigo-100"></div>
                  <p className="text-xl font-black text-indigo-500 uppercase tracking-[0.2em]">Community Gallery</p>
                  <div className="h-px w-20 bg-indigo-100"></div>
                </div>
                <p className="max-w-none mx-auto text-lg font-bold text-slate-400 whitespace-nowrap">친구들이 작성한 마음 건강 이야기를 보며 서로에게 따뜻한 응원의 한마디를 남겨주세요.</p>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setStoryTab('build')}
                  className="group relative bg-slate-900 text-white px-12 py-6 rounded-[35px] font-black text-xl hover:bg-black transition-all shadow-2xl flex items-center gap-4 active:scale-95"
                >
                  <div className="absolute inset-0 bg-indigo-500 rounded-[35px] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <PenTool size={24} className="group-hover:rotate-12 transition-transform" /> 
                  SHARE YOUR STORY
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="bg-white border border-slate-100 px-8 py-4 rounded-[30px] shadow-sm flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Stories</p>
                      <p className="text-2xl font-black text-indigo-600">{storyEntries.length}</p>
                   </div>
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                      <BookOpen size={24} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <AnimatePresence initial={false}>
              {storyEntries.length === 0 ? (
                <div className="col-span-full py-40 text-center bg-white/50 rounded-[80px] border-4 border-dashed border-slate-100 backdrop-blur-sm">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md">
                    <History size={40} className="text-slate-200" />
                  </div>
                  <p className="text-slate-300 font-black text-3xl">아직 공유된 이야기가 없습니다.<br/>첫 번째 주인공이 되어보세요!</p>
                </div>
              ) : (
                [...storyEntries]
                  .sort((a, b) => {
                    const idA = isNaN(Number(a.id)) ? 0 : Number(a.id);
                    const idB = isNaN(Number(b.id)) ? 0 : Number(b.id);
                    return idB - idA;
                  })
                  .map((entry, idx) => (
                  <motion.div 
                    key={entry.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative bg-white p-5 rounded-[30px] shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-slate-50 space-y-5 flex flex-col justify-between hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
                  >
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full -translate-y-16 translate-x-16 transition-transform group-hover:scale-150 duration-700"></div>
                    
                    <div className="relative space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-indigo-50 transition-transform group-hover:rotate-6">
                              {entry.author.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm leading-none mb-1">{entry.author}</p>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{entry.date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 isolate">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(entry.id);
                              setAuthorName(entry.author);
                              setSentencePPC(entry.ppc);
                              setSentenceSoThat(entry.soThat);
                              setSubmitted(false);
                              setStoryTab('build');
                            }}
                            className="p-2 bg-indigo-50/50 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-[14px] transition-all active:scale-90 shadow-sm"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('정말로 이 이야기를 삭제하시겠습니까?')) {
                                const updated = storyEntries.filter(e => e.id !== entry.id);
                                setStoryEntries(updated);
                                localStorage.setItem('mental_health_stories', JSON.stringify(updated));
                              }
                            }}
                            className="p-2 bg-rose-50/50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-[14px] transition-all active:scale-90 shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative p-4 bg-slate-50/50 rounded-[20px] border border-slate-100 group-hover:bg-indigo-50/30 transition-all group-hover:border-indigo-100">
                          <div className="absolute top-3 left-4 text-indigo-100 opacity-50"><Quote size={24} fill="currentColor" /></div>
                          <p className="relative text-sm font-bold text-slate-700 leading-relaxed italic z-10">
                            "{entry.ppc}, so that {entry.soThat}"
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {['PPC', 'SoThat'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-400 transition-all">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-4 relative isolate">
                      <div className="flex flex-wrap gap-2">
                        {['👍', '❤️', '👏', '🔥', '✨', '💪'].map(emoji => (
                          <button 
                            key={emoji}
                            onClick={() => handleReaction(entry.id, emoji)}
                            className={`px-3 py-1.5 rounded-full text-sm font-black border transition-all flex items-center gap-1.5 ${entry.reactions?.[emoji] ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-sm'}`}
                          >
                            <span>{emoji}</span>
                            {entry.reactions?.[emoji] > 0 && <span className="text-[10px]">{entry.reactions[emoji]}</span>}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {entry.comments?.length > 0 && (
                          <div className="space-y-2 bg-slate-50/30 p-4 rounded-[24px] border border-slate-100 shadow-inner max-h-32 overflow-y-auto custom-scrollbar">
                            {entry.comments.map((c: any) => (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={c.id} 
                                className="flex gap-2"
                              >
                                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                  <span className="text-[8px] font-black uppercase text-indigo-500">{c.author.charAt(0)}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-black text-slate-800 text-[8px] uppercase tracking-tighter">{c.author}</span>
                                  <p className="text-slate-600 font-medium text-[10px] leading-tight">{c.text}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        <div className="relative group/input">
                          <input 
                            type="text"
                            value={commentInput[entry.id] || ''}
                            onChange={(e) => setCommentInput({ ...commentInput, [entry.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(entry.id)}
                            placeholder="응원 댓글..."
                            className="w-full h-10 pl-5 pr-12 bg-slate-50 border-2 border-transparent rounded-[20px] text-[12px] font-bold text-slate-600 focus:bg-white focus:border-indigo-100 focus:ring-0 transition-all placeholder:text-slate-300 shadow-inner"
                          />
                          <button 
                            onClick={() => handleAddComment(entry.id)} 
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-slate-900 transition-all shadow-lg active:scale-90"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-10">
        <div className="bg-white p-6 md:p-10 rounded-[50px] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10 space-y-10">
             <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                   <button 
                     onClick={onBack}
                     className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-[20px] transition-all active:scale-90"
                   >
                     <RotateCcw size={24} className="-rotate-90" />
                   </button>
                   
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setStoryTab('wall')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                      >
                        My Class Story <ArrowRight size={16} />
                      </button>
                      <span className="bg-orange-100 text-orange-600 px-3 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center whitespace-nowrap">Final Step</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter leading-none whitespace-nowrap">MY STORY <span className="text-indigo-600 uppercase">BUILDER</span></h2>
                   <p className="text-xl font-bold text-slate-400 whitespace-nowrap">학습한 핵심 어법을 활용하여 당신의 감정 건강 상태를 표현해 보세요.</p>
                </div>
             </div>

             <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 focus-within:border-indigo-300 transition-all flex items-center gap-5 shadow-inner max-w-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <User size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Writer Name (Required)</p>
                  <input 
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black text-slate-700 placeholder:text-slate-200"
                  />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                  <h4 className="font-black text-indigo-600 mb-1 flex items-center gap-2 text-sm">
                    <Zap size={16} /> PATTERN 1
                  </h4>
                  <p className="text-slate-700 font-bold text-sm mb-1">현재완료 진행형</p>
                  <code className="text-xs bg-white/50 px-2 py-1 rounded">I have been -ing ...</code>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <h4 className="font-black text-emerald-600 mb-1 flex items-center gap-2 text-sm">
                    <Smile size={16} /> PATTERN 2
                  </h4>
                  <p className="text-slate-700 font-bold text-sm mb-1">so ~ that 구문</p>
                  <code className="text-xs bg-white/50 px-2 py-1 rounded">I feel so ... that ...</code>
                </div>
             </div>

             <div className="space-y-10">
                <div className="space-y-4">
                   <div className="flex items-center justify-between px-4">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest">PART 1: YOUR EFFORTS</label>
                      {submitted && (
                        <button 
                          onClick={() => setSubmitted(false)}
                          className="flex items-center gap-1 text-[10px] font-black text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      )}
                   </div>
                   <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-100 focus-within:border-indigo-300 transition-colors shadow-inner">
                      <textarea 
                         value={sentencePPC}
                         onChange={(e) => setSentencePPC(e.target.value)}
                         disabled={submitted}
                         className="w-full bg-transparent border-none focus:ring-0 text-xl font-black text-slate-700 placeholder:text-slate-200 h-24 p-2 cursor-auto"
                         placeholder="e.g. I have been eating healthy meals every day."
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between px-4">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest">PART 2: THE RESULTS</label>
                      {submitted && (
                        <button 
                          onClick={() => setSubmitted(false)}
                          className="flex items-center gap-1 text-[10px] font-black text-emerald-500 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      )}
                   </div>
                   <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-100 focus-within:border-emerald-300 transition-colors shadow-inner">
                      <textarea 
                         value={sentenceSoThat}
                         onChange={(e) => setSentenceSoThat(e.target.value)}
                         disabled={submitted}
                         className="w-full bg-transparent border-none focus:ring-0 text-xl font-black text-slate-700 placeholder:text-slate-200 h-24 p-2"
                         placeholder="e.g. I feel so energetic that I can focus better."
                      />
                   </div>
                </div>

                {!submitted ? (
                  <button 
                     onClick={handleSubmit}
                     disabled={!authorName.trim() || !sentencePPC.trim() || !sentenceSoThat.trim()}
                     className="w-full py-6 bg-indigo-600 text-white rounded-[35px] font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-slate-800 transition active:scale-95 disabled:opacity-30"
                   >
                     PUBLISH MY STORY ✍️
                   </button>
                ) : (
                  <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100 mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-xl font-black text-slate-800 tracking-tighter">Your story has been shared with the class!</p>
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => setStoryTab('wall')}
                        className="w-full py-6 bg-indigo-600 text-white rounded-[35px] font-black text-2xl shadow-2xl shadow-indigo-100 hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-4"
                      >
                        VIEW CLASS WALL <ArrowRight size={24} />
                      </button>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="w-full py-4 text-slate-400 font-extrabold hover:text-slate-600 transition text-sm"
                      >
                        MAKE AN EDIT
                      </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 p-12 md:p-20 rounded-[80px] text-white space-y-12 relative overflow-hidden group border-8 border-indigo-500/10 shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles size={200} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div className="px-8 py-3 bg-indigo-500 rounded-3xl font-black text-base uppercase tracking-widest shadow-lg">
                        PUBLISHED STORY
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter">BY {authorName.toUpperCase()}</h3>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white active:scale-90"
                      title="Edit Story"
                    >
                      <Edit size={24} />
                    </button>
                  </div>

                  <div className="space-y-10 max-w-3xl">
                    <p className="text-4xl md:text-5xl font-black leading-tight tracking-tight border-b-4 border-indigo-500/30 pb-6">
                      {sentencePPC}
                    </p>
                    <p className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#ECC94B] italic">
                      {sentenceSoThat}
                    </p>
                  </div>

                  <div className="mt-16 flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleSpeak(`${sentencePPC} ${sentenceSoThat}`)}
                      className="flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 rounded-[30px] font-black transition-all active:scale-95 shadow-xl"
                    >
                      <Volume2 size={24} /> LISTEN TO STORY
                    </button>
                    <button 
                      onClick={() => navTo('dashboard')}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-10 py-5 rounded-[30px] font-black transition-all active:scale-95 border border-white/20"
                    >
                      BACK TO HOME
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ReadingView = ({ activeSection, isFinished, setIsFinished, score, setScore, navTo, handleSpeak }: { activeSection: Section; isFinished: boolean; setIsFinished: (v: boolean) => void; score: number; setScore: React.Dispatch<React.SetStateAction<number>>; navTo: (s: Section) => void; handleSpeak: (t: string) => void; }) => {
    const isWarmup = activeSection === 'reading_warmup';
    const isP1 = activeSection === 'reading_p1';
    const sectionKey = isWarmup ? 'warmup' : isP1 ? 'p1' : activeSection === 'reading_p2_jiho' ? 'p2_jiho' : 'p2_somi';
    const content = READING_TEXTS[sectionKey as keyof typeof READING_TEXTS];
    const filteredQuestions = useMemo(() => {
      const all = READING_DATA.filter(q => q.section === (sectionKey as any));
      return all.sort((a, b) => a.id - b.id);
    }, [sectionKey]);
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [userName, setUserName] = useState('');
    const [showNameInput, setShowNameInput] = useState(isWarmup);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const isWarmupReading = isWarmup;
    const [showTranslation, setShowTranslation] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
      setCurrentQuestion(0);
      setFeedback(null);
      setInputValue('');
      setShowQuiz(false);
      setShowNameInput(isWarmup);
      setIsFinished(false);
    }, [activeSection, isWarmup, setIsFinished]);

    if (activeSection === 'reading') {
        return (
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Warm-up Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <span className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Take care of yourself</span>
                  <h3 className="text-3xl font-black tracking-tight uppercase">Warm-up Reading</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <p className="font-bold text-white/70 italic text-sm w-full mb-1">"Small positive changes lead to big improvements..."</p>
                    <a 
                       href="https://www.mentalhealth.go.kr/portal/mdexmnDtl/mdexmnTypeList.do"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                      <Smile size={14} /> 스트레스 자가 진단 바로가기
                    </a>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navTo('reading_warmup')}
                className="bg-white text-indigo-600 px-10 py-4 rounded-[2rem] font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95 group flex items-center gap-2"
              >
                START WARM-UP <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
              <div>
                <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-4 uppercase leading-none">READING MASTER</h2>
                <p className="text-emerald-500 font-bold text-2xl uppercase tracking-[0.2em] pl-1">본문 이해와 독해 실력 향상</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MenuCard 
                title="EMOTIONAL HEALTH" 
                tagline="Page 1: 감정 건강을 지키는 다양한 방법들에 대해 알아봅니다." 
                variant="white" accent="emerald" 
                icon={<Smile size={42} />} 
                onClick={() => navTo('reading_p1')} 
              />
              <div className="space-y-4">
                <MenuCard 
                  title="JIHO'S STORY" 
                  tagline="Page 2: 지호의 감사 일기가 가져온 긍정적 변화를 확인합니다." 
                  variant="white" accent="orange" 
                  icon={<MessageSquare size={42} />} 
                  onClick={() => navTo('reading_p2_jiho')} 
                />
                <button 
                  onClick={() => navTo('gratitude')}
                  className="w-full p-6 bg-indigo-50 border border-indigo-100 rounded-[30px] flex items-center justify-between group hover:bg-indigo-100 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                      <Heart size={20} fill="currentColor" />
                    </div>
                    <span className="font-black text-indigo-900 tracking-tight text-sm">나의 감사 일기 쓰기</span>
                  </div>
                  <ArrowRight size={18} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-4">
                <MenuCard 
                  title="SOMI'S STORY" 
                  tagline="Page 2: 소미가 힐링 아트를 통해 감정을 표현하는 방법을 배웁니다." 
                  variant="white" accent="indigo" 
                  icon={<Palette size={42} />} 
                  onClick={() => navTo('reading_p2_somi')} 
                />
                <button 
                  onClick={() => navTo('zentangle')}
                  className="w-full p-6 bg-indigo-50 border border-indigo-100 rounded-[30px] flex items-center justify-between group hover:bg-indigo-100 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                      <Palette size={20} />
                    </div>
                    <span className="font-black text-indigo-900 tracking-tight text-sm">나의 젠탱글 그리기</span>
                  </div>
                  <ArrowRight size={18} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
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
        userName={isWarmupReading ? userName : undefined}
        onRestart={() => { 
          setIsFinished(false); 
          setShowQuiz(false); 
          setCurrentQuestion(0); 
          setScore(0);
          setFeedback(null);
          setInputValue('');
          if (isWarmupReading) setShowNameInput(true);
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
                  <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-2 uppercase leading-none">{content.title}</h2>
                  {!isWarmupReading && (
                    <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-lg">Main Text Analysis</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-3"
                >
                  {isWarmupReading ? "START ACTIVITY" : "QUIZ START"} <Zap size={20} fill="currentColor" />
                </button>
              </div>
            </div>

            {isWarmupReading && (
              <div className="mb-12 flex flex-col gap-8">
                {/* Addition: Korean Healing Minds Shorts Section */}
                <div className="p-8 bg-sky-50 rounded-[40px] border border-sky-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                  <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <Zap size={40} />
                  </div>
                  <div className="space-y-4 text-center md:text-left flex-1">
                    <h4 className="text-2xl font-black text-sky-900 uppercase tracking-tight">Warm up Video</h4>
                    <p className="text-sky-800 font-bold leading-relaxed text-sm">마음 건강을 지키는 간단한 팁을 영상으로 확인해 보세요.</p>
                    <a 
                      href="https://www.youtube.com/shorts/I03lorqi-P4?si=JSZcyB0ut-3K8rRh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-3 rounded-2xl font-black shadow-md hover:bg-sky-100 transition-all active:scale-95 border border-sky-200"
                    >
                      쇼츠 영상 보기 <ArrowRight size={18} />
                    </a>
                  </div>
                </div>

                <div className="p-8 bg-amber-50 rounded-[40px] border border-amber-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                  <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <Volume2 size={40} />
                  </div>
                  <div className="space-y-4 text-center md:text-left flex-1">
                    <h4 className="text-2xl font-black text-amber-900 uppercase tracking-tight">Warm up Video</h4>
                    <p className="text-amber-800 font-bold leading-relaxed text-sm">강연을 통해 감사함이 어떻게 우리를 행복으로 이끄는지 확인해 보세요.</p>
                    <a 
                      href="https://www.ted.com/talks/david_steindl_rast_want_to_be_happy_be_grateful?utm_campaign=tedspread&utm_medium=referral&utm_source=tedcomshare" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-3 rounded-2xl font-black shadow-md hover:bg-amber-100 transition-all active:scale-95 border border-amber-200"
                    >
                      TED 강연 영상 보기 <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 ${showTranslation ? 'lg:grid-cols-2' : ''} gap-12 transition-all`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Star className="text-emerald-500" size={16} fill="currentColor" />
                    </span>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">ORIGINAL TEXT</h4>
                  </div>
                  <button 
                    onClick={() => setShowTranslation(!showTranslation)}
                    className={`${showTranslation ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'} px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2`}
                  >
                    {showTranslation ? "영어만 보기" : "한글 번역 보기"} <Search size={16} />
                  </button>
                </div>
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 min-h-[300px] shadow-inner relative group">
                  <p className="text-2xl font-black text-slate-700 leading-relaxed tracking-tight break-words whitespace-pre-wrap">
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

              {showTranslation && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Search className="text-orange-500" size={16} />
                    </span>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">KOREAN TRANSLATION</h4>
                  </div>
                  <div className="bg-orange-50/30 p-10 rounded-[40px] border border-orange-100 min-h-[300px] shadow-sm">
                    <p className="text-xl font-bold text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                      {content.translation}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {sectionKey === 'p2_jiho' && (
              <div className="mt-12 p-8 bg-sky-50 rounded-[40px] border border-sky-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <Zap size={32} />
                </div>
                <div className="space-y-4 text-center md:text-left flex-1">
                  <h4 className="text-xl font-black text-sky-900 uppercase tracking-tight">Jiho's Special Tip Video</h4>
                  <p className="text-sky-800 font-bold leading-relaxed text-sm">지호의 감사 일기와 관련된 영상을 확인해 보세요.</p>
                  <a 
                    href="https://www.youtube.com/shorts/U81tG2Qjqqk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-2 rounded-xl font-black shadow-md hover:bg-sky-100 transition-all active:scale-95 border border-sky-200 text-sm"
                  >
                    영상 보기 <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            )}

            <div className="mt-12 p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-emerald-800 font-bold text-lg">본문을 충분히 읽고 이해하셨나요? 이해가 되었다면 위쪽의 <b>QUIZ START</b> 버튼을 눌러보세요!</p>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showQuiz && isWarmup && showNameInput) {
      return (
        <div className="max-w-3xl mx-auto py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 text-center space-y-10"
          >
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <User size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight italic">Who is reading today?</h2>
              <p className="text-slate-500 font-bold text-lg">퀴즈를 시작하기 전에 이름을 알려주세요!</p>
            </div>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="당신의 이름을 입력하세요..."
              className="w-full p-8 text-2xl font-black rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all shadow-inner bg-slate-50/30 text-center"
              onKeyDown={(e) => e.key === 'Enter' && userName && setShowNameInput(false)}
            />
            <button 
              onClick={() => setShowNameInput(false)}
              disabled={!userName}
              className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50 active:scale-95"
            >
              퀴즈 시작하기
            </button>
          </motion.div>
        </div>
      );
    }

    const q = (filteredQuestions && filteredQuestions.length > 0 && currentQuestion < filteredQuestions.length) 
      ? filteredQuestions[currentQuestion] 
      : null;

    if (!q) {
      return (
        <div className="text-center py-20 bg-white rounded-[50px] shadow-2xl border border-slate-100">
          <h2 className="text-4xl font-black text-slate-800 mb-4">No questions found!</h2>
          <p className="text-slate-500 mb-8">Reading section "{sectionKey}" appears to be empty.</p>
          <button onClick={() => navTo('dashboard')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black">Go Back</button>
        </div>
      );
    }

    const handleNext = () => {
      setFeedback(null);
      setInputValue('');
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    };

    return (
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="bg-white p-16 rounded-[60px] shadow-2xl border border-slate-100 flex flex-col min-h-[800px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
             <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }} className="h-full bg-emerald-500"></motion.div>
          </div>

          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-3">
               <span className="bg-emerald-100 text-emerald-600 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-1">
                 QUEST {currentQuestion + 1} / {filteredQuestions.length}
               </span>
               <span className="text-slate-300 font-bold tracking-widest uppercase text-[10px]">P.{activeSection.includes('p1') ? '1' : '2'} / {sectionKey.toUpperCase()}</span>
             </div>
             <div className="flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                <span className="font-black text-slate-400 text-xs">SCORE: {score}</span>
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
                  </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const GratitudeDiaryView = ({ handleSpeak, navTo }: { handleSpeak: (t: string) => void; navTo: (s: Section) => void }) => {
    const [viewTab, setViewTab] = useState<'my' | 'class'>('my');
    const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
      try {
        const saved = localStorage.getItem('gratitude_diary');
        let parsed = saved ? JSON.parse(saved) : [];
        return parsed.filter((e: GratitudeEntry) => e.author?.toLowerCase() !== 'o');
      } catch {
        return [];
      }
    });

    const [classEntries, setClassEntries] = useState<GratitudeEntry[]>(() => {
      try {
        const saved = localStorage.getItem('class_diary');
        let parsed = saved ? JSON.parse(saved) : [];
        return parsed.filter((e: GratitudeEntry) => e.author?.toLowerCase() !== 'o');
      } catch {
        return [];
      }
    });

    const [authorName, setAuthorName] = useState('');
    const [ppcInput, setPpcInput] = useState('');
    const [soThatInput, setSoThatInput] = useState('');
    const [gratitudeInput, setGratitudeInput] = useState('');
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [commentInput, setCommentInput] = useState<{ [id: string]: string }>({});
    const [visibleTranslations, setVisibleTranslations] = useState<{ [key: string]: boolean }>({});
    const [showKorean, setShowKorean] = useState(false);

    const toggleTranslation = async (key: string) => {
        // Find entry in either entries or classEntries
        const personalEntry = entries.find(e => e.id === key);
        const classEntry = classEntries.find(e => e.id === key);
        const entry = personalEntry || classEntry;

        if (!entry) {
            setVisibleTranslations(prev => ({ ...prev, [key]: !prev[key] }));
            return;
        }

        // If toggling ON and translation doesn't exist, fetch it
        if (!visibleTranslations[key]) {
            const needsTranslation = !entry.contentKo && (entry.content || entry.ppcSentence || entry.soThatSentence);
            
            if (needsTranslation) {
                try {
                    const textsToTranslate = [];
                    const keys: string[] = [];
                    
                    if (entry.ppcSentence) { textsToTranslate.push(entry.ppcSentence); keys.push('ppcSentence'); }
                    if (entry.soThatSentence) { textsToTranslate.push(entry.soThatSentence); keys.push('soThatSentence'); }
                    if (entry.content) { textsToTranslate.push(entry.content); keys.push('content'); }

                    const res = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ texts: textsToTranslate })
                    });

                    if (res.ok) {
                        const { translatedTexts } = await res.json();
                        const updates: any = {};
                        keys.forEach((k, i) => {
                            updates[`${k}Ko`] = translatedTexts[i];
                        });

                        // Update states
                        const updateInList = (list: GratitudeEntry[]) => list.map(e => e.id === key ? { ...e, ...updates } : e);
                        
                        setEntries(prev => {
                            const updated = updateInList(prev);
                            // Sync personal entries to localStorage
                            if (personalEntry) {
                                localStorage.setItem('gratitude_diary', JSON.stringify(updated));
                            }
                            return updated;
                        });
                        
                        setClassEntries(prev => updateInList(prev));
                    }
                } catch (err) {
                    console.error("Translation error:", err);
                }
            }
        }

        setVisibleTranslations(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ExampleBox = ({ id, en, ko, colorClass }: { id: string, en: React.ReactNode, ko: string, colorClass: string }) => (
        <div className={`${colorClass} p-4 rounded-2xl border transition-all relative group`}>
            <p className="text-sm font-bold text-slate-600 italic leading-relaxed pr-8">"{en}"</p>
            <p className="text-xs font-black text-slate-400 mt-2 border-t border-dashed pt-2 italic">
                {ko}
            </p>
        </div>
    );
  
    useEffect(() => {
      // User requested cleanup of specific dates or posts
      const cleanupDate15 = '5월 15일';
      const cleanupDate10 = '5월 10일';
      const cleanupDate19 = '5월 19일';
      const targetPostDate17 = '5월 17일';
      const targetContent17 = "I am grateful for this peaceful morning";
      
      const filterPost = (e: GratitudeEntry) => {
        const isTargetDate15 = e.date.includes(cleanupDate15);
        const isTargetDate10 = e.date.includes(cleanupDate10);
        const isTargetDate19 = e.date.includes(cleanupDate19);
        const isSpecificPost17 = e.date.includes(targetPostDate17) && e.content.includes(targetContent17);
        return !isTargetDate15 && !isTargetDate10 && !isTargetDate19 && !isSpecificPost17;
      };

      setEntries(prev => {
        const filtered = prev.filter(filterPost);
        if (filtered.length !== prev.length) {
          localStorage.setItem('gratitude_diary', JSON.stringify(filtered));
        }
        return filtered;
      });

      setClassEntries(prev => {
        // First filter out specific date cleanups requested
        let updated = prev.filter(e => {
            const isRemovedByDate = filterPost(e) === false;
            return !isRemovedByDate;
        });
        
        // Specific records to add/ensure
        const seedEntries: GratitudeEntry[] = [
          {
            id: 'seed-minjun',
            author: 'minjun',
            content: "When I'm stressed, I exercise. My stress was so huge that I started running. I have been running for thirty minutes to feel refreshed. Exercise is a great way to handle stress. I am thankful for my healthy body.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '❤️': 5 },
            comments: []
          },
          {
            id: 'seed-hana',
            author: 'hana',
            content: "When I feel stressed, I listen to music. The melodies are so sweet that they calm my mind. I have been listening to jazz since I got home to relax. I am grateful for the beautiful music.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '❤️': 7 },
            comments: []
          },
          {
            id: 'seed-doyun',
            author: 'doyun',
            content: "I often cook when I'm stressed. The smell of bread is so nice that it makes me happy. I have been baking bread for two hours to forget my stress. I feel thankful for the delicious smell.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '❤️': 4 },
            comments: []
          },
          {
            id: 'seed-somi',
            author: 'somi',
            content: "I draw when I'm under stress. The paper is so white that I want to fill it with patterns. I have been drawing zentangles for an hour to calm down. I am grateful for this peaceful time.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '❤️': 6 },
            comments: []
          },
          {
            id: 'seed-jiho',
            author: 'jiho',
            content: "When I'm stressed, I play with my dog. He is so energetic that he makes me active. I have been playing catch with him all afternoon. I am thankful for my energetic puppy.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '👍': 8 },
            comments: []
          },
          {
            id: 'seed-sujin',
            author: 'sujin',
            content: "Reading is my way to handle stress. The book is so exciting that I am completely absorbed in it. I have been reading this adventure story for three hours. I am grateful for the interesting book.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '✨': 6 },
            comments: []
          },
          {
            id: 'seed-taeyang',
            author: 'taeyang',
            content: "I take a walk when I'm stressed. The park is so quiet that I can think clearly. I have been walking along the river for an hour. I feel thankful for the fresh air.",
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '📚': 9 },
            comments: []
          }
        ];

        // Replace or add these entries
        seedEntries.forEach(seed => {
          const index = updated.findIndex(e => e.id === seed.id || (e.author?.toLowerCase() === seed.author.toLowerCase()));
          if (index !== -1) {
            updated[index] = seed;
          } else {
            updated = [seed, ...updated];
          }
        });

        if (JSON.stringify(updated) !== JSON.stringify(prev)) {
          localStorage.setItem('class_diary', JSON.stringify(updated));
        }
        return updated;
      });
    }, []);

    const refreshData = () => {
      try {
        const savedPersonal = localStorage.getItem('gratitude_diary');
        if (savedPersonal) setEntries(JSON.parse(savedPersonal));
        const savedClass = localStorage.getItem('class_diary');
        if (savedClass) setClassEntries(JSON.parse(savedClass));
      } catch (e) {
        console.error("Refresh failed:", e);
      }
    };

    const handleSave = () => {
      if (!authorName.trim()) {
        alert(showKorean ? "이름을 입력해주세요!" : "Please enter your name!");
        return;
      }
      if (!gratitudeInput.trim() && !ppcInput.trim() && !soThatInput.trim()) return;

      if (editingEntryId) {
        // Update existing entry
        const updateInList = (list: GratitudeEntry[]) => list.map(e => {
          if (e.id === editingEntryId) {
            return {
              ...e,
              author: authorName.trim(),
              content: gratitudeInput,
              ppcSentence: ppcInput,
              soThatSentence: soThatInput
            };
          }
          return e;
        });

        const updatedPersonal = updateInList(entries);
        setEntries(updatedPersonal);
        localStorage.setItem('gratitude_diary', JSON.stringify(updatedPersonal));

        const updatedClass = updateInList(classEntries);
        setClassEntries(updatedClass);
        localStorage.setItem('class_diary', JSON.stringify(updatedClass));

        setEditingEntryId(null);
      } else {
        // Create new entry
        const entry: GratitudeEntry = {
          id: Date.now().toString(),
          author: authorName.trim(),
          date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
          content: gratitudeInput,
          ppcSentence: ppcInput,
          soThatSentence: soThatInput,
          reactions: {},
          comments: []
        };
        
        // Update personal entries
        const updatedPersonal = [entry, ...entries];
        setEntries(updatedPersonal);
        localStorage.setItem('gratitude_diary', JSON.stringify(updatedPersonal));
        
        // Also add to class diary
        const updatedClass = [entry, ...classEntries];
        setClassEntries(updatedClass);
        localStorage.setItem('class_diary', JSON.stringify(updatedClass));
      }

      setGratitudeInput('');
      setAuthorName('');
      setPpcInput('');
      setSoThatInput('');
    };

    const handleEdit = (entry: GratitudeEntry) => {
      setViewTab('my');
      setEditingEntryId(entry.id);
      setAuthorName(entry.author || '');
      setGratitudeInput(entry.content);
      setPpcInput(entry.ppcSentence || '');
      setSoThatInput(entry.soThatSentence || '');
      // Scroll to form with delay to ensure tab is mounted
      setTimeout(() => {
        document.getElementById('gratitude-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    const cancelEdit = () => {
      setEditingEntryId(null);
      setGratitudeInput('');
      setAuthorName('');
      setPpcInput('');
      setSoThatInput('');
    };
  
    const handleDelete = (id: string, isClass: boolean = false) => {
      if (!window.confirm('기록을 삭제하시겠습니까?')) return;
      
      const updatedPersonal = entries.filter(e => e.id !== id);
      const updatedClass = classEntries.filter(e => e.id !== id);
      
      setEntries(updatedPersonal);
      setClassEntries(updatedClass);
      
      localStorage.setItem('gratitude_diary', JSON.stringify(updatedPersonal));
      localStorage.setItem('class_diary', JSON.stringify(updatedClass));
    };

    const handleReaction = (id: string, emoji: string) => {
      const updateEntry = (e: GratitudeEntry) => {
        if (e.id === id) {
          const reactions = { ...(e.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...e, reactions };
        }
        return e;
      };

      setEntries(prev => {
        const updated = prev.map(updateEntry);
        localStorage.setItem('gratitude_diary', JSON.stringify(updated));
        return updated;
      });

      setClassEntries(prev => {
        const updated = prev.map(updateEntry);
        localStorage.setItem('class_diary', JSON.stringify(updated));
        return updated;
      });
    };

    const handleAddComment = (id: string) => {
      const text = commentInput[id];
      if (!text || !text.trim()) return;

      const comment = { 
        id: Date.now().toString(), 
        author: 'Me', 
        text, 
        date: new Date().toISOString().split('T')[0] 
      };

      const updateEntry = (e: GratitudeEntry) => {
        if (e.id === id) {
          return { ...e, comments: [...(e.comments || []), comment] };
        }
        return e;
      };

      setEntries(prev => {
        const updated = prev.map(updateEntry);
        localStorage.setItem('gratitude_diary', JSON.stringify(updated));
        return updated;
      });

      setClassEntries(prev => {
        const updated = prev.map(updateEntry);
        localStorage.setItem('class_diary', JSON.stringify(updated));
        return updated;
      });

      setCommentInput({ ...commentInput, [id]: '' });
    };
  
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        {/* Tab Selection */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-2 rounded-[30px] flex gap-2">
            <button 
              onClick={() => setViewTab('my')}
              className={`px-10 py-4 rounded-[24px] font-black tracking-tight transition-all ${viewTab === 'my' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              MY DIARY
            </button>
            <button 
              onClick={() => setViewTab('class')}
              className={`px-10 py-4 rounded-[24px] font-black tracking-tight transition-all ${viewTab === 'class' ? 'bg-white text-indigo-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              My Class Diary
            </button>
          </div>
        </div>

        {viewTab === 'my' ? (
          <>
            <motion.div 
              id="gratitude-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-[60px] shadow-2xl border border-rose-100 relative overflow-hidden max-w-4xl mx-auto"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200">
                    <Heart className="text-white" size={32} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase whitespace-nowrap">My Gratitude Diary</h2>
                      <p className="text-rose-500 font-bold uppercase tracking-[0.2em] text-lg whitespace-nowrap">
                        마음 건강을 위해 감사의 일기를 작성하세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 p-6 bg-slate-50/50 rounded-[40px] border border-slate-100 shadow-sm relative z-10">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (window.confirm(viewTab === 'my' ? '정말로 모든 개인 기록을 삭제하시겠습니까?' : '정말로 모든 학급 기록을 삭제하시겠습니까?')) {
                          if (viewTab === 'my') {
                            setEntries([]);
                            localStorage.removeItem('gratitude_diary');
                          } else {
                            setClassEntries([]);
                            localStorage.removeItem('class_diary');
                          }
                        }
                      }}
                      className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest px-6 shadow-sm"
                    >
                      <Trash2 size={14} /> Clear Records
                    </button>
                    <button 
                      onClick={refreshData}
                      className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest px-6 shadow-sm"
                    >
                      <RefreshCw size={14} /> Refresh
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 focus-within:border-rose-200 transition-all flex items-center gap-4 shadow-sm px-6">
                    <div className="flex items-center gap-2 text-rose-500">
                      <User size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Writer</span>
                    </div>
                    <div className="w-px h-6 bg-slate-100"></div>
                    <input 
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="이름 (e.g. Jiho)"
                      className="bg-transparent border-none focus:ring-0 text-xl font-black text-slate-700 placeholder:text-slate-300 w-48"
                    />
                  </div>
                </div>
      
                <div className="space-y-10">
                  {/* Mental Health - PPC */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-700 flex items-center gap-2">
                        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">01</span>
                        Mental Health Status
                      </h4>
                      <span className="text-[10px] font-black bg-indigo-50 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-tighter">Use: have been -ing</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ExampleBox 
                            id="ppc-1" 
                            en={<span>I <span className="text-indigo-600 font-black">have been feeling</span> stressed lately.</span>} 
                            ko="최근에 스트레스를 받아왔어요." 
                            colorClass="bg-indigo-50/50 border-indigo-100/50" 
                        />
                        <ExampleBox 
                            id="ppc-2" 
                            en={<span>I <span className="text-indigo-600 font-black">have been taking</span> a walk every morning to clear my mind.</span>} 
                            ko="매일 아침 산책을 하며 마음을 정리해왔어요." 
                            colorClass="bg-indigo-50/50 border-indigo-100/50" 
                        />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 focus-within:border-indigo-200 transition-colors">
                      <input 
                        type="text"
                        value={ppcInput}
                        onChange={(e) => setPpcInput(e.target.value)}
                        placeholder="How have you been feeling lately?"
                        className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-700 placeholder:text-slate-200"
                      />
                    </div>
                  </div>
    
                  {/* Stress Relief - so...that */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-700 flex items-center gap-2">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs">02</span>
                        Stress Relief Methods
                      </h4>
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-tighter">Use: so ~ that ...</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ExampleBox 
                            id="st-1" 
                            en={<span>Listening to music is <span className="text-emerald-600 font-black">so</span> sweet <span className="text-emerald-600 font-black">that</span> I feel relaxed.</span>} 
                            ko="음악을 듣는 것은 너무 달콤해서 마음이 편안해져요." 
                            colorClass="bg-emerald-50/50 border-emerald-100/50" 
                        />
                        <ExampleBox 
                            id="st-2" 
                            en={<span>I exercise <span className="text-emerald-600 font-black">so</span> hard <span className="text-emerald-600 font-black">that</span> I feel refreshed.</span>} 
                            ko="운동을 아주 열심히 해서 기분이 상쾌해요." 
                            colorClass="bg-emerald-50/50 border-emerald-100/50" 
                        />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 focus-within:border-emerald-200 transition-colors">
                      <input 
                        type="text"
                        value={soThatInput}
                        onChange={(e) => setSoThatInput(e.target.value)}
                        placeholder="How do you relieve your stress?"
                        className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-700 placeholder:text-slate-200"
                      />
                    </div>
                  </div>
    
                  {/* Today's Gratitude */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-700 flex items-center gap-2">
                        <span className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-xs">03</span>
                        Today's Gratitude
                      </h4>
                      <div className="bg-rose-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Example Guide</span>
                        <div className="w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Visual Guide Box */}
                    <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-[30px] border border-rose-100/50 shadow-sm mb-4">
                       <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-400">
                             <BookOpen size={20} />
                          </div>
                          <div className="space-y-2">
                             <p className="text-sm font-black text-slate-600 uppercase tracking-tighter">Guide: Stress Management & Gratitude</p>
                             <p className="text-base font-bold text-slate-500 leading-relaxed italic">
                               "I <span className="text-indigo-500">have been practicing</span> deep breathing to stay calm. 
                               I am <span className="text-emerald-500">so relaxed</span> after breathing <span className="text-emerald-500">that</span> I <span className="text-emerald-500">can</span> focus better. 
                               I am <span className="text-rose-500">grateful</span> for this peaceful morning."
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ExampleBox 
                            id="grat-1" 
                            en={<span>I am <span className="text-rose-600 font-black">so thankful that</span> I have a happy family.</span>} 
                            ko="행복한 가족이 있어서 너무 감사해요." 
                            colorClass="bg-rose-50/50 border-rose-100/50" 
                        />
                        <ExampleBox 
                            id="grat-2" 
                            en={<span>The weather is <span className="text-rose-600 font-black">so beautiful that</span> I feel happy.</span>} 
                            ko="날씨가 너무 아름다워서 행복해요." 
                            colorClass="bg-rose-50/50 border-rose-100/50" 
                        />
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 focus-within:border-rose-200 transition-colors shadow-inner">
                      <textarea 
                          value={gratitudeInput}
                          onChange={(e) => setGratitudeInput(e.target.value)}
                          placeholder="What are you thankful for today?"
                          className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-700 placeholder:text-slate-200 h-32 p-1 resize-none"
                      />
                    </div>
                  </div>
    
                  <button 
                    onClick={handleSave}
                    disabled={!authorName.trim() || (!gratitudeInput.trim() && !ppcInput.trim() && !soThatInput.trim())}
                    className="w-full py-6 bg-rose-500 text-white rounded-3xl font-black text-2xl shadow-xl shadow-rose-100 hover:bg-rose-600 transition active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {editingEntryId ? "수정 완료" : "마음 기록 완료"} <PenTool size={24} />
                  </button>
                  {editingEntryId && (
                    <button 
                      onClick={cancelEdit}
                      className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition"
                    >
                      취소하기
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
      
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
                    <FileText className="text-rose-500" /> My Gratitude Records
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (window.confirm(showKorean ? "정말로 모든 감사 기록을 삭제하시겠습니까?" : "Are you sure you want to delete all gratitude records?")) {
                        setEntries([]);
                        localStorage.removeItem('gratitude_diary');
                      }
                    }}
                    className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                    title="Clear All"
                  >
                    <Trash2 size={16} /> {showKorean ? "모두 삭제" : "Clear All"}
                  </button>
                  <button 
                    onClick={refreshData}
                    className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>
                </div>
              </div>
              
              <AnimatePresence initial={false}>
                {entries.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-20 rounded-[50px] border-2 border-dashed border-slate-100 text-center"
                  >
                    <p className="text-slate-300 font-black text-xl italic whitespace-pre-line">
                      {showKorean 
                        ? "아직 기록된 마음 일기가 없습니다.\n첫 기록을 남겨보세요!" 
                        : "No saved gratitude records yet.\nStart writing your first one!"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {entries.map((entry) => (
                      <motion.div 
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                           <div>
                              <p className="text-xs font-black text-rose-300 uppercase tracking-widest mb-1">{entry.date}</p>
                              <div className="w-12 h-1 bg-rose-100 rounded-full"></div>
                           </div>
                           <div className="flex gap-2">

                              <button 
                                onClick={() => handleSpeak(`${entry.ppcSentence}. ${entry.soThatSentence}. ${entry.content}`)}
                                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                title="Listen"
                              >
                                <Volume2 size={24} />
                              </button>
                              <button 
                                onClick={() => handleEdit(entry)}
                                className="flex items-center gap-2 p-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all font-black text-sm"
                                title="Edit"
                              >
                                <Edit size={24} />
                                <span>{showKorean ? "수정" : "EDIT"}</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(entry.id)}
                                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                title="Delete"
                              >
                                <Trash2 size={24} />
                              </button>

                           </div>
                        </div>
    
                        <div className="space-y-6">
                          {(entry.ppcSentence || entry.soThatSentence) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {entry.ppcSentence && (
                                <div className="bg-indigo-50/80 p-5 rounded-3xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
                                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.15em] block mb-2">
                                    {(visibleTranslations[entry.id] || showKorean) ? "현재상태 (PPC)" : "Mental Status (PPC)"}
                                  </span>
                                  <p className="text-lg font-bold text-indigo-900 italic leading-snug">"{entry.ppcSentence}"</p>
                                  {visibleTranslations[entry.id] && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-3 pt-3 border-t border-indigo-100 text-sm font-bold text-indigo-400"
                                    >
                                      {entry.ppcSentenceKo || "번역 중..."}
                                    </motion.div>
                                  )}
                                </div>
                              )}
                              {entry.soThatSentence && (
                                <div className="bg-emerald-50/80 p-5 rounded-3xl border-2 border-emerald-100 shadow-sm relative overflow-hidden">
                                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.15em] block mb-2">
                                    {(visibleTranslations[entry.id] || showKorean) ? "스트레스 관리 (So~That)" : "Stress Management (So~That)"}
                                  </span>
                                  <p className="text-lg font-bold text-emerald-900 italic leading-snug">"{entry.soThatSentence}"</p>
                                  {visibleTranslations[entry.id] && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-3 pt-3 border-t border-emerald-100 text-sm font-bold text-emerald-400"
                                    >
                                      {entry.soThatSentenceKo || "번역 중..."}
                                    </motion.div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="pl-6 border-l-8 border-rose-500 bg-rose-50/30 p-6 rounded-r-[32px] relative overflow-hidden">
                            <span className="text-[11px] font-black text-rose-600 uppercase tracking-[0.15em] block mb-2">
                              {(visibleTranslations[entry.id] || showKorean) ? "감사 메모" : "Gratitude Notes"}
                            </span>
                            <p className="text-2xl font-black text-rose-950 leading-tight">{entry.content}</p>
                            {visibleTranslations[entry.id] && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 pt-4 border-t border-rose-100 text-lg font-black text-rose-400 italic"
                                >
                                  {entry.contentKo || "번역 중..."}
                                </motion.div>
                              )}
                          </div>
                        </div>

                        {/* Reaction & Comment Section for Personal View */}
                        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
                          <div className="flex flex-wrap gap-2">
                             {['👍', '❤️', '👏', '🔥', '✨', '😊', '😭', '💪'].map(emoji => (
                               <button 
                                  key={emoji}
                                  onClick={() => handleReaction(entry.id, emoji)}
                                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all flex items-center gap-1.5 ${entry.reactions?.[emoji] ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                               >
                                  <span>{emoji}</span>
                                  {entry.reactions?.[emoji] && <span className="text-[10px]">{entry.reactions[emoji]}</span>}
                               </button>
                             ))}
                          </div>
                          <div className="space-y-3">
                             {entry.comments && entry.comments.length > 0 && (
                               <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl">
                                  {entry.comments.map(c => (
                                    <div key={c.id} className="text-xs">
                                       <span className="font-black text-rose-500 mr-2">{c.author}</span>
                                       <span className="text-slate-600">{c.text}</span>
                                    </div>
                                  ))}
                               </div>
                             )}
                             <div className="relative">
                                <input 
                                  type="text"
                                  value={commentInput[entry.id] || ''}
                                  onChange={(e) => setCommentInput({...commentInput, [entry.id]: e.target.value})}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(entry.id)}
                                  placeholder={showKorean ? "나의 생각이나 댓글을 남겨보세요..." : "Write a comment or share your thoughts..."}
                                  className="w-full h-10 pl-4 pr-10 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-rose-100 transition-all"
                                />
                                <button onClick={() => handleAddComment(entry.id)} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 p-1"><Send size={16} /></button>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 relative">
              <h2 className="text-6xl font-black text-slate-800 tracking-tighter uppercase">My Class Diary</h2>
              <p className="text-indigo-500 font-black uppercase tracking-[0.2em] text-xl italic underline underline-offset-8 decoration-indigo-200 decoration-4">우리 반 친구들의 감사 기록장</p>
              <button 
                onClick={refreshData}
                className="absolute right-0 top-0 p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 hover:border-indigo-100 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-black text-xs uppercase tracking-widest"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence initial={false}>
                {Array.from(new Map([...classEntries, ...entries].map(entry => [entry.id, entry])).values())
                  .sort((a, b) => {
                    const idA = isNaN(Number(a.id)) ? 0 : Number(a.id);
                    const idB = isNaN(Number(b.id)) ? 0 : Number(b.id);
                    return idB - idA;
                  })
                  .map((entry, idx) => (
                  <motion.div 
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-8 rounded-[40px] shadow-lg border border-indigo-50 hover:shadow-2xl transition-all relative flex flex-col justify-between"
                  >
                     <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md ${idx % 3 === 0 ? 'bg-rose-400' : idx % 3 === 1 ? 'bg-indigo-400' : 'bg-emerald-400'}`}>
                               {entry.author?.charAt(0)}
                            </div>
                            <div>
                               <p className="font-black text-slate-800 text-lg leading-none">{entry.author}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{entry.date.split('요일')[0]}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">

                             <button 
                               onClick={() => handleEdit(entry)}
                               className="flex items-center gap-1.5 p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-black text-xs"
                               title="Edit"
                             >
                               <Edit size={18} />
                               <span>{showKorean ? "수정" : "EDIT"}</span>
                             </button>
                             <button 
                               onClick={() => handleSpeak(`${entry.ppcSentence}. ${entry.soThatSentence}. ${entry.content}`)}
                               className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                               title="Listen"
                             >
                               <Volume2 size={18} />
                             </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-2 border-l-8 border-rose-500 pl-4 bg-rose-50/50 py-4 pr-4 rounded-r-3xl">
                             <span className="inline-block px-2 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase tracking-widest mb-1">Gratitude</span>
                             <p className="text-xl font-bold text-rose-950 leading-tight">"{entry.content}"</p>
                             {visibleTranslations[entry.id] && (
                               <motion.p 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 className="text-xs font-black text-rose-400 italic pt-2 mt-2 border-t border-rose-100"
                               >
                                 {entry.contentKo || "번역 중..."}
                               </motion.p>
                             )}
                           </div>
                           {(entry.ppcSentence || entry.soThatSentence) && (
                             <div className="space-y-3 pt-4 border-t border-slate-50">
                               {entry.ppcSentence && (
                                 <div className="bg-indigo-50 p-4 rounded-2xl border-l-8 border-indigo-400">
                                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Current Status (PPC)</p>
                                   <p className="text-sm text-indigo-900 font-bold italic leading-relaxed">"{entry.ppcSentence}"</p>
                                   {visibleTranslations[entry.id] && (
                                     <motion.p 
                                       initial={{ opacity: 0, height: 0 }}
                                       animate={{ opacity: 1, height: 'auto' }}
                                       className="text-[10px] font-bold text-indigo-400 pt-2 mt-2 border-t border-indigo-100"
                                     >
                                       {entry.ppcSentenceKo || "번역 중..."}
                                     </motion.p>
                                   )}
                                 </div>
                               )}
                               {entry.soThatSentence && (
                                 <div className="bg-emerald-50 p-4 rounded-2xl border-l-8 border-emerald-400">
                                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Stress Management (So~That)</p>
                                   <p className="text-sm text-emerald-900 font-bold italic leading-relaxed">"{entry.soThatSentence}"</p>
                                   {visibleTranslations[entry.id] && (
                                     <motion.p 
                                       initial={{ opacity: 0, height: 0 }}
                                       animate={{ opacity: 1, height: 'auto' }}
                                       className="text-[10px] font-bold text-emerald-400 pt-2 mt-2 border-t border-emerald-100"
                                     >
                                       {entry.soThatSentenceKo || "번역 중..."}
                                     </motion.p>
                                   )}
                                 </div>
                               )}
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
                        {/* Reactions */}
                        <div className="flex flex-wrap gap-2">
                           {['👍', '❤️', '👏', '🔥', '✨', '😊', '😭', '💪'].map(emoji => (
                             <button 
                                key={emoji}
                                onClick={() => handleReaction(entry.id, emoji)}
                                className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all flex items-center gap-1.5 ${entry.reactions?.[emoji] ? 'bg-indigo-50 border-indigo-100 text-indigo-600 scale-105 shadow-sm' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                             >
                                <span>{emoji}</span>
                                {entry.reactions?.[emoji] && <span className="text-[10px]">{entry.reactions[emoji]}</span>}
                             </button>
                           ))}
                        </div>

                        {/* Comments */}
                        <div className="space-y-3">
                           {entry.comments && entry.comments.length > 0 && (
                             <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl">
                                {entry.comments.slice(-2).map(c => (
                                  <div key={c.id} className="text-xs">
                                     <span className="font-black text-indigo-500 mr-2">{c.author}</span>
                                     <span className="text-slate-600">{c.text}</span>
                                  </div>
                                ))}
                             </div>
                           )}
                           <div className="relative">
                              <input 
                                type="text"
                                value={commentInput[entry.id] || ''}
                                onChange={(e) => setCommentInput({...commentInput, [entry.id]: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(entry.id)}
                                placeholder="댓글을 남겨주세요..."
                                className="w-full h-10 pl-4 pr-10 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                              />
                              <button 
                                onClick={() => handleAddComment(entry.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors p-1"
                              >
                                <Send size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ZentangleView = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [showKorean, setShowKorean] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [entries, setEntries] = useState<ZentangleEntry[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('none');
    const [viewMode, setViewMode] = useState<'draw' | 'diary'>('draw');
    const [zentangleCommentInput, setZentangleCommentInput] = useState<{ [id: string]: string }>({});

    const imageTemplates = [
        { id: 'heart', label: 'Heart', src: heartTemplate, exampleSrc: heartExample, source: '출처: 사용자 제공 이미지' },
        { id: 'template_dog', label: '도안 1', src: dogTemplate, exampleSrc: dogExample, source: '출처: 사용자 제공 이미지' },
        { id: 'template_cat', label: '도안 2', src: catTemplate, exampleSrc: catExample, source: '출처: 사용자 제공 이미지' },
    ];

    const drawTemplate = (templateId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear first
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (templateId === 'none') return;

        // Handle image templates
        const imgTemplate = imageTemplates.find(t => t.id === templateId);
        if (imgTemplate) {
            const img = new Image();
            img.src = imgTemplate.src;
            img.onload = () => {
                // Ensure the context state is reset before drawing image
                ctx.setLineDash([]);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Restore current brush settings
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
            };
            return;
        }

        ctx.save();
        ctx.strokeStyle = '#e2e8f0'; // Light gray for guide lines
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed lines for guide

        const w = canvas.width;
        const h = canvas.height;

        if (templateId === 'sections') {
            // Random-ish sections
            ctx.beginPath();
            ctx.moveTo(w * 0.1, h * 0.1);
            ctx.quadraticCurveTo(w * 0.5, h * 0.2, w * 0.9, h * 0.15);
            ctx.quadraticCurveTo(w * 0.8, h * 0.6, w * 0.85, h * 0.9);
            ctx.quadraticCurveTo(w * 0.4, h * 0.8, w * 0.15, h * 0.85);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * 0.1, h * 0.1);
            ctx.lineTo(w * 0.85, h * 0.9);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(w * 0.9, h * 0.15);
            ctx.lineTo(w * 0.15, h * 0.85);
            ctx.stroke();
        } else if (templateId === 'mandala') {
            // Concentric circles
            for (let r = 1; r <= 3; r++) {
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, (w / 2) * (r / 3.5), 0, Math.PI * 2);
                ctx.stroke();
            }
            // Radiating lines
            for (let a = 0; a < 8; a++) {
                ctx.beginPath();
                ctx.moveTo(w / 2, h / 2);
                const angle = (a * Math.PI) / 4;
                ctx.lineTo(w / 2 + Math.cos(angle) * w * 0.45, h / 2 + Math.sin(angle) * h * 0.45);
                ctx.stroke();
            }
        }

        ctx.restore();
    };

    const handleTemplateSelect = (id: string) => {
        setSelectedTemplate(id);
        drawTemplate(id);
    };

    useEffect(() => {
        // User requested to delete all 3 existing posts in "Our Class Zentangle Drawings"
        // We'll perform a one-time cleanup of the zentangle_wall storage
        if (!localStorage.getItem('zentangle_cleanup_v1')) {
            localStorage.removeItem('zentangle_wall');
            localStorage.setItem('zentangle_cleanup_v1', 'true');
            setEntries([]);
        } else {
            // Load entries from localStorage if already cleaned or for subsequent sessions
            const saved = localStorage.getItem('zentangle_wall');
            if (saved) {
                try {
                    setEntries(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse zentangle entries", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
    }, [color, lineWidth]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Initial white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = ('touches' in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = ('touches' in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = ('touches' in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = ('touches' in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // After clearing with white, if a template is selected, we should redraw it
        if (selectedTemplate !== 'none') {
            drawTemplate(selectedTemplate);
        }
    };

    const saveToWall = () => {
        if (!authorName.trim()) {
            alert(showKorean ? "이름을 입력해주세요!" : "Please enter your name!");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const imageData = canvas.toDataURL('image/png');
        const newEntry: ZentangleEntry = {
            id: Date.now().toString(),
            author: authorName,
            imageData: imageData,
            date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
            reactions: { '❤️': 0 }
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem('zentangle_wall', JSON.stringify(updated));
        
        // Reset name for next person or just confirmation
        alert(showKorean ? "학급 그림장에 저장되었습니다!" : "Saved to Our Class Drawings!");
    };

    const handleReaction = (entryId: string, emoji: string) => {
        const updated = entries.map(e => {
            if (e.id === entryId) {
                const reactions = { ...e.reactions };
                reactions[emoji] = (reactions[emoji] || 0) + 1;
                return { ...e, reactions };
            }
            return e;
        });
        setEntries(updated);
        localStorage.setItem('zentangle_wall', JSON.stringify(updated));
    };

    const handleAddZentangleComment = (entryId: string) => {
        const text = zentangleCommentInput[entryId];
        if (!text?.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: authorName || (showKorean ? '익명 친구' : 'Anonymous friend'),
            text: text,
            date: new Date().toISOString()
        };

        const updated = entries.map(e => {
            if (e.id === entryId) {
                return { ...e, comments: [...(e.comments || []), newComment] };
            }
            return e;
        });

        setEntries(updated);
        setZentangleCommentInput({ ...zentangleCommentInput, [entryId]: '' });
        localStorage.setItem('zentangle_wall', JSON.stringify(updated));
    };

    return (
        <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="space-y-2">
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter uppercase whitespace-nowrap leading-none">Zentangle Collection</h2>
            <p className="text-xl font-bold text-slate-400">Zen Art for Emotional Healing & Mindfulness</p>
          </div>
          <div className="flex items-center gap-3 mb-1 flex-nowrap">
            <button 
                onClick={() => setViewMode('draw')}
                className={`px-6 py-3 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'draw' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
            >
                {showKorean ? "나의 그림" : "MY DRAWING"}
            </button>
            <button 
                onClick={() => setViewMode('diary')}
                className={`px-6 py-3 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'diary' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
            >
                {showKorean ? "학급 그림장" : "CLASS DRAWINGS"}
            </button>
          </div>
        </div>

            {viewMode === 'draw' ? (
                <>
                    {/* How-to moved to top */}
                    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{showKorean ? "젠탱글 그리는 방법" : "HOW TO CREATE A ZENTANGLE"}</h3>
                            <button 
                                onClick={() => setShowKorean(!showKorean)}
                                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-2 rounded-2xl font-black hover:bg-indigo-100 transition-all"
                            >
                                <Languages size={20} /> {showKorean ? "English" : "한글"}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <Palette size={24} />
                                </div>
                                <h4 className="text-xl font-black text-slate-800">{showKorean ? "1단계: 집중" : "Step 1: Focus"}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {showKorean 
                                        ? "각 획에 긴장을 풀고 집중하세요. 젠탱글에는 실수가 없습니다." 
                                        : "Relax and focus on each stroke. There are no mistakes in Zentangle."}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <Brush size={24} />
                                </div>
                                <h4 className="text-xl font-black text-slate-800">{showKorean ? "2단계: 패턴" : "Step 2: Pattern"}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {showKorean 
                                        ? "단순한 패턴을 반복하세요. 마음을 진정시키고 스트레스를 줄여줍니다." 
                                        : "Repeat simple patterns. It helps calm the mind and reduce stress."}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                    <Heart size={24} />
                                </div>
                                <h4 className="text-xl font-black text-slate-800">{showKorean ? "3단계: 감상" : "Step 3: Appreciate"}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {showKorean 
                                        ? "작품을 감상하세요. 당신의 마음 상태를 반영합니다." 
                                        : "Appreciate your creation. It reflects your state of mind."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                        <div className="p-8 bg-slate-50 border-r border-slate-100 space-y-8 w-full md:w-80">
                             <div className="max-w-[200px]">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Your Name</p>
                                <input 
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder={showKorean ? "이름을 입력하세요" : "Enter your name"}
                                    className="w-full bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm text-sm"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{showKorean ? "도안 선택" : "Select Template"}</p>
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    {[
                                        { id: 'none', label: 'Blank' },
                                        { id: 'sections', label: 'Sections' },
                                        { id: 'mandala', label: 'Mandala' },
                                        ...imageTemplates
                                    ].map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => handleTemplateSelect(t.id)}
                                            className={`p-3 rounded-xl border font-black text-xs transition-all ${selectedTemplate === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                                {selectedTemplate.startsWith('template') && (
                                    <div className="mt-4 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">{showKorean ? "예시 작품" : "Example Art"}</p>
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                            <img 
                                                src={imageTemplates.find(t => t.id === selectedTemplate)?.exampleSrc} 
                                                alt="Example"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 italic mt-3">
                                            Source: {imageTemplates.find(t => t.id === selectedTemplate)?.source}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={clearCanvas}
                                    className="flex items-center justify-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-rose-600 transition-all active:scale-95"
                                >
                                    <Trash2 size={20} /> CLEAR ALL
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all active:scale-95"
                                >
                                    PRINT ART
                                </button>
                            </div>

                            <button 
                                onClick={saveToWall}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-4 rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95 group"
                            >
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                {showKorean ? "학급 그림장에 공유" : "SHARE TO DRAWINGS"}
                            </button>
                        </div>

                        <div className="flex-1 bg-slate-100 p-8 flex flex-col items-center justify-center overflow-hidden">
                            <div className="bg-white p-4 shadow-inner rounded-lg ring-1 ring-slate-200 relative">
                                <canvas 
                                    ref={canvasRef}
                                    width={600}
                                    height={600}
                                    className="bg-white cursor-crosshair max-w-full h-auto touch-none"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase whitespace-nowrap leading-none">Our Class Zentangle Drawings</h3>
                            <p className="text-lg font-bold text-slate-400 italic">Appreciate and comment on your classmates' artwork</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <button 
                                onClick={() => {
                                    if (window.confirm(showKorean ? "정말로 모든 젠탱글 기록을 삭제하시겠습니까?" : "Are you sure you want to delete all Zentangle records?")) {
                                        setEntries([]);
                                        localStorage.removeItem('zentangle_wall');
                                    }
                                }}
                                className="px-3 py-1.5 bg-slate-50 text-slate-400 hover:text-rose-500 border border-slate-100 rounded-xl transition-all flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-sm"
                            >
                                <Trash2 size={10} /> CLEAR ALL
                            </button>
                            <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-slate-400 shadow-sm">
                               <span className="text-indigo-600 font-black">{entries.length}</span> MASTERPIECES
                            </div>
                        </div>
                    </div>

                    {entries.length === 0 ? (
                        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                            <Palette className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-xl font-bold text-slate-400">Be the first to share your art!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {entries.map((entry) => (
                                <motion.div 
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 flex flex-col group hover:shadow-2xl transition-all"
                                >
                                    <div className="aspect-square bg-slate-50 p-6 flex items-center justify-center relative overflow-hidden">
                                         <img src={entry.imageData} alt={`Zentangle by ${entry.author}`} className="max-w-full max-h-full shadow-lg rounded-lg transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-sm">
                                                    {entry.author.slice(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-800">{entry.author}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{entry.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Reactions */}
                                        <div className="flex gap-2">
                                            {['❤️', '✨', '👏', '🎨', '😭', '🙌'].map(emoji => (
                                                <button 
                                                    key={emoji}
                                                    onClick={() => handleReaction(entry.id, emoji)}
                                                    className="bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-2xl text-lg transition-all flex items-center gap-2 border border-slate-100 active:scale-90"
                                                >
                                                    {emoji} <span className="text-sm font-black text-slate-600">{(entry.reactions || {})[emoji] || 0}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Comments - New for Zentangle */}
                                        <div className="space-y-4 pt-4 border-t border-slate-50">
                                            {entry.comments && entry.comments.length > 0 && (
                                                <div className="space-y-2">
                                                    {entry.comments.slice(-3).map(c => (
                                                        <div key={c.id} className="bg-slate-50 p-3 rounded-xl text-sm">
                                                            <span className="font-black text-indigo-600 mr-2">{c.author}</span>
                                                            <span className="text-slate-600">{c.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="relative">
                                                <input 
                                                    type="text"
                                                    value={zentangleCommentInput[entry.id] || ''}
                                                    onChange={(e) => setZentangleCommentInput({...zentangleCommentInput, [entry.id]: e.target.value})}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddZentangleComment(entry.id)}
                                                    placeholder={showKorean ? "댓글 작성..." : "Add comment..."}
                                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 transition-all font-bold placeholder:text-slate-200"
                                                />
                                                <button 
                                                    onClick={() => handleAddZentangleComment(entry.id)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                                                >
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
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
              <div className="flex flex-col gap-3 pt-4 items-start">
                 <button className="bg-white text-[#4C51BF] px-6 py-4 rounded-xl font-black text-lg md:text-xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap">GO! TODAYS MISSION</button>
                 <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-xl font-black text-lg md:text-xl hover:bg-white/20 transition-all text-white whitespace-nowrap">MY STATS</button>
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
             title="READING" tagline="본문 입체 분석 및 독해 챌린지" variant="white" accent="emerald" 
             icon={<BookOpen size={42} />} onClick={() => navTo('reading')} 
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