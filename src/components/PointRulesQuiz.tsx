import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, Target, X } from 'lucide-react';
import type { Settings } from '../types';
import { createPointQuiz, pointGroups, pointRules } from '../lib/pointQuiz';
import type { PointQuizQuestion } from '../lib/pointQuiz';
import { shuffle } from '../lib/domain';
import { Bilingual } from './QuestionCard';

interface Session { questions:PointQuizQuestion[]; answers:Record<string,string>; index:number; complete:boolean }
export default function PointRulesQuiz({settings,initialGroup='all'}:{settings:Settings;initialGroup?:string}) {
 const [groupId,setGroupId]=useState(initialGroup);
 const [session,setSession]=useState<Session|null>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const visibleGroups=pointGroups.filter(g=>groupId==='all'||g.id===groupId);
 const question=session?.questions[session.index];
 const selected=question?session?.answers[question.id]:undefined;
 const correct=session?.questions.filter(q=>session.answers[q.id]===q.answerId).length??0;
 const missed=session?.questions.filter(q=>session.answers[q.id]!==q.answerId)??[];
 useEffect(()=>{if(session)heading.current?.focus();},[question?.id,session?.complete]);
 const start=(questions=createPointQuiz(groupId))=>setSession({questions,answers:{},index:0,complete:false});
 const answer=(id:string)=>setSession(s=>{
  if(!s||s.complete)return s;
  const q=s.questions[s.index];
  if(s.answers[q.id]!==undefined||!q.choices.some(choice=>choice.id===id))return s;
  return {...s,answers:{...s.answers,[q.id]:id}};
 });
 const next=()=>setSession(s=>{
  if(!s||s.answers[s.questions[s.index].id]===undefined)return s;
  return s.index===s.questions.length-1?{...s,complete:true}:{...s,index:s.index+1};
 });
 const read=()=>setSession(null);
 return <>
  <div className="page-heading"><span className="eyebrow">READ & RECALL · 记分复习</span><h1>Know your point deductions.</h1><p>Review a point level, then quiz yourself on its violations. Mix all levels to practise recalling the deduction.</p></div>
  {!session?<>
   <div className="rule-chips" aria-label="Point levels"><button aria-pressed={groupId==='all'} className={groupId==='all'?'active':''} onClick={()=>setGroupId('all')}>All point levels</button>{pointGroups.map(g=><button key={g.id} aria-pressed={groupId===g.id} className={groupId===g.id?'active':''} onClick={()=>setGroupId(g.id)}><Bilingual en={`${g.tag} ${g.tag==='1'?'point':'points'}`} zh={`${g.tag}分`} language={settings.language}/></button>)}</div>
   <section className="panel point-quiz-intro"><div><span className="eyebrow">YOUR REVIEW SET</span><h2>{visibleGroups.reduce((n,g)=>n+g.entries.length,0)} rules to review</h2><p>{groupId==='all'?'The quiz mixes point levels and asks how many points each violation carries.':'The quiz asks you to identify violations at this point level, with choices from other levels.'} No timer. Answers are checked immediately.</p></div><button className="primary" onClick={()=>start()}><Target size={18}/>Start point quiz · {Math.min(10,visibleGroups.reduce((n,g)=>n+g.entries.length,0))} questions</button></section>
   {visibleGroups.map(g=><section className="panel rule-group" key={g.id}><div className="rule-head"><span className="rule-badge" data-tone={g.tone}>{g.tag}<small>pts</small></span><h2><Bilingual en={g.label_en} zh={g.label_zh} language={settings.language}/></h2></div><ul className="rule-list">{g.entries.map((entry,index)=><li key={`${g.id}-${index}`}><Bilingual en={entry.en} zh={entry.zh} language={settings.language}/></li>)}</ul></section>)}
  </>:session.complete?<>
   <section className="panel point-quiz-summary"><Check size={36}/><h2 ref={heading} tabIndex={-1}>Point quiz complete.</h2><strong className="point-quiz-score">{correct} / {session.questions.length}</strong><p>{missed.length?`${missed.length} ${missed.length===1?'rule needs':'rules need'} another look. Review them below, then try again.`:'You recalled every rule in this set correctly.'}</p><div className="button-row">{missed.length>0&&<button className="primary" onClick={()=>start(shuffle(missed))}><RotateCcw size={17}/>Retry missed rules</button>}<button onClick={()=>start()}><Target size={17}/>New point quiz</button><button onClick={read}><BookOpen size={17}/>Review point rules</button></div></section>
   {missed.length>0&&<section className="point-quiz-mistakes"><h2>Rules to revisit</h2>{missed.map(q=><article className="panel rule-group" key={q.id}><div className="rule-head"><span className="rule-badge" data-tone="high">{q.rule.points}<small>pts</small></span><h3><Bilingual en={q.rule.en} zh={q.rule.zh} language={settings.language}/></h3></div><p className="point-quiz-your-answer">Your answer: <Bilingual en={q.choices.find(c=>c.id===session.answers[q.id])!.en} zh={q.choices.find(c=>c.id===session.answers[q.id])!.zh} language={settings.language}/></p></article>)}</section>}
  </>:question&&<>
   <div className="section-title"><h2>Question {session.index+1} / {session.questions.length}</h2><div className="button-row"><span className="point-quiz-tally">{correct} correct · {Object.keys(session.answers).length-correct} wrong</span><button onClick={read}><ArrowLeft size={16}/>Back to point rules</button></div></div>
   <progress className="point-quiz-progress" aria-label="Point quiz progress" max={session.questions.length} value={Object.keys(session.answers).length}/>
   <article className="question-card point-quiz-question" data-rule-id={question.rule.id}>
    <h2 className="question-text" ref={heading} tabIndex={-1}><Bilingual en={question.prompt.en} zh={question.prompt.zh} language={settings.language}/></h2>
    {question.kind==='deduction'&&<p className="point-quiz-violation"><Bilingual en={question.rule.en} zh={question.rule.zh} language={settings.language}/></p>}
    <div className={`point-quiz-choices ${question.kind==='deduction'?'numeric':''}`} aria-label="Choose a point-rule answer">{question.choices.map(choice=>{
     const revealed=selected!==undefined,isCorrect=choice.id===question.answerId,isSelected=choice.id===selected;
     return <button key={choice.id} data-choice-id={choice.id} className={`point-quiz-choice ${revealed&&isCorrect?'correct':''} ${revealed&&isSelected&&!isCorrect?'incorrect':''}`} aria-pressed={isSelected} disabled={revealed} onClick={()=>answer(choice.id)}><span><Bilingual en={choice.en} zh={choice.zh} language={settings.language}/></span>{revealed&&isCorrect&&<Check size={20} aria-label="Correct answer"/>}{revealed&&isSelected&&!isCorrect&&<X size={20} aria-label="Your incorrect answer"/>}</button>;
    })}</div>
    {selected!==undefined&&<div className="explanation" role="status"><strong>{selected===question.answerId?'Correct.':'Incorrect.'} This violation carries {question.rule.points} {question.rule.points===1?'point':'points'}.</strong><p><Bilingual en={question.rule.en} zh={question.rule.zh} language={settings.language}/></p></div>}
   </article>
   <div className="point-quiz-next"><button className="primary" disabled={selected===undefined} onClick={next}>{session.index===session.questions.length-1?'See quiz results':'Next question'}<ArrowRight size={17}/></button></div>
  </>}
  <div className="source-note"><BookOpen size={18}/><span>Based on the {pointRules.length} point-deduction rules in the Rules reference. This quiz is separate from your mock exams and question-bank progress.</span></div>
 </>;
}
