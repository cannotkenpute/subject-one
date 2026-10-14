export interface RuleEntry { en:string; zh:string }
export interface RuleGroup { id:string; tag?:string; tone?:'critical'|'high'|'medium'|'low'|'info'; label_en:string; label_zh:string; note_en?:string; note_zh?:string; entries:RuleEntry[] }
export interface RuleSection { id:string; label_en:string; label_zh:string; summary_en:string; summary_zh:string; groups:RuleGroup[] }

const points:RuleGroup[]=[
 {id:'p12',tag:'12',tone:'critical',label_en:'12 points at once',label_zh:'一次记12分',note_en:'Twelve points fills a cycle on its own: the licence is handed in, and you study and re-sit the theory exam before driving again.',note_zh:'一次记满12分即达到记分周期上限，须参加满分学习并重新考试。',entries:[
  {en:'Driving after drinking (blood alcohol 20 mg/100 ml or more, below 80).',zh:'饮酒后驾驶机动车的。'},
  {en:'Fleeing a crash that caused slight injury (轻伤), more serious injury or death, where it is not yet a crime.',zh:'造成致人轻伤以上的交通事故后逃逸，尚不构成犯罪的。'},
  {en:'Using forged or altered plates, vehicle licence, driving licence or school-bus sign — or using another vehicle’s plates or licence.',zh:'使用伪造、变造的机动车号牌、行驶证、驾驶证、校车标牌，或者使用其他机动车号牌、行驶证的。'},
  {en:'Carrying 20% or more over the approved number of people in a school bus, intercity coach or tourist coach — or 100% or more over in any other passenger vehicle.',zh:'驾驶校车、公路客运汽车、旅游客运汽车载人超过核定人数20%以上，或者驾驶其他载客汽车载人超过核定人数100%以上的。'},
  {en:'On an expressway or urban expressway: exceeding the limit by 20% or more in a school bus, medium-or-larger passenger/goods vehicle or dangerous-goods vehicle — or by 50% or more in any other vehicle.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆在高速公路、城市快速路上行驶超过规定时速20%以上，或者驾驶其他机动车在高速公路、城市快速路上行驶超过规定时速50%以上的。'},
  {en:'Reversing, driving against traffic, or crossing the central divider to turn around on an expressway or urban expressway.',zh:'驾驶机动车在高速公路、城市快速路上倒车、逆行、穿越中央分隔带掉头的。'},
  {en:'Taking another driver’s penalty and points for money.',zh:'代替实际机动车驾驶人接受交通违法行为处罚和记分牟取经济利益的。'}]},
 {id:'p9',tag:'9',tone:'high',label_en:'9 points at once',label_zh:'一次记9分',entries:[
  {en:'Driving a vehicle that does not match the class on your licence.',zh:'驾驶与准驾车型不符的机动车的。'},
  {en:'Driving with no plates fitted, or with the plates deliberately covered or defaced.',zh:'驾驶未悬挂机动车号牌，或者故意遮挡、污损机动车号牌的机动车上道路行驶的。'},
  {en:'Stopping or parking illegally on an expressway or urban expressway.',zh:'驾驶机动车在高速公路或者城市快速路上违法停车的。'},
  {en:'Exceeding the limit by 50% or more in a school bus, medium-or-larger passenger/goods vehicle or dangerous-goods vehicle, on roads other than expressways and urban expressways.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆在高速公路、城市快速路以外的道路上行驶超过规定时速50%以上的。'},
  {en:'Carrying 50% to under 100% over the approved number of people in a passenger vehicle with 7 or more seats.',zh:'驾驶7座以上载客汽车载人超过核定人数50%以上未达到100%的。'},
  {en:'Driving a school bus without a school-bus driving qualification.',zh:'未取得校车驾驶资格驾驶校车的。'},
  {en:'Driving a medium-or-larger passenger vehicle or dangerous-goods vehicle for more than 4 hours without stopping, or stopping for less than 20 minutes.',zh:'连续驾驶中型以上载客汽车、危险物品运输车辆超过4小时未停车休息或者停车休息时间少于20分钟的。'}]},
 {id:'p6',tag:'6',tone:'medium',label_en:'6 points at once',label_zh:'一次记6分',entries:[
  {en:'Ignoring a traffic signal.',zh:'驾驶机动车不按交通信号灯指示通行的。'},
  {en:'Driving while your licence is suspended or held.',zh:'在驾驶证被暂扣、扣留期间驾驶机动车的。'},
  {en:'Fleeing a crash that caused minor injury (轻微伤) or property damage, where it is not yet a crime.',zh:'造成致人轻微伤或者财产损失的交通事故后逃逸，尚不构成犯罪的。'},
  {en:'Driving in the emergency lane of an expressway or urban expressway without cause.',zh:'驾驶机动车在高速公路或者城市快速路上违法占用应急车道行驶的。'},
  {en:'On an expressway or urban expressway: exceeding the limit by under 20% in a school bus, medium-or-larger passenger/goods vehicle or dangerous-goods vehicle; or by 20% to under 50% in any other vehicle.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆在高速公路、城市快速路上行驶超过规定时速未达到20%；驾驶其他机动车在高速公路、城市快速路上行驶超过规定时速20%以上未达到50%的。'},
  {en:'Off the expressway network: exceeding the limit by 20% to under 50% in a school bus, medium-or-larger passenger/goods vehicle or dangerous-goods vehicle; or by 50% or more in any other vehicle.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆在高速公路、城市快速路以外的道路上行驶超过规定时速20%以上未达到50%；驾驶其他机动车在上述道路上行驶超过规定时速50%以上的。'},
  {en:'Carrying under 20% over the approved number in a school bus or coach; 20% to under 50% over in a vehicle with 7 or more seats; or 50% to under 100% over in any other passenger vehicle.',zh:'驾驶校车、公路客运汽车、旅游客运汽车载人超过核定人数未达到20%，或者驾驶7座以上载客汽车载人超过核定人数20%以上未达到50%，或者驾驶其他载客汽车载人超过核定人数50%以上未达到100%的。'},
  {en:'Carrying cargo 50% or more over the maximum permitted total mass in a goods vehicle.',zh:'驾驶载货汽车载物超过最大允许总质量50%以上的。'},
  {en:'Transporting explosives, flammable or explosive chemicals, highly toxic or radioactive goods without following the designated time, route or speed, or without the required warning signs and safety measures.',zh:'驾驶机动车载运爆炸物品、易燃易爆化学物品以及剧毒、放射性等危险物品，未按指定的时间、路线、速度行驶或者未悬挂警示标志并采取必要的安全措施的。'},
  {en:'Transporting an oversized, non-dismantlable load without following the designated time, route or speed, or without warning signs.',zh:'驾驶机动车运载超限的不可解体的物品，未按指定的时间、路线、速度行驶或者未悬挂警示标志的。'},
  {en:'Transporting dangerous chemicals into a restricted area without approval.',zh:'驾驶机动车运输危险化学品，未经批准进入危险化学品运输车辆限制通行的区域的。'}]},
 {id:'p3',tag:'3',tone:'low',label_en:'3 points at once',label_zh:'一次记3分',entries:[
  {en:'Using a hand-held phone or anything else that gets in the way of safe driving.',zh:'驾驶机动车有拨打、接听手持电话等妨碍安全驾驶的行为的。'},
  {en:'Not slowing down, stopping or giving way to pedestrians at a crosswalk.',zh:'驾驶机动车行经人行横道，不按规定减速、停车、避让行人的。'},
  {en:'Overtaking or giving way improperly, or driving against traffic on a road other than an expressway or urban expressway.',zh:'驾驶机动车不按规定超车、让行，或者在高速公路、城市快速路以外的道路上逆行的。'},
  {en:'Cutting into a queue: overtaking via another lane, using the oncoming lane, or squeezing in among waiting vehicles.',zh:'驾驶机动车遇前方机动车停车排队或者缓慢行驶时，借道超车或者占用对面车道、穿插等候车辆的。'},
  {en:'Not keeping to the correct lane on an expressway or urban expressway.',zh:'驾驶机动车在高速公路或者城市快速路上不按规定车道行驶的。'},
  {en:'Driving below the posted minimum speed on an expressway.',zh:'驾驶机动车在高速公路上行驶低于规定最低时速的。'},
  {en:'Exceeding the limit by 20% to under 50% in an ordinary vehicle, on roads other than expressways and urban expressways.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆以外的机动车在高速公路、城市快速路以外的道路上行驶超过规定时速20%以上未达到50%的。'},
  {en:'Carrying 20% to under 50% over the approved number of people in an ordinary passenger vehicle.',zh:'驾驶校车、公路客运汽车、旅游客运汽车、7座以上载客汽车以外的其他载客汽车载人超过核定人数20%以上未达到50%的。'},
  {en:'Carrying cargo 30% to under 50% over the maximum permitted total mass, or carrying passengers in a goods vehicle against the rules.',zh:'驾驶载货汽车载物超过最大允许总质量30%以上未达到50%的，或者违反规定载客的。'},
  {en:'After a breakdown or crash, not using the required lights and not setting out a warning triangle.',zh:'机动车在道路上发生故障、事故停车后，不按规定使用灯光和设置警告标志的。'},
  {en:'Not giving way to a school bus as required.',zh:'驾驶机动车不按规定避让校车的。'},
  {en:'Plates fitted in a way that does not meet the rules.',zh:'机动车号牌安装不符合规定的。'},
  {en:'Driving a coach, tourist coach or dangerous-goods vehicle that has missed its scheduled safety inspection.',zh:'驾驶未按规定定期进行安全技术检验的公路客运汽车、旅游客运汽车、危险物品运输车辆上道路行驶的。'},
  {en:'Driving a goods vehicle for more than 4 hours without stopping, or stopping for less than 20 minutes.',zh:'连续驾驶载货汽车超过4小时未停车休息或者停车休息时间少于20分钟的。'},
  {en:'Driving a school bus without checking its safety condition before setting out, or driving a school bus with safety hazards.',zh:'驾驶校车上道路行驶前，未对校车车况是否符合安全技术要求进行检查，或者驾驶存在安全隐患的校车上道路行驶的。'}]},
 {id:'p1',tag:'1',tone:'info',label_en:'1 point at once',label_zh:'一次记1分',entries:[
  {en:'Not wearing a seat belt as required.',zh:'驾驶机动车未按规定系安全带的。'},
  {en:'Riding a motorcycle without a helmet.',zh:'驾驶摩托车未按规定戴安全头盔的。'},
  {en:'Using lights improperly.',zh:'驾驶机动车不按规定使用灯光的。'},
  {en:'Disobeying a prohibitory sign or prohibitory marking.',zh:'驾驶机动车违反禁令标志、禁止标线指示的。'},
  {en:'Passing oncoming traffic improperly, or reversing or turning around improperly on a road other than an expressway or urban expressway.',zh:'驾驶机动车不按规定会车，或者在高速公路、城市快速路以外的道路上不按规定倒车、掉头的。'},
  {en:'Exceeding the limit by 10% to under 20% in a school bus, medium-or-larger passenger/goods vehicle or dangerous-goods vehicle, off the expressway network.',zh:'驾驶校车、中型以上载客载货汽车、危险物品运输车辆在高速公路、城市快速路以外的道路上行驶超过规定时速10%以上未达到20%的。'},
  {en:'Carrying cargo that is over the permitted length, width or height.',zh:'驾驶机动车载货长度、宽度、高度超过规定的。'},
  {en:'Carrying cargo under 30% over the maximum permitted total mass.',zh:'驾驶载货汽车载物超过最大允许总质量未达到30%的。'},
  {en:'Driving a vehicle (other than a coach, tourist coach or dangerous-goods vehicle) that has missed its scheduled safety inspection.',zh:'驾驶未按规定定期进行安全技术检验的公路客运汽车、旅游客运汽车、危险物品运输车辆以外的机动车上道路行驶的。'},
  {en:'Driving a goods vehicle whose registered structure, construction or characteristics have been changed without approval.',zh:'驾驶擅自改变已登记的结构、构造或者特征的载货汽车上道路行驶的。'}]}];

const cycle:RuleGroup[]=[
 {id:'cycle-basics',label_en:'How the cycle works',label_zh:'记分周期怎么算',entries:[
  {en:'A scoring cycle is 12 months, counted from the day your licence was first issued.',zh:'记分周期为12个月，自初次领取驾驶证之日起连续计算。'},
  {en:'Points build up within the cycle. If you finish the cycle under 12 points and every fine is paid, the points are cleared.',zh:'一个记分周期内累积记分未达到12分，且罚款已缴纳的，记分予以清除。'},
  {en:'Unpaid fines carry the points over into the next cycle.',zh:'记分虽未达到12分，但罚款未缴纳的，记分转入下一记分周期。'},
  {en:'A minor violation that does not obstruct traffic can end in a warning with no points recorded.',zh:'违法行为情节轻微、未影响道路通行的，可以给予警告，免予记分。'}]},
 {id:'cycle-full',label_en:'Reaching 12 points',label_zh:'记满12分怎么办',entries:[
  {en:'At 12 points the licence is handed in to the traffic authority and you attend road-safety study, then re-sit the Subject 1 theory exam.',zh:'累积记分达到12分的，应当将驾驶证交公安机关交通管理部门，参加满分学习并重新考试科目一。'},
  {en:'Two full-point records in one cycle, or 24 accumulated points, adds a Subject 2 re-test; three or more adds Subject 2 and Subject 3.',zh:'一个周期内两次记满12分或者累积记分达到24分的，还需考试科目二；三次以上的，还需考试科目二和科目三。'},
  {en:'You may not drive until the study and re-test are passed and the licence is returned.',zh:'在驾驶证被扣留、学习考试合格发还之前，不得驾驶机动车。'}]},
 {id:'cycle-reduce',label_en:'Earning points back (学法减分)',label_zh:'学法减分',entries:[
  {en:'Drivers with points on their record can earn back up to 6 points per cycle by completing road-safety study with a test, or approved traffic-safety volunteer work.',zh:'驾驶人可以通过参加交通安全教育学习并考试合格，或者参加交通安全公益活动，申请减免记分，每个周期最多减免6分。'},
  {en:'Formats and credits are set locally through the 交管12123 app — typically a short online session plus a test, an in-person session, or volunteer hours.',zh:'具体形式和减分数由各地公安机关交通管理部门规定，一般通过“交管12123”App进行网上学习、现场学习或公益活动。'},
  {en:'Not available if you are already at full points, are within the probation period, or have a record in the past three years of drink-driving, drug-driving, forged documents or taking someone else’s points.',zh:'有记满12分记录、处于实习期，或者三年内有饮酒/醉酒驾驶、使用伪造证件、替代记分等记录的，不能申请学法减分。'}]}];

const alcohol:RuleGroup[]=[
 {id:'alc-limits',label_en:'Where the lines are',label_zh:'酒驾标准',entries:[
  {en:'Drink-driving (饮酒驾驶): blood alcohol of 20 mg/100 ml up to under 80 mg/100 ml.',zh:'饮酒驾驶：血液酒精含量大于或者等于20mg/100ml，小于80mg/100ml。'},
  {en:'Drunk driving (醉酒驾驶): blood alcohol of 80 mg/100 ml or more. This is a criminal offence, not just a traffic penalty.',zh:'醉酒驾驶：血液酒精含量大于或者等于80mg/100ml，属于犯罪行为。'},
  {en:'Driving after taking state-controlled narcotic or psychotropic drugs is prohibited in the same way.',zh:'服用国家管制的精神药品或者麻醉药品后，不得驾驶机动车。'}]},
 {id:'alc-penalty',label_en:'Penalties',label_zh:'处罚标准',entries:[
  {en:'Drink-driving a private vehicle: 12 points, licence suspended 6 months, fine of 1,000–2,000 yuan.',zh:'饮酒后驾驶机动车的，记12分，暂扣驾驶证6个月，处1000元以上2000元以下罚款。'},
  {en:'A second drink-driving offence: up to 10 days’ detention, fine of 1,000–2,000 yuan, licence revoked.',zh:'因饮酒后驾驶机动车被处罚，再次饮酒后驾驶机动车的，处10日以下拘留，处1000元以上2000元以下罚款，吊销驾驶证。'},
  {en:'Drunk driving: held until sober, licence revoked, criminal liability, and no new licence for 5 years.',zh:'醉酒驾驶机动车的，由公安机关约束至酒醒，吊销驾驶证，依法追究刑事责任，5年内不得重新取得驾驶证。'},
  {en:'Drink-driving a commercial vehicle: 15 days’ detention, 5,000 yuan fine, licence revoked, no new licence for 5 years.',zh:'饮酒后驾驶营运机动车的，处15日拘留，处5000元罚款，吊销驾驶证，5年内不得重新取得驾驶证。'},
  {en:'Drunk driving a commercial vehicle: licence revoked, no new licence for 10 years, and no commercial driving afterwards.',zh:'醉酒驾驶营运机动车的，吊销驾驶证，10年内不得重新取得，重新取得后不得驾驶营运机动车。'},
  {en:'Drink- or drunk-driving that causes a serious crash amounting to a crime: licence revoked for life.',zh:'饮酒后或者醉酒驾驶机动车发生重大交通事故构成犯罪的，吊销驾驶证，终生不得重新取得。'}]}];

const speed:RuleGroup[]=[
 {id:'speed-default',label_en:'When there is no speed sign',label_zh:'没有限速标志时',entries:[
  {en:'Road with no centre line: 30 km/h on a city road, 40 km/h on a highway.',zh:'没有道路中心线的道路，城市道路为每小时30公里，公路为每小时40公里。'},
  {en:'Only one lane in each direction: 50 km/h on a city road, 70 km/h on a highway.',zh:'同方向只有1条机动车道的道路，城市道路为每小时50公里，公路为每小时70公里。'}]},
 {id:'speed-express',label_en:'On the expressway',label_zh:'高速公路',entries:[
  {en:'Maximum 120 km/h, minimum 60 km/h.',zh:'高速公路最高时速不得超过120公里，最低时速不得低于60公里。'},
  {en:'Small passenger cars up to 120 km/h; other motor vehicles up to 100 km/h; motorcycles up to 80 km/h.',zh:'小型载客汽车最高不超过120公里/小时，其他机动车不超过100公里/小时，摩托车不超过80公里/小时。'},
  {en:'Two lanes each way: the left lane has a minimum of 100 km/h.',zh:'同方向有2条车道的，左侧车道的最低车速为每小时100公里。'},
  {en:'Three or more lanes each way: leftmost lane minimum 110 km/h, middle lane minimum 90 km/h.',zh:'同方向有3条以上车道的，最左侧车道的最低车速为每小时110公里，中间车道为每小时90公里。'}]},
 {id:'speed-visibility',label_en:'Poor visibility on the expressway',label_zh:'高速公路能见度低时',note_en:'In each case switch on fog lamps, low beam, clearance lamps, front and rear position lamps, and hazard lights.',note_zh:'上述情形均应开启雾灯、近光灯、示廓灯、前后位灯和危险报警闪光灯。',entries:[
  {en:'Visibility under 200 m: no more than 60 km/h, keep more than 100 m from the vehicle ahead.',zh:'能见度小于200米时，时速不超过60公里，与同车道前车保持100米以上距离。'},
  {en:'Visibility under 100 m: no more than 40 km/h, keep more than 50 m from the vehicle ahead.',zh:'能见度小于100米时，时速不超过40公里，与同车道前车保持50米以上距离。'},
  {en:'Visibility under 50 m: no more than 20 km/h, and leave at the nearest exit.',zh:'能见度小于50米时，时速不超过20公里，并从最近的出口尽快驶离高速公路。'}]},
 {id:'speed-30',label_en:'Situations capped at 30 km/h',label_zh:'最高时速30公里的情形',note_en:'Tractors, battery vehicles and wheeled special machinery are capped at 15 km/h in these situations.',note_zh:'其中拖拉机、电瓶车、轮式专用机械车不得超过每小时15公里。',entries:[
  {en:'Entering or leaving a non-motorised lane, or crossing a level crossing, sharp bend, narrow road or narrow bridge.',zh:'进出非机动车道，通过铁路道口、急弯路、窄路、窄桥时。'},
  {en:'Turning around, turning, or going down a steep slope.',zh:'掉头、转弯、下陡坡时。'},
  {en:'Fog, rain, snow, sand or hail with visibility within 50 m.',zh:'遇雾、雨、雪、沙尘、冰雹，能见度在50米以内时。'},
  {en:'Driving on icy, snowy or muddy roads.',zh:'在冰雪、泥泞的道路上行驶时。'},
  {en:'Towing a broken-down vehicle.',zh:'牵引发生故障的机动车时。'}]}];

const probation:RuleGroup[]=[
 {id:'prob-basics',label_en:'The first 12 months',label_zh:'实习期',entries:[
  {en:'The probation period runs for 12 months from the day the licence is issued — and again for 12 months after you add a new vehicle class.',zh:'机动车驾驶证的实习期为初次领证后的12个月；增加准驾车型后，也有12个月的实习期。'},
  {en:'A standard 实习 (probation) sign must be displayed on the back of the vehicle throughout.',zh:'实习期内驾驶机动车的，应当在车身后部粘贴或者悬挂统一式样的实习标志。'}]},
 {id:'prob-limits',label_en:'What you may not do',label_zh:'实习期的限制',entries:[
  {en:'On an expressway you must be accompanied by a driver who has held the same or a higher licence class for at least 3 years.',zh:'实习期内驾驶机动车上高速公路行驶，应当由持相应或者更高准驾车型驾驶证3年以上的驾驶人陪同。'},
  {en:'You may not drive a public bus, a commercial passenger vehicle, or a fire engine, ambulance or rescue vehicle on duty.',zh:'实习期内不得驾驶公共汽车、营运客车，或者执行任务的消防车、救护车、工程救险车。'},
  {en:'You may not carry explosives, flammable or explosive chemicals, highly toxic or radioactive goods.',zh:'实习期内不得驾驶载有爆炸物品、易燃易爆化学物品、剧毒或者放射性等危险物品的机动车。'},
  {en:'The vehicle you drive may not tow a trailer.',zh:'实习期内驾驶的机动车不得牵引挂车。'}]},
 {id:'prob-points',tone:'high',label_en:'Points during probation',label_zh:'实习期记分',entries:[
  {en:'Reaching 12 points during probation cancels the probationary licence class.',zh:'实习期内记分达到12分的，注销其实习的准驾车型驾驶资格。'},
  {en:'For added heavy classes (A1, A2, A3, B1, B2): one record of 6 or more points during probation extends the probation by a year; another such record during the extension cancels that class.',zh:'持有大型客车、牵引车、城市公交车、中型客车、大型货车驾驶证的驾驶人，在实习期内发生一次记6分以上记分的，实习期延长一年；延长期间再次发生一次记6分以上记分的，注销其实习的准驾车型驾驶资格。'}]}];

const licence:RuleGroup[]=[
 {id:'lic-common',label_en:'Classes most learners take',label_zh:'常见准驾车型',entries:[
  {en:'C1 — small car: small and mini passenger vehicles, light and mini goods vehicles, light and mini special-purpose vehicles. Also covers C2, C3 and C4.',zh:'C1 小型汽车：小型、微型载客汽车以及轻型、微型载货汽车、轻型和微型专项作业车；准予驾驶C2、C3、C4。'},
  {en:'C2 — small automatic: small and mini automatic passenger vehicles, light and mini automatic goods vehicles.',zh:'C2 小型自动挡汽车：小型、微型自动挡载客汽车以及轻型、微型自动挡载货汽车。'},
  {en:'C3 — low-speed goods vehicle. Also covers C4.',zh:'C3 低速载货汽车：低速载货汽车；准予驾驶C4。'},
  {en:'C4 — three-wheeled vehicle.',zh:'C4 三轮汽车：三轮汽车。'},
  {en:'C5 — small automatic passenger vehicle adapted for drivers with disabilities.',zh:'C5 残疾人专用小型自动挡载客汽车。'}]},
 {id:'lic-heavy',label_en:'Heavy and passenger classes',label_zh:'大中型准驾车型',entries:[
  {en:'A1 — large passenger bus. Also covers A3, B1, B2, C1, C2, C3, C4 and M.',zh:'A1 大型客车：大型载客汽车；准予驾驶A3、B1、B2、C1、C2、C3、C4、M。'},
  {en:'A2 — tractor unit: heavy and medium full-trailer and semi-trailer combinations. Also covers B1, B2, C1, C2, C3, C4 and M.',zh:'A2 牵引车：重型、中型全挂、半挂汽车列车；准予驾驶B1、B2、C1、C2、C3、C4、M。'},
  {en:'A3 — city bus: public buses with 10 or more seats. Also covers C1, C2, C3 and C4.',zh:'A3 城市公交车：核载10人以上的城市公共汽车；准予驾驶C1、C2、C3、C4。'},
  {en:'B1 — medium passenger vehicle, including city buses seating 10 to 19. Also covers C1, C2, C3, C4 and M.',zh:'B1 中型客车：中型载客汽车（含核载10人以上、19人以下的城市公共汽车）；准予驾驶C1、C2、C3、C4、M。'},
  {en:'B2 — large goods vehicle: heavy and medium goods vehicles, and large, heavy or medium special-purpose vehicles. Also covers C1, C2, C3, C4 and M.',zh:'B2 大型货车：重型、中型载货汽车，大、重、中型专项作业车；准予驾驶C1、C2、C3、C4、M。'}]},
 {id:'lic-other',label_en:'Motorcycles and other classes',label_zh:'摩托车及其他',entries:[
  {en:'D — ordinary three-wheeled motorcycle. Also covers E and F.',zh:'D 普通三轮摩托车；准予驾驶E、F。'},
  {en:'E — ordinary two-wheeled motorcycle. Also covers F.',zh:'E 普通二轮摩托车；准予驾驶F。'},
  {en:'F — light motorcycle.',zh:'F 轻便摩托车。'},
  {en:'M — wheeled self-propelled machinery. N — trolleybus. P — tram.',zh:'M 轮式自行机械车；N 无轨电车；P 有轨电车。'}]},
 {id:'lic-age',label_en:'Age and renewal',label_zh:'年龄与换证',entries:[
  {en:'A small-car licence (C1, C2) can be applied for from age 18, with no upper age limit.',zh:'申请小型汽车、小型自动挡汽车准驾车型的，年龄在18周岁以上，没有年龄上限。'},
  {en:'Applicants and holders aged 70 or over submit an annual medical certificate; new applicants at that age also pass a memory, judgement and reaction test.',zh:'年龄在70周岁以上的，应当每年提交身体条件证明；申请小型汽车驾驶证的，还应当通过记忆力、判断力、反应力等能力测试。'},
  {en:'A licence is valid for 6 years, then 10 years, then indefinitely. Apply to renew within the 90 days before it expires.',zh:'驾驶证有效期为6年、10年和长期；应当在有效期满前90日内申请换证。'}]}];

const emergency:RuleGroup[]=[
 {id:'em-numbers',label_en:'Numbers to know',label_zh:'常用电话',entries:[
  {en:'122 — traffic police and crash reporting. 110 — police. 120 — ambulance. 119 — fire.',zh:'122 交通事故报警；110 匪警；120 急救；119 火警。'},
  {en:'交管12123 is the official app for fines, points, study and licence renewal.',zh:'“交管12123”App用于处理违法、查询记分、学法减分和换证等业务。'}]},
 {id:'em-breakdown',label_en:'If the vehicle stops on the road',label_zh:'车辆故障停车',entries:[
  {en:'Switch on the hazard warning lights straight away.',zh:'立即开启危险报警闪光灯。'},
  {en:'On an ordinary road, set the warning triangle 50–100 m behind the vehicle. At night or in poor visibility also use clearance lamps and rear position lamps, and increase the distance.',zh:'在一般道路上，应当在车后50米至100米处设置警告标志；夜间或者能见度低时还应当开启示廓灯和后位灯，并加大设置距离。'},
  {en:'On an expressway, set the warning triangle at least 150 m behind the vehicle in the direction of oncoming traffic.',zh:'在高速公路上，应当在来车方向150米以外设置警告标志。'},
  {en:'Everyone leaves the carriageway — move to the right shoulder or behind the guardrail — and then call for help.',zh:'车上人员应当迅速转移到右侧路肩上或者应急车道内，并且迅速报警。'}]},
 {id:'em-crash',label_en:'After a crash',label_zh:'发生交通事故',entries:[
  {en:'Stop immediately, protect the scene, and switch on the hazard lights.',zh:'立即停车，保护现场，开启危险报警闪光灯。'},
  {en:'If anyone is hurt, give first aid and call 122 and 120 at once. If an injured person must be moved, mark the original positions first.',zh:'造成人身伤亡的，应当立即抢救受伤人员并报警；因抢救伤员变动现场的，应当标明位置。'},
  {en:'For a minor crash with no injuries and no dispute over the facts, photograph the scene, move the vehicles clear, and settle it between the parties or through the traffic authority.',zh:'仅造成轻微财产损失，且基本事实清楚的，应当先撤离现场再协商处理，或者报警由交警处理。'},
  {en:'Leaving the scene after a crash is the offence with the heaviest consequences in this whole list — 12 points if not a crime, and a lifetime ban if it is.',zh:'交通肇事逃逸后果最严重：尚不构成犯罪的一次记12分；构成犯罪的，终生不得重新取得驾驶证。'}]}];

export const ruleSections:RuleSection[]=[
 {id:'points',label_en:'Point deductions',label_zh:'违法记分',summary_en:'Every violation carries a fixed number of points: 12, 9, 6, 3 or 1. Twelve points in one cycle costs you the licence until you study and re-test.',summary_zh:'交通违法行为一次记分的分值为12分、9分、6分、3分、1分。一个记分周期内累积12分，须学习并重新考试。',groups:points},
 {id:'cycle',label_en:'The 12-point cycle',label_zh:'记分周期',summary_en:'How points accumulate, clear, and come back — and what happens the day you hit twelve.',summary_zh:'记分如何累积、清除和减免，以及记满12分后的处理。',groups:cycle},
 {id:'alcohol',label_en:'Alcohol and drugs',label_zh:'酒驾与药驾',summary_en:'Two thresholds, very different consequences. This is the most heavily penalised area of Chinese traffic law.',summary_zh:'饮酒与醉酒两条界线，处罚差别极大，是道路交通法中处罚最重的部分。',groups:alcohol},
 {id:'speed',label_en:'Speed limits',label_zh:'限速规定',summary_en:'Default limits when no sign is posted, expressway minimums and maximums, and the situations that cap you at 30 km/h.',summary_zh:'没有限速标志时的默认限速、高速公路的最高与最低时速，以及最高30公里/小时的情形。',groups:speed},
 {id:'probation',label_en:'Probation period',label_zh:'实习期',summary_en:'The 12 months after your licence is issued come with extra rules and a much lower margin for error.',summary_zh:'初次领证后的12个月内有额外限制，容错空间更小。',groups:probation},
 {id:'licence',label_en:'Licence classes',label_zh:'准驾车型',summary_en:'What each code on the licence allows you to drive — driving outside your class is a 9-point violation.',summary_zh:'驾驶证上每个代号对应的准驾车型；驾驶与准驾车型不符的机动车一次记9分。',groups:licence},
 {id:'emergency',label_en:'Breakdowns and crashes',label_zh:'故障与事故',summary_en:'The order of actions, the warning-triangle distances, and the numbers to call.',summary_zh:'处置顺序、警告标志的设置距离和报警电话。',groups:emergency}];

export function filterRules(query:string):RuleSection[]{
 const q=query.trim().toLowerCase();
 if(!q)return ruleSections;
 const hit=(...parts:(string|undefined)[])=>parts.some(p=>p?.toLowerCase().includes(q));
 return ruleSections.map(section=>{
  if(hit(section.label_en,section.label_zh,section.summary_en,section.summary_zh))return section;
  const groups=section.groups.map(group=>{
   if(hit(group.label_en,group.label_zh,group.tag,group.note_en,group.note_zh))return group;
   const entries=group.entries.filter(e=>hit(e.en,e.zh));
   return entries.length?{...group,entries}:null;
  }).filter(Boolean) as RuleGroup[];
  return groups.length?{...section,groups}:null;
 }).filter(Boolean) as RuleSection[];
}

export const ruleCount=ruleSections.reduce((total,s)=>total+s.groups.reduce((n,g)=>n+g.entries.length,0),0);
