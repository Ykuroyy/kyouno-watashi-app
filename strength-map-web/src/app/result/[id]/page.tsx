'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AssessmentResult } from '@/types';

export default function Result() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('assessments');
    if (data) {
      const assessments = JSON.parse(data);
      const found = assessments.find((a: AssessmentResult) => a.id === params.id);
      if (found) {
        setAssessment(found);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  const handleShare = async () => {
    if (!assessment) return;
    
    const strengthsList = assessment.strengths
      .map(s => `・${s.title}`)
      .join('\n');
    
    const message = `わたしの強みマップの結果\n\n【私の強み】\n${strengthsList}\n\n#わたしの強みマップ #自己分析`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(message);
      alert('結果をクリップボードにコピーしました！');
    }
  };

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">あなたの強みマップ</h1>
          <p className="text-gray-600">
            {new Date(assessment.date).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Strength Map */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💪 あなたの強み</h2>
          
          <div className="space-y-6">
            {assessment.strengths.map((strength, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{strength.title}</span>
                  <span className="text-pink-600 font-bold">{Math.round(strength.score)}%</span>
                </div>
                <div className="bg-pink-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-pink-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💎 大切にしている価値観</h2>
          <div className="flex flex-wrap gap-3">
            {assessment.values.map((value, index) => (
              <span 
                key={index} 
                className="bg-pink-400 text-white px-4 py-2 rounded-full font-semibold"
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ メッセージ</h2>
          <p className="text-gray-700 leading-relaxed">
            今回の分析で見つかったあなたの強みは、あなたらしさの一部です。
            これらの強みを活かして、より充実した毎日を送りましょう！
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleShare}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-colors"
          >
            結果をシェア
          </button>

          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/"
              className="text-center border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ホームに戻る
            </Link>
            
            <Link 
              href="/history"
              className="text-center border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold py-3 rounded-xl transition-colors"
            >
              過去の結果
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}