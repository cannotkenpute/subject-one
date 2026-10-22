import { describe, it, expect } from 'vitest';
import data from '../../public/data/questions_bilingual.json';
import type { ActiveExam, Question } from '../types';
import { finishExam, pastMistakeQuestions, scoreExam } from './domain';
import { defaults, exportProgress, validateBackup } from './storage';
const bank=data as Question[];
const exam:ActiveExam={id:'past',startedAt:'2026-10-01T00:00:00Z',durationSeconds:null,questionIds:bank.slice(0,100).map(q=>q.id),answers:{[bank[0].id]:bank[0].options.find(o=>o.label!==bank[0].answer)!.label,[bank[1].id]:bank[1].answer},currentIndex:0,flaggedIds:[]};
describe('past-mistake mock tests',()=>{
 it('deduplicates actual mistakes, ignores unanswered and unavailable IDs, and retains later-mastered questions',()=>{
  const result=finishExam(exam,bank,Date.parse(exam.startedAt)+1000);
  const corrected={...result,id:'corrected',answers:{[bank[0].id]:bank[0].answer}};
  expect(pastMistakeQuestions(bank,[result,result,corrected]).map(q=>q.id)).toEqual([bank[0].id]);
  expect(pastMistakeQuestions(bank.slice(1),[result])).toEqual([]);
  expect(pastMistakeQuestions(bank,[])).toEqual([]);
 });
 it('scores shorter tests as a percentage and preserves source, results and resume through backups',()=>{
  const questions=bank.slice(0,10),answers=Object.fromEntries(questions.slice(0,9).map(q=>[q.id,q.answer]));
  const active:ActiveExam={...exam,id:'retry',source:'mistakes',questionIds:questions.map(q=>q.id),answers,currentIndex:9};
  const result=finishExam(active,bank,Date.parse(active.startedAt)+1000);
  expect(result).toMatchObject({source:'mistakes',totalQuestions:10,correct:9,unanswered:1,score:90,passed:true});
  const restored=validateBackup(exportProgress({...defaults(),history:[result],activeExam:active}),bank);
  expect(restored.history[0]).toMatchObject(result);expect(restored.activeExam).toEqual(active);
  expect(scoreExam(questions.slice(0,3),{[questions[0].id]:questions[0].answer})).toMatchObject({score:33,passed:false});
  expect(()=>validateBackup({...exportProgress(restored),activeExam:{...active,currentIndex:10}},bank)).toThrow();
  expect(()=>validateBackup({...exportProgress(restored),activeExam:{...active,source:'all'}},bank)).toThrow();
 });
});
