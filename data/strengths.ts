
import { StrengthDetail } from '../types';

// 模版设计原则：
// 1. 完整句子，不需要填空。
// 2. 侧重于心理归因和自我确认。
// 3. 供 Step 3 的 Ticker 直接点击上屏。

export const STRENGTHS_DATA: StrengthDetail[] = [
  // --- 智慧 Wisdom (蓝色系) ---
  { 
    id: 'creativity', name: '创造力', category: '智慧',
    templates: {
      internal: "我打破了常规，用新的视角去处理这件事。我喜欢这样充满创造力的自己。",
      external: "这个设计/想法如此精妙，激发了我内心深处的灵感火花。"
    }
  },
  { 
    id: 'curiosity', name: '好奇心', category: '智慧',
    templates: {
      internal: "我没有止步于已知，而是主动去探索了背后的奥秘。好奇心指引我前行。",
      external: "世界再次向我展示了它的新奇，幸好我保持着一颗开放探索的心。"
    }
  },
  { id: 'judgment', name: '判断力', category: '智慧',
    templates: { internal: "在复杂的情况中，我保持了冷静，通过分析做出了忠于内心的选择。" } 
  },
  { id: 'love_learning', name: '爱学习', category: '智慧',
    templates: { internal: "我又掌握了一项新技能。成长的过程本身就足以让人欣喜。" } 
  },
  { id: 'perspective', name: '洞察力', category: '智慧',
    templates: { internal: "我没有被表象迷惑，而是透过现象看到了本质。" }
  },

  // --- 勇气 Courage (赤金色系) ---
  { 
    id: 'bravery', name: '勇敢', category: '勇气',
    templates: {
      internal: "尽管内心有恐惧，但我依然选择了行动。这是我勇气的证明。",
      external: "我见证了一次勇敢的行为，这股力量也感染并鼓舞了我。"
    }
  },
  { 
    id: 'perseverance', name: '坚持', category: '勇气',
    templates: {
      internal: "过程虽有波折，但我没有轻言放弃。这份坚持本身就是一种胜利。"
    }
  },
  { id: 'honesty', name: '真诚', category: '勇气',
    templates: { internal: "我选择了面对真实的自己，说出了真话。这种坦荡让我感到自由。" }
  },
  { id: 'zest', name: '活力', category: '勇气',
    templates: { internal: "我全身心地投入到了当下的体验中，这种生命力让我感到无比鲜活！" }
  },

  // --- 仁爱 Humanity (粉紫系) ---
  { 
    id: 'love', name: '爱', category: '仁爱',
    templates: {
      internal: "我主动表达了我的关心。爱与被爱，都是生命中最珍贵的时刻。",
      external: "我感受到了被深深地爱着。这份温暖支撑着我前行。"
    }
  },
  { 
    id: 'kindness', name: '善良', category: '仁爱',
    templates: {
      internal: "我伸出了援手。能够帮助他人，让我内心感到充实而温暖。",
      external: "世界温柔地对待了我，这份善意让我相信生活的美好。"
    }
  },
  { id: 'social_intelligence', name: '社交商', category: '仁爱',
    templates: { internal: "我敏锐地感知到了他人的情绪，并给予了恰当的回应。" }
  },

  // --- 公正 Justice (青色系) ---
  { id: 'teamwork', name: '团队协作', category: '公正',
    templates: { internal: "不仅是我个人的努力，更是大家共同的协作成就了这一刻。" }
  },
  { id: 'fairness', name: '公平', category: '公正',
    templates: { internal: "我坚持了原则，公平地对待了每一个人。这让我问心无愧。" }
  },
  { id: 'leadership', name: '领导力', category: '公正',
    templates: { internal: "我承担起了责任，指引大家向着共同的目标迈进。" }
  },

  // --- 节制 Temperance (靛青系) ---
  { id: 'forgiveness', name: '宽容', category: '节制',
    templates: { internal: "我选择了放下怨恨，宽恕了过往。内心重获平静。" }
  },
  { id: 'humility', name: '谦逊', category: '节制',
    templates: { internal: "即使取得了成就，我依然保持谦逊，因为我知道世界之大。" }
  },
  { id: 'prudence', name: '审慎', category: '节制',
    templates: { internal: "我深思熟虑后才采取行动，避免了冲动的后果。" }
  },
  { id: 'self_regulation', name: '自律', category: '节制',
    templates: { internal: "面对诱惑，我成功地控制住了自己。自律给了我真正的自由。" }
  },

  // --- 卓越 Transcendence (紫色系) ---
  { 
    id: 'appreciation', name: '审美', category: '卓越',
    templates: {
      internal: "我特意停下脚步去欣赏这份美。幸好我有一双发现美的眼睛。",
      external: "这景色简直是世界的礼物，让我瞬间忘却了烦恼。"
    }
  },
  { 
    id: 'gratitude', name: '感恩', category: '卓越',
    templates: {
      internal: "我不仅看到了不足，更看到了我所拥有的。对此我心怀感激。",
      external: "我要感谢这一切的发生。是被眷顾的感觉。"
    }
  },
  { id: 'hope', name: '希望', category: '卓越',
    templates: { internal: "虽然现在有困难，但我依然相信未来会更好。希望从未熄灭。" }
  },
  { id: 'humor', name: '幽默', category: '卓越',
    templates: { internal: "我用笑声化解了尴尬与困难。幽默感是我最好的盾牌。" } 
  },
  { 
    id: 'spirituality', name: '灵性', category: '卓越',
    templates: {
      internal: "我感到自己与万物相连，内心充满了宁静与神圣感。",
      external: "这是一种超越日常的体验，让我感受到了生命的宏大。"
    }
  },
];
