import type { Question } from '../types';
import { ruleSections } from './rules';

const numberChoices=['1','2','3','5','6','9','10','12','15','20','24','30','40','50','60','70','80','90','100','110','120','150','200','1000','2000','5000'];
const codes=['A1','A2','A3','B1','B2','C1','C2','C3','C4','C5','C6','D','E','F','M','N','P'];
function choices(answer:string,pool:string[],index:number){
 const others=pool.filter(n=>n!==answer),offset=index%others.length;
 const values=Array.from({length:3},(_,i)=>others[(offset+i)%others.length]);
 values.splice(index%4,0,answer);
 return values.map((value,i)=>({label:'ABCD'[i],text_en:value,text_zh:value}));
}
// IDs and choice ordering stay stable so saved answers remain valid across reloads.
export const referenceQuestions:Question[]=ruleSections.flatMap(section=>section.groups.flatMap(group=>group.entries.flatMap((entry,index)=>{
 const base={chapter_id:'reference-'+section.id,chapter:'Rules reference / '+section.label_en,type:'single_choice' as const,image:null,difficulty:null,error_rate:null,why_en:section.label_en+' - '+group.label_en+': '+entry.en,explanation_zh:section.label_zh+' - '+group.label_zh+': '+entry.zh};
 if(section.id==='points'){
  const options=choices(group.tag!,['12','9','6','3','1'],index+Number(group.tag));
  return [{...base,id:'reference-'+group.id+'-'+index,question_en:'How many points does this violation carry? '+entry.en,question_zh:'\u8fd9\u79cd\u8fdd\u6cd5\u884c\u4e3a\u4e00\u6b21\u8bb0\u591a\u5c11\u5206\uff1f'+entry.zh,options,answer:options.find(o=>o.text_en===group.tag)!.label}];
 }
 const code=section.id==='licence'?entry.en.match(/^[A-Z][0-9]?\b/)?.[0]:undefined;
 const tokens=code?[code]:[...new Set(entry.en.match(/(?<![A-Za-z0-9])\d+(?![A-Za-z0-9])/g)??[])];
 return tokens.filter(token=>new RegExp('(?<![A-Za-z0-9])'+token+'(?![A-Za-z0-9])').test(entry.zh)).map((token,tokenIndex)=>{
  const pattern=new RegExp('(?<![A-Za-z0-9])'+token+'(?![A-Za-z0-9])','g');
  const options=choices(token,code?codes:numberChoices,index+tokenIndex);
  return {...base,id:'reference-'+group.id+'-'+index+'-'+token,question_en:'Complete the rule: '+entry.en.replace(pattern,'____'),question_zh:'\u586b\u5199\u89c4\u5219\u4e2d\u7684\u7a7a\u767d\uff1a'+entry.zh.replace(pattern,'____'),options,answer:options.find(o=>o.text_en===token)!.label};
 });
})));
