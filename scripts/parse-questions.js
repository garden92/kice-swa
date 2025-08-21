const fs = require('fs');
const path = require('path');

// Read the extracted text
const textPath = path.join(__dirname, '../src/data/exam-questions.txt');
const text = fs.readFileSync(textPath, 'utf-8');

// Parse the content into structured data
const lines = text.split('\n').filter(line => line.trim());

const questions = [];
let currentQuestion = null;
let currentModule = '';
let currentSubModule = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Detect module headers
  if (line.includes('Software Architect') && (line.includes('핵심') || line.includes('설계/구축'))) {
    if (line.includes('핵심')) {
      currentModule = 'Software Architecture 핵심';
    } else if (line.includes('설계/구축')) {
      currentModule = 'Software Architecture 설계/구축';
    }
  }
  
  // Detect sub-modules
  if (line.includes('>') && !line.startsWith('→')) {
    const parts = line.split('>');
    if (parts.length >= 2) {
      currentSubModule = parts[parts.length - 1].trim();
    }
  }
  
  // Detect question topics
  if (line.includes('예상문제 #') || line.includes('예상 문제')) {
    const questionNum = line.match(/#(\d+)/)?.[1] || questions.length + 1;
    currentQuestion = {
      id: `q${questionNum}`,
      number: questionNum,
      module: currentModule,
      subModule: currentSubModule,
      title: '',
      content: [],
      references: []
    };
    questions.push(currentQuestion);
  }
  
  // Add content to current question
  if (currentQuestion && !line.includes('예상문제') && !line.includes('KTDS KMS')) {
    if (line.includes('http')) {
      currentQuestion.references.push(line);
    } else if (line.length > 10) {
      currentQuestion.content.push(line);
      if (!currentQuestion.title && line.length > 15) {
        currentQuestion.title = line;
      }
    }
  }
}

// Manual structuring based on PDF content
const structuredQuestions = [
  {
    id: 'q1',
    number: 1,
    module: 'Software Architecture 핵심',
    subModule: '기반 솔루션 분류/정의',
    title: 'I/F 기반의 Data 동기화 문제',
    content: [
      'Data File에 대한 동기화',
      'DB Data 동기화 (EAI, Kafka)',
      'I/F 솔루션 이해'
    ],
    keywords: ['Data 동기화', 'Kafka', 'EAI', 'Interface'],
    references: []
  },
  {
    id: 'q2',
    number: 2,
    module: 'Software Architecture 핵심',
    subModule: '기반 솔루션 주요 기능/장단점',
    title: 'Kafka/Redis 등 Backing 서비스',
    content: [
      'Clustering 및 성능관련된 특징에 대한 이해',
      'Pub/Sub 패턴',
      '비동기에 따른 순차거래 특징',
      '가용성 처리 방식'
    ],
    keywords: ['Kafka', 'Redis', 'Clustering', 'Pub/Sub', '비동기'],
    references: ['https://my-develop-note.tistory.com/266']
  },
  {
    id: 'q3',
    number: 3,
    module: 'Software Architecture 핵심',
    subModule: 'JVM 구조 및 동작 특성',
    title: 'Java GC 개념과 Option 설정',
    content: [
      'Kubernetes에서 설정하는 방법',
      'Java GC 발생시 성능 개선을 위한 Issue 원인 및 대응 방안',
      'JVM의 GC 발생 조건 및 동작 방식',
      'JVM 옵션',
      'JDK 버전별 GC 변화'
    ],
    keywords: ['JVM', 'GC', 'Kubernetes', 'Performance', 'Java'],
    references: []
  },
  {
    id: 'q4',
    number: 4,
    module: 'Software Architecture 설계/구축',
    subModule: 'Framework 적용',
    title: 'Framework의 역할 및 아키텍처 고려 사항',
    content: [
      'WAS 기본 성능 개선: DBCP, TCP Connection Pool, JVM Memory',
      'Frontend, ECMA(Javascript) Spec 이해',
      'Browser 내 객체 Scope, HTMLDom 구조',
      'Reactive Programming(비동기) 개념 이해',
      'Springboot Process/Thread 이해와 Block/NonBlock 개념',
      '비동기 Adaptor 작성'
    ],
    keywords: ['Framework', 'WAS', 'DBCP', 'Reactive', 'Springboot', '비동기'],
    references: []
  },
  {
    id: 'q5',
    number: 5,
    module: 'Software Architecture 설계/구축',
    subModule: '개발 표준 수립 및 가이드',
    title: 'Spring 기반의 공통 로직 처리 방법',
    content: [
      'Log 처리',
      '공통정보 처리',
      'MDC (Mapped Diagnostic Context) 활용',
      '호출 관계에 대한 이해도'
    ],
    keywords: ['Spring', 'Logging', 'MDC', '공통로직'],
    references: ['https://www.baeldung.com/mdc-in-log4j-2-logback']
  }
];

// Save to JSON file
const outputPath = path.join(__dirname, '../src/data/questions.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(structuredQuestions, null, 2));

console.log(`Parsed ${structuredQuestions.length} questions`);
console.log('Questions saved to:', outputPath);