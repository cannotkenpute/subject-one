import { test, expect } from '@playwright/test';
import bank from '../public/data/questions_bilingual.json' with { type: 'json' };
test('exam answers, flags, timer persistence, grading, history, cookie and backup round trip',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Your road to ready.'})).toBeVisible();
 await page.getByLabel('Mock exam time limit').selectOption('45');await page.getByLabel('Mock exam answer feedback').selectOption('submission');
 await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await expect(page.locator('.question-grid button')).toHaveCount(100);
 await expect(page.locator('.timer')).toContainText('45:');
 let active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));
 expect(new Set(active.questionIds).size).toBe(100);
 await page.locator('.option').first().click();await page.getByRole('button',{name:'Flag for review',exact:true}).click();
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.locator('.option').last().click();
 const startedAt=active.startedAt;
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();
 active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));
 expect(active.startedAt).toBe(startedAt);expect(active.currentIndex).toBe(1);expect(Object.keys(active.answers)).toHaveLength(2);expect(active.flaggedIds).toHaveLength(1);
 await expect(page.locator('.explanation')).toHaveCount(0);
 const answers=Object.fromEntries(active.questionIds.slice(0,90).map((id:string)=>[id,bank.find(q=>q.id===id)!.answer]));
 await page.evaluate(answers=>{const e=JSON.parse(localStorage.getItem('subject1.activeExam.v1')!);e.answers=answers;localStorage.setItem('subject1.activeExam.v1',JSON.stringify(e));},answers);
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();
 await page.getByRole('button',{name:'Submit exam',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('10 questions are unanswered');await page.getByRole('dialog').getByRole('button',{name:'Submit exam',exact:true}).click();
 await expect(page.locator('.result-banner')).toContainText('PASS');await expect(page.locator('.score-ring strong')).toHaveText('90');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.wrongQuestions.v1')!).length)).toBe(10);
 expect(await page.evaluate(()=>JSON.parse(decodeURIComponent(document.cookie.split('subject1_results=')[1].split(';')[0])).lastScore)).toBe(90);
 await page.getByLabel('Review filter').selectOption('unanswered');await expect(page.getByText('Unanswered — no point awarded.')).toBeVisible();
 await page.getByRole('button',{name:'Settings & data',exact:true}).click();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON',exact:true}).click();const dl=await downloadPromise;const path=await dl.path();expect(path).toBeTruthy();
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"bad"}')});await expect(page.getByRole('status')).toContainText('Invalid backup');
 await page.locator('input[type=file]').setInputFiles(path!);await page.getByRole('button',{name:'Merge progress',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!).length)).toBe(1);
 await page.getByRole('button',{name:'Clear progress',exact:true}).click();await page.getByRole('button',{name:'Clear all progress',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!).length)).toBe(0);
 await page.locator('input[type=file]').setInputFiles(path!);await page.getByRole('button',{name:'Replace existing',exact:true}).click();await page.reload();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!).length)).toBe(1);expect(errors).toEqual([]);
});
test('expired exam automatically submits even from overview',async({page})=>{
 await page.goto('/');await page.getByLabel('Mock exam time limit').selectOption('45');await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await page.evaluate(()=>{const e=JSON.parse(localStorage.getItem('subject1.activeExam.v1')!);e.startedAt=new Date(Date.now()-2800000).toISOString();localStorage.setItem('subject1.activeExam.v1',JSON.stringify(e));});
 await page.goto('/#home');await page.reload();await expect(page.locator('.result-banner')).toContainText('FAIL');await expect(page.locator('.score-ring strong')).toHaveText('0');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!).length)).toBe(1);
});
test('image library, bookmark, bilingual study, wrong-answer practice and mastery',async({page})=>{
 await page.goto('/#study');await expect(page.locator('.question-card')).toBeVisible();
 await expect(page.locator('.image-stage img')).toBeVisible();expect(await page.locator('.image-stage img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Bookmark question',exact:true}).click();await page.getByLabel('Question language', {exact:true}).selectOption('both');await expect(page.locator('[lang="zh-CN"]').first()).toBeVisible();
 await page.getByRole('button',{name:'Bookmarks',exact:true}).click();await expect(page.getByRole('heading',{name:'1 questions',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Practice this set',exact:true}).click();const first=bank[0];const wrong=first.options.find(o=>o.label!==first.answer)!;
 await page.locator(`input[value="${wrong.label}"]`).locator('..').click();await expect(page.locator('.explanation')).toContainText('Incorrect answer');
 await page.getByRole('button',{name:/Wrong answers/}).click();await expect(page.getByRole('heading',{name:'1 questions',exact:true})).toBeVisible();
 for(let i=0;i<2;i++){await page.getByRole('button',{name:'Practice this set',exact:true}).click();await page.locator(`input[value="${first.answer}"]`).locator('..').click();await expect(page.locator('.explanation')).toContainText('Correct answer');await page.getByRole('button',{name:'Back to filters',exact:true}).click();}
 await expect(page.getByRole('heading',{name:'No wrong answers to review.'})).toBeVisible();
 await page.getByRole('button',{name:'Question library',exact:true}).click();await page.getByLabel('Search questions').fill('zzzz-no-matches-zzzz');await expect(page.getByRole('heading',{name:'No questions match your filters.'})).toBeVisible();
});
for(const width of [360,768,1280])test(`responsive layout at ${width}px`,async({page})=>{await page.setViewportSize({width,height:1000});await page.goto('/');await expect(page.getByRole('heading',{name:'Your road to ready.'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});await page.getByRole('button',{name:'Start mock exam',exact:true}).click();await expect(page.locator('.question-card')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`test-results/exam-${width}.png`,fullPage:true});});

test('untimed mock exam gives instant feedback, locks first answers and survives reload after 45 minutes',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByLabel('Mock exam time limit')).toHaveValue('0');await expect(page.getByLabel('Mock exam answer feedback')).toHaveValue('instant');
 await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await expect(page.locator('.question-grid button')).toHaveCount(100);await expect(page.locator('.timer')).toHaveText('No time limit');await expect(page.locator('.explanation')).toHaveCount(0);
 const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));const first=bank.find(q=>q.id===active.questionIds[0])!;const wrong=first.options.find(o=>o.label!==first.answer)!;
 await page.locator('input[value="'+wrong.label+'"]').locator('..').click();await expect(page.locator('.explanation')).toContainText('Incorrect answer · '+first.answer);await expect(page.locator('.option.correct')).toContainText('Correct');await expect(page.locator('.wrong-answer-meter')).toContainText('1 / 10');await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(1);
 for(const input of await page.locator('.options input').all())await expect(input).toBeDisabled();
 await page.locator('main').focus();await page.keyboard.press(first.answer);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!).answers)).toEqual({[first.id]:wrong.label});
 await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.locator('.explanation')).toHaveCount(0);
 const second=bank.find(q=>q.id===active.questionIds[1])!;await page.locator('input[value="'+second.answer+'"]').locator('..').click();await expect(page.locator('.explanation')).toContainText('Correct answer · '+second.answer);await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(1);
 await page.evaluate(()=>{const e=JSON.parse(localStorage.getItem('subject1.activeExam.v1')!);e.startedAt=new Date(Date.now()-7200000).toISOString();localStorage.setItem('subject1.activeExam.v1',JSON.stringify(e));});
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();await expect(page.locator('.timer')).toHaveText('No time limit');await expect(page.locator('.explanation')).toContainText('Correct answer');await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(1);
 await page.getByRole('button',{name:'Previous',exact:true}).click();await expect(page.locator('.explanation')).toContainText('Incorrect answer');
 await page.getByRole('button',{name:'Submit exam',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Submit exam',exact:true}).click();await expect(page.locator('.score-ring strong')).toHaveText('1');
 const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.history.v1')!));expect(history[0]).toMatchObject({correct:1,incorrect:1,unanswered:98,timeLimitSeconds:null,immediate:true});expect(history[0].durationSeconds).toBeGreaterThanOrEqual(7200);
 await page.reload();await page.getByRole('button',{name:'Results',exact:true}).click();await expect(page.locator('.history>button')).toHaveCount(1);expect(errors).toEqual([]);
});

test('local questions are absent from study and saved exams while historical scores remain',async({page})=>{
 await page.goto('/');await expect(page.getByText('2,397 national practice questions')).toBeVisible();
 const removed=bank.find(q=>q.id==='201904101028109mvnfw27hlkgjk9wvg9j65')!;const kept=bank.slice(0,99);
 const startedAt=new Date().toISOString();const legacy={id:'old-scope-exam',startedAt,durationSeconds:null,immediate:true,questionIds:[removed.id,...kept.map(q=>q.id)],answers:{[removed.id]:removed.answer,[kept[0].id]:kept[0].answer},currentIndex:0,flaggedIds:[removed.id,kept[0].id]};
 const history={id:'old-scope-result',startedAt,completedAt:startedAt,durationSeconds:0,timeLimitSeconds:null,questionIds:legacy.questionIds,answers:legacy.answers};
 await page.evaluate(({legacy,history,removed,kept})=>{localStorage.setItem('subject1.activeExam.v1',JSON.stringify(legacy));localStorage.setItem('subject1.history.v1',JSON.stringify([history]));localStorage.setItem('subject1.bookmarks.v1',JSON.stringify([removed.id,kept[0].id]));localStorage.setItem('subject1.wrongQuestions.v1',JSON.stringify([removed.id,kept[0].id]));},{legacy,history,removed,kept});
 await page.reload();await expect(page.getByRole('status')).toContainText('City-specific questions');
 const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));expect(active.questionIds).toHaveLength(100);expect(new Set(active.questionIds).size).toBe(100);expect(active.questionIds).not.toContain(removed.id);expect(active.answers).toEqual({[kept[0].id]:kept[0].answer});expect(active.flaggedIds).toEqual([kept[0].id]);
 await page.getByRole('button',{name:'Resume exam',exact:true}).click();await expect(page.locator('.question-grid button')).toHaveCount(100);await expect(page.locator('.timer')).toHaveText('No time limit');
 await page.getByRole('button',{name:'Question library',exact:true}).click();await page.getByLabel('Search questions').fill('槐荫区');await expect(page.getByRole('heading',{name:'No questions match your filters.'})).toBeVisible();
 await page.getByLabel('Search questions').fill('经十路');await expect(page.getByRole('heading',{name:'No questions match your filters.'})).toBeVisible();
 await page.getByRole('button',{name:'Bookmarks',exact:true}).click();await expect(page.getByRole('heading',{name:'1 questions',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Results',exact:true}).click();await page.locator('.history>button').click();await expect(page.locator('.score-ring strong')).toHaveText('2');await expect(page.getByText('City-specific questions are hidden from this review. Your original score is preserved.')).toBeVisible();
 await page.getByLabel('Review filter').selectOption('all');await expect(page.locator('.pagination>span')).toHaveText('1 / 99');
});

for(const feedback of ['instant','submission'])test('auto-stop saves the tenth wrong answer with '+feedback+' feedback',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByLabel('Stop automatically at 10 wrong answers')).toBeChecked();if(feedback==='instant')await page.setViewportSize({width:360,height:900});await page.getByLabel('Mock exam answer feedback').selectOption(feedback);
 await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 const active=await page.evaluate(()=>JSON.parse(localStorage.getItem('subject1.activeExam.v1')!));expect(active.stopAfterTenWrong).toBe(true);await expect(page.locator('.wrong-answer-slots>span')).toHaveCount(10);await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(0);await expect(page.locator('.wrong-answer-meter')).toContainText('0 / 10');
 for(let i=0;i<10;i++){
  const q=bank.find(q=>q.id===active.questionIds[i])!,wrong=q.options.find(o=>o.label!==q.answer)!;
  if(i===9){await page.locator('main').focus();await page.keyboard.press(wrong.label);}else await page.locator('input[value="'+wrong.label+'"]').locator('..').click();
  if(i<9){await expect(page.locator('.result-banner')).toHaveCount(0);await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(i+1);await expect(page.locator('.wrong-answer-meter')).toContainText((i+1)+' / 10');if(i===2&&feedback==='instant'){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.exam-toolbar').screenshot({path:'test-results/wrong-meter-three-mobile.png'});}await page.getByRole('button',{name:'Next',exact:true}).click();}
 }
 await expect(page.locator('.result-banner')).toContainText('Stopped automatically after 10 wrong answers.');await expect(page.locator('.result-banner')).toContainText('10 incorrect · 90 unanswered');await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(10);await expect(page.locator('.wrong-answer-meter')).toContainText('10 / 10');
 const saved=await page.evaluate(()=>({active:JSON.parse(localStorage.getItem('subject1.activeExam.v1')!),history:JSON.parse(localStorage.getItem('subject1.history.v1')!),wrong:JSON.parse(localStorage.getItem('subject1.wrongQuestions.v1')!)}));
 expect(saved.active).toBeNull();expect(saved.history).toHaveLength(1);expect(saved.history[0].stoppedAfterTenWrong).toBe(true);expect(Object.keys(saved.history[0].answers)).toHaveLength(10);expect(saved.wrong).toHaveLength(10);
 await page.reload();await page.locator('.history>button').click();await expect(page.locator('.result-banner')).toContainText('Stopped automatically after 10 wrong answers.');await expect(page.locator('.wrong-answer-slots>.filled')).toHaveCount(10);expect(errors).toEqual([]);
});

test('auto-stop can be disabled, resumed and enabled during the current exam',async({page})=>{
 await page.goto('/');await page.getByLabel('Stop automatically at 10 wrong answers').uncheck();await page.getByRole('button',{name:'Start mock exam',exact:true}).click();
 await page.evaluate(bank=>{const e=JSON.parse(localStorage.getItem('subject1.activeExam.v1')!);e.answers=Object.fromEntries(e.questionIds.slice(0,10).map((id:string)=>{const q=bank.find(q=>q.id===id)!;return [id,q.options.find(o=>o.label!==q.answer)!.label];}));localStorage.setItem('subject1.activeExam.v1',JSON.stringify(e));},bank);
 await page.reload();await page.getByRole('button',{name:'Resume exam',exact:true}).click();await expect(page.locator('.result-banner')).toHaveCount(0);await expect(page.getByLabel('Stop automatically at 10 wrong answers')).not.toBeChecked();
 await page.getByLabel('Stop automatically at 10 wrong answers').click();await expect(page.locator('.result-banner')).toContainText('Stopped automatically after 10 wrong answers.');
});
