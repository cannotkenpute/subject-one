import { readFile, access } from 'node:fs/promises';
const questions = JSON.parse(await readFile('public/data/questions_bilingual.json','utf8'));
if (!Array.isArray(questions) || !questions.length) throw Error('Empty question bank');
const ids = new Set(); let images = 0;
for (const q of questions) {
 if (!q.id || ids.has(q.id)) throw Error(`Invalid or duplicate ID: ${q.id}`);
 ids.add(q.id);
 if (!q.question_en || !Array.isArray(q.options) || !['judgement','single_choice'].includes(q.type)) throw Error(`Invalid question ${q.id}`);
 const labels = q.options.map(o=>o.label);
 if (new Set(labels).size!==labels.length || !labels.includes(q.answer) || q.options.some(o=>!o.text_en)) throw Error(`Invalid options ${q.id}`);
 if (q.type==='judgement' && (labels.join('')!=='AB' || q.options.length!==2)) throw Error(`Invalid judgement ${q.id}`);
 if (q.type==='single_choice' && (q.options.length<2 || q.options.length>4)) throw Error(`Invalid single choice ${q.id}`);
 if(q.image) { if(!/^images\/[\w-]+\.jpg$/.test(q.image)) throw Error('Unsafe image path'); await access(`public/${q.image}`); images++; }
}
console.log(`Validated ${ids.size} unique questions and ${images} image files.`);
