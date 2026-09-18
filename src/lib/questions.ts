import type { Question } from '../types';
export const publicAsset=(path:string,base=import.meta.env.BASE_URL)=>`${base}${path.replace(/^\/+/, '')}`;
let cache:Promise<Question[]>|null=null;
export function loadQuestions() { return cache ??= fetch(publicAsset('data/questions_bilingual.json')).then(async r=>{if(!r.ok) throw Error('The question bank could not be loaded. Check your connection and try again.'); const data=await r.json(); if(!Array.isArray(data)||!data.length) throw Error('The question bank is empty.'); return data.map(q=>({...q,image:q.image?publicAsset(q.image):null,difficulty:q.difficulty==null?null:Number(q.difficulty),error_rate:q.error_rate==null?null:Number(q.error_rate)}));}).catch(e=>{cache=null;throw e;}); }
