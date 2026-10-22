import { describe,it,expect } from 'vitest';
import type { ActiveExam } from '../types';
import { referenceQuestions } from './referenceQuiz';
import { ruleSections } from './rules';
import { finishExam,generateExam } from './domain';
import { defaults,exportProgress,validateBackup } from './storage';
describe('rules-reference mock tests',()=>{
 it('covers every reference section with unique, bilingual, answerable questions',()=>{
  expect(referenceQuestions.length).toBeGreaterThan(50);
  expect(new Set(referenceQuestions.map(q=>q.id)).size).toBe(referenceQuestions.length);
  for(const section of ruleSections)expect(referenceQuestions.some(q=>q.chapter_id==='reference-'+section.id)).toBe(true);
  expect(referenceQuestions.filter(q=>q.chapter_id==='reference-points')).toHaveLength(50);
  for(const q of referenceQuestions){
   expect(q.options).toHaveLength(4);expect(new Set(q.options.map(o=>o.text_en)).size).toBe(4);
   expect(q.options.filter(o=>o.label===q.answer)).toHaveLength(1);
   expect(q.question_en).toBeTruthy();expect(q.question_zh).toBeTruthy();
   if(q.chapter_id!=='reference-points'){expect(q.question_en).toContain('____');expect(q.question_zh).toContain('____');}
  }
 });
 it('preserves generated question IDs, answers and source through saved tests and backups',()=>{
  const qs=generateExam(referenceQuestions,Math.min(100,referenceQuestions.length));
  const active:ActiveExam={id:'reference-test',source:'reference',startedAt:'2026-10-15T00:00:00Z',durationSeconds:null,questionIds:qs.map(q=>q.id),answers:Object.fromEntries(qs.map(q=>[q.id,q.answer])),currentIndex:0,flaggedIds:[]};
  const result=finishExam(active,referenceQuestions,Date.parse(active.startedAt)+1000);
  expect(result).toMatchObject({score:100,passed:true,source:'reference'});
  const p={...defaults(),settings:{...defaults().settings,examSource:'reference' as const},activeExam:active,history:[result]};
  expect(validateBackup(exportProgress(p),referenceQuestions)).toMatchObject(p);
 });
});
