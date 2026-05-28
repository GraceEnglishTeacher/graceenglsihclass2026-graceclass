import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Award, 
  CheckCircle,
  ChevronLeft, 
  ChevronRight, 
  Languages, 
  RotateCcw, 
  HelpCircle, 
  Trophy, 
  Star, 
  Sparkles, 
  BookOpen, 
  ListTodo,
  Check,
  AlertCircle,
  Users,
  Heart,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import teenStressChart from '../assets/images/teen_stress_chart_final_v2_1779947206607.png';

// --- Types ---
interface DialogueBlank {
  index: number;
  word: string;
  hint: string;
}

interface DialogueLine {
  speaker: 'W' | 'B' | 'B1' | 'B2' | 'G';
  text: string;
  translation: string;
  blanks?: DialogueBlank[];
}

interface DialogueData {
  id: number;
  title: string;
  titleKo: string;
  topic: string;
  topicKo: string;
  lines: DialogueLine[];
}

interface QuizQuestion {
  id: number;
  question: string;
  questionKo: string;
  options: string[];
  answerIndex: number; // 0-based
  explanation: string;
  explanationKo: string;
}

const DIALOGUE_DATA: DialogueData[] = [
  {
    id: 1,
    title: "Dialogue 1: Teen Stress Survey",
    titleKo: "대화 1: 십 대 스트레스 조사",
    topic: "Causes of Teen Stress",
    topicKo: "십 대 스트레스의 원인들",
    lines: [
      {
        speaker: "W",
        text: "Today, I’d like to talk to you about teen stress.",
        translation: "오늘 저는 여러분에게 십 대 스트레스에 대해 이야기하고자 합니다.",
        blanks: [{ index: 1, word: "teen", hint: "십대의, 청소년의 (t _ _ _)" }]
      },
      {
        speaker: "W",
        text: "What makes you feel the most stressed?",
        translation: "무엇이 여러분을 가장 스트레스 받게 만드나요?",
        blanks: [{ index: 2, word: "makes you feel", hint: "너를 ~하게 느끼도록 만드는 법 (m _ _ _ _  y _ _  f _ _ _)" }]
      },
      {
        speaker: "W",
        text: "About 9,000 teens answered this question.",
        translation: "약 9,000명의 십 대들이 이 질문에 답변했습니다."
      },
      {
        speaker: "W",
        text: "As you can see, schoolwork was the most common cause of stress.",
        translation: "보시다시피, 학업이 가장 흔한 스트레스 원인이었습니다.",
        blanks: [{ index: 3, word: "schoolwork", hint: "학업, 공부 (s _ _ _ _ _ _ _ _ _)" }]
      },
      {
        speaker: "W",
        text: "Over half of the students said schoolwork stresses them the most.",
        translation: "학생들의 절반 이상이 학업이 자신을 가장 스트레스 받게 한다고 답했습니다.",
        blanks: [{ index: 4, word: "half", hint: "절반, 2분의 1 (h _ _ _)" }]
      },
      {
        speaker: "W",
        text: "Problems with friends took second place with 15.3%.",
        translation: "친구들과의 문제가 15.3%로 2위를 차지했습니다.",
        blanks: [{ index: 5, word: "second place", hint: "2위, 이등 (s _ _ _ _ _  p _ _ _ _)" }]
      },
      {
        speaker: "W",
        text: "Next came family and worries about the future.",
        translation: "다음은 가족과 미래에 대한 걱정이 뒤를 이었습니다.",
        blanks: [{ index: 6, word: "worries about", hint: "~에 관한 걱정들 (w _ _ _ _ _ _  a _ _ _ _)" }]
      },
      {
        speaker: "W",
        text: "8.2% of the students said they get stressed because of their appearance.",
        translation: "학생들의 8.2%는 외모 때문에 스트레스를 받는다고 답했습니다.",
        blanks: [{ index: 7, word: "8.2", hint: "숫자 팔 점 이 (8.2)" }]
      }
    ]
  },
  {
    id: 2,
    title: "Dialogue 2: Is Stress Always Bad?",
    titleKo: "대화 2: 스트레스는 항상 나쁠까?",
    topic: "Oliver and Mom's Stress Talk",
    topicKo: "올리버와 엄마의 스트레스 이야기",
    lines: [
      {
        speaker: "W",
        text: "What are you doing, Oliver?",
        translation: "올리버, 무엇을 하고 있니?"
      },
      {
        speaker: "B",
        text: "I’m studying for the math test, Mom. Grades stress me out.",
        translation: "수학 시험공부를 하고 있어요, 엄마. 성적이 저를 정말 스트레스 받게 해요.",
        blanks: [{ index: 8, word: "studying for", hint: "~을 공부하는 중 (s _ _ _ _ _ _ _  f _ _)" }]
      },
      {
        speaker: "W",
        text: "I understand. I used to feel that way, too.",
        translation: "이해한단다. 나도 예전엔 그렇게 느끼곤 했지.",
        blanks: [{ index: 9, word: "that way", hint: "그런 방식으로, 그렇게 (t _ _ _  w _ _)" }]
      },
      {
        speaker: "B",
        text: "Really? I didn’t know that.",
        translation: "정말요? 저는 몰랐어요."
      },
      {
        speaker: "W",
        text: "Yeah, but a little stress was helpful for me.",
        translation: "응, 하지만 약간의 스트레스는 나에게 도움이 되었단다.",
        blanks: [{ index: 10, word: "helpful", hint: "도움이 되는, 유익한 (h _ _ _ _ _ _)" }]
      },
      {
        speaker: "B",
        text: "What makes you say that?",
        translation: "왜 그렇게 말씀하세요?",
        blanks: [{ index: 11, word: "say", hint: "동사 원형: 말하다 (s _ _)" }]
      },
      {
        speaker: "W",
        text: "I got stressed when I had an exam, but at the same time it made me focus and try harder.",
        translation: "시험이 있을 때 스트레스를 받았지만, 동시에 그것은 제가 더 집중하고 더 열심히 하게 만들었어요.",
        blanks: [{ index: 12, word: "made me focus", hint: "내가 집중하게 만들다 (m _ _ _  m e  f _ _ _ _)" }]
      },
      {
        speaker: "B",
        text: "I see. Did stress help you in other ways?",
        translation: "그렇군요. 스트레스가 다른 면에서도 도움이 되었나요?"
      },
      {
        speaker: "W",
        text: "Yes, it helped improve my memory.",
        translation: "응, 기억력을 향상시키는 데 도움을 주었지.",
        blanks: [{ index: 13, word: "memory", hint: "기억력 (m _ _ _ _ _)" }]
      }
    ]
  },
  {
    id: 3,
    title: "Dialogue 3: Class T-shirt Design",
    titleKo: "대화 3: 우리 반 단체 티셔츠 디자인",
    topic: "Choosing Sports Day T-shirts",
    topicKo: "체육대회 티셔츠 고르기",
    lines: [
      {
        speaker: "B1",
        text: "Today, let’s talk about the class T-shirt. We have to decide on the design.",
        translation: "오늘, 우리 반 단체 티셔츠에 대해 얘기해 보자. 디자인을 결정해야 돼.",
        blanks: [{ index: 14, word: "talk about", hint: "~에 대해 이야기하다 (t _ _ _  a _ _ _ _)" }]
      },
      {
        speaker: "G",
        text: "Let me show you some designs on the screen.",
        translation: "화면에 몇 가지 디자인들을 보여줄게.",
        blanks: [{ index: 15, word: "designs", hint: "디자인들 (d _ _ _ _ _ s)" }]
      },
      {
        speaker: "B2",
        text: "We have to choose a T-shirt with short sleeves.",
        translation: "우리는 반소매 티셔츠를 골라야 해."
      },
      {
        speaker: "B1",
        text: "What makes you say that?",
        translation: "왜 그렇게 말하니?"
      },
      {
        speaker: "B2",
        text: "Because we’ll wear the T-shirt on Sports Day. It’s in June.",
        translation: "왜냐하면 우리가 체육대회 날에 그 티셔츠를 입을 것이기 때문이야. 체육대회는 6월이잖아.",
        blanks: [{ index: 16, word: "Because we'll wear", hint: "왜냐하면 우리가 입을 것이기 때문에 (B _ _ _ _ _ e  w _ ' _ _  w _ _ r)" }]
      },
      {
        speaker: "G",
        text: "That makes sense. What about this green one?",
        translation: "말이 되네. 이 초록색은 어때?",
        blanks: [{ index: 17, word: "green", hint: "초록색 (g _ _ _ _)" }]
      },
      {
        speaker: "B2",
        text: "I like it. The bee on the T-shirt is so cute.",
        translation: "마음에 들어. 티셔츠에 벌 캐릭터가 아주 귀여워."
      },
      {
        speaker: "G",
        text: "And it’s not expensive.",
        translation: "그리고 가격도 비싸지 않아.",
        blanks: [{ index: 18, word: "expensive", hint: "비싼 (e x p _ _ _ _ _ _)" }]
      },
      {
        speaker: "B1",
        text: "Yes. I think it’s the best one.",
        translation: "응. 내 생각에도 그게 가장 좋은 것 같아."
      }
    ]
  }
];

const QUIZ_DATA: { [dialogueId: number]: QuizQuestion[] } = {
  1: [
    {
      id: 101,
      question: "What is the main topic of Dialogue 1?",
      questionKo: "대화 1의 주된 주제는 무엇인가요?",
      options: [
        "How teens overcome friendship problems",
        "The most common causes of teen stress",
        "The benefits of working hard at school",
        "How to improve your physical appearance"
      ],
      answerIndex: 1,
      explanation: "The presenter announces: 'Today, I'd like to talk to you about teen stress. What makes you feel the most stressed?' and compiles different stressors.",
      explanationKo: "발표자는 '오늘 저는 여러분에게 십 대 스트레스에 대해 이야기하고자 합니다. 무엇이 여러분을 가장 스트레스 받게 만드나요?'라고 말하며 스트레스 요인을 소개하고 있습니다."
    },
    {
      id: 102,
      question: "Which of the following stresses teens the most according to the survey?",
      questionKo: "설명에 따르면 십 대들에게 가장 큰 스트레스를 주는 요인은 무엇인가요?",
      options: [
        "Appearance problems",
        "Problems with friends",
        "Schoolwork / studies",
        "Future worries"
      ],
      answerIndex: 2,
      explanation: "She says: 'schoolwork was the most common cause of stress. Over half of the students said...' (Over 50% selected schoolwork).",
      explanationKo: "발표자는 '학업(schoolwork)이 가장 흔한 스트레스 원인이었습니다. 절반 이상의 학생들이 답했다'고 언급했습니다."
    },
    {
      id: 103,
      question: "What took second place among common causes of stress with 15.3%?",
      questionKo: "15.3%를 차지하며 흔한 스트레스 원인 중 2위를 차지한 것은 무엇인가요?",
      options: [
        "Appearance and beauty",
        "Worries about the future",
        "Family issues",
        "Problems with friends"
      ],
      answerIndex: 3,
      explanation: "The text says: 'Problems with friends took second place with 15.3%'.",
      explanationKo: "텍스트에 명시적으로 '친구들과의 문제(Problems with friends)가 15.3%로 2위를 차지했다'고 나와 있습니다."
    },
    {
      id: 104,
      question: "Which option correctly fills blank (4) and (6) in the script?",
      questionKo: "스크립트의 빈칸 (4)와 (6)에 들어갈 단어가 올바르게 짝지어진 것은?",
      options: [
        "(4) twice, (6) dreams for",
        "(4) half, (6) worries about",
        "(4) third, (6) thinking of",
        "(4) portion, (6) caring for"
      ],
      answerIndex: 1,
      explanation: "(4) is 'half' (Over half of the students) and (6) is 'worries about' (worries about the future).",
      explanationKo: "(4)번 빈칸에는 '절반'을 의미하는 'half'가 오고, (6)번 빈칸에는 미래에 대한 '걱정'을 의미하는 'worries about'이 위치하게 됩니다."
    }
  ],
  2: [
    {
      id: 201,
      question: "Why is the boy Oliver feeling stressed out?",
      questionKo: "소년 올리버는 왜 지금 스트레스를 느끼고 있나요?",
      options: [
        "He has high stress from cleaning his room.",
        "He has an argument with his mom.",
        "School grades and studying for the math test make him anxious.",
        "He forgot to buy a present for his parent."
      ],
      answerIndex: 2,
      explanation: "Oliver says: 'I'm studying for the math test, Mom. Grades stress me out.'",
      explanationKo: "올리버는 엄마에게 '수학 시험공부를 하고 있어요, 엄마. 성적(Grades) 때문에 스트레스를 받아요'라고 말하고 있습니다."
    },
    {
      id: 202,
      question: "According to the mom, how was stress helpful to her in the past?",
      questionKo: "엄마의 말에 따르면, 과거에 스트레스가 그녀에게 어떤 유익을 주었나요?",
      options: [
        "It helped her sleep longer at night.",
        "It made her focus, try harder on exams, and improved memory.",
        "It cured all test-taking anxiety permanently.",
        "It encouraged her to spend time on leisure activities."
      ],
      answerIndex: 1,
      explanation: "Mom says: 'it made me focus and try harder' and later 'it helped improve my memory.'",
      explanationKo: "엄마는 스트레스가 당시 더 집중하고 열심히(focus and try harder) 공부하게 자극을 주었으며, 더욱이 기억력 향상(improve my memory)에도 도움이 되었다고 실례를 들고 있습니다."
    },
    {
      id: 203,
      question: "Which of the following phrases is used by Oliver to ask the reason behind his mother's opinion?",
      questionKo: "올리버가 그의 어머니 의견에 대한 구체적인 이유를 물어볼 때 사용한 표현은 무엇인가요?",
      options: [
        "How do you feel about this?",
        "Do you have any questions?",
        "What makes you say that?",
        "Can you help me with this math test?"
      ],
      answerIndex: 2,
      explanation: "Oliver asks: 'What makes you say that?' (Blank 11 detail) which asks the mother for reasons behind saying stress was helpful.",
      explanationKo: "상대방 의견의 근거/이유를 물어볼 때 자주 사용하는 핵심 표현인 'What makes you say that?'(왜 그렇게 말씀하시나요?)를 사용했습니다."
    },
    {
      id: 204,
      question: "What correctly fills blank (13) inside Dialogue 2?",
      questionKo: "대화 2의 빈칸 (13)에 들어가 알맞은 낱말은?",
      options: [
        "muscles",
        "grades",
        "memory",
        "interest"
      ],
      answerIndex: 2,
      explanation: "The woman states stress helped improve her memory (13).",
      explanationKo: "수험 시의 적당한 스트레스가 기억력을 향상하도록 한 경험을 들추어, 마지막에 'memory'(기억력)라고 답하고 있습니다."
    }
  ],
  3: [
    {
      id: 301,
      question: "What is the primary objective of B1, G, and B2's discussion?",
      questionKo: "학생 세 명(B1, G, B2)의 대화 핵심 목적은 무엇인가요?",
      options: [
        "Buying sports shoes for Sports Day",
        "Deciding on the design and choice of the class T-shirt",
        "Organizing a school sports competition in June",
        "Studying for an upcoming math test"
      ],
      answerIndex: 1,
      explanation: "B1 says: 'Today, let's talk about the class T-shirt. We have to decide on the design.'",
      explanationKo: "B1이 '오늘, 우리 반 단체 티셔츠(class T-shirt)에 대해 얘기해 보자. 디자인을 골라야 해'라고 시작 의견을 다지고 있습니다."
    },
    {
      id: 302,
      question: "Why does B2 recommend selecting a T-shirt with short sleeves?",
      questionKo: "B2가 긴소매가 아닌 '반소매T'를 골라야 한다고 주장하는 까닭은 무엇인가요?",
      options: [
        "Short sleeves look much more professional on camera.",
        "They will wear it on Sports Day in June, which is hot.",
        "Short-sleeved shirts are much cheaper to purchase.",
        "The cute bee layout fits better on short sleeves."
      ],
      answerIndex: 1,
      explanation: "B2 says: 'Because we'll wear the T-shirt on Sports Day. It's in June.'",
      explanationKo: "B2는 '우리가 그 티셔츠를 6월에 있을 체육 대회(Sports Day) 날짜에 착용할 것이기 때문'에 반소매(short sleeves)가 알맞다고 말했습니다."
    },
    {
      id: 303,
      question: "Which of the following is NOT true about the green T-shirt?",
      questionKo: "초록색 단체 티셔츠에 관하여 올바르지 않은 사실은 무엇인가요?",
      options: [
        "The bee on the T-shirt is cute.",
        "It is expensive.",
        "They agreed it is the best one.",
        "It's proposed by the girl."
      ],
      answerIndex: 1,
      explanation: "The girl says: 'And it’s not expensive.' So saying it is expensive is NOT true.",
      explanationKo: "여학생 G가 '그리고 비싸지 않아(it's not expensive)'라고 했으므로, '비싸다(expensive)'는 설명은 오답입니다."
    },
    {
      id: 304,
      question: "What is the correct English phrasing for blank (16) on page 1 of the study sheet?",
      questionKo: "학습지 1페이지에 나와 있는 빈칸 (16) 공란에 들어가기에 완벽한 득점 답안은 무엇인가요?",
      options: [
        "When we're designing",
        "If you want to choose",
        "Because we'll wear",
        "As we are buying"
      ],
      answerIndex: 2,
      explanation: "Blank (16) is completed with: 'Because we'll wear' the T-shirt on Sports Day.",
      explanationKo: "빈칸 (16)은 '친절하게 체육대회에 그걸 옷으로 사용하게 될 것(입을 것)'이라며 이유를 드는 'Because we'll wear'가 적격한 답안입니다."
    }
  ]
};

export const ListeningMasterView = ({ 
  handleSpeak 
}: { 
  handleSpeak: (t: string) => void 
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'blanks' | 'quiz'>('study');
  const [selectedDialogueId, setSelectedDialogueId] = useState<number>(1);
  const [showTranslations, setShowTranslations] = useState<{ [key: string]: boolean }>({});
  const [globalTranslation, setGlobalTranslation] = useState<boolean>(false);
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState<number | null>(null);

  // --- Worksheet Blank Game State ---
  const [blankAnswers, setBlankAnswers] = useState<{ [key: number]: string }>({});
  const [blankShownHints, setBlankShownHints] = useState<{ [key: number]: boolean }>({});
  const [blankValidation, setBlankValidation] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({});

  // --- Quiz Mode State ---
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const autoAdvanceTimerRef = useRef<any | null>(null);

  // Clear any auto-advancing timers when tab, question index or dialogue changes
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [activeTab, selectedDialogueId, currentQuizIdx]);

  const selectedDialogue = DIALOGUE_DATA.find(d => d.id === selectedDialogueId) || DIALOGUE_DATA[0];
  const dialogueQuizzes = QUIZ_DATA[selectedDialogueId] || [];

  const toggleTranslation = (idx: number) => {
    setShowTranslations(prev => ({ ...prev, [`${selectedDialogueId}-${idx}`]: !prev[`${selectedDialogueId}-${idx}`] }));
  };

  const handleSpeakLine = (text: string, idx: number) => {
    setActiveSpeakerIdx(idx);
    handleSpeak(text);
    // Remove highlight after a rough estimate of spoken duration
    const wordsCount = text.split(' ').length;
    setTimeout(() => {
      setActiveSpeakerIdx(null);
    }, wordsCount * 450 + 1000);
  };

  const speakEntireDialogue = () => {
    const fullText = selectedDialogue.lines.map(line => `${line.speaker}: ${line.text}`).join('. ');
    handleSpeak(fullText);
  };

  const renderTeenStressChart = (isSidebar: boolean = false) => {
    if (selectedDialogueId !== 1) return null;
    return (
      <div className={`bg-slate-50 border border-slate-100 p-3 md:p-4 rounded-[24px] flex flex-col items-center justify-center max-w-full mx-auto shadow-sm my-2 animate-fadeIn ${isSidebar ? 'w-full' : 'max-w-xl'}`}>
        <div className="relative overflow-hidden group w-full flex justify-center">
          <img 
            src={teenStressChart} 
            alt="Causes of Teen Stress" 
            referrerPolicy="no-referrer"
            className={`${isSidebar ? 'max-h-[320px] md:max-h-[380px] lg:max-h-[460px]' : 'max-h-[320px] md:max-h-[380px]'} w-auto max-w-full rounded-xl object-contain border border-slate-200 bg-white p-1 hover:shadow-indigo-50/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.01]`}
          />
        </div>
      </div>
    );
  };

  // --- Blank Validation ---
  const handleBlankCheck = (index: number, answer: string, correctWord: string) => {
    const cleanedAnswer = answer.trim().toLowerCase().replace(/[‘’.?,!‘']/g, '');
    const cleanedCorrect = correctWord.toLowerCase().replace(/[‘’.?,!‘']/g, '');
    
    // Support contracted forms or minor mismatch like we'll vs we will
    if (cleanedAnswer === cleanedCorrect || 
        (cleanedCorrect === "because we'll wear" && cleanedAnswer === "because we will wear") ||
        (cleanedCorrect === "made me focus" && cleanedAnswer === "made me to focus")) {
      setBlankValidation(prev => ({ ...prev, [index]: 'correct' }));
    } else {
      setBlankValidation(prev => ({ ...prev, [index]: 'incorrect' }));
    }
  };

  const showBlankHint = (index: number) => {
    setBlankShownHints(prev => ({ ...prev, [index]: true }));
  };

  const resetBlanks = () => {
    setBlankAnswers({});
    setBlankValidation({});
    setBlankShownHints({});
  };

  // --- Quiz Handlers ---
  const handleOptionSelect = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optionIdx);
    setQuizSubmitted(true);

    const isCorrect = optionIdx === dialogueQuizzes[currentQuizIdx].answerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      // Auto advance in 1.5 seconds if correct
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleQuizNext();
      }, 1500);
    } else {
      // Auto advance in 3.5 seconds if incorrect to give they time to read explanation/translation
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleQuizNext();
      }, 3500);
    }
  };

  const handleQuizSubmit = () => {
    // Deprecated now as submission is instant, but kept for interface compatibility
    if (selectedQuizOption === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === dialogueQuizzes[currentQuizIdx].answerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (currentQuizIdx < dialogueQuizzes.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setCurrentQuizIdx(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Top section heading */}
      <div className="bg-gradient-to-r from-teal-500 to-indigo-600 p-12 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.2em]">
            <Sparkles size={14} className="text-teal-300 fill-teal-300" />
            Voca Master Next Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">LISTENING MASTER</h1>
          <p className="text-teal-100 font-bold max-w-2xl text-sm md:text-base break-keep">
            교과서 Lesson 3 Be Positive, Be Happy 1페이지의 생생한 듣기 대본을 원어민 발음으로 학습하고, 학습지 빈칸 채우기와 이해도 퀴즈를 통해 리스닝을 완벽하게 마스터해 보세요!
          </p>
        </div>
        <div className="absolute bottom-6 right-10 opacity-15 pointer-events-none scale-150">
          <Volume2 size={120} />
        </div>
      </div>

      {/* Mode Navigation Buttons */}
      <div className="flex bg-slate-100 p-2 rounded-3xl gap-2 font-black text-sm md:text-base max-w-md mx-auto shadow-sm border border-slate-200">
        <button 
          onClick={() => { setActiveTab('study'); restartQuiz(); }}
          className={`flex-1 py-4 text-center rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'study' ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
        >
          <BookOpen size={18} />
          대본 학습
        </button>
        <button 
          onClick={() => { setActiveTab('blanks'); restartQuiz(); }}
          className={`flex-1 py-4 text-center rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'blanks' ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
        >
          <ListTodo size={18} />
          빈칸 채우기
        </button>
        <button 
          onClick={() => { setActiveTab('quiz'); restartQuiz(); }}
          className={`flex-1 py-4 text-center rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
        >
          <Trophy size={18} />
          이해 퀴즈
        </button>
      </div>

      {/* Dialogue Selector (Always visible to select Dialogue 1, 2, 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DIALOGUE_DATA.map((diag) => (
          <button
            key={diag.id}
            onClick={() => { 
              setSelectedDialogueId(diag.id); 
              restartQuiz();
              resetBlanks();
            }}
            className={`p-6 rounded-3xl border text-left transition-all ${selectedDialogueId === diag.id ? 'bg-indigo-600 ring-4 ring-indigo-100 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${selectedDialogueId === diag.id ? 'bg-white/20 text-indigo-100' : 'bg-indigo-50 text-indigo-600'}`}>Dialogue {diag.id}</span>
              <Volume2 size={16} className={selectedDialogueId === diag.id ? 'text-white' : 'text-slate-400'} />
            </div>
            <h3 className="font-extrabold text-base leading-tight md:text-lg">{diag.title.split(': ')[1]}</h3>
            <p className={`text-xs mt-1.5 font-bold ${selectedDialogueId === diag.id ? 'text-indigo-200' : 'text-slate-400'}`}>{diag.titleKo}</p>
          </button>
        ))}
      </div>

      {/* Main Study Mode */}
      {activeTab === 'study' && (
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-md border border-slate-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{selectedDialogue.title}</h2>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500" />
                Topic: {selectedDialogue.topic} ({selectedDialogue.topicKo})
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setGlobalTranslation(!globalTranslation)}
                className={`p-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 border ${globalTranslation ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                <Languages size={16} />
                전체 해석 {globalTranslation ? "숨기기" : "보기"}
              </button>
              <button 
                onClick={speakEntireDialogue}
                className="p-4 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-100"
              >
                <Volume2 size={16} />
                전체 듣기 (TTS)
              </button>
            </div>
          </div>

          {selectedDialogueId === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Chart (Sticky on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-4 bg-white z-10">
                {renderTeenStressChart(true)}
              </div>
              
              {/* Right Column: Scripts */}
              <div className="lg:col-span-7 space-y-1 md:space-y-1.5">
                {selectedDialogue.lines.map((line, idx) => {
                  const isSpeaker1 = line.speaker === 'W' || line.speaker === 'G';
                  const isFocused = activeSpeakerIdx === idx;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-2.5 md:gap-3 p-1.5 md:p-2 rounded-xl transition-all border ${isFocused ? 'bg-indigo-50/50 border-indigo-200 shadow-inner' : 'bg-slate-50/20 border-transparent hover:bg-slate-50/50'}`}
                    >
                      {/* Speaker Label Avatar */}
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        line.speaker === 'W' ? 'bg-rose-100 text-rose-700' : 
                        line.speaker === 'B' ? 'bg-cyan-100 text-cyan-700' : 
                        line.speaker === 'G' ? 'bg-violet-100 text-violet-700' : 
                        line.speaker === 'B1' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {line.speaker}
                      </div>

                      {/* Bubble Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-extrabold text-slate-800 text-[16px] md:text-[18.2px] leading-relaxed tracking-wide">
                            {line.text}
                          </p>
                          
                          <button 
                            onClick={() => handleSpeakLine(line.text, idx)}
                            className={`p-1.5 rounded-lg hover:bg-slate-200 transition-colors shrink-0 text-slate-400 hover:text-indigo-600 ${isFocused ? 'animate-pulse text-indigo-600 bg-indigo-150' : ''}`}
                            title="Read aloud"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>

                        {/* Translation */}
                        {globalTranslation && (
                          <p className="text-slate-500 font-bold text-xs md:text-sm pl-0.5 border-l-2 border-indigo-200 mt-0.5 md:mt-1 animate-fadeIn">
                            {line.translation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1 md:space-y-1.5">
              {selectedDialogue.lines.map((line, idx) => {
                const isSpeaker1 = line.speaker === 'W' || line.speaker === 'G';
                const isFocused = activeSpeakerIdx === idx;
                
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-2.5 md:gap-3 p-1.5 md:p-2 rounded-xl transition-all border ${isFocused ? 'bg-indigo-50/50 border-indigo-200 shadow-inner' : 'bg-slate-50/20 border-transparent hover:bg-slate-50/50'}`}
                  >
                    {/* Speaker Label Avatar */}
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                      line.speaker === 'W' ? 'bg-rose-100 text-rose-700' : 
                      line.speaker === 'B' ? 'bg-cyan-100 text-cyan-700' : 
                      line.speaker === 'G' ? 'bg-violet-100 text-violet-700' : 
                      line.speaker === 'B1' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {line.speaker}
                    </div>

                    {/* Bubble Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-extrabold text-slate-800 text-[16px] md:text-[18.5px] leading-relaxed tracking-wide">
                          {line.text}
                        </p>
                        
                        <button 
                          onClick={() => handleSpeakLine(line.text, idx)}
                          className={`p-1.5 rounded-lg hover:bg-slate-200 transition-colors shrink-0 text-slate-400 hover:text-indigo-600 ${isFocused ? 'animate-pulse text-indigo-600 bg-indigo-150' : ''}`}
                          title="Read aloud"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>

                      {/* Translation */}
                      {globalTranslation && (
                        <p className="text-slate-500 font-bold text-xs md:text-sm pl-0.5 border-l-2 border-indigo-200 mt-0.5 md:mt-1 animate-fadeIn">
                          {line.translation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Worksheet Blanks Filling Mode */}
      {activeTab === 'blanks' && (() => {
        const blanksList = (
          <div className="space-y-1 md:space-y-1.5 text-xs md:text-sm leading-relaxed max-h-[750px] overflow-y-auto custom-scrollbar pr-2">
            {selectedDialogue.lines.map((line, idx) => {
              const hasBlanks = line.blanks && line.blanks.length > 0;

              return (
                <div key={idx} className="bg-white p-2 md:p-2.5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 transition-all hover:shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="inline-block mr-2 px-1.5 py-0.5 rounded bg-indigo-50 font-black text-[#4C51BF] text-[10px] md:text-xs tracking-wide uppercase align-middle">{line.speaker}</span>
                      <p className="inline font-extrabold text-slate-700 text-[16px] md:text-[18px] leading-relaxed align-middle">
                        {hasBlanks ? (
                          <>
                            {line.text.split(/(\b[\w']+\b)/g).map((chunk, cIdx) => {
                              // Is it one of the blanked words?
                              const matchingBlank = line.blanks?.find(b => {
                                const chunkClean = chunk.toLowerCase().replace(/[‘’.?,!‘']/g, '');
                                const partsOfWord = b.word.toLowerCase().replace(/[‘’.?,!‘']/g, '').split(' ');
                                return partsOfWord.includes(chunkClean);
                              });

                              if (matchingBlank) {
                                const isCorrect = blankValidation[matchingBlank.index] === 'correct';
                                return (
                                  <span 
                                    key={cIdx} 
                                    className={`inline-block border-b-2 border-dashed px-1 select-all font-black mx-0.5 transition-colors ${
                                      isCorrect 
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                                        : 'bg-rose-50 border-rose-100 text-rose-600'
                                    }`}
                                  >
                                    [{matchingBlank.index}] {isCorrect ? matchingBlank.word : '______'}
                                  </span>
                                );
                              }
                              return chunk;
                            })}
                          </>
                        ) : (
                          line.text
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleSpeak(line.text)}
                      className="p-1 rounded-md bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 flex items-center justify-center"
                      title="이 문장 듣기"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  {/* Integrated inputs for blanks under the sentence */}
                  {hasBlanks && (
                    <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100 space-y-1.5">
                      {line.blanks?.map((blank) => {
                        const state = blankValidation[blank.index];
                        const viewHint = blankShownHints[blank.index];
                        return (
                          <div key={blank.index} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-lg border border-slate-100">
                            {/* Label indicating the blank index */}
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="bg-[#4C51BF] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black leading-none">
                                {blank.index}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500">번 빈칸:</span>
                            </div>

                            {/* Input field and actions */}
                            <div className="flex-1 flex gap-1.5">
                              <input 
                                type="text" 
                                value={blankAnswers[blank.index] || ''}
                                onChange={(e) => setBlankAnswers(prev => ({ ...prev, [blank.index]: e.target.value }))}
                                placeholder={viewHint ? `힌트: ${blank.hint}` : `빈칸 완성 단어 입력...`}
                                className={`flex-1 border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-black rounded-md focus:outline-none focus:ring-2 transition-all ${
                                  state === 'correct' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 focus:ring-emerald-200' 
                                    : state === 'incorrect' 
                                    ? 'bg-rose-50 border-rose-200 text-slate-800 focus:ring-rose-200' 
                                    : 'focus:ring-indigo-150'
                                }`}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleBlankCheck(blank.index, blankAnswers[blank.index] || '', blank.word);
                                  }
                                }}
                              />
                              {/* Show Hint btn */}
                              <button 
                                onClick={() => showBlankHint(blank.index)}
                                className="px-2 py-1.5 text-[9px] bg-slate-100 text-slate-600 font-extrabold rounded-md hover:bg-slate-200 transition-colors shrink-0"
                                title="초성 힌트 보기"
                              >
                                힌트 {viewHint ? "✓" : ""}
                              </button>
                              <button 
                                onClick={() => handleBlankCheck(blank.index, blankAnswers[blank.index] || '', blank.word)}
                                className={`px-2 py-1.5 font-bold text-[11px] text-white rounded-md transition-all active:scale-95 shrink-0 ${
                                  state === 'correct' 
                                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                {state === 'correct' ? "완료" : "확인"}
                              </button>
                            </div>

                            {/* Feedback */}
                            <div className="shrink-0 flex items-center min-w-[80px] justify-end">
                              {state === 'correct' && (
                                <span className="text-emerald-600 font-black text-xs flex items-center gap-1 animate-fadeIn">
                                  <CheckCircle size={13} /> 정답!
                                </span>
                              )}
                              {state === 'incorrect' && (
                                <span className="text-rose-500 font-black text-xs flex items-center gap-1 animate-fadeIn">
                                  <AlertCircle size={13} /> 오답
                                </span>
                              )}
                              {viewHint && state !== 'correct' && (
                                <span className="text-indigo-500 font-bold text-[9px] ml-1 bg-indigo-50 px-1.5 py-0.5 rounded">
                                  초성: {blank.hint}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

        return (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-md border border-slate-100 space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">✍️ Worksheet Blanks Match-up</h2>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  1페이지의 학습지 빈칸 1번~18번을 직접 받아쓰며 암기해보세요!
                </p>
              </div>
              <button 
                onClick={resetBlanks}
                className="p-3 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {selectedDialogueId === 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Chart (Sticky on desktop) */}
                <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-4 bg-white z-10 w-full">
                  {renderTeenStressChart(true)}
                </div>
                
                {/* Right Column Blanks List */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                  <h3 className="font-extrabold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-500" />
                    대본 확인 및 실시간 빈칸 완성하기
                  </h3>
                  {blanksList}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="font-extrabold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-500" />
                  대본 확인 및 실시간 빈칸 완성하기
                </h3>
                {blanksList}
              </div>
            )}
          </div>
        );
      })()}

      {/* Comprehension & Dialogue Quizzes */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-md border border-slate-100">
          {!quizFinished ? (() => {
            const quizItemWithFeedback = (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                    {dialogueQuizzes[currentQuizIdx].question}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-[#4C51BF]">
                    {dialogueQuizzes[currentQuizIdx].questionKo}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-4">
                  {dialogueQuizzes[currentQuizIdx].options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrectOption = idx === dialogueQuizzes[currentQuizIdx].answerIndex;
                    
                    let bgBorderClass = "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50";
                    if (quizSubmitted) {
                      if (isCorrectOption) {
                        bgBorderClass = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100 text-emerald-800";
                      } else if (isSelected) {
                        bgBorderClass = "bg-rose-50 border-rose-300 text-rose-700";
                      } else {
                        bgBorderClass = "bg-white border-slate-100 opacity-60";
                      }
                    } else if (isSelected) {
                      bgBorderClass = "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 text-indigo-900";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={quizSubmitted}
                        className={`p-5 rounded-2xl border text-left font-bold transition-all flex items-center gap-4 ${bgBorderClass}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm md:text-base">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Banner */}
                {quizSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-5 rounded-2xl text-center font-black text-sm flex items-center justify-center gap-2 border ${
                      selectedQuizOption === dialogueQuizzes[currentQuizIdx].answerIndex
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {selectedQuizOption === dialogueQuizzes[currentQuizIdx].answerIndex ? (
                      <>
                        <CheckCircle size={18} className="text-emerald-500 animate-pulse shrink-0" />
                        <span>정답입니다! 🎉 잠시 후 자동으로 다음으로 넘어갑니다.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="text-rose-500 animate-pulse shrink-0" />
                        <span>아쉽습니다, 오답입니다! 😢 해설 학습 후 자동으로 다음으로 이동합니다.</span>
                      </>
                    )}
                  </motion.div>
                )}

                {/* In-depth Explanation if submitted */}
                {quizSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className={`p-6 rounded-3xl border ${selectedQuizOption === dialogueQuizzes[currentQuizIdx].answerIndex ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-rose-50/30 border-rose-200 text-slate-700'} space-y-2`}
                  >
                    <h4 className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1">
                      <HelpCircle size={14} className="text-indigo-500" />
                      문항 풀이 해설 Explanation
                    </h4>
                    <p className="text-xs leading-relaxed font-bold">
                      {dialogueQuizzes[currentQuizIdx].explanation}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-bold border-t border-slate-200/50 pt-2">
                      💡 한글 해설: {dialogueQuizzes[currentQuizIdx].explanationKo}
                    </p>
                  </motion.div>
                )}
              </div>
            );

            return (
              <div className="space-y-8">
                {/* Header progress info */}
                <div className="flex justify-between items-center text-sm font-black text-slate-400">
                  <span className="bg-indigo-50 text-[#4C51BF] px-3.5 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                    Dialogue {selectedDialogueId} Comprehension
                  </span>
                  <span>Question {currentQuizIdx + 1} of {dialogueQuizzes.length}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQuizIdx + 1) / dialogueQuizzes.length) * 100}%` }}
                  ></div>
                </div>

                {selectedDialogueId === 1 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Left Column: Chart (Sticky on desktop) */}
                    <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-4 bg-white z-10 w-full">
                      {renderTeenStressChart(true)}
                    </div>
                    {/* Right Column: Quiz Content */}
                    <div className="lg:col-span-12 xl:col-span-7">
                      {quizItemWithFeedback}
                    </div>
                  </div>
                ) : (
                  quizItemWithFeedback
                )}

                {/* Action area */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold">
                    {quizSubmitted 
                      ? "자동 다음 단계 진행 중... 바로 가려면 오른쪽 버튼을 누르세요." 
                      : "보기를 클릭하면 즉시 정답을 판정하고 자동으로 넘어갑니다."}
                  </p>
                  {quizSubmitted && (
                    <button
                      onClick={handleQuizNext}
                      className="p-4 bg-slate-800 hover:bg-slate-900 font-black text-white px-8 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2 animate-fadeIn"
                    >
                      다음 문제 Next <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })() : (
            // Finished Results Card
            <div className="text-center py-12 max-w-lg mx-auto space-y-8">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-500 animate-bounce">
                <Trophy size={48} fill="currentColor" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800">Dialogue {selectedDialogueId} Quiz Clear!</h2>
                <p className="text-sm font-bold text-slate-400">교과서 대본 완벽 정복을 축하합니다!</p>
              </div>

              {/* Progress Badge */}
              <div className="bg-slate-50 border border-slate-150 p-6 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SCORE</p>
                    <p className="text-3xl font-black text-[#4C51BF]">{quizScore} / {dialogueQuizzes.length}</p>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP EARNED</p>
                    <p className="text-3xl font-black text-teal-600">+{quizScore * 10} XP</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={restartQuiz}
                  className="flex-1 p-4 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  다시 풀기 Retry
                </button>
                <button
                  onClick={() => { setActiveTab('study'); restartQuiz(); }}
                  className="flex-1 p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-indigo-100"
                >
                  대본 학습으로 Go back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
