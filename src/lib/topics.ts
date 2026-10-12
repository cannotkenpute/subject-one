import type { Question } from '../types';

/**
 * Sub-topics are not part of the question bank — the source data only carries the seven official
 * chapters. These tags are derived here by matching the Chinese question, option and explanation
 * text, which is the authoritative wording; the English translations are study renderings and are
 * not matched against. A question can carry several tags, so the counts below overlap and a tag is
 * a filter rather than a category. See docs/RULES-SOURCES.md for the project's provenance notes.
 */
export interface Topic { id:string; en:string; zh:string; match:RegExp }

export const topics:Topic[]=[
 {id:'signs',en:'Traffic signs',zh:'交通标志',match:/标志(?!线)|标牌/},
 {id:'markings',en:'Road markings',zh:'路面标线',match:/标线|虚线|实线|黄线|白线|导向箭头|网状线|减速带/},
 {id:'lights',en:'Signal lights',zh:'交通信号灯',match:/信号灯|红灯|绿灯|黄灯|红色信号|绿色信号|箭头信号|闪光警告/},
 {id:'handsignals',en:'Police hand signals',zh:'交警手势',match:/手势|交通警察.{0,4}指挥|指挥信号/},
 {id:'points',en:'Points and penalties',zh:'记分与处罚',match:/记分|扣分|罚款|吊销|暂扣|拘留|处罚|追究.{0,4}刑事责任|终生/},
 {id:'alcohol',en:'Alcohol and drugs',zh:'酒驾与药驾',match:/饮酒|醉酒|酒后|酒精|毒品|麻醉药品|精神药品/},
 {id:'licence',en:'Licence and paperwork',zh:'证件与手续',match:/驾驶证|行驶证|准驾车型|号牌|检验|保险|实习期|审验|换证|登记|资格/},
 {id:'speed',en:'Speed and following distance',zh:'速度与车距',match:/时速|限速|车速|行驶速度|车距|安全距离|跟车/},
 {id:'expressway',en:'Expressway driving',zh:'高速公路',match:/高速公路|快速路|匝道|应急车道|收费站|服务区|加速车道|减速车道/},
 {id:'junctions',en:'Junctions and giving way',zh:'路口与让行',match:/路口|让行|避让|先行|环形|让.{0,2}先行|优先通行/},
 {id:'lanes',en:'Lanes, overtaking and turning',zh:'车道、超车与转弯',match:/车道|超车|变更车道|借道|掉头|倒车|逆行|转弯|并线/},
 {id:'parking',en:'Stopping and parking',zh:'停车与停放',match:/停车|停放|泊车|临时停靠/},
 {id:'visibility',en:'Night, weather and lights',zh:'夜间、天气与灯光',match:/夜间|雾|雨天|雪|冰雪|沙尘|大风|能见度|灯光|远光|近光|示廓灯|雾灯|危险报警闪光灯/},
 {id:'vulnerable',en:'Pedestrians and vulnerable users',zh:'行人与弱势道路使用者',match:/行人|人行横道|儿童|学生|校车|非机动车|自行车|老年人|残疾人|盲人/},
 {id:'hazards',en:'Difficult roads and breakdowns',zh:'复杂路段与险情',match:/铁路道口|隧道|桥|陡坡|坡道|上坡|下坡|弯道|窄路|山区|泥泞|涉水|爆胎|制动失灵|转向失控|侧滑|翻车|自燃|失火/},
 {id:'crash',en:'Crashes and first aid',zh:'事故处理与急救',match:/事故|逃逸|保护现场|急救|伤员|止血|包扎|骨折|抢救|报警|122/},
 {id:'vehicle',en:'Vehicle checks and controls',zh:'车辆检查与操作',match:/轮胎|制动器|制动踏板|转向盘|离合器|换挡|挡位|空挡|仪表|安全带|头枕|后视镜|机油|冷却|发动机|车况/},
 {id:'loads',en:'Passengers, loads and towing',zh:'载人、载物与牵引',match:/载客|载物|载人|超载|核定人数|核定载质量|货物|牵引|挂车|危险物品|运输/},
 {id:'motorcycle',en:'Motorcycles',zh:'摩托车',match:/摩托车|头盔|轻便摩托/},
 {id:'civil',en:'Driving habits and courtesy',zh:'驾驶习惯与文明',match:/文明|礼让|喇叭|抛.{0,2}物|疲劳|手持电话|接打电话|争道抢行|斗气|陋习|驾驶习惯|道德|谨慎|注意力|车门|观察|起步|平稳/}];

const haystack=(q:Question)=>`${q.question_zh} ${q.options.map(o=>o.text_zh).join(' ')} ${q.explanation_zh??''}`;

/** Topic ids for one question, in taxonomy order. */
export const topicsOf=(q:Question):string[]=>topics.filter(t=>t.match.test(haystack(q))).map(t=>t.id);

/** Question id -> topic ids, built once per bank. */
export function indexTopics(bank:Question[]):Map<string,string[]>{
 return new Map(bank.map(q=>[q.id,topicsOf(q)]));
}

/** How many of the given questions carry each topic, for showing counts beside the options. */
export function topicCounts(questions:Question[],index:Map<string,string[]>):Record<string,number>{
 const counts:Record<string,number>=Object.fromEntries(topics.map(t=>[t.id,0]));
 for(const q of questions)for(const id of index.get(q.id)??[])counts[id]++;
 return counts;
}
