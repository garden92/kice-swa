'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import questionsData from '../data/all-questions-final-corrected.json';
import questionTableData from '../data/question-table-complete-45.json';

interface Question {
  id: number;
  questionNumber: number;
  section: string;
  module: string;
  title: string;
  difficulty?: string;
  points?: number;
  questionText?: string;
  choices?: string[];
  answer?: string;
  explanation?: string;
  keywords: string[];
}

interface QuestionCategory {
  category: string;
  totalQuestions: number;
  totalPoints: number;
  subcategories: {
    name: string;
    topics: string[];
    references: string[];
    relatedQuestions: string[];
  }[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [pointsRange, setPointsRange] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const questions = questionsData as Question[];
  const questionTable = questionTableData as QuestionCategory[];

  const modules = useMemo(() => {
    const moduleSet = new Set(questions.map(q => q.module));
    return ['all', ...Array.from(moduleSet)];
  }, [questions]);

  const difficulties = useMemo(() => {
    const difficultySet = new Set(questions.map(q => q.difficulty).filter(Boolean));
    return ['all', ...Array.from(difficultySet)];
  }, [questions]);

  const sections = useMemo(() => {
    const sectionSet = new Set(questions.map(q => q.section));
    return ['all', ...Array.from(sectionSet)];
  }, [questions]);

  // 하이라이팅 함수 (메모이제이션)
  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 text-yellow-900">{part}</mark> : part
    );
  }, []);

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    // 모듈 필터
    if (selectedModule !== 'all') {
      filtered = filtered.filter(q => q.module === selectedModule);
    }

    // 난이도 필터
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // 섹션 필터
    if (selectedSection !== 'all') {
      filtered = filtered.filter(q => q.section === selectedSection);
    }

    // 점수 범위 필터
    if (pointsRange !== 'all') {
      const points = parseInt(pointsRange);
      filtered = filtered.filter(q => q.points === points);
    }

    // 텍스트 검색 (디바운싱된 검색어 사용)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        (q.questionText && q.questionText.toLowerCase().includes(query)) ||
        (q.choices && q.choices.some(c => c.toLowerCase().includes(query))) ||
        q.keywords.some(k => k.toLowerCase().includes(query)) ||
        q.section.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query))
      );
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'number':
          return a.questionNumber - b.questionNumber;
        case 'difficulty':
          const diffOrder = { '하급': 1, '중급': 2, '상급': 3 };
          const aDiff = diffOrder[a.difficulty as keyof typeof diffOrder] || 0;
          const bDiff = diffOrder[b.difficulty as keyof typeof diffOrder] || 0;
          return aDiff - bDiff;
        case 'points':
          return (a.points || 0) - (b.points || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [questions, selectedModule, selectedDifficulty, selectedSection, pointsRange, debouncedSearchQuery, sortBy]);

  const toggleQuestion = (id: number) => {
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
        {/* 예상문제 표 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">KICE Software Architect 예상문제 개요</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대모듈</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소모듈</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주요 주제</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">문항수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questionTable.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      {category.subcategories.map((subcategory, subIndex) => (
                        <tr key={`${categoryIndex}-${subIndex}`} className="hover:bg-gray-50">
                          {subIndex === 0 && (
                            <td 
                              rowSpan={category.subcategories.length}
                              className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-50"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold">{category.category}</span>
                                <span className="text-xs text-gray-600 mt-1">
                                  {category.totalQuestions}문항 / {category.totalPoints}점
                                </span>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            {subcategory.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <ul className="list-disc list-inside space-y-1">
                              {subcategory.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="leading-relaxed">{topic}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {subIndex === 0 ? `${category.totalQuestions}문항` : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {subIndex === 0 ? `${category.totalPoints}점` : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 총계 표시 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">총 예상문제</span>
                <div className="flex space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {questionTable.reduce((sum, cat) => sum + cat.totalQuestions, 0)}문항
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {questionTable.reduce((sum, cat) => sum + cat.totalPoints, 0)}점
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 실제 문제 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">실제 추출된 기출문제</h2>
          
          <div className="mb-6 space-y-4">
            {/* 기본 검색 */}
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                placeholder="문제 검색... (제목, 내용, 키워드, 해설)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
              >
                {modules.map(module => (
                  <option key={module} value={module}>
                    {module === 'all' ? '모든 모듈' : module}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                {showAdvanced ? '간단 검색' : '고급 검색'}
              </button>
            </div>

            {/* 고급 검색 필터 */}
            {showAdvanced && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">난이도</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? '모든 난이도' : difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">섹션</label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sections.map(section => (
                        <option key={section} value={section}>
                          {section === 'all' ? '모든 섹션' : section}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">점수</label>
                    <select
                      value={pointsRange}
                      onChange={(e) => setPointsRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">모든 점수</option>
                      <option value="3">3점</option>
                      <option value="4">4점</option>
                      <option value="5">5점</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="number">문제 번호</option>
                      <option value="difficulty">난이도</option>
                      <option value="points">점수</option>
                      <option value="title">제목</option>
                    </select>
                  </div>
                </div>

                {/* 필터 초기화 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedSearchQuery('');
                      setSelectedModule('all');
                      setSelectedDifficulty('all');
                      setSelectedSection('all');
                      setPointsRange('all');
                      setSortBy('number');
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    필터 초기화
                  </button>
                </div>
              </div>
            )}
          
            {/* 검색 결과 및 통계 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-sm text-gray-600">
                {filteredQuestions.length}개의 문제가 검색되었습니다.
                {filteredQuestions.length > 0 && (
                  <span className="ml-2 text-gray-500">
                    (총 {filteredQuestions.reduce((sum, q) => sum + (q.points || 0), 0)}점)
                  </span>
                )}
              </div>
              
              {/* 빠른 통계 */}
              {filteredQuestions.length > 0 && (
                <div className="flex gap-2 text-xs">
                  {['하급', '중급', '상급'].map(diff => {
                    const count = filteredQuestions.filter(q => q.difficulty === diff).length;
                    if (count === 0) return null;
                    return (
                      <span key={diff} className={`px-2 py-1 rounded ${
                        diff === '상급' ? 'bg-red-100 text-red-700' :
                        diff === '중급' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {diff}: {count}개
                      </span>
                    );
                  })}
                </div>
              )}
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
                        문제 #{question.questionNumber}
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
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {question.section}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {highlightText(question.title, debouncedSearchQuery)}
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
                  {question.questionText && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-3">문제:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 font-medium leading-relaxed mb-3">
                          {highlightText(question.questionText, debouncedSearchQuery)}
                        </p>
                        {question.choices && question.choices.length > 0 && (
                          <div className="space-y-2">
                            {question.choices.map((choice, idx) => (
                              <div key={idx} className="pl-2">
                                {highlightText(choice, debouncedSearchQuery)}
                              </div>
                            ))}
                          </div>
                        )}
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
                          {highlightText(question.explanation, debouncedSearchQuery)}
                        </p>
                      </div>
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

                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}