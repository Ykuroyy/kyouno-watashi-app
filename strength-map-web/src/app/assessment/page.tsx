'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions, analyzeResults } from '@/data/questions';

export default function Assessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: string; value: number}[]>([]);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswer = {
      questionId: currentQuestion.id,
      value,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 分析結果を計算
      const results = analyzeResults(updatedAnswers);
      const assessmentId = Date.now().toString();
      
      const assessment = {
        id: assessmentId,
        date: new Date().toISOString(),
        answers: updatedAnswers,
        strengths: results.strengths,
        values: results.values,
      };

      // ローカルストレージに保存
      const existingData = localStorage.getItem('assessments');
      const assessments = existingData ? JSON.parse(existingData) : [];
      assessments.push(assessment);
      localStorage.setItem('assessments', JSON.stringify(assessments));
      
      router.push(`/result/${assessmentId}`);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="bg-pink-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-pink-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-3 text-gray-600">
            {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <p className="text-center text-gray-600 mb-8">どのくらい当てはまりますか？</p>

          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
                  value === 3 ? 'bg-pink-300' : 'bg-pink-400'
                }`}>
                  {value}
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">
                  {value === 1 && '全く\n違う'}
                  {value === 2 && 'あまり\n違う'}
                  {value === 3 && 'どちら\nでもない'}
                  {value === 4 && 'やや\n当てはまる'}
                  {value === 5 && 'とても\n当てはまる'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestionIndex > 0 && (
          <div className="text-center">
            <button
              onClick={handleBack}
              className="text-pink-500 underline hover:text-pink-600"
            >
              前の質問に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}