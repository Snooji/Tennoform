/* ---------- Coming back after a break: what's new since you stopped, and the quests to play next, in order ---------- */
/* Dates are PC release dates from the wiki's update list (Module:Version/data). Quests are ticked from your own progress. */
const RET_UPD=[
  ['2019-11-22','Rising Tide','Build your own Railjack in the Dry Dock.'],
  ['2019-12-13','Empyrean','Railjack missions with your crew.'],
  ['2020-03-05','Warframe Revised','Shield gating and no more self-damage.'],
  ['2020-06-11','The Deadlock Protocol','Corpus ship remaster, Granum Void and Protea.'],
  ['2020-07-08','The Steel Path','Hard mode for the whole star chart, with Steel Essence and Teshin.'],
  ['2020-08-25','Heart of Deimos','Cambion Drift open world, Necramechs and the Helminth.'],
  ['2021-03-19','Corpus Proxima & The New Railjack','Railjack overhaul: Plexus and Command intrinsics.'],
  ['2021-04-13','Call of the Tempestarii','Void Storms (Railjack fissures) and Sevagoth.'],
  ['2021-07-06','Sisters of Parvos','The Corpus version of Kuva Liches, with Tenet weapons.'],
  ['2021-12-15','The New War','The big story quest. Unlocks the Drifter and most later content.'],
  ['2022-04-27','Angels of the Zariman','Zariman Ten Zero, the first Incarnon weapons and a Focus rework.'],
  ['2022-09-07','Veilbreaker','Weekly Archon Hunts, Archon Shards and Kahl\'s Garrison.'],
  ['2023-04-26','The Duviri Paradox','Duviri, the Drifter and the Circuit, where Incarnon Genesis adapters come from.'],
  ['2023-06-21','The Seven Crimes of Kullervo','Overguard on Warframe abilities.'],
  ['2023-12-13','Whispers in the Walls','Sanctum Anatomica, Cavia, Netracells and Deep Archimedea. Cross-platform saves.'],
  ['2024-03-27','Dante Unbound','Dante, Omnia fissures and Ascent Fusion for Archon Shards.'],
  ['2024-06-18','Jade Shadows','Jade, Ascension missions and a rework of status effects and resistances.'],
  ['2024-08-21','The Lotus Eaters','A short quest that leads to The Hex and The Old Peace.'],
  ['2024-10-02','Koumei & the Five Fates','Koumei and a companion rework.'],
  ['2024-12-13','Warframe: 1999','Höllvania, The Hex, Protoframes and the KIM chatroom.'],
  ['2025-03-19','Techrot Encore','Technocyte Coda adversaries and Temporal Archimedea.'],
  ['2025-06-25','Isleweaver','A new Duviri node and Oraxia.'],
  ['2025-10-15','The Vallis Undermind','The Deepmines under Fortuna, Nokko and an Oberon rework.'],
  ['2025-12-10','The Old Peace','The current story quest: La Cathédrale, The Descendia and Uriel.'],
  ['2026-03-25','The Shadowgrapher','Follie, and several old grinds made shorter.'],
  ['2026-06-17','Jade Shadows: Constellations','Uranus Proxima and Steel Path Railjack.'],
  ['2026-09-23','Iceblade of Narin','Yuvan Peak hub, Narin, a Banshee rework and Riven trait locking.'],
  ['2026-10-07','The Icebind','A 6-player mode and Riven splicing.']];
/* the main quests in an order that respects their prerequisites: [quest, why it matters, release date if it came out after 2019] */
const RET_Q=[
  ['The War Within','Unlocks Kuva farming and Sorties.',''],['Rising Tide','Your own Railjack, needed for The New War.','2019-11-22'],['Chains of Harrow','',''],['Apostasy Prologue','',''],['The Sacrifice','',''],
  ['Chimera Prologue','',''],['Erra','','2019-12-13'],['The Maker','Last step before The New War.','2020-03-24'],
  ['Heart of Deimos','Unlocks the Cambion Drift and the Helminth.','2020-08-25'],['The Deadlock Protocol','','2020-06-11'],['Call of the Tempestarii','Unlocks Void Storms.','2021-04-13'],
  ['The New War','Unlocks the Drifter, Archon Hunts and nearly everything after it.','2021-12-15'],['Angels of the Zariman','Incarnon weapons and the Zariman.','2022-04-27'],['Veilbreaker','Archon Hunts and Archon Shards.','2022-09-07'],
  ['The Duviri Paradox','The Circuit and Incarnon Genesis adapters. Needed for The Hex.','2023-04-26'],['Whispers in the Walls','Netracells and Deep Archimedea.','2023-12-13'],['Jade Shadows','','2024-06-18'],['Jade Shadows: Constellations','Steel Path Railjack.','2026-06-17'],
  ['The Lotus Eaters','Short, and unlocks The Hex and The Old Peace.','2024-08-21'],['The Hex','Höllvania and the 1999 chatroom.','2024-12-13'],['The Old Peace','The latest story quest.','2025-12-10']];
const RET_FROM=[['2019-06-01','Before 2020'],['2020-01-01','2020'],['2021-01-01','2021'],['2022-01-01','2022'],['2023-01-01','2023'],['2024-01-01','2024'],['2025-01-01','Early 2025'],['2025-07-01','Mid 2025'],['2026-01-01','Early 2026'],['2026-06-01','Mid 2026']];
function returningData(){const from=lsGet('tf-ret-from','')||'';const updates=from?RET_UPD.filter(u=>u[0]>=from).map(([d,n,t])=>({date:fdate(d),n,t})):[];
  const quests=RET_Q.map(([n,why,d])=>{return {n,why,done:qDone(n),isNew:!!from&&!!d&&d>=from}});
  /* with no quest progress at all (never synced, nothing ticked), assume the quests that were out before you stopped are done */
  const known=!!P.at||quests.some(q=>q.done);const todo=quests.filter(q=>!q.done&&(known||!from||q.isNew));
  return {from,options:RET_FROM.map(([value,label])=>({value,label})),updates,quests:todo.slice(0,8),moreQuests:Math.max(0,todo.length-8),questsDone:quests.filter(q=>q.done).length,questsTotal:quests.length,synced:!!P.at,assumed:!known&&!!from}}
Object.assign(window.TF,{returning:()=>returningData(),returningSet:v=>{lsSet('tf-ret-from',String(v||''));tfNotify()}});
