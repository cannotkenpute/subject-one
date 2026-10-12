import type { ActiveExam, Progress, Question } from '../types';
import { shuffle } from './domain';

// Reviewed local references in this bank. Match explanations and distractors too:
// several street questions do not name the city in the question itself.
const localRules=/上海|济南|山东|四川|本市|我市|快处易赔|天桥区|槐荫区|历下区|市中区|历城区/;
const localStreets=/经十路|舜华[东西南北]?路|凤凰路|清河北路|馆驿街|佛山街/;
const translatedReferences=/\b(?:Shanghai|Jinan|Shandong|Sichuan)\b|\b(?:this|our) city's\b|\bQuick (?:Claim|Settlement Easy Claim)\b/i;

export function isLocalQuestion(q:Question):boolean {
 const chinese=[q.question_zh,q.explanation_zh,...q.options.map(o=>o.text_zh)].join(' ');
 const english=[q.question_en,q.why_en,...q.options.map(o=>o.text_en)].join(' ');
 return localRules.test(chinese)||localStreets.test(chinese)||translatedReferences.test(english);
}

export function nationalQuestions(bank:Question[]):Question[] {
 return bank.filter(q=>!isLocalQuestion(q));
}

// Retain completed scores, but replace local questions in an unfinished exam.
// Answers to retained questions, the position, timer and feedback mode survive.
export function applyQuestionScope<T extends Progress>(progress:T,bank:Question[]):T {
 const eligible=nationalQuestions(bank),ids=new Set(eligible.map(q=>q.id));
 const keep=(id:string)=>ids.has(id);
 let activeExam=progress.activeExam;
 if(activeExam&&activeExam.questionIds.some(id=>!keep(id))){
  const retained=new Set(activeExam.questionIds.filter(keep));
  const replacements=shuffle(eligible.filter(q=>!retained.has(q.id)));
  const needed=activeExam.questionIds.length-retained.size;
  if(replacements.length<needed)throw Error('There are not enough national questions to restore this exam.');
  const questionIds=activeExam.questionIds.map(id=>keep(id)?id:replacements.pop()!.id);
  activeExam={...activeExam,questionIds,answers:Object.fromEntries(Object.entries(activeExam.answers).filter(([id])=>keep(id))),flaggedIds:activeExam.flaggedIds.filter(keep)} satisfies ActiveExam;
 }
 return {...progress,activeExam,wrongQuestionIds:progress.wrongQuestionIds.filter(keep),bookmarkedQuestionIds:progress.bookmarkedQuestionIds.filter(keep),streaks:Object.fromEntries(Object.entries(progress.streaks).filter(([id])=>keep(id)))};
}
