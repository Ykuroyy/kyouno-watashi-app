'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-pink-300 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">わたしの強みマップ</h1>
        <p className="text-xl opacity-90">5分で見つかる、あなたの魅力</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">あなたの強みを発見</h3>
            <p className="text-gray-600">
              簡単な質問に答えるだけで、あなたの隠れた強みや価値観が見えてきます
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">成長を可視化</h3>
            <p className="text-gray-600">
              過去の結果と比較して、自分の成長や変化を確認できます
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">人生の棚卸し</h3>
            <p className="text-gray-600">
              就活や転職だけでなく、日常の自己理解にも活用できます
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link 
            href="/assessment"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            分析を始める
          </Link>
          
          <div>
            <Link 
              href="/history"
              className="inline-block border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold py-3 px-6 rounded-full transition-all duration-200"
            >
              過去の結果を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}