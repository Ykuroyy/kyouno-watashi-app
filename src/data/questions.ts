import { Question } from '@/types';

export const questions: Question[] = [
  {
    id: 'q1',
    text: '困っている人を見ると、つい手を差し伸べたくなる',
    category: 'strength',
  },
  {
    id: 'q2',
    text: '一度始めたことは、最後までやり遂げることが多い',
    category: 'strength',
  },
  {
    id: 'q3',
    text: '人の話を聞くのが得意だと思う',
    category: 'strength',
  },
  {
    id: 'q4',
    text: '新しいアイデアを考えるのが楽しい',
    category: 'strength',
  },
  {
    id: 'q5',
    text: 'チームで協力して何かを成し遂げるのが好き',
    category: 'value',
  },
  {
    id: 'q6',
    text: '自分のペースで物事を進めることを大切にしている',
    category: 'value',
  },
  {
    id: 'q7',
    text: '周りの人を笑顔にすることに喜びを感じる',
    category: 'value',
  },
  {
    id: 'q8',
    text: '計画を立てて行動することが多い',
    category: 'personality',
  },
  {
    id: 'q9',
    text: '直感を信じて行動することがある',
    category: 'personality',
  },
  {
    id: 'q10',
    text: '細かいところまで気を配ることができる',
    category: 'personality',
  },
  {
    id: 'q11',
    text: '大きな目標に向かって努力することが好き',
    category: 'strength',
  },
  {
    id: 'q12',
    text: '人と人との調和を大切にしている',
    category: 'value',
  },
  {
    id: 'q13',
    text: '自分の感情を素直に表現できる',
    category: 'personality',
  },
  {
    id: 'q14',
    text: '物事を論理的に考えるのが得意',
    category: 'strength',
  },
  {
    id: 'q15',
    text: '誰かの成長を支援することに喜びを感じる',
    category: 'value',
  },
];

export const analyzeResults = (answers: {questionId: string; value: number}[]) => {
  const strengths: any[] = [];
  const values: string[] = [];
  
  const scoreMap = new Map<string, number>();
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    if (answer.value >= 4) {
      switch (question.id) {
        case 'q1':
        case 'q3':
          scoreMap.set('人に安心感を与える', (scoreMap.get('人に安心感を与える') || 0) + answer.value);
          break;
        case 'q2':
        case 'q11':
          scoreMap.set('コツコツ続ける力', (scoreMap.get('コツコツ続ける力') || 0) + answer.value);
          break;
        case 'q4':
          scoreMap.set('創造力豊か', (scoreMap.get('創造力豊か') || 0) + answer.value);
          break;
        case 'q5':
        case 'q12':
          scoreMap.set('協調性が高い', (scoreMap.get('協調性が高い') || 0) + answer.value);
          break;
        case 'q7':
        case 'q15':
          scoreMap.set('思いやりがある', (scoreMap.get('思いやりがある') || 0) + answer.value);
          break;
        case 'q8':
        case 'q10':
          scoreMap.set('計画性がある', (scoreMap.get('計画性がある') || 0) + answer.value);
          break;
        case 'q14':
          scoreMap.set('論理的思考力', (scoreMap.get('論理的思考力') || 0) + answer.value);
          break;
      }
      
      if (question.category === 'value' && answer.value >= 4) {
        switch (question.id) {
          case 'q5':
            values.push('チームワーク');
            break;
          case 'q6':
            values.push('自立性');
            break;
          case 'q7':
            values.push('他者貢献');
            break;
          case 'q12':
            values.push('調和');
            break;
          case 'q15':
            values.push('成長支援');
            break;
        }
      }
    }
  });
  
  const topStrengths = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, score], index) => ({
      id: `strength_${index}`,
      title,
      description: '',
      score: Math.min(score / 10 * 100, 100),
      category: 'strength',
    }));
  
  return {
    strengths: topStrengths,
    values: [...new Set(values)],
  };
};