/* Bonificação PVE · cada indicador pontua sozinho. A régua publicada fica em bonus-pve.json. */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.melvinBonusPve = api;
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', api.mount);
        else api.mount();
    }
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const KEY = 'melvinBonusPve.v2';
    const TOKEN_KEY = 'melvinHireGithubToken';
    const GH_OWNER = 'JM7Consulting';
    const GH_REPO = 'melvin-revops-book';
    const GH_BRANCH = 'main';
    const GH_FILE = 'bonus-pve.json';
    const REMOTE_URL = 'https://raw.githubusercontent.com/' + GH_OWNER + '/' + GH_REPO + '/' + GH_BRANCH + '/' + GH_FILE;

    const MONTHS_PT = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const BR_HOLIDAYS = new Set([
        '2026-01-01', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04',
        '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25',
        '2027-01-01', '2027-02-08', '2027-02-09', '2027-03-26', '2027-04-21', '2027-05-01', '2027-06-03',
        '2027-09-07', '2027-10-12', '2027-11-02', '2027-11-15', '2027-11-20', '2027-12-25'
    ]);

    const LINE_DEFS = [
        { id: 'actTotal', label: 'Atividades concluídas', note: 'Total', unit: 'n' },
        { id: 'actLatePct', label: 'Atividades concluídas com atraso', note: '', unit: 'pct', sense: 'down' },
        { id: 'callsStarted', label: 'Ligações iniciadas', note: '', unit: 'n' },
        { id: 'callsPicked', label: 'Ligações atendidas', note: '', unit: 'n' },
        { id: 'callsLong', label: 'Ligações atendidas (+30s)', note: '', unit: 'n' },
        { id: 'meetingsBooked', label: 'Reuniões agendadas', note: 'Total', unit: 'n' },
        { id: 'meetQuality', label: 'Qualidade de Reuniões', note: '', unit: 'pct' },
        { id: 'revenueNew', label: 'Faturamento', note: 'Novo', unit: 'brl' },
        { id: 'salesTotal', label: 'Vendas', note: 'Total', unit: 'n' }
    ];

    const POINT_BANDS = [
        { from: 0, to: 79, value: 0, label: 'Nenhuma' },
        { from: 80, to: 100, value: 2, label: 'Fácil' },
        { from: 101, to: 115, value: 4, label: 'Difícil' },
        { from: 116, to: 130, value: 6, label: 'Bem difícil' },
        { from: 131, to: 150, value: 8, label: 'Desafiador' }
    ];

    function num(v, fallback) {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }
    function blankCfg(def) {
        return {
            meta: 0, min: 80, max: 150, weight: 0,
            sense: def && def.sense === 'down' ? 'down' : 'up',
            unit: def && (def.unit === 'pct' || def.unit === 'brl') ? def.unit : 'n'
        };
    }
    function blankActuals() {
        const o = {};
        LINE_DEFS.forEach((line) => { o[line.id] = 0; });
        return o;
    }
    function defaultLines() {
        const o = {};
        LINE_DEFS.forEach((line) => { o[line.id] = blankCfg(line); });
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
    function monthLabel(key) {
        const p = parseMonthKey(key);
        if (!p) return key;
        return MONTHS_PT[p.month - 1] + ' ' + p.year;
    }
    function shiftMonth(key, delta) {
        const p = parseMonthKey(key);
        return monthKeyFromDate(new Date(p.year, p.month - 1 + delta, 1));
    }

    function defaultState() {
        const key = monthKeyFromDate(new Date());
        return {
            rev: 2,
            person: '',
            activeMonth: key,
            updatedAt: null,
            lines: defaultLines(),
            months: {
                [key]: { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null }
            }
        };
    }

    function normalizeState(raw) {
        const base = defaultState();
        if (!raw || raw.rev !== 2) return base;
        base.person = raw.person ? String(raw.person) : '';
        base.updatedAt = raw.updatedAt || null;
        if (raw.activeMonth && parseMonthKey(raw.activeMonth)) base.activeMonth = raw.activeMonth;
        LINE_DEFS.forEach((line) => {
            const src = raw.lines && raw.lines[line.id] ? raw.lines[line.id] : {};
            const fallbackSense = line.sense === 'down' ? 'down' : 'up';
            const fallbackUnit = line.unit === 'pct' || line.unit === 'brl' ? line.unit : 'n';
            base.lines[line.id] = {
                meta: Math.max(0, num(src.meta, 0)),
                min: Math.max(0, num(src.min, 80)),
                max: Math.max(0, num(src.max, 150)),
                weight: Math.max(0, num(src.weight, 0)),
                sense: src.sense === 'down' || src.sense === 'up' ? src.sense : fallbackSense,
                unit: src.unit === 'n' || src.unit === 'pct' || src.unit === 'brl' ? src.unit : fallbackUnit
            };
        });
        base.months = {};
        const months = raw.months && typeof raw.months === 'object' ? raw.months : {};
        Object.keys(months).forEach((k) => {
            if (!parseMonthKey(k)) return;
            const m = months[k] || {};
            const actuals = blankActuals();
            LINE_DEFS.forEach((line) => {
                if (m.actuals && m.actuals[line.id] != null) actuals[line.id] = Math.max(0, num(m.actuals[line.id], 0));
            });
            base.months[k] = {
                actuals,
                elapsedOverride: m.elapsedOverride == null ? null : num(m.elapsedOverride, null),
                workdaysOverride: m.workdaysOverride == null ? null : num(m.workdaysOverride, null)
            };
        });
        if (!base.months[base.activeMonth]) {
            base.months[base.activeMonth] = { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null };
        }
        return base;
    }

    function attainRatio(actual, meta, sense) {
        if (!(meta > 0)) return null;
        if (sense === 'down') {
            if (!(actual > 0)) return Infinity;
            return meta / actual;
        }
        return actual / meta;
    }

    function clampAttain(real, minPct, maxPct) {
        if (real == null) return 0;
        const min = minPct / 100;
        const max = maxPct / 100;
        if (!Number.isFinite(real)) return max;
        if (real < min) return 0;
        if (real > max) return max;
        return real;
    }

    function bandFor(points) {
        const p = Math.max(0, Math.round(num(points, 0)));
        for (let i = 0; i < POINT_BANDS.length; i++) {
            if (p >= POINT_BANDS[i].from && p <= POINT_BANDS[i].to) return POINT_BANDS[i];
        }
        return POINT_BANDS[POINT_BANDS.length - 1];
    }

    function scoreLine(def, cfg, actual) {
        const meta = num(cfg.meta, 0);
        const min = num(cfg.min, 0);
        const max = num(cfg.max, 0);
        const weight = num(cfg.weight, 0);
        const sense = cfg.sense === 'down' || cfg.sense === 'up' ? cfg.sense : (def.sense === 'down' ? 'down' : 'up');
        const unit = cfg.unit === 'n' || cfg.unit === 'pct' || cfg.unit === 'brl' ? cfg.unit : (def.unit === 'pct' || def.unit === 'brl' ? def.unit : 'n');
        const real = attainRatio(actual, meta, sense);
        const limited = clampAttain(real, min, max);
        const points = (weight / 100) * limited * 100;
        return { id: def.id, actual, meta, min, max, weight, sense, unit, real, limited, points, ready: meta > 0 };
    }

    function compute(actuals, lines, elapsed, workdays) {
        const a = Object.assign(blankActuals(), actuals || {});
        const cfg = lines || defaultLines();
        const rows = LINE_DEFS.map((def) => scoreLine(def, cfg[def.id] || blankCfg(), num(a[def.id], 0)));
        const rawTotal = rows.reduce((s, row) => s + row.points, 0);
        const total = Math.round(rawTotal);
        const band = bandFor(total);
        const weightSum = rows.reduce((s, row) => s + row.weight, 0);
        let projected = null;
        const el = Math.max(0, num(elapsed, 0));
        const wd = Math.max(0, num(workdays, 0));
        if (el > 0 && el < wd) {
            const paced = {};
            LINE_DEFS.forEach((def) => {
                const value = num(a[def.id], 0);
                const rowCfg = cfg[def.id] || blankCfg(def);
                const unit = rowCfg.unit === 'pct' || rowCfg.unit === 'brl' || rowCfg.unit === 'n' ? rowCfg.unit : def.unit;
                paced[def.id] = unit === 'pct' ? value : value / el * wd;
            });
            const proj = compute(paced, cfg, wd, wd);
            projected = { total: proj.total, bonus: proj.total * proj.band.value, band: proj.band };
        }
        return {
            rows, total, rawTotal, band, bonus: total * band.value, weightSum,
            elapsed: el, workdays: wd, projected
        };
    }

    function fmt1(n) {
        return num(n, 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    function fmtN(n, digits) {
        return num(n, 0).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    }
    function fmtPct(ratio, digits) {
        if (ratio == null || !Number.isFinite(ratio)) return '—';
        const d = digits == null ? 1 : digits;
        return (ratio * 100).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
    }
    function fmtBRL(n) {
        return num(n, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    function fmtValue(unit, n) {
        if (unit === 'brl') return fmtBRL(n);
        if (unit === 'pct') return fmt1(n) + '%';
        return fmt1(n);
    }
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function heat(real) {
        if (real == null || real <= 0) return 'zero';
        if (!Number.isFinite(real)) return 'high';
        if (real < 0.8) return 'low';
        if (real < 1) return 'mid';
        if (real < 1.2) return 'ok';
        return 'high';
    }

    let state = null;
    let tab = 'planilha';
    let dirty = false;
    let remoteSha = null;
    let syncStatus = 'Carregando a régua publicada…';
    let syncBusy = false;
    let showToken = false;

    function loadLocal() {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return defaultState();
            return normalizeState(JSON.parse(raw));
        } catch (e) {
            return defaultState();
        }
    }
    function saveLocal() {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
    function ensureMonth(key) {
        if (!state.months[key]) {
            state.months[key] = { actuals: blankActuals(), elapsedOverride: null, workdaysOverride: null };
        }
        return state.months[key];
    }
    function monthContext(today) {
        const parsed = parseMonthKey(state.activeMonth) || parseMonthKey(monthKeyFromDate(today));
        const autoWd = countWorkdays(parsed.year, parsed.month);
        const autoEl = countElapsed(parsed.year, parsed.month, today);
        const rec = ensureMonth(state.activeMonth);
        return {
            rec,
            workdays: rec.workdaysOverride == null ? autoWd : num(rec.workdaysOverride, autoWd),
            elapsed: rec.elapsedOverride == null ? autoEl : num(rec.elapsedOverride, autoEl)
        };
    }
    function stamp() {
        state.updatedAt = new Date().toISOString();
        dirty = true;
        saveLocal();
    }

    function sanitizeToken(value) {
        return String(value || '').replace(/^\s*Bearer\s+/i, '').replace(/["'`]/g, '').trim();
    }
    function getToken() {
        try { return sanitizeToken(localStorage.getItem(TOKEN_KEY) || ''); } catch (e) { return ''; }
    }
    function setToken(value) {
        const t = sanitizeToken(value);
        try {
            if (t) localStorage.setItem(TOKEN_KEY, t);
            else localStorage.removeItem(TOKEN_KEY);
        } catch (e) {}
    }
    function utf8ToB64(str) {
        const bytes = new TextEncoder().encode(str);
        let bin = '';
        bytes.forEach((b) => { bin += String.fromCharCode(b); });
        return btoa(bin);
    }
    function b64ToUtf8(b64) {
        const bin = atob(String(b64 || '').replace(/\s/g, ''));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder().decode(bytes);
    }
    function ghHeaders(token) {
        const h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
        if (token) h.Authorization = 'Bearer ' + token;
        return h;
    }

    async function pullRemote() {
        const res = await fetch(REMOTE_URL + '?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) return null;
        return normalizeState(await res.json());
    }

    async function publish() {
        const token = getToken();
        if (!token) {
            showToken = true;
            syncStatus = 'Para o time ver, cole o token do GitHub (o mesmo da matriz de contratação) e salve de novo.';
            render(document.getElementById('pveRoot'));
            return;
        }
        syncBusy = true;
        syncStatus = 'Publicando no Book…';
        render(document.getElementById('pveRoot'));
        try {
            const url = 'https://api.github.com/repos/' + GH_OWNER + '/' + GH_REPO + '/contents/' + GH_FILE;
            const got = await fetch(url + '?ref=' + GH_BRANCH, { headers: ghHeaders(token) });
            const meta = await got.json().catch(() => ({}));
            if (got.ok) remoteSha = meta.sha;
            else if (got.status !== 404) throw new Error(meta.message || ('GitHub ' + got.status));
            state.updatedAt = new Date().toISOString();
            const body = {
                message: 'Atualiza a planilha de bonificação PVE',
                content: utf8ToB64(JSON.stringify(state, null, 2) + '\n'),
                branch: GH_BRANCH
            };
            if (remoteSha) body.sha = remoteSha;
            const put = await fetch(url, {
                method: 'PUT',
                headers: Object.assign(ghHeaders(token), { 'Content-Type': 'application/json' }),
                body: JSON.stringify(body)
            });
            const data = await put.json().catch(() => ({}));
            if (!put.ok) throw new Error(data.message || ('GitHub ' + put.status));
            remoteSha = data.content && data.content.sha ? data.content.sha : remoteSha;
            dirty = false;
            saveLocal();
            syncStatus = 'Publicado. Quem abrir a página vê estes números.';
        } catch (err) {
            syncStatus = 'Não publicou: ' + (err && err.message ? err.message : 'erro') + '. Se o arquivo mudou, clique em Atualizar.';
        }
        syncBusy = false;
        render(document.getElementById('pveRoot'));
    }

    async function refreshFromBook() {
        syncBusy = true;
        syncStatus = 'Atualizando…';
        render(document.getElementById('pveRoot'));
        try {
            const remote = await pullRemote();
            if (!remote) {
                syncStatus = 'Ainda não há régua publicada. Salve para o time quando terminar de configurar.';
            } else {
                state = remote;
                dirty = false;
                saveLocal();
                syncStatus = 'Régua do Book carregada' + (state.updatedAt ? ' · ' + new Date(state.updatedAt).toLocaleString('pt-BR') : '') + '.';
            }
        } catch (err) {
            syncStatus = 'Não deu para atualizar agora.';
        }
        syncBusy = false;
        render(document.getElementById('pveRoot'));
    }

    function inputNum(lineId, field, value, step) {
        const shown = value === 0 && (field === 'meta' || field === 'weight' || field === 'actual') ? '' : String(value);
        const ph = field === 'meta' ? 'meta' : (field === 'weight' ? 'peso' : '0');
        return `<input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="${ph}" data-pve-line="${esc(lineId)}" data-pve-field="${field}" value="${esc(shown)}">`;
    }

    function dailyOf(total, days) {
        if (!(days > 0)) return null;
        return num(total, 0) / days;
    }

    function weightStatus(sum) {
        const rounded = Math.round(num(sum, 0) * 10) / 10;
        if (Math.abs(rounded - 100) < 0.05) {
            return { cls: 'is-ok', text: 'Peso total em 100%.' };
        }
        if (rounded > 100) {
            return { cls: 'is-over', text: 'Peso total em ' + fmt1(rounded) + '%. Não pode passar de 100%.' };
        }
        return { cls: 'is-under', text: 'Peso total em ' + fmt1(rounded) + '%. Falta ' + fmt1(100 - rounded) + '% para fechar 100%.' };
    }

    function unitMark(unit) {
        if (unit === 'pct') return '%';
        if (unit === 'brl') return 'R$';
        return '';
    }

    function entryHtml(lineId, field, value, unit) {
        const mark = unitMark(unit);
        const cls = mark ? 'pve-entry pve-entry--mark' : 'pve-entry';
        return `<span class="${cls}">${inputNum(lineId, field, value, 'any')}${mark ? `<span class="pve-unit">${mark}</span>` : ''}</span>`;
    }

    function rowHtml(def, row, elapsed, workdays) {
        const realShown = row.ready ? esc(fmtPct(row.real, 1)) : '<span class="cli-empty-cell">sem meta</span>';
        const limCell = row.ready ? esc(fmtPct(row.limited, 1)) : '—';
        const dayHit = dailyOf(row.actual, elapsed);
        const dayMeta = dailyOf(row.meta, workdays);
        const note = def.note ? `<small class="pve-tag">${esc(def.note)}</small>` : '';
        const sense = row.sense === 'down' ? 'down' : 'up';
        const unit = row.unit === 'pct' || row.unit === 'brl' ? row.unit : 'n';
        const rate = unit === 'pct';
        const hitCells = rate
            ? `<td class="pve-num pve-col-hit pve-span" colspan="2">${entryHtml(def.id, 'actual', row.actual, unit)}</td>`
            : `<td class="pve-num pve-col-hit">${entryHtml(def.id, 'actual', row.actual, unit)}</td><td class="pve-num pve-col-hit" data-pve-cell="day-actual">${dayHit == null ? '—' : esc(fmtValue(unit, dayHit))}</td>`;
        const metaCells = rate
            ? `<td class="pve-num pve-col-meta pve-span" colspan="2">${entryHtml(def.id, 'meta', row.meta, unit)}</td>`
            : `<td class="pve-num pve-col-meta">${entryHtml(def.id, 'meta', row.meta, unit)}</td><td class="pve-num pve-col-meta" data-pve-cell="day-meta">${dayMeta == null ? '—' : esc(fmtValue(unit, dayMeta))}</td>`;
        return `<tr class="is-leaf heat-${heat(row.real)}" data-pve-row="${esc(def.id)}">
            <td class="pve-ind">
                <span class="pve-ind-name"><strong>${esc(def.label)}</strong>${note}</span>
                <select class="pve-format" data-pve-line="${esc(def.id)}" data-pve-field="unit" aria-label="Formato de ${esc(def.label)}">
                    <option value="n"${unit === 'n' ? ' selected' : ''}>Número</option>
                    <option value="pct"${unit === 'pct' ? ' selected' : ''}>Percentual</option>
                    <option value="brl"${unit === 'brl' ? ' selected' : ''}>Reais</option>
                </select>
            </td>
            <td class="pve-sense-cell"><select class="pve-sense${sense === 'down' ? ' pve-sense--down' : ''}" data-pve-line="${esc(def.id)}" data-pve-field="sense" aria-label="Sentido da meta de ${esc(def.label)}">
                <option value="up"${sense === 'up' ? ' selected' : ''}>Maior melhor</option>
                <option value="down"${sense === 'down' ? ' selected' : ''}>Menor melhor</option>
            </select></td>
            ${hitCells}
            ${metaCells}
            <td class="pve-num" data-pve-cell="real">${realShown}</td>
            <td class="pve-num">${inputNum(def.id, 'min', row.min, '0.1')}</td>
            <td class="pve-num">${inputNum(def.id, 'max', row.max, '0.1')}</td>
            <td class="pve-num" data-pve-cell="limited">${limCell}</td>
            <td class="pve-num">${inputNum(def.id, 'weight', row.weight, '0.1')}</td>
            <td class="pve-num pve-pts" data-pve-cell="points">${esc(fmt1(row.points))}</td>
        </tr>`;
    }

    function renderSheet(model) {
        const rows = LINE_DEFS.map((def, i) => rowHtml(def, model.rows[i], model.elapsed, model.workdays)).join('');
        const peso = weightStatus(model.weightSum);
        return `
            <p class="pve-weight ${peso.cls}" data-pve-weight-msg>${esc(peso.text)}</p>
            <div class="pve-sheet-wrap">
                <table class="pve-sheet pve-sheet--score">
                    <colgroup>
                        <col class="pve-c-ind"><col class="pve-c-sense">
                        <col class="pve-c-num"><col class="pve-c-day">
                        <col class="pve-c-num"><col class="pve-c-day">
                        <col class="pve-c-real"><col class="pve-c-min"><col class="pve-c-max"><col class="pve-c-lim"><col class="pve-c-peso"><col class="pve-c-pts">
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="pve-th-ind" rowspan="2">Indicador</th>
                            <th rowspan="2">Sentido</th>
                            <th class="pve-h-hit" colspan="2">Atingido</th>
                            <th class="pve-h-meta" colspan="2">Meta</th>
                            <th rowspan="2">Ating. real</th>
                            <th rowspan="2">Mín %</th>
                            <th rowspan="2">Máx %</th>
                            <th rowspan="2">Com limitador</th>
                            <th rowspan="2">Peso %</th>
                            <th rowspan="2">Pontos</th>
                        </tr>
                        <tr>
                            <th class="pve-h-hit">Mês</th>
                            <th class="pve-h-hit">Média/dia</th>
                            <th class="pve-h-meta">Mês</th>
                            <th class="pve-h-meta">Média/dia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr class="is-total">
                            <td class="pve-ind">Total</td>
                            <td></td>
                            <td class="pve-col-hit"></td><td class="pve-col-hit"></td>
                            <td class="pve-col-meta"></td><td class="pve-col-meta"></td>
                            <td></td><td></td><td></td><td></td>
                            <td class="pve-num ${peso.cls}" data-pve-total-weight>${esc(fmt1(model.weightSum))}%</td>
                            <td class="pve-num pve-pts" data-pve-total-points>${esc(String(model.total))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="pve-foot">O formato fica sob o nome do indicador: Número, Percentual ou Reais. Em percentual, o mês ocupa as colunas de média: não existe média por dia. Maior melhor: atingimento real = atingido ÷ meta. Menor melhor: atingimento real = meta ÷ atingido. Exemplo de atraso: 10% atingido com meta de 40% vale 400% e trava no máximo. Atingido zero, quando menor é melhor, também trava no máximo. A pontuação só começa no mínimo. Pontos da linha = peso × atingimento com limitador. Nas demais linhas, a média do atingido usa os dias úteis já decorridos e a média da meta usa os dias úteis do mês. O peso das linhas precisa fechar 100%.</p>`;
    }

    function renderBands(model) {
        return `
            <div class="pve-bands">
                <table class="pve-sheet pve-sheet--bands">
                    <thead><tr><th>Faixa de pontuação</th><th>Valor do ponto</th><th>Bônus de</th><th>Bônus até</th><th>Dificuldade</th></tr></thead>
                    <tbody>
                        ${POINT_BANDS.map((b) => `<tr class="${model.band.from === b.from ? 'is-on' : ''}">
                            <td>${b.from} até ${b.to}</td>
                            <td>${esc(fmtBRL(b.value))}</td>
                            <td>${esc(fmtBRL(b.from * b.value))}</td>
                            <td>${esc(fmtBRL(b.to * b.value))}</td>
                            <td>${esc(b.label)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                <p class="pve-note">Bônus = pontuação arredondada × valor do ponto da faixa.</p>
            </div>`;
    }

    function renderHistory(today) {
        const keys = Object.keys(state.months).sort().reverse();
        const rows = keys.map((k) => {
            const rec = state.months[k];
            const p = parseMonthKey(k);
            const wd = rec.workdaysOverride == null ? countWorkdays(p.year, p.month) : rec.workdaysOverride;
            const el = rec.elapsedOverride == null ? countElapsed(p.year, p.month, today) : rec.elapsedOverride;
            const m = compute(rec.actuals, state.lines, el, wd);
            return `<tr class="${k === state.activeMonth ? 'is-on' : ''}">
                <td><button type="button" class="pve-link" data-pve-open="${esc(k)}">${esc(monthLabel(k))}</button></td>
                <td>${m.total}</td>
                <td>${esc(fmtBRL(m.bonus))}</td>
                <td>${esc(m.band.label)}</td>
                <td>${el}/${wd}</td>
            </tr>`;
        }).join('');
        return `<div class="pve-hist"><table class="pve-sheet"><thead><tr><th>Mês</th><th>Pontos</th><th>Bônus</th><th>Faixa</th><th>Dias</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    function parseLoose(raw) {
        const s = String(raw == null ? '' : raw).trim().replace(/\s/g, '').replace(',', '.');
        if (s === '' || s === '.') return 0;
        const n = Number(s);
        return Number.isFinite(n) ? Math.max(0, n) : 0;
    }

    function paintDerived(host) {
        if (!host || !state || tab !== 'planilha') return;
        const today = new Date();
        const ctx = monthContext(today);
        const model = compute(ctx.rec.actuals, state.lines, ctx.elapsed, ctx.workdays);
        const pace = ctx.workdays > 0 ? ctx.elapsed / ctx.workdays : 0;
        const peso = weightStatus(model.weightSum);
        LINE_DEFS.forEach((def, i) => {
            const row = model.rows[i];
            const tr = host.querySelector(`tr[data-pve-row="${def.id}"]`);
            if (!tr) return;
            tr.className = 'is-leaf heat-' + heat(row.real);
            const dayHit = dailyOf(row.actual, model.elapsed);
            const dayMeta = dailyOf(row.meta, model.workdays);
            const dayHitEl = tr.querySelector('[data-pve-cell="day-actual"]');
            const dayMetaEl = tr.querySelector('[data-pve-cell="day-meta"]');
            const realEl = tr.querySelector('[data-pve-cell="real"]');
            const limEl = tr.querySelector('[data-pve-cell="limited"]');
            const ptsEl = tr.querySelector('[data-pve-cell="points"]');
            const senseEl = tr.querySelector('[data-pve-field="sense"]');
            if (senseEl) senseEl.classList.toggle('pve-sense--down', row.sense === 'down');
            if (dayHitEl) dayHitEl.textContent = dayHit == null ? '—' : fmtValue(row.unit, dayHit);
            if (dayMetaEl) dayMetaEl.textContent = dayMeta == null ? '—' : fmtValue(row.unit, dayMeta);
            if (realEl) {
                realEl.textContent = '';
                if (row.ready) realEl.textContent = fmtPct(row.real, 1);
                else realEl.innerHTML = '<span class="cli-empty-cell">sem meta</span>';
            }
            if (limEl) limEl.textContent = row.ready ? fmtPct(row.limited, 1) : '—';
            if (ptsEl) ptsEl.textContent = fmt1(row.points);
        });
        const weightEl = host.querySelector('[data-pve-total-weight]');
        if (weightEl) {
            weightEl.textContent = fmt1(model.weightSum) + '%';
            weightEl.className = 'pve-num ' + peso.cls;
        }
        const totalEl = host.querySelector('[data-pve-total-points]');
        if (totalEl) totalEl.textContent = String(model.total);
        const msg = host.querySelector('[data-pve-weight-msg]');
        if (msg) {
            msg.textContent = peso.text;
            msg.className = 'pve-weight ' + peso.cls;
        }
        const setKpi = (name, text) => {
            const el = host.querySelector(`[data-pve-kpi="${name}"]`);
            if (el) el.textContent = text;
        };
        setKpi('points', String(model.total));
        setKpi('points-sub', 'soma ' + fmt1(model.rawTotal) + ' · peso ' + fmt1(model.weightSum) + '%');
        setKpi('bonus', fmtBRL(model.bonus));
        setKpi('bonus-sub', fmtBRL(model.band.value) + ' / ponto · ' + model.band.label);
        setKpi('pace', fmtPct(pace, 0));
        setKpi('pace-sub', ctx.elapsed + ' de ' + ctx.workdays + ' dias úteis');
        const projCard = host.querySelector('[data-pve-kpi-card="proj"]');
        if (projCard) projCard.classList.toggle('is-muted', !model.projected);
        setKpi('proj', model.projected ? String(model.projected.total) : '—');
        setKpi('proj-sub', model.projected ? fmtBRL(model.projected.bonus) + ' se o volume se manter' : 'Percentuais não são projetados');
        const bar = host.querySelector('.pve-sync');
        if (bar) bar.classList.toggle('is-dirty', dirty);
        const status = host.querySelector('.pve-sync-status');
        if (status) status.textContent = syncStatus;
    }

    function noteLocalEdit(host, rebuild) {
        stamp();
        syncStatus = 'Alteração neste navegador. Salve para todos verem.';
        if (rebuild) render(host);
        else paintDerived(host);
    }

    function render(host) {
        if (!host || !state) return;
        const today = new Date();
        const ctx = monthContext(today);
        const model = compute(ctx.rec.actuals, state.lines, ctx.elapsed, ctx.workdays);
        const pace = ctx.workdays > 0 ? ctx.elapsed / ctx.workdays : 0;
        const tokenBox = showToken ? `<div class="pve-sync-box">
            <p>O token fica só neste navegador. Use o mesmo da matriz de contratação, com permissão de escrita no Book.</p>
            <input type="password" data-pve-token placeholder="ghp_… ou github_pat_…" autocomplete="off">
            <button type="button" class="pve-btn" data-pve="save-token">Guardar token</button>
        </div>` : '';
        host.innerHTML = `
            <div class="pve-sync ${dirty ? 'is-dirty' : ''}">
                <span class="pve-sync-status">${esc(syncStatus)}</span>
                <button type="button" class="pve-btn" data-pve="publish" ${syncBusy ? 'disabled' : ''}>Salvar para todos</button>
                <button type="button" class="pve-btn pve-btn--ghost" data-pve="refresh" ${syncBusy ? 'disabled' : ''}>Atualizar</button>
                <button type="button" class="pve-btn pve-btn--ghost" data-pve="token">${showToken ? 'Fechar' : 'Token'}</button>
            </div>
            ${tokenBox}
            <div class="pve-toolbar">
                <label class="pve-field"><span>BDR</span><input type="text" data-pve="person" value="${esc(state.person)}" maxlength="40" autocomplete="off"></label>
                <div class="pve-month">
                    <button type="button" class="pve-ico" data-pve="prev-month" aria-label="Mês anterior">‹</button>
                    <strong>${esc(monthLabel(state.activeMonth))}</strong>
                    <button type="button" class="pve-ico" data-pve="next-month" aria-label="Próximo mês">›</button>
                </div>
                <label class="pve-field pve-field--n"><span>Dias úteis</span><input type="text" inputmode="numeric" autocomplete="off" data-pve="workdays" value="${ctx.workdays}"></label>
                <label class="pve-field pve-field--n"><span>Dias decorridos</span><input type="text" inputmode="numeric" autocomplete="off" data-pve="elapsed" value="${ctx.elapsed}"></label>
            </div>
            <div class="pve-kpis">
                <article class="pve-kpi"><span>Pontuação</span><strong data-pve-kpi="points">${model.total}</strong><small data-pve-kpi="points-sub">soma ${esc(fmt1(model.rawTotal))} · peso ${esc(fmt1(model.weightSum))}%</small></article>
                <article class="pve-kpi"><span>Bônus estimado</span><strong data-pve-kpi="bonus">${esc(fmtBRL(model.bonus))}</strong><small data-pve-kpi="bonus-sub">${esc(fmtBRL(model.band.value))} / ponto · ${esc(model.band.label)}</small></article>
                <article class="pve-kpi"><span>Ritmo do mês</span><strong data-pve-kpi="pace">${esc(fmtPct(pace, 0))}</strong><small data-pve-kpi="pace-sub">${ctx.elapsed} de ${ctx.workdays} dias úteis</small></article>
                <article class="pve-kpi ${model.projected ? '' : 'is-muted'}" data-pve-kpi-card="proj"><span>Projeção</span><strong data-pve-kpi="proj">${model.projected ? model.projected.total : '—'}</strong><small data-pve-kpi="proj-sub">${model.projected ? esc(fmtBRL(model.projected.bonus)) + ' se o volume se manter' : 'Percentuais não são projetados'}</small></article>
            </div>
            <div class="pve-tabs" role="tablist">
                <button type="button" class="pve-tab ${tab === 'planilha' ? 'is-active' : ''}" data-pve-tab="planilha">Planilha</button>
                <button type="button" class="pve-tab ${tab === 'ponto' ? 'is-active' : ''}" data-pve-tab="ponto">Valor do ponto</button>
                <button type="button" class="pve-tab ${tab === 'historico' ? 'is-active' : ''}" data-pve-tab="historico">Histórico</button>
            </div>
            ${tab === 'planilha' ? renderSheet(model) : ''}
            ${tab === 'ponto' ? renderBands(model) : ''}
            ${tab === 'historico' ? renderHistory(today) : ''}
            <div class="pve-actions">
                <button type="button" class="pve-btn pve-btn--warn" data-pve="reset-month">Zerar atingidos deste mês</button>
            </div>`;
    }

    function bind(host) {
        if (!host || host.dataset.pveBound === '1') return;
        host.dataset.pveBound = '1';
        host.addEventListener('input', (e) => {
            const t = e.target;
            if (t.matches('[data-pve="person"]')) {
                state.person = t.value;
                noteLocalEdit(host);
                return;
            }
            if (t.matches('[data-pve="workdays"]') || t.matches('[data-pve="elapsed"]')) {
                const rec = ensureMonth(state.activeMonth);
                const field = t.getAttribute('data-pve') === 'workdays' ? 'workdaysOverride' : 'elapsedOverride';
                rec[field] = t.value === '' ? null : Math.max(0, parseLoose(t.value));
                noteLocalEdit(host);
                return;
            }
            if (t.matches('[data-pve-line]')) {
                const id = t.getAttribute('data-pve-line');
                const field = t.getAttribute('data-pve-field');
                if (field === 'sense') {
                    if (state.lines[id]) state.lines[id].sense = t.value === 'down' ? 'down' : 'up';
                    noteLocalEdit(host);
                    return;
                }
                if (field === 'unit') {
                    const unit = t.value === 'pct' || t.value === 'brl' ? t.value : 'n';
                    if (state.lines[id]) state.lines[id].unit = unit;
                    noteLocalEdit(host, true);
                    return;
                }
                const value = parseLoose(t.value);
                if (field === 'actual') ensureMonth(state.activeMonth).actuals[id] = value;
                else if (state.lines[id]) state.lines[id][field] = value;
                noteLocalEdit(host);
            }
        });
        host.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-pve], [data-pve-tab], [data-pve-open]');
            if (!btn || btn.disabled) return;
            if (btn.hasAttribute('data-pve-tab')) {
                tab = btn.getAttribute('data-pve-tab');
                render(host);
                return;
            }
            if (btn.hasAttribute('data-pve-open')) {
                state.activeMonth = btn.getAttribute('data-pve-open');
                ensureMonth(state.activeMonth);
                tab = 'planilha';
                stamp();
                render(host);
                return;
            }
            const act = btn.getAttribute('data-pve');
            if (act === 'prev-month' || act === 'next-month') {
                state.activeMonth = shiftMonth(state.activeMonth, act === 'next-month' ? 1 : -1);
                ensureMonth(state.activeMonth);
                stamp();
                render(host);
            } else if (act === 'reset-month') {
                if (!confirm('Zerar os atingidos de ' + monthLabel(state.activeMonth) + '? Metas e pesos permanecem.')) return;
                ensureMonth(state.activeMonth).actuals = blankActuals();
                stamp();
                syncStatus = 'Atingidos zerados neste navegador. Salve para todos verem.';
                render(host);
            } else if (act === 'publish') publish();
            else if (act === 'refresh') refreshFromBook();
            else if (act === 'token') {
                showToken = !showToken;
                render(host);
            } else if (act === 'save-token') {
                const input = host.querySelector('[data-pve-token]');
                setToken(input ? input.value : '');
                showToken = false;
                syncStatus = getToken() ? 'Token guardado neste navegador. Pode salvar para todos.' : 'Token removido.';
                render(host);
            }
        });
    }

    function mount() {
        const host = document.getElementById('pveRoot');
        if (!host) return;
        state = loadLocal();
        bind(host);
        render(host);
        pullRemote().then((remote) => {
            if (!remote) {
                syncStatus = 'Ainda não há régua publicada. Configure as metas e salve para todos.';
                render(host);
                return;
            }
            const remoteAt = remote.updatedAt || '';
            const localAt = state.updatedAt || '';
            if (!dirty || remoteAt >= localAt) {
                state = remote;
                dirty = false;
                saveLocal();
                syncStatus = 'Régua compartilhada' + (remote.updatedAt ? ' · ' + new Date(remote.updatedAt).toLocaleString('pt-BR') : '') + '.';
            } else {
                syncStatus = 'Você tem alterações locais mais novas que o Book. Salve para todos, ou atualize para descartar.';
            }
            render(host);
        }).catch(() => {
            syncStatus = 'Sem conexão com a régua publicada. Os números deste navegador continuam aqui.';
            render(host);
        });
    }

    return { mount, compute, countWorkdays, countElapsed, LINE_DEFS, POINT_BANDS, defaultState };
});
