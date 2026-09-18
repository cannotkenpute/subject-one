import { describe,it,expect } from 'vitest';
import bankData from '../../public/data/questions_bilingual.json';
import type { Question } from '../types';
import { generateExam,scoreExam,shuffle,remainingSeconds,recordAnswer,recordExam,finishExam } from './domain';
import { defaults,exportProgress,validateBackup,mergeProgress,encodeSummary,decodeSummary } from './storage';
import { publicAsset } from './questions';
const bank=bankData as unknown as Question[];
describe('exam rules',()=>{
 it('shuffles without mutating or losing elements',()=>{const a=[1,2,3,4];expect(shuffle(a).sort()).toEqual(a);expect(a).toEqual([1,2,3,4]);});
 it('selects exactly 100 unique IDs and rejects undersized banks',()=>{const exam=generateExam([...bank,...bank]);expect(exam).toHaveLength(100);expect(new Set(exam.map(q=>q.id)).size).toBe(100);expect(()=>generateExam(bank.slice(0,99))).toThrow();});
 it('scores 90 as pass, 89 as fail and counts unanswered separately',()=>{const qs=bank.slice(0,100);const answers=Object.fromEntries(qs.slice(0,90).map(q=>[q.id,q.answer]));expect(scoreExam(qs,answers)).toMatchObject({score:90,passed:true,unanswered:10,incorrect:0});delete answers[qs[89].id];answers[qs[90].id]=qs[90].options.find(o=>o.label!==qs[90].answer)!.label;const result=scoreExam(qs,answers);expect(result).toMatchObject({score:89,passed:false,incorrect:1,unanswered:10});expect(result.incorrectQuestionIds).toHaveLength(11);});
 it('uses a persisted timestamp and expires at zero',()=>{const e={id:'test',startedAt:'2026-09-13T00:00:00Z',durationSeconds:2700,questionIds:[],answers:{},currentIndex:0,flaggedIds:[]};expect(remainingSeconds(e,Date.parse(e.startedAt))).toBe(2700);expect(remainingSeconds(e,Date.parse(e.startedAt)+60000)).toBe(2640);expect(remainingSeconds(e,Date.parse(e.startedAt)+2800000)).toBe(0);});
 it('requires consecutive correct answers for mastery',()=>{const p=recordAnswer(defaults(),bank[0].id,false);const once=recordAnswer(p,bank[0].id,true);expect(once.wrongQuestionIds).toHaveLength(1);expect(recordAnswer(once,bank[0].id,true).wrongQuestionIds).toHaveLength(0);expect(recordAnswer(recordAnswer(once,bank[0].id,false),bank[0].id,true).wrongQuestionIds).toHaveLength(1);});
});
const exam={id:'exam-1',startedAt:'2026-09-13T00:00:00Z',durationSeconds:2700,questionIds:bank.slice(0,100).map(q=>q.id),answers:Object.fromEntries(bank.slice(0,90).map(q=>[q.id,q.answer])),currentIndex:1,flaggedIds:[]};
const result=finishExam(exam,bank,Date.parse(exam.startedAt)+10000);
describe('progress and backups',()=>{
 it('records results once and tracks missed questions',()=>{const p=recordExam(defaults(),result,bank);expect(p.history).toHaveLength(1);expect(p.wrongQuestionIds).toHaveLength(10);expect(recordExam(p,result,bank).history).toHaveLength(1);});
 it('round-trips cookie summary compactly',()=>{const encoded=encodeSummary([result]);expect(encoded.length).toBeLessThan(4096);expect(decodeSummary(encoded)).toMatchObject({lastScore:90,bestScore:90,passed:true,examCount:1});expect(decodeSummary('%')).toBe(null);});
 it('round-trips complete progress including active exam',()=>{const p={...recordExam(defaults(),result,bank),activeExam:exam};expect(validateBackup(JSON.parse(JSON.stringify(exportProgress(p))),bank)).toMatchObject(p);});
 it('rejects wrong format, invalid IDs, options and active timer without changing existing data',()=>{const p=defaults();for(const change of [{format:'bad'},{wrongQuestionIds:['missing']},{history:[{...result,answers:{[bank[0].id]:'Z'}}]},{settings:{...p.settings,masteryTarget:0}},{activeExam:{...exam,durationSeconds:0}}])expect(()=>validateBackup({...exportProgress(p),...change},bank)).toThrow();expect(p).toMatchObject({history:[],wrongQuestionIds:[]});});
 it('recomputes untrusted scores and merges unique results with newest preferences',()=>{const p=recordExam(defaults(),result,bank);const backup=validateBackup({...exportProgress(p),history:[{...result,score:100,passed:false}]},bank);expect(backup.history[0].score).toBe(90);expect(backup.history[0].passed).toBe(true);expect(mergeProgress(p,backup).history).toHaveLength(1);});
 it('normalizes root and subpath image URLs',()=>{expect(publicAsset('/images/test.jpg','/study/')).toBe('/study/images/test.jpg');expect(publicAsset('images/test.jpg','/')).toBe('/images/test.jpg');});
});
