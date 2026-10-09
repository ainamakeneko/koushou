(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Koushou2=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION=1, SAVE_KEY='kitsune_w02_v1';
const CREW={g:{name:'少女',face:'f_girl'},m:{name:'整備士',face:'f_mech'},c:{name:'AI猫',face:'f_cat'},r:{name:'リツ',face:'f_ritsu'},s:{name:'セナ',color:'#6fd0c8'},o:{name:'オルド',color:'#c9a25a'},i:{name:'イオ',color:'#e4743c'},n:{name:''}};
const LOCATIONS={office:{name:'出航窓口',person:'セナ',detail:'変更手続きと出航予定を管理する窓口。',x:16,y:38},berth:{name:'貨物船の桟橋',person:'オルド',detail:'10時の枠を持つ貨物船が、荷物を待っている。',x:43,y:58},depot:{name:'共同荷役所',person:'イオ',detail:'荷渡し時刻は、船の到着時刻とは別に記録される。',x:73,y:32},ship:{name:'本船',person:'仲間たち',detail:'積める量と使える燃料を、実物で確かめる。',x:78,y:76}};
const FACTS={
 schedule:{title:'自船の枠は20時',text:'翌朝の定期船団に間に合う出航は18時まで。通常の20時枠では間に合わず、次の船団は2日後。'},
 premium:{title:'臨時便は8時・12,000 Cr',text:'追加の誘導艇を手配する正規の臨時便。7時までに依頼が必要。交換相手への約束は要らない。'},
 rules:{title:'予約票だけでは移れない',text:'枠の変更は、双方の同意と港の登録がそろって成立。10時の枠は9時までに変更を終える必要がある。'},
 lateSlot:{title:'23時に予備枠がある',text:'オルドの行先は夜間も荷受け可能。ただし20時を逃すと、夜間荷役料が1,000 Cr増える。港は条件付きの予備枠を予約できる。'},
 early:{title:'オルドの予約は10時',text:'貨物船の出航予約。船長が早く出たいとは、まだ確認していない。'},
 need:{title:'出たいのは、荷物を積んだ後',text:'オルドは荷物を残して行けない。早い枠に価値を感じているわけではなく、次の予約を失うのが心配。'},
 arrival:{title:'14時は入港の見込み',text:'荷物を運ぶ便の入港見込みは14時。貨物を受け取れる時刻は別。'},
 release:{title:'通常は16時荷渡し、積込2時間',text:'通常なら18時に積み終える。追加検査があれば荷渡しは19時となり、20時には間に合わない。検査の有無は、今は確定できない。'},
 manifest:{title:'急ぐのは電池1.2tだけ',text:'観測所向けの荷物は計2.4t。うち交換電池1.2tは今便、空の回収容器1.2tは次便でよい。荷主は分納を認めている。'},
 capacity:{title:'貨物室の安全な余裕は1.8t',text:'人員・燃料込みで確認した積載余力。2.4tは積めない。1.2tなら固定具を追加して運べる。'},
 service:{title:'14時の保守便に運搬枠',text:'観測所へ電池を届ける船なら14時の保守便に参加できる。12時までに受託、準備2時間。燃料・固定具2,000 Cr、寄り道は6時間。'},
 agreement:{title:'オルドの同意を得た',text:'自船の20時枠とオルドの10時枠を交換する合意。港への登録が済むまでは有効にならない。'},
 registered:{title:'10時枠への変更を登録した',text:'港が双方の同意と予約の変更を確認した。出航は10時。'},
 delivery:{title:'電池1.2tの運搬を受託した',text:'今便は電池だけ、空容器は次便。行先・重量・費用を確認済み。出航は14時。'}
};
const L=(who,text)=>({who,text});
const OPENING=[L('n','ホタルビでの寄港から、いくつかの航路を経た頃。'),L('n','一度船を降りたリツが、また顔を出した。AI猫の乗船記録には、狐一名ぶんの例外が残っていた。'),L('r','まだ使えるんだ、その記録。'),L('c','削除する指示は受けていません。'),L('n','関門港アマナ。今朝の出航表で、本船の予約は20時になっている。'),L('m','翌朝の船団に間に合う出航は18時までだ。20時じゃ遅い。'),L('g','枠を、早い船と替えてもらえないかな。'),L('s','変更はできます。相手が同意して、こちらに登録すれば。'),L('c','今回の寄港で使える予算は15,000 Cr。航海を続けるための費用は別に確保しています。'),L('r','まず、誰が何を待ってるのか聞いてみようか。'),L('n','現在0時。この章の時計は、行動した分だけ進む。仲間への相談と、帳面の確認では進まない。')];
const ACTIONS={
 office_schedule:{loc:'office',label:'出航表を読む',cost:.5,give:['schedule','premium'],lines:[L('s','通常枠は20時です。臨時の誘導艇なら、8時に出せます。'),L('g','いくら？'),L('s','12,000 Cr。手配は7時までです。'),L('m','高えが、追加の艇を出す金か。'),L('s','ええ。普通の順番を押しのける料金ではありません。')]},
 office_rules:{loc:'office',label:'予約を替える手続きを聞く',cost:.5,give:['rules'],lines:[L('s','双方の同意を確認して、予約の名義を変更します。手数料は1,000 Cr。'),L('s','予約票を渡し合うだけでは、誘導艇を出せません。'),L('g','相手がいいって言っても？'),L('s','その船の準備が済んでいるかも、こちらで確認するので。10時の枠なら、9時までにお願いします。')]},
 office_late:{loc:'office',label:'貨物が遅れた場合の枠を聞く',cost:.5,req:['need'],give:['lateSlot'],lines:[L('s','20時の次なら23時に空きがあります。条件を決めて、予備として押さえられます。'),L('g','遅れた時だけ、そっちに替える？'),L('s','はい。オルドさんの行先は夜も荷受けできます。ただ、夜間の荷役料が1,000 Cr増えます。'),L('m','時刻は替えられても、費用は消えねえな。')]},
 office_service:{loc:'office',label:'ほかの出航方法を聞く',cost:.5,give:['service'],lines:[L('s','14時に観測所への保守便が出ます。電池の運搬を引き受ける船を探しています。'),L('g','私たちの船でも？'),L('s','重量と固定方法が合えば。共同荷役所で荷主に確認してください。'),L('c','寄り道は6時間。燃料と固定具に2,000 Cr必要です。'),L('s','12時までに受託すれば、2時間で準備できます。船団にも合流できる経路です。')]},
 berth_board:{loc:'berth',label:'貨物船の予定を見る',cost:.5,give:['early','arrival'],lines:[L('n','出航10時。荷物の到着見込み14時。隣り合う二つの表示が、合っていない。'),L('g','荷物より先に出るの？'),L('o','出られるものならな。出港予約だけは、先に取ってあった。')]},
 berth_need:{loc:'berth',label:'船長が何を待っているか聞く',cost:.5,give:['need','early','arrival'],lines:[L('o','観測船の補用品を待ってる。あれを残して出たら、運びに来た意味がない。'),L('g','早く出たいわけじゃないんだ。'),L('o','荷を積んでから出たい。でも10時を手放して、その後の枠までなくなるのは困る。'),L('g','私たちは20時の枠を持ってる。'),L('o','なら、話はできる。荷渡しは何時になる？'),L('g','……到着なら14時って書いてあった。'),L('o','それと荷渡しは違う。俺もまだ確認を待ってる。')]},
 berth_blame:{loc:'berth',label:'早い枠を空けるべきだと言う',cost:.5,lines:[L('g','10時に出られないなら、ほかの船に空けるべきじゃない？'),L('o','出た後の責任を引き受けない人に、そう言われてもな。'),L('n','船長は荷物の表に目を戻した。話をやめたわけではない。'),L('m','困ってる理由から聞こうぜ。')],flag:'strained'},
 berth_apology:{loc:'berth',label:'決めつけたことを謝る',cost:.5,flagReq:'strained',lines:[L('g','さっきはごめん。荷物のことを聞く前に、言っちゃった。'),L('o','いい。枠が欲しいのは分かった。こっちの荷も置いていかない案なら聞く。')],clear:'strained'},
 depot_times:{loc:'depot',label:'荷渡しの記録を照合する',cost:.5,req:['arrival'],give:['release'],lines:[L('i','14時は運搬船の入港予定。荷渡しは通常16時です。'),L('m','積み込むのに2時間。普通なら18時。'),L('i','追加検査になれば荷渡しは19時です。今回は対象になる可能性があります。'),L('c','検査の有無は未確定。20時に間に合うとは断定できません。'),L('g','早い方だけを約束したら、あとで困るね。'),L('i','通常と遅延、両方の予定を書いて渡します。')]},
 depot_manifest:{loc:'depot',label:'観測所向けの荷札を読む',cost:.5,req:['service'],give:['manifest'],lines:[L('g','全部で2.4トン……。'),L('i','交換電池が1.2トン。残りは空の回収容器です。'),L('g','どっちも今すぐ？'),L('i','急ぐのは電池だけ。容器は次便で構いません。分けて運ぶ許可もあります。'),L('m','ひとまとめで積まなくていいわけだ。')]},
 ship_capacity:{loc:'ship',label:'貨物室と固定具を確認する',cost:.5,give:['capacity'],lines:[L('m','人と燃料を入れて、安全に積める余りは1.8トン。ここまでだ。'),L('g','もう少し詰めたら？'),L('m','場所が空いてても、重さは減らねえ。'),L('c','1.2トンなら固定具の追加で対応できます。'),L('r','俺の荷物、動かす？'),L('m','通路の分は、どっちにしろ動かせ。')]},
 ship_consult:{loc:'ship',label:'仲間と現状を整理する',cost:0,repeat:true,lines:[]}
};
const clone=s=>JSON.parse(JSON.stringify(s));
const has=(s,k)=>s.facts.includes(k);
const time=n=>String(Math.floor(n)).padStart(2,'0')+':'+(n%1?'30':'00');
function fresh(){return {version:VERSION,t:0,money:15000,loc:'office',facts:['schedule'],done:[],flags:{},proposal:{give:'slot',evidence:'unknown',delay:'none'},dialog:{lines:OPENING,index:0},log:[],end:null,started:true};}
function valid(s){return !!s&&s.version===VERSION&&typeof s.t==='number'&&Number.isFinite(s.t)&&s.t>=0&&s.t<=50&&Number.isInteger(s.t*2)&&typeof s.money==='number'&&s.money>=0&&s.money<=15000&&!!LOCATIONS[s.loc]&&Array.isArray(s.facts)&&s.facts.every(k=>!!FACTS[k])&&Array.isArray(s.done)&&s.done.every(x=>typeof x==='string')&&s.flags&&typeof s.flags==='object'&&s.proposal&&['slot','cash','nothing'].includes(s.proposal.give)&&['unknown','arrival','verified'].includes(s.proposal.evidence)&&['none','shared'].includes(s.proposal.delay)&&Array.isArray(s.log)&&(!s.end||!!ENDINGS[s.end])&&(!s.dialog||(Array.isArray(s.dialog.lines)&&s.dialog.lines.length>0&&s.dialog.lines.every(l=>l&&!!CREW[l.who]&&typeof l.text==='string')&&Number.isInteger(s.dialog.index)&&s.dialog.index>=0&&s.dialog.index<s.dialog.lines.length));}
function dialog(s,lines){s.dialog={lines,index:0};return s;}
function add(s,keys){for(const k of keys||[])if(!has(s,k))s.facts.push(k);}
function record(s,text){s.log.push({t:s.t,text});s.log=s.log.slice(-60);}
function availability(s,id){const a=ACTIONS[id];if(!a)return '項目が見つからない';if(s.end)return '航路は決定済み';if(s.dialog)return '会話の途中';if(a.loc!==s.loc)return 'この場所では話せない';if(a.req&&!a.req.every(k=>has(s,k)))return 'まだ手がかりがない';if(a.flagReq&&!s.flags[a.flagReq])return '今は必要ない';if(!a.repeat&&s.done.includes(id))return '確認済み';return '';}
function counsel(s){const ls=[L('g','いま選べる道を、整理しよう。')];if(has(s,'premium')){if(s.t>7)ls.push(L('c','8時の臨時便は、手配期限を過ぎました。'));else ls.push(L('m','金を払って8時に出るなら、7時までだ。'));}else ls.push(L('m','早く出る枠と料金は、窓口で聞こう。'));if(has(s,'need'))ls.push(L('m','船長が欲しいのは、荷を積んだ後の枠だ。'));if(has(s,'release'))ls.push(L('c','荷渡しには遅れる可能性があります。未確定の時刻は、確定として扱えません。'));if(has(s,'manifest')&&has(s,'capacity'))ls.push(L('g','電池だけなら、うちの船に積めるね。'));ls.push(L('r','どの約束なら守れるか、だね。'),L('c','現在'+time(s.t)+'。予算の残りは'+s.money.toLocaleString('ja-JP')+' Crです。'));return ls;}
function act(input,id){let s=clone(input);const reason=availability(s,id);if(reason)return {state:s,error:reason};const a=ACTIONS[id];s.t+=a.cost;if(!a.repeat)s.done.push(id);if(a.flag)s.flags[a.flag]=true;if(a.clear)s.flags[a.clear]=false;add(s,a.give);record(s,a.label);if(s.t>=18)return {state:finish(s,'timeout')};return {state:dialog(s,a.repeat?counsel(s):a.lines)};}
function move(input,loc){const s=clone(input);if(s.dialog||s.end)return {state:s,error:'今は移動できない'};if(!LOCATIONS[loc]||loc===s.loc)return {state:s,error:'移動先を選んでください'};s.t+=.5;s.loc=loc;record(s,LOCATIONS[loc].name+'へ移動');if(s.t>=18)return {state:finish(s,'timeout')};return {state:dialog(s,[L('n',LOCATIONS[loc].name+'に来た。')])};}
function next(input){const s=clone(input);if(!s.dialog)return s;s.dialog.index++;if(s.dialog.index>=s.dialog.lines.length)s.dialog=null;return s;}
function setProposal(input,key,value){const s=clone(input);const allowed={give:['slot','cash','nothing'],evidence:['unknown','arrival','verified'],delay:['none','shared']};if(!s.dialog&&!s.end&&allowed[key]&&allowed[key].includes(value))s.proposal[key]=value;return s;}
function propose(input){const s=clone(input);if(s.dialog||s.end||s.loc!=='berth')return {state:s,error:'桟橋で船長と話してください'};if(!has(s,'need'))return {state:s,error:'まず船長の事情を聞いてください'};if(has(s,'agreement'))return {state:s,error:'合意済みです。港の登録を確認してください'};if(s.t+1.5>9)return {state:s,error:'合意の後、窓口への移動と登録に1時間必要です。今からでは9時の締切に間に合いません'};s.t+=.5;record(s,'予約枠の交換を提案');const p=s.proposal;
 let ls;
 if(s.t>9)ls=[L('o','10時の枠は、もう変更の締切だ。別の方法を考えよう。')];
 else if(s.flags.strained)ls=[L('o','俺の荷を置いていけ、という話の続きなら困る。そこは分かってほしい。')];
 else if(p.give!=='slot')ls=[L('o',p.give==='cash'?'2,000もらっても、次の出航枠がなければ荷を運べない。':'こっちの出航予定がなくなる案では、渡せない。'),L('g','……私たちの遅い枠は使えないかな。')];
 else if(p.evidence==='verified'&&!has(s,'release'))ls=[L('c','荷渡しの記録は、まだ確認していません。'),L('o','確認できたことだけで話そう。')];
 else if(p.delay==='shared'&&(!has(s,'lateSlot')||!has(s,'release')))ls=[L('o','予備枠は押さえられるのか？　それと、どの時刻で切り替える？'),L('c','港と荷役所の確認が必要です。')];
 else if(p.evidence==='unknown')ls=[L('o','20時の枠は助かる。でも荷物を積めるか、確認してから返事をしたい。')];
 else if(p.evidence==='arrival')ls=[L('g','14時に着くなら、20時には出られるよね。'),L('o','その14時は、何が終わる時刻だ？'),L('c','入港の見込みです。荷渡し完了ではありません。'),L('o','荷役所に聞こう。推測でお互い約束しない方がいい。')];
 else {add(s,['agreement']);s.flags.protected=p.delay==='shared';ls=[L('g','うちの20時の枠と、そちらの10時を交換したい。通常の荷渡しは16時、積込みは2時間。'),L('o','追加検査なら、20時には出られないんだな。')];if(s.flags.protected)ls.push(L('g','荷渡しが18時を過ぎたら、港が押さえる23時の枠へ。夜間の1,000 Crは500ずつ。うちが払う上限も500で。'),L('o','それなら、遅れた場合も運べる。いい、交換しよう。'));else ls.push(L('g','遅れた場合は、まだ決めてない。'),L('o','それは承知して引き受ける。追加の費用はこちら持ちになるな。今回だけだぞ。'),L('n','通常時の交換には合意した。遅れた場合の負担は、相手に残っている。'));ls.push(L('o','窓口で登録しよう。票を渡すだけでは出られない。'));}
 if(s.t>=18)return {state:finish(s,'timeout')};return {state:dialog(s,ls)};}
function registration(input){const s=clone(input);if(s.dialog||s.end||s.loc!=='office')return {state:s,error:'出航窓口で手続きしてください'};if(!has(s,'agreement'))return {state:s,error:'交換相手の同意が必要です'};if(has(s,'registered'))return {state:s,error:'登録は完了しています'};if(s.money<1000)return {state:s,error:'手数料1,000 Crの予算が必要です'};if(s.t+.5>9)return {state:dialog(s,[L('s','10時枠の名義変更は9時で締切です。今回は受け付けられません。')])};s.t+=.5;s.money-=1000;add(s,['rules','registered']);record(s,'双方の同意を港に登録（1,000 Cr）');return {state:dialog(s,[L('s','オルドさんの同意を確認。双方の予約を変更しました。手数料1,000 Crです。'),L('c','自船の出航は10時。予約変更、登録済みです。'),L('s',s.flags.protected?'荷渡しが18時を過ぎた場合の23時枠と、費用折半の条件も登録しました。':'遅延時の代替枠は、この合意には含まれていません。'),L('g','これで、港にも伝わった。')])};}
function informal(input){const s=clone(input);if(s.dialog||s.end)return {state:s,error:'会話を終えてください'};if(!has(s,'agreement')||has(s,'registered'))return {state:s,error:'未登録の合意はありません'};s.t+=.5;s.flags.gateRefused=true;record(s,'予約票だけで出航を試みた');if(s.t>=18)return {state:finish(s,'timeout')};return {state:dialog(s,[L('n','誘導艇の乗員が、予約票を照合した。'),L('s','港の予約はまだ元の名義です。この票だけでは艇を出せません。'),L('g','船長とは合意したんだけど。'),L('s','その同意を窓口に登録してください。変更締切は9時です。'),L('n','料金は発生しなかった。確認に30分かかった。')])};}
function takeDelivery(input,split){const s=clone(input);if(s.dialog||s.end||s.loc!=='depot')return {state:s,error:'共同荷役所で相談してください'};if(!has(s,'service'))return {state:s,error:'港の保守便を確認してください'};if(has(s,'delivery'))return {state:s,error:'受託済みです'};if(has(s,'registered'))return {state:s,error:'10時の交換枠を登録済みです。まずその航路で出航してください'};if(s.t+.5>12)return {state:dialog(s,[L('i','保守便の受託は12時まで。今からだと準備が間に合いません。')])};s.t+=.5;record(s,split?'電池だけの分納を提案':'全量2.4tの運搬を提案');let ls;
 if(!has(s,'capacity'))ls=[L('i','安全に積める量を確認してから、依頼書を作ります。本船を見てきてください。')];
 else if(!split) {s.flags.overload=true;ls=[L('m','2.4トンは積めねえ。確認した余りは1.8トンだ。'),L('i','まだ積み込んでいないので、取り消し費用はありません。荷物を分ける話ならできます。')];}
 else if(!has(s,'manifest'))ls=[L('i','何を分けて運ぶか、荷札と納期を一緒に確認しましょう。')];
 else {add(s,['delivery']);ls=[L('g','今便は電池1.2トンだけ。空容器は次便に分けてほしい。'),L('i','それで依頼書を作ります。荷主の分納許可と一致しています。'),L('m','燃料と固定具で2,000。寄り道は6時間。それなら引き受けられる。'),L('i','14時の保守便です。準備2時間を見込んで、12時までに出航方法を決めてください。')];}
 return {state:dialog(s,ls)};}
const ROUTES={
 paid:{title:'臨時の誘導艇で出る',depart:8,price:12000,summary:'8時出航。追加の約束なし。',trade:'費用12,000 Cr。7時までに手配。',known:s=>has(s,'premium')&&!has(s,'registered'),why:s=>s.t>7?'7時の手配期限を過ぎた':s.money<12000?'予算が足りない':''},
 swap:{title:'登録した10時枠で出る',depart:10,price:0,summary:'10時出航。手数料は登録時に支払済み。',trade:'遅延時の条件は、船長との合意に従う。',known:s=>has(s,'registered'),why:s=>s.t>10?'10時の出航を過ぎた':s.flags.protected&&s.money<500?'約束した遅延時の500 Crを確保できない':''},
 delivery:{title:'電池を届ける保守便に乗る',depart:14,price:2000,summary:'14時出航。電池1.2tを観測所へ届ける。',trade:'燃料・固定具2,000 Cr。寄り道6時間。準備2時間。',known:s=>has(s,'delivery')&&!has(s,'registered'),why:s=>s.t+2>14||s.t>12?'準備2時間が取れない':s.money<2000?'予算が足りない':''},
 wait:{title:'20時の通常枠を使う',depart:20,price:2000,summary:'今回の船団には合流せず、次の便を待つ。',trade:'待機費2,000 Cr。次の船団は2日後。',known:s=>true,why:s=>has(s,'registered')?'20時枠は相手に渡したため使えない':s.money<2000?'予算が足りない':''}
};
const ENDINGS={
 paid:{name:'時間を買う',subtitle:'8時、追加の誘導艇が来た。',relation:'互いの予定はそのまま',lines:[L('n','8時。臨時の誘導艇が、本船を外の航路へ案内した。'),L('g','残り{money}。今回はけっこう使ったね。'),L('m','その分、約束は増えてねえ。時間を買ったんだ。'),L('r','あとで食べる分は？'),L('c','航海費は別枠です。夜食の追加は含みません。')],note:'早く出ることを優先し、追加費用を払った。他船の条件に依存しない航路を選んだ。'},
 swap:{name:'渡せた予約、残った負担',subtitle:'10時の枠は、正式に自船のものになった。',relation:'交換は成立、遅延の負担は片側に',lines:[L('n','10時。本船は、登録された新しい枠で港を出た。'),L('n','夕方、オルドから短い通信が届いた。追加検査で荷渡しは19時。夜間の枠を取り直し、1,000 Crを払ったという。'),L('o','交換の約束は守れた。次は、遅れた場合も最初に決めておこう。'),L('g','分かってた可能性なのに、決めないままにした。'),L('m','出られた。それと、相手の負担が残ったのは別の話だ。')],note:'同意と登録で交換は成立した。未確定だった荷渡しが遅れ、決めていなかった費用は相手に残った。'},
 protected:{name:'二つの時刻表',subtitle:'通常の予定と、遅れた時の予定。両方が動いた。',relation:'遅延後も合意どおり',lines:[L('n','10時、本船は出航した。'),L('n','夕方、荷渡しが19時にずれたとの連絡が届く。港は、約束どおりオルドの予約を23時へ切り替えた。'),L('o','今、積み終えた。夜間の1,000は500ずつ。決めた通りでいいな。'),L('g','うん。受け取った条件書と同じ。'),L('c','500 Crを精算。合意した上限内です。'),L('m','遅れは止められなくても、その後は決めておける。'),L('r','彼も、ちゃんと出られるね。')],note:'早い枠と遅い枠を交換。確定できない荷渡しには予備枠と負担上限を決めた。状況が変わっても約束を守れた。'},
 delivery:{name:'急ぐ荷物だけ',subtitle:'全部を引き受けず、必要な分を運んだ。',relation:'荷主との約束を完了',lines:[L('n','14時。固定具に収まった電池を載せ、保守便が港を出た。'),L('g','空の容器まで積まなくてよかった。'),L('m','積めた分で、ちゃんと役に立ってる。'),L('n','寄り道は6時間。観測所で電池を渡し、受領記録を受け取った。本船は予定の船団に合流した。'),L('c','電池1.2トン、引渡し完了。空容器は次便です。'),L('r','貨物室、歩きやすくなったね。'),L('m','お前の荷物も片付いたからな。')],note:'「全部まとめて運ぶ」を分け、急ぐ荷物と後でよい荷物を確認した。実際の積載量に合わせて守れる約束を作った。'},
 wait:{name:'次の便を選ぶ',subtitle:'20時の枠は、そのまま使った。',relation:'新しい約束は増やさなかった',lines:[L('n','本船は通常の20時枠を使った。合流地点の停泊区で、2日後の船団を待つ。'),L('g','今回は、待つ方にした。'),L('m','時間と費用はかかる。決めて待つなら、段取りはつく。'),L('c','待機費2,000 Cr。残りの航海費は確保されています。'),L('n','整備士は、空いた時間に工具箱を開いた。')],note:'今便を逃す費用と待ち時間を確認して、次の便を選んだ。必ずしも交渉を成立させる必要はない。'},
 timeout:{name:'時刻表の先へ',subtitle:'18時。今便に合流する時間は過ぎた。',relation:'成立していない約束は引き継がない',lines:[L('n','18時を過ぎた。翌朝の船団に間に合う出航時間は、もう残っていない。'),L('c','今便への合流はできません。停泊と、次便に向けた出航の手配が必要です。'),L('g','聞く時間と、決める時間を分けなきゃいけなかった。'),L('m','次は2日後だ。今からできる準備をしよう。'),L('n','未実行の運搬依頼は取り消し、港と船長にも出航予定の変更を伝えた。待機費2,000 Crを支払った。')],note:'確認を続ける間にも締切は進んだ。成立前の案と、登録した約束は分けて扱う必要がある。'}
};
function finish(s,id){s.end=id;s.flags.endAt=s.t;const lines=ENDINGS[id].lines.map(l=>({...l,text:l.text}));if(id==='timeout')s.money=Math.max(0,s.money-2000);if(id==='protected')s.money-=500;if(id==='timeout'&&has(s,'registered')){lines.push(L('c','登録した交換は有効です。相手に渡した20時枠を、勝手に取り戻すことはできません。'));if(s.flags.protected){s.money=Math.max(0,s.money-500);lines.push(L('n','夕方、荷渡しは19時になった。オルドの予備枠は約束どおり確保され、本船も500 Crを分担した。'));}}record(s,'航路決定：'+ENDINGS[id].name);return dialog(s,lines.map(l=>({...l,text:l.text.replace('{money}',s.money.toLocaleString('ja-JP')+' Cr')})));}
function choose(input,id){const s=clone(input),r=ROUTES[id];if(s.dialog||s.end)return {state:s,error:'今は決定できない'};if(!r||!r.known(s))return {state:s,error:'まだ実行できる航路ではありません'};const why=r.why(s);if(why)return {state:s,error:why};s.money-=r.price;s.t=r.depart;const result=finish(s,id==='swap'?(s.flags.protected?'protected':'swap'):id);if(has(s,'agreement')&&!has(s,'registered')&&id!=='swap')result.dialog.lines.unshift(L('n','出航前にオルドへ連絡した。まだ登録していない枠の交換は見送ると、確認を取り合った。'));if(has(s,'delivery')&&id!=='delivery')result.dialog.lines.unshift(L('n','荷役所に、電池の運搬を辞退すると伝えた。まだ積載前なので、取消費用は発生しない。'));return {state:result};}
function consult(input){const s=clone(input);if(s.dialog||s.end)return {state:s,error:'会話を終えてください'};return {state:dialog(s,counsel(s))};}
function availableActions(s){return Object.entries(ACTIONS).filter(([id,a])=>a.loc===s.loc&&(!a.req||a.req.every(k=>has(s,k)))&&(!a.flagReq||s.flags[a.flagReq])).map(([id,a])=>({id,...a,done:s.done.includes(id)}));}
function summary(s){return {chapter:2,ending:s.end,title:s.end?ENDINGS[s.end].name:null,time:s.t,money:s.money,protected:!!s.flags.protected,registered:has(s,'registered'),facts:s.facts.length};}
return {VERSION,SAVE_KEY,CREW,LOCATIONS,FACTS,ACTIONS,ROUTES,ENDINGS,OPENING,fresh,valid,has,time,act,move,next,setProposal,propose,registration,informal,takeDelivery,choose,consult,availableActions,summary};
});
