/* Contratação BDR · Matriz de Decisão (R&S) */
(function () {
    const KEY = 'melvinBdrMatrix.v2';
    const LEGACY_KEY = 'melvinBdrMatrix.v1';
    const LIKERT = [
        { value: '', label: '— não perguntado' },
        { value: '0', label: '0 · Não demonstrou' },
        { value: '1', label: '1 · Fraco' },
        { value: '2', label: '2 · Regular' },
        { value: '3', label: '3 · Bom' },
        { value: '4', label: '4 · Forte' },
        { value: '5', label: '5 · Excelente' }
    ];
    const GATE_LIKERT = [
        { value: '', label: '— ainda não feito' },
        { value: '1', label: '1 · Fraco' },
        { value: '2', label: '2 · Regular' },
        { value: '3', label: '3 · Bom' },
        { value: '4', label: '4 · Forte' },
        { value: '5', label: '5 · Excelente' }
    ];

    function opt(value, label, points, knockout) {
        return { value, label, points, knockout: !!knockout };
    }

    function defaultConfig() {
        return {
            role: 'BDR Outbound · Melvin',
            offer: 'PJ · 160h/mês · R$ 3.500 + variável',
            rev: 3,
            screen: [
                {
                    id: 'age',
                    label: 'Idade / senioridade',
                    hint: 'Critério legado da planilha. Use com cautela (risco de viés).',
                    weight: 4,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('18-21', '18 a 21', 2),
                        opt('21-25', '21 a 25', 3),
                        opt('25-30', '25 a 30', 4),
                        opt('30-40', '30 a 40', 5),
                        opt('40+', 'mais de 40', 2)
                    ]
                },
                {
                    id: 'education',
                    label: 'Formação',
                    hint: 'Modelo original: superior em andamento pontua acima do completo.',
                    weight: 6,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('medio', 'Ensino Médio', 0),
                        opt('superior-andamento', 'Superior em andamento', 5),
                        opt('superior-completo', 'Superior completo', 4),
                        opt('pos', 'Pós-graduação', 3)
                    ]
                },
                {
                    id: 'marital',
                    label: 'Estado civil',
                    hint: 'Legado da planilha. Lei 9.029/95 — peso 0 por padrão (não usar em decisão).',
                    weight: 0,
                    legalRisk: true,
                    options: [
                        opt('', '— não usar', null),
                        opt('casado', 'Casado(a)', 5),
                        opt('solteiro', 'Solteiro(a)', 3)
                    ]
                },
                {
                    id: 'salary',
                    label: 'Expectativa salarial vs oferta',
                    hint: 'Oferta atual: R$ 3.500 + bônus/comissão, PJ 160h.',
                    weight: 8,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('abaixo', 'Abaixo', 4),
                        opt('compativel', 'Compatível', 5),
                        opt('ligeiro', 'Ligeiramente acima', 2),
                        opt('muito-acima', 'Muito acima', -5, true)
                    ]
                },
                {
                    id: 'crm',
                    label: 'Experiência com ERP / CRM / afins',
                    weight: 8,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('sim', 'Sim', 5),
                        opt('nao', 'Não', 3)
                    ]
                },
                {
                    id: 'service',
                    label: 'Atendimento ao cliente',
                    weight: 6,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('online', 'Meios online apenas', 4),
                        opt('telefone-online', 'Telefone e meios online', 5),
                        opt('telefone', 'Por telefone, apenas', 3),
                        opt('presencial', 'Somente presencial', 2),
                        opt('pouca', 'Pouca ou nenhuma', 0)
                    ]
                },
                {
                    id: 'sales1',
                    label: 'Experiência comercial 1 (principal)',
                    hint: 'Não some SDR com BDR. SDR inbound ≠ hunter.',
                    weight: 12,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('bdr-out', 'BDR / Outbound (cargo ou função)', 5),
                        opt('sdr-hunter', 'SDR hunter · prospecção ativa', 5),
                        opt('sdr-in', 'SDR inbound · lead que chega', 3),
                        opt('complexas', 'Closer / AM / vendas complexas', 3),
                        opt('tele', 'Telemarketing', 2),
                        opt('ti', 'Tecnologia da Informação', 2),
                        opt('outras', 'Outras na área comercial', 2)
                    ]
                },
                {
                    id: 'sales2',
                    label: 'Experiência comercial 2 (complementar)',
                    weight: 8,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('bdr-out', 'BDR / Outbound (cargo ou função)', 5),
                        opt('sdr-hunter', 'SDR hunter · prospecção ativa', 5),
                        opt('sdr-in', 'SDR inbound · lead que chega', 3),
                        opt('complexas', 'Closer / AM / vendas complexas', 3),
                        opt('tele', 'Telemarketing', 2),
                        opt('ti', 'Tecnologia da Informação', 2),
                        opt('outras', 'Outras na área comercial', 2)
                    ]
                },
                {
                    id: 'outbound',
                    label: 'Prospecção ativa (BDR / Outbound)',
                    hint: 'Critério decisivo desta vaga. Título SDR não basta: vale quem abriu conta fria (lista ICP, cold call, LinkedIn, Apollo, cadência outbound). SDR inbound (tráfego pago / lead que chega) pontua menos.',
                    weight: 20,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('bdr', 'Cargo BDR e/ou outbound como função', 5),
                        opt('hunter', 'Título SDR/outro, mas prospecção ativa clara', 5),
                        opt('misto', 'Inbound + outbound no mesmo ciclo', 4),
                        opt('sdr-in', 'SDR inbound / qualifica demanda gerada', 2),
                        opt('farmer', 'Closer / AM / carteira (pouca abertura fria)', 1),
                        opt('nenhuma', 'Sem evidência de hunter', 0)
                    ]
                },
                {
                    id: 'vertical',
                    label: 'Fit de vertical (SaaS / industrial)',
                    hint: 'Melvin = SaaS industrial. Hunter de software > closer de infoproduto.',
                    weight: 8,
                    options: [
                        opt('', '— não perguntado', null),
                        opt('saas-ind', 'SaaS e/ou industrial', 5),
                        opt('saas', 'SaaS / tech (sem indústria)', 4),
                        opt('b2b', 'B2B comercial genérico', 3),
                        opt('b2c', 'B2C / varejo / high ticket edu', 2),
                        opt('ops', 'Ops / projetos / qualidade (sem hunter)', 1)
                    ]
                }
            ],
            process: [
                {
                    id: 'case',
                    step: '2',
                    label: 'Case curto (ICP + 1º e-mail + plano de toques)',
                    prompt: 'Nota 1–5. Entrega: uma conta ICP + primeiro e-mail + régua de toques. 1 = ICP genérico / e-mail de produto. 3 = estruturado, raso em dor industrial. 5 = ICP PCM/manutenção correto, gancho de dor, cadência crível.',
                    weight: 6
                },
                {
                    id: 'fit',
                    step: '3.1',
                    label: 'Entrevista de fit',
                    prompt: 'Nota 1–5 da fase 3.1 (não confundir com o roteiro de apoio abaixo). 1 = não quer hunter / rejeita oferta. 3 = cabe, sem fome. 5 = fome de outbound + fit Melvin (PJ/160h) + coachability.',
                    weight: 5
                },
                {
                    id: 'roleplay',
                    step: '3.2',
                    label: 'Role-play de abertura Outbound',
                    prompt: 'Nota 1–5. PCM de indústria que nunca ouviu a Melvin — 30 segundos. 1 = travou ou fez pitch de produto. 3 = educado, sem gancho. 5 = dor, pergunta, pedido de reunião.',
                    weight: 6
                },
                {
                    id: 'cso',
                    step: '4',
                    label: 'Conversa final com CSO',
                    prompt: 'Nota 1–5 da conversa com o CSO. 1 = desalinhado. 3 = CSO em dúvida. 5 = CSO recomenda contratar.',
                    weight: 3
                }
            ],
            interview: [
                {
                    id: 'hunter',
                    phase: '3.1',
                    label: 'Hunter / cadência',
                    prompt: 'Me conta uma cadência recente (e-mail, call, LinkedIn, WA) do primeiro toque até SQL. O que você media? O que mudou na régua?'
                },
                {
                    id: 'sdrVsBdr',
                    phase: '3.1',
                    label: 'SDR vs BDR (prospecção ativa)',
                    prompt: 'Muita gente escreve SDR e na prática fez BDR. Me prova prospecção ativa: como montava a lista (ICP), canal de 1º toque (cold call / LinkedIn / e-mail), cadência até a reunião, e o que era SQL. Se a demanda já chegava pronta (inbound / tráfego pago), diz isso com clareza.'
                },
                {
                    id: 'crmhygiene',
                    phase: '3.1',
                    label: 'Higiene de CRM',
                    prompt: 'Como o CRM fica no seu dia a dia? Me dá um exemplo de Lost com motivo e um follow-up que você não deixou morrer.'
                },
                {
                    id: 'coldcall',
                    phase: '3.2',
                    label: 'Apoio 3.2 · Cold call / abertura',
                    prompt: 'Role-play de treino (a nota oficial da fase é 3.2 acima): você liga para um PCM de indústria que nunca ouviu falar da Melvin. Primeiros 30 segundos — vai.'
                },
                {
                    id: 'resilience',
                    phase: '3.1',
                    label: 'Resiliência a rejeição',
                    prompt: 'Última semana pesada: quantos “não”? O que você fez no dia seguinte? Exemplo concreto, não discurso.'
                },
                {
                    id: 'icp',
                    phase: '3.1',
                    label: 'Fit ICP industrial',
                    prompt: 'Por que manutenção industrial / PCM — e não mais um SaaS genérico? O que você já vendeu para operação/chão de fábrica?'
                },
                {
                    id: 'offer',
                    phase: '3.1',
                    label: 'Fit da oferta',
                    prompt: 'PJ, 160h, home office, R$ 3.500 + variável. O que precisa ser verdade para você aceitar? Quando começa?'
                },
                {
                    id: 'coach',
                    phase: '3.1',
                    label: 'Coachability',
                    prompt: 'Me conta um feedback duro que você recebeu em vendas. O que mudou na semana seguinte?'
                },
                {
                    id: 'comm',
                    phase: '3.1',
                    label: 'Comunicação / clareza',
                    prompt: 'Explica a Melvin em 40 segundos para um líder de manutenção cético. Sem jargão de startup.'
                },
                {
                    id: 'start',
                    phase: '3.1',
                    label: 'Disponibilidade / início',
                    prompt: 'Quando você começaria? Há aviso prévio, outro processo ou restrição de horário (160h / home office)?'
                }
            ],
            interviewWeight: 0,
            bands: [
                { id: 'muito-quente', label: 'Muito quente', minRaw: 30, minIndex: 82, color: '#34d399' },
                { id: 'quente', label: 'Quente', minRaw: 25, minIndex: 70, color: '#fbbf24' },
                { id: 'morno', label: 'Morno', minRaw: 20, minIndex: 58, color: '#fb923c' },
                { id: 'frio', label: 'Frio', minRaw: 15, minIndex: 45, color: '#38bdf8' },
                { id: 'congelado', label: 'Congelado', minRaw: 0, minIndex: 0, color: '#94a3b8' }
            ],
            reco: [
                { id: 'case', label: 'Avançar · case + final', minIndex: 80, needInterview: true },
                { id: 'entrevista', label: 'Avançar · entrevista estruturada', minIndex: 66, needInterview: false },
                { id: 'banco', label: 'Banco / 2ª leva', minIndex: 52, needInterview: false },
                { id: 'nao', label: 'Não avançar agora', minIndex: 0, needInterview: false }
            ]
        };
    }

    function blankInterview() {
        const o = {};
        defaultConfig().interview.forEach((q) => { o[q.id] = ''; });
        return o;
    }

    function blankScreen() {
        const o = {};
        defaultConfig().screen.forEach((c) => { o[c.id] = ''; });
        return o;
    }

    function blankProcess() {
        const o = {};
        defaultConfig().process.forEach((g) => { o[g.id] = ''; });
        return o;
    }

    function seedCandidate(id, name, screen, notes) {
        return {
            id,
            name,
            screen: Object.assign(blankScreen(), screen),
            interview: blankInterview(),
            process: blankProcess(),
            interviewNote: '',
            processNote: '',
            notes: notes || '',
            starred: false,
            stage: 'triagem'
        };
    }

    function defaultCandidates() {
        return [
            seedCandidate('antony-trindade', 'Antony Trindade', {
                education: 'medio', crm: 'sim', service: 'telefone-online', sales1: 'outras', outbound: 'nenhuma', vertical: 'ops'
            }, 'CV: qualidade/ops (Frigelar, NET). HubSpot citado. Sem BDR/outbound — não há prospecção ativa.'),
            seedCandidate('carlos-carmo', 'Carlos Carmo', {
                education: 'medio', crm: 'sim', service: 'telefone-online', sales1: 'sdr-hunter', sales2: 'complexas', outbound: 'hunter', vertical: 'saas'
            }, 'CV: título SDR, mas prospecção ativa (ligações para agendar, telefone/e-mail/WA, outbound na Diversa, Growth Machine). Conta como hunter, não como SDR inbound. Checar se ainda quer BDR (já foi exec. de contas).'),
            seedCandidate('eduardo-rufino', 'Eduardo Rufino', {
                education: 'superior-andamento', crm: 'sim', service: 'telefone-online', sales1: 'sdr-hunter', sales2: 'complexas', outbound: 'hunter', vertical: 'saas'
            }, 'CV: Analista de Prospecção | SDR (abc71) + SDR Inovage (novas contas). Skills inbound/outbound. Houve AM/farmer na Ikki — na conversa separar hunter vs expansão de carteira.'),
            seedCandidate('gabriel-cavalcante', 'Gabriel Cavalcante', {
                education: 'superior-andamento', crm: 'sim', service: 'telefone-online', sales1: 'bdr-out', sales2: 'complexas', outbound: 'bdr', vertical: 'saas'
            }, 'CV: cargo SDR/BDR/Closer + outbound (EnfConcursos, BrandMonitor, InDriver). Pontua BDR. Risco: papel atual é closer/GTM — combinar se aceita executor de abertura fria.'),
            seedCandidate('janete-pelucio', 'Janete de Souza Pelucio', {
                education: 'pos', crm: 'sim', service: 'telefone-online', sales1: 'sdr-in', sales2: 'complexas', outbound: 'sdr-in', vertical: 'b2c'
            }, 'CV: SDR inbound (tráfego pago / Kommo) → closer high ticket. Supervisora de SDR. Não é hunter outbound. Overqualification para BDR industrial.'),
            seedCandidate('joao-erbolato', 'João Pedro M. B. Erbolato', {
                education: 'pos', crm: 'sim', service: 'online', sales1: 'outras', outbound: 'nenhuma', vertical: 'ops'
            }, 'CV: implementação/processos (Meu Chapa). HubSpot inbound/outbound citado em ops — não há evidência de cadência hunter. Validar se já abriu conta fria.'),
            seedCandidate('joao-camarinha', 'João Pedro Minetti Camarinha', {
                education: 'pos', crm: 'nao', service: 'online', sales1: 'outras', outbound: 'nenhuma', vertical: 'ops'
            }, 'CV: gestão de projetos / Legal Ops. Relacionamento comercial ≠ prospecção ativa. Sem BDR/outbound.'),
            seedCandidate('manuel-felipe', 'Manuel Felipe Quinderé Perestrelo', {
                age: '30-40', education: 'superior-andamento', marital: 'casado', crm: 'sim',
                service: 'telefone-online', sales1: 'bdr-out', sales2: 'sdr-hunter', outbound: 'bdr', vertical: 'b2b'
            }, 'CV: cargo BDR (Kollecta) + SDR com cold call (Wayno) + Apollo/Snov/ICP. Outbound explícito. Um dos fits mais literais da JD.'),
            seedCandidate('michelle-nunes', 'Michelle Santos Nunes', {
                education: 'superior-completo', crm: 'sim', service: 'telefone-online', sales1: 'sdr-hunter', sales2: 'sdr-hunter', outbound: 'hunter', vertical: 'saas'
            }, 'CV: título SDR, mas prospecção ativa (LinkedIn, e-mail, telefone, WA) e “abordagem outbound” (FLUA). Curso Exact BDR 2025. Conta como hunter, não inbound.'),
            seedCandidate('nayara-athayde', 'Nayara Athayde', {
                education: 'superior-completo', crm: 'sim', service: 'telefone-online', sales1: 'sdr-hunter', sales2: 'complexas', outbound: 'misto', vertical: 'saas'
            }, 'CV: SDR com outbound/inbound (Omni, Sysmiddle) + Meetime. Também foi exec. de contas (ciclo completo / Miami). Mix hunter + farmer — validar fome de abertura fria.'),
            seedCandidate('osvaldo-oliveira', 'Osvaldo Oliveira', {
                education: 'medio', crm: 'sim', service: 'telefone-online', sales1: 'sdr-hunter', sales2: 'complexas', outbound: 'hunter', vertical: 'saas'
            }, 'CV: 5+ anos SDR sênior com prospecção de novos clientes, BANT/SPIN, Lusha/Apollo/LSN, “prospecção ativa”. Título SDR, DNA de BDR hunter. Validar estabilidade (jobs curtos).'),
            seedCandidate('poliana-sampaio', 'Poliana Estevão Sampaio', {
                education: 'superior-andamento', crm: 'sim', service: 'telefone-online', sales1: 'complexas', sales2: 'sdr-hunter', outbound: 'hunter', vertical: 'saas'
            }, 'CV: Hunter/SDR na V4 (2018–2021) com prospecção ativa — isso pontua. Papel recente é AM/closer (TOTVS, Super Professor). Checar se volta para abertura fria.')
        ];
    }

    function clone(v) {
        return JSON.parse(JSON.stringify(v));
    }

    function loadState() {
        const base = { config: defaultConfig(), candidates: defaultCandidates(), view: 'ranking', focusId: 'manuel-felipe', compare: [], filter: 'all' };
        try {
            let raw = localStorage.getItem(KEY);
            let migrating = false;
            if (!raw) {
                raw = localStorage.getItem(LEGACY_KEY);
                migrating = !!raw;
            }
            if (!raw) return base;
            const saved = JSON.parse(raw);
            if (!saved.config || Number(saved.config.rev || 0) < 2) migrating = true;
            const cfg = defaultConfig();
            const fromV2 = saved.config && Number(saved.config.rev || 0) >= 2 && Number(saved.config.rev || 0) < 3;
            if (!migrating && saved.config) {
                if (Array.isArray(saved.config.screen) && saved.config.screen.some((c) => c.id === 'outbound')) cfg.screen = saved.config.screen;
                if (Array.isArray(saved.config.interview) && saved.config.interview.length) {
                    cfg.interview = saved.config.interview;
                    if (!cfg.interview.some((q) => q.id === 'sdrVsBdr')) {
                        const extra = defaultConfig().interview.find((q) => q.id === 'sdrVsBdr');
                        const at = cfg.interview.findIndex((q) => q.id === 'hunter');
                        cfg.interview.splice(at < 0 ? 0 : at + 1, 0, extra);
                    }
                }
                if (!fromV2 && Array.isArray(saved.config.process) && saved.config.process.length) cfg.process = saved.config.process;
                if (!fromV2 && typeof saved.config.interviewWeight === 'number') cfg.interviewWeight = saved.config.interviewWeight;
                if (saved.config.bands) cfg.bands = saved.config.bands;
                if (saved.config.reco) cfg.reco = saved.config.reco;
                if (saved.config.role) cfg.role = saved.config.role;
                if (saved.config.offer) cfg.offer = saved.config.offer;
            }
            cfg.rev = 3;
            const byId = Object.fromEntries(base.candidates.map((c) => [c.id, c]));
            const cands = Array.isArray(saved.candidates) && saved.candidates.length
                ? saved.candidates.map((c) => {
                    const seed = byId[c.id] || seedCandidate(c.id, c.name || 'Candidato', {}, '');
                    const prev = Object.assign({}, c.screen || {});
                    if (prev.sales1 === 'pre-vendas') delete prev.sales1;
                    if (prev.sales2 === 'pre-vendas') delete prev.sales2;
                    return Object.assign(seed, c, {
                        screen: migrating
                            ? Object.assign(blankScreen(), prev, seed.screen)
                            : Object.assign(blankScreen(), seed.screen, prev),
                        notes: migrating ? seed.notes : (c.notes || seed.notes),
                        interview: Object.assign(blankInterview(), c.interview || {}),
                        process: Object.assign(blankProcess(), c.process || {}),
                        processNote: c.processNote || ''
                    });
                })
                : base.candidates;
            return {
                config: cfg,
                candidates: cands,
                view: saved.view || 'ranking',
                focusId: saved.focusId || cands[0]?.id,
                compare: Array.isArray(saved.compare) ? saved.compare.slice(0, 3) : [],
                filter: saved.filter || 'all'
            };
        } catch (e) {
            return base;
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(KEY, JSON.stringify({
                config: state.config,
                candidates: state.candidates,
                view: state.view,
                focusId: state.focusId,
                compare: state.compare,
                filter: state.filter || 'all'
            }));
        } catch (e) {}
    }

    function gateLine(c) {
        const p = c.process || {};
        return (state.config.process || []).map((g) => g.step + ' ' + (p[g.id] ? p[g.id] + '/5' : '—')).join(' · ');
    }

    function gateSelect(cid, field, value) {
        return GATE_LIKERT.map((o) => `<option value="${esc(o.value)}" ${String(value || '') === String(o.value) ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
    }

    function outboundLabel(c) {
        const crit = state.config.screen.find((x) => x.id === 'outbound');
        const opt = crit ? optionOf(crit, c.screen.outbound) : null;
        return opt && opt.value ? opt.label : 'Outbound em branco';
    }

    function optionOf(crit, value) {
        return (crit.options || []).find((o) => o.value === value) || null;
    }

    function maxPoints(crit) {
        return Math.max(1, ...crit.options.map((o) => (typeof o.points === 'number' ? o.points : 0)));
    }

    function scoreCandidate(c, cfg) {
        let raw = 0;
        let weighted = 0;
        let weightUsed = 0;
        const knockouts = [];
        const unanswered = [];
        const strengths = [];
        const gaps = [];

        cfg.screen.forEach((crit) => {
            const val = c.screen[crit.id];
            const opt = optionOf(crit, val);
            if (!val || !opt || opt.points == null) {
                unanswered.push(crit.label);
                return;
            }
            raw += Number(opt.points) || 0;
            const mx = maxPoints(crit);
            const norm = mx > 0 ? Math.max(0, opt.points) / mx : 0;
            weighted += norm * (crit.weight || 0);
            weightUsed += crit.weight || 0;
            if (opt.knockout) knockouts.push(crit.label + ': ' + opt.label);
            if (norm >= 0.8 && (crit.weight || 0) >= 8) strengths.push(crit.label);
            if (norm <= 0.35 && (crit.weight || 0) >= 8) gaps.push(crit.label);
        });

        const ivAns = cfg.interview
            .map((q) => c.interview[q.id])
            .filter((v) => v !== '' && v != null)
            .map(Number);
        let ivAvg = null;
        if (ivAns.length) {
            ivAvg = ivAns.reduce((a, b) => a + b, 0) / ivAns.length;
            if ((cfg.interviewWeight || 0) > 0) {
                raw += ivAvg;
                weighted += (ivAvg / 5) * cfg.interviewWeight;
                weightUsed += cfg.interviewWeight;
                if (ivAvg >= 4) strengths.push('Roteiro de entrevista');
                if (ivAvg < 2.5) gaps.push('Roteiro de entrevista');
            }
        }

        const proc = c.process || {};
        (cfg.process || []).forEach((g) => {
            const val = proc[g.id];
            if (val === '' || val == null) {
                unanswered.push(g.step + ' · ' + g.label);
                return;
            }
            const n = Number(val);
            raw += n;
            weighted += (n / 5) * (g.weight || 0);
            weightUsed += g.weight || 0;
            if (n >= 4) strengths.push(g.step + ' ' + g.label);
            if (n < 3) gaps.push(g.step + ' ' + g.label);
        });

        if (String(c.interview.offer) === '0') {
            knockouts.push('Rejeita a oferta (PJ / 160h / R$ 3.500)');
        }

        const index = weightUsed > 0 ? Math.round((weighted / weightUsed) * 100) : 0;
        const bands = [...cfg.bands].sort((a, b) => b.minRaw - a.minRaw);
        const heat = bands.find((b) => raw >= b.minRaw) || bands[bands.length - 1];
        const ivCoverage = cfg.interview.length ? ivAns.length / cfg.interview.length : 0;
        const reco = processReco(proc, knockouts, index);
        const totalFields = cfg.screen.length + (cfg.process || []).length;
        const coverage = totalFields ? Math.round(((totalFields - unanswered.length) / totalFields) * 100) : 0;

        return { raw: Math.round(raw * 10) / 10, index, heat, reco, knockouts, unanswered, strengths, gaps, ivAvg, ivCoverage, coverage, process: proc };
    }

    function processReco(proc, knockouts, index) {
        const n = (id) => (proc[id] === '' || proc[id] == null) ? null : Number(proc[id]);
        if (knockouts.length) return { id: 'knockout', label: 'Recusar · knockout' };
        const caseN = n('case');
        const fitN = n('fit');
        const rpN = n('roleplay');
        const csoN = n('cso');
        if (caseN == null) {
            if (index >= 66) return { id: 'case', label: '1 · Triagem ok · próximo: Case (2)' };
            if (index >= 52) return { id: 'banco', label: 'Banco / 2ª leva' };
            return { id: 'nao', label: 'Não avançar na triagem' };
        }
        if (caseN < 3) return { id: 'nao', label: 'Não avançar · case < 3' };
        if (fitN == null || rpN == null) return { id: 'entrevista', label: '2 · Case ok · próximo: Fit + role-play (3)' };
        if (fitN < 3 || rpN < 3) return { id: 'nao', label: 'Não avançar · fit/role-play < 3' };
        if (csoN == null) return { id: 'cso', label: '3 · Entrevista ok · próximo: Final CSO (4)' };
        if (csoN >= 4) return { id: 'oferta', label: '4 · CSO ok · avançar oferta' };
        if (csoN >= 3) return { id: 'banco', label: 'CSO em dúvida · banco' };
        return { id: 'nao', label: 'Não avançar · CSO < 3' };
    }

    function esc(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function firstNameKey(s) {
        const first = String(s || '').trim().split(/\s+/)[0] || '';
        return first.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    const STAGES = [
        { id: 'triagem', label: '1 · Triagem' },
        { id: 'case', label: '2 · Case' },
        { id: 'entrevista', label: '3 · Fit + role-play' },
        { id: 'final', label: '4 · Final CSO' },
        { id: 'oferta', label: 'Oferta' },
        { id: 'banco', label: 'Banco' },
        { id: 'recusado', label: 'Recusado' }
    ];

    let state = null;

    function ranked() {
        return state.candidates
            .map((c) => ({ c, s: scoreCandidate(c, state.config) }))
            .sort((a, b) => b.s.index - a.s.index || b.s.raw - a.s.raw || a.c.name.localeCompare(b.c.name, 'pt-BR'));
    }

    function selectOpts(crit, value) {
        return crit.options.map((o) => `<option value="${esc(o.value)}" ${o.value === value ? 'selected' : ''}>${esc(o.label)}${o.points == null ? '' : ' (' + o.points + ')'}</option>`).join('');
    }

    function navHtml() {
        const items = [
            ['ranking', 'Ranking'],
            ['planilha', 'Planilha'],
            ['entrevista', 'Processo seletivo'],
            ['comparar', 'Comparar'],
            ['pesos', 'Pesos & regras'],
            ['decisao', 'Decisão']
        ];
        return items.map(([id, label]) => `<button type="button" class="mx-tab${state.view === id ? ' is-active' : ''}" data-mx-view="${id}">${label}</button>`).join('');
    }

    function renderRanking() {
        const all = ranked();
        const filter = state.filter || 'all';
        const rows = all.filter((r) => {
            if (filter === 'star') return r.c.starred;
            if (filter === 'pending') return r.s.ivCoverage < 0.4 && !r.s.knockouts.length;
            if (filter === 'knock') return r.s.knockouts.length > 0;
            if (filter === 'hunter') return r.c.screen.outbound === 'bdr' || r.c.screen.outbound === 'hunter';
            if (filter === 'go') return r.s.index >= 66 && !r.s.knockouts.length;
            return true;
        });
        const top = all[0];
        const stars = all.filter((r) => r.c.starred).length;
        const hunters = all.filter((r) => r.c.screen.outbound === 'bdr' || r.c.screen.outbound === 'hunter').length;
        const kpis = `
            <div class="mx-kpis">
                <article class="mx-kpi"><span>Candidatos</span><strong>${all.length}</strong></article>
                <article class="mx-kpi"><span>Hunter / BDR / Out</span><strong>${hunters}</strong></article>
                <article class="mx-kpi"><span>Shortlist ★</span><strong>${stars}</strong></article>
                <article class="mx-kpi"><span>Líder agora</span><strong>${top ? esc(top.c.name.split(' ')[0]) : '—'}</strong><small>${top ? top.s.index + ' pts índice' : ''}</small></article>
            </div>
            <div class="mx-filters">
                ${[['all', 'Todos'], ['hunter', 'BDR / prospecção ativa'], ['go', 'Avançar (≥66)'], ['star', 'Shortlist ★'], ['pending', 'Falta entrevista'], ['knock', 'Knockout']].map(([id, lab]) =>
                    `<button type="button" class="mx-chip${filter === id ? ' is-on' : ''}" data-mx-filter="${id}">${lab}</button>`
                ).join('')}
            </div>
            <p class="mx-help">Item 1 do processo (triagem de CVs) já está nesta aba e na Planilha. Notas 1–5 das fases 2 (case), 3.1 (fit), 3.2 (role-play) e 4 (CSO) entram no índice quando preenchidas — em branco não penalizam. Corte: nota &lt; 3 na fase = não avançar.</p>`;
        const cards = rows.length ? rows.map((r) => {
            const i = all.indexOf(r) + 1;
            const checked = state.compare.includes(r.c.id) ? 'checked' : '';
            return `<article class="mx-card" data-mx-open="${esc(r.c.id)}">
                <div class="mx-card-top">
                    <span class="mx-rank">#${i}</span>
                    <button type="button" class="mx-star${r.c.starred ? ' is-on' : ''}" data-mx-star="${esc(r.c.id)}" title="Shortlist">★</button>
                    <label class="mx-cmp"><input type="checkbox" data-mx-cmp="${esc(r.c.id)}" ${checked}> comparar</label>
                </div>
                <h3>${esc(r.c.name)}</h3>
                <p class="mx-out-tag" data-out="${esc(r.c.screen.outbound || '')}">${esc(outboundLabel(r.c))}</p>
                <p class="mx-gates">${esc(gateLine(r.c))}</p>
                <p class="mx-card-reco" data-heat="${esc(r.s.heat.id)}" style="--h:${esc(r.s.heat.color)}">${esc(r.s.reco.label)}</p>
                <div class="mx-meters">
                    <div><span>Índice R&S</span><b>${r.s.index}</b><i style="width:${r.s.index}%"></i></div>
                    <div><span>Pontos brutos</span><b>${r.s.raw}</b></div>
                    <div><span>Calor</span><b>${esc(r.s.heat.label)}</b></div>
                    <div><span>Preenchido</span><b>${r.s.coverage}%</b></div>
                </div>
                <p class="mx-mini">${r.s.knockouts.length ? '⛔ ' + esc(r.s.knockouts.join(' · ')) : (r.s.strengths.slice(0, 2).join(' · ') || 'Complete a triagem / entrevista')}</p>
                <div class="mx-card-actions">
                    <button type="button" data-mx-goto="entrevista" data-mx-focus="${esc(r.c.id)}">Abrir processo</button>
                    <a href="#job-bdr" data-mx-cv="${esc(r.c.id)}">Ver CV</a>
                </div>
            </article>`;
        }).join('') : '<p class="mx-help">Nenhum candidato neste filtro.</p>';
        return kpis + `<div class="mx-cards">${cards}</div>`;
    }

    function renderPlanilha() {
        const cfg = state.config;
        const head = ['★', 'Candidato', ...cfg.process.map((g) => g.step), ...cfg.screen.map((c) => c.label), 'Roteiro', 'Bruto', 'Índice', 'Calor', 'Recomendação', 'Fase']
            .map((h) => `<th>${esc(h)}</th>`).join('');
        const body = ranked().map((r) => {
            const procCells = cfg.process.map((g) => `<td><select data-mx-proc="${esc(r.c.id)}" data-field="${esc(g.id)}">${gateSelect(r.c.id, g.id, r.c.process && r.c.process[g.id])}</select></td>`).join('');
            const cells = cfg.screen.map((crit) => `<td><select data-mx-screen="${esc(r.c.id)}" data-field="${esc(crit.id)}">${selectOpts(crit, r.c.screen[crit.id])}</select></td>`).join('');
            const iv = r.s.ivAvg == null ? '—' : r.s.ivAvg.toFixed(1);
            const st = STAGES.map((s) => `<option value="${s.id}" ${r.c.stage === s.id ? 'selected' : ''}>${s.label}</option>`).join('');
            return `<tr>
                <td><button type="button" class="mx-star${r.c.starred ? ' is-on' : ''}" data-mx-star="${esc(r.c.id)}">★</button></td>
                <td class="mx-name-cell"><button type="button" data-mx-goto="entrevista" data-mx-focus="${esc(r.c.id)}">${esc(r.c.name)}</button></td>
                ${procCells}
                ${cells}
                <td>${iv}</td>
                <td><strong>${r.s.raw}</strong></td>
                <td><strong>${r.s.index}</strong></td>
                <td><span class="mx-heat" data-heat="${esc(r.s.heat.id)}" style="--h:${esc(r.s.heat.color)}">${esc(r.s.heat.label)}</span></td>
                <td>${esc(r.s.reco.label)}</td>
                <td><select data-mx-stage="${esc(r.c.id)}">${st}</select></td>
            </tr>`;
        }).join('');
        return `<p class="mx-help">Colunas 2 / 3.1 / 3.2 / 4 = notas oficiais do processo (1–5). O restante é a triagem de CV. Em branco = fase ainda não feita.</p>
            <div class="mx-table-wrap"><table class="mx-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
    }

    function renderEntrevista() {
        const cfg = state.config;
        const list = [...state.candidates].sort((a, b) => firstNameKey(a.name).localeCompare(firstNameKey(b.name), 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'));
        const focus = list.find((c) => c.id === state.focusId) || list[0];
        if (!focus) return '';
        const s = scoreCandidate(focus, cfg);
        const proc = focus.process || {};
        const nav = list.map((c) => `<button type="button" class="mx-mini-nav${c.id === focus.id ? ' is-on' : ''}" data-mx-focus="${esc(c.id)}">${esc(c.name.split(' ')[0])}</button>`).join('');
        const rail = `<div class="mx-step-rail">
            <span class="mx-step is-done">1 · Triagem · ${s.index}</span>
            ${(cfg.process || []).map((g) => {
                const v = proc[g.id];
                const cls = v ? (Number(v) >= 3 ? 'is-done' : 'is-fail') : 'is-now';
                return `<span class="mx-step ${cls}">${esc(g.step)} · ${v ? v + '/5' : '—'}</span>`;
            }).join('')}
        </div>`;
        const gates = (cfg.process || []).map((g) => {
            const val = proc[g.id] || '';
            return `<article class="mx-q mx-q--gate">
                <header><strong>${esc(g.step)} · ${esc(g.label)}</strong><select data-mx-proc="${esc(focus.id)}" data-field="${esc(g.id)}">${gateSelect(focus.id, g.id, val)}</select></header>
                <p>${esc(g.prompt)}</p>
            </article>`;
        }).join('');
        const qBlock = (phase, title) => {
            const qs = cfg.interview.filter((q) => (q.phase || '3.1') === phase);
            if (!qs.length) return '';
            const pending = qs.filter((q) => !focus.interview[q.id]);
            const cards = qs.map((q) => {
                const val = focus.interview[q.id] || '';
                const opts = LIKERT.map((o) => `<option value="${esc(o.value)}" ${String(val) === String(o.value) ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
                return `<article class="mx-q">
                    <header><strong>${esc(q.label)}</strong><select data-mx-iv="${esc(focus.id)}" data-q="${esc(q.id)}">${opts}</select></header>
                    <p>${esc(q.prompt)}</p>
                </article>`;
            }).join('');
            const hint = pending.length
                ? `<p class="mx-mini">${pending.length} pergunta(s) ainda em branco — não entram no índice; servem de evidência para a nota oficial da fase.</p>`
                : `<p class="mx-mini">Roteiro preenchido. Lance a nota oficial da fase acima.</p>`;
            return `<h4 class="mx-h4">${esc(title)}</h4>${hint}${cards}`;
        };
        return `<div class="mx-iv">
            <div class="mx-iv-nav">${nav}</div>
            <div class="mx-iv-main">
                <div class="mx-iv-head">
                    <div>
                        <h3>${esc(focus.name)}</h3>
                        <p>${esc(s.reco.label)} · índice ${s.index} · ${esc(gateLine(focus))}</p>
                    </div>
                    <a class="mx-link" href="#job-bdr" data-mx-cv="${esc(focus.id)}">Abrir CV →</a>
                </div>
                ${rail}
                <div class="mx-script">
                    <h4>Como é o processo seletivo</h4>
                    <ol>
                        <li><b>Triagem de currículos</b> — já pontuada na Planilha / Ranking (item 1).</li>
                        <li><b>Case curto</b> — conta ICP + 1º e-mail + plano de toques · nota 1–5.</li>
                        <li><b>Entrevista de fit + role-play de abertura Outbound</b> — notas 3.1 e 3.2.</li>
                        <li><b>Conversa final com CSO</b> — nota 1–5.</li>
                    </ol>
                </div>
                <h4 class="mx-h4">Notas oficiais das fases (entram no índice)</h4>
                ${gates}
                <label class="mx-notes">Evidências do case / role-play / CSO
                    <textarea data-mx-procnote="${esc(focus.id)}" rows="3" placeholder="O que entregou no case, como foi a abertura, o que o CSO combinou…">${esc(focus.processNote || '')}</textarea>
                </label>
                ${qBlock('3.1', 'Roteiro de apoio · 3.1 Entrevista de fit')}
                ${qBlock('3.2', 'Roteiro de apoio · 3.2 Role-play')}
                <label class="mx-notes">Evidências STAR da conversa
                    <textarea data-mx-ivnote="${esc(focus.id)}" rows="3" placeholder="Frases literais, números, disponibilidade…">${esc(focus.interviewNote)}</textarea>
                </label>
                <label class="mx-notes">Notas de triagem (CV)
                    <textarea data-mx-notes="${esc(focus.id)}" rows="3">${esc(focus.notes)}</textarea>
                </label>
            </div>
        </div>`;
    }

    function renderComparar() {
        const ids = state.compare.slice(0, 3);
        if (ids.length < 2) {
            return `<p class="mx-help">Marque 2 ou 3 candidatos no Ranking (checkbox “comparar”) para ver o lado a lado — competências, calor e recomendação.</p>${renderRanking()}`;
        }
        const rows = ids.map((id) => {
            const c = state.candidates.find((x) => x.id === id);
            return { c, s: scoreCandidate(c, state.config) };
        });
        const cfg = state.config;
        const head = `<tr><th>Critério</th>${rows.map((r) => `<th>${esc(r.c.name)}</th>`).join('')}</tr>`;
        const screenRows = cfg.screen.map((crit) => {
            const tds = rows.map((r) => {
                const opt = optionOf(crit, r.c.screen[crit.id]);
                return `<td>${opt && opt.label ? esc(opt.label) : '—'}${opt && opt.points != null ? ` <small>(${opt.points})</small>` : ''}</td>`;
            }).join('');
            return `<tr><th>${esc(crit.label)}</th>${tds}</tr>`;
        }).join('');
        const procRows = (cfg.process || []).map((g) => {
            const tds = rows.map((r) => {
                const v = (r.c.process || {})[g.id];
                return `<td>${v === '' || v == null ? '—' : v + '/5'}</td>`;
            }).join('');
            return `<tr><th>${esc(g.step)} · ${esc(g.label)}</th>${tds}</tr>`;
        }).join('');
        const ivRows = cfg.interview.map((q) => {
            const tds = rows.map((r) => {
                const v = r.c.interview[q.id];
                return `<td>${v === '' || v == null ? '—' : v + '/5'}</td>`;
            }).join('');
            return `<tr><th>${esc(q.label)}</th>${tds}</tr>`;
        }).join('');
        const summary = `<tr><th>Índice / bruto / reco</th>${rows.map((r) => `<td><b>${r.s.index}</b> · ${r.s.raw}<br>${esc(r.s.reco.label)}</td>`).join('')}</tr>`;
        return `<div class="mx-table-wrap"><table class="mx-table mx-table--cmp"><thead>${head}</thead><tbody>${summary}${procRows}${screenRows}${ivRows}</tbody></table></div>
            <p class="mx-help">Dica R&S: não some “carisma”. Compare evidência no mesmo critério. Quem tem mais lacunas em hunter/CRM/cold call perde para o BDR Melvin — mesmo com CV bonito de closer.</p>`;
    }

    function renderPesos() {
        const cfg = state.config;
        const wScreen = cfg.screen.reduce((a, c) => a + Number(c.weight || 0), 0);
        const wProc = (cfg.process || []).reduce((a, g) => a + Number(g.weight || 0), 0);
        const total = wScreen + wProc + Number(cfg.interviewWeight || 0);
        const warn = Math.abs(total - 100) > 0.5 ? `<p class="mx-warn">Soma dos pesos = ${total}. Ideal: 100.</p>` : `<p class="mx-ok">Pesos somam ${total}.</p>`;
        const legalOn = cfg.screen.some((c) => c.legalRisk && Number(c.weight) > 0);
        const rows = cfg.screen.map((c) => `<tr>
            <td>${esc(c.label)}${c.legalRisk ? ' <em class="mx-legal">risco jurídico · Lei 9.029</em>' : ''}<div class="mx-hint">${esc(c.hint || '')}</div></td>
            <td><input type="number" min="0" max="40" step="1" value="${c.weight}" data-mx-weight="${esc(c.id)}"></td>
            <td class="mx-opts">${c.options.filter((o) => o.value).map((o) =>
                `<label class="mx-opt-edit">${esc(o.label)} <input type="number" step="1" data-mx-opt="${esc(c.id)}" data-opt-val="${esc(o.value)}" value="${o.points == null ? '' : o.points}">${o.knockout ? ' <span title="knockout">⛔</span>' : ''}</label>`
            ).join('')}</td>
        </tr>`).join('');
        const iv = cfg.interview.map((q, i) => `<article class="mx-q">
            <header class="mx-q-edit-head"><strong>Pergunta ${i + 1}</strong><button type="button" class="mx-btn mx-btn--ghost mx-btn--tiny" data-mx-delq="${esc(q.id)}">Remover</button></header>
            <label>Rótulo <input type="text" data-mx-qlabel="${esc(q.id)}" value="${esc(q.label)}"></label>
            <label>Texto do bate-papo <textarea rows="2" data-mx-qprompt="${esc(q.id)}">${esc(q.prompt)}</textarea></label>
        </article>`).join('');
        const bands = cfg.bands.map((b) => `<tr>
            <td>${esc(b.label)}</td>
            <td><input type="number" data-mx-band="${esc(b.id)}" data-k="minRaw" value="${b.minRaw}"></td>
            <td><input type="number" data-mx-band="${esc(b.id)}" data-k="minIndex" value="${b.minIndex}"></td>
        </tr>`).join('');
        return `<p class="mx-help">Modelo original da Excel + critério decisivo de <b>prospecção ativa</b> (peso 20): cargo BDR/outbound e SDR hunter valem 5; SDR inbound vale 2. Estado civil veio da planilha e está com peso 0 — não use para decidir.</p>
            ${warn}
            ${legalOn ? '<p class="mx-warn">Estado civil está com peso &gt; 0. Em R&S sério isso não entra em decisão (Lei 9.029/95). Volte o peso para 0.</p>' : ''}
            <label class="mx-notes">Oferta de referência <input type="text" data-mx-offer value="${esc(cfg.offer)}"></label>
            <h4 class="mx-h4">Pesos da triagem</h4>
            <div class="mx-table-wrap"><table class="mx-table"><thead><tr><th>Critério</th><th>Peso</th><th>Opções (nota)</th></tr></thead><tbody>
            ${rows}
            ${(cfg.process || []).map((g) => `<tr><td>${esc(g.step)} · ${esc(g.label)}<div class="mx-hint">${esc(g.prompt)}</div></td><td><input type="number" min="0" max="40" step="1" value="${g.weight}" data-mx-procw="${esc(g.id)}"></td><td>Nota 1–5 · em branco = fase não feita</td></tr>`).join('')}
            <tr><td>Roteiro de apoio (média 0–5, opcional)</td><td><input type="number" min="0" max="50" value="${cfg.interviewWeight}" data-mx-ivw></td><td>${cfg.interview.length} perguntas · padrão 0 (não entra no índice)</td></tr>
            </tbody></table></div>
            <h4 class="mx-h4">Faixas de calor (pontos brutos, como na Excel)</h4>
            <div class="mx-table-wrap"><table class="mx-table"><thead><tr><th>Faixa</th><th>Mín. bruto</th><th>Mín. índice</th></tr></thead><tbody>${bands}</tbody></table></div>
            <h4 class="mx-h4">Perguntas do bate-papo (editáveis · Likert 0–5 · em branco = não perguntado)</h4>
            ${iv}
            <div class="mx-toolbar">
                <button type="button" class="mx-btn" data-mx-addq>Adicionar pergunta</button>
                <button type="button" class="mx-btn mx-btn--ghost" data-mx-reset>Restaurar padrão Melvin</button>
            </div>`;
    }

    function whyText(r) {
        const bits = [];
        if (r.s.knockouts.length) bits.push('Knockout: ' + r.s.knockouts.join('; ') + '.');
        if (r.s.strengths.length) bits.push('Pontos: ' + r.s.strengths.join(', ') + '.');
        if (r.s.gaps.length) bits.push('Lacunas: ' + r.s.gaps.join(', ') + '.');
        if (r.s.ivCoverage < 0.4 && !(r.c.process && r.c.process.fit)) bits.push('Fit (3.1) ainda em branco.');
        bits.push('Recomendação: ' + r.s.reco.label + '.');
        return bits.join(' ');
    }

    function renderDecisao() {
        const rows = ranked();
        const shortlist = rows.filter((r) => r.c.starred || r.s.index >= 66);
        const pipeline = STAGES.map((st) => {
            const n = state.candidates.filter((c) => c.stage === st.id).length;
            return `<span class="mx-pipe"><b>${n}</b> ${esc(st.label)}</span>`;
        }).join('');
        const lis = shortlist.map((r, i) => `<article class="mx-decision">
            <header><span>#${i + 1}</span><h3>${esc(r.c.name)}</h3><em>${esc(r.s.reco.label)}</em></header>
            <p>${esc(whyText(r))}</p>
            <p class="mx-mini">Fase: ${esc((STAGES.find((s) => s.id === r.c.stage) || {}).label || r.c.stage)} · ${esc(gateLine(r.c))} · índice ${r.s.index}</p>
        </article>`).join('');
        return `<div class="mx-kpis">${pipeline}</div>
            <p class="mx-help">Decisão de comitê: shortlist = ★ ou índice ≥ 66. Use isto na reunião com Vinícius — não o CV isolado.</p>
            <div class="mx-toolbar">
                <button type="button" class="mx-btn" data-mx-export>Exportar CSV</button>
                <button type="button" class="mx-btn mx-btn--ghost" data-mx-copy>Copiar parecer</button>
            </div>
            <div class="mx-decisions">${lis || '<p>Ninguém ainda no corte. Marque ★ no ranking ou complete a triagem.</p>'}</div>`;
    }

    function syncTheme() {
        const root = document.getElementById('hireMatrixRoot');
        if (!root) return;
        root.setAttribute('data-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    }

    function render() {
        const root = document.getElementById('hireMatrixRoot');
        if (!root) return;
        syncTheme();
        const wrap = root.querySelector('.mx-table-wrap');
        const scrollX = wrap ? wrap.scrollLeft : 0;
        const scrollY = window.scrollY;
        const views = {
            ranking: renderRanking,
            planilha: renderPlanilha,
            entrevista: renderEntrevista,
            comparar: renderComparar,
            pesos: renderPesos,
            decisao: renderDecisao
        };
        const body = (views[state.view] || renderRanking)();
        root.innerHTML = `<div class="mx-app">
            <header class="mx-head">
                <div>
                    <p class="mx-kicker">R&S · Seleção BDR</p>
                    <h2>Matriz de Candidatos</h2>
                    <p class="mx-sub">${esc(state.config.role)} · processo: triagem → case → fit + role-play → CSO</p>
                </div>
            </header>
            <div class="mx-tabs">${navHtml()}</div>
            <div class="mx-body">${body}</div>
        </div>`;
        bind(root);
        const wrap2 = root.querySelector('.mx-table-wrap');
        if (wrap2) wrap2.scrollLeft = scrollX;
        window.scrollTo(0, scrollY);
    }

    function candById(id) {
        return state.candidates.find((c) => c.id === id);
    }

    function exportCsv() {
        const cfg = state.config;
        const header = ['Nome', ...cfg.process.map((g) => g.step + ' ' + g.label), ...cfg.screen.map((c) => c.label), 'Roteiro médio', 'Bruto', 'Índice', 'Calor', 'Recomendação', 'Fase', 'Notas'];
        const lines = [header];
        ranked().forEach((r) => {
            const row = [r.c.name];
            cfg.process.forEach((g) => row.push((r.c.process && r.c.process[g.id]) || ''));
            cfg.screen.forEach((crit) => {
                const opt = optionOf(crit, r.c.screen[crit.id]);
                row.push(opt && opt.label ? opt.label : '');
            });
            row.push(r.s.ivAvg == null ? '' : String(r.s.ivAvg));
            row.push(String(r.s.raw), String(r.s.index), r.s.heat.label, r.s.reco.label, r.c.stage, (r.c.notes || '').replace(/\n/g, ' '));
            lines.push(row);
        });
        const csv = lines.map((r) => r.map((x) => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'matriz-bdr-melvin.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function copyParecer() {
        const text = ranked()
            .filter((r) => r.c.starred || r.s.index >= 66)
            .map((r, i) => `${i + 1}. ${r.c.name} — ${r.s.reco.label} (índice ${r.s.index}, bruto ${r.s.raw}). ${whyText(r)}`)
            .join('\n\n');
        navigator.clipboard?.writeText(text || 'Sem shortlist ainda.').catch(() => {});
    }

    function bind(root) {
        root.querySelectorAll('[data-mx-view]').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.view = btn.getAttribute('data-mx-view');
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-filter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.filter = btn.getAttribute('data-mx-filter');
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-open]').forEach((card) => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button, a, label, input, select, textarea')) return;
                state.focusId = card.getAttribute('data-mx-open');
                state.view = 'entrevista';
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-star]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const c = candById(btn.getAttribute('data-mx-star'));
                if (!c) return;
                c.starred = !c.starred;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-cmp]').forEach((box) => {
            box.addEventListener('change', () => {
                const id = box.getAttribute('data-mx-cmp');
                if (box.checked) {
                    if (!state.compare.includes(id) && state.compare.length < 3) state.compare.push(id);
                } else {
                    state.compare = state.compare.filter((x) => x !== id);
                }
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-focus]').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.focusId = btn.getAttribute('data-mx-focus');
                if (btn.getAttribute('data-mx-goto')) state.view = btn.getAttribute('data-mx-goto');
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-goto]').forEach((btn) => {
            if (btn.hasAttribute('data-mx-focus')) return;
            btn.addEventListener('click', () => {
                state.view = btn.getAttribute('data-mx-goto');
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-screen]').forEach((sel) => {
            sel.addEventListener('change', () => {
                const c = candById(sel.getAttribute('data-mx-screen'));
                if (!c) return;
                c.screen[sel.getAttribute('data-field')] = sel.value;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-stage]').forEach((sel) => {
            sel.addEventListener('change', () => {
                const c = candById(sel.getAttribute('data-mx-stage'));
                if (!c) return;
                c.stage = sel.value;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-proc]').forEach((sel) => {
            sel.addEventListener('change', () => {
                const c = candById(sel.getAttribute('data-mx-proc'));
                if (!c) return;
                if (!c.process) c.process = blankProcess();
                c.process[sel.getAttribute('data-field')] = sel.value;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-procnote]').forEach((t) => {
            t.addEventListener('change', () => {
                const c = candById(t.getAttribute('data-mx-procnote'));
                if (c) { c.processNote = t.value; saveState(state); }
            });
        });
        root.querySelectorAll('[data-mx-procw]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const g = (state.config.process || []).find((x) => x.id === inp.getAttribute('data-mx-procw'));
                if (g) g.weight = Number(inp.value) || 0;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-iv]').forEach((sel) => {
            sel.addEventListener('change', () => {
                const c = candById(sel.getAttribute('data-mx-iv'));
                if (!c) return;
                c.interview[sel.getAttribute('data-q')] = sel.value;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-ivnote]').forEach((t) => {
            t.addEventListener('change', () => {
                const c = candById(t.getAttribute('data-mx-ivnote'));
                if (c) { c.interviewNote = t.value; saveState(state); }
            });
        });
        root.querySelectorAll('[data-mx-notes]').forEach((t) => {
            t.addEventListener('change', () => {
                const c = candById(t.getAttribute('data-mx-notes'));
                if (c) { c.notes = t.value; saveState(state); }
            });
        });
        root.querySelectorAll('[data-mx-weight]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const crit = state.config.screen.find((c) => c.id === inp.getAttribute('data-mx-weight'));
                if (crit) crit.weight = Number(inp.value) || 0;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-opt]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const crit = state.config.screen.find((c) => c.id === inp.getAttribute('data-mx-opt'));
                const opt = crit && crit.options.find((o) => o.value === inp.getAttribute('data-opt-val'));
                if (opt) opt.points = inp.value === '' ? null : Number(inp.value);
                saveState(state);
                render();
            });
        });
        const addq = root.querySelector('[data-mx-addq]');
        if (addq) addq.addEventListener('click', () => {
            const id = 'q' + Date.now();
            state.config.interview.push({ id, label: 'Nova pergunta', prompt: 'Escreva o roteiro do bate-papo…' });
            state.candidates.forEach((c) => { c.interview[id] = ''; });
            saveState(state);
            render();
        });
        root.querySelectorAll('[data-mx-delq]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-mx-delq');
                if (state.config.interview.length <= 1) return;
                state.config.interview = state.config.interview.filter((q) => q.id !== id);
                state.candidates.forEach((c) => { delete c.interview[id]; });
                saveState(state);
                render();
            });
        });
        const ivw = root.querySelector('[data-mx-ivw]');
        if (ivw) ivw.addEventListener('change', () => {
            state.config.interviewWeight = Number(ivw.value) || 0;
            saveState(state);
            render();
        });
        root.querySelectorAll('[data-mx-band]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const b = state.config.bands.find((x) => x.id === inp.getAttribute('data-mx-band'));
                if (!b) return;
                b[inp.getAttribute('data-k')] = Number(inp.value) || 0;
                saveState(state);
                render();
            });
        });
        root.querySelectorAll('[data-mx-qlabel]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const q = state.config.interview.find((x) => x.id === inp.getAttribute('data-mx-qlabel'));
                if (q) { q.label = inp.value; saveState(state); }
            });
        });
        root.querySelectorAll('[data-mx-qprompt]').forEach((inp) => {
            inp.addEventListener('change', () => {
                const q = state.config.interview.find((x) => x.id === inp.getAttribute('data-mx-qprompt'));
                if (q) { q.prompt = inp.value; saveState(state); }
            });
        });
        const offer = root.querySelector('[data-mx-offer]');
        if (offer) offer.addEventListener('change', () => {
            state.config.offer = offer.value;
            saveState(state);
        });
        const reset = root.querySelector('[data-mx-reset]');
        if (reset) reset.addEventListener('click', () => {
            if (!confirm('Restaurar pesos, perguntas e notas de triagem padrão? (notas de entrevista preenchidas por você também zeram)')) return;
            localStorage.removeItem(KEY);
            localStorage.removeItem(LEGACY_KEY);
            state = loadState();
            render();
        });
        const exp = root.querySelector('[data-mx-export]');
        if (exp) exp.addEventListener('click', exportCsv);
        const copy = root.querySelector('[data-mx-copy]');
        if (copy) copy.addEventListener('click', () => {
            copyParecer();
            copy.textContent = 'Copiado';
            setTimeout(() => { copy.textContent = 'Copiar parecer'; }, 1200);
        });
        root.querySelectorAll('[data-mx-cv]').forEach((a) => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const id = a.getAttribute('data-mx-cv');
                const hireBtn = document.querySelector('[data-hire-tab="selecao"]');
                const cvTab = document.querySelector('[data-sel-tab="cvs"]');
                if (hireBtn) hireBtn.click();
                if (cvTab) cvTab.click();
                const nav = document.querySelector(`[data-cv-nav="${id}"]`);
                if (nav) nav.click();
            });
        });
    }

    function init() {
        const root = document.getElementById('hireMatrixRoot');
        if (!root) return;
        state = loadState();
        syncTheme();
        new MutationObserver(syncTheme).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        render();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
