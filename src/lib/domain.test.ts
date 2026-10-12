import { describe,it,expect } from 'vitest';
import bankData from '../../public/data/questions_bilingual.json';
import type { ActiveExam, Question } from '../types';
import { generateExam,scoreExam,shuffle,remainingSeconds,recordAnswer,recordExam,finishExam,shouldStopExam } from './domain';
import { defaults,exportProgress,validateBackup,mergeProgress,encodeSummary,decodeSummary } from './storage';
import { publicAsset } from './questions';
const bank=bankData as unknown as Question[];
describe('exam rules',()=>{
 it('shuffles without mutating or losing elements',()=>{const a=[1,2,3,4];expect(shuffle(a).sort()).toEqual(a);expect(a).toEqual([1,2,3,4]);});
 it('selects exactly 100 unique IDs and rejects undersized banks',()=>{const exam=generateExam([...bank,...bank]);expect(exam).toHaveLength(100);expect(new Set(exam.map(q=>q.id)).size).toBe(100);expect(()=>generateExam(bank.slice(0,99))).toThrow();});
 it('scores 90 as pass, 89 as fail and counts unanswered separately',()=>{const qs=bank.slice(0,100);const answers=Object.fromEntries(qs.slice(0,90).map(q=>[q.id,q.answer]));expect(scoreExam(qs,answers)).toMatchObject({score:90,passed:true,unanswered:10,incorrect:0});delete answers[qs[89].id];answers[qs[90].id]=qs[90].options.find(o=>o.label!==qs[90].answer)!.label;const result=scoreExam(qs,answers);expect(result).toMatchObject({score:89,passed:false,incorrect:1,unanswered:10});expect(result.incorrectQuestionIds).toHaveLength(11);});
 it('uses a persisted timestamp and expires at zero',()=>{const e={id:'test',startedAt:'2026-09-13T00:00:00Z',durationSeconds:2700,questionIds:[],answers:{},currentIndex:0,flaggedIds:[]};expect(remainingSeconds(e,Date.parse(e.startedAt))).toBe(2700);expect(remainingSeconds(e,Date.parse(e.startedAt)+60000)).toBe(2640);expect(remainingSeconds(e,Date.parse(e.startedAt)+2800000)).toBe(0);});
 it('untimed exams never expire and preserve elapsed time and feedback mode in backups',()=>{const untimed:ActiveExam={...exam,durationSeconds:null,immediate:true};const now=Date.parse(exam.startedAt)+7200000;expect(remainingSeconds(untimed,now)).toBe(Infinity);const completed=finishExam(untimed,bank,now);expect(completed).toMatchObject({durationSeconds:7200,timeLimitSeconds:null,immediate:true});const p={...recordExam(defaults(),completed,bank),activeExam:untimed};expect(validateBackup(JSON.parse(JSON.stringify(exportProgress(p))),bank)).toMatchObject(p);});
 it('requires consecutive correct answers for mastery',()=>{const p=recordAnswer(defaults(),bank[0].id,false);const once=recordAnswer(p,bank[0].id,true);expect(once.wrongQuestionIds).toHaveLength(1);expect(recordAnswer(once,bank[0].id,true).wrongQuestionIds).toHaveLength(0);expect(recordAnswer(recordAnswer(once,bank[0].id,false),bank[0].id,true).wrongQuestionIds).toHaveLength(1);});
 it('auto-stops at exactly 10 attempted mistakes, excluding unanswered questions',()=>{
  const qs=bank.slice(0,100),wrong=(q:Question)=>q.options.find(o=>o.label!==q.answer)!.label;
  const e:ActiveExam={...exam,stopAfterTenWrong:true,answers:Object.fromEntries(qs.slice(0,9).map(q=>[q.id,wrong(q)]))};
  expect(shouldStopExam(e,bank)).toBe(false);
  e.answers[qs[9].id]=qs[9].answer;expect(shouldStopExam(e,bank)).toBe(false);
  e.answers[qs[9].id]=wrong(qs[9]);expect(shouldStopExam(e,bank)).toBe(true);
  expect(shouldStopExam({...e,stopAfterTenWrong:false},bank)).toBe(false);
  expect(shouldStopExam({...e,stopAfterTenWrong:undefined},bank)).toBe(false);
  const result=finishExam(e,bank);expect(result).toMatchObject({incorrect:10,unanswered:90,stoppedAfterTenWrong:true});
  const saved=recordExam(defaults(),result,bank);expect(saved.wrongQuestionIds).toEqual(qs.slice(0,10).map(q=>q.id));expect(recordExam(saved,result,bank).history).toHaveLength(1);
  expect(validateBackup(exportProgress({...saved,activeExam:e}),bank)).toMatchObject({activeExam:{stopAfterTenWrong:true},history:[{stoppedAfterTenWrong:true}]});
 });
});
const exam={id:'exam-1',startedAt:'2026-09-13T00:00:00Z',durationSeconds:2700,questionIds:bank.slice(0,100).map(q=>q.id),answers:Object.fromEntries(bank.slice(0,90).map(q=>[q.id,q.answer])),currentIndex:1,flaggedIds:[]};
const result=finishExam(exam,bank,Date.parse(exam.startedAt)+10000);
describe('progress and backups',()=>{
 it('records results once and tracks missed questions',()=>{const p=recordExam(defaults(),result,bank);expect(p.history).toHaveLength(1);expect(p.wrongQuestionIds).toHaveLength(10);expect(recordExam(p,result,bank).history).toHaveLength(1);});
 it('round-trips cookie summary compactly',()=>{const encoded=encodeSummary([result]);expect(encoded.length).toBeLessThan(4096);expect(decodeSummary(encoded)).toMatchObject({lastScore:90,bestScore:90,passed:true,examCount:1});expect(decodeSummary('%')).toBe(null);});
 it('round-trips complete progress including active exam',()=>{const p={...recordExam(defaults(),result,bank),activeExam:exam};expect(validateBackup(JSON.parse(JSON.stringify(exportProgress(p))),bank)).toMatchObject(p);});
 it('rejects wrong format, invalid IDs, options and active timer without changing existing data',()=>{const p=defaults();for(const change of [{format:'bad'},{wrongQuestionIds:['missing']},{history:[{...result,answers:{[bank[0].id]:'Z'}}]},{settings:{...p.settings,masteryTarget:0}},{settings:{...p.settings,practiceCount:-1}},{settings:{...p.settings,practiceMinutes:241}},{activeExam:{...exam,durationSeconds:0}}])expect(()=>validateBackup({...exportProgress(p),...change},bank)).toThrow();expect(p).toMatchObject({history:[],wrongQuestionIds:[]});});
 it('recomputes untrusted scores and merges unique results with newest preferences',()=>{const p=recordExam(defaults(),result,bank);const backup=validateBackup({...exportProgress(p),history:[{...result,score:100,passed:false}]},bank);expect(backup.history[0].score).toBe(90);expect(backup.history[0].passed).toBe(true);expect(mergeProgress(p,backup).history).toHaveLength(1);});
 it('fills in practice session settings missing from older backups',()=>{const p=defaults();const legacy=exportProgress(p) as unknown as Record<string,unknown>;const settings={...p.settings} as Record<string,unknown>;delete settings.practiceCount;delete settings.practiceMinutes;legacy.settings=settings;const restored=validateBackup(JSON.parse(JSON.stringify(legacy)),bank);expect(restored.settings).toMatchObject({practiceCount:0,practiceMinutes:0});});
 it('fills in new exam preferences and preserves legacy timed exams',()=>{const p=defaults();const settings={...p.settings} as Record<string,unknown>;delete settings.examMinutes;delete settings.examImmediate;const restored=validateBackup({...exportProgress(p),settings,activeExam:exam},bank);expect(restored.settings).toMatchObject({examMinutes:0,examImmediate:true});expect(restored.activeExam).toMatchObject({durationSeconds:2700});expect(restored.activeExam?.immediate).toBeUndefined();});
 it('rejects malformed exam options and invalid untimed durations',()=>{const p=defaults();for(const change of [{settings:{...p.settings,examMinutes:10}},{settings:{...p.settings,examImmediate:'yes'}},{activeExam:{...exam,immediate:'yes'}},{history:[{...result,timeLimitSeconds:null,durationSeconds:7200}]},{history:[{...result,timeLimitSeconds:0}]}])expect(()=>validateBackup({...exportProgress(p),...change},bank)).toThrow();});
 it('normalizes root and subpath image URLs',()=>{expect(publicAsset('/images/test.jpg','/study/')).toBe('/study/images/test.jpg');expect(publicAsset('images/test.jpg','/')).toBe('/images/test.jpg');});
 it('restores older preferences and rejects invalid auto-stop settings and result markers',()=>{
  const p=defaults(),settings={...p.settings} as Record<string,unknown>;delete settings.examStopAfterTenWrong;
  expect(validateBackup({...exportProgress(p),settings,activeExam:exam},bank)).toMatchObject({settings:{examStopAfterTenWrong:true},activeExam:exam});
  for(const change of [{settings:{...p.settings,examStopAfterTenWrong:'yes'}},{activeExam:{...exam,stopAfterTenWrong:'yes'}},{history:[{...result,stoppedAfterTenWrong:'yes'}]},{history:[{...result,stoppedAfterTenWrong:true}]}])expect(()=>validateBackup({...exportProgress(p),...change},bank)).toThrow();
 });
});
