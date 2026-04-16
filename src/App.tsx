/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scissors, Skull, Ghost, Eye, Heart, Zap, Cross, ArrowRight, Music, Volume2, VolumeX, Home } from "lucide-react";

type Stage = "loading" | "collision" | "intro" | "quiz" | "result";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    movie: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "在一切文明的秩序之外，你听到了某种低语。那是？",
    options: [
      { text: "自然界原始而残酷的嘲笑", movie: "Antichrist" },
      { text: "来自深空、充满宿命感的寂静", movie: "Melancholia" },
      { text: "一种撕裂羞耻感的自由喘息", movie: "Nymphomaniac" },
      { text: "废墟中回荡的完美建筑回声", movie: "TheHouseThatJackBuilt" },
    ],
  },
  {
    id: 2,
    text: "“正常人”的群落对你而言是？",
    options: [
      { text: "一群在画好的线条里跳舞的狗", movie: "Dogville" },
      { text: "一种需要被温柔伪装掩盖的病毒", movie: "Epidemic" },
      { text: "因为缺乏极致痛苦而显得平庸的谎言", movie: "TheIdiots" },
      { text: "即将被蓝色阴影吞噬的蝼蚁", movie: "Melancholia" },
    ],
  },
  {
    id: 3,
    text: "你如何定义“极致的美”？",
    options: [
      { text: "毁灭那一瞬间产生的绝对辉煌", movie: "Melancholia" },
      { text: "血迹与几何线条构成的视觉对称", movie: "TheHouseThatJackBuilt" },
      { text: "在屈辱与泥泞中绽放的圣洁神迹", movie: "BreakingTheWaves" },
      { text: "腐烂森林中那一抹无法直视的深红", movie: "Antichrist" },
    ],
  },
  {
    id: 4,
    text: "关于“疯癫”，你的感知是？",
    options: [
      { text: "它是对乏味现实最诚实的反叛", movie: "TheIdiots" },
      { text: "它是寻找真相时必经的梦境迷宫", movie: "TheElementOfCrime" },
      { text: "它是当世界末日来临时唯一的解药", movie: "Melancholia" },
      { text: "它是一种隐藏在文明皮肤下的原始本能", movie: "Antichrist" },
    ],
  },
  {
    id: 5,
    text: "面对“生命”的诞生，你感到的第一个词是？",
    options: [
      { text: "混沌", movie: "Antichrist" },
      { text: "枷锁", movie: "DancerInTheDark" },
      { text: "嘲弄", movie: "TheHouseThatJackBuilt" },
      { text: "徒劳", movie: "Melancholia" },
    ],
  },
  {
    id: 6,
    text: "如果秩序与毁灭之间仅隔一线，你倾向于？",
    options: [
      { text: "让绝对的力量带来残酷而完美的统一", movie: "TheHouseThatJackBuilt" },
      { text: "在失控的轨道上静候终结的碰撞", movie: "Melancholia" },
      { text: "亲手摧毁那层虚伪的社会皮肤", movie: "Dogville" },
      { text: "让感官的洪流冲垮一切边界", movie: "Nymphomaniac" },
    ],
  },
  {
    id: 7,
    text: "那种让你感到“神圣”的瞬间，通常伴随着？",
    options: [
      { text: "难以忍受的一连串重击", movie: "BreakingTheWaves" },
      { text: "想象中一段悠扬而悲伤的旋律", movie: "DancerInTheDark" },
      { text: "亲手将某些事物推向地狱的快感", movie: "TheHouseThatJackBuilt" },
      { text: "当太阳不再升起的那一刻", movie: "Melancholia" },
    ],
  },
  {
    id: 8,
    text: "你眼中的“丑陋”其实是？",
    options: [
      { text: "没有勇气的平庸和伪善", movie: "TheIdiots" },
      { text: "生命由于过度繁殖而产生的腐臭", movie: "Antichrist" },
      { text: "那些试图解释却无法触达的沉默", movie: "TheElementOfCrime" },
      { text: "不够优雅的杀戮", movie: "TheHouseThatJackBuilt" },
    ],
  },
  {
    id: 9,
    text: "关于“虔诚”与“神迹”，你内心深处的秘密确信是？",
    options: [
      { text: "它只在最极端的、自我毁灭的顺从里显现", movie: "BreakingTheWaves" },
      { text: "那不过是恐惧给虚无穿上的华丽外衣", movie: "Melancholia" },
      { text: "所有的神迹都是撒旦在森林里的恶作剧", movie: "Antichrist" },
      { text: "一种可以被重新解构和叙述的荒诞剧本", movie: "Dogville" },
    ],
  },
  {
    id: 10,
    text: "你对“纳粹美学”的看法是？",
    options: [
      { text: "一种极端、冷酷但又令人颤栗的秩序美", movie: "TheHouseThatJackBuilt" },
      { text: "权力在崩塌前那股最后的、诱人的腐败气息", movie: "Europa" },
      { text: "宏大叙事背后那张被碾碎的平庸面孔", movie: "Dogville" },
      { text: "一种只能在毁灭中才能达到的和谐", movie: "Melancholia" },
    ],
  },
  {
    id: 11,
    text: "那把悬在你头顶的“剪刀”，最可能剪断的是？",
    options: [
      { text: "连接母性与混乱的最后一根线", movie: "Antichrist" },
      { text: "对世界依然存有的最后一丝怜悯", movie: "Dogville" },
      { text: "那种毫无节制的、饥渴的渴望", movie: "Nymphomaniac" },
      { text: "虚构出的那片充满光亮的乐土", movie: "DancerInTheDark" },
    ],
  },
  {
    id: 12,
    text: "你在暴风雪中独自前行，是因为？",
    options: [
      { text: "你正在追逐一个永恒的犯罪痕迹", movie: "TheElementOfCrime" },
      { text: "你正在被一段无法修正的历史所诅咒", movie: "Europa" },
      { text: "你只是想看这个世界如何被洁白掩埋", movie: "Melancholia" },
      { text: "你本身就是风暴的一部分", movie: "Antichrist" },
    ],
  },
  {
    id: 13,
    text: "当别人对你“施舍”善意时，你感到的更多是？",
    options: [
      { text: "一种被居高临下注视的窒息感", movie: "Dogville" },
      { text: "可以被利用来完成某种仪式的借口", movie: "BreakingTheWaves" },
      { text: "由于缺乏力量而产生的厌恶", movie: "TheHouseThatJackBuilt" },
      { text: "毫无波澜的迟钝", movie: "Melancholia" },
    ],
  },
  {
    id: 14,
    text: "所谓“自由”，在你的潜意识里与哪个动作有关？",
    options: [
      { text: "模仿一个疯子的尖叫", movie: "TheIdiots" },
      { text: "从铁轨尽头的深渊纵身一跃", movie: "Europa" },
      { text: "将自己的感官彻底献祭给未知", movie: "Nymphomaniac" },
      { text: "在一场毁灭性的撞击中彻底消散", movie: "Melancholia" },
    ],
  },
  {
    id: 15,
    text: "如果人性是一座“房子”，你认为地基是由什么构成的？",
    options: [
      { text: "沉默的受害者们重叠在一起的躯体", movie: "TheHouseThatJackBuilt" },
      { text: "在二维平面里苟且偷生的卑微线条", movie: "Dogville" },
      { text: "某种不可被名状的、原始的排泄物", movie: "Antichrist" },
      { text: "一段注定会因为感染而崩塌的基因", movie: "Epidemic" },
    ],
  },
  {
    id: 16,
    text: "当你的指尖触碰温热的感官，那一刻你的灵魂由于？",
    options: [
      { text: "那种无法填补的绝望饥渴而战栗", movie: "Nymphomaniac" },
      { text: "对原始、肮脏本能的臣服而感到安宁", movie: "Antichrist" },
      { text: "试图在腐朽中提取永恒美感的贪婪", movie: "TheHouseThatJackBuilt" },
      { text: "意识到这一切终将随星辰一同熄灭", movie: "Melancholia" },
    ],
  },
  {
    id: 17,
    text: "在你看来，那种超越世俗的“归宿”更像是？",
    options: [
      { text: "在众人的唾弃中，灵魂独自飞向圣洁的钟声", movie: "BreakingTheWaves" },
      { text: "在黑暗的绞刑架下，歌唱着那些未完的旋律", movie: "DancerInTheDark" },
      { text: "在冷风中，看着自己精心搭建的房子轰然倒塌", movie: "TheHouseThatJackBuilt" },
      { text: "在清醒的静默里，迎接那颗蓝色星球的亲吻", movie: "Melancholia" },
    ],
  },
  {
    id: 18,
    text: "那种名为“欲望”的狂潮，在你生命中的角色是？",
    options: [
      { text: "一种让信仰显现其真正力量的磨刀石", movie: "BreakingTheWaves" },
      { text: "一个关于自我解离和寻求真实存在的迷宫", movie: "Nymphomaniac" },
      { text: "自然界撒向人间、用来掩盖虚无的某种病菌", movie: "Antichrist" },
      { text: "让这种平庸的生活显得不那么滑稽的佐料", movie: "Dogville" },
    ],
  },
  {
    id: 19,
    text: "如果你能站在“地狱”的入口看一眼，你期待看到什么？",
    options: [
      { text: "一个充满艺术设计感的、华丽的屠宰室", movie: "TheHouseThatJackBuilt" },
      { text: "那个抛弃了上帝而选择自救的人正在跳舞", movie: "BreakingTheWaves" },
      { text: "其实门后什么都没有，只有纯粹的黑", movie: "Melancholia" },
      { text: "那就是我们现在生活的世界", movie: "Dogville" },
    ],
  },
  {
    id: 20,
    text: "对你而言，电影的胶片意味着？",
    options: [
      { text: "一种用来囚禁真实痛苦的透明棺材", movie: "Dogville" },
      { text: "可以被随意剪切、直到露出人性骨骼的素材", movie: "TheHouseThatJackBuilt" },
      { text: "在黑暗中流动的、充满诗意的谎言", movie: "DancerInTheDark" },
      { text: "一种会给观众大脑带来致命病毒的宿主", movie: "Epidemic" },
    ],
  },
];

const RESULTS: Record<string, { title: string; desc: string; quote: string }> = {
  Antichrist: {
    title: "《反基督者》 (Antichrist)",
    desc: "你的灵魂中栖息着某种原始的野蛮。在痛苦与本能的泥沼中，你选择了最直接的碰撞。自然对你而言并非宁静的避难所，而是撒旦的教堂，而你是其中最狂热且痛苦的信徒。",
    quote: "“混乱统治一切。” (Chaos reigns.)",
  },
  Melancholia: {
    title: "《忧郁症》 (Melancholia)",
    desc: "你拥有一种冷彻骨髓的清醒。当所有人都还在为琐碎的生存挣扎时，你已经从那些蓝色的光辉中看到了毁灭的终极美感。你并不畏惧世界的终结，因为你本身就是虚无最忠实的代言人。",
    quote: "“地球是邪恶的。我们无需为它哀悼。”",
  },
  Nymphomaniac: {
    title: "《女性瘾者》 (Nymphomaniac)",
    desc: "你是孤独而诚实的探寻者。你试图通过肉体的极致消耗来触碰灵魂的边缘，却发现自己永远被困在渴求与回忆的迷宫中。你的诚实是一把解剖刀，精准地切割开伪善，却也让自己鲜血淋漓。",
    quote: "“也许我能找到一些能填补我内心空白的东西。”",
  },
  TheHouseThatJackBuilt: {
    title: "《此房是我造》 (The House That Jack Built)",
    desc: "你是一个优雅且极端的毁灭者。你将苦难与破坏视为一种至高无上的艺术创作。在你的逻辑里，道德不过是平庸者的自欺欺人，而艺术是超越善恶、通往永恒的唯一途径，哪怕它是用尸骸筑成的。",
    quote: "“这就是我要建的房子。”",
  },
  Dogville: {
    title: "《狗镇》 (Dogville)",
    desc: "你对人性的透视近乎残忍。你曾尝试宽恕，但最终明白宽恕本身就是一种危险的傲慢。当人性卑劣的面具被彻底撕下，你会亲手化作审判的烈火，将所有虚伪的布景化为灰烬。",
    quote: "“有些人确实不配活在这个世界上。”",
  },
  DancerInTheDark: {
    title: "《黑暗中的舞者》 (Dancer in the Dark)",
    desc: "在极致的灰暗中，你依然试图保有一份脆弱而圣洁的幻想。你用想象中的旋律抵御现实沉重的打击，直至最后一声鼓点消失在空旷的绞刑台上。你的悲剧在于，你那近乎自毁的善良在这个崩塌的世界里无处安放。",
    quote: "“在音乐中，什么坏事都不会发生。”",
  },
  BreakingTheWaves: {
    title: "《破浪》 (Breaking the Waves)",
    desc: "你拥有最极端的牺牲精神和纯洁的疯狂。你的爱超越了肉体与智识，直接与某种神圣（或魔鬼）的意志对话。你的苦行不仅是为了救赎他人，更是为了在这个冷漠的世界里证明奇迹的可能。",
    quote: "“我必须做他要求我的事，因为我爱他。”",
  },
  Europa: {
    title: "《欧洲特快车》 (Europa)",
    desc: "你被困在历史的阴影和无法逃离的循环中。你试图在失控的时代轨道上保持中立，却发现自己不过是这列名为“宿命”的快车上无法下车的乘客。你的一生都在被那些看不见的影子和规则所追逐。",
    quote: "“你现在正站在欧洲的铁轨上。”",
  },
  TheIdiots: {
    title: "《白痴》 (The Idiots)",
    desc: "你对体制和文明社会有着天然的抵触与嘲弄。你相信只有回归到某种原始的、近乎自毁的“愚蠢”状态，才能获得真正的自由和对现实最激进的反叛。你在模仿疯狂的过程中寻找真实的自我，却也可能在其中彻底迷失。",
    quote: "“寻找你内在的白痴。”",
  },
  TheElementOfCrime: {
    title: "《犯罪元素》 (The Element of Crime)",
    desc: "你迷失在黄褐色的梦境和腐烂的逻辑中。你试图通过系统化的调查来寻找真相，却发现自己正被所调查的对象慢慢同化。你的世界充满了潮湿、衰败和某种无法言喻的、令人迷醉的病态感。",
    quote: "“只要跟着水路走，一切都会明朗。”",
  },
  Epidemic: {
    title: "《瘟疫》 (Epidemic)",
    desc: "你是一个冷静的预言家，也是灾难的帮凶。你在对恐怖的构思中逐渐让其变为现实。你相信在这个充满病毒与盲目的世界里，灾难不是外来的，而是通过我们的想象力和某种致命的重复性自我实现的。",
    quote: "“它正在发生，而且无法停止。”",
  },
};

export default function App() {
  const [stage, setStage] = useState<Stage>("loading");
  const [countdown, setCountdown] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Loading Logic with Countdown
  useEffect(() => {
    if (stage === "loading") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => setStage("collision"), 800);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  // Collision Stage Timer
  useEffect(() => {
    if (stage === "collision") {
      const timer = setTimeout(() => {
        setStage("intro");
      }, 8500); // Slower duration for cinematic effect
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleAnswer = (movie: string) => {
    setScores((prev) => ({
      ...prev,
      [movie]: (prev[movie] || 0) + 1,
    }));

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const finalScores = { ...scores, [movie]: (scores[movie] || 0) + 1 };
      const winner = Object.entries(finalScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      setResult(winner);
      setStage("result");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      <audio 
        src="https://www.chosic.com/wp-content/uploads/2021/07/The-Second-Waltz-Shostakovich.mp3" 
        autoPlay={!isMuted} 
        loop 
        muted={isMuted}
      />
      
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-8 right-8 z-50 text-white/30 hover:text-white transition-colors p-2"
        title={isMuted ? "开启音效" : "静音"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="forest-bg" />
      <div className="mist-layer" />
      <div className="overlay-text">LARS VON TRIER PSYCHOLOGICAL EVALUATION</div>
      <div className="noise" />
      <div className="scanline" />

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md flex flex-col items-center gap-12 relative z-10"
          >
            <div className="text-center space-y-6">
              <motion.div 
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-serif italic text-8xl text-accent-red"
              >
                {countdown}
              </motion.div>
              <p className="font-mono text-xs opacity-50 uppercase tracking-[0.4em] text-text-dim">
                THE JUDGMENT IS APPROACHING...
              </p>
            </div>
            
            <div className="w-full h-px bg-white/5 relative">
              <motion.div 
                className="absolute top-0 right-0 h-full bg-accent-red shadow-[0_0_10px_rgba(139,0,0,0.4)]"
                initial={{ width: "100%" }}
                animate={{ width: `${(countdown / 5) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

        {stage === "collision" && (
          <motion.div
            key="collision"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Cinematic Background: Stars & Faint Nebulae */}
            <div className="absolute inset-0 z-0">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 'px',
                    height: Math.random() * 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.7
                  }}
                  animate={{
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            {/* Earth (The victim) */}
            <motion.div 
              className="w-24 h-24 rounded-full bg-white relative z-10 overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              {/* Fake Atmosphere */}
              <div className="absolute inset-0 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),inset_10px_10px_20px_rgba(30,58,138,0.2)]" />
              <motion.div 
                className="absolute inset-0 bg-sky-200/10 blur-sm"
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Melancholia (The Devourer) */}
            <motion.div 
              className="absolute w-[1200px] h-[1200px] rounded-full z-20"
              style={{
                background: 'radial-gradient(circle at 40% 40%, #1e3a8a 0%, #0c1a40 40%, rgba(0,0,0,0.8) 70%)',
                boxShadow: 'inset 0 0 150px rgba(59,130,246,0.3)',
                border: '1px solid rgba(147,197,253,0.1)'
              }}
              initial={{ x: "120%", y: "100%", scale: 0.2, opacity: 0 }}
              animate={{ 
                x: "-10%", 
                y: "-10%", 
                scale: 1, 
                opacity: 1 
              }}
              transition={{ duration: 6.5, ease: [0.32, 0, 0.67, 0] }}
            />

            {/* Impact Glow / Flare */}
            <motion.div 
              className="absolute inset-0 bg-white z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0, 0.4, 1, 1],
                backgroundColor: ["#fff", "#fff", "#fff", "#fff", "#fff"]
              }}
              transition={{ 
                duration: 8.5, 
                times: [0, 0.6, 0.7, 0.8, 1], // Impact at ~6.5s (0.76 of 8.5s)
                ease: "linear"
              }}
            />
          </motion.div>
        )}

        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-12 relative z-10 text-center"
          >
            <div className="space-y-4">
              <motion.h1 
                className="font-serif font-light text-4xl md:text-6xl text-white tracking-[12px] uppercase"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                Love, Death <span className="text-accent-red">&</span> The Movie Satan
              </motion.h1>
              <p className="font-sans text-xs tracking-[8px] uppercase text-accent-red mt-4">
                测一测：你是拉斯·冯·提尔的哪部电影？
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setStage("quiz");
                setIsMuted(false); // Enable music on interaction
              }}
              className="cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-accent-red/10 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />
              <Scissors size={80} strokeWidth={0.5} className="text-white group-hover:text-accent-red transition-colors duration-500 transform -rotate-45" />
              <p className="mt-8 font-mono text-[9px] tracking-[0.4em] uppercase opacity-30 group-hover:opacity-100 transition-all">
                剪断现实，沉入深渊
              </p>
            </motion.div>
            
            <p className="absolute bottom-10 font-serif italic text-[13px] text-text-dim tracking-[2px]">
              "Chaos Reigns."
            </p>
          </motion.div>
        )}

        {stage === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-white/5 p-8 md:p-12 relative z-10 rounded-sm"
          >
            <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-4">
              <span className="font-serif italic text-accent-red text-4xl">0{QUESTIONS[currentQuestion].id}</span>
              <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.4em]">
                {currentQuestion + 1} / {QUESTIONS.length}
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-white/90 mb-12 leading-[1.6]">
              {QUESTIONS[currentQuestion].text}
            </h3>

            <div className="space-y-4">
              {QUESTIONS[currentQuestion].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 8 }}
                  onClick={() => handleAnswer(option.movie)}
                  className="w-full text-left p-5 border border-white/5 hover:border-accent-red/30 hover:bg-accent-red/5 transition-all group flex items-center justify-between"
                >
                  <span className="text-white/50 group-hover:text-white/90 transition-colors text-sm md:text-base">{option.text}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-accent-red" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl flex flex-col items-center text-center gap-12 relative z-10"
          >
            <div className="space-y-6">
              <span className="font-mono text-[9px] text-accent-red tracking-[0.5em] uppercase">测算结果 / THE RESULT</span>
              <h1 className="font-serif italic text-4xl md:text-6xl text-white leading-tight">
                {RESULTS[result].title}
              </h1>
            </div>

            <div className="py-12 border-y border-white/5 relative bg-white/[0.02] px-8">
              <p className="text-white/60 leading-relaxed text-lg font-serif">
                {RESULTS[result].desc}
              </p>
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="font-serif italic text-accent-red text-2xl tracking-tight">
                  {RESULTS[result].quote}
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setStage("intro");
                setCurrentQuestion(0);
                setScores({});
                setResult(null);
              }}
              className="font-mono text-[9px] tracking-[0.5em] uppercase border border-white/10 px-12 py-4 hover:border-white hover:bg-white hover:text-black transition-all"
            >
              重新开始 (RESTART)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-12 left-12 hidden lg:block z-20">
        <p className="font-mono text-[8px] opacity-20 uppercase tracking-[0.6em] origin-left -rotate-90 translate-y-full">
          Psychological Evaluation Pattern v2.0
        </p>
      </div>
      
      <div className="fixed bottom-12 right-12 flex items-center gap-8 opacity-20 z-20">
        {/* Whip Icon (Nymphomaniac/Antichrist reference) */}
        <div className="group cursor-help" title="Desire/Pain">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M4 20c4-4 8-12 12-12s4 4 4 4-4 4-4 4" />
            <path d="M16 8c-2 0-3 1-3 1" />
          </svg>
        </div>
        
        {/* The Brackets (Nymphomaniac reference) */}
        <div className="font-serif text-2xl tracking-[-0.2em] text-white select-none cursor-help" title="The Void">
          ( )
        </div>

        {/* The House (The House That Jack Built reference) */}
        <div className="group cursor-help" title="The Built House">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M3 21h18" />
            <path d="M5 21V10l7-7 7 7v11" />
            <path d="M9 21V12h6v9" />
            <path d="M12 3v4" />
            <path d="M7 14h2" />
            <path d="M15 14h2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

