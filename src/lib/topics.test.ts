import { describe,it,expect } from 'vitest';
import bankData from '../../public/data/questions_bilingual.json';
import type { Question } from '../types';
import { topics,topicsOf,indexTopics,topicCounts } from './topics';
const bank=bankData as unknown as Question[];
const index=indexTopics(bank);
const counts=topicCounts(bank,index);
describe('sub-topic tags',()=>{
 it('gives every topic a unique id, label and a usable share of the bank',()=>{
  expect(new Set(topics.map(t=>t.id)).size).toBe(topics.length);
  expect(topics.every(t=>t.en&&t.zh)).toBe(true);
  for(const t of topics){
   expect(counts[t.id],`${t.id} is too small to be worth offering`).toBeGreaterThan(25);
   expect(counts[t.id],`${t.id} matches so much of the bank that it filters nothing`).toBeLessThan(bank.length*0.4);
  }
 });
 it('tags almost every question, in taxonomy order',()=>{
  const tagged=bank.filter(q=>(index.get(q.id)??[]).length>0);
  expect(tagged.length/bank.length).toBeGreaterThan(0.95);
  expect(index.size).toBe(new Set(bank.map(q=>q.id)).size);
  const order=topics.map(t=>t.id);
  const sample=bank.find(q=>topicsOf(q).length>2)!;
  expect(topicsOf(sample)).toEqual([...topicsOf(sample)].sort((a,b)=>order.indexOf(a)-order.indexOf(b)));
 });
 it('matches the Chinese source text, not the English study translation',()=>{
  const q=bank.find(q=>topicsOf(q).includes('alcohol'))!;
  expect(`${q.question_zh} ${q.options.map(o=>o.text_zh).join(' ')} ${q.explanation_zh??''}`).toMatch(/饮酒|醉酒|酒后|酒精|毒品|麻醉药品|精神药品/);
  expect(topicsOf({...q,question_zh:'',options:q.options.map(o=>({...o,text_zh:''})),explanation_zh:''})).toEqual([]);
 });
 it('counts only the questions it is given',()=>{
  const subset=bank.filter(q=>topicsOf(q).includes('motorcycle'));
  const subsetCounts=topicCounts(subset,index);
  expect(subsetCounts.motorcycle).toBe(subset.length);
  expect(subsetCounts.motorcycle).toBeLessThanOrEqual(counts.motorcycle);
 });
});
