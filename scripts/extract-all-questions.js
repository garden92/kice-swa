const fs = require('fs');
const path = require('path');

// Read the extracted text
const textPath = path.join(__dirname, '../src/data/exam-questions.txt');
const text = fs.readFileSync(textPath, 'utf-8');

const lines = text.split('\n');
const questions = [];

// Parse all questions from the PDF
function parseAllQuestions() {
  let currentQuestion = null;
  let currentModule = '';
  let currentType = '';
  let questionContent = '';
  let collectingQuestion = false;
  let questionCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and unwanted content
    if (!line || line.includes('Scroll PDF Exporter') || line.includes('https://marketplace')) {
      continue;
    }

    // Detect question type and module
    if (line.includes('Software Architect – 예상문제')) {
      currentType = '예상문제';
      currentModule = 'Software Architecture';
      continue;
    }
    
    if (line.includes('기출문제')) {
      currentType = '기출문제';
      continue;
    }

    // Pattern 1: "1. Title (4점, 중급)"
    const pattern1 = line.match(/^(\d+)\.\s+(.+)\s+\((\d+)점,\s*(하급|중급|상급)\)$/);
    if (pattern1) {
      if (currentQuestion) {
        finalizeQuestion(currentQuestion, questionContent);
      }
      
      currentQuestion = {
        id: `${currentType.charAt(0)}${questionCounter++}`,
        number: pattern1[1],
        type: currentType,
        module: currentModule,
        title: pattern1[2],
        points: parseInt(pattern1[3]),
        difficulty: pattern1[4],
        question: '',
        answer: '',
        explanation: '',
        keywords: []
      };
      questionContent = '';
      collectingQuestion = true;
      continue;
    }

    // Pattern 2: "문제 1 [4점, 중]" or "문제 1 [4점]"
    const pattern2 = line.match(/^문제\s+(\d+)\s*\[(\d+)점(?:,\s*(하급|중급|상급|하|중|상))?\]$/);
    if (pattern2) {
      if (currentQuestion) {
        finalizeQuestion(currentQuestion, questionContent);
      }
      
      currentQuestion = {
        id: `${currentType.charAt(0)}${questionCounter++}`,
        number: pattern2[1],
        type: currentType,
        module: currentModule,
        title: '',
        points: parseInt(pattern2[2]),
        difficulty: pattern2[3] || '중급',
        question: '',
        answer: '',
        explanation: '',
        keywords: []
      };
      questionContent = '';
      collectingQuestion = true;
      continue;
    }

    // Collect question content
    if (collectingQuestion && currentQuestion) {
      // Check for answer and explanation
      if (line.startsWith('정답:')) {
        const answerMatch = line.match(/정답:\s*(\d+|①|②|③|④|⑤)/);
        if (answerMatch) {
          currentQuestion.answer = answerMatch[1];
        }
        
        // Look for explanation in the same line
        const explanationMatch = line.match(/해설:\s*(.+)/);
        if (explanationMatch) {
          currentQuestion.explanation = explanationMatch[1];
        }
        continue;
      }
      
      // Look for separate explanation line
      if (line.startsWith('해설:')) {
        currentQuestion.explanation = line.replace('해설:', '').trim();
        continue;
      }
      
      // Add to question content if it's substantial
      if (line.length > 5 && !line.includes('pdf-exporter')) {
        questionContent += line + '\n';
        
        // Set title if not already set and this looks like a title
        if (!currentQuestion.title && line.length > 10 && line.length < 100 && !line.includes('①')) {
          currentQuestion.title = line;
        }
      }
    }
  }

  // Don't forget the last question
  if (currentQuestion) {
    finalizeQuestion(currentQuestion, questionContent);
  }
}

function finalizeQuestion(question, content) {
  question.question = content.trim();
  
  // Extract keywords from title and content
  const keywordPatterns = [
    /JVM|GC|Heap/gi,
    /Spring|WebFlux|Boot/gi,
    /Kubernetes|Pod|Container/gi,
    /Kafka|Redis|EAI/gi,
    /React|JavaScript|DOM/gi,
    /DBCP|Connection Pool|TCP/gi,
    /MSA|Service Mesh|Istio/gi,
    /JWT|Security|mTLS/gi,
    /HTTP|CDN|Protocol/gi,
    /SAGA|트랜잭션|분산/gi
  ];
  
  const keywords = new Set();
  const fullText = (question.title + ' ' + question.question).toLowerCase();
  
  keywordPatterns.forEach(pattern => {
    const matches = fullText.match(pattern) || [];
    matches.forEach(match => keywords.add(match));
  });
  
  question.keywords = Array.from(keywords);
  
  if (question.title && question.question) {
    questions.push(question);
  }
}

// Parse all questions
parseAllQuestions();

console.log(`Found ${questions.length} questions total`);

// Group by type for summary
const byType = questions.reduce((acc, q) => {
  acc[q.type] = (acc[q.type] || 0) + 1;
  return acc;
}, {});

console.log('Questions by type:', byType);

// Show some examples
console.log('\nFirst few questions:');
questions.slice(0, 5).forEach(q => {
  console.log(`${q.id}: ${q.title || '제목없음'} (${q.points}점, ${q.difficulty})`);
});

// Save to JSON file
const outputPath = path.join(__dirname, '../src/data/all-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));

console.log(`\nAll questions saved to: ${outputPath}`);

// Create summary
const summary = {
  totalQuestions: questions.length,
  byType: byType,
  byDifficulty: {},
  totalPoints: 0
};

questions.forEach(q => {
  if (q.difficulty) {
    summary.byDifficulty[q.difficulty] = (summary.byDifficulty[q.difficulty] || 0) + 1;
  }
  if (q.points) {
    summary.totalPoints += q.points;
  }
});

console.log('\n=== Summary ===');
console.log('Total Questions:', summary.totalQuestions);
console.log('Total Points:', summary.totalPoints);
console.log('\nBy Type:');
Object.entries(byType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});
console.log('\nBy Difficulty:');
Object.entries(summary.byDifficulty).forEach(([difficulty, count]) => {
  console.log(`  ${difficulty}: ${count}`);
});