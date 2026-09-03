/* Bonificação PVE · Melvin — réplica da planilha (aba SETEMBRO + Valor do Ponto) */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.melvinBonusPve = api;
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', api.mount);
        else api.mount();
    }
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const KEY = 'melvinBonusPve.v1';
    const MONTHS_PT = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

    /* Feriados nacionais usados no calendário de dias úteis (2026–2027). */
    const BR_HOLIDAYS = new Set([
        '2026-01-01', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04',
        '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25',
        '2027-01-01', '2027-02-08', '2027-02-09', '2027-03-26', '2027-04-21', '2027-05-01', '2027-06-03',
        '2027-09-07', '2027-10-12', '2027-11-02', '2027-11-15', '2027-11-20', '2027-12-25'
    ]);

    const ACTUAL_KEYS = [
        'discovery', 'activities', 'callsStarted', 'callsAnswered',
        'meetingsBooked', 'meetingsHeld', 'qualityHot', 'qualityWarm', 'qualityCold',
        'salesBdr', 'salesCs', 'salesIn'
    ];

    const POINT_BANDS = [
        { from: 0, to: 79, value: 0, label: 'Nenhuma' },
        { from: 80, to: 100, value: 2, label: 'Fácil' },
        { from: 101, to: 115, value: 4, label: 'Difícil' },
        { from: 116, to: 130, value: 6, label: 'Bem difícil' },
        { from: 131, to: 150, value: 8, label: 'Desafiador' }
    ];

    function defaultRegra() {
        return {
            daily: { discovery: 5, activities: 50, callsStarted: 12, callsAnswered: 3 },
            control: { meetingsBooked: 10, heldRate: 0.7, salesRate: 0.15 },
            mix: {
                qualityHot: 0.5, qualityWarm: 0.3, qualityCold: 0.2,
                salesBdr: 0.6, salesCs: 0.3, salesIn: 0.1
            },
            gates: { minPoints: 88, maxPoints: 147 },
            leaf: {
                discovery: { min: 0.7, max: 1.4, weight: 0.04 },
                activities: { min: 0.8, max: 1.5, weight: 0.25 },
                callsStarted: { min: 0.8, max: 1.5, weight: 0.2 },
                callsAnswered: { min: 0.7, max: 1.4, weight: 0.15 },
                meetingsBooked: { min: 0.8, max: 1.5, weight: 0.1 },
                meetingsHeld: { min: 0.8, max: 1.5, weight: 0.05 },
                qualityHot: { min: 0.8, max: 1.5, weight: 0.1 },
                qualityWarm: { min: 0.8, max: 1.5, weight: 0.05 },
                qualityCold: { min: 0.9, max: 1.5, weight: 0.05 },
                salesBdr: { min: 0.7, max: 1.4, weight: 0.02 },
                salesCs: { min: 0.8, max: 1.5, weight: 0.02 },
                salesIn: { min: 0.7, max: 1.4, weight: 0.02 }
            }
        };
    }

    function blankActuals() {
        const o = {};
        ACTUAL_KEYS.forEach((k) => { o[k] = 0; });
        return o;
    }

    function monthKeyFromDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    }

    function parseMonthKey(key) {
        const m = String(key || '').match(/^(\d{4})-(\d{2})$/);
        if (!m) return null;
        return { year: Number(m[1]), month: Number(m[2]) };
    }

    function isoDay(d) {
        const p = (n) => String(n).padStart(2, '0');
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }

    function isBusinessDay(d) {
        const wd = d.getDay();
        if (wd === 0 || wd === 6) return false;
        return !BR_HOLIDAYS.has(isoDay(d));
    }

    function countWorkdays(year, month) {
        const last = new Date(year, month, 0).getDate();
        let n = 0;
        for (let day = 1; day <= last; day++) {
            if (isBusinessDay(new Date(year, month - 1, day))) n += 1;
        }
        return n;
    }

    function countElapsed(year, month, today) {
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        if (y < year || (y === year && m < month)) return 0;
        const lastDay = (y === year && m === month) ? today.getDate() : new Date(year, month, 0).getDate();
        let n = 0;
        for (let day = 1; day <= lastDay; day++) {
            if (isBusinessDay(new Date(year, month - 1, day))) n += 1;
        }
        return n;
    }

    function num(v, fallback) {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }

    function clampAttain(real, min, max) {
        if (!Number.isFinite(real) || real < min) return 0;
        if (real > max) return max;
        return real;
    }

    function bandFor(points) {
        const p = Math.max(0, Math.round(num(points, 0)));
        for (let i = 0; i < POINT_BANDS.length; i++) {
            const b = POINT_BANDS[i];
            if (p >= b.from && p <= b.to) return b;
        }
        return POINT_BANDS[POINT_BANDS.length - 1];
    }

    function leafRow(id, label, actual, monthMeta, min, max, weight, elapsed, workdays) {
        const dailyPace = elapsed > 0 ? actual / elapsed : 0;
        const dailyMeta = workdays > 0 ? monthMeta / workdays : 0;
        const real = monthMeta > 0 ? actual / monthMeta : 0;
        const limited = clampAttain(real, min, max);
        return {
            id, label, kind: 'leaf', actual, dailyPace, monthMeta, dailyMeta,
            real, min, max, limited, weight, points: weight * limited * 100
        };
    }

    function groupRow(id, label, children, elapsed, workdays, scored) {
        const actual = children.reduce((s, x) => s + x.actual, 0);
        const monthMeta = children.reduce((s, x) => s + x.monthMeta, 0);
        const weight = children.reduce((s, x) => s + x.weight, 0);
        const min = children.reduce((s, x) => s + x.min, 0) / children.length;
        const max = children.reduce((s, x) => s + x.max, 0) / children.length;
        const dailyPace = elapsed > 0 ? actual / elapsed : 0;
        const dailyMeta = workdays > 0 ? monthMeta / workdays : 0;
        const real = monthMeta > 0 ? actual / monthMeta : 0;
        const limited = clampAttain(real, min, max);
        return {
            id, label, kind: 'group', scored: scored !== false, children,
            actual, dailyPace, monthMeta, dailyMeta, real, min, max, limited, weight,
            points: weight * limited * 100
        };
    }

    function compute(actuals, regra, elapsed, workdays) {
        const a = Object.assign(blankActuals(), actuals || {});
        const r = regra || defaultRegra();
        const wd = Math.max(0, num(workdays, 0));
        const el = Math.max(0, num(elapsed, 0));
        const d = r.daily;
        const c = r.control;
        const mix = r.mix;
        const L = r.leaf;

        const metaBooked = num(c.meetingsBooked, 10);
        const metaHeld = metaBooked * num(c.heldRate, 0.7);
        const metaSales = metaHeld * num(c.salesRate, 0.15);

        const discovery = leafRow('discovery', 'Descoberta decisor (nome, cargo)', num(a.discovery, 0), d.discovery * wd, L.discovery.min, L.discovery.max, L.discovery.weight, el, wd);
        const activities = leafRow('activities', 'Concluídas', num(a.activities, 0), d.activities * wd, L.activities.min, L.activities.max, L.activities.weight, el, wd);
        const callsStarted = leafRow('callsStarted', 'Iniciadas', num(a.callsStarted, 0), d.callsStarted * wd, L.callsStarted.min, L.callsStarted.max, L.callsStarted.weight, el, wd);
        const callsAnswered = leafRow('callsAnswered', 'Atendidas — mais de 30 segundos', num(a.callsAnswered, 0), d.callsAnswered * wd, L.callsAnswered.min, L.callsAnswered.max, L.callsAnswered.weight, el, wd);
        const meetingsBooked = leafRow('meetingsBooked', 'Agendadas', num(a.meetingsBooked, 0), metaBooked, L.meetingsBooked.min, L.meetingsBooked.max, L.meetingsBooked.weight, el, wd);
        const meetingsHeld = leafRow('meetingsHeld', 'Realizadas', num(a.meetingsHeld, 0), metaHeld, L.meetingsHeld.min, L.meetingsHeld.max, L.meetingsHeld.weight, el, wd);
        const qualityHot = leafRow('qualityHot', 'Quente (50%)', num(a.qualityHot, 0), metaBooked * mix.qualityHot, L.qualityHot.min, L.qualityHot.max, L.qualityHot.weight, el, wd);
        const qualityWarm = leafRow('qualityWarm', 'Morna (30%)', num(a.qualityWarm, 0), metaBooked * mix.qualityWarm, L.qualityWarm.min, L.qualityWarm.max, L.qualityWarm.weight, el, wd);
        const qualityCold = leafRow('qualityCold', 'Fria (20%)', num(a.qualityCold, 0), metaBooked * mix.qualityCold, L.qualityCold.min, L.qualityCold.max, L.qualityCold.weight, el, wd);
        const salesBdr = leafRow('salesBdr', 'BDR (Outbound puro) (60%)', num(a.salesBdr, 0), metaSales * mix.salesBdr, L.salesBdr.min, L.salesBdr.max, L.salesBdr.weight, el, wd);
        const salesCs = leafRow('salesCs', 'CS (30%)', num(a.salesCs, 0), metaSales * mix.salesCs, L.salesCs.min, L.salesCs.max, L.salesCs.weight, el, wd);
        const salesIn = leafRow('salesIn', 'Inbound (10%)', num(a.salesIn, 0), metaSales * mix.salesIn, L.salesIn.min, L.salesIn.max, L.salesIn.weight, el, wd);

        const groups = [
            groupRow('g-discovery', 'Enriquecimento de Leads', [discovery], el, wd, true),
            groupRow('g-activities', 'Atividades Concluídas', [activities], el, wd, true),
            groupRow('g-calls', 'Ligações', [callsStarted, callsAnswered], el, wd, true),
            groupRow('g-booked', 'Reuniões Agendadas', [meetingsBooked], el, wd, true),
            groupRow('g-held', 'Reuniões Realizadas', [meetingsHeld], el, wd, false),
            groupRow('g-quality', 'Qualidade Reuniões', [qualityHot, qualityWarm, qualityCold], el, wd, true),
            groupRow('g-sales', 'Vendas', [salesBdr, salesCs, salesIn], el, wd, true)
        ];

        const rawTotal = groups.filter((g) => g.scored).reduce((s, g) => s + g.points, 0);
        const total = Math.round(rawTotal);
        const band = bandFor(total);
        const bonus = total * band.value;
        const weightSum = groups.filter((g) => g.scored).reduce((s, g) => s + g.weight, 0);

        let projected = null;
        if (el > 0 && el < wd) {
            const paced = {};
            ACTUAL_KEYS.forEach((k) => { paced[k] = num(a[k], 0) / el * wd; });
            const proj = compute(paced, r, wd, wd);
            projected = { total: proj.total, bonus: proj.bonus, band: proj.band };
        }

        return {
            elapsed: el, workdays: wd, groups, total, rawTotal, band, bonus, weightSum,
            gates: r.gates, projected, control: {
                meetingsBooked: metaBooked,
                meetingsHeld: metaHeld,
                sales: metaSales,
                heldRate: c.heldRate,
                salesRate: c.salesRate
            }
        };
    }

    function defaultState() {
        const now = new Date();
        const key = monthKeyFromDate(now);
        return {
            rev: 1,
            person: 'Poliana',
            activeMonth: key,
            regra: defaultRegra(),
            months: {
                [key]: { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null, updatedAt: null }
            }
        };
    }

    function loadState() {
        const base = defaultState();
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return base;
            const saved = JSON.parse(raw);
            if (!saved || typeof saved !== 'object') return base;
            const next = defaultState();
            if (saved.person) next.person = String(saved.person);
            if (saved.activeMonth && parseMonthKey(saved.activeMonth)) next.activeMonth = saved.activeMonth;
            if (saved.regra) next.regra = mergeRegra(saved.regra);
            next.months = {};
            if (saved.months && typeof saved.months === 'object') {
                Object.keys(saved.months).forEach((k) => {
                    if (!parseMonthKey(k)) return;
                    const m = saved.months[k] || {};
                    next.months[k] = {
                        actuals: Object.assign(blankActuals(), m.actuals || {}),
                        elapsedOverride: m.elapsedOverride == null ? null : num(m.elapsedOverride, null),
                        workdaysOverride: m.workdaysOverride == null ? null : num(m.workdaysOverride, null),
                        updatedAt: m.updatedAt || null
                    };
                });
            }
            if (!next.months[next.activeMonth]) {
                next.months[next.activeMonth] = { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null, updatedAt: null };
            }
            return next;
        } catch (e) {
            return base;
        }
    }

    function mergeRegra(saved) {
        const d = defaultRegra();
        if (!saved || typeof saved !== 'object') return d;
        if (saved.daily) Object.assign(d.daily, saved.daily);
        if (saved.control) Object.assign(d.control, saved.control);
        if (saved.mix) Object.assign(d.mix, saved.mix);
        if (saved.gates) Object.assign(d.gates, saved.gates);
        if (saved.leaf) {
            Object.keys(d.leaf).forEach((k) => {
                if (saved.leaf[k]) Object.assign(d.leaf[k], saved.leaf[k]);
            });
        }
        return d;
    }

    function saveState(state) {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }

    function ensureMonth(state, key) {
        if (!state.months[key]) {
            state.months[key] = { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null, updatedAt: null };
        }
        return state.months[key];
    }

    function monthContext(state, today) {
        const parsed = parseMonthKey(state.activeMonth) || parseMonthKey(monthKeyFromDate(today));
        const autoWd = countWorkdays(parsed.year, parsed.month);
        const autoEl = countElapsed(parsed.year, parsed.month, today);
        const rec = ensureMonth(state, state.activeMonth);
        const workdays = rec.workdaysOverride == null ? autoWd : num(rec.workdaysOverride, autoWd);
        const elapsed = rec.elapsedOverride == null ? autoEl : num(rec.elapsedOverride, autoEl);
        return { parsed, autoWd, autoEl, rec, workdays, elapsed };
    }

    function fmtInt(n) {
        return Math.round(num(n, 0)).toLocaleString('pt-BR');
    }
    function fmt1(n) {
        return num(n, 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    function fmtN(n, digits) {
        return num(n, 0).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    }
    function fmtPct(n) {
        return Math.round(num(n, 0) * 100) + '%';
    }
    function fmtBRL(n) {
        return num(n, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function monthLabel(key) {
        const p = parseMonthKey(key);
        if (!p) return key;
        return MONTHS_PT[p.month - 1] + ' ' + p.year;
    }

    let state = null;
    let tab = 'planilha';

    function heat(real) {
        if (real <= 0) return 'zero';
        if (real < 0.8) return 'low';
        if (real < 1) return 'mid';
        if (real < 1.2) return 'ok';
        return 'high';
    }

    function shiftMonth(key, delta) {
        const p = parseMonthKey(key);
        const d = new Date(p.year, p.month - 1 + delta, 1);
        return monthKeyFromDate(d);
    }

    function render(root) {
        if (!root || !state) return;
        const today = new Date();
        const ctx = monthContext(state, today);
        const model = compute(ctx.rec.actuals, state.regra, ctx.elapsed, ctx.workdays);
        const updated = ctx.rec.updatedAt ? new Date(ctx.rec.updatedAt) : today;
        const pace = ctx.workdays > 0 ? ctx.elapsed / ctx.workdays : 0;
        const gateOk = model.total >= state.regra.gates.minPoints;

        root.innerHTML = `
            <div class="pve-toolbar">
                <label class="pve-field">
                    <span>BDR</span>
                    <input type="text" data-pve="person" value="${esc(state.person)}" maxlength="40" autocomplete="off">
                </label>
                <div class="pve-month">
                    <button type="button" class="pve-ico" data-pve="prev-month" aria-label="Mês anterior">‹</button>
                    <strong>${esc(monthLabel(state.activeMonth))}</strong>
                    <button type="button" class="pve-ico" data-pve="next-month" aria-label="Próximo mês">›</button>
                </div>
                <label class="pve-field pve-field--n">
                    <span>Dias úteis</span>
                    <input type="number" min="1" max="31" step="1" data-pve="workdays" value="${ctx.workdays}">
                    <em>${ctx.rec.workdaysOverride == null ? 'auto' : 'manual'}</em>
                </label>
                <label class="pve-field pve-field--n">
                    <span>Dias decorridos</span>
                    <input type="number" min="0" max="31" step="1" data-pve="elapsed" value="${ctx.elapsed}">
                    <em>${ctx.rec.elapsedOverride == null ? 'auto' : 'manual'}</em>
                </label>
                <p class="pve-stamp">Atualizado ${esc(updated.toLocaleDateString('pt-BR'))} ${esc(updated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))}</p>
            </div>

            <div class="pve-kpis">
                <article class="pve-kpi">
                    <span>Pontuação</span>
                    <strong data-heat="${heat(model.total / 100)}">${esc(fmtInt(model.total))}</strong>
                    <small>mín. ${esc(String(state.regra.gates.minPoints))} · máx. ${esc(String(state.regra.gates.maxPoints))}</small>
                </article>
                <article class="pve-kpi">
                    <span>Bônus estimado</span>
                    <strong>${esc(fmtBRL(model.bonus))}</strong>
                    <small>${esc(fmtBRL(model.band.value))} / ponto · ${esc(model.band.label)}</small>
                </article>
                <article class="pve-kpi">
                    <span>Ritmo do mês</span>
                    <strong>${esc(fmtPct(pace))}</strong>
                    <small>${esc(String(ctx.elapsed))} de ${esc(String(ctx.workdays))} dias úteis</small>
                </article>
                <article class="pve-kpi ${model.projected ? '' : 'is-muted'}">
                    <span>Projeção no ritmo atual</span>
                    <strong>${model.projected ? esc(fmtInt(model.projected.total)) : '—'}</strong>
                    <small>${model.projected ? esc(fmtBRL(model.projected.bonus)) + ' se o ritmo se manter' : 'Fim do mês ou ainda sem dias decorridos'}</small>
                </article>
            </div>
            <p class="pve-gate ${gateOk ? 'is-ok' : 'is-wait'}">${gateOk
                ? 'Acima da pontuação mínima da régua (' + state.regra.gates.minPoints + ').'
                : 'Abaixo da pontuação mínima da régua (' + state.regra.gates.minPoints + '). O bônus ainda segue a faixa do ponto — a mínima é só referência da planilha.'}</p>

            <div class="pve-tabs" role="tablist">
                <button type="button" class="pve-tab ${tab === 'planilha' ? 'is-active' : ''}" data-pve-tab="planilha">Planilha</button>
                <button type="button" class="pve-tab ${tab === 'ponto' ? 'is-active' : ''}" data-pve-tab="ponto">Valor do ponto</button>
                <button type="button" class="pve-tab ${tab === 'regua' ? 'is-active' : ''}" data-pve-tab="regua">Régua</button>
                <button type="button" class="pve-tab ${tab === 'historico' ? 'is-active' : ''}" data-pve-tab="historico">Histórico</button>
            </div>

            ${tab === 'planilha' ? renderSheet(model, ctx) : ''}
            ${tab === 'ponto' ? renderBands(model) : ''}
            ${tab === 'regua' ? renderRegra(state.regra, model) : ''}
            ${tab === 'historico' ? renderHistory(state, today) : ''}
        `;
    }

    function renderSheet(model, ctx) {
        const rows = model.groups.map((g) => {
            const groupHtml = rowHtml(g, true, !g.scored);
            const kids = g.children.map((c) => rowHtml(c, false, !g.scored)).join('');
            return groupHtml + kids;
        }).join('');
        return `
            <div class="pve-sheet-wrap">
                <table class="pve-sheet">
                    <thead>
                        <tr>
                            <th class="pve-th-ind">Indicadores</th>
                            <th colspan="2">Atingido</th>
                            <th colspan="2">Metas</th>
                            <th rowspan="2">Ating. real</th>
                            <th colspan="2">Limitadores</th>
                            <th rowspan="2">Ating. com limitador</th>
                            <th rowspan="2">Peso</th>
                            <th rowspan="2">Pontuação ponderada</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Mês</th>
                            <th>Diária</th>
                            <th>Mês</th>
                            <th>Diária</th>
                            <th>Mín</th>
                            <th>Máx</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="pve-side">
                <article>
                    <h3>Ponderações</h3>
                    <ul>${model.groups.filter((g) => g.scored).map((g) => `<li><span>${esc(g.label)}</span><b>${esc(fmtPct(g.weight))}</b></li>`).join('')}
                        <li class="pve-total"><span>Total</span><b>${esc(fmtPct(model.weightSum))}</b></li>
                    </ul>
                </article>
                <article>
                    <h3>Controle</h3>
                    <ul>
                        <li><span>Reuniões agendadas</span><b>${esc(fmtN(model.control.meetingsBooked, 1))}</b></li>
                        <li><span>Reuniões realizadas (${esc(fmtPct(model.control.heldRate))})</span><b>${esc(fmtN(model.control.meetingsHeld, 1))}</b></li>
                        <li><span>Vendas (${esc(fmtPct(model.control.salesRate))} das realizadas)</span><b>${esc(fmtN(model.control.sales, 1))}</b></li>
                    </ul>
                    <p class="pve-note">Reuniões realizadas entram no acompanhamento e não na pontuação de 100% — igual à planilha.</p>
                </article>
            </div>
            <div class="pve-actions">
                <button type="button" class="pve-btn pve-btn--ghost" data-pve="reset-days">Voltar dias úteis/decorridos para automático</button>
                <button type="button" class="pve-btn pve-btn--warn" data-pve="reset-month">Zerar atingidos deste mês</button>
                <button type="button" class="pve-btn" data-pve="export">Exportar JSON</button>
                <label class="pve-btn pve-btn--ghost pve-file">Importar JSON<input type="file" accept="application/json" data-pve="import" hidden></label>
            </div>
            <p class="pve-foot">Números ficam neste navegador (mês a mês). Bitrix ainda não alimenta a planilha — lance o realizado à mão. Fórmulas iguais à aba SETEMBRO + Valor do Ponto.</p>
        `;
    }

    function rowHtml(row, isGroup, excluded) {
        const cls = [
            isGroup ? 'is-group' : 'is-leaf',
            excluded ? 'is-excluded' : '',
            'heat-' + heat(row.real)
        ].filter(Boolean).join(' ');
        const label = isGroup
            ? `<strong>${esc(row.label)}</strong>${excluded ? ' <em>fora da pontuação</em>' : ''}`
            : esc(row.label);
        const actualCell = isGroup
            ? `<td class="pve-num">${esc(fmtInt(row.actual))}</td>`
            : `<td class="pve-num"><input type="number" min="0" step="any" inputmode="decimal" data-pve-actual="${esc(row.id)}" value="${esc(String(num(row.actual, 0)))}"></td>`;
        const points = isGroup ? fmt1(row.points) : '';
        return `<tr class="${cls}">
            <td class="pve-ind">${label}</td>
            ${actualCell}
            <td class="pve-num">${esc(fmt1(row.dailyPace))}</td>
            <td class="pve-num">${esc(row.monthMeta >= 10 ? fmtInt(row.monthMeta) : fmtN(row.monthMeta, row.monthMeta < 1 ? 2 : 1))}</td>
            <td class="pve-num">${esc(fmt1(row.dailyMeta))}</td>
            <td class="pve-num">${esc(fmtPct(row.real))}</td>
            <td class="pve-num">${esc(fmtPct(row.min))}</td>
            <td class="pve-num">${esc(fmtPct(row.max))}</td>
            <td class="pve-num">${esc(fmtPct(row.limited))}</td>
            <td class="pve-num">${esc(fmtPct(row.weight))}</td>
            <td class="pve-num pve-pts">${esc(points)}</td>
        </tr>`;
    }

    function renderBands(model) {
        return `
            <div class="pve-bands">
                <table class="pve-sheet pve-sheet--bands">
                    <thead>
                        <tr>
                            <th>Faixa de pontuação</th>
                            <th>Valor do ponto</th>
                            <th>Bônus de</th>
                            <th>Bônus até</th>
                            <th>Dificuldade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${POINT_BANDS.map((b) => {
                            const on = model.band.from === b.from;
                            return `<tr class="${on ? 'is-on' : ''}">
                                <td>${esc(String(b.from))} até ${esc(String(b.to))}</td>
                                <td>${esc(fmtBRL(b.value))}</td>
                                <td>${esc(fmtBRL(b.from * b.value))}</td>
                                <td>${esc(fmtBRL(b.to * b.value))}</td>
                                <td>${esc(b.label)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
                <p class="pve-note">Bônus = pontuação arredondada × valor do ponto da faixa. Com 0 pontos a faixa é “Nenhuma”.</p>
            </div>`;
    }

    function renderRegra(regra, model) {
        const d = regra.daily;
        const c = regra.control;
        return `
            <div class="pve-regua">
                <p class="pve-note">A régua não zera com o mês — só os atingidos. Metas mensais = diária × dias úteis, salvo reuniões/vendas (controle).</p>
                <div class="pve-regua-grid">
                    <article>
                        <h3>Metas diárias</h3>
                        <label>Enriquecimento / dia <input type="number" min="0" step="0.1" data-pve-regra="daily.discovery" value="${d.discovery}"></label>
                        <label>Atividades / dia <input type="number" min="0" step="0.1" data-pve-regra="daily.activities" value="${d.activities}"></label>
                        <label>Ligações iniciadas / dia <input type="number" min="0" step="0.1" data-pve-regra="daily.callsStarted" value="${d.callsStarted}"></label>
                        <label>Ligações &gt;30s / dia <input type="number" min="0" step="0.1" data-pve-regra="daily.callsAnswered" value="${d.callsAnswered}"></label>
                    </article>
                    <article>
                        <h3>Controle de funil</h3>
                        <label>Reuniões agendadas / mês <input type="number" min="0" step="0.1" data-pve-regra="control.meetingsBooked" value="${c.meetingsBooked}"></label>
                        <label>Realizadas (% das agendadas) <input type="number" min="0" max="1" step="0.01" data-pve-regra="control.heldRate" value="${c.heldRate}"></label>
                        <label>Vendas (% das realizadas) <input type="number" min="0" max="1" step="0.01" data-pve-regra="control.salesRate" value="${c.salesRate}"></label>
                    </article>
                    <article>
                        <h3>Referência da planilha</h3>
                        <p>Peso total pontuável: <b>${esc(fmtPct(model.weightSum))}</b></p>
                        <p>Pont. mín. <b>${esc(String(regra.gates.minPoints))}</b> · Pont. máx. <b>${esc(String(regra.gates.maxPoints))}</b></p>
                        <button type="button" class="pve-btn pve-btn--ghost" data-pve="reset-regua">Restaurar régua original</button>
                    </article>
                </div>
            </div>`;
    }

    function renderHistory(st, today) {
        const keys = Object.keys(st.months).sort().reverse();
        if (!keys.length) return '<p class="pve-note">Nenhum mês lançado ainda.</p>';
        const rows = keys.map((k) => {
            const rec = st.months[k];
            const p = parseMonthKey(k);
            const wd = rec.workdaysOverride == null ? countWorkdays(p.year, p.month) : rec.workdaysOverride;
            const el = rec.elapsedOverride == null ? countElapsed(p.year, p.month, today) : rec.elapsedOverride;
            const m = compute(rec.actuals, st.regra, el, wd);
            const current = k === st.activeMonth;
            return `<tr class="${current ? 'is-on' : ''}">
                <td><button type="button" class="pve-link" data-pve-open="${esc(k)}">${esc(monthLabel(k))}</button></td>
                <td>${esc(fmtInt(m.total))}</td>
                <td>${esc(fmtBRL(m.bonus))}</td>
                <td>${esc(m.band.label)}</td>
                <td>${esc(String(el))}/${esc(String(wd))}</td>
            </tr>`;
        }).join('');
        return `
            <div class="pve-hist">
                <table class="pve-sheet">
                    <thead><tr><th>Mês</th><th>Pontos</th><th>Bônus</th><th>Faixa</th><th>Dias</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <p class="pve-note">Trocar o mês na barra de cima abre uma folha zerada. O histórico deste navegador permanece.</p>
            </div>`;
    }

    function setRegraPath(path, value) {
        const parts = path.split('.');
        let cur = state.regra;
        for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
        cur[parts[parts.length - 1]] = num(value, 0);
    }

    function bind(root) {
        if (!root || root.dataset.pveBound === '1') return;
        root.dataset.pveBound = '1';
        root.addEventListener('input', (e) => {
            const t = e.target;
            if (t.matches('[data-pve="person"]')) {
                state.person = t.value;
                saveState(state);
                return;
            }
            if (t.matches('[data-pve="workdays"]')) {
                const rec = ensureMonth(state, state.activeMonth);
                rec.workdaysOverride = t.value === '' ? null : Math.max(1, num(t.value, 21));
                rec.updatedAt = new Date().toISOString();
                saveState(state);
                render(root);
                return;
            }
            if (t.matches('[data-pve="elapsed"]')) {
                const rec = ensureMonth(state, state.activeMonth);
                rec.elapsedOverride = t.value === '' ? null : Math.max(0, num(t.value, 0));
                rec.updatedAt = new Date().toISOString();
                saveState(state);
                render(root);
                return;
            }
            if (t.matches('[data-pve-actual]')) {
                const rec = ensureMonth(state, state.activeMonth);
                rec.actuals[t.getAttribute('data-pve-actual')] = Math.max(0, num(t.value, 0));
                rec.updatedAt = new Date().toISOString();
                saveState(state);
                const keep = t;
                const start = t.selectionStart;
                render(root);
                const again = root.querySelector(`[data-pve-actual="${keep.getAttribute('data-pve-actual')}"]`);
                if (again) {
                    again.focus();
                    try { again.setSelectionRange(start, start); } catch (err) {}
                }
                return;
            }
            if (t.matches('[data-pve-regra]')) {
                const path = t.getAttribute('data-pve-regra');
                const start = t.selectionStart;
                setRegraPath(path, t.value);
                saveState(state);
                render(root);
                const again = root.querySelector(`[data-pve-regra="${path}"]`);
                if (again) {
                    again.focus();
                    try { again.setSelectionRange(start, start); } catch (err) {}
                }
            }
        });
        root.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-pve], [data-pve-tab], [data-pve-open]');
            if (!btn) return;
            if (btn.hasAttribute('data-pve-tab')) {
                tab = btn.getAttribute('data-pve-tab');
                render(root);
                return;
            }
            if (btn.hasAttribute('data-pve-open')) {
                state.activeMonth = btn.getAttribute('data-pve-open');
                ensureMonth(state, state.activeMonth);
                tab = 'planilha';
                saveState(state);
                render(root);
                return;
            }
            const act = btn.getAttribute('data-pve');
            if (act === 'prev-month' || act === 'next-month') {
                state.activeMonth = shiftMonth(state.activeMonth, act === 'next-month' ? 1 : -1);
                ensureMonth(state, state.activeMonth);
                saveState(state);
                render(root);
            } else if (act === 'reset-days') {
                const rec = ensureMonth(state, state.activeMonth);
                rec.elapsedOverride = null;
                rec.workdaysOverride = null;
                rec.updatedAt = new Date().toISOString();
                saveState(state);
                render(root);
            } else if (act === 'reset-month') {
                if (!confirm('Zerar os atingidos de ' + monthLabel(state.activeMonth) + '? A régua permanece.')) return;
                const rec = ensureMonth(state, state.activeMonth);
                rec.actuals = blankActuals();
                rec.updatedAt = new Date().toISOString();
                saveState(state);
                render(root);
            } else if (act === 'reset-regua') {
                if (!confirm('Restaurar a régua original da planilha Melvin?')) return;
                state.regra = defaultRegra();
                saveState(state);
                render(root);
            } else if (act === 'export') {
                const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'bonificacao-pve-melvin-' + state.activeMonth + '.json';
                a.click();
                URL.revokeObjectURL(a.href);
            }
        });
        root.addEventListener('change', (e) => {
            const t = e.target;
            if (!t.matches('[data-pve="import"]') || !t.files || !t.files[0]) return;
            const file = t.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result);
                    if (!parsed || !parsed.months) throw new Error('arquivo inválido');
                    localStorage.setItem(KEY, JSON.stringify(parsed));
                    state = loadState();
                    tab = 'planilha';
                    render(root);
                } catch (err) {
                    alert('Não deu para importar esse JSON.');
                }
            };
            reader.readAsText(file);
            t.value = '';
        });
    }

    function mount() {
        const root = document.getElementById('pveRoot');
        if (!root) return;
        state = loadState();
        bind(root);
        render(root);
    }

    return {
        mount,
        compute,
        countWorkdays,
        countElapsed,
        defaultRegra,
        POINT_BANDS
    };
});
