import { ruleSections } from './rules';
import { shuffle } from './domain';
import type { RuleEntry } from './rules';

export const pointValues=[12,9,6,3,1] as const;
export const pointGroups=ruleSections.find(s=>s.id==='points')!.groups;
export interface PointRule extends RuleEntry { id:string; groupId:string; points:number }
export interface PointQuizChoice extends RuleEntry { id:string }
export interface PointQuizQuestion {
 id:string;
 rule:PointRule;
 kind:'deduction'|'violation';
 prompt:RuleEntry;
 choices:PointQuizChoice[];
 answerId:string;
}
export const pointRules:PointRule[]=pointGroups.flatMap(g=>g.entries.map((entry,index)=>({...entry,id:`${g.id}-${index}`,groupId:g.id,points:Number(g.tag)})));

export function createPointQuiz(groupId='all',count=10):PointQuizQuestion[] {
 const pool=pointRules.filter(r=>groupId==='all'||r.groupId===groupId);
 if(!pool.length||count<1)return [];
 let chosen:PointRule[];
 if(groupId==='all'){
  // Include each available point level before filling the remaining slots.
  const representatives=shuffle(pointValues.flatMap(points=>{
   const group=pool.filter(r=>r.points===points);
   return group.length?[shuffle(group)[0]]:[];
  })).slice(0,count);
  const ids=new Set(representatives.map(r=>r.id));
  chosen=shuffle([...representatives,...shuffle(pool.filter(r=>!ids.has(r.id))).slice(0,Math.max(0,count-representatives.length))]);
 }else chosen=shuffle(pool).slice(0,count);
 return chosen.map(rule=>{
  if(groupId==='all')return {
   id:rule.id,rule,kind:'deduction',prompt:{en:'How many points does this violation carry?',zh:'这种违法行为一次记多少分？'},
   choices:pointValues.map(points=>({id:String(points),en:`${points} ${points===1?'point':'points'}`,zh:`${points}分`})),answerId:String(rule.points),
  };
  const distractors=shuffle(pointRules.filter(r=>r.points!==rule.points)).slice(0,3);
  return {id:rule.id,rule,kind:'violation',prompt:{en:`Which violation carries ${rule.points} ${rule.points===1?'point':'points'}?`,zh:`下列哪种违法行为一次记${rule.points}分？`},choices:shuffle([rule,...distractors]).map(r=>({id:r.id,en:r.en,zh:r.zh})),answerId:rule.id};
 });
}
