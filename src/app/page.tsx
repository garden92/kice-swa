'use client';

import { useState, useMemo } from 'react';
import questionsData from '../data/questions.json';

interface Question {
  id: string;
  number: string;
  module: string;
  subModule: string;
  title: string;
  difficulty?: string;
  points?: number;
  question?: string;
  answer?: string;
  explanation?: string;
  keywords: string[];
  content?: string[];
  references?: string[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const questions = questionsData as Question[];

  const modules = useMemo(() => {
    const moduleSet = new Set(questions.map(q => q.module));
    return ['all', ...Array.from(moduleSet)];
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (selectedModule !== 'all') {
      filtered = filtered.filter(q => q.module === selectedModule);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        (q.question && q.question.toLowerCase().includes(query)) ||
        (q.content && q.content.some(c => c.toLowerCase().includes(query))) ||
        q.keywords.some(k => k.toLowerCase().includes(query)) ||
        q.subModule.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [questions, selectedModule, searchQuery]);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            KICE Software Architect 예상문제
          </h1>
          <p className="mt-2 text-gray-600">
            Software Architect 시험 대비 예상문제 모음
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="문제 검색... (제목, 내용, 키워드)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {modules.map(module => (
                <option key={module} value={module}>
                  {module === 'all' ? '모든 모듈' : module}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredQuestions.length}개의 문제가 검색되었습니다.
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleQuestion(question.id)}
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        문제 #{question.number}
                      </span>
                      {question.difficulty && (
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                          question.difficulty === '상급' ? 'bg-red-100 text-red-800' :
                          question.difficulty === '중급' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      )}
                      {question.points && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {question.points}점
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {question.module}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {question.subModule}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.title}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transform transition-transform ${
                      expandedQuestions.has(question.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {expandedQuestions.has(question.id) && (
                <div className="px-6 pb-6 border-t">
                  {question.question && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-3">문제:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
                          {question.question}
                        </pre>
                      </div>
                    </div>
                  )}

                  {question.answer && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">정답:</h4>
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                        <span className="text-green-800 font-bold text-lg">
                          {question.answer}
                        </span>
                      </div>
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">해설:</h4>
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <p className="text-blue-800 leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {question.content && question.content.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">내용:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {question.content.map((item, idx) => (
                          <li key={idx} className="text-gray-600">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.keywords.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">키워드:</h4>
                      <div className="flex flex-wrap gap-2">
                        {question.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.references && question.references.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">참고자료:</h4>
                      <ul className="space-y-1">
                        {question.references.map((ref, idx) => (
                          <li key={idx}>
                            <a
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {ref}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}