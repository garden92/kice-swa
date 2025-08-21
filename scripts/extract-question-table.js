const fs = require('fs');
const path = require('path');

// 예상문제 표 데이터를 수동으로 구조화
// PDF에서 추출한 표 내용을 바탕으로 정리
const questionTable = [
  {
    category: "Software Architecture 핵심",
    totalQuestions: 3,
    totalPoints: 11,
    subcategories: [
      {
        name: "기반 솔루션 분류/정의",
        topics: [
          "I/F 기반의 Data 동기화 문제",
          "Data File에 대한 동기화",
          "DB Data 동기화(EAI, Kafka)"
        ],
        references: ["예상문제 #5 - I/F 기반 Data 동기화"],
        relatedQuestions: ["q5-1", "q5-2", "q5-3"]
      },
      {
        name: "기반 솔루션 주요 기능/장단점", 
        topics: [
          "Kafka/Redis 등 Backing 서비스",
          "Clustering 및 성능관련된 특징에 대한 이해",
          "Pub/Sub, 비동기에 따른 순차거래 특징",
          "가용성 처리 방식"
        ],
        references: [
          "https://my-develop-note.tistory.com/266",
          "예상문제 #6 - Kafka/Redis 등 Backing 서비스"
        ],
        relatedQuestions: ["q6-1", "q6-2", "q6-3"]
      },
      {
        name: "JVM 구조 및 동작 특성",
        topics: [
          "Java GC 개념과 Option 설정(Kubernetes에서 설정하는 방법)",
          "Java GC 발생 시 성능 개선을 위한 Issue 원인 및 대응 방안",
          "JVM의 GC 발생 조건 및 동작 방식",
          "JVM 옵션",
          "JDK 버전별 GC 변화"
        ],
        references: ["예상문제 #2 - JVM"],
        relatedQuestions: ["q2-1", "q2-2", "q2-3"]
      }
    ]
  },
  {
    category: "Software Architecture 설계/구축",
    totalQuestions: 6,
    totalPoints: 22,
    subcategories: [
      {
        name: "시스템 유형별 참조 SW 아키텍처",
        topics: [
          "SW 아키텍처 설계",
          "개발 환경 및 구성의 트렌드 변화"
        ],
        references: [],
        relatedQuestions: []
      },
      {
        name: "Framework 적용 (환경, 온라인, 배치, 연계 등)",
        topics: [
          "Framework의 역할 및 아키텍처 고려 사항",
          "WAS 기본 성능 개선: DBCP, TCP Connection Pool, JVM Memory",
          "Frontend, ECMA(Javascript) Spec 이해",
          "Browser 내 객체 Scope, HTMLDom 구조", 
          "Reactive Programming(비동기) 개념 이해",
          "Springboot Process/Thread 이해와 Block/NonBlock 개념",
          "비동기 Adaptor 작성"
        ],
        references: [
          "02. 제로카피_프론트엔드_트랜드_최종_v1.0.0_박종명.pptx",
          "예상문제 #4 - 수정중"
        ],
        relatedQuestions: ["q4-1", "q4-2", "q4-3"]
      },
      {
        name: "개발 표준 수립 및 가이드",
        topics: [
          "Spring 기반의 공통 로직 처리 방법",
          "log, 공통정보 처리",
          "호출 관계에 대한 이해도"
        ],
        references: [
          "https://www.baeldung.com/mdc-in-log4j-2-logback"
        ],
        relatedQuestions: []
      },
      {
        name: "개발/배포/모니터링 체계 구축",
        topics: [
          "DB 계정정보 암호화 설정",
          "Web 서버 설정: 성능 개선을 위한 설정에 대한 이해, 버퍼 사이즈 등",
          "nginx, tomcat, apache",
          "Tomcat JDBC Connection Pool"
        ],
        references: [],
        relatedQuestions: []
      },
      {
        name: "솔루션 설치, 구성 및 마이그레이션",
        topics: [
          "보안(보안 취약점, 권한 관리, 암호화 등)",
          "가용성 및 효율성"
        ],
        references: [],
        relatedQuestions: []
      }
    ]
  },
  {
    category: "Software Architecture 운영/문제해결",
    totalQuestions: 6,
    totalPoints: 32,
    subcategories: [
      {
        name: "모니터링(항목, 방법, 도구)",
        topics: [
          "시스템 모니터링 방법론",
          "성능 지표 수집 및 분석",
          "로그 분석 및 관리"
        ],
        references: [],
        relatedQuestions: []
      },
      {
        name: "성능개선 및 문제해결", 
        topics: [
          "CDN의 기능과 활용/특징에 대한 이해",
          "Linux File system 에 대한 이해와 Kernel",
          "Lighthouse에 대한 이해"
        ],
        references: [],
        relatedQuestions: []
      }
    ]
  },
  {
    category: "Software Architecture 환경",
    totalQuestions: 4,
    totalPoints: 14,
    subcategories: [
      {
        name: "프로토콜, 네트워크 및 방화벽",
        topics: [
          "HTTP Protocol 에 대한 이해",
          "네트워크 보안 및 방화벽 설정",
          "통신 프로토콜 최적화"
        ],
        references: [],
        relatedQuestions: []
      }
    ]
  },
  {
    category: "신기술",
    totalQuestions: 6,
    totalPoints: 21,
    subcategories: [
      {
        name: "Cloud Service",
        topics: [
          "대량파일처리를 위한 WAS",
          "Kubernetes Ingress 설정 방법",
          "클라우드 네이티브 아키텍처"
        ],
        references: [],
        relatedQuestions: []
      },
      {
        name: "Microservice Architecture",
        topics: [
          "마이크로서비스 설계 패턴",
          "서비스 간 통신 방법",
          "분산 시스템 패턴"
        ],
        references: [],
        relatedQuestions: []
      }
    ]
  }
];

// Save to JSON file
const outputPath = path.join(__dirname, '../src/data/question-table.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(questionTable, null, 2));

console.log(`Question table saved to: ${outputPath}`);

// Create summary
const totalQuestions = questionTable.reduce((sum, category) => sum + category.totalQuestions, 0);
const totalPoints = questionTable.reduce((sum, category) => sum + category.totalPoints, 0);

console.log('\n=== 예상문제 표 요약 ===');
console.log(`총 문제 수: ${totalQuestions}문항`);
console.log(`총 점수: ${totalPoints}점`);
console.log('\n카테고리별:');
questionTable.forEach(category => {
  console.log(`  ${category.category}: ${category.totalQuestions}문항 (${category.totalPoints}점)`);
  category.subcategories.forEach(sub => {
    console.log(`    - ${sub.name}`);
  });
});