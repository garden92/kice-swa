const fs = require('fs');
const path = require('path');

// 최종 데이터 읽기
const questionsPath = path.join(__dirname, '..', 'src', 'data', 'all-questions-final-corrected.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

console.log('🔍 최종 검증: 문제와 선택지 일치성 확인');
console.log('='.repeat(80));

let issueCount = 0;
const issues = [];

questions.forEach((q, index) => {
  const questionText = q.questionText || '';
  const choices = q.choices || [];
  const title = q.title;
  
  // 각 문제의 키워드와 선택지 키워드 비교
  const questionKeywords = [];
  const choiceKeywords = [];
  
  // 문제에서 키워드 추출
  if (questionText.includes('HTTP')) questionKeywords.push('HTTP');
  if (questionText.includes('CDN')) questionKeywords.push('CDN');
  if (questionText.includes('Kafka')) questionKeywords.push('Kafka');
  if (questionText.includes('Redis')) questionKeywords.push('Redis');
  if (questionText.includes('JVM')) questionKeywords.push('JVM');
  if (questionText.includes('EAI')) questionKeywords.push('EAI');
  if (questionText.includes('SAGA')) questionKeywords.push('SAGA');
  if (questionText.includes('JWT')) questionKeywords.push('JWT');
  if (questionText.includes('동기화')) questionKeywords.push('동기화');
  if (questionText.includes('금융')) questionKeywords.push('금융');
  
  // 선택지에서 키워드 추출
  choices.forEach(choice => {
    if (choice.includes('HTTP')) choiceKeywords.push('HTTP');
    if (choice.includes('CDN')) choiceKeywords.push('CDN');
    if (choice.includes('Kafka')) choiceKeywords.push('Kafka');
    if (choice.includes('Redis')) choiceKeywords.push('Redis');
    if (choice.includes('JVM')) choiceKeywords.push('JVM');
    if (choice.includes('EAI')) choiceKeywords.push('EAI');
    if (choice.includes('SAGA')) choiceKeywords.push('SAGA');
    if (choice.includes('JWT')) choiceKeywords.push('JWT');
  });
  
  // 불일치 검사
  let hasIssue = false;
  
  // 패턴 1: 문제는 동기화/거래인데 선택지가 HTTP/CDN
  if ((questionText.includes('동기화') || questionText.includes('거래')) && 
      (choiceKeywords.includes('HTTP') || choiceKeywords.includes('CDN'))) {
    hasIssue = true;
    issues.push({
      index: index + 1,
      title,
      issue: '동기화/거래 문제에 HTTP/CDN 선택지'
    });
  }
  
  // 패턴 2: 문제는 금융/ATM인데 선택지가 기술 일반론
  if ((questionText.includes('금융') || questionText.includes('ATM')) && 
      (choiceKeywords.includes('HTTP') || choiceKeywords.includes('CDN'))) {
    hasIssue = true;
    issues.push({
      index: index + 1,
      title,
      issue: '금융 문제에 웹 기술 선택지'
    });
  }
  
  if (hasIssue) {
    issueCount++;
    console.log(`❌ [${index + 1}] ${title}`);
    console.log(`   문제 키워드: ${questionKeywords.join(', ')}`);
    console.log(`   선택지 키워드: ${choiceKeywords.join(', ')}`);
  }
});

console.log('\n📊 최종 검증 결과:');
console.log(`총 문제: ${questions.length}개`);
console.log(`검증 통과: ${questions.length - issueCount}개`);
console.log(`불일치 발견: ${issueCount}개`);

if (issueCount > 0) {
  console.log('\n⚠️  불일치 문제 상세:');
  issues.forEach(issue => {
    console.log(`  - [${issue.index}] ${issue.title}: ${issue.issue}`);
  });
} else {
  console.log('\n✅ 모든 문제와 선택지가 올바르게 매칭되었습니다!');
}

// 통계
const stats = {
  totalQuestions: questions.length,
  validQuestions: questions.length - issueCount,
  issues: issueCount,
  timestamp: new Date().toISOString()
};

const statsPath = path.join(__dirname, '..', 'src', 'data', 'validation-report.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf-8');
console.log(`\n📋 검증 보고서 저장: ${statsPath}`);