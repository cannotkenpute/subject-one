import { describe,it,expect } from 'vitest';
import { createPointQuiz,pointGroups,pointRules,pointValues } from './pointQuiz';

describe('point rules quiz',()=>{
 it('covers the shared reference with unique bilingual rules and corrected deductions',()=>{
  expect(pointRules).toHaveLength(50);
  expect(new Set(pointRules.map(r=>r.id)).size).toBe(50);
  expect(pointGroups.map(g=>g.entries.length)).toEqual([7,7,11,15,10]);
  expect(pointRules.every(r=>r.en&&r.zh&&pointValues.includes(r.points as typeof pointValues[number]))).toBe(true);
  expect(pointRules.some(r=>r.en.includes('Towing a trailer'))).toBe(false);
  expect(pointRules.find(r=>r.en.includes('restricted area without approval'))?.points).toBe(6);
  expect(pointRules.find(r=>r.en.includes('checking its safety condition'))?.points).toBe(3);
 });
 it('mixes all five point levels without duplicate questions and preserves point choices',()=>{
  for(let i=0;i<20;i++){
   const questions=createPointQuiz();expect(questions).toHaveLength(10);expect(new Set(questions.map(q=>q.id)).size).toBe(10);
   expect(new Set(questions.map(q=>q.rule.points)).size).toBe(5);
   for(const q of questions){expect(q.kind).toBe('deduction');expect(q.choices.map(c=>Number(c.id))).toEqual(pointValues);expect(q.answerId).toBe(String(q.rule.points));}
  }
 });
 it('focused quizzes use only the selected level as answers and other levels as distractors',()=>{
  for(const group of pointGroups){
   const questions=createPointQuiz(group.id);expect(questions).toHaveLength(Math.min(10,group.entries.length));
   for(const q of questions){expect(q.kind).toBe('violation');expect(q.rule.groupId).toBe(group.id);expect(q.choices).toHaveLength(4);expect(q.choices.filter(c=>c.id===q.answerId)).toHaveLength(1);expect(new Set(q.choices.map(c=>c.id)).size).toBe(4);
    for(const option of q.choices.filter(c=>c.id!==q.answerId))expect(pointRules.find(r=>r.id===option.id)!.points).not.toBe(q.rule.points);
   }
  }
 });
 it('handles small and full sets without mutating the rules',()=>{
  const before=JSON.stringify(pointRules);expect(createPointQuiz('missing')).toEqual([]);expect(createPointQuiz('all',0)).toEqual([]);expect(createPointQuiz('all',1)).toHaveLength(1);expect(createPointQuiz('all',100)).toHaveLength(50);expect(JSON.stringify(pointRules)).toBe(before);
 });
});
