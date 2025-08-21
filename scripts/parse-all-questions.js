const fs = require('fs');
const path = require('path');

// Read the extracted text
const textPath = path.join(__dirname, '../src/data/exam-questions.txt');
const text = fs.readFileSync(textPath, 'utf-8');

// Split text into lines
const lines = text.split('\n');

// Comprehensive question data structure
const allQuestions = [
  // 예상문제 #1 - I/F 기반의 Data 동기화 문제
  {
    id: 'q1-1',
    number: '1-1',
    module: 'Software Architecture 핵심',
    subModule: 'I/F 기반 Data 동기화',
    title: 'I/F 기반의 Data 동기화 문제',
    content: [
      '대내 시스템 간 실시간 데이터 동기화를 위해 EAI를 통한 트랜잭션 처리 방식을 설계 중이다.',
      'Data File에 대한 동기화와 DB Data 동기화(EAI, Kafka) 중 적절한 방식 선택',
      '트랜잭션 처리 시 올바르지 않은 설명 찾기'
    ],
    difficulty: '중급',
    points: 4,
    keywords: ['I/F', 'Data 동기화', 'EAI', 'Kafka', '트랜잭션']
  },
  
  // 예상문제 #1 - WAS 성능 개선 - DBCP 설정
  {
    id: 'q1-2',
    number: '1-2',
    module: 'Software Architecture 설계/구축',
    subModule: 'Framework 적용',
    title: 'WAS 성능 개선 - DBCP 설정',
    content: [
      'Tomcat에서 DBCP 설정을 통한 성능 최적화',
      'Resource 설정 중 잘못된 설정 찾기',
      'maxTotal, maxIdle, minIdle, testOnBorrow 등 설정값 이해'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['WAS', 'DBCP', 'Tomcat', 'Connection Pool', '성능']
  },

  // 예상문제 #1 - Frontend Browser 객체 Scope
  {
    id: 'q1-3',
    number: '1-3',
    module: 'Software Architecture 설계/구축',
    subModule: 'Frontend',
    title: 'Frontend Browser 객체 Scope',
    content: [
      'JavaScript 코드의 실행 결과 예측',
      'var, let, const 스코프 차이',
      'Window 객체와 전역 스코프',
      '클로저와 스코프 체인'
    ],
    difficulty: '하급',
    points: 3,
    keywords: ['JavaScript', 'Scope', 'Browser', 'Frontend', '클로저']
  },

  // 예상문제 #1 - CDN 기능과 활용
  {
    id: 'q1-4',
    number: '1-4',
    module: 'Software Architecture 핵심',
    subModule: '기반 솔루션',
    title: 'CDN 기능과 활용',
    content: [
      'CDN(Content Delivery Network)의 주요 기능',
      '정적 컨텐츠 캐싱과 배포',
      'Edge Location과 Origin Server',
      'CDN 활용 시 고려사항'
    ],
    difficulty: '하급',
    points: 3,
    keywords: ['CDN', 'Cache', 'Edge', 'Performance']
  },

  // 예상문제 #2 - JVM
  {
    id: 'q2-1',
    number: '2-1',
    module: 'Software Architecture 핵심',
    subModule: 'JVM 구조 및 동작 특성',
    title: 'JVM 모니터링 및 GC 분석',
    content: [
      'jstat -gc 명령어 결과 분석',
      'Young Generation과 Old Generation 이해',
      'GC 발생 빈도와 시간 분석',
      'Eden, Survivor 영역의 동작 방식'
    ],
    difficulty: '중급',
    points: 4,
    keywords: ['JVM', 'GC', 'jstat', 'Monitoring', 'Memory']
  },

  {
    id: 'q2-2',
    number: '2-2',
    module: 'Software Architecture 핵심',
    subModule: 'JVM 구조 및 동작 특성',
    title: 'Kubernetes 환경에서 JVM 설정',
    content: [
      'Container 환경에서 JVM 메모리 설정',
      '-XX:+UseContainerSupport 옵션',
      'CPU와 Memory Limits 설정',
      'JVM 옵션: -Xms, -Xmx 설정 방법'
    ],
    difficulty: '중급',
    points: 3,
    keywords: ['JVM', 'Kubernetes', 'Container', 'Memory', 'Docker']
  },

  {
    id: 'q2-3',
    number: '2-3',
    module: 'Software Architecture 핵심',
    subModule: 'JVM 구조 및 동작 특성',
    title: 'OutOfMemoryError 분석 및 해결',
    content: [
      'Heap Dump 분석 방법',
      'Memory Leak 원인 파악',
      'MAT(Memory Analyzer Tool) 활용',
      '객체 참조 관계 분석'
    ],
    difficulty: '하급',
    points: 3,
    keywords: ['JVM', 'OutOfMemory', 'Heap Dump', 'Memory Leak']
  },

  // 예상문제 #3 - Transactional Outbox Pattern
  {
    id: 'q3-1',
    number: '3-1',
    module: 'Software Architecture 설계/구축',
    subModule: '분산 시스템 패턴',
    title: 'Transactional Outbox Pattern 기반 Kafka 메시지 처리',
    content: [
      'Transactional Outbox Pattern 이해',
      '온라인/배치 Kafka 메시지 처리 흐름',
      'DB 트랜잭션과 메시지 발행의 원자성 보장',
      'Outbox 테이블 설계 및 CDC 활용'
    ],
    difficulty: '상급',
    points: 5,
    keywords: ['Transactional Outbox', 'Kafka', 'CDC', '분산 트랜잭션', 'Event Sourcing']
  },

  {
    id: 'q3-2',
    number: '3-2',
    module: 'Software Architecture 설계/구축',
    subModule: '분산 시스템 패턴',
    title: 'Kafka 성능 병목 분석 및 개선',
    content: [
      '온라인/배치 메시지 처리 병목 구간 분석',
      'Consumer Group 설계 및 파티션 할당',
      'Batch Size와 Linger.ms 튜닝',
      'Kafka Lag 모니터링 및 대응'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['Kafka', 'Performance', 'Consumer Group', 'Partition', 'Tuning']
  },

  // 예상문제 #4 - Framework
  {
    id: 'q4-1',
    number: '4-1',
    module: 'Software Architecture 설계/구축',
    subModule: 'Framework 적용',
    title: 'Spring Boot DBCP 설정 최적화',
    content: [
      'HikariCP vs Tomcat DBCP 비교',
      'Connection Pool 설정 파라미터',
      'testOnBorrow, testWhileIdle 설정',
      'maxLifetime, connectionTimeout 튜닝'
    ],
    difficulty: '중급',
    points: 4,
    keywords: ['Spring Boot', 'DBCP', 'HikariCP', 'Connection Pool']
  },

  {
    id: 'q4-2',
    number: '4-2',
    module: 'Software Architecture 설계/구축',
    subModule: 'Frontend',
    title: 'JavaScript 스코프와 비동기 처리',
    content: [
      'Promise와 async/await 패턴',
      'Event Loop와 Task Queue',
      'Closure와 스코프 체인',
      'setTimeout과 비동기 처리'
    ],
    difficulty: '중급',
    points: 3,
    keywords: ['JavaScript', 'async/await', 'Promise', 'Event Loop', '비동기']
  },

  {
    id: 'q4-3',
    number: '4-3',
    module: 'Software Architecture 설계/구축',
    subModule: 'Reactive Programming',
    title: 'Spring WebFlux와 Reactive Programming',
    content: [
      'Mono와 Flux 이해',
      'BackPressure 처리',
      'Non-Blocking I/O',
      'Thread Model 비교 (MVC vs WebFlux)'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['Spring WebFlux', 'Reactive', 'Mono', 'Flux', 'Non-Blocking']
  },

  // 예상문제 #5 - I/F 기반 Data 동기화 (상세)
  {
    id: 'q5-1',
    number: '5-1',
    module: 'Software Architecture 핵심',
    subModule: 'I/F 기반 Data 동기화',
    title: '금융시스템 계좌잔고 동기화',
    content: [
      '트랜잭션 처리 시나리오 분석',
      '2PC(Two-Phase Commit) 패턴',
      'Saga Pattern 적용',
      'Eventually Consistent 모델'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['분산 트랜잭션', '2PC', 'Saga', 'Eventually Consistent']
  },

  {
    id: 'q5-2',
    number: '5-2',
    module: 'Software Architecture 핵심',
    subModule: 'I/F 기반 Data 동기화',
    title: 'EAI vs ESB vs API Gateway 비교',
    content: [
      'EAI(Enterprise Application Integration) 특징',
      'ESB(Enterprise Service Bus) 아키텍처',
      'API Gateway 패턴과 적용',
      '각 솔루션의 장단점과 적용 시나리오'
    ],
    difficulty: '중급',
    points: 3,
    keywords: ['EAI', 'ESB', 'API Gateway', 'Integration']
  },

  {
    id: 'q5-3',
    number: '5-3',
    module: 'Software Architecture 핵심',
    subModule: 'I/F 기반 Data 동기화',
    title: 'CDC(Change Data Capture) 구현',
    content: [
      'Database CDC 메커니즘',
      'Debezium을 활용한 CDC',
      'Kafka Connect 설정',
      'Schema Registry 활용'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['CDC', 'Debezium', 'Kafka Connect', 'Schema Registry']
  },

  // 예상문제 #6 - Kafka/Redis Backing Service
  {
    id: 'q6-1',
    number: '6-1',
    module: 'Software Architecture 핵심',
    subModule: 'Backing Service',
    title: 'Kafka 클러스터 주문 처리 시스템',
    content: [
      '고객별 주문 순서 보장 방법',
      'Partition Key 설계',
      'Consumer Group 관리',
      'Replication Factor와 가용성'
    ],
    difficulty: '상급',
    points: 4,
    keywords: ['Kafka', 'Partition', 'Ordering', 'Consumer Group']
  },

  {
    id: 'q6-2',
    number: '6-2',
    module: 'Software Architecture 핵심',
    subModule: 'Backing Service',
    title: 'Redis Cluster 구성과 성능',
    content: [
      'Redis Cluster vs Sentinel',
      'Sharding과 Hash Slot',
      'Persistence 옵션 (RDB vs AOF)',
      'Eviction Policy 설정'
    ],
    difficulty: '중급',
    points: 3,
    keywords: ['Redis', 'Cluster', 'Sharding', 'Persistence', 'Cache']
  },

  {
    id: 'q6-3',
    number: '6-3',
    module: 'Software Architecture 핵심',
    subModule: 'Backing Service',
    title: 'Pub/Sub 패턴과 비동기 처리',
    content: [
      'Kafka vs Redis Pub/Sub 비교',
      'At-least-once vs At-most-once vs Exactly-once',
      'Message Ordering 보장',
      'Dead Letter Queue 처리'
    ],
    difficulty: '중급',
    points: 4,
    keywords: ['Pub/Sub', 'Message Queue', 'Kafka', 'Redis', 'DLQ']
  }
];

// Save to JSON file
const outputPath = path.join(__dirname, '../src/data/questions.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

console.log(`Parsed ${allQuestions.length} questions`);
console.log('Questions saved to:', outputPath);

// Also create a summary file
const summary = {
  totalQuestions: allQuestions.length,
  byModule: {},
  byDifficulty: {},
  totalPoints: 0
};

allQuestions.forEach(q => {
  // By module
  if (!summary.byModule[q.module]) {
    summary.byModule[q.module] = 0;
  }
  summary.byModule[q.module]++;
  
  // By difficulty
  if (q.difficulty) {
    if (!summary.byDifficulty[q.difficulty]) {
      summary.byDifficulty[q.difficulty] = 0;
    }
    summary.byDifficulty[q.difficulty]++;
  }
  
  // Total points
  if (q.points) {
    summary.totalPoints += q.points;
  }
});

console.log('\n=== Summary ===');
console.log('Total Questions:', summary.totalQuestions);
console.log('Total Points:', summary.totalPoints);
console.log('\nBy Module:');
Object.entries(summary.byModule).forEach(([module, count]) => {
  console.log(`  ${module}: ${count}`);
});
console.log('\nBy Difficulty:');
Object.entries(summary.byDifficulty).forEach(([difficulty, count]) => {
  console.log(`  ${difficulty}: ${count}`);
});