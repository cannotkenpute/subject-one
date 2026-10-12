import { describe,it,expect } from 'vitest';
import bankData from '../../public/data/questions_bilingual.json';
import type { ActiveExam, Question } from '../types';
import { applyQuestionScope,isLocalQuestion,nationalQuestions } from './questionScope';
import { finishExam,generateExam } from './domain';
import { defaults,exportProgress,validateBackup } from './storage';

const bank=bankData as unknown as Question[];
const eligible=nationalQuestions(bank),local=bank.filter(isLocalQuestion);

describe('national question scope',()=>{
 it('excludes city rules, named streets and regional-only procedures, including explanation-only references',()=>{
  for(const id of ['2019041010280753ajeavym7bahhvw4xxrmd','201904101028109mvnfw27hlkgjk9wvg9j65','20220620184655bvrzdppd6qg6qhkbwvcivy','20220620184655lchsjbcvmbbj1pk4jzcisn','202207050945403zxhdpbkyst7nf8mq656hd','20220705094540tgkwxuncj7xvawcnesg48l','20190410102811d3nnxadux4dxj5sv8m6w4w'])expect(isLocalQuestion(bank.find(q=>q.id===id)!),id).toBe(true);
  expect(local.length).toBe(148);expect(eligible.length).toBe(2397);
  expect(generateExam(eligible)).toHaveLength(100);expect(generateExam(eligible).every(q=>!isLocalQuestion(q))).toBe(true);
 });
 it('retains general urban-road, speed-limit, sign, parking and local-authority questions',()=>{
  for(const id of ['20190410102520esdzgk35fyn6jltog11yjg','201904101025364om5pbc7d3unmxpkwkpwan','20190410102554vsm5gb8qwnxuyhhyowtgzq','20190410102810gbfeyspjoqp8hmf6qov2bw'])expect(isLocalQuestion(bank.find(q=>q.id===id)!),id).toBe(false);
  expect(isLocalQuestion({...eligible[0],question_en:'Ask the local traffic police; follow signs on an urban road.',question_zh:'遵守城市道路的交通标志。',why_en:'The Road Traffic Safety Law applies nationally.',explanation_zh:'遵守当地交通标志。',options:eligible[0].options})).toBe(false);
 });
 it('replaces excluded questions in saved exams without losing retained answers or completed history',()=>{
  const kept=eligible.slice(0,98),removed=local.slice(0,2);
  const exam:ActiveExam={id:'scoped-exam',startedAt:new Date().toISOString(),durationSeconds:null,immediate:true,questionIds:[...removed,...kept].map(q=>q.id),answers:{[removed[0].id]:removed[0].answer,[kept[0].id]:kept[0].answer},currentIndex:25,flaggedIds:[removed[0].id,kept[0].id]};
  const result=finishExam(exam,bank);
  const progress={...defaults(),activeExam:exam,history:[result],wrongQuestionIds:[removed[0].id,kept[0].id],bookmarkedQuestionIds:[removed[0].id,kept[0].id],streaks:{[removed[0].id]:1,[kept[0].id]:1}};
  const scoped=applyQuestionScope(progress,bank);
  expect(scoped.activeExam).toMatchObject({id:exam.id,startedAt:exam.startedAt,durationSeconds:null,immediate:true,currentIndex:25,answers:{[kept[0].id]:kept[0].answer},flaggedIds:[kept[0].id]});
  expect(scoped.activeExam!.questionIds).toHaveLength(100);expect(new Set(scoped.activeExam!.questionIds).size).toBe(100);expect(scoped.activeExam!.questionIds.every(id=>eligible.some(q=>q.id===id))).toBe(true);expect(scoped.activeExam!.questionIds.slice(2)).toEqual(kept.map(q=>q.id));
  expect(scoped.history).toBe(progress.history);expect(scoped.wrongQuestionIds).toEqual([kept[0].id]);expect(scoped.bookmarkedQuestionIds).toEqual([kept[0].id]);expect(scoped.streaks).toEqual({[kept[0].id]:1});
  expect(progress.activeExam).toBe(exam);expect(exam.answers[removed[0].id]).toBe(removed[0].answer);
  expect(validateBackup(exportProgress(scoped),bank).history[0].score).toBe(result.score);
  expect(applyQuestionScope(scoped,bank).activeExam).toBe(scoped.activeExam);
 });
});
