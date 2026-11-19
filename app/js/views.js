// views.js — the roadmap to the platinum and the missables briefing, both built from trophies.json.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const STAGES = [
  { title: 'Stage 1 — Story sweep, Chapters 1 to 5',
    why: 'Play the campaign first: every story trophy is unmissable, and everything you do on the way is counted by the 100% checklist later. Do not skip the Chapter 1 balcony meditation (tagged possibly missable). Keep cheats off, since they disable trophies and saving.',
    pick: (t) => t.kind === 'story' || t.name === 'Positive Mental Attitude' },
  { title: 'Stage 2 — Partner crime and money',
    why: 'Once Jason and Lucia are together after Coffee Break in Chapter 2, the partner-only trophies open up, and the app-based money jobs (garages, Scooter Bros, fences) pay for the shop spending trophy.',
    pick: (t) => ['Hot Together', 'Retail Therapy', 'Treat Yo Self', 'Little Boxes', 'On the Spot', 'Dime on the Dollar', 'Personal Best', 'Actions Speak Louder', 'Gunslinger', 'Whip It Good'].includes(t.name) },
  { title: 'Stage 3 — Strangers and freaks',
    why: 'Each stranger strand ends in a trophy, and several feed the 100% checklist (Randy\'s cars, Kenton\'s wrecks, Bret\'s hunts). All of them stay open after the story, so a missed text is not lost forever.',
    pick: (t) => t.kind === 'stranger' },
  { title: 'Stage 4 — Activities, collectibles and scans',
    why: 'The grind that the checklist demands in full: 42 shooting-range golds, 42 drone races, 250 stunts, 100 WAiNK scans, 3 card sets, 18 meditations. Do these with a map open and knock them out region by region.',
    pick: (t) => ['activity', 'collectible', 'challenge', 'exploration'].includes(t.kind) },
  { title: 'Stage 5 — Robberies, 100% and clean-up',
    why: 'Vaults, gang operations and armored trucks last: the loot pays for Little Boxes and Treat Yo Self, and the same jobs fill the robbery rows of the 100% checklist on the way to A Long Road and the platinum.',
    pick: (t) => ['robbery', 'progress', 'money', 'misc', 'combat', 'platinum'].includes(t.kind) },
];

export function renderRoadmap(host, trophies, state, onChange) {
  const rows = STAGES.map((s, i) => {
    const items = trophies.filter((t) => s.pick(t) && t.kind !== 'platinum');
    const done = items.filter((t) => state[t.name]?.earned).length;
    return `<section class="stage">
      <h2>${esc(s.title)} <small style="color:var(--dim);font-size:13px">${done}/${items.length} earned</small></h2>
      <p class="why">${esc(s.why)}</p>
      <ol>${items.map((t) => {
        const on = !!state[t.name]?.earned;
        const tail = t.count ? ` — ${esc(t.count)}` : (t.chapter !== 'any' ? ` — Chapter ${esc(t.chapter)}` : '');
        return `<li class="${on ? 'done' : ''}"><span class="rt">${on ? '✔ ' : ''}${esc(t.name)}</span> <span class="rn">(${esc(t.grade)})${tail}</span></li>`;
      }).join('')}</ol></section>`;
  }).join('');
  host.innerHTML = `<div class="banner"><strong>Before you start:</strong> one playthrough is all you get — no difficulty settings, no New Game+, no mission replays. Cheats disable trophies and saving. Nothing on the 100% checklist is missable, but the Chapter 1 meditation with Lucia may be, so take it.</div>${rows}`;
  if (onChange) host.querySelectorAll('li').forEach((li) => li.addEventListener('click', () => {}));
}

export function renderMissables(host, trophies, state) {
  const flagged = trophies.filter((t) => t.missable);
  const cards = flagged.map((t) => `<article class="card misscard" style="margin:10px 0">
      <div class="cardhead"><span class="chip ${t.grade}">${t.grade}</span>
        <div><p class="tname">${esc(t.name)}</p><p class="tdesc">${esc(t.description)}</p></div></div>
      <div class="tags"><span class="tag warn">${t.missable === 'possibly' ? 'Possibly missable' : 'Missable'}</span>${t.chapter !== 'any' ? `<span class="tag">Chapter ${esc(t.chapter)}</span>` : ''}</div>
      <p class="guide" style="font-size:13.5px">${esc(t.guide)}</p></article>`).join('');
  host.innerHTML = `<div class="banner"><strong>Read this before Chapter 1.</strong> Grand Theft Auto VI has no mission replay and no second playthrough that carries progress, so anything tied to a one-time story moment can be lost for that save. The trophies below are the ones guides flag as missable or possibly missable. Everything else — robberies, collectibles, races, strangers — stays open in free roam after the credits. Cheats disable trophies and saving, so never use them on a trophy run.</div>
    <h2 style="margin-top:22px;color:var(--pink)">Flagged trophies (${flagged.length})</h2>${cards}
    <p class="hint">Flags built from the official descriptions plus the missable notes on gta.guide and GTABase; where a site hedges ("may be missable"), the hedge is kept here rather than invented away.</p>`;
}
