import { test,expect } from '@playwright/test';
import { pointRules } from '../src/lib/pointQuiz';

test('review a specific point group, complete a quiz and retry missed rules without altering exam progress',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#rules');await page.getByRole('button',{name:'Quiz these 9-point rules',exact:true}).click();
 await expect(page).toHaveURL(/#point-quiz$/);await expect(page.getByRole('button',{name:'9 points',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('heading',{name:'7 rules to review'})).toBeVisible();
 const saved=await page.evaluate(()=>({...localStorage}));
 await page.getByRole('button',{name:'Start point quiz · 7 questions',exact:true}).click();
 let missedId='';
 for(let i=0;i<7;i++){
  await expect(page.getByRole('heading',{name:`Question ${i+1} / 7`,exact:true})).toBeVisible();const ruleId=await page.locator('.point-quiz-question').getAttribute('data-rule-id');
  expect(pointRules.find(r=>r.id===ruleId)!.points).toBe(9);
  const advance=page.getByRole('button',{name:i===6?'See quiz results':'Next question',exact:true});await expect(advance).toBeDisabled();
  const choice=i===0?page.locator(`.point-quiz-choice:not([data-choice-id="${ruleId}"])`).first():page.locator(`.point-quiz-choice[data-choice-id="${ruleId}"]`);
  if(i===0)missedId=ruleId!;
  await choice.click();await expect(page.locator('.explanation')).toContainText(i===0?'Incorrect.':'Correct.');
  for(const button of await page.locator('.point-quiz-choice').all())await expect(button).toBeDisabled();
  await advance.click();
 }
 await expect(page.getByRole('heading',{name:'Point quiz complete.',exact:true})).toBeVisible();await expect(page.locator('.point-quiz-score')).toHaveText('6 / 7');await expect(page.locator('.point-quiz-mistakes article')).toHaveCount(1);
 await page.getByRole('button',{name:'Retry missed rules',exact:true}).click();await expect(page.getByRole('heading',{name:'Question 1 / 1'})).toBeVisible();await expect(page.locator('.point-quiz-question')).toHaveAttribute('data-rule-id',missedId);
 await page.locator(`.point-quiz-choice[data-choice-id="${missedId}"]`).click();await page.getByRole('button',{name:'See quiz results'}).click();await expect(page.locator('.point-quiz-score')).toHaveText('1 / 1');await expect(page.getByRole('button',{name:'Retry missed rules'})).toHaveCount(0);
 expect(await page.evaluate(()=>({...localStorage}))).toEqual(saved);expect(errors).toEqual([]);
});

test('mixed quiz, bilingual rendering, keyboard answers and mobile layout',async({page})=>{
 await page.setViewportSize({width:360,height:900});await page.goto('/#point-quiz');await expect(page.getByRole('heading',{name:'50 rules to review'})).toBeVisible();
 await page.getByRole('combobox',{name:'Question language',exact:true}).selectOption('both');await expect(page.locator('[lang="zh-CN"]').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/point-review-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Start point quiz · 10 questions'}).click();await expect(page.locator('.point-quiz-choice')).toHaveCount(5);
 const ruleId=await page.locator('.point-quiz-question').getAttribute('data-rule-id'),rule=pointRules.find(r=>r.id===ruleId)!;
 const correct=page.locator(`.point-quiz-choice[data-choice-id="${rule.points}"]`);await correct.focus();await page.keyboard.press('Enter');await expect(page.locator('.explanation')).toContainText('Correct.');await expect(page.locator('.point-quiz-tally')).toHaveText('1 correct · 0 wrong');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/point-quiz-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Next question'}).click();await expect(page.locator('.explanation')).toHaveCount(0);await expect(page.locator('.point-quiz-progress')).toHaveAttribute('value','1');
 await page.getByRole('button',{name:'Back to point rules'}).click();await expect(page.getByRole('heading',{name:'50 rules to review'})).toBeVisible();
});
