import { test, expect } from '@playwright/test';
import bank from '../public/data/questions_bilingual.json' with { type: 'json' };

test('past-mistake set excludes unanswered questions, survives resume, scores and exports',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#exam');await expect(page.getByLabel('Mock exam question set')).toBeVisible();
 await page.getByLabel('Mock exam question set').selectOption('mistakes');
 await expect(page.getByText('No past mock-test mistakes yet. Complete a mock exam first.')).toBeVisible();
 const questions=bank.slice(0,100),mistakes=questions.slice(0,3);
 const startedAt=new Date(Date.now()-60000).toISOString();
 const result={id:'earlier',startedAt,completedAt:new Date().toISOString(),durationSeconds:60,timeLimitSeconds:null,questionIds:questions.map(q=>q.id),answers:Object.fromEntries(mistakes.map(q=>[q.id,q.options.find(o=>o.label!==q.answer)!.label]))};
 await page.evaluate(result=>localStorage.setItem('subject1.history.v1',JSON.stringify([result])),result);
 await page.reload();await expect(page.getByLabel('Mock exam question set')).toHaveValue('mistakes');
 await expect(page.getByLabel('Mock exam question set')).toContainText('Past mock-test mistakes (3)');
 await expect(page.getByText('3 unique questions - 90% to pass.')).toBeVisible();
 await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await expect(page.locator('.question-grid button')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:'Question 1 / 3'})).toBeVisible();
 let active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));
 expect([...active.questionIds].sort()).toEqual(mistakes.map(q=>q.id).sort());
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();
 for(let i=0;i<3;i++){
  active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));
  const q=bank.find(q=>q.id===active.questionIds[i])!;
  await page.locator('input[value="'+q.answer+'"]').locator('..').click();
  if(i<2)await page.getByRole('button',{name:'Next',exact:true}).click();
 }
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Submit exam',exact:true}).click();
 await expect(page.getByRole('dialog')).toContainText('0 questions are unanswered');
 await page.getByRole('dialog').getByRole('button',{name:'Submit exam',exact:true}).click();
 await expect(page.locator('.result-banner')).toContainText('3 correct');await expect(page.locator('.score-ring strong')).toHaveText('100');
 await page.reload();await page.getByRole('button',{name:'Mock exam',exact:true}).click();
 await expect(page.getByLabel('Mock exam question set')).toContainText('Past mock-test mistakes (3)');
 await page.getByRole('button',{name:'Settings & data',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON',exact:true}).click();const path=await(await download).path();
 await page.locator('input[type=file]').setInputFiles(path!);await page.getByRole('button',{name:'Merge progress',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!).length)).toBe(2);expect(errors).toEqual([]);
});


test('rules-reference mock test uses only reference questions and preserves bilingual review',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#exam');await page.getByLabel('Mock exam question set').selectOption('reference');
 await expect(page.getByLabel('Mock exam question set')).toHaveValue('reference');
 const option=await page.getByLabel('Mock exam question set').locator('option[value=reference]').textContent();
 const count=Math.min(100,Number(option!.match(/\d+/)![0]));
 await page.screenshot({path:'test-results/reference-setup.png',fullPage:true});
 await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await expect(page.locator('.question-grid button')).toHaveCount(count);
 const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));
 expect(active.source).toBe('reference');expect(active.questionIds.every((id:string)=>id.startsWith('reference-'))).toBe(true);
 await page.getByLabel('Question language',{exact:true}).selectOption('both');
 await expect(page.locator('.question-text [lang="zh-CN"]')).toBeVisible();
 await page.locator('.option').first().click();await expect(page.locator('.explanation')).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();
 await expect(page.locator('.question-grid button')).toHaveCount(count);await expect(page.locator('.explanation')).toBeVisible();
 await page.getByRole('button',{name:'Submit exam',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Submit exam',exact:true}).click();
 await expect(page.locator('.section-title')).toContainText('Rules reference - '+count+' questions');
 await page.reload();await expect(page.locator('.history')).toBeVisible();
 await page.locator('.history>button').first().click();await expect(page.locator('.question-card')).toBeVisible();expect(errors).toEqual([]);
});
