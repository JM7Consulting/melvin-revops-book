document.addEventListener('DOMContentLoaded', () => {
    const menuToggleFull = document.getElementById('menuToggleFull');
    const menuToggleMini = document.getElementById('menuToggleMini');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const menuTriggers = document.querySelectorAll('.menu-trigger');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleMenu() {
        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }

    if (menuToggleFull) menuToggleFull.addEventListener('click', toggleMenu);
    if (menuToggleMini) menuToggleMini.addEventListener('click', toggleMenu);

    function openMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('mobile-open');
        sidebar.classList.remove('collapsed');
        if (mainContent) mainContent.classList.remove('expanded');
        if (sidebarOverlay) sidebarOverlay.classList.add('visible');
    }

    function closeMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    menuTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('expanded');
            }
            const group = trigger.parentElement;
            group.classList.toggle('active');
            const arrow = trigger.querySelector('.arrow');
            if (arrow) arrow.textContent = group.classList.contains('active') ? '▲' : '▼';
        });
    });

    // Busca rápida no menu lateral
    const navSearchInput = document.getElementById('navSearchInput');
    const navSearchEmpty = document.getElementById('navSearchEmpty');
    function normalizeNavText(value) {
        return (value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }
    function resetNavFilter() {
        document.querySelectorAll('.nav-lane').forEach((lane) => lane.classList.remove('is-dimmed'));
        document.querySelectorAll('.menu-group, .menu-standalone').forEach((el) => {
            el.classList.remove('is-filtered-out');
        });
        document.querySelectorAll('.submenu a').forEach((a) => a.classList.remove('is-filter-hit'));
        if (navSearchEmpty) navSearchEmpty.hidden = true;
    }
    function runNavFilter(rawQuery) {
        const query = normalizeNavText(rawQuery);
        if (!query) {
            resetNavFilter();
            return;
        }
        let hits = 0;
        document.querySelectorAll('.nav-lane').forEach((lane) => {
            let laneHits = 0;
            lane.querySelectorAll('.menu-standalone').forEach((item) => {
                const match = normalizeNavText(item.textContent).includes(query);
                item.classList.toggle('is-filtered-out', !match);
                if (match) {
                    laneHits += 1;
                    hits += 1;
                }
            });
            lane.querySelectorAll('.menu-group').forEach((group) => {
                const triggerText = normalizeNavText(group.querySelector('.menu-trigger')?.textContent);
                const links = Array.from(group.querySelectorAll('.submenu a'));
                let groupHit = triggerText.includes(query);
                links.forEach((link) => {
                    const linkHit = normalizeNavText(link.textContent).includes(query);
                    link.classList.toggle('is-filter-hit', linkHit);
                    if (linkHit) groupHit = true;
                });
                group.classList.toggle('is-filtered-out', !groupHit);
                if (groupHit) {
                    laneHits += 1;
                    hits += 1;
                    group.classList.add('active');
                    const arrow = group.querySelector('.menu-trigger .arrow');
                    if (arrow) arrow.textContent = '▲';
                }
            });
            lane.classList.toggle('is-dimmed', laneHits === 0);
        });
        if (navSearchEmpty) navSearchEmpty.hidden = hits > 0;
    }
    if (navSearchInput) {
        navSearchInput.addEventListener('input', () => runNavFilter(navSearchInput.value));
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== navSearchInput && document.activeElement !== document.getElementById('siteSearchInput') && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const siteInput = document.getElementById('siteSearchInput');
                if (siteInput) {
                    siteInput.focus();
                    siteInput.select();
                    return;
                }
                if (sidebar?.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    if (mainContent) mainContent.classList.remove('expanded');
                }
                navSearchInput.focus();
                navSearchInput.select();
            }
            if (e.key === 'Escape' && document.activeElement === navSearchInput) {
                navSearchInput.value = '';
                resetNavFilter();
                navSearchInput.blur();
            }
        });
    }

    function setupSectionToggle(button, container) {
        if (button && container) {
            button.addEventListener('click', () => {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    button.textContent = 'Recolher';
                } else {
                    container.style.display = 'none';
                    button.textContent = 'Expandir';
                }
            });
        }
    }

    setupSectionToggle(document.getElementById('toggleMatrixBtn'), document.getElementById('matrixContainer'));
    setupSectionToggle(document.getElementById('toggleParteABtn'), document.getElementById('parteAContainer'));
    setupSectionToggle(document.getElementById('toggleParteBBtn'), document.getElementById('parteBContainer'));
    setupSectionToggle(document.getElementById('toggleOutFase1Btn'), document.getElementById('outFase1Container'));
    setupSectionToggle(document.getElementById('toggleOutFase2Btn'), document.getElementById('outFase2Container'));
    setupSectionToggle(document.getElementById('toggleOutFase3Btn'), document.getElementById('outFase3Container'));
    setupSectionToggle(document.getElementById('toggleOutConfBtn'), document.getElementById('outConfContainer'));
    setupSectionToggle(document.getElementById('toggleOutCancBtn'), document.getElementById('outCancContainer'));
    setupSectionToggle(document.getElementById('toggleOutNoshowBtn'), document.getElementById('outNoshowContainer'));
    setupSectionToggle(document.getElementById('toggleOutPosBtn'), document.getElementById('outPosContainer'));

    // Cadence Runway · jump highlight + expand collapsed phase on click
    (function initCxRunway() {
        document.querySelectorAll('.cx-runway').forEach((root) => {
            const jumps = Array.from(root.querySelectorAll('.cx-jump-item'));
            if (!jumps.length) return;
            const phases = jumps.map((a) => root.querySelector(a.getAttribute('href')) || document.querySelector(a.getAttribute('href'))).filter(Boolean);

            jumps.forEach((j) => {
                j.addEventListener('click', () => {
                    const target = root.querySelector(j.getAttribute('href')) || document.querySelector(j.getAttribute('href'));
                    if (!target) return;
                    const body = target.querySelector('.cx-phase-body, .timeline-wrapper');
                    const btn = target.querySelector('.section-toggle-btn');
                    if (body && body.style.display === 'none') {
                        body.style.display = 'block';
                        if (btn) btn.textContent = 'Recolher';
                    }
                });
            });

            if (!('IntersectionObserver' in window)) return;
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = '#' + entry.target.id;
                    jumps.forEach((j) => j.classList.toggle('is-active', j.getAttribute('href') === id));
                });
            }, { rootMargin: '-30% 0px -55% 0px', threshold: 0.05 });
            phases.forEach((p) => io.observe(p));
        });
    })();

// Contratação BDR · abas principais + subabas (#job-bdr)
    (function initHireTabs() {
        const root = document.getElementById('job-bdr');
        if (!root) return;
        const HIRE_VIEW_KEY = 'melvinHireTabs.v1';

        function readHireView() {
            try { return JSON.parse(localStorage.getItem(HIRE_VIEW_KEY) || 'null'); } catch (e) { return null; }
        }
        function writeHireView(partial) {
            try {
                const cur = readHireView() || {};
                localStorage.setItem(HIRE_VIEW_KEY, JSON.stringify(Object.assign(cur, partial, { ts: Date.now() })));
            } catch (e) {}
        }

        function activateTabGroup(tabAttr, panelAttr, id) {
            if (!id) return false;
            const tabs = root.querySelectorAll(`[${tabAttr}]`);
            const panels = root.querySelectorAll(`[${panelAttr}]`);
            const has = [...tabs].some((t) => t.getAttribute(tabAttr) === id);
            if (!has) return false;
            tabs.forEach((t) => {
                const on = t.getAttribute(tabAttr) === id;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const match = panel.getAttribute(panelAttr) === id;
                panel.classList.toggle('is-active', match);
                if (match) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
            return true;
        }

        const MATRIX_SEL = ['ranking', 'planilha', 'comparar', 'pesos'];

        function normalizeSelTab(id) {
            if (!id) return 'cvs';
            if (id === 'matriz') return 'ranking';
            return id;
        }

        function activateSelTab(id) {
            id = normalizeSelTab(id);
            const tabs = root.querySelectorAll('[data-sel-tab]');
            const panels = root.querySelectorAll('[data-sel-panel]');
            const has = [...tabs].some((t) => t.getAttribute('data-sel-tab') === id);
            if (!has) return false;
            tabs.forEach((t) => {
                const on = t.getAttribute('data-sel-tab') === id;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const pid = panel.getAttribute('data-sel-panel');
                const match = pid === id || (pid === 'matriz' && MATRIX_SEL.includes(id));
                panel.classList.toggle('is-active', match);
                if (match) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
            if (MATRIX_SEL.includes(id) && typeof window.melvinHireMatrix?.setView === 'function') {
                try { window.melvinHireMatrix.setView(id); } catch (e) {}
            }
            writeHireView({ selTab: id });
            return true;
        }

        function wireTabs(tabAttr, panelAttr, saveKey) {
            const tabs = root.querySelectorAll(`[${tabAttr}]`);
            if (!tabs.length) return;
            tabs.forEach((tab) => {
                tab.addEventListener('click', () => {
                    const id = tab.getAttribute(tabAttr);
                    if (tabAttr === 'data-sel-tab') {
                        activateSelTab(id);
                    } else {
                        activateTabGroup(tabAttr, panelAttr, id);
                        if (saveKey) writeHireView({ [saveKey]: id });
                    }
                    if (typeof scheduleSaveView === 'function') scheduleSaveView();
                    else if (typeof saveView === 'function') saveView(window.location.hash);
                });
            });
        }

        wireTabs('data-hire-tab', 'data-hire-panel', 'hireTab');
        wireTabs('data-jd-tab', 'data-jd-panel', 'jdTab');
        wireTabs('data-sel-tab', 'data-sel-panel', 'selTab');

        const cvBrowser = root.querySelector('#cvBrowser');
        let showCv = null;
        if (cvBrowser) {
            const navList = cvBrowser.querySelector('.cv-nav-list');
            if (navList) {
                function firstNameKey(s) {
                    const first = String(s || '').trim().split(/\s+/)[0] || '';
                    return first.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                }
                const sorted = [...navList.querySelectorAll('[data-cv-nav]')].sort((a, b) => {
                    const na = a.querySelector('.cv-nav-name')?.textContent || '';
                    const nb = b.querySelector('.cv-nav-name')?.textContent || '';
                    const byFirst = firstNameKey(na).localeCompare(firstNameKey(nb), 'pt-BR');
                    return byFirst !== 0 ? byFirst : na.localeCompare(nb, 'pt-BR', { sensitivity: 'base' });
                });
                sorted.forEach((btn) => navList.appendChild(btn));
            }
            const navItems = cvBrowser.querySelectorAll('[data-cv-nav]');
            const sheets = cvBrowser.querySelectorAll('[data-cv-sheet]');
            showCv = function (id) {
                if (!id) return;
                navItems.forEach((n) => n.classList.toggle('is-active', n.getAttribute('data-cv-nav') === id));
                sheets.forEach((sheet) => {
                    const match = sheet.getAttribute('data-cv-sheet') === id;
                    sheet.classList.toggle('is-active', match);
                    if (match) {
                        sheet.removeAttribute('hidden');
                        sheet.style.display = 'block';
                    } else {
                        sheet.setAttribute('hidden', '');
                        sheet.style.display = 'none';
                    }
                });
                writeHireView({ cvId: id });
            };
            const savedHire = readHireView();
            const firstId = savedHire && savedHire.cvId && root.querySelector(`[data-cv-nav="${savedHire.cvId}"]`)
                ? savedHire.cvId
                : navItems[0]?.getAttribute('data-cv-nav');
            if (firstId) showCv(firstId);
            navItems.forEach((btn) => {
                btn.addEventListener('click', () => showCv(btn.getAttribute('data-cv-nav')));
            });
        }

        function restoreHireTabs(saved) {
            const snap = saved || readHireView() || {};
            if (snap.hireTab) activateTabGroup('data-hire-tab', 'data-hire-panel', snap.hireTab);
            if (snap.hireTab === 'jd' && snap.jdTab) activateTabGroup('data-jd-tab', 'data-jd-panel', snap.jdTab);
            if (snap.hireTab === 'selecao') {
                const sel = normalizeSelTab(snap.selTab || 'cvs');
                activateSelTab(sel);
                if (sel === 'cvs' && snap.cvId && showCv) showCv(snap.cvId);
            }
            if (typeof window.melvinHireMatrix?.refresh === 'function') {
                try { window.melvinHireMatrix.refresh(); } catch (e) {}
            }
        }

        window.melvinRestoreHireTabs = restoreHireTabs;
        window.melvinActivateSelTab = activateSelTab;
        // Restaura abas do seletivo após o boot (F5)
        setTimeout(() => restoreHireTabs(), 80);
    })();

    // D1–D35 Outbound · Fluxo Sinais / Régua tabs
    (function initOutCadTabs() {
        const root = document.getElementById('wf-contato-nutricao-out');
        if (!root) return;
        const tabs = root.querySelectorAll('[data-outcad-tab]');
        const panels = root.querySelectorAll('[data-outcad-panel]');
        const detailsRoot = root.querySelector('#outSigDetails');
        const TAB_KEY = 'melvinOutCadTab.v1';
        const phaseMap = {
            'out-fase-quente': { btn: 'toggleOutFase1Btn', box: 'outFase1Container' },
            'out-fase-frio': { btn: 'toggleOutFase2Btn', box: 'outFase2Container' },
            'out-fase-nutricao': { btn: 'toggleOutFase3Btn', box: 'outFase3Container' }
        };

        function expandPhase(anchorId) {
            const map = phaseMap[anchorId];
            if (!map) return;
            const box = document.getElementById(map.box);
            const btn = document.getElementById(map.btn);
            if (box && box.style.display === 'none') {
                box.style.display = 'block';
                if (btn) btn.textContent = 'Recolher';
            }
        }

        function closeDetails() {
            if (!detailsRoot) return;
            detailsRoot.querySelectorAll('.out-sig-detail.is-open').forEach((el) => el.classList.remove('is-open'));
            root.querySelectorAll('[data-sig-stage].is-active').forEach((el) => {
                el.classList.remove('is-active');
                if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
            });
        }

        function openDetail(stage) {
            if (!detailsRoot || !stage) return;
            const panel = detailsRoot.querySelector(`[data-sig-detail="${stage}"]`);
            if (!panel) return;

            const alreadyOpen = panel.classList.contains('is-open');
            closeDetails();
            if (alreadyOpen) return;

            panel.classList.add('is-open');
            root.querySelectorAll('[data-sig-stage], [data-sig-go]').forEach((el) => {
                const on = el.getAttribute('data-sig-stage') === stage;
                el.classList.toggle('is-active', on);
                if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            requestAnimationFrame(() => {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        function activate(id, anchorId) {
            tabs.forEach((t) => {
                const on = t.getAttribute('data-outcad-tab') === id;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const on = panel.getAttribute('data-outcad-panel') === id;
                panel.classList.toggle('is-active', on);
                if (on) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
            try { localStorage.setItem(TAB_KEY, id); } catch (e) {}
            if (id === 'regua') {
                closeDetails();
                root.querySelectorAll('[data-sig-go].is-active').forEach((el) => {
                    el.classList.remove('is-active');
                    if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
                });
            }
            if (anchorId) {
                expandPhase(anchorId);
                const el = document.getElementById(anchorId);
                if (el) {
                    requestAnimationFrame(() => {
                        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                    });
                }
            }
        }

        function goToCadence(anchorId, node) {
            closeDetails();
            root.querySelectorAll('[data-sig-stage], [data-sig-go]').forEach((el) => {
                const on = el === node;
                el.classList.toggle('is-active', on);
                if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            activate('regua', anchorId);
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => activate(tab.getAttribute('data-outcad-tab')));
        });

        // Delegação: cliques nos nós do fluxo
        root.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('[data-sig-detail-close]');
            if (closeBtn) {
                e.preventDefault();
                closeDetails();
                return;
            }

            const gotoBtn = e.target.closest('[data-outcad-goto]');
            if (gotoBtn && root.contains(gotoBtn)) {
                e.preventDefault();
                e.stopPropagation();
                activate(gotoBtn.getAttribute('data-outcad-goto'), gotoBtn.getAttribute('data-outcad-anchor'));
                return;
            }

            const stageBtn = e.target.closest('[data-sig-stage]');
            if (stageBtn && root.contains(stageBtn)) {
                e.preventDefault();
                openDetail(stageBtn.getAttribute('data-sig-stage'));
                return;
            }

            const goBtn = e.target.closest('[data-sig-go]');
            if (goBtn && root.contains(goBtn)) {
                e.preventDefault();
                goToCadence(goBtn.getAttribute('data-sig-anchor'), goBtn);
            }
        });

        root.querySelectorAll('a[href="#out-fase-quente"], a[href="#out-fase-frio"], a[href="#out-fase-nutricao"]').forEach((a) => {
            a.addEventListener('click', () => {
                const id = (a.getAttribute('href') || '').slice(1);
                activate('regua', id);
            });
        });

        const hash = (location.hash || '').slice(1);
        if (hash === 'out-fase-quente' || hash === 'out-fase-frio' || hash === 'out-fase-nutricao') {
            activate('regua', hash);
        } else {
            let savedTab = 'fluxo';
            try { savedTab = localStorage.getItem(TAB_KEY) || 'fluxo'; } catch (e) {}
            if (savedTab === 'regua' || savedTab === 'fluxo') activate(savedTab);
        }
    })();

    // Lead Scoring A–D matrix
    (function initPersonaLeadScoring() {
        const root = document.getElementById('gim-lead-scoring');
        if (!root) return;

        const matrix = document.getElementById('leadScoreMatrix');
        if (!matrix) return;

        const sideScore = document.getElementById('lsSideScore');
        const sideBadge = document.getElementById('lsSideBadge');
        const sideCopy = document.getElementById('lsSideCopy');
        const resultCard = document.getElementById('lsResultCard');
        const progressBar = document.getElementById('lsProgressBar');
        const progressCap = document.getElementById('lsProgressCap');
        const tierCards = root.querySelectorAll('[data-ls-tier]');
        const ladderSteps = root.querySelectorAll('[data-ls-ladder]');

        function classify(score) {
            if (score >= 7.5) {
                return {
                    tipo: 'A',
                    label: 'Tipo A · Principal',
                    copy: 'Prioridade máxima. Conta e persona quentes — avançar para SQL / cadência ativa.',
                    className: 'ls-tipo-a',
                    nextCut: null,
                    nextLabel: 'No teto Tipo A'
                };
            }
            if (score >= 5) {
                return {
                    tipo: 'B',
                    label: 'Tipo B · Importante',
                    copy: 'Vale esforço com disciplina. Nutrir, multithread e confirmar fit antes de escalar.',
                    className: 'ls-tipo-b',
                    nextCut: 7.5,
                    nextLabel: 'Faltam {gap} p/ Tipo A'
                };
            }
            if (score >= 2.5) {
                return {
                    tipo: 'C',
                    label: 'Tipo C · Desqualificada',
                    copy: 'Baixo retorno. Não priorizar agenda — só se houver sinal excepcional.',
                    className: 'ls-tipo-c',
                    nextCut: 5,
                    nextLabel: 'Faltam {gap} p/ Tipo B'
                };
            }
            return {
                tipo: 'D',
                label: 'Tipo D · Desqualificada',
                copy: 'Fora do ICP operacional. Arquivar ou nurturing genérico no máximo.',
                className: 'ls-tipo-d',
                nextCut: 2.5,
                nextLabel: 'Faltam {gap} p/ Tipo C'
            };
        }

        function fmt(n) {
            return n.toFixed(1).replace('.', ',');
        }

        function recalc() {
            let total = 0;
            matrix.querySelectorAll('.ls-row').forEach((row) => {
                const ptsCell = row.querySelector('.ls-pts');
                if (!row.classList.contains('is-on')) {
                    if (ptsCell) ptsCell.textContent = '—';
                    return;
                }
                const note = Number(row.getAttribute('data-ls-note') || 0);
                const weight = Number(row.getAttribute('data-ls-weight') || 0);
                const pts = note * weight;
                total += pts;
                if (ptsCell) ptsCell.textContent = fmt(pts);
            });

            const info = classify(total);
            const scoreTxt = fmt(total);
            if (sideScore) sideScore.textContent = scoreTxt;
            if (sideBadge) {
                sideBadge.textContent = info.label;
                sideBadge.className = 'ls-soma-tipo ' + info.className;
            }
            if (sideCopy) sideCopy.textContent = info.copy;
            if (resultCard) resultCard.setAttribute('data-ls-tipo', info.tipo);

            tierCards.forEach((card) => {
                card.classList.toggle('is-current', card.getAttribute('data-ls-tier') === info.tipo);
            });
            ladderSteps.forEach((step) => {
                step.classList.toggle('is-on', step.getAttribute('data-ls-ladder') === info.tipo);
            });

            if (progressBar && progressCap) {
                if (info.nextCut == null) {
                    progressBar.style.width = '100%';
                    progressCap.textContent = info.nextLabel;
                } else {
                    const pct = Math.max(0, Math.min(100, (total / info.nextCut) * 100));
                    progressBar.style.width = pct + '%';
                    const gap = Math.max(0, info.nextCut - total);
                    progressCap.textContent = info.nextLabel.replace('{gap}', fmt(gap));
                }
            }
        }

        function selectRow(row) {
            const group = row.getAttribute('data-ls-group');
            matrix.querySelectorAll(`.ls-row[data-ls-group="${group}"]`).forEach((r) => {
                r.classList.remove('is-on');
                const btn = r.querySelector('.ls-x');
                if (btn) {
                    btn.classList.remove('is-on');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
            row.classList.add('is-on');
            const btn = row.querySelector('.ls-x');
            if (btn) {
                btn.classList.add('is-on');
                btn.setAttribute('aria-pressed', 'true');
            }
            recalc();
        }

        matrix.querySelectorAll('.ls-row').forEach((row) => {
            row.addEventListener('click', (e) => {
                e.preventDefault();
                selectRow(row);
            });
        });

        const presets = {
            'a-gerente': { funcao: 'Gerente PCM', exec: '10–20', industria: 'Sim', pcm: '2' },
            'a-eng': { funcao: 'Engenheiro de Manutenção', exec: '21–39', industria: 'Sim', pcm: '3+' },
            'b-planej': { funcao: 'Planejador PCM', exec: '1–9', industria: 'Sim', pcm: '1' },
            'c-fora': { funcao: 'Gerente PCM', exec: '1–9', industria: 'Não', pcm: '0' },
            'd-ruido': { funcao: 'Estudante', exec: '1–9', industria: 'Não', pcm: '0' }
        };

        root.querySelectorAll('[data-ls-preset]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-ls-preset');
                const preset = presets[key];
                if (!preset) return;
                Object.entries(preset).forEach(([group, label]) => {
                    const row = Array.from(matrix.querySelectorAll(`.ls-row[data-ls-group="${group}"]`))
                        .find((r) => {
                            const optTd = Array.from(r.children).find((td) =>
                                !td.classList.contains('ls-block-cell') &&
                                !td.classList.contains('ls-w') &&
                                !td.classList.contains('ls-mark-cell') &&
                                !td.classList.contains('ls-pts') &&
                                !td.querySelector('.ls-note')
                            );
                            return optTd && optTd.textContent.trim() === label;
                        });
                    if (row) selectRow(row);
                });
            });
        });

        recalc();
    })();

    (function initProdutoTabs() {
        const root = document.getElementById('gim-produtos');
        if (!root) return;
        const tabs = root.querySelectorAll('[data-produto-tab]');
        const panels = root.querySelectorAll('[data-produto-panel]');
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const id = tab.getAttribute('data-produto-tab');
                tabs.forEach((t) => {
                    const on = t === tab;
                    t.classList.toggle('is-active', on);
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                });
                panels.forEach((panel) => {
                    const on = panel.getAttribute('data-produto-panel') === id;
                    panel.classList.toggle('is-active', on);
                    if (on) panel.removeAttribute('hidden');
                    else panel.setAttribute('hidden', '');
                });
            });
        });
    })();

    (function initBattleTabs() {
        const root = document.getElementById('gim-concorrentes');
        if (!root) return;
        const tabs = root.querySelectorAll('[data-battle-tab]');
        const panels = root.querySelectorAll('[data-battle-panel]');

        function activate(id, opts) {
            const options = opts || {};
            tabs.forEach((t) => {
                const on = t.getAttribute('data-battle-tab') === id;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const on = panel.getAttribute('data-battle-panel') === id;
                panel.classList.toggle('is-active', on);
                if (on) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
            if (options.scrollToId) {
                const el = document.getElementById(options.scrollToId);
                if (el) {
                    requestAnimationFrame(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        el.classList.add('is-flash');
                        setTimeout(() => el.classList.remove('is-flash'), 1600);
                    });
                }
            }
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                activate(tab.getAttribute('data-battle-tab'));
            });
        });

        root.querySelectorAll('a[href^="#battle-"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = (link.getAttribute('href') || '').slice(1);
                const card = id ? document.getElementById(id) : null;
                if (!card) return;
                const panel = card.closest('[data-battle-panel]');
                const lane = panel && panel.getAttribute('data-battle-panel');
                if (!lane) return;
                e.preventDefault();
                activate(lane, { scrollToId: id });
                if (history.replaceState) history.replaceState(null, '', '#' + id);
            });
        });

        const hash = (location.hash || '').slice(1);
        if (hash) {
            const card = document.getElementById(hash);
            if (card && root.contains(card)) {
                const panel = card.closest('[data-battle-panel]');
                const lane = panel && panel.getAttribute('data-battle-panel');
                if (lane) activate(lane, { scrollToId: hash });
            }
        }
    })();

    (function initAbmDeckTabs() {
        const root = document.getElementById('abm-programa');
        if (!root) return;
        const tabs = Array.from(root.querySelectorAll('[data-deck-tab]'));
        const panels = root.querySelectorAll('[data-deck-panel]');
        function activate(id) {
            const sid = String(id);
            tabs.forEach((t) => {
                const on = t.getAttribute('data-deck-tab') === sid;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const on = panel.getAttribute('data-deck-panel') === sid;
                panel.classList.toggle('is-active', on);
                if (on) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
        }
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => activate(tab.getAttribute('data-deck-tab')));
        });
        root.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const active = tabs.findIndex((t) => t.classList.contains('is-active'));
            if (active < 0) return;
            const next = e.key === 'ArrowRight'
                ? Math.min(tabs.length - 1, active + 1)
                : Math.max(0, active - 1);
            activate(tabs[next].getAttribute('data-deck-tab'));
            tabs[next].focus();
            e.preventDefault();
        });
    })();

    (function initAbmPaperTabs() {
        const root = document.getElementById('abm-paper');
        if (!root) return;
        const tabs = Array.from(root.querySelectorAll('[data-paper-tab]'));
        const panels = root.querySelectorAll('[data-paper-panel]');
        function activate(id) {
            const sid = String(id);
            tabs.forEach((t) => {
                const on = t.getAttribute('data-paper-tab') === sid;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const on = panel.getAttribute('data-paper-panel') === sid;
                panel.classList.toggle('is-active', on);
                if (on) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
        }
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => activate(tab.getAttribute('data-paper-tab')));
        });
        root.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const active = tabs.findIndex((t) => t.classList.contains('is-active'));
            if (active < 0) return;
            const next = e.key === 'ArrowRight'
                ? Math.min(tabs.length - 1, active + 1)
                : Math.max(0, active - 1);
            activate(tabs[next].getAttribute('data-paper-tab'));
            tabs[next].focus();
            e.preventDefault();
        });
    })();

// Ops · hidden menu unlock (somente 5 cliques no © do rodapé)
    (function initOpsUnlock() {
        const STORAGE_KEY = 'melvinOpsUnlock.v2';
        // Chave antiga liberava o menu ao abrir qualquer página oculta
        try { localStorage.removeItem('melvinOpsUnlock'); } catch (e) {}
        const lane = document.getElementById('opsNavLane');
        const exitBtn = document.getElementById('opsExitBtn');
        const taps = [
            document.getElementById('opsUnlockTapFull'),
            document.getElementById('opsUnlockTapMini')
        ].filter(Boolean);

        function isUnlocked() {
            return localStorage.getItem(STORAGE_KEY) === '1';
        }

        function setOpsVisible(on) {
            if (!lane) return;
            if (on) lane.removeAttribute('hidden');
            else lane.setAttribute('hidden', '');
        }

        function unlockOps(navigate) {
            localStorage.setItem(STORAGE_KEY, '1');
            setOpsVisible(true);
            if (navigate && typeof forceScreenChange === 'function') {
                forceScreenChange('#ops');
                history.pushState(null, '', '#ops');
            }
        }

        function lockOps() {
            localStorage.removeItem(STORAGE_KEY);
            setOpsVisible(false);
            if (typeof forceScreenChange === 'function') {
                forceScreenChange('#home-dashboard');
                history.pushState(null, '', '#home-dashboard');
            }
        }

        setOpsVisible(isUnlocked());

        // 5 clicks on footer © (not logo — logo toggles collapse)
        let clickCount = 0;
        let clickTimer = null;
        taps.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clickCount += 1;
                el.classList.add('is-tapping');
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    taps.forEach((t) => t.classList.remove('is-tapping'));
                }, 1800);
                if (clickCount >= 5) {
                    clickCount = 0;
                    taps.forEach((t) => t.classList.remove('is-tapping'));
                    unlockOps(true);
                }
            });
        });

        if (exitBtn) {
            exitBtn.addEventListener('click', () => lockOps());
        }
    })();

    // Ops · sanfona lateral FUTURO MENU
    (function initOpsVaultAccordion() {
        const board = document.getElementById('opsBoard');
        const toggle = document.getElementById('opsVaultToggle');
        const panel = document.getElementById('opsVaultPanel');
        if (!board || !toggle || !panel) return;

        const hint = toggle.querySelector('[data-ops-vault-hint]');
        const KEY = 'melvinOpsVaultOpen';

        function setOpen(open) {
            board.classList.toggle('is-vault-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (hint) hint.textContent = open ? 'Fechar' : 'Abrir';
            try { localStorage.setItem(KEY, open ? '1' : '0'); } catch (e) {}
        }

        let open = false;
        try { open = localStorage.getItem(KEY) === '1'; } catch (e) {}
        setOpen(open);

        toggle.addEventListener('click', () => {
            setOpen(!board.classList.contains('is-vault-open'));
        });
    })();

    // Ops · Pendências — checkboxes sincronizados + ordem + concluídas no fim
    (function initOpsPendencias() {
        const KEY_V1 = 'melvinOpsPendencias.v1';
        const KEY = 'melvinOpsPendencias.v2';
        let store = { checks: {}, completedAt: {}, order: {} };

        try {
            const rawV2 = localStorage.getItem(KEY);
            if (rawV2) {
                store = Object.assign({ checks: {}, completedAt: {}, order: {} }, JSON.parse(rawV2) || {});
                store.checks = store.checks || {};
                store.completedAt = store.completedAt || {};
                store.order = store.order || {};
            } else {
                const rawV1 = JSON.parse(localStorage.getItem(KEY_V1) || '{}') || {};
                Object.keys(rawV1).forEach((id) => {
                    if (rawV1[id]) {
                        store.checks[id] = true;
                        // Sem horário histórico — fica no bloco concluídas sem stamp
                        store.completedAt[id] = null;
                    }
                });
            }
        } catch (e) {
            store = { checks: {}, completedAt: {}, order: {} };
        }

        function persist() {
            try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
        }

        function fmtDoneAt(ts) {
            if (!ts) return '';
            try {
                const d = new Date(ts);
                if (Number.isNaN(d.getTime())) return '';
                return d.toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            } catch (e) { return ''; }
        }

        function applyVisual(id, on) {
            document.querySelectorAll(`input[data-pend-id="${id}"]`).forEach((input) => {
                input.checked = on;
                const item = input.closest('.ops-pend-item');
                if (!item) return;
                item.classList.toggle('is-done', on);
                const stamp = item.querySelector('.ops-pend-done-at');
                if (stamp) {
                    const label = fmtDoneAt(store.completedAt[id]);
                    if (on && label) {
                        stamp.hidden = false;
                        stamp.textContent = 'Concluída · ' + label;
                    } else if (on) {
                        stamp.hidden = false;
                        stamp.textContent = 'Concluída';
                    } else {
                        stamp.hidden = true;
                        stamp.textContent = '';
                    }
                }
            });
        }

        function sortList(list) {
            const items = Array.from(list.querySelectorAll(':scope > .ops-pend-item'));
            if (!items.length) return;
            const listId = list.getAttribute('data-ops-pend-list') || 'default';
            const savedOrder = store.order[listId] || [];
            const rank = (id) => {
                const i = savedOrder.indexOf(id);
                return i === -1 ? 9999 : i;
            };

            items.sort((a, b) => {
                const idA = a.getAttribute('data-pend-item') || a.querySelector('[data-pend-id]')?.getAttribute('data-pend-id');
                const idB = b.getAttribute('data-pend-item') || b.querySelector('[data-pend-id]')?.getAttribute('data-pend-id');
                const doneA = !!store.checks[idA];
                const doneB = !!store.checks[idB];
                if (doneA !== doneB) return doneA ? 1 : -1;
                if (!doneA && !doneB) return rank(idA) - rank(idB);
                const tA = store.completedAt[idA];
                const tB = store.completedAt[idB];
                if (tA == null && tB == null) return rank(idA) - rank(idB);
                if (tA == null) return -1;
                if (tB == null) return 1;
                return tA - tB;
            });

            items.forEach((el) => list.appendChild(el));

            // Persistir ordem só das abertas (usuário controla)
            const openIds = items
                .map((el) => el.getAttribute('data-pend-item') || el.querySelector('[data-pend-id]')?.getAttribute('data-pend-id'))
                .filter((id) => id && !store.checks[id]);
            if (openIds.length) store.order[listId] = openIds;
        }

        function sortAllLists() {
            document.querySelectorAll('.ops-pend-list').forEach(sortList);
            persist();
        }

        function setChecked(id, on) {
            store.checks[id] = on;
            if (on) {
                if (store.completedAt[id] == null) store.completedAt[id] = Date.now();
            } else {
                delete store.completedAt[id];
            }
            applyVisual(id, on);
            sortAllLists();
        }

        Object.keys(store.checks).forEach((id) => applyVisual(id, !!store.checks[id]));
        sortAllLists();

        document.querySelectorAll('input[data-pend-id]').forEach((input) => {
            if (input.dataset.pendBound) return;
            input.dataset.pendBound = '1';
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-pend-id');
                setChecked(id, input.checked);
            });
        });

        // Drag & drop dentro de cada .ops-pend-list
        document.querySelectorAll('.ops-pend-list').forEach((list) => {
            let dragEl = null;
            list.querySelectorAll(':scope > .ops-pend-item[draggable="true"]').forEach((item) => {
                item.addEventListener('dragstart', (e) => {
                    if (item.classList.contains('is-done')) {
                        e.preventDefault();
                        return;
                    }
                    dragEl = item;
                    item.classList.add('is-dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    try { e.dataTransfer.setData('text/plain', item.getAttribute('data-pend-item') || ''); } catch (err) {}
                });
                item.addEventListener('dragend', () => {
                    item.classList.remove('is-dragging');
                    list.querySelectorAll('.is-drag-over').forEach((el) => el.classList.remove('is-drag-over'));
                    dragEl = null;
                    const listId = list.getAttribute('data-ops-pend-list') || 'default';
                    store.order[listId] = Array.from(list.querySelectorAll(':scope > .ops-pend-item'))
                        .map((el) => el.getAttribute('data-pend-item'))
                        .filter((id) => id && !store.checks[id]);
                    sortList(list);
                    persist();
                });
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    if (!dragEl || dragEl === item || item.classList.contains('is-done')) return;
                    item.classList.add('is-drag-over');
                    const rect = item.getBoundingClientRect();
                    const before = (e.clientY - rect.top) < rect.height / 2;
                    if (before) list.insertBefore(dragEl, item);
                    else list.insertBefore(dragEl, item.nextSibling);
                });
                item.addEventListener('dragleave', () => item.classList.remove('is-drag-over'));
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    item.classList.remove('is-drag-over');
                });
            });
        });

        const root = document.getElementById('ops-pendencias');
        if (!root) return;

        const tabs = root.querySelectorAll('[data-ops-pend-tab]');
        const panels = root.querySelectorAll('[data-ops-pend-panel]');
        const TAB_KEY = 'melvinOpsPendTab.v1';

        function setTab(id) {
            tabs.forEach((tab) => {
                const on = tab.getAttribute('data-ops-pend-tab') === id;
                tab.classList.toggle('is-active', on);
                tab.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            panels.forEach((panel) => {
                const on = panel.getAttribute('data-ops-pend-panel') === id;
                panel.classList.toggle('is-active', on);
                if (on) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
            try { localStorage.setItem(TAB_KEY, id); } catch (e) {}
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                setTab(tab.getAttribute('data-ops-pend-tab'));
            });
        });

        let startTab = 'ata';
        try {
            const saved = localStorage.getItem(TAB_KEY);
            if (saved && root.querySelector(`[data-ops-pend-panel="${saved}"]`)) startTab = saved;
        } catch (e) {}
        setTab(startTab);
    })();

    // Plano de Ação · fases em accordion (fechadas por padrão)
    (function initPlanoFaseAccordion() {
        const root = document.getElementById('plano-acao');
        if (!root) return;
        root.querySelectorAll('.matrix-widget.dash-matrix').forEach((card) => {
            const header = card.querySelector(':scope > .matrix-header');
            const content = card.querySelector(':scope > .matrix-content');
            if (!header || !content) return;
            card.classList.add('plano-fase', 'is-collapsed');
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.setAttribute('aria-expanded', 'false');
            if (!header.querySelector('.plano-fase-chevron')) {
                const chev = document.createElement('span');
                chev.className = 'plano-fase-chevron';
                chev.setAttribute('aria-hidden', 'true');
                header.appendChild(chev);
            }
            const toggle = () => {
                const collapsed = card.classList.toggle('is-collapsed');
                header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            };
            header.addEventListener('click', toggle);
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    })();

    // Roadmap RevOps · tabs (+ deep-link data-crono-goto)
    const cronoRoot = document.getElementById('agenda-entregas');
    const cronoTabs = cronoRoot ? cronoRoot.querySelectorAll('[data-crono-tab]') : [];
    const cronoPanels = cronoRoot ? cronoRoot.querySelectorAll('[data-crono-panel]') : [];
    function normalizeCronoTab(id) {
        if (!id) return id;
        if (id === 'seq' || id === 's3') return 'overview';
        if (id === 's1' || id === 's2') return 'history';
        return id;
    }
    function activateCronoTab(id) {
        id = normalizeCronoTab(id);
        if (!id) return;
        cronoTabs.forEach((t) => {
            const on = t.getAttribute('data-crono-tab') === id;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        cronoPanels.forEach((panel) => {
            const match = panel.getAttribute('data-crono-panel') === id;
            panel.classList.toggle('is-active', match);
            if (match) panel.removeAttribute('hidden');
            else panel.setAttribute('hidden', '');
        });
    }
    cronoTabs.forEach((tab) => {
        tab.addEventListener('click', () => activateCronoTab(tab.getAttribute('data-crono-tab')));
    });
    document.querySelectorAll('[data-crono-goto]').forEach((el) => {
        el.addEventListener('click', (e) => {
            const id = normalizeCronoTab(el.getAttribute('data-crono-goto'));
            if (!id) return;
            e.preventDefault();
            if (typeof forceScreenChange === 'function') {
                forceScreenChange('#agenda-entregas', { skipScroll: true });
                history.pushState(null, '', '#agenda-entregas');
            }
            activateCronoTab(id);
            const panel = document.querySelector(`[data-crono-panel="${id}"]`);
            if (panel) requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        });
    });

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('light-mode') ? 'light' : 'dark'
            );
        });
    }

    const allSections = document.querySelectorAll('main > section');
    const breadcrumbText = document.getElementById('current-location');

    function expandMenuForHash(hash) {
        const activeMenuLink = document.querySelector(`.nav-container a[href="${hash}"]`);
        if (!activeMenuLink) return;
        const group = activeMenuLink.closest('.menu-group');
        if (!group) return;
        group.classList.add('active');
        const arrow = group.querySelector('.menu-trigger .arrow');
        if (arrow) arrow.textContent = '▲';
    }

    // Mantém a mesma página + abas + scroll ao atualizar (F5 / Ctrl+R)
    const VIEW_KEY = 'melvinView.v2';
    const VIEW_KEY_LEGACY = 'melvinView.v1';
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}

    function readSavedView() {
        try {
            const raw = localStorage.getItem(VIEW_KEY) || sessionStorage.getItem(VIEW_KEY) || sessionStorage.getItem(VIEW_KEY_LEGACY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }
    function captureHireSnapshot() {
        const root = document.getElementById('job-bdr');
        if (!root) return {};
        const hireTab = root.querySelector('[data-hire-tab].is-active')?.getAttribute('data-hire-tab') || null;
        const jdTab = root.querySelector('[data-jd-tab].is-active')?.getAttribute('data-jd-tab') || null;
        const selTab = root.querySelector('[data-sel-tab].is-active')?.getAttribute('data-sel-tab') || null;
        const cvId = root.querySelector('[data-cv-nav].is-active')?.getAttribute('data-cv-nav') || null;
        return { hireTab, jdTab, selTab, cvId };
    }
    function saveView(hash, scrollY) {
        try {
            const h = hash || window.location.hash || '#home-dashboard';
            const y = typeof scrollY === 'number' ? scrollY : (window.scrollY || window.pageYOffset || 0);
            const payload = Object.assign({
                hash: h,
                scrollY: y,
                ts: Date.now()
            }, h === '#job-bdr' || (h && h.indexOf('job-bdr') >= 0) ? captureHireSnapshot() : {});
            const raw = JSON.stringify(payload);
            localStorage.setItem(VIEW_KEY, raw);
            sessionStorage.setItem(VIEW_KEY, raw);
            if (payload.hireTab) {
                try {
                    localStorage.setItem('melvinHireTabs.v1', JSON.stringify({
                        hireTab: payload.hireTab,
                        jdTab: payload.jdTab,
                        selTab: payload.selTab,
                        cvId: payload.cvId,
                        ts: Date.now()
                    }));
                } catch (e2) {}
            }
        } catch (e) {}
    }
    let saveViewTimer = null;
    function scheduleSaveView() {
        if (saveViewTimer) clearTimeout(saveViewTimer);
        saveViewTimer = setTimeout(() => saveView(window.location.hash), 120);
    }
    window.addEventListener('scroll', scheduleSaveView, { passive: true });
    window.addEventListener('beforeunload', () => saveView(window.location.hash));
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') saveView(window.location.hash);
    });

    function forceScreenChange(hash, options = {}) {
        // Plano de Ação unificado no Roadmap
        let openCronoTab = null;
        if (hash === '#plano-acao') {
            hash = '#agenda-entregas';
            openCronoTab = 'overview';
        }
        if (hash === '#roadmap-backlog') {
            openCronoTab = 'overview';
        }
        if (hash === '#rm-entregas-mes') {
            openCronoTab = 'overview';
        }

        const targetEl = document.querySelector(hash);
        if (!targetEl) return false;

        // Anchors inside a page (ex.: #obj-out-01) must keep the parent section visible
        const targetSection = targetEl.matches('main > section')
            ? targetEl
            : targetEl.closest('main > section');
        if (!targetSection) return false;

        const pageHash = targetSection.id ? `#${targetSection.id}` : hash;
        const restoreY = typeof options.restoreScrollY === 'number' ? options.restoreScrollY : null;
        const skipScroll = options.skipScroll === true;

        document.querySelectorAll('.nav-container a').forEach((l) => l.classList.remove('active'));
        const activeMenuLink =
            document.querySelector(`.nav-container a[href="${pageHash}"]`) ||
            document.querySelector(`.nav-container a[href="${hash}"]`);
        if (activeMenuLink) activeMenuLink.classList.add('active');
        expandMenuForHash(pageHash);

        allSections.forEach((sec) => {
            sec.style.display = 'none';
            sec.classList.remove('page-active');
        });
        targetSection.style.display = 'block';
        targetSection.classList.add('page-active');

        if (breadcrumbText) {
            if (pageHash === '#home-dashboard') {
                breadcrumbText.innerText = 'RevOps Book';
            } else {
                const titleEl = targetSection.querySelector('.cadencia-title-line, h2');
                if (titleEl) {
                    breadcrumbText.innerText = titleEl.textContent.split('•')[0].trim();
                }
            }
        }

        if (!skipScroll) {
            if (restoreY !== null) {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: restoreY, behavior: 'auto' });
                    saveView(hash, restoreY);
                });
            } else if (targetEl !== targetSection) {
                requestAnimationFrame(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    targetEl.classList.add('is-jump-target');
                    setTimeout(() => targetEl.classList.remove('is-jump-target'), 1400);
                    scheduleSaveView();
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                saveView(hash, 0);
            }
        } else {
            saveView(hash);
        }
        if (openCronoTab && typeof activateCronoTab === 'function') {
            activateCronoTab(openCronoTab);
        }
        if (pageHash === '#job-bdr' && typeof window.melvinRestoreHireTabs === 'function') {
            const saved = readSavedView();
            window.melvinRestoreHireTabs(saved);
        }
        closeMobileSidebar();
        return true;
    }

    (function initSiteSearch() {
        const root = document.getElementById('siteSearchRoot');
        const input = document.getElementById('siteSearchInput');
        const panel = document.getElementById('siteSearchPanel');
        const list = document.getElementById('siteSearchList');
        const empty = document.getElementById('siteSearchEmpty');
        if (!root || !input || !panel || !list) return;

        let index = null;
        let shown = [];
        let active = -1;
        let hitSeq = 0;

        function norm(value) {
            return (value || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function pageTitleOf(section) {
            const el = section.querySelector('.cadencia-title-line, .welcome-heading, h2, h1');
            return (el ? el.textContent : section.id || 'Página').replace(/\s+/g, ' ').trim();
        }

        function stamp(el) {
            if (!el || el.nodeType !== 1) return '';
            let id = el.getAttribute('data-site-hit');
            if (!id) {
                hitSeq += 1;
                id = String(hitSeq);
                el.setAttribute('data-site-hit', id);
            }
            return id;
        }

        function addItem(arr, item) {
            const hay = norm(item.title + ' ' + (item.blurb || '') + ' ' + (item.hay || ''));
            if (hay.length < 2) return;
            arr.push({
                kind: item.kind,
                pageId: item.pageId,
                hit: item.hit || '',
                title: item.title,
                blurb: (item.blurb || '').replace(/\s+/g, ' ').trim(),
                hay: hay
            });
        }

        function buildIndex() {
            const items = [];
            const seenNav = new Set();
            document.querySelectorAll('.nav-container a[href^="#"]').forEach((a) => {
                const href = a.getAttribute('href');
                if (!href || href === '#' || seenNav.has(href)) return;
                seenNav.add(href);
                const pageId = href.slice(1);
                addItem(items, {
                    kind: 'menu',
                    pageId,
                    title: (a.querySelector('.text') || a).textContent.replace(/\s+/g, ' ').trim(),
                    blurb: 'Menu · ' + (a.closest('.nav-lane')?.querySelector('.sidebar-section-title')?.textContent || 'RevOps Book'),
                    hay: a.textContent
                });
            });
            document.querySelectorAll('main > section[id]').forEach((section) => {
                const pageId = section.id;
                const title = pageTitleOf(section);
                addItem(items, {
                    kind: 'página',
                    pageId,
                    hit: stamp(section),
                    title,
                    blurb: (section.querySelector('.cadencia-subtitle, .welcome-lead, p')?.textContent || '').slice(0, 160),
                    hay: title + ' ' + pageId
                });
                section.querySelectorAll('h2, h3, h4, .cadencia-title-line, .mx-h4, .crono-card-head strong, .ops-card strong').forEach((h) => {
                    const t = h.textContent.replace(/\s+/g, ' ').trim();
                    if (t.length < 3 || t.length > 160) return;
                    addItem(items, {
                        kind: 'item',
                        pageId,
                        hit: stamp(h),
                        title: t,
                        blurb: title,
                        hay: t
                    });
                });
                section.querySelectorAll('p, li, td, .cadencia-subtitle, .mx-help, .mx-mini, dt, dd').forEach((el) => {
                    const t = el.textContent.replace(/\s+/g, ' ').trim();
                    if (t.length < 18 || t.length > 420) return;
                    addItem(items, {
                        kind: 'texto',
                        pageId,
                        hit: stamp(el),
                        title: t.length > 92 ? t.slice(0, 90) + '…' : t,
                        blurb: title,
                        hay: t
                    });
                });
            });
            return items;
        }

        function ensureIndex() {
            if (!index) index = buildIndex();
            return index;
        }

        function score(item, q) {
            const hay = item.hay;
            const title = norm(item.title);
            if (title === q) return 200;
            if (title.startsWith(q)) return 160;
            if (title.includes(q)) return 120;
            const idx = hay.indexOf(q);
            if (idx < 0) return 0;
            let s = item.kind === 'menu' || item.kind === 'página' ? 90 : item.kind === 'item' ? 70 : 40;
            if (idx < 24) s += 12;
            return s;
        }

        function closePanel() {
            panel.hidden = true;
            shown = [];
            active = -1;
        }

        function renderResults(q) {
            const query = norm(q);
            list.innerHTML = '';
            empty.hidden = true;
            if (!query || query.length < 2) {
                closePanel();
                return;
            }
            const ranked = ensureIndex()
                .map((item) => ({ item, s: score(item, query) }))
                .filter((row) => row.s > 0)
                .sort((a, b) => b.s - a.s || a.item.title.localeCompare(b.item.title, 'pt-BR'));
            const uniq = [];
            const seen = new Set();
            ranked.forEach((row) => {
                const key = row.item.kind + '|' + row.item.pageId + '|' + row.item.title.slice(0, 80);
                if (seen.has(key)) return;
                seen.add(key);
                uniq.push(row.item);
            });
            shown = uniq.slice(0, 28);
            active = shown.length ? 0 : -1;
            panel.hidden = false;
            if (!shown.length) {
                empty.hidden = false;
                return;
            }
            list.innerHTML = shown.map((item, i) =>
                `<li><button type="button" class="site-search-item${i === 0 ? ' is-active' : ''}" data-site-go="${i}" role="option">
                    <div class="site-search-kicker">${item.kind}</div>
                    <strong>${item.title.replace(/</g, '')}</strong>
                    <span>${(item.blurb || '').replace(/</g, '')}</span>
                </button></li>`
            ).join('');
        }

        function go(i) {
            const item = shown[i];
            if (!item) return;
            const hash = '#' + item.pageId;
            if (typeof forceScreenChange === 'function') {
                forceScreenChange(hash, { skipScroll: true });
                history.pushState(null, '', hash);
            }
            requestAnimationFrame(() => {
                const el = item.hit ? document.querySelector('[data-site-hit="' + item.hit + '"]') : document.getElementById(item.pageId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('is-jump-target');
                    setTimeout(() => el.classList.remove('is-jump-target'), 1600);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            input.blur();
            closePanel();
        }

        input.addEventListener('input', () => renderResults(input.value));
        input.addEventListener('focus', () => {
            ensureIndex();
            if (norm(input.value).length >= 2) renderResults(input.value);
        });
        list.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('[data-site-go]');
            if (!btn) return;
            e.preventDefault();
            go(Number(btn.getAttribute('data-site-go')));
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                closePanel();
                input.blur();
                return;
            }
            if (!shown.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                active = (active + 1) % shown.length;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                active = (active - 1 + shown.length) % shown.length;
            } else if (e.key === 'Enter' && active >= 0) {
                e.preventDefault();
                go(active);
                return;
            } else {
                return;
            }
            list.querySelectorAll('.site-search-item').forEach((el, i) => el.classList.toggle('is-active', i === active));
            list.querySelector('.site-search-item.is-active')?.scrollIntoView({ block: 'nearest' });
        });
        document.addEventListener('click', (e) => {
            if (!root.contains(e.target)) closePanel();
        });
        document.addEventListener('keydown', (e) => {
            const inField = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
            if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                input.focus();
                input.select();
                return;
            }
            if (e.key === '/' && !inField && document.activeElement !== input && document.activeElement !== navSearchInput) {
                e.preventDefault();
                input.focus();
                input.select();
            }
        });
        if (window.requestIdleCallback) requestIdleCallback(() => ensureIndex(), { timeout: 1800 });
        else setTimeout(ensureIndex, 600);
    })();

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            let hash = link.getAttribute('href');
            if (!hash || hash === '#') return;
            if (hash === '#plano-acao') hash = '#agenda-entregas';
            if (document.querySelector(hash) || hash === '#agenda-entregas') {
                e.preventDefault();
                forceScreenChange(link.getAttribute('href') === '#plano-acao' ? '#plano-acao' : hash);
                history.pushState(null, '', hash);
                saveView(hash, 0);
            }
        });
    });

    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home-dashboard';
        if (!forceScreenChange(hash) && document.getElementById('home-dashboard')) {
            forceScreenChange('#home-dashboard');
        }
    });

    setTimeout(() => {
        const saved = readSavedView();
        const urlHash = window.location.hash;
        let hash = urlHash;
        let restoreY = null;

        // Preferência: URL com hash válido; senão, última página salva (F5 sem perder o lugar)
        if (hash && document.querySelector(hash)) {
            if (saved && saved.hash === hash && typeof saved.scrollY === 'number') {
                restoreY = saved.scrollY;
            }
        } else if (saved && saved.hash && document.querySelector(saved.hash)) {
            hash = saved.hash;
            restoreY = typeof saved.scrollY === 'number' ? saved.scrollY : 0;
            history.replaceState(null, '', hash);
        } else {
            hash = '#home-dashboard';
        }

        if (!forceScreenChange(hash, { restoreScrollY: restoreY }) && document.getElementById('home-dashboard')) {
            forceScreenChange('#home-dashboard');
        }
        if (hash === '#job-bdr' && typeof window.melvinRestoreHireTabs === 'function') {
            window.melvinRestoreHireTabs(saved);
        }
        // Reforço do scroll depois das abas (layout muda)
        if (typeof restoreY === 'number') {
            requestAnimationFrame(() => window.scrollTo({ top: restoreY, behavior: 'auto' }));
            setTimeout(() => window.scrollTo({ top: restoreY, behavior: 'auto' }), 120);
        }
    }, 50);
});

function toggleLocalBlock(containerId, buttonEl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        buttonEl.textContent = 'Recolher';
    } else {
        container.style.display = 'none';
        buttonEl.textContent = 'Expandir';
    }
}

/* Edges espelham o PDF "Fluxo Comercial INBOUND" (draw.io p.2) — sem inventar ramos */
const FLUXO_INBOUND_EDGES = [
    { from: 'lead', to: 'icp' },
    { from: 'icp', to: 'cad_contato', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'left' },
    { from: 'icp', to: 'persona_mkt', label: 'NÃO', color: '#f87171', fromSide: 'bottom', toSide: 'top' },
    { from: 'persona_mkt', to: 'descarte', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'top' },
    { from: 'persona_mkt', to: 'nutricao', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    { from: 'cad_contato', to: 'contato' },
    { from: 'contato', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'contato', to: 'icp_sdr', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'icp_sdr', to: 'descarte', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'icp_sdr', to: 'persona_sdr', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'persona_sdr', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'persona_sdr', to: 'mql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    { from: 'mql', to: 'agendou' },
    { from: 'agendou', to: 'sql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'agendou', to: 'cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'cad_agenda', to: 'agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'cad_agenda', to: 'conn_a', color: '#94a3b8', fromSide: 'bottom', toSide: 'top' },
    { from: 'conn_a', to: 'conn_a2', color: '#c084fc', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'conn_a2', to: 'outbound', color: '#c084fc', fromSide: 'bottom', toSide: 'top' },

    { from: 'sql', to: 'reuniao_q', fromSide: 'right', toSide: 'left' },
    { from: 'reuniao_q', to: 'reagendamento', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'reuniao_q', to: 'possivel', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'reagendamento', to: 'agendou', color: '#fbbf24', dashed: true, fromSide: 'bottom', toSide: 'left' },

    { from: 'possivel', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'possivel', to: 'sal', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'sal', to: 'followup' },
    { from: 'followup', to: 'fechou' },
    { from: 'fechou', to: 'nutricao', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'fechou', to: 'contrato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'contrato', to: 'onboarding', color: '#22d3ee', fromSide: 'left', toSide: 'right' },
    { from: 'fluxo_cs', to: 'sql', color: '#22d3ee', fromSide: 'top', toSide: 'bottom' },
    { from: 'fluxo_cs', to: 'nutricao', color: '#94a3b8', dashed: true, fromSide: 'left', toSide: 'right' }
];

function fluxoRelRect(el, stage) {
    // Layout offsets (ignore CSS transform:scale on zoom ancestors) so wires stay aligned.
    let x = 0;
    let y = 0;
    let node = el;
    while (node && node !== stage) {
        x += node.offsetLeft;
        y += node.offsetTop;
        const parent = node.offsetParent;
        if (!parent || (parent !== stage && !stage.contains(parent))) {
            const sr = stage.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            const scale = sr.width / Math.max(stage.clientWidth, 1);
            return {
                left: (r.left - sr.left) / scale,
                top: (r.top - sr.top) / scale,
                width: r.width / scale,
                height: r.height / scale,
                right: (r.right - sr.left) / scale,
                bottom: (r.bottom - sr.top) / scale,
                cx: (r.left - sr.left + r.width / 2) / scale,
                cy: (r.top - sr.top + r.height / 2) / scale
            };
        }
        node = parent;
    }
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    // .fn uses translate(-50%, 0): layout left is the visual center X
    const cx = x;
    const cy = y + height / 2;
    return {
        left: cx - width / 2,
        top: y,
        right: cx + width / 2,
        bottom: y + height,
        width,
        height,
        cx,
        cy
    };
}

function fluxoNodeAnchor(rect, side) {
    if (side === 'top') return { x: rect.cx, y: rect.top };
    if (side === 'bottom') return { x: rect.cx, y: rect.bottom };
    if (side === 'left') return { x: rect.left, y: rect.cy };
    if (side === 'right') return { x: rect.right, y: rect.cy };
    return { x: rect.cx, y: rect.cy };
}

function fluxoGuessSides(aRect, bRect) {
    const dx = bRect.cx - aRect.cx;
    const dy = bRect.cy - aRect.cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
        return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
    }
    return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function fluxoOrthoPath(a, b, fromSide, toSide, opts = {}) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const busX = opts.busX;

    // Quase alinhados → linha reta (evita “degrau” fantasma)
    if (dx < 8) return `M ${b.x} ${a.y} L ${b.x} ${b.y}`;
    if (dy < 8) return `M ${a.x} ${a.y} L ${b.x} ${a.y}`;

    // Barramento vertical compartilhado (ex.: ramos de descarte)
    if (busX != null && fromSide === 'left' && toSide === 'right') {
        return `M ${a.x} ${a.y} L ${busX} ${a.y} L ${busX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (busX != null && fromSide === 'right' && toSide === 'left') {
        return `M ${a.x} ${a.y} L ${busX} ${a.y} L ${busX} ${b.y} L ${b.x} ${b.y}`;
    }

    // Loop same-side (multithreading)
    if (fromSide === 'left' && toSide === 'left') {
        const wing = Math.min(a.x, b.x) - (opts.wing || 36);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'right' && toSide === 'right') {
        const wing = Math.max(a.x, b.x) + (opts.wing || 36);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
    }

    // Cotovelo ortogonal limpo
    if (fromSide === 'right' && toSide === 'left') {
        const midX = (a.x + b.x) / 2;
        return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'right') {
        const midX = (a.x + b.x) / 2;
        return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'bottom' && toSide === 'top') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'top' && toSide === 'bottom') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    // Sobe/desce primeiro, depois horizontal (evita atravessar a espinha)
    if (fromSide === 'right' && toSide === 'bottom') {
        const midY = b.y;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'bottom' && toSide === 'right') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'bottom') {
        const wing = Math.min(a.x, b.x) - (opts.wing || 28);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
    }
    if ((fromSide === 'right' || fromSide === 'left') && (toSide === 'top' || toSide === 'bottom')) {
        return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    }
    if ((fromSide === 'bottom' || fromSide === 'top') && (toSide === 'left' || toSide === 'right')) {
        return `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'bottom') {
        return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    }
    const midY = (a.y + b.y) / 2;
    return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
}

function fluxoLabelPoint(a, b, fromSide) {
    // Sempre colado na saída do losango/caixa (não no meio do caminho longo)
    const dist = 40;
    if (fromSide === 'left') return { x: a.x - dist, y: a.y - 12 };
    if (fromSide === 'right') return { x: a.x + dist, y: a.y - 12 };
    if (fromSide === 'bottom') return { x: a.x + 18, y: a.y + 26 };
    if (fromSide === 'top') return { x: a.x + 18, y: a.y - 18 };
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 8 };
}

function drawFluxoDiagramWires(stageId, svgId, edges, markerPrefix) {
    const stage = document.getElementById(stageId);
    const svg = document.getElementById(svgId);
    if (!stage || !svg) return;
    if (stage.offsetWidth < 40) return;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    const NS = 'http://www.w3.org/2000/svg';
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const defs = document.createElementNS(NS, 'defs');
    const markerColors = {
        main: '#94a3b8',
        yes: '#34d399',
        no: '#f87171',
        warn: '#fbbf24',
        purple: '#c084fc',
        cyan: '#22d3ee'
    };
    Object.entries(markerColors).forEach(([key, color]) => {
        const marker = document.createElementNS(NS, 'marker');
        marker.setAttribute('id', `${markerPrefix}-${key}`);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        const tip = document.createElementNS(NS, 'path');
        tip.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        tip.setAttribute('fill', color);
        marker.appendChild(tip);
        defs.appendChild(marker);
    });
    svg.appendChild(defs);

    const nodes = {};
    stage.querySelectorAll('[data-fn]').forEach((el) => {
        nodes[el.getAttribute('data-fn')] = el;
    });

    edges.forEach((edge) => {
        const fromEl = nodes[edge.from];
        const toEl = nodes[edge.to];
        if (!fromEl || !toEl) return;

        const aRect = fluxoRelRect(fromEl, stage);
        const bRect = fluxoRelRect(toEl, stage);

        let fromSide = edge.fromSide;
        let toSide = edge.toSide;
        if (!fromSide || !toSide) {
            [fromSide, toSide] = fluxoGuessSides(aRect, bRect);
        }

        const a = fluxoNodeAnchor(aRect, fromSide);
        const b = fluxoNodeAnchor(bRect, toSide);
        const color = edge.color || '#94a3b8';
        let markerKey = 'main';
        if (color === '#34d399') markerKey = 'yes';
        else if (color === '#f87171') markerKey = 'no';
        else if (color === '#fbbf24') markerKey = 'warn';
        else if (color === '#c084fc') markerKey = 'purple';
        else if (color === '#22d3ee') markerKey = 'cyan';

        const pathOpts = {};
        if (edge.busX != null) pathOpts.busX = edge.busX * w;
        if (edge.wing != null) pathOpts.wing = edge.wing;

        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', fluxoOrthoPath(a, b, fromSide, toSide, pathOpts));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', edge.dashed ? '1.75' : '2.25');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        if (edge.dashed) path.setAttribute('stroke-dasharray', '6 5');
        path.setAttribute('marker-end', `url(#${markerPrefix}-${markerKey})`);
        path.setAttribute('opacity', edge.dashed ? '0.8' : '0.95');
        path.setAttribute('data-edge-from', edge.from);
        path.setAttribute('data-edge-to', edge.to);
        svg.appendChild(path);

        if (edge.label) {
            const lp = fluxoLabelPoint(a, b, fromSide);
            const group = document.createElementNS(NS, 'g');
            group.setAttribute('class', 'wire-label-group');
            group.setAttribute('data-edge-from', edge.from);
            group.setAttribute('data-edge-to', edge.to);

            const bg = document.createElementNS(NS, 'rect');
            const tw = edge.label.length * 6.2 + 8;
            bg.setAttribute('x', lp.x - tw / 2);
            bg.setAttribute('y', lp.y - 11);
            bg.setAttribute('width', tw);
            bg.setAttribute('height', 14);
            bg.setAttribute('rx', 3);
            bg.setAttribute('fill', 'rgba(15, 23, 42, 0.85)');
            group.appendChild(bg);

            const label = document.createElementNS(NS, 'text');
            label.setAttribute('x', lp.x);
            label.setAttribute('y', lp.y);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('fill', color);
            label.setAttribute('class', 'wire-label');
            label.textContent = edge.label;
            group.appendChild(label);
            svg.appendChild(group);
        }
    });
}

function drawFluxoInboundWires() {
    drawFluxoDiagramWires('fluxoInboundStage', 'fluxoInboundWires', FLUXO_INBOUND_EDGES, 'fluxo-in-arrow');
}

const FLUXO_OUTBOUND_EDGES = [
    /* A → Leads (horizontal limpo) */
    { from: 'o_a', to: 'o_leads', color: '#c084fc', fromSide: 'right', toSide: 'left' },
    { from: 'o_leads', to: 'o_icp1' },

    /* É ICP? — SIM desce · NÃO vai à direita para Existe outra pessoa? */
    { from: 'o_icp1', to: 'o_encontrou', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_icp1', to: 'o_outra', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },

    /* Existe outra pessoa? — SIM volta p/ Encontrou · NÃO → C1 (Marketing) */
    { from: 'o_outra', to: 'o_encontrou', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'right' },
    { from: 'o_outra', to: 'o_c1', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },

    /* Encontrou Persona? */
    { from: 'o_encontrou', to: 'o_cad_contato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_encontrou', to: 'o_outra', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'bottom' },

    /* CS → B → entra na Cadência de Contato pela esquerda */
    { from: 'o_fluxo_cs', to: 'o_b', color: '#22d3ee', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_b', to: 'o_cad_contato', color: '#22d3ee', fromSide: 'right', toSide: 'left' },

    /* Conseguiu contato? — NÃO → C2 local · SIM desce */
    { from: 'o_cad_contato', to: 'o_contato' },
    { from: 'o_contato', to: 'o_c2', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_contato', to: 'o_icp2', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* É ICP? pós-contato — NÃO → Descarte (esquerda) */
    { from: 'o_icp2', to: 'o_descarte', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_icp2', to: 'o_persona', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* É Persona? — NÃO → C3 local */
    { from: 'o_persona', to: 'o_c3', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_persona', to: 'o_mql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* MQL → Red flag? — SIM sobe p/ Descarte · NÃO desce */
    { from: 'o_mql', to: 'o_redflag' },
    { from: 'o_redflag', to: 'o_descarte', label: 'SIM', color: '#f87171', fromSide: 'left', toSide: 'bottom' },
    { from: 'o_redflag', to: 'o_agendou', label: 'NÃO', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* Agendou? — NÃO → cadência (esquerda) · SIM → SQL */
    { from: 'o_agendou', to: 'o_sql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_agendou', to: 'o_cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_cad_agenda', to: 'o_agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'o_cad_agenda', to: 'o_c_agenda', color: '#94a3b8', fromSide: 'bottom', toSide: 'top' },

    /* SQL → Closer (mesma altura) */
    { from: 'o_sql', to: 'o_reuniao_q', fromSide: 'right', toSide: 'left' },
    /* NÃO sobe p/ Reagendamento (direita do Agendou) · volta ao Agendou */
    { from: 'o_reuniao_q', to: 'o_reagendamento', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_reagendamento', to: 'o_agendou', color: '#fbbf24', dashed: true, fromSide: 'left', toSide: 'right' },
    { from: 'o_reuniao_q', to: 'o_possivel', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* Possível fechamento? — NÃO → C4 local */
    { from: 'o_possivel', to: 'o_c4', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_possivel', to: 'o_sal', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_sal', to: 'o_followup' },
    { from: 'o_followup', to: 'o_fechou' },

    /* Fechou? — NÃO → C5 local · SIM → Contrato → Onboarding */
    { from: 'o_fechou', to: 'o_c5', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_fechou', to: 'o_contrato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_contrato', to: 'o_onboarding', color: '#22d3ee', fromSide: 'left', toSide: 'right' },

    /* Só o C do topo liga visualmente à nutrição (demais C = mesmo conector no PDF) */
    { from: 'o_c1', to: 'o_nutricao', color: '#94a3b8' }
];

function drawFluxoOutboundWires() {
    drawFluxoDiagramWires('fluxoOutboundStage', 'fluxoOutboundWires', FLUXO_OUTBOUND_EDGES, 'fluxo-out-arrow');
}

const FLUXO_CS_EDGES = [
    { from: 'c_map', to: 'c_class', color: '#22d3ee' },
    { from: 'c_class', to: 'c_escopo' },
    { from: 'c_escopo', to: 'c_devolver', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'c_escopo', to: 'c_custom', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_custom', to: 'c_esforco', label: 'SIM', color: '#fbbf24', fromSide: 'left', toSide: 'right' },
    { from: 'c_custom', to: 'c_pre', label: 'NÃO', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_esforco', to: 'c_pre', color: '#94a3b8', fromSide: 'bottom', toSide: 'left' },
    { from: 'c_pre', to: 'c_lowtouch' },
    { from: 'c_lowtouch', to: 'c_fecha_cs', label: 'SIM', color: '#34d399', fromSide: 'left', toSide: 'top' },
    { from: 'c_lowtouch', to: 'c_warm', label: 'NÃO', color: '#60a5fa', fromSide: 'right', toSide: 'top' },
    { from: 'c_fecha_cs', to: 'c_onb1', color: '#22d3ee' },
    { from: 'c_warm', to: 'c_negocia', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_negocia', to: 'c_fechou' },
    { from: 'c_fechou', to: 'c_onb2', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'c_fechou', to: 'c_churn', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' }
];

function drawFluxoCsWires() {
    /* Wire redraw aposentado — Fluxo CS usa PDF oficial (initFluxoPdfUX). */
}

function refreshActiveFluxoWires() {
    /* no-op: In/Out/CS usam PDF UX */
}

window.addEventListener('resize', refreshActiveFluxoWires);

/* Fluxo boards SVG (CS): zoom/pan/highlight */
function initFluxoBoardUX(cfg) {
    const viewport = document.getElementById(cfg.viewportId);
    const zoomLayer = document.getElementById(cfg.zoomId);
    const board = document.getElementById(cfg.boardId);
    const stage = document.getElementById(cfg.stageId);
    const toolbar = document.getElementById(cfg.toolbarId);
    const strip = document.getElementById(cfg.stripId);
    const stripText = document.getElementById(cfg.stripTextId);
    const edges = cfg.edges;
    const draw = cfg.draw;
    const svgId = cfg.svgId;
    if (!viewport || !zoomLayer || !board || !stage) return;

    let zoom = 1;

    function applyZoom() {
        zoomLayer.style.transform = `scale(${zoom})`;
        const w = board.offsetWidth;
        const h = board.offsetHeight;
        zoomLayer.style.marginRight = `${Math.max(0, w * (zoom - 1))}px`;
        zoomLayer.style.marginBottom = `${Math.max(0, h * (zoom - 1))}px`;
        const resetBtn = toolbar?.querySelector('[data-fluxo-zoom="reset"]');
        if (resetBtn) resetBtn.textContent = `${Math.round(zoom * 100)}%`;
        requestAnimationFrame(() => {
            draw();
            requestAnimationFrame(draw);
        });
    }

    toolbar?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-fluxo-zoom], [data-fluxo-fit], [data-fluxo-clear]');
        if (!btn) return;
        if (btn.hasAttribute('data-fluxo-clear')) {
            clearFocus();
            return;
        }
        if (btn.hasAttribute('data-fluxo-fit')) {
            zoom = 1;
            applyZoom();
            viewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            return;
        }
        const mode = btn.getAttribute('data-fluxo-zoom');
        if (mode === 'in') zoom = Math.min(1.55, +(zoom + 0.1).toFixed(2));
        if (mode === 'out') zoom = Math.max(0.55, +(zoom - 0.1).toFixed(2));
        if (mode === 'reset') zoom = 1;
        applyZoom();
    });

    let panning = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fn') || e.target.closest('.fluxo-tool')) return;
        panning = true;
        viewport.classList.add('is-panning');
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = viewport.scrollLeft;
        scrollTop = viewport.scrollTop;
        viewport.setPointerCapture?.(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
        if (!panning) return;
        viewport.scrollLeft = scrollLeft - (e.clientX - startX);
        viewport.scrollTop = scrollTop - (e.clientY - startY);
    });
    const endPan = () => {
        panning = false;
        viewport.classList.remove('is-panning');
    };
    viewport.addEventListener('pointerup', endPan);
    viewport.addEventListener('pointercancel', endPan);

    function nodeLabel(id) {
        const el = stage.querySelector(`[data-fn="${id}"]`);
        if (!el) return id;
        if (el.classList.contains('fn-diamond')) return el.getAttribute('data-label') || id;
        return (el.textContent || id).replace(/\s+/g, ' ').trim();
    }

    function neighbors(id) {
        const outs = edges.filter((e) => e.from === id).map((e) => e.to);
        const ins = edges.filter((e) => e.to === id).map((e) => e.from);
        return [...new Set([...outs, ...ins])];
    }

    function clearFocus() {
        stage.classList.remove('is-focus');
        stage.querySelectorAll('.is-hot').forEach((n) => n.classList.remove('is-hot'));
        if (strip) strip.hidden = true;
    }

    function focusNode(id) {
        const hot = new Set([id, ...neighbors(id)]);
        stage.classList.add('is-focus');
        stage.querySelectorAll('.fn[data-fn]').forEach((el) => {
            el.classList.toggle('is-hot', hot.has(el.getAttribute('data-fn')));
        });
        const svg = document.getElementById(svgId);
        svg?.querySelectorAll('path[data-edge-from], .wire-label-group').forEach((el) => {
            const a = el.getAttribute('data-edge-from');
            const b = el.getAttribute('data-edge-to');
            const on = hot.has(a) && hot.has(b) && (a === id || b === id);
            el.classList.toggle('is-hot', on);
        });
        if (strip && stripText) {
            const outs = edges.filter((e) => e.from === id)
                .map((e) => `${e.label ? e.label + ' → ' : ''}${nodeLabel(e.to)}`)
                .join(' · ');
            stripText.textContent = `${nodeLabel(id)}${outs ? ' — ' + outs : ''}`;
            strip.hidden = false;
        }
    }

    stage.addEventListener('click', (e) => {
        const node = e.target.closest('.fn[data-fn]');
        if (!node) {
            clearFocus();
            return;
        }
        focusNode(node.getAttribute('data-fn'));
    });

    strip?.querySelector('[data-fluxo-clear]')?.addEventListener('click', clearFocus);
    applyZoom();
}

/* PDF diagram boards: zoom/pan + click path highlight */
function initFluxoPdfUX(cfg) {
    const viewport = document.getElementById(cfg.viewportId);
    const zoomLayer = document.getElementById(cfg.zoomId);
    const stage = document.getElementById(cfg.stageId);
    const img = document.getElementById(cfg.imgId);
    const hotsBox = document.getElementById(cfg.hotsId);
    const svg = document.getElementById(cfg.svgId);
    const toolbar = document.getElementById(cfg.toolbarId);
    const strip = document.getElementById(cfg.stripId);
    const stripText = document.getElementById(cfg.stripTextId);
    if (!viewport || !zoomLayer || !img || !hotsBox || !svg || !stage) return;

    const sources = cfg.sources || {};
    const hotsByVer = cfg.hots || {};
    const edgesByVer = cfg.edges || {};
    const waitingEl = cfg.waitingId ? document.getElementById(cfg.waitingId) : null;
    const liveEl = cfg.liveId ? document.getElementById(cfg.liveId) : null;
    const waitingVers = cfg.waitingVers || [];
    let zoom = 1;
    let pdfVer = cfg.defaultVer || 'v2';
    let activeId = null;
    const HIT_RADIUS = 9;

    function isWaitingVer(ver) {
        return waitingVers.includes(ver);
    }

    function applyVersionUI() {
        const waiting = isWaitingVer(pdfVer);
        stage.dataset.pdfVer = pdfVer;
        if (waitingEl) waitingEl.hidden = !waiting;
        if (liveEl) liveEl.hidden = waiting;
        else viewport.hidden = waiting;
        if (strip) strip.hidden = true;
        if (waiting) {
            zoom = 1;
            zoomLayer.style.transform = 'scale(1)';
            zoomLayer.style.marginRight = '0px';
            zoomLayer.style.marginBottom = '0px';
            clearFocus();
        }
        toolbar?.querySelectorAll('[data-fluxo-zoom], [data-fluxo-fit]').forEach((b) => {
            b.disabled = waiting;
        });
        const hint = toolbar?.querySelector('.fluxo-toolbar-hint');
        if (hint && cfg.waitingHint && cfg.readyHint) {
            hint.textContent = waiting ? cfg.waitingHint : cfg.readyHint;
        }
    }

    function currentHots() {
        return hotsByVer[pdfVer] || hotsByVer.v2 || [];
    }
    function currentEdges() {
        return edgesByVer[pdfVer] || edgesByVer.v2 || [];
    }
    function byIdMap() {
        return Object.fromEntries(currentHots().map((h) => [h.id, h]));
    }

    function buildHots() {
        hotsBox.innerHTML = '';
        currentHots().forEach((h) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'fluxo-pdf-hot';
            btn.dataset.fn = h.id;
            btn.title = h.label;
            btn.setAttribute('aria-label', h.label);
            btn.style.left = `${h.x}%`;
            btn.style.top = `${h.y}%`;
            hotsBox.appendChild(btn);
        });
    }

    function mapSize() {
        const native = stage.classList.contains('fluxo-pdf-stage--native');
        const iw = img.naturalWidth || img.offsetWidth || 1100;
        const ih = img.naturalHeight || img.offsetHeight || 1500;
        if (native) return { w: iw, h: ih };
        const w = stage.offsetWidth || img.offsetWidth || 1100;
        const h = stage.offsetHeight || Math.round(w * (ih / Math.max(iw, 1))) || 1500;
        return { w, h };
    }

    function applyZoom() {
        zoomLayer.style.transform = `scale(${zoom})`;
        const { w, h } = mapSize();
        zoomLayer.style.marginRight = `${Math.max(0, w * (zoom - 1))}px`;
        zoomLayer.style.marginBottom = `${Math.max(0, h * (zoom - 1))}px`;
        const resetBtn = toolbar?.querySelector('[data-fluxo-zoom="reset"]');
        if (resetBtn) resetBtn.textContent = `${Math.round(zoom * 100)}%`;
        syncSvgSize();
    }

    function clampZoom(value) {
        return Math.min(3, Math.max(0.25, +Number(value).toFixed(3)));
    }

    function zoomAt(next, clientX, clientY) {
        const prev = zoom;
        zoom = clampZoom(next);
        if (zoom === prev) {
            applyZoom();
            return;
        }
        const rect = viewport.getBoundingClientRect();
        const x = (clientX == null ? rect.left + rect.width / 2 : clientX) - rect.left;
        const y = (clientY == null ? rect.top + rect.height / 2 : clientY) - rect.top;
        const cx = viewport.scrollLeft + x;
        const cy = viewport.scrollTop + y;
        applyZoom();
        const ratio = zoom / prev;
        viewport.scrollLeft = cx * ratio - x;
        viewport.scrollTop = cy * ratio - y;
    }

    function fitDiagram(mode) {
        const { w, h } = mapSize();
        const vw = viewport.clientWidth - 24;
        const vh = viewport.clientHeight - 24;
        if (vw < 80 || vh < 80 || w < 10 || h < 10) return;
        if (mode === 'width') zoom = clampZoom(vw / w);
        else zoom = clampZoom(Math.min(vw / w, vh / h));
        applyZoom();
        viewport.scrollTo({ left: 0, top: 0 });
    }

    function syncSvgSize() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (w < 10 || h < 10) return;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
    }

    function clearFocus() {
        activeId = null;
        stage.classList.remove('is-focus');
        hotsBox.querySelectorAll('.is-hot').forEach((n) => n.classList.remove('is-hot'));
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        if (strip) strip.hidden = true;
    }

    function neighbors(id) {
        const edges = currentEdges();
        const outs = edges.filter((e) => e.from === id).map((e) => e.to);
        const ins = edges.filter((e) => e.to === id).map((e) => e.from);
        return [...new Set([...outs, ...ins])];
    }

    function pctToXY(h) {
        return {
            x: (h.x / 100) * stage.clientWidth,
            y: (h.y / 100) * stage.clientHeight
        };
    }

    function nearestHot(pctX, pctY) {
        let best = null;
        let bestDist = Infinity;
        currentHots().forEach((h) => {
            const d = Math.hypot(h.x - pctX, h.y - pctY);
            if (d < bestDist) {
                bestDist = d;
                best = h;
            }
        });
        return bestDist <= HIT_RADIUS ? best : null;
    }

    function focusNode(id) {
        if (!(hotsByVer[pdfVer] || []).length) return;
        activeId = id;
        const byId = byIdMap();
        const hot = new Set([id, ...neighbors(id)]);
        stage.classList.add('is-focus');
        hotsBox.querySelectorAll('.fluxo-pdf-hot').forEach((el) => {
            el.classList.toggle('is-hot', hot.has(el.dataset.fn));
        });

        syncSvgSize();
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const NS = 'http://www.w3.org/2000/svg';
        currentEdges().forEach((edge) => {
            if (!(hot.has(edge.from) && hot.has(edge.to) && (edge.from === id || edge.to === id))) return;
            const a = byId[edge.from];
            const b = byId[edge.to];
            if (!a || !b) return;
            const p1 = pctToXY(a);
            const p2 = pctToXY(b);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const path = document.createElementNS(NS, 'path');
            const d = Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)
                ? `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
                : `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
            path.setAttribute('d', d);
            svg.appendChild(path);
        });

        if (strip && stripText) {
            const outs = currentEdges().filter((e) => e.from === id)
                .map((e) => `${e.label ? e.label + ' → ' : ''}${byId[e.to]?.label || e.to}`)
                .join(' · ');
            stripText.textContent = `${byId[id]?.label || id}${outs ? ' — ' + outs : ''}`;
            strip.hidden = false;
        }
    }

    function hitFromEvent(e) {
        const rect = stage.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return null;
        const pctX = ((e.clientX - rect.left) / rect.width) * 100;
        const pctY = ((e.clientY - rect.top) / rect.height) * 100;
        return nearestHot(pctX, pctY);
    }

    buildHots();
    applyVersionUI();

    toolbar?.addEventListener('click', (e) => {
        const clearBtn = e.target.closest('[data-fluxo-clear]');
        if (clearBtn) {
            clearFocus();
            return;
        }
        const pdfBtn = e.target.closest('[data-fluxo-pdf]');
        if (pdfBtn) {
            const key = pdfBtn.getAttribute('data-fluxo-pdf');
            if (!key) return;
            const waiting = isWaitingVer(key);
            if (!waiting && !sources[key]) return;
            pdfVer = key;
            toolbar.querySelectorAll('[data-fluxo-pdf]').forEach((b) => {
                const on = b === pdfBtn;
                b.classList.toggle('is-active', on);
                if (b.getAttribute('role') === 'tab') b.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            clearFocus();
            applyVersionUI();
            if (!waiting) {
                img.src = sources[key];
                buildHots();
                const ready = () => {
                    if (stage.classList.contains('fluxo-pdf-stage--native')) fitDiagram('width');
                    else {
                        zoom = 1;
                        applyZoom();
                        viewport.scrollTo({ left: 0, top: 0 });
                    }
                };
                img.onload = ready;
                if (img.complete && img.naturalWidth) ready();
            }
            return;
        }
        if (isWaitingVer(pdfVer)) return;
        const btn = e.target.closest('[data-fluxo-zoom], [data-fluxo-fit]');
        if (!btn || btn.disabled) return;
        if (btn.hasAttribute('data-fluxo-fit')) {
            fitDiagram('contain');
            return;
        }
        const mode = btn.getAttribute('data-fluxo-zoom');
        if (mode === 'in') zoomAt(zoom + 0.15);
        if (mode === 'out') zoomAt(zoom - 0.15);
        if (mode === 'reset') {
            zoom = 1;
            applyZoom();
            viewport.scrollTo({ left: 0, top: 0 });
        }
        if (activeId && stage.classList.contains('is-focus')) focusNode(activeId);
    });

    strip?.querySelector('[data-fluxo-clear]')?.addEventListener('click', clearFocus);

    let panning = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let ignoreClick = false;

    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fluxo-tool')) return;
        if (e.target.closest('.fluxo-pdf-hot')) {
            ignoreClick = false;
            moved = false;
            return;
        }
        panning = true;
        moved = false;
        ignoreClick = false;
        viewport.classList.add('is-panning');
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = viewport.scrollLeft;
        scrollTop = viewport.scrollTop;
        viewport.setPointerCapture?.(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
        if (!panning) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        viewport.scrollLeft = scrollLeft - dx;
        viewport.scrollTop = scrollTop - dy;
    });
    viewport.addEventListener('pointerup', (e) => {
        const wasPanning = panning;
        const wasMoved = moved;
        panning = false;
        viewport.classList.remove('is-panning');
        if (!wasPanning || wasMoved) return;
        if (e.target.closest('.fluxo-tool') || e.target.closest('.fluxo-pdf-hot')) return;
        if (!(hotsByVer[pdfVer] || []).length) return;
        const hit = hitFromEvent(e);
        ignoreClick = true;
        if (!hit) clearFocus();
        else focusNode(hit.id);
    });
    viewport.addEventListener('pointercancel', () => {
        panning = false;
        viewport.classList.remove('is-panning');
    });
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            const next = e.deltaY > 0 ? zoom * 0.9 : zoom * 1.1;
            zoomAt(next, e.clientX, e.clientY);
            return;
        }
        viewport.scrollLeft += e.shiftKey ? e.deltaY : e.deltaX;
        viewport.scrollTop += e.shiftKey ? 0 : e.deltaY;
    }, { passive: false });

    hotsBox.addEventListener('click', (e) => {
        const hot = e.target.closest('.fluxo-pdf-hot');
        if (!hot) return;
        e.preventDefault();
        e.stopPropagation();
        focusNode(hot.dataset.fn);
    });

    stage.addEventListener('click', (e) => {
        if (ignoreClick) {
            ignoreClick = false;
            return;
        }
        if (moved) return;
        if (e.target.closest('.fluxo-pdf-hot')) return;
        if (!(hotsByVer[pdfVer] || []).length) return;
        const hit = hitFromEvent(e);
        if (!hit) clearFocus();
        else focusNode(hit.id);
    });

    if (img.complete && img.naturalWidth) {
        if (stage.classList.contains('fluxo-pdf-stage--native')) fitDiagram('width');
        else applyZoom();
    } else {
        img.addEventListener('load', () => {
            if (stage.classList.contains('fluxo-pdf-stage--native')) fitDiagram('width');
            else applyZoom();
        }, { once: true });
    }
    window.addEventListener('resize', () => {
        applyZoom();
        if (activeId && stage.classList.contains('is-focus')) focusNode(activeId);
    });
    if (typeof ResizeObserver === 'function') {
        let primed = false;
        const ro = new ResizeObserver(() => {
            if (viewport.clientWidth < 80) return;
            if (!primed && stage.classList.contains('fluxo-pdf-stage--native')) {
                primed = true;
                fitDiagram('width');
                return;
            }
            applyZoom();
        });
        ro.observe(viewport);
    }
}

const FLUXO_INBOUND_PDF_HOTS = [
    { id: 'lead', label: 'Lead inbound', x: 12.5, y: 12.2 },
    { id: 'icp', label: 'É ICP?', x: 12.5, y: 18.8 },
    { id: 'cad_contato', label: 'Cadência de tentativas de contato', x: 42.0, y: 12.2 },
    { id: 'conn_a2', label: 'A', x: 87.5, y: 15.2 },
    { id: 'outbound', label: 'Fluxo outbound', x: 87.5, y: 21.8 },
    { id: 'persona_mkt', label: 'É Persona?', x: 12.5, y: 27.5 },
    { id: 'contato', label: 'Conseguiu contato?', x: 42.0, y: 21.5 },
    { id: 'descarte', label: 'Descarte', x: 12.5, y: 36.0 },
    { id: 'icp_sdr', label: 'É ICP?', x: 42.0, y: 30.0 },
    { id: 'persona_sdr', label: 'É Persona?', x: 42.0, y: 38.2 },
    { id: 'mql', label: 'MQL - SDR', x: 42.0, y: 46.2 },
    { id: 'reagendamento', label: 'Cadências de Reagendamento', x: 55.0, y: 54.0 },
    { id: 'agendou', label: 'Agendou reunião?', x: 42.0, y: 54.0 },
    { id: 'reuniao_q', label: 'Reunião realizada?', x: 68.0, y: 54.0 },
    { id: 'cad_agenda', label: 'Cadência de agendamento de reunião', x: 26.0, y: 62.0 },
    { id: 'possivel', label: 'Possível fechamento?', x: 68.0, y: 64.0 },
    { id: 'conn_a', label: 'A', x: 26.0, y: 70.0 },
    { id: 'sql', label: 'SQL - SDR', x: 42.0, y: 70.0 },
    { id: 'sal', label: 'SAL - SDR', x: 68.0, y: 72.5 },
    { id: 'followup', label: 'Cadência de follow up para fechamento', x: 68.0, y: 79.0 },
    { id: 'fechou', label: 'Fechou contrato?', x: 68.0, y: 85.5 },
    { id: 'nutricao', label: 'Cadência de nutrição', x: 12.5, y: 86.5 },
    { id: 'contrato', label: 'Contrato Fechado', x: 68.0, y: 91.5 },
    { id: 'fluxo_cs', label: 'Fluxo Comercial CS', x: 42.0, y: 91.5 },
    { id: 'onboarding', label: 'Fluxo Onboarding CS', x: 42.0, y: 96.5 }
];

const FLUXO_INBOUND_PDF_EDGES = [
    { from: 'lead', to: 'icp', label: '' },
    { from: 'icp', to: 'cad_contato', label: 'SIM' },
    { from: 'icp', to: 'persona_mkt', label: 'NÃO' },
    { from: 'persona_mkt', to: 'descarte', label: 'NÃO' },
    { from: 'persona_mkt', to: 'nutricao', label: 'SIM' },
    { from: 'cad_contato', to: 'contato', label: '' },
    { from: 'contato', to: 'outbound', label: 'NÃO' },
    { from: 'contato', to: 'icp_sdr', label: 'SIM' },
    { from: 'icp_sdr', to: 'descarte', label: 'NÃO' },
    { from: 'icp_sdr', to: 'persona_sdr', label: 'SIM' },
    { from: 'persona_sdr', to: 'outbound', label: 'NÃO' },
    { from: 'persona_sdr', to: 'mql', label: 'SIM' },
    { from: 'mql', to: 'agendou', label: '' },
    { from: 'agendou', to: 'sql', label: 'SIM' },
    { from: 'agendou', to: 'cad_agenda', label: 'NÃO' },
    { from: 'cad_agenda', to: 'conn_a', label: '' },
    { from: 'conn_a', to: 'conn_a2', label: '' },
    { from: 'conn_a2', to: 'outbound', label: '' },
    { from: 'sql', to: 'reuniao_q', label: '' },
    { from: 'reuniao_q', to: 'reagendamento', label: 'NÃO' },
    { from: 'reuniao_q', to: 'possivel', label: 'SIM' },
    { from: 'reagendamento', to: 'agendou', label: '' },
    { from: 'possivel', to: 'outbound', label: 'NÃO' },
    { from: 'possivel', to: 'sal', label: 'SIM' },
    { from: 'sal', to: 'followup', label: '' },
    { from: 'followup', to: 'fechou', label: '' },
    { from: 'fechou', to: 'nutricao', label: 'NÃO' },
    { from: 'fechou', to: 'contrato', label: 'SIM' },
    { from: 'contrato', to: 'onboarding', label: '' },
    { from: 'fluxo_cs', to: 'nutricao', label: '' }
];

const FLUXO_OUTBOUND_PDF_HOTS = [
    { id: 'o_a', label: 'A', x: 12.5, y: 12.5 },
    { id: 'o_leads', label: 'Leads outbound', x: 42.0, y: 12.3 },
    { id: 'o_c1', label: 'C', x: 87.5, y: 12.3 },
    { id: 'o_nutricao', label: 'Cadência de nutrição', x: 87.5, y: 17.8 },
    { id: 'o_icp1', label: 'É ICP?', x: 42.0, y: 18.6 },
    { id: 'o_outra', label: 'Existe outra pessoa?', x: 55.5, y: 18.6 },
    { id: 'o_encontrou', label: 'Encontrou Persona?', x: 42.0, y: 25.2 },
    { id: 'o_fluxo_cs', label: 'Fluxo comercial CS', x: 12.5, y: 29.0 },
    { id: 'o_b', label: 'B', x: 12.5, y: 33.0 },
    { id: 'o_cad_contato', label: 'Cadência de Contato Inicial e Nutrição', x: 42.0, y: 32.0 },
    { id: 'o_contato', label: 'Conseguiu contato?', x: 42.0, y: 38.5 },
    { id: 'o_c2', label: 'C', x: 87.5, y: 38.5 },
    { id: 'o_descarte', label: 'Descarte', x: 27.0, y: 45.0 },
    { id: 'o_icp2', label: 'É ICP?', x: 42.0, y: 45.0 },
    { id: 'o_persona', label: 'É Persona?', x: 42.0, y: 51.8 },
    { id: 'o_c3', label: 'C', x: 87.5, y: 51.8 },
    { id: 'o_mql', label: 'MQL - BDR', x: 42.0, y: 58.5 },
    { id: 'o_redflag', label: 'Red flag?', x: 42.0, y: 65.0 },
    { id: 'o_cad_agenda', label: 'Cadência de agendamento de reunião', x: 25.0, y: 71.5 },
    { id: 'o_agendou', label: 'Agendou reunião?', x: 42.0, y: 71.5 },
    { id: 'o_reagendamento', label: 'Cadências de Reagendamento', x: 56.5, y: 71.5 },
    { id: 'o_c_agenda', label: 'C', x: 25.0, y: 77.0 },
    { id: 'o_sql', label: 'SQL - BDR', x: 42.0, y: 78.5 },
    { id: 'o_reuniao_q', label: 'Reunião realizada?', x: 68.0, y: 78.5 },
    { id: 'o_possivel', label: 'Possível fechamento?', x: 68.0, y: 84.5 },
    { id: 'o_c4', label: 'C', x: 87.5, y: 84.5 },
    { id: 'o_sal', label: 'SAL - BDR', x: 68.0, y: 89.0 },
    { id: 'o_followup', label: 'Cadência de follow up para fechamento', x: 68.0, y: 92.8 },
    { id: 'o_fechou', label: 'Fechou contrato?', x: 68.0, y: 95.8 },
    { id: 'o_c5', label: 'C', x: 87.5, y: 95.8 },
    { id: 'o_contrato', label: 'Contrato fechado', x: 68.0, y: 98.2 },
    { id: 'o_onboarding', label: 'Fluxo Onboarding', x: 12.5, y: 98.2 }
];

const FLUXO_OUTBOUND_PDF_EDGES = [
    { from: 'o_a', to: 'o_leads', label: '' },
    { from: 'o_leads', to: 'o_icp1', label: '' },
    { from: 'o_icp1', to: 'o_encontrou', label: 'SIM' },
    { from: 'o_icp1', to: 'o_outra', label: 'NÃO' },
    { from: 'o_outra', to: 'o_encontrou', label: 'SIM' },
    { from: 'o_outra', to: 'o_c1', label: 'NÃO' },
    { from: 'o_c1', to: 'o_nutricao', label: '' },
    { from: 'o_encontrou', to: 'o_cad_contato', label: 'SIM' },
    { from: 'o_encontrou', to: 'o_outra', label: 'NÃO' },
    { from: 'o_fluxo_cs', to: 'o_b', label: '' },
    { from: 'o_b', to: 'o_cad_contato', label: '' },
    { from: 'o_cad_contato', to: 'o_contato', label: '' },
    { from: 'o_contato', to: 'o_icp2', label: 'SIM' },
    { from: 'o_contato', to: 'o_c2', label: 'NÃO' },
    { from: 'o_icp2', to: 'o_persona', label: 'SIM' },
    { from: 'o_icp2', to: 'o_descarte', label: 'NÃO' },
    { from: 'o_persona', to: 'o_mql', label: 'SIM' },
    { from: 'o_persona', to: 'o_c3', label: 'NÃO' },
    { from: 'o_mql', to: 'o_redflag', label: '' },
    { from: 'o_redflag', to: 'o_agendou', label: 'NÃO' },
    { from: 'o_redflag', to: 'o_descarte', label: 'SIM' },
    { from: 'o_agendou', to: 'o_sql', label: 'SIM' },
    { from: 'o_agendou', to: 'o_cad_agenda', label: 'NÃO' },
    { from: 'o_cad_agenda', to: 'o_agendou', label: '' },
    { from: 'o_cad_agenda', to: 'o_c_agenda', label: '' },
    { from: 'o_sql', to: 'o_reuniao_q', label: '' },
    { from: 'o_reuniao_q', to: 'o_possivel', label: 'SIM' },
    { from: 'o_reuniao_q', to: 'o_reagendamento', label: 'NÃO' },
    { from: 'o_reagendamento', to: 'o_agendou', label: '' },
    { from: 'o_possivel', to: 'o_sal', label: 'SIM' },
    { from: 'o_possivel', to: 'o_c4', label: 'NÃO' },
    { from: 'o_sal', to: 'o_followup', label: '' },
    { from: 'o_followup', to: 'o_fechou', label: '' },
    { from: 'o_fechou', to: 'o_contrato', label: 'SIM' },
    { from: 'o_fechou', to: 'o_c5', label: 'NÃO' },
    { from: 'o_contrato', to: 'o_onboarding', label: '' }
];

initFluxoPdfUX({
    viewportId: 'fluxoInboundViewport',
    zoomId: 'fluxoInboundZoom',
    stageId: 'fluxoInboundStage',
    imgId: 'fluxoInboundImg',
    hotsId: 'fluxoInboundHots',
    svgId: 'fluxoInboundPathSvg',
    toolbarId: 'fluxoInboundToolbar',
    stripId: 'fluxoInboundPathStrip',
    stripTextId: 'fluxoInboundPathText',
    defaultVer: 'v2',
    sources: {
        v2: 'assets/fluxo-inbound-oficial.png',
        v1: 'assets/fluxo-inbound-oficial-v1.png'
    },
    hots: { v2: FLUXO_INBOUND_PDF_HOTS, v1: [] },
    edges: { v2: FLUXO_INBOUND_PDF_EDGES, v1: [] }
});

initFluxoPdfUX({
    viewportId: 'fluxoOutboundViewport',
    zoomId: 'fluxoOutboundZoom',
    stageId: 'fluxoOutboundStage',
    imgId: 'fluxoOutboundImg',
    hotsId: 'fluxoOutboundHots',
    svgId: 'fluxoOutboundPathSvg',
    toolbarId: 'fluxoOutboundToolbar',
    stripId: 'fluxoOutboundPathStrip',
    stripTextId: 'fluxoOutboundPathText',
    defaultVer: 'v2',
    sources: {
        v2: 'assets/fluxo-outbound-oficial.png',
        v1: 'assets/fluxo-outbound-oficial-v1.png'
    },
    hots: { v2: FLUXO_OUTBOUND_PDF_HOTS, v1: [] },
    edges: { v2: FLUXO_OUTBOUND_PDF_EDGES, v1: [] }
});

/* CS: somente v1 no ar (v2 ocultada). */
const FLUXO_CS_PDF_HOTS = [];
const FLUXO_CS_PDF_EDGES = [];

initFluxoPdfUX({
    viewportId: 'fluxoCsViewport',
    zoomId: 'fluxoCsZoom',
    stageId: 'fluxoCsStage',
    imgId: 'fluxoCsImg',
    hotsId: 'fluxoCsHots',
    svgId: 'fluxoCsPathSvg',
    toolbarId: 'fluxoCsToolbar',
    stripId: 'fluxoCsPathStrip',
    stripTextId: 'fluxoCsPathText',
    defaultVer: 'v1',
    liveId: 'fluxoCsLive',
    readyHint: 'Arraste para navegar · zoom na imagem oficial',
    sources: {
        v1: 'assets/fluxo-cs-oficial-v1.png'
    },
    hots: { v1: FLUXO_CS_PDF_HOTS },
    edges: { v1: FLUXO_CS_PDF_EDGES }
});

initFluxoPdfUX({
    viewportId: 'fluxoSdrIaViewport',
    zoomId: 'fluxoSdrIaZoom',
    stageId: 'fluxoSdrIaStage',
    imgId: 'fluxoSdrIaImg',
    hotsId: 'fluxoSdrIaHots',
    svgId: 'fluxoSdrIaPathSvg',
    toolbarId: 'fluxoSdrIaToolbar',
    stripId: 'fluxoSdrIaPathStrip',
    stripTextId: 'fluxoSdrIaPathText',
    defaultVer: 'full',
    readyHint: 'Arraste para mover · scroll no mapa · Ctrl + scroll para zoom',
    sources: {
        full: 'assets/fluxo-sdr-ia-oficial.png?v=matriz-41'
    },
    hots: { full: [] },
    edges: { full: [] }
});

/* Objeções kit: busca + filtros por página */
function initObjKit(root) {
    if (!root) return;
    const search = root.querySelector('.obj-search');
    const filters = root.querySelectorAll('.obj-filter');
    const cards = root.querySelectorAll('.obj-card');
    const empty = root.querySelector('.obj-empty');
    let activeFilter = 'all';

    function apply() {
        const q = (search?.value || '').trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
            const type = card.getAttribute('data-obj-type') || '';
            const hay = (card.getAttribute('data-obj-text') || card.textContent || '').toLowerCase();
            const typeOk = activeFilter === 'all' || type === activeFilter;
            const textOk = !q || hay.includes(q);
            const show = typeOk && textOk;
            card.classList.toggle('is-hidden', !show);
            if (show) visible += 1;
        });
        if (empty) empty.hidden = visible > 0;
    }

    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            filters.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            activeFilter = btn.getAttribute('data-filter') || 'all';
            apply();
        });
    });
    if (search) {
        search.addEventListener('input', apply);
    }
}

document.querySelectorAll('.obj-kit-page').forEach(initObjKit);

/* Dores × Soluções · filtros */
(() => {
    const root = document.getElementById('gim-dores-solucoes');
    if (!root) return;
    const filters = root.querySelectorAll('[data-dxs-filter]');
    const cards = root.querySelectorAll('.dxs-card');
    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-dxs-filter') || 'all';
            filters.forEach((b) => b.classList.toggle('is-active', b === btn));
            cards.forEach((card) => {
                const type = card.getAttribute('data-dxs-type') || '';
                const anchor = card.getAttribute('data-dxs-anchor') || '';
                let show = true;
                if (key === 'oculta') show = type === 'oculta';
                else if (key === 'sangrenta') show = type === 'sangrenta';
                else if (key === 'melvin') show = anchor === 'melvin';
                else if (key === 'ma') show = anchor === 'ma';
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
})();

/* Funil Inbound: prévia enxuta (ocultar etapas candidatas) */
(() => {
    const btn = document.getElementById('funilInboundSlimToggle');
    const grid = document.getElementById('funilInboundGrid');
    if (!btn || !grid) return;
    btn.addEventListener('click', () => {
        const slim = grid.classList.toggle('is-slim-view');
        btn.classList.toggle('is-active', slim);
        btn.setAttribute('aria-pressed', slim ? 'true' : 'false');
        btn.textContent = slim ? 'Mostrar etapas sugeridas' : 'Ocultar etapas sugeridas';
    });
})();
