'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AssessmentResult } from '@/types';

export default function History() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('assessments');
    if (data) {
      const parsed = JSON.parse(data);
      setAssessments(parsed.sort((a: AssessmentResult, b: AssessmentResult) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  }, []);

  const handleDelete = (assessmentId: string) => {
    if (confirm('この結果を削除してもよろしいですか？')) {
      const filtered = assessments.filter(a => a.id !== assessmentId);
      localStorage.setItem('assessments', JSON.stringify(filtered));
      setAssessments(filtered);
    }
  };

  if (assessments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">過去の結果</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">まだ分析結果がありません</h2>
            <p className="text-gray-600 mb-8">
              自己分析を始めて、あなたの強みを見つけましょう！
            </p>
            <Link 
              href="/assessment"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full transition-colors"
            >
              分析を始める
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">過去の結果</h1>
          <p className="text-center text-gray-600">
            これまでに{assessments.length}回の分析を行いました
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {assessments.map((assessment, index) => (
            <div key={assessment.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {new Date(assessment.date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <p className="text-gray-600 text-sm">#{index + 1}回目の分析</p>
                </div>
                <button
                  onClick={() => handleDelete(assessment.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  削除
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">強み:</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.strengths.slice(0, 3).map((strength, idx) => (
                    <span key={idx} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                      {strength.title}
                    </span>
                  ))}
                  {assessment.strengths.length > 3 && (
                    <span className="text-gray-500 text-sm">
                      +{assessment.strengths.length - 3}個
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  href={`/result/${assessment.id}`}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 text-center rounded-lg transition-colors"
                >
                  詳細を見る
                </Link>
                
                {index < assessments.length - 1 && (
                  <Link 
                    href={`/comparison?current=${assessment.id}&previous=${assessments[index + 1].id}`}
                    className="flex-1 border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold py-2 text-center rounded-lg transition-colors"
                  >
                    前回と比較
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/assessment"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            新しく分析する
          </Link>
        </div>
      </div>
    </div>
  );
}