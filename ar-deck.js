/**
 * AR · Análises de Resultados — Melvin
 * Renders into #arDeckViewport and drives deck navigation.
 *
 * Período do relatório: sempre o ano vigente, de janeiro até o mês
 * anterior ao mês atual (ex.: em set/2026 → "2026 (janeiro a agosto)").
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var MONTHS_PT = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ];
  var MONTHS_TITLE = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  var MONTHS_SHORT = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ];

  function getArPeriod(now) {
    var d = now || new Date();
    var y = d.getFullYear();
    var m = d.getMonth(); // 0 = jan
    var year;
    var endIdx;
    if (m === 0) {
      year = y - 1;
      endIdx = 11;
    } else {
      year = y;
      endIdx = m - 1;
    }
    var endName = MONTHS_PT[endIdx];
    return {
      year: year,
      endIdx: endIdx,
      endTitle: MONTHS_TITLE[endIdx],
      label: year + ' (janeiro a ' + endName + ')',
      shortLabel: year + ' · jan–' + MONTHS_SHORT[endIdx].toLowerCase(),
      performanceLine: 'Performance comercial · ' + year + ' (janeiro a ' + endName + ')',
      last3: (function () {
        var out = [];
        for (var i = Math.max(0, endIdx - 2); i <= endIdx; i++) out.push(i);
        while (out.length < 3) out.unshift(out[0] || 0);
        return out.slice(-3);
      })(),
      chartMonths: (function () {
        var out = [];
        var start = Math.max(0, endIdx - 5);
        for (var i = start; i <= endIdx; i++) {
          out.push(MONTHS_SHORT[i] + '/' + year);
        }
        return out;
      })()
    };
  }

  var AR_PERIOD = getArPeriod();
  window.AR_PERIOD = AR_PERIOD;
  var AR_HERO_BG = 'assets/ar/cover-maintenance.jpg';
  window.AR_HERO_BG = AR_HERO_BG;

  var m3 = AR_PERIOD.last3;
  var colM1 = MONTHS_TITLE[m3[0]];
  var colM2 = MONTHS_TITLE[m3[1]];
  var colM3 = MONTHS_TITLE[m3[2]];
  var metaCol = 'META ' + AR_PERIOD.endTitle;
  var MX_MONTHS = ['Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'];
  var MX_MONTH_IDX = [2, 3, 4, 5, 6, 7, 8]; // Mar–Set (0-based)
  var MX_MONTHS_PEOPLE = MX_MONTHS.slice(2); // Mai–Set
  var MX_MONTH_IDX_PEOPLE = MX_MONTH_IDX.slice(2);

  function countBusinessDays(year, monthIdx) {
    var n = 0;
    var d = new Date(year, monthIdx, 1);
    while (d.getMonth() === monthIdx) {
      var w = d.getDay();
      if (w >= 1 && w <= 5) n++;
      d.setDate(d.getDate() + 1);
    }
    return n;
  }

  var MX_BDAYS = MX_MONTH_IDX.map(function (mi) {
    return countBusinessDays(AR_PERIOD.year, mi);
  });
  var MX_BDAYS_PEOPLE = MX_MONTH_IDX_PEOPLE.map(function (mi) {
    return countBusinessDays(AR_PERIOD.year, mi);
  });

  function mxEmpty(n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push('');
    return out;
  }
  function mxRows(labels, cols) {
    return labels.map(function (label) {
      return { label: label, values: mxEmpty(cols) };
    });
  }

  function parsePctValue(raw) {
    var t = String(raw == null ? '' : raw)
      .replace('%', '')
      .trim()
      .replace(/\./g, '')
      .replace(',', '.');
    if (!t) return null;
    var n = parseFloat(t);
    return isNaN(n) ? null : n;
  }

  /** Linha 02 atraso: 0–40% verde; > 40,01% vermelho */
  function atrasoTone(raw) {
    var n = parsePctValue(raw);
    if (n == null) return '';
    return n > 40.01 ? 'bad' : 'ok';
  }

  function parseBrNumber(raw) {
    var s = String(raw == null ? '' : raw).trim();
    if (!s || s.indexOf('%') !== -1) return null;
    var t = s.replace(/\./g, '').replace(',', '.');
    var n = parseFloat(t);
    return isNaN(n) ? null : n;
  }

  function formatBrAvg(n) {
    var fixed = Math.round(n * 10) / 10;
    return fixed.toFixed(1).replace('.', ',');
  }

  function mxDailyAvg(raw, monthIndex, bdaysList) {
    var total = parseBrNumber(raw);
    var days = (bdaysList || MX_BDAYS)[monthIndex];
    if (total == null || !days) return '';
    return formatBrAvg(total / days);
  }

  function mxProdRows(valuesMap, colCount) {
    var blanks = mxEmpty(colCount != null ? colCount : MX_MONTHS.length);
    var defs = [
      { key: 'concluidas', label: 'Atividades concluídas' },
      { key: 'atraso', label: 'Atividades com atraso (percentual)', pctTones: true },
      { key: 'ligIni', label: 'Ligações Iniciadas' },
      { key: 'ligAte', label: 'Ligações Atendidas' },
      { key: 'lig30', label: 'Ligações — mais de 30 segundos' },
      { key: 'agenda', label: 'Agendamentos Marcados' },
      { key: 'reuniao', label: 'Reuniões realizadas' },
      { key: 'cancel', label: 'Cancelamentos' },
      { key: 'noshow', label: 'No Show' },
      { key: 'fria', label: 'Reunião Fria' },
      { key: 'morna', label: 'Reunião Morna' },
      { key: 'quente', label: 'Reunião Quente' },
      { key: 'cemiterio', label: 'Reunião Cemitério' },
      { key: 'vendas', label: 'Vendas' }
    ];
    var map = valuesMap || {};
    return defs.map(function (d) {
      var row = {
        label: d.label,
        values: map[d.key] && map[d.key].values ? map[d.key].values.slice() : blanks.slice()
      };
      if (map[d.key] && map[d.key].label) row.label = map[d.key].label;
      if (d.pctTones) {
        row.tones = row.values.map(atrasoTone);
        row.isPct = true;
      }
      return row;
    });
  }

  window.AR_DECK_SLIDES = [
    {
      type: 'cover',
      kicker: 'RevOps · Direção Melvin',
      title: 'Análises de Resultados',
      subtitle: AR_PERIOD.performanceLine,
      bg: AR_HERO_BG
    },
    {
      type: 'objectives',
      kicker: 'Rota da sessão',
      title: 'Objetivos',
      lead: 'O que esta análise responde para a direção · ' + AR_PERIOD.label + '.',
      bg: AR_HERO_BG,
      items: [
        { n: '01', label: 'Analisar a evolução da produção' },
        { n: '02', label: 'Avaliar o crescimento no ano' },
        { n: '03', label: 'Identificar gargalos' },
        { n: '04', label: 'Planificar melhorias' },
        { n: '05', label: 'Definir papéis' }
      ]
    },
    {
      type: 'section',
      num: '01',
      kicker: 'Bloco',
      title: 'Produtividade',
      subtitle: AR_PERIOD.label,
      theme: 'prod',
      bg: AR_HERO_BG
    },
    {
      type: 'matrix',
      title: 'PRODUTIVIDADE MENSAL',
      person: 'Gabriely Silva',
      note: AR_PERIOD.label,
      dailyAvg: true,
      columns: MX_MONTHS_PEOPLE.slice(),
      bdays: MX_BDAYS_PEOPLE,
      rows: mxProdRows({
        concluidas: {
          values: ['1.035', '1.615', '1.152', '1.453', '']
        },
        atraso: {
          values: ['24,3%', '8,3%', '22,2%', '25,8%', '']
        },
        ligIni: {
          values: ['0', '0', '0', '0', '288']
        },
        ligAte: {
          values: ['0', '0', '0', '0', '105']
        },
        lig30: {
          values: ['0', '0', '0', '0', '6']
        },
        agenda: {
          values: ['30', '35', '49', '42', '41']
        },
        reuniao: {
          values: ['30', '35', '46', '39', '39']
        },
        cancel: {
          values: ['0', '0', '3', '2', '2']
        },
        noshow: {
          values: ['0', '0', '0', '1', '0']
        },
        fria: {
          values: ['9', '13', '11', '15', '10']
        },
        morna: {
          values: ['3', '12', '4', '5', '8']
        },
        quente: {
          values: ['14', '6', '0', '2', '2']
        },
        cemiterio: {
          values: ['4', '1', '4', '4', '0']
        },
        vendas: {
          label: 'Vendas geradas'
        }
      }, MX_MONTHS_PEOPLE.length)
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      indicator: 'Mapa de Calor de Produtividade',
      person: 'Gabriely Silva',
      note: 'BRT · dias × horários de pico · ' + AR_PERIOD.label,
      viz: 'heatmap',
      insights: [
        'Picos nobres: 12h e 17h (300+ atividades/hora).',
        'Dias mais intensos: Segunda e Quarta.',
        'Alerta: volume cai na Sexta e entre 14h–15h — evite cold call nos blocos azuis escuros.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      indicator: 'Auditoria da Cadência Real',
      person: 'Gabriely Silva',
      note: 'Natureza real do esforço · assuntos Bitrix · ' + AR_PERIOD.label,
      viz: 'bars',
      items: [
        { label: 'Contatar cliente', v: 2519 },
        { label: 'Realizar Ligação', v: 1724 },
        { label: 'Formulário CRM “Teste 14 dias gratuito” enviado', v: 937 },
        { label: 'Mensagem SMS enviada', v: 366 },
        { label: 'Descartar lead por tentativas esgotadas', v: 103 },
        { label: 'E-mail', v: 74 },
        { label: 'envio de e-mail', v: 66 },
        { label: 'Ligação Ativa', v: 58 }
      ],
      insights: [
        'Esforço concentrado em Contatar cliente (2.519) e Ligações (1.724).',
        'Formulário 14 dias ~1.000× — etapa do funil rodando forte.',
        'Alerta: só 103 descartes vs 1.700+ ligações — possível retenção de leads mortos.'
      ]
    },
    {
      type: 'chart',
      chart: 'top15',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'Análise de Tarefas',
      indicator: 'Top 15 contas de maior esforço',
      person: 'Gabriely Silva',
      note: 'Raio-X de oportunidades · ' + AR_PERIOD.label,
      footLegends: [
        { cls: 'ar-leg--deal', label: 'DEAL' },
        { cls: 'ar-leg--contact', label: 'CONTACT' }
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      indicator: 'Speed to Execution (Tempo de Resolução)',
      person: 'Gabriely Silva',
      note: 'Velocidade entre criação e conclusão · ' + AR_PERIOD.label,
      viz: 'donut',
      slices: [
        { label: '< 1 hora', pct: 37.5, color: '#22c55e' },
        { label: '1 a 4 horas', pct: 11.1, color: '#3b82f6' },
        { label: 'Mesmo dia (4–24h)', pct: 16.2, color: '#eab308' },
        { label: '1 a 3 dias', pct: 15.0, color: '#f97316' },
        { label: 'Mais de 3 dias', pct: 20.2, color: '#ef4444' }
      ],
      centerLabel: '65%',
      centerSub: 'mesmo dia',
      insights: [
        '~65% das tarefas resolvidas no mesmo dia (<1h + 1–4h + 4–24h).',
        '37,5% em menos de 1 hora — padrão ouro para a equipe.',
        'Alerta: 20,2% passam de 3 dias — leads difíceis ou fila administrativa.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE LIGAÇÕES',
      indicator: 'Evolução Mensal de Chamadas VoIP',
      person: 'Gabriely Silva',
      note: 'Iniciadas · Atendidas · +30s · ' + AR_PERIOD.label,
      viz: 'cluster',
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
      series: [
        {
          label: 'Iniciadas (Total)',
          color: '#3b82f6',
          values: [0, 0, 0, 2, 0, 0, 0, 0, 288]
        },
        {
          label: 'Atendidas (Sucesso)',
          color: '#22c55e',
          values: [0, 0, 0, 2, 0, 0, 0, 0, 105]
        },
        {
          label: 'Mais de 30s (Qualificadas)',
          color: '#f97316',
          values: [0, 0, 0, 2, 0, 0, 0, 0, 6]
        }
      ],
      insights: [
        'Setembro explode: 288 iniciadas · 105 atendidas · 6 qualificadas (+30s).',
        'Até ago o VoIP estava praticamente zerado (só Abr com 2/2/2).',
        'Alerta: conversão iniciada→+30s em Set é baixa (6/288) — revisar script e timing.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE LIGAÇÕES',
      indicator: 'Mapa de Calor de Ligações VoIP',
      person: 'Gabriely Silva',
      note: 'Dias × horários · BRT · volume de ligações',
      viz: 'heatmap',
      heat: 'voip',
      insights: [
        'Picos de ligação: Ter 13h (31) e Qui 13h (29).',
        'Blocos fortes: 12h–13h e 16h–18h em dias úteis.',
        'Alerta: fim de semana zerado — janela comercial concentrada em Seg–Sex.'
      ]
    },

    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE AGENDAMENTOS',
      indicator: 'Destino dos Agendamentos',
      person: 'Gabriely Silva',
      note: 'Status atual dos negócios agendados · ' + AR_PERIOD.label,
      viz: 'donut',
      slices: [
        { label: 'Ganho', pct: 11.2, color: '#15B06D' },
        { label: 'Em Andamento', pct: 42.6, color: '#F04444' },
        { label: 'Perdido', pct: 46.2, color: '#F59E0B' }
      ],
      centerLabel: '197',
      centerSub: 'agendamentos',
      insights: [
        '46,2% dos agendamentos terminam como Perdido.',
        '42,6% ainda Em Andamento — pipeline vivo relevante.',
        'Alerta: só 11,2% Ganho — converter o meio do funil é a alavanca.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE AGENDAMENTOS',
      indicator: 'Time-to-Meeting',
      person: 'Gabriely Silva',
      note: 'Dias corridos entre criação do lead e a reunião',
      viz: 'hist',
      hist: {
        xLabel: 'Quantidade de Dias Corridos',
        yLabel: 'Volume de Reuniões',
        mean: 4.2,
        median: 3.1,
        xMax: 35,
        yMax: 30,
        values: [
          30, 18, 12, 10, 8, 6, 5, 4, 3, 3,
          2, 2, 2, 1, 1, 2, 1, 1, 0, 1,
          0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 1, 0, 0
        ]
      },
      insights: [
        'Mediana 3,1 dias · média 4,2 dias até a reunião.',
        'Pico forte no dia 0–1 — inbound respondendo rápido.',
        'Alerta: cauda longa até 20+ dias — leads lentos diluem a média.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE AGENDAMENTOS',
      indicator: 'Sazonalidade do Agendamento',
      person: 'Gabriely Silva',
      note: 'Melhores dias do mês (1 ao 31) · média móvel 3 dias',
      viz: 'season',
      season: {
        values: [5, 0, 0, 2, 2, 0, 3, 2, 4, 10, 4, 0, 2, 4, 8, 6, 8, 5, 0, 2, 4, 0, 1, 8, 0, 5, 2, 6, 5, 2, 4]
      },
      insights: [
        'Dia 10 é o pico absoluto (10 reuniões).',
        'Outros picos: 15, 17 e 24 (8 cada).',
        'Alerta: início do mês (dias 2–3/6) quase zerado — planejar push nessas janelas.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE VENDAS',
      indicator: 'Evolução de Vendas Mensal (Volume × Faturamento)',
      person: 'Gabriely Silva',
      note: 'Quantidade de vendas × faturamento realizado · ' + AR_PERIOD.label,
      viz: 'dual',
      dual: {
        months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
        volume: [8, 13, 10, 48, 683, 173, 147, 213, 95],
        revenue: [8354.8, 104912.26, 30137.84, 14397, 22062.28, 17653.49, 16082.1, 39814.3, 1720],
        volMax: 700,
        revMax: 110000
      },
      insights: [
        'Volume explode em Mai (683), mas o maior faturamento é Fev (R$ 105k) com só 13 vendas.',
        'Ago entrega o 2º melhor faturamento (R$ 40k) com 213 vendas — melhor equilíbrio recente.',
        'Alerta: Set com 95 vendas e só R$ 1,7k — ticket médio muito baixo.'
      ]
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE AGENDAMENTOS',
      indicator: 'Mapa de Calor — Dia × Hora da Reunião',
      person: 'Gabriely Silva',
      note: 'Horário do agendamento · BRT · volume de reuniões',
      viz: 'heatmap',
      heat: 'meet',
      insights: [
        'Maior volume: Sexta 19h (3) — fechamento de semana.',
        'Blocos: Ter 13–14h, Qua/Qui 10h, Sex manhã e tarde.',
        'Alerta: Segunda e fim de semana zerados — concentrar slots úteis.'
      ]
    },
    {
      type: 'matrix',
      title: 'PRODUTIVIDADE MENSAL',
      person: 'Poliana Sampaio',
      note: AR_PERIOD.label + ' · dados em atualização',
      dailyAvg: true,
      columns: MX_MONTHS_PEOPLE.slice(),
      bdays: MX_BDAYS_PEOPLE,
      rows: mxProdRows({
        vendas: { label: 'Vendas geradas' }
      }, MX_MONTHS_PEOPLE.length)
    },
    {
      type: 'matrix',
      title: 'PRODUTIVIDADE MENSAL',
      person: 'Fabrício Luiz',
      note: AR_PERIOD.label,
      dailyAvg: true,
      columns: MX_MONTHS_PEOPLE.slice(),
      bdays: MX_BDAYS_PEOPLE,
      rows: mxProdRows({
        vendas: {
          values: ['683', '173', '147', '213', '95']
        }
      }, MX_MONTHS_PEOPLE.length)
    },
    {
      type: 'viz',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE REUNIÕES',
      indicator: 'Conversão e Qualidade das Reuniões',
      person: 'Fabrício Luiz',
      note: 'Agendadas · Realizadas · No-Show · Termômetro · ' + AR_PERIOD.label,
      viz: 'convThermo',
      convThermo: {
        barsTitle: 'Conversão de Reuniões (Fabrício Luiz)',
        donutTitle: 'Qualidade das Reuniões (Termômetro)',
        bars: [
          { label: 'Agendadas', v: 141, color: '#1e3a8a' },
          { label: 'Realizadas', v: 133, color: '#10b981' },
          { label: 'No-Show', v: 8, color: '#93c5fd' }
        ],
        yMax: 140,
        slices: [
          { label: 'Fria', pct: 54.2, color: '#3b82f6' },
          { label: 'Morna', pct: 27.5, color: '#f97316' },
          { label: 'Cemitério', pct: 12.5, color: '#475569' },
          { label: 'Quente', pct: 5.8, color: '#ef4444' }
        ]
      },
      insights: [
        'Show-up alto: 133/141 realizadas (~94%) — só 8 no-shows.',
        'Termômetro frio: 54,2% Frias vs 5,8% Quentes.',
        'Alerta: Frias + Cemitério = 66,7% — priorizar aquecimento do discurso.'
      ]
    },
    {
      type: 'chart',
      chart: 'sla',
      title: 'PRODUTIVIDADE MENSAL',
      midKicker: 'ANÁLISE DE ATIVIDADES',
      indicator: 'SLA e Tendência Mensal de Atividades',
      person: 'Fabrício Luiz',
      note: 'Dashboard RevOps · ' + AR_PERIOD.label,
      legends: [
        { cls: 'ar-leg--trend', label: 'Tendência (Volume Total)' },
        { cls: 'ar-leg--ok', label: 'Concluído no Prazo' },
        { cls: 'ar-leg--late', label: 'Concluído em Atraso' }
      ]
    },

    {
      type: 'section',
      num: '02',
      kicker: 'Bloco',
      title: 'Estatísticas',
      subtitle: 'Visão consolidada · ' + AR_PERIOD.label,
      theme: 'stats',
      bg: AR_HERO_BG
    },
    {
      type: 'matrix',
      title: 'PRODUTIVIDADE MENSAL',
      badge: 'TOTAL',
      note: 'Equipe · ' + AR_PERIOD.label + ' · dados em atualização',
      columns: MX_MONTHS.slice(),
      rows: mxRows(
        [
          'Atividades concluídas',
          'Atividades com atraso (percentual)',
          'Ligações atendidas',
          'Agendamentos',
          'Reuniões realizadas (70%)',
          'Qualidade das reuniões',
          'Vendas (Inb+Out+CS) (20%)'
        ],
        MX_MONTHS.length
      )
    },
    {
      type: 'matrix',
      title: 'Taxa de Conversão',
      badge: 'INBOUND',
      note: 'Funil inbound · ' + AR_PERIOD.label + ' · dados em atualização',
      columns: MX_MONTHS.slice(),
      rows: mxRows(
        [
          'Etapa 1 » Etapa 2',
          'Etapa 2 » Nutrição',
          'Nutrição » Reunião Agendada',
          'Reunião Agendada » Reunião Realizada',
          'Reunião Realizada » Venda',
          'Cadastrados » DESCARTADOS'
        ],
        MX_MONTHS.length
      )
    },
    {
      type: 'matrix',
      title: 'Taxa de Conversão',
      badge: 'OUTBOUND',
      note: 'Funil outbound · ' + AR_PERIOD.label + ' · dados em atualização',
      columns: MX_MONTHS.slice(),
      rows: mxRows(
        [
          'Etapa 1 » Etapa 2',
          'Etapa 2 » Nutrição',
          'Nutrição » Reunião Agendada',
          'Reunião Agendada » Reunião Realizada',
          'Reunião Realizada » Venda',
          'Cadastrados » DESCARTADOS'
        ],
        MX_MONTHS.length
      )
    },
    {
      type: 'section',
      num: '03',
      kicker: 'Bloco',
      title: 'Gargalos',
      subtitle: 'Onde a máquina trava — e por quê · ' + AR_PERIOD.label,
      theme: 'gap',
      bg: AR_HERO_BG
    },
    {
      type: 'split',
      title: 'Gargalos atuais',
      positives: [
        'Voltamos a vender!',
        '2 vendas da pré-venda e 1 do CS.'
      ],
      negatives: [
        'Queda substancial de atividades concluídas',
        'Queda SUBSTANCIAL no número de ligações geradas e atendidas',
        'Leve queda no número de agendamentos',
        '60% no período ' + AR_PERIOD.label + '.'
      ]
    },
    {
      type: 'section',
      num: '04',
      kicker: 'Bloco',
      title: 'Melhorias',
      subtitle: 'Plano de ação com donos e próximos passos · ' + AR_PERIOD.label,
      theme: 'improve',
      bg: AR_HERO_BG
    },
    {
      type: 'plan',
      title: 'Melhorias · Planificação',
      intro: 'As melhorias sugeridas, os responsáveis e os prazos são importantes para que cada passo seja dado em conjunto.',
      cards: [
        {
          title: 'Ajustes de estratégias de abordagem OUTBOUND',
          owner: 'Gaby',
          support: 'Jailson',
          action: 'Roleplays / Ajustes de Abordagens'
        },
        {
          title: 'Finalização e aplicação da SWOT para OUTBOUND',
          owner: 'Jailson',
          support: '',
          action: ''
        }
      ]
    },
    {
      type: 'section',
      num: '05',
      kicker: 'Bloco',
      title: 'Metas e ritmo',
      subtitle: 'Próximos passos com base em ' + AR_PERIOD.label,
      theme: 'sprint',
      bg: AR_HERO_BG
    },
    {
      type: 'matrix',
      title: 'Metas',
      badge: 'GABRIELY (full time)',
      note: 'Referência: ' + AR_PERIOD.label + ' · metas do ciclo seguinte · dados em atualização',
      columns: ['TOTAL MÊS', 'MÉDIAS'],
      rows: mxRows(
        [
          'Atividades concluídas',
          'Atividades com atraso (percentual)',
          'Ligações atendidas',
          'Agendamentos',
          'Reuniões realizadas (70%)',
          'Qualidade das reuniões',
          'Vendas geradas (20%)'
        ],
        2
      )
    },
    {
      type: 'cta',
      kicker: 'Encerramento · Direção Melvin',
      title: 'Foco ' + AR_PERIOD.year,
      lines: [
        'O ano não acabou.',
        'A sua melhor venda começa agora.',
        'Foco total no resultado.'
      ],
      pills: ['100% COMPROMISSO', 'VITÓRIA'],
      quote: 'O ano só acaba quando termina.',
      author: 'Jailson Martins',
      bg: AR_HERO_BG
    },
    {
      type: 'sign',
      kicker: 'AR · Análise de resultado',
      lead: 'Relatório elaborado por',
      name: 'Jailson Martins',
      role: 'Engenheiro de Receita · JM7',
      meta: 'Melvin · RevOps Book · ' + AR_PERIOD.label,
      bg: AR_HERO_BG
    }
  ];

  function periodLabel() {
    return (window.AR_PERIOD && window.AR_PERIOD.label) || '';
  }

  function arPanelShell(kind, s, innerHtml) {
    var bg = esc(s.bg || AR_HERO_BG);
    var period = periodLabel();
    var isProd = !!(s.dailyAvg || (s.person && s.indicator));
    var headCls =
      'ar-panel-head' +
      (s.person ? ' ar-panel-head--person' : '') +
      (isProd ? ' ar-panel-head--prod' : '') +
      (s.indicator ? ' ar-panel-head--triple' : '');
    var leftBlock =
      '<div class="ar-panel-head-text">' +
      '<p class="ar-panel-kicker">Melvin · AR' +
      (period ? ' · ' + esc(period) : '') +
      '</p>' +
      '<h3 class="ar-panel-title">' +
      esc(s.title) +
      '</h3>' +
      (s.note && !s.person
        ? '<p class="ar-panel-note">' + esc(s.note) + '</p>'
        : !s.person && s.lead
          ? '<p class="ar-panel-note">' + esc(s.lead) + '</p>'
          : '') +
      '</div>';
    var midBlock = s.indicator
      ? '<div class="ar-panel-head-mid">' +
        (kind === 'viz' || kind === 'chart'
          ? '<p class="ar-panel-mid-kicker">' +
            esc(s.midKicker || 'ANÁLISE DE ATIVIDADES') +
            '</p>'
          : '') +
        '<p class="ar-panel-indicator">' +
        esc(s.indicator) +
        '</p></div>'
      : '';
    var rightBlock = s.person
      ? '<div class="ar-panel-head-person">' +
        '<p class="ar-panel-person">' +
        esc(s.person) +
        '</p>' +
        (s.note ? '<p class="ar-panel-note">' + esc(s.note) + '</p>' : '') +
        '</div>'
      : s.badge
        ? '<span class="ar-panel-badge">' + esc(s.badge) + '</span>'
        : '';
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--' +
      kind +
      ' ar-panel' +
      (s.person ? ' ar-panel--person' : '') +
      (isProd ? ' ar-panel--prod' : '') +
      (kind === 'viz' ? ' ar-panel--viz' : '') +
      '">' +
      '<div class="ar-panel-bg" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-panel-veil" aria-hidden="true"></div>' +
      '<div class="ar-panel-body">' +
      '<header class="' +
      headCls +
      '">' +
      leftBlock +
      midBlock +
      rightBlock +
      '</header>' +
      '<div class="ar-panel-content' +
      (kind === 'viz' ? ' ar-viz-content' : '') +
      '">' +
      innerHtml +
      '</div></div></div>'
    );
  }

  function renderCover(s) {
    var bg = s.bg ? esc(s.bg) : AR_HERO_BG;
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--cover ar-hero">' +
      '<div class="ar-hero-bg" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-hero-veil" aria-hidden="true"></div>' +
      '<div class="ar-hero-grain" aria-hidden="true"></div>' +
      '<div class="ar-cover-inner">' +
      '<span class="melvin-logo-lockup ar-cover-logo" role="img" aria-label="Melvin"></span>' +
      (s.kicker ? '<p class="ar-cover-kicker">' + esc(s.kicker) + '</p>' : '') +
      '<h3 class="ar-cover-title">' +
      esc(s.title) +
      '</h3>' +
      '<div class="ar-hero-rule" aria-hidden="true"></div>' +
      '<p class="ar-cover-sub">' +
      esc(s.subtitle) +
      '</p>' +
      '</div></div>'
    );
  }

  function renderObjectives(s) {
    var bg = s.bg ? esc(s.bg) : AR_HERO_BG;
    var items = (s.items || [])
      .map(function (it, i) {
        var n = it && it.n != null ? it.n : String(i + 1).padStart(2, '0');
        var label = it && it.label != null ? it.label : it;
        return (
          '<li class="ar-obj-item" style="--i:' +
          i +
          '">' +
          '<span class="ar-obj-num">' +
          esc(n) +
          '</span>' +
          '<span class="ar-obj-label">' +
          esc(label) +
          '</span>' +
          '</li>'
        );
      })
      .join('');
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--objectives ar-hero">' +
      '<div class="ar-hero-bg ar-hero-bg--soft" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-hero-veil ar-hero-veil--obj" aria-hidden="true"></div>' +
      '<div class="ar-obj-layout">' +
      '<div class="ar-obj-copy">' +
      (s.kicker ? '<p class="ar-cover-kicker">' + esc(s.kicker) + '</p>' : '') +
      '<h3 class="ar-obj-title">' +
      esc(s.title) +
      '</h3>' +
      (s.lead ? '<p class="ar-obj-lead">' + esc(s.lead) + '</p>' : '') +
      '<div class="ar-hero-rule ar-hero-rule--left" aria-hidden="true"></div>' +
      '</div>' +
      '<ol class="ar-obj-list">' +
      items +
      '</ol>' +
      '</div></div>'
    );
  }

  function renderBullets(s) {
    return renderObjectives({
      kicker: s.kicker || 'Rota da sessão',
      title: s.title,
      lead: s.lead,
      bg: s.bg,
      items: (s.items || []).map(function (label, i) {
        return { n: String(i + 1).padStart(2, '0'), label: label };
      })
    });
  }

  function renderSection(s) {
    var bg = s.bg ? esc(s.bg) : AR_HERO_BG;
    var theme = s.theme ? ' ar-section--' + esc(s.theme) : '';
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--section ar-hero' +
      theme +
      '">' +
      '<div class="ar-hero-bg" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-hero-veil ar-hero-veil--section" aria-hidden="true"></div>' +
      '<div class="ar-section-frame">' +
      (s.num
        ? '<span class="ar-section-num" aria-hidden="true">' + esc(s.num) + '</span>'
        : '') +
      '<div class="ar-section-copy">' +
      (s.kicker ? '<p class="ar-section-kicker">' + esc(s.kicker) + '</p>' : '') +
      '<h3 class="ar-section-title">' +
      esc(s.title) +
      '</h3>' +
      (s.subtitle ? '<p class="ar-section-sub">' + esc(s.subtitle) + '</p>' : '') +
      '<div class="ar-hero-rule ar-hero-rule--left" aria-hidden="true"></div>' +
      '</div></div></div>'
    );
  }

  function renderTable(s) {
    var cols = s.columns || [];
    var thead =
      '<thead><tr>' +
      cols
        .map(function (c, i) {
          return '<th' + (i === 0 ? ' class="ar-th-ind"' : '') + '>' + esc(c) + '</th>';
        })
        .join('') +
      '</tr></thead>';
    var tbody =
      '<tbody>' +
      (s.rows || [])
        .map(function (row) {
          return (
            '<tr>' +
            row
              .map(function (cell, i) {
                return (
                  '<td' +
                  (i === 0 ? ' class="ar-td-ind"' : ' class="ar-td-num"') +
                  '>' +
                  esc(cell) +
                  '</td>'
                );
              })
              .join('') +
            '</tr>'
          );
        })
        .join('') +
      '</tbody>';
    var inner =
      '<div class="ar-table-wrap"><table class="ar-data-table">' +
      thead +
      tbody +
      '</table></div>';
    return arPanelShell('table', s, inner);
  }

  function renderMxCell(v, tone, extraCls) {
    var empty = !String(v == null ? '' : v).trim();
    var cls =
      'ar-mx-cell' +
      (extraCls ? ' ' + extraCls : '') +
      (empty ? ' is-empty' : ' is-filled') +
      (tone === 'ok' ? ' is-ok' : '') +
      (tone === 'bad' ? ' is-bad' : '') +
      (tone === 'warn' ? ' is-warn' : '');
    return (
      '<div class="' +
      cls +
      '">' +
      (empty ? '<span class="ar-mx-ghost" aria-hidden="true"></span>' : esc(String(v))) +
      '</div>'
    );
  }

  function renderMatrix(s) {
    var cols = s.columns || [];
    var colCount = cols.length;
    var withAvg = !!s.dailyAvg;
    var bdaysList = s.bdays || MX_BDAYS;
    var head =
      '<div class="ar-mx-head' +
      (withAvg ? ' ar-mx-head--avg' : '') +
      '" style="--cols:' +
      colCount +
      '">' +
      '<div class="ar-mx-corner"><span>Indicador</span></div>' +
      cols
        .map(function (c, i) {
          var bdays = withAvg && bdaysList[i] ? bdaysList[i] + ' úteis' : '';
          var monthCore =
            '<div class="ar-mx-month" style="--i:' +
            i +
            '"><span class="ar-mx-month-abbr">' +
            esc(String(c).slice(0, 3).toUpperCase()) +
            '</span>' +
            (withAvg
              ? ''
              : '<span class="ar-mx-month-name">' + esc(c) + '</span>') +
            (bdays
              ? '<span class="ar-mx-month-days">' + esc(bdays) + '</span>'
              : '') +
            '</div>';
          if (!withAvg) return monthCore;
          return (
            '<div class="ar-mx-month-group" style="--i:' +
            i +
            '">' +
            monthCore +
            '<div class="ar-mx-subhead"><span>Total</span><span>Méd/dia</span></div></div>'
          );
        })
        .join('') +
      '</div>';
    var body = (s.rows || [])
      .map(function (row, ri) {
        var vals = row.values || [];
        var tones = row.tones || [];
        var isPct = !!row.isPct;
        var cells = '';
        for (var ci = 0; ci < colCount; ci++) {
          var v = vals[ci] == null ? '' : String(vals[ci]);
          var tone = tones[ci] || (isPct ? atrasoTone(v) : '');
          if (!withAvg) {
            cells += renderMxCell(v, tone, '');
            continue;
          }
          if (isPct) {
            cells +=
              '<div class="ar-mx-pair ar-mx-pair--span">' +
              renderMxCell(v, tone, 'ar-mx-cell--span') +
              '</div>';
            continue;
          }
          var avg = mxDailyAvg(v, ci, bdaysList);
          cells +=
            '<div class="ar-mx-pair">' +
            renderMxCell(v, tone, 'ar-mx-cell--total') +
            renderMxCell(avg, '', 'ar-mx-cell--avg') +
            '</div>';
        }
        return (
          '<div class="ar-mx-row' +
          (withAvg ? ' ar-mx-row--avg' : '') +
          '" style="--cols:' +
          colCount +
          ';--r:' +
          ri +
          '">' +
          '<div class="ar-mx-label"><span class="ar-mx-idx">' +
          String(ri + 1).padStart(2, '0') +
          '</span><span class="ar-mx-label-text">' +
          esc(row.label) +
          '</span></div>' +
          cells +
          '</div>'
        );
      })
      .join('');
    var inner =
      '<div class="ar-mx' +
      (withAvg ? ' ar-mx--avg' : '') +
      '">' +
      head +
      '<div class="ar-mx-body">' +
      body +
      '</div></div>';
    return arPanelShell('matrix', s, inner);
  }

  function heatColor(v, max) {
    var t = Math.max(0, Math.min(1, v / max));
    // yellow -> teal -> deep blue (Melvin atividades)
    if (t < 0.25) return 'rgb(254, 243, ' + Math.round(199 - t * 40) + ')';
    if (t < 0.55) {
      var u = (t - 0.25) / 0.3;
      return 'rgb(' + Math.round(110 - u * 60) + ',' + Math.round(200 - u * 40) + ',' + Math.round(180 + u * 40) + ')';
    }
    var u2 = (t - 0.55) / 0.45;
    return 'rgb(' + Math.round(30 - u2 * 20) + ',' + Math.round(80 - u2 * 50) + ',' + Math.round(160 + u2 * 40) + ')';
  }

  function heatColorVoip(v, max) {
    var t = Math.max(0, Math.min(1, v / Math.max(max, 1)));
    // cream -> gold -> orange -> deep red
    if (t < 0.2) {
      return 'rgb(254, ' + Math.round(249 - t * 40) + ', ' + Math.round(220 - t * 80) + ')';
    }
    if (t < 0.5) {
      var u = (t - 0.2) / 0.3;
      return 'rgb(253, ' + Math.round(224 - u * 80) + ', ' + Math.round(71 - u * 40) + ')';
    }
    if (t < 0.75) {
      var u2 = (t - 0.5) / 0.25;
      return 'rgb(' + Math.round(249 - u2 * 40) + ', ' + Math.round(115 - u2 * 70) + ', ' + Math.round(22 - u2 * 10) + ')';
    }
    var u3 = (t - 0.75) / 0.25;
    return 'rgb(' + Math.round(185 - u3 * 50) + ', ' + Math.round(28 - u3 * 20) + ', ' + Math.round(28 - u3 * 10) + ')';
  }

  function gabyHeatData() {
    // Compact operational window 8h–19h · BRT pattern from Gabriely heatmap
    var hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    // rows = days, cols = hours — calibrated to print peaks (12h/17h)
    var grid = [
      [2, 8, 45, 120, 364, 180, 28, 35, 140, 269, 90, 25],
      [1, 6, 40, 110, 280, 160, 30, 38, 130, 246, 85, 22],
      [2, 7, 48, 130, 327, 175, 32, 40, 145, 255, 95, 28],
      [1, 5, 35, 95, 220, 140, 25, 30, 110, 200, 70, 18],
      [1, 4, 30, 80, 190, 100, 22, 28, 70, 81, 40, 12],
      [0, 1, 5, 12, 25, 18, 8, 10, 43, 20, 8, 2],
      [0, 0, 2, 6, 10, 8, 3, 4, 8, 5, 2, 0]
    ];
    return { hours: hours, days: days, grid: grid, max: 364, scaleMax: '350+', palette: 'teal' };
  }

  function gabyVoipHeatData() {
    var hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    var grid = [
      [0, 0, 0, 0, 0, 9, 0, 0, 17, 8, 4, 0, 0],
      [0, 0, 0, 0, 2, 31, 2, 0, 16, 17, 8, 0, 0],
      [0, 0, 0, 0, 2, 9, 1, 0, 17, 21, 12, 0, 0],
      [0, 0, 0, 0, 18, 29, 0, 0, 2, 6, 0, 0, 0],
      [0, 0, 0, 0, 19, 24, 0, 0, 9, 7, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    return { hours: hours, days: days, grid: grid, max: 31, scaleMax: '30+', palette: 'voip' };
  }

  
  
  function gabySalesHeatData() {
    var days = [];
    for (var d = 1; d <= 31; d++) days.push(d);
    var months = [
      'Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026', 'Mai/2026',
      'Jun/2026', 'Jul/2026', 'Ago/2026', 'Set/2026'
    ];
    var grid = [
      [3, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 1, 0, 0, 0, 0],
      [4, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 3, 0, 0, 1, 4, 0, 0, 4, 12, 5, 9, 0],
      [6, 0, 0, 5, 8, 4, 14, 8, 156, 376, 6, 10, 6, 8, 10, 0, 0, 3, 5, 9, 6, 8, 0, 0, 10, 8, 12, 5, 0, 0, 0],
      [11, 2, 13, 0, 6, 0, 0, 5, 8, 6, 10, 7, 5, 0, 3, 10, 6, 5, 9, 2, 0, 7, 12, 9, 15, 9, 0, 0, 7, 6, 0],
      [12, 6, 2, 2, 0, 4, 5, 5, 3, 4, 1, 0, 5, 12, 6, 13, 4, 0, 0, 2, 7, 4, 9, 6, 1, 0, 10, 14, 2, 7, 1],
      [5, 0, 13, 9, 10, 6, 6, 4, 0, 0, 10, 13, 22, 15, 2, 0, 5, 6, 15, 5, 9, 0, 0, 3, 7, 14, 9, 17, 4, 0, 4],
      [4, 14, 3, 5, 2, 0, 0, 5, 6, 5, 18, 7, 0, 11, 3, 7, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    return {
      hours: days,
      days: months,
      grid: grid,
      max: 376,
      scaleMax: '350+',
      palette: 'sales',
      xUnit: '',
      scaleLabel: 'Volume de Fechamentos',
      yAxisLabel: 'Mês',
      xAxisLabel: 'Dia do Mês (1 a 31)'
    };
  }

  function gabyMeetHeatData() {
    var hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    var z = function () { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; };
    var grid = [z(), z(), z(), z(), z(), z(), z()];
    grid[1][6] = 1; grid[1][7] = 2;
    grid[2][3] = 2; grid[2][4] = 1;
    grid[3][3] = 2; grid[3][8] = 2;
    grid[4][1] = 1; grid[4][2] = 2; grid[4][7] = 1; grid[4][12] = 3;
    return { hours: hours, days: days, grid: grid, max: 3, scaleMax: '3', palette: 'teal' };
  }

function renderHeatmapViz(opts) {
    var d = opts && opts.heat === 'voip'
      ? gabyVoipHeatData()
      : opts && opts.heat === 'meet'
        ? gabyMeetHeatData()
        : opts && opts.heat === 'sales'
          ? gabySalesHeatData()
          : gabyHeatData();
    var isSales = d.palette === 'sales';
    var isVoip = d.palette === 'voip';
    var colorFn = isVoip || isSales ? heatColorVoip : heatColor;
    var xUnit = d.xUnit != null ? d.xUnit : 'h';
    var cells = '';
    d.grid.forEach(function (row, ri) {
      cells += '<div class="ar-heat-label">' + esc(d.days[ri]) + '</div>';
      row.forEach(function (v, ci) {
        var t = Math.max(0, Math.min(1, v / d.max));
        var fg = isVoip
          ? v > 18
            ? '#f8fafc'
            : '#0f172a'
          : isSales
            ? v > 80
              ? '#f8fafc'
              : '#0f172a'
            : v > 180
              ? '#f8fafc'
              : '#0f172a';
        var heatCls =
          'ar-heat-cell' +
          (t >= 0.55 ? ' is-hot' : t >= 0.25 ? ' is-warm' : ' is-cool');
        var tip =
          isSales
            ? d.days[ri] + ' · dia ' + d.hours[ci] + ': ' + v
            : d.days[ri] + ' ' + d.hours[ci] + 'h: ' + v;
        cells +=
          '<div class="' +
          heatCls +
          '" style="--t:' +
          t.toFixed(3) +
          ';--ci:' +
          ci +
          ';--ri:' +
          ri +
          ';background:' +
          colorFn(v, d.max) +
          ';color:' +
          fg +
          '" title="' +
          esc(tip) +
          '">' +
          (isSales && v === 0 ? '' : v) +
          '</div>';
      });
    });
    var hourHead =
      '<div class="ar-heat-corner"></div>' +
      d.hours
        .map(function (h) {
          return '<div class="ar-heat-hour">' + h + xUnit + '</div>';
        })
        .join('');
    var scaleCls =
      'ar-heat-scale' +
      (isVoip || isSales ? ' ar-heat-scale--voip' : '') +
      (isSales ? ' ar-heat-scale--sales' : '');
    var wrapCls =
      'ar-heat ar-heat--live' +
      (isVoip ? ' ar-heat--voip' : '') +
      (isSales ? ' ar-heat--sales ar-heat--voip' : '');
    var scaleHtml =
      '<div class="' +
      scaleCls +
      '">' +
      (d.scaleLabel ? '<em class="ar-heat-scale-label">' + esc(d.scaleLabel) + '</em>' : '') +
      '<span>0</span><i></i><span>' +
      esc(d.scaleMax) +
      '</span></div>';
    var axisHtml = isSales
      ? '<div class="ar-heat-axes"><span class="ar-heat-y-title">' +
        esc(d.yAxisLabel || 'Mês') +
        '</span><span class="ar-heat-x-title">' +
        esc(d.xAxisLabel || 'Dia do Mês') +
        '</span></div>'
      : '';
    return (
      '<div class="' +
      wrapCls +
      '" aria-label="Mapa de calor animado">' +
      '<div class="ar-heat-grid" style="--cols:' +
      d.hours.length +
      '">' +
      hourHead +
      cells +
      '</div>' +
      axisHtml +
      scaleHtml +
      '</div>'
    );
  }

  function renderBarsViz(items) {
    var max = 1;
    (items || []).forEach(function (it) {
      if (it.v > max) max = it.v;
    });
    var rows = (items || [])
      .map(function (it, i) {
        var pct = Math.max(4, (it.v / max) * 100);
        var hue = 270 - i * 28;
        return (
          '<div class="ar-bar-row" style="--i:' +
          i +
          '">' +
          '<div class="ar-bar-label">' +
          esc(it.label) +
          '</div>' +
          '<div class="ar-bar-track"><div class="ar-bar-fill" style="width:' +
          pct +
          '%;background:hsl(' +
          hue +
          ' 55% ' +
          (28 + i * 4) +
          '%)"></div></div>' +
          '<div class="ar-bar-val">' +
          esc(String(it.v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')) +
          '</div></div>'
        );
      })
      .join('');
    return '<div class="ar-bars ar-bars--live">' + rows + '</div>';
  }

  
  function formatRevShort(n) {
    if (n >= 1000) {
      var k = Math.round(n / 1000);
      return 'R$ ' + k + 'k';
    }
    return 'R$ ' + Math.round(n);
  }

  
  function renderConvThermoViz(cfg) {
    cfg = cfg || {};
    var bars = cfg.bars || [];
    var slices = cfg.slices || [];
    var yMax = cfg.yMax || 140;
    var W = 420;
    var H = 300;
    var pad = { t: 28, r: 16, b: 36, l: 36 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var n = Math.max(bars.length, 1);
    var gap = plotW / n;
    var barW = Math.min(56, gap * 0.55);

    function yPos(v) {
      return pad.t + plotH - (Math.max(0, v) / yMax) * plotH;
    }

    var grid = '';
    for (var t = 0; t <= yMax; t += 20) {
      var y = yPos(t);
      grid +=
        '<line class="ar-ct-grid" x1="' +
        pad.l +
        '" y1="' +
        y +
        '" x2="' +
        (W - pad.r) +
        '" y2="' +
        y +
        '"/>';
      grid +=
        '<text class="ar-ct-tick" x="' +
        (pad.l - 6) +
        '" y="' +
        (y + 3) +
        '" text-anchor="end">' +
        t +
        '</text>';
    }

    var barsHtml = '';
    bars.forEach(function (b, i) {
      var cx = pad.l + gap * i + gap / 2;
      var y1 = yPos(b.v);
      var bh = Math.max(2, pad.t + plotH - y1);
      barsHtml +=
        '<rect class="ar-ct-bar" style="--i:' +
        i +
        '" x="' +
        (cx - barW / 2) +
        '" y="' +
        y1 +
        '" width="' +
        barW +
        '" height="' +
        bh +
        '" rx="4" fill="' +
        esc(b.color) +
        '"/>';
      barsHtml +=
        '<text class="ar-ct-val" style="--i:' +
        i +
        '" x="' +
        cx +
        '" y="' +
        (y1 - 8) +
        '" text-anchor="middle">' +
        b.v +
        '</text>';
      barsHtml +=
        '<text class="ar-ct-xlabel" x="' +
        cx +
        '" y="' +
        (H - 12) +
        '" text-anchor="middle">' +
        esc(b.label) +
        '</text>';
    });

    var barsSvg =
      '<div class="ar-ct-pane ar-ct-pane--bars">' +
      '<p class="ar-ct-pane-title">' +
      esc(cfg.barsTitle || 'Conversão de Reuniões') +
      '</p>' +
      '<svg class="ar-ct-bars-svg" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="Conversão de reuniões">' +
      grid +
      '<line class="ar-ct-axis" x1="' +
      pad.l +
      '" y1="' +
      (pad.t + plotH) +
      '" x2="' +
      (W - pad.r) +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      barsHtml +
      '</svg></div>';

    /* Donut with % inside segments + external labels */
    var R = 78;
    var cx = 150;
    var cy = 130;
    var circ = 2 * Math.PI * R;
    var offset = 0;
    var arcs = '';
    var labels = '';
    var angle = -Math.PI / 2;
    slices.forEach(function (s, i) {
      var len = (s.pct / 100) * circ;
      var sweep = (s.pct / 100) * 2 * Math.PI;
      var mid = angle + sweep / 2;
      arcs +=
        '<circle class="ar-ct-seg" style="--si:' +
        i +
        '" cx="' +
        cx +
        '" cy="' +
        cy +
        '" r="' +
        R +
        '" fill="none" stroke="' +
        esc(s.color) +
        '" stroke-width="34" stroke-dasharray="' +
        len +
        ' ' +
        (circ - len) +
        '" stroke-dashoffset="' +
        -offset +
        '" transform="rotate(-90 ' +
        cx +
        ' ' +
        cy +
        ')"/>';
      var px = cx + Math.cos(mid) * R;
      var py = cy + Math.sin(mid) * R;
      arcs +=
        '<text class="ar-ct-pct" style="--si:' +
        i +
        '" x="' +
        px +
        '" y="' +
        (py + 4) +
        '" text-anchor="middle">' +
        esc(String(s.pct).replace('.', ',')) +
        '%</text>';
      var lx = cx + Math.cos(mid) * (R + 48);
      var ly = cy + Math.sin(mid) * (R + 48);
      labels +=
        '<text class="ar-ct-slice-label" style="--si:' +
        i +
        '" x="' +
        lx +
        '" y="' +
        (ly + 4) +
        '" text-anchor="middle">' +
        esc(s.label) +
        '</text>';
      offset += len;
      angle += sweep;
    });

    var donutSvg =
      '<div class="ar-ct-pane ar-ct-pane--donut">' +
      '<p class="ar-ct-pane-title">' +
      esc(cfg.donutTitle || 'Qualidade das Reuniões (Termômetro)') +
      '</p>' +
      '<svg class="ar-ct-donut-svg" viewBox="0 0 300 270" role="img" aria-label="Termômetro de reuniões">' +
      '<g class="ar-ct-donut-spin">' +
      arcs +
      '</g>' +
      labels +
      '</svg></div>';

    return (
      '<div class="ar-ct ar-ct--live">' +
      barsSvg +
      donutSvg +
      '</div>'
    );
  }

  function renderDualSalesViz(d) {
    d = d || {};
    var months = d.months || [];
    var volume = d.volume || [];
    var revenue = d.revenue || [];
    var volMax = d.volMax || 700;
    var revMax = d.revMax || 110000;
    var W = 920;
    var H = 340;
    var pad = { t: 36, r: 56, b: 48, l: 52 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var n = months.length || 1;
    var gap = plotW / n;
    var barW = Math.min(42, gap * 0.48);

    function yVol(v) {
      return pad.t + plotH - (v / volMax) * plotH;
    }
    function yRev(v) {
      return pad.t + plotH - (v / revMax) * plotH;
    }

    var grid = '';
    var volTicks = [0, 100, 200, 300, 400, 500, 600, 700];
    volTicks.forEach(function (t) {
      var y = yVol(t);
      grid +=
        '<line class="ar-dual-grid" x1="' +
        pad.l +
        '" y1="' +
        y +
        '" x2="' +
        (W - pad.r) +
        '" y2="' +
        y +
        '"/>';
      grid +=
        '<text class="ar-dual-tick ar-dual-tick--l" x="' +
        (pad.l - 8) +
        '" y="' +
        (y + 3) +
        '" text-anchor="end">' +
        t +
        '</text>';
    });
    var revTicks = [0, 20000, 40000, 60000, 80000, 100000];
    revTicks.forEach(function (t) {
      var y = yRev(t);
      grid +=
        '<text class="ar-dual-tick ar-dual-tick--r" x="' +
        (W - pad.r + 8) +
        '" y="' +
        (y + 3) +
        '" text-anchor="start">' +
        (t === 0 ? '0' : t / 1000 + 'k') +
        '</text>';
    });

    var bars = '';
    var linePts = [];
    months.forEach(function (m, i) {
      var cx = pad.l + gap * i + gap / 2;
      var v = volume[i] || 0;
      var r = revenue[i] || 0;
      var y0 = pad.t + plotH;
      var y1 = yVol(v);
      var bh = Math.max(0, y0 - y1);
      bars +=
        '<rect class="ar-dual-bar" style="--i:' +
        i +
        '" x="' +
        (cx - barW / 2) +
        '" y="' +
        y1 +
        '" width="' +
        barW +
        '" height="' +
        bh +
        '" rx="3"/>';
      if (v > 0) {
        bars +=
          '<text class="ar-dual-bar-label" style="--i:' +
          i +
          '" x="' +
          cx +
          '" y="' +
          (y1 - 6) +
          '" text-anchor="middle">' +
          v +
          '</text>';
      }
      bars +=
        '<text class="ar-dual-m" x="' +
        cx +
        '" y="' +
        (H - 18) +
        '" text-anchor="middle">' +
        esc(m) +
        '</text>';
      var ry = yRev(r);
      linePts.push(cx + ',' + ry);
      bars +=
        '<circle class="ar-dual-dot" style="--i:' +
        i +
        '" cx="' +
        cx +
        '" cy="' +
        ry +
        '" r="5"/>';
      bars +=
        '<text class="ar-dual-rev-label" style="--i:' +
        i +
        '" x="' +
        cx +
        '" y="' +
        (ry - 12) +
        '" text-anchor="middle">' +
        esc(formatRevShort(r)) +
        '</text>';
    });

    var poly = linePts
      .map(function (p, i) {
        return (i === 0 ? 'M' : 'L') + p.replace(',', ' ');
      })
      .join(' ');

    return (
      '<div class="ar-dual ar-dual--live">' +
      '<ul class="ar-dual-legend">' +
      '<li><i class="ar-dual-leg--vol"></i><span>Quantidade de Vendas</span></li>' +
      '<li><i class="ar-dual-leg--rev"></i><span>Faturamento (R$)</span></li>' +
      '</ul>' +
      '<svg class="ar-dual-svg" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="Volume e faturamento mensal">' +
      grid +
      '<line class="ar-dual-axis" x1="' +
      pad.l +
      '" y1="' +
      (pad.t + plotH) +
      '" x2="' +
      (W - pad.r) +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      '<line class="ar-dual-axis" x1="' +
      pad.l +
      '" y1="' +
      pad.t +
      '" x2="' +
      pad.l +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      '<line class="ar-dual-axis ar-dual-axis--r" x1="' +
      (W - pad.r) +
      '" y1="' +
      pad.t +
      '" x2="' +
      (W - pad.r) +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      bars +
      '<path class="ar-dual-line" d="' +
      poly +
      '" fill="none"/>' +
      '<text class="ar-dual-axis-title ar-dual-axis-title--l" x="14" y="' +
      (pad.t + plotH / 2) +
      '" text-anchor="middle" transform="rotate(-90 14 ' +
      (pad.t + plotH / 2) +
      ')">Quantidade de Vendas</text>' +
      '<text class="ar-dual-axis-title ar-dual-axis-title--r" x="' +
      (W - 12) +
      '" y="' +
      (pad.t + plotH / 2) +
      '" text-anchor="middle" transform="rotate(90 ' +
      (W - 12) +
      ' ' +
      (pad.t + plotH / 2) +
      ')">Faturamento (R$)</text>' +
      '<text class="ar-dual-axis-title" x="' +
      (pad.l + plotW / 2) +
      '" y="' +
      (H - 2) +
      '" text-anchor="middle">Mês de Fechamento</text>' +
      '</svg></div>'
    );
  }

  function renderClusterBarsViz(s) {
    var months = s.months || [];
    var series = s.series || [];
    var max = 1;
    series.forEach(function (ser) {
      (ser.values || []).forEach(function (v) {
        if (v > max) max = v;
      });
    });
    // Nice Y ceiling near 300 for this chart
    var yMax = Math.max(50, Math.ceil(max / 50) * 50);
    var ticks = [];
    for (var t = yMax; t >= 0; t -= yMax / 6) ticks.push(Math.round(t));
    var legend = series
      .map(function (ser) {
        return (
          '<li><i style="background:' +
          esc(ser.color) +
          '"></i><span>' +
          esc(ser.label) +
          '</span></li>'
        );
      })
      .join('');
    var cols = months
      .map(function (m, mi) {
        var bars = series
          .map(function (ser, si) {
            var v = (ser.values && ser.values[mi]) || 0;
            var h = yMax ? (v / yMax) * 100 : 0;
            return (
              '<div class="ar-cluster-bar" style="--h:' +
              h +
              '%;--c:' +
              esc(ser.color) +
              ';--si:' +
              si +
              ';--mi:' +
              mi +
              '">' +
              (v > 0
                ? '<span class="ar-cluster-val">' + esc(String(v)) + '</span>'
                : '') +
              '<i style="background:' +
              esc(ser.color) +
              '"></i></div>'
            );
          })
          .join('');
        return (
          '<div class="ar-cluster-month" style="--mi:' +
          mi +
          '"><div class="ar-cluster-cols">' +
          bars +
          '</div><span class="ar-cluster-m">' +
          esc(m) +
          '</span></div>'
        );
      })
      .join('');
    var yAxis = ticks
      .map(function (n) {
        return '<span>' + n + '</span>';
      })
      .join('');
    return (
      '<div class="ar-cluster ar-cluster--live">' +
      '<ul class="ar-cluster-legend">' +
      legend +
      '</ul>' +
      '<div class="ar-cluster-chart">' +
      '<div class="ar-cluster-y" aria-hidden="true">' +
      yAxis +
      '</div>' +
      '<div class="ar-cluster-plot"><div class="ar-cluster-grid" aria-hidden="true"></div><div class="ar-cluster-months">' +
      cols +
      '</div></div></div>' +
      '<p class="ar-cluster-xlabel">Quantidade de Ligações</p></div>'
    );
  }

  function renderDonutViz(slices, centerLabel, centerSub) {
    var list = slices || [];
    var r = 72;
    var c = 90;
    var circ = 2 * Math.PI * r;
    var offset = 0;
    var arcs = list
      .map(function (s, i) {
        var len = (s.pct / 100) * circ;
        var dash = len + ' ' + (circ - len);
        var el =
          '<circle class="ar-donut-seg" style="--si:' +
          i +
          '" cx="' +
          c +
          '" cy="' +
          c +
          '" r="' +
          r +
          '" fill="none" stroke="' +
          esc(s.color) +
          '" stroke-width="28" stroke-dasharray="' +
          dash +
          '" stroke-dashoffset="' +
          -offset +
          '" transform="rotate(-90 ' +
          c +
          ' ' +
          c +
          ')"/>';
        offset += len;
        return el;
      })
      .join('');
    var legend = list
      .map(function (s, i) {
        return (
          '<li style="--si:' +
          i +
          '"><i style="background:' +
          esc(s.color) +
          '"></i><span>' +
          esc(s.label) +
          '</span><strong>' +
          esc(String(s.pct).replace('.', ',')) +
          '%</strong></li>'
        );
      })
      .join('');
    return (
      '<div class="ar-donut-wrap ar-donut--live">' +
      '<div class="ar-donut">' +
      '<svg viewBox="0 0 180 180" role="img" aria-label="Speed to Execution">' +
      '<g class="ar-donut-spin">' +
      arcs +
      '</g></svg>' +
      '<div class="ar-donut-center"><strong>' +
      esc(centerLabel || '') +
      '</strong><span>' +
      esc(centerSub || '') +
      '</span></div></div>' +
      '<ul class="ar-donut-legend">' +
      legend +
      '</ul></div>'
    );
  }

  function renderHistViz(cfg) {
    var c = cfg || {};
    var values = c.values || [];
    var xMax = c.xMax != null ? c.xMax : Math.max(values.length - 1, 1);
    var yMax = c.yMax != null ? c.yMax : 30;
    var mean = c.mean != null ? c.mean : null;
    var median = c.median != null ? c.median : null;
    var W = 640;
    var H = 320;
    var pad = { t: 18, r: 18, b: 42, l: 48 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var n = Math.max(values.length, xMax + 1);
    var barW = plotW / n;

    function xPos(day) {
      return pad.l + (day / xMax) * plotW;
    }
    function yPos(v) {
      return pad.t + plotH - (Math.max(0, v) / yMax) * plotH;
    }

    var grid = '';
    var yTicks = [];
    for (var yt = 0; yt <= yMax; yt += 5) yTicks.push(yt);
    yTicks.forEach(function (t) {
      var y = yPos(t);
      grid +=
        '<line class="ar-svg-grid" x1="' +
        pad.l +
        '" y1="' +
        y +
        '" x2="' +
        (W - pad.r) +
        '" y2="' +
        y +
        '"/>';
      grid +=
        '<text class="ar-svg-tick" x="' +
        (pad.l - 8) +
        '" y="' +
        (y + 3) +
        '" text-anchor="end">' +
        t +
        '</text>';
    });

    var xTicks = '';
    for (var xt = 0; xt <= xMax; xt += 5) {
      var x = xPos(xt);
      xTicks +=
        '<text class="ar-svg-tick" x="' +
        x +
        '" y="' +
        (H - 14) +
        '" text-anchor="middle">' +
        xt +
        '</text>';
    }

    var bars = values
      .map(function (v, i) {
        if (!v) return '';
        var h = (v / yMax) * plotH;
        var x = pad.l + i * barW + barW * 0.12;
        var y = yPos(v);
        return (
          '<rect class="ar-hist-svg-bar" style="--i:' +
          i +
          '" x="' +
          x.toFixed(2) +
          '" y="' +
          y.toFixed(2) +
          '" width="' +
          (barW * 0.76).toFixed(2) +
          '" height="' +
          h.toFixed(2) +
          '" rx="2"/>'
        );
      })
      .join('');

    // smooth density curve (moving average of hist)
    var dens = [];
    for (var i = 0; i < values.length; i++) {
      var s = 0;
      var w = 0;
      for (var k = -2; k <= 2; k++) {
        var j = i + k;
        if (j >= 0 && j < values.length) {
          var ww = 3 - Math.abs(k);
          s += values[j] * ww;
          w += ww;
        }
      }
      dens.push(s / w);
    }
    var dMax = 1;
    dens.forEach(function (v) {
      if (v > dMax) dMax = v;
    });
    // scale density to sit nicely over bars (peak ~ yMax * 0.95)
    var scale = (yMax * 0.95) / dMax;
    var curve = dens
      .map(function (v, i) {
        return xPos(i).toFixed(2) + ',' + yPos(v * scale).toFixed(2);
      })
      .join(' ');

    var guides = '';
    if (median != null) {
      var mx = xPos(median);
      guides +=
        '<line class="ar-hist-guide ar-hist-guide--med" x1="' +
        mx +
        '" y1="' +
        pad.t +
        '" x2="' +
        mx +
        '" y2="' +
        (pad.t + plotH) +
        '"/>';
    }
    if (mean != null) {
      var nx = xPos(mean);
      guides +=
        '<line class="ar-hist-guide ar-hist-guide--mean" x1="' +
        nx +
        '" y1="' +
        pad.t +
        '" x2="' +
        nx +
        '" y2="' +
        (pad.t + plotH) +
        '"/>';
    }

    return (
      '<div class="ar-svgchart ar-hist ar-hist--live">' +
      '<div class="ar-svgchart-legend">' +
      (mean != null
        ? '<span class="ar-hist-leg ar-hist-leg--mean">Média (' +
          String(mean).replace('.', ',') +
          ' dias)</span>'
        : '') +
      (median != null
        ? '<span class="ar-hist-leg ar-hist-leg--med">Mediana (' +
          String(median).replace('.', ',') +
          ' dias)</span>'
        : '') +
      '</div>' +
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="Time-to-Meeting">' +
      '<text class="ar-svg-axis-title" transform="translate(14 ' +
      (pad.t + plotH / 2) +
      ') rotate(-90)" text-anchor="middle">' +
      esc(c.yLabel || 'Volume') +
      '</text>' +
      grid +
      bars +
      '<polyline class="ar-hist-kde" fill="none" points="' +
      curve +
      '"/>' +
      guides +
      '<line class="ar-svg-axis" x1="' +
      pad.l +
      '" y1="' +
      (pad.t + plotH) +
      '" x2="' +
      (W - pad.r) +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      '<line class="ar-svg-axis" x1="' +
      pad.l +
      '" y1="' +
      pad.t +
      '" x2="' +
      pad.l +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      xTicks +
      '<text class="ar-svg-axis-title" x="' +
      (pad.l + plotW / 2) +
      '" y="' +
      (H - 2) +
      '" text-anchor="middle">' +
      esc(c.xLabel || 'Dias') +
      '</text>' +
      '</svg></div>'
    );
  }

  function renderSeasonViz(cfg) {
    var values = (cfg && cfg.values) || [];
    var yMax = 10;
    var max = yMax;
    var ma = values.map(function (v, i) {
      var a = values[i - 1];
      var b = v;
      var c = values[i + 1];
      var n = 1;
      var s = b;
      if (a != null) {
        s += a;
        n++;
      }
      if (c != null) {
        s += c;
        n++;
      }
      return s / n;
    });
    var W = 720;
    var H = 320;
    var pad = { t: 22, r: 16, b: 42, l: 44 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var n = values.length;
    var gap = 0.22;
    var slot = plotW / n;
    var barW = slot * (1 - gap);

    function xCenter(i) {
      return pad.l + i * slot + slot / 2;
    }
    function yPos(v) {
      return pad.t + plotH - (Math.max(0, v) / max) * plotH;
    }

    var grid = '';
    for (var yt = 0; yt <= max; yt += 2) {
      var y = yPos(yt);
      grid +=
        '<line class="ar-svg-grid" x1="' +
        pad.l +
        '" y1="' +
        y +
        '" x2="' +
        (W - pad.r) +
        '" y2="' +
        y +
        '"/>';
      grid +=
        '<text class="ar-svg-tick" x="' +
        (pad.l - 8) +
        '" y="' +
        (y + 3) +
        '" text-anchor="end">' +
        yt +
        '</text>';
    }

    var bars = values
      .map(function (v, i) {
        var h = (v / max) * plotH;
        var x = pad.l + i * slot + (slot - barW) / 2;
        var y = yPos(v);
        var label =
          v > 0
            ? '<text class="ar-season-svg-val" x="' +
              xCenter(i).toFixed(1) +
              '" y="' +
              (y - 4).toFixed(1) +
              '" text-anchor="middle">' +
              v +
              '</text>'
            : '';
        return (
          '<rect class="ar-season-svg-bar" style="--i:' +
          i +
          '" x="' +
          x.toFixed(2) +
          '" y="' +
          y.toFixed(2) +
          '" width="' +
          barW.toFixed(2) +
          '" height="' +
          Math.max(h, 0).toFixed(2) +
          '" rx="2"/>' +
          label +
          '<text class="ar-svg-tick ar-season-day" x="' +
          xCenter(i).toFixed(1) +
          '" y="' +
          (H - 16) +
          '" text-anchor="middle">' +
          (i + 1) +
          '</text>'
        );
      })
      .join('');

    var poly = ma
      .map(function (v, i) {
        return xCenter(i).toFixed(2) + ',' + yPos(v).toFixed(2);
      })
      .join(' ');
    var dots = ma
      .map(function (v, i) {
        return (
          '<circle class="ar-season-dot" style="--i:' +
          i +
          '" cx="' +
          xCenter(i).toFixed(2) +
          '" cy="' +
          yPos(v).toFixed(2) +
          '" r="2.6"/>'
        );
      })
      .join('');

    return (
      '<div class="ar-svgchart ar-season ar-season--live">' +
      '<div class="ar-svgchart-legend">' +
      '<span class="ar-season-leg"><i></i>Média Móvel (3 dias)</span>' +
      '</div>' +
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="Sazonalidade do Agendamento">' +
      '<text class="ar-svg-axis-title" transform="translate(14 ' +
      (pad.t + plotH / 2) +
      ') rotate(-90)" text-anchor="middle">Quantidade de Reuniões</text>' +
      grid +
      bars +
      '<polyline class="ar-season-poly" fill="none" points="' +
      poly +
      '"/>' +
      dots +
      '<line class="ar-svg-axis" x1="' +
      pad.l +
      '" y1="' +
      (pad.t + plotH) +
      '" x2="' +
      (W - pad.r) +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      '<line class="ar-svg-axis" x1="' +
      pad.l +
      '" y1="' +
      pad.t +
      '" x2="' +
      pad.l +
      '" y2="' +
      (pad.t + plotH) +
      '"/>' +
      '<text class="ar-svg-axis-title" x="' +
      (pad.l + plotW / 2) +
      '" y="' +
      (H - 2) +
      '" text-anchor="middle">Dias do Mês</text>' +
      '</svg></div>'
    );
  }

  function renderViz(s) {
    var vizHtml = '';
    if (s.viz === 'heatmap') vizHtml = renderHeatmapViz(s);
    else if (s.viz === 'bars') vizHtml = renderBarsViz(s.items);
    else if (s.viz === 'cluster') vizHtml = renderClusterBarsViz(s);
    else if (s.viz === 'dual') vizHtml = renderDualSalesViz(s.dual);
    else if (s.viz === 'convThermo') vizHtml = renderConvThermoViz(s.convThermo);
    else if (s.viz === 'hist') vizHtml = renderHistViz(s.hist);
    else if (s.viz === 'season') vizHtml = renderSeasonViz(s.season);
    else if (s.viz === 'donut') vizHtml = renderDonutViz(s.slices, s.centerLabel, s.centerSub);
    var insights = (s.insights || [])
      .map(function (t) {
        return '<li>' + esc(t) + '</li>';
      })
      .join('');
    var inner =
      '<div class="ar-viz-main">' +
      vizHtml +
      '</div>' +
      (insights
        ? '<ul class="ar-viz-insights">' + insights + '</ul>'
        : '');
    return arPanelShell('viz', s, inner);
  }

  function renderSplit(s) {
    var pos = (s.positives || [])
      .map(function (it) {
        return '<li>' + esc(it) + '</li>';
      })
      .join('');
    var neg = (s.negatives || [])
      .map(function (it) {
        return '<li>' + esc(it) + '</li>';
      })
      .join('');
    var inner =
      '<div class="ar-split-grid">' +
      '<div class="ar-split-col ar-split-col--pos">' +
      '<p class="ar-split-label">Pontos positivos</p>' +
      '<ul>' +
      pos +
      '</ul></div>' +
      '<div class="ar-split-col ar-split-col--neg">' +
      '<p class="ar-split-label">Pontos de atenção</p>' +
      '<ul>' +
      neg +
      '</ul></div></div>';
    return arPanelShell('split', s, inner);
  }

  function renderPlan(s) {
    var cards = (s.cards || [])
      .map(function (c, i) {
        var meta = [];
        if (c.owner) meta.push('<span><em>Resp.</em> ' + esc(c.owner) + '</span>');
        if (c.support) meta.push('<span><em>Apoio</em> ' + esc(c.support) + '</span>');
        if (c.action) meta.push('<span><em>Ação</em> ' + esc(c.action) + '</span>');
        return (
          '<article class="ar-plan-card" style="--i:' +
          i +
          '">' +
          '<span class="ar-plan-card-num" aria-hidden="true">' +
          String(i + 1).padStart(2, '0') +
          '</span>' +
          '<h4>' +
          esc(c.title) +
          '</h4>' +
          (meta.length ? '<div class="ar-plan-meta">' + meta.join('') + '</div>' : '') +
          '</article>'
        );
      })
      .join('');
    var inner =
      (s.intro ? '<p class="ar-plan-intro">' + esc(s.intro) + '</p>' : '') +
      '<div class="ar-plan-grid">' +
      cards +
      '</div>';
    return arPanelShell('plan', s, inner);
  }

  function renderCta(s) {
    var bg = esc(s.bg || AR_HERO_BG);
    var lines = (s.lines || [])
      .map(function (l) {
        return '<p class="ar-cta-line">' + esc(l) + '</p>';
      })
      .join('');
    var pills = (s.pills || [])
      .map(function (p) {
        return '<span class="ar-cta-pill">' + esc(p) + '</span>';
      })
      .join('');
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--cta ar-hero ar-section--sprint">' +
      '<div class="ar-hero-bg" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-hero-veil ar-hero-veil--section" aria-hidden="true"></div>' +
      '<div class="ar-hero-grain" aria-hidden="true"></div>' +
      '<div class="ar-cta-inner">' +
      (s.kicker ? '<p class="ar-cover-kicker">' + esc(s.kicker) + '</p>' : '') +
      '<h3 class="ar-cta-title">' +
      esc(s.title) +
      '</h3>' +
      '<div class="ar-hero-rule" aria-hidden="true"></div>' +
      '<div class="ar-cta-lines">' +
      lines +
      '</div>' +
      (pills ? '<div class="ar-cta-pills">' + pills + '</div>' : '') +
      (s.quote
        ? '<blockquote class="ar-cta-quote"><p>“' +
          esc(s.quote) +
          '”</p>' +
          (s.author ? '<cite>— ' + esc(s.author) + '</cite>' : '') +
          '</blockquote>'
        : '') +
      '</div></div>'
    );
  }

  function renderChart(s) {
    var frameId = s.chart === 'top15' ? 'arChartTop15' : 'arChartSla';
    var legends = (s.legends || [])
      .map(function (l) {
        return (
          '<span class="ar-leg ' +
          esc(l.cls) +
          '"><i></i> ' +
          esc(l.label) +
          '</span>'
        );
      })
      .join('');
    var foot = '';
    if (s.footLegends && s.footLegends.length) {
      foot =
        '<div class="ar-chart-legend ar-chart-legend--foot" aria-hidden="true">' +
        '<span class="ar-leg-title">Tipo de Entidade</span>' +
        s.footLegends
          .map(function (l) {
            return (
              '<span class="ar-leg ' +
              esc(l.cls) +
              '"><i></i> ' +
              esc(l.label) +
              '</span>'
            );
          })
          .join('') +
        '</div>';
    }
    var inner =
      (legends
        ? '<div class="ar-chart-legend" aria-hidden="true">' + legends + '</div>'
        : '') +
      '<div class="ar-chart-frame" id="' +
      frameId +
      '"></div>' +
      foot;
    if (s.person && s.indicator) {
      return arPanelShell(
        'chart',
        {
          title: s.title || 'PRODUTIVIDADE MENSAL',
          midKicker: s.midKicker,
          indicator: s.indicator,
          person: s.person,
          note: s.note,
          bg: s.bg
        },
        inner
      );
    }
    var chartTitle =
      s.chart === 'sla'
        ? 'SLA e tendência mensal'
        : s.chart === 'top15'
          ? 'Top 15 contas de maior esforço'
          : s.title;
    return arPanelShell(
      'chart',
      {
        title: chartTitle,
        badge: s.badge || (s.chart === 'sla' ? 'ATIVIDADES' : 'ESFORÇO'),
        note: s.title,
        bg: s.bg
      },
      inner
    );
  }

  function paintSlaChart(host) {
    if (!host || host.dataset.ready === '1') return;
    var months =
      (window.AR_PERIOD && window.AR_PERIOD.chartMonths && window.AR_PERIOD.chartMonths.length
        ? window.AR_PERIOD.chartMonths
        : ['Mar/2026', 'Abr/2026', 'Mai/2026', 'Jun/2026', 'Jul/2026', 'Ago/2026']);
    var rows = [
      { ok: 52, late: 0, total: 52 },
      { ok: 998, late: 108, total: 1106 },
      { ok: 783, late: 252, total: 1035 },
      { ok: 1481, late: 134, total: 1615 },
      { ok: 896, late: 256, total: 1152 },
      { ok: 1078, late: 375, total: 1453 }
    ];
    if (months.length < rows.length) rows = rows.slice(rows.length - months.length);
    if (months.length > rows.length) months = months.slice(months.length - rows.length);
    var W = 1000;
    var H = 520;
    var pad = { l: 78, r: 28, t: 28, b: 52 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var yMax = 1750;
    function y(v) {
      return pad.t + plotH - (v / yMax) * plotH;
    }
    var groupW = plotW / rows.length;
    var barW = Math.min(34, groupW * 0.28);
    var grid = '';
    for (var v = 0; v <= yMax; v += 250) {
      var yy = y(v);
      grid +=
        '<line x1="' +
        pad.l +
        '" y1="' +
        yy +
        '" x2="' +
        (W - pad.r) +
        '" y2="' +
        yy +
        '" stroke="#d1d5db" stroke-width="1" stroke-dasharray="3 4"/>';
      grid +=
        '<text x="' +
        (pad.l - 10) +
        '" y="' +
        (yy + 4) +
        '" text-anchor="end" font-size="12" fill="#6b7280" font-family="Manrope,Segoe UI,sans-serif">' +
        v +
        '</text>';
    }
    var bars = '';
    var linePts = [];
    rows.forEach(function (r, i) {
      var cx = pad.l + groupW * (i + 0.5);
      var xOk = cx - barW - 2;
      var xLate = cx + 2;
      var hOk = (r.ok / yMax) * plotH;
      var hLate = (r.late / yMax) * plotH;
      if (r.ok > 0) {
        bars +=
          '<rect x="' +
          xOk +
          '" y="' +
          y(r.ok) +
          '" width="' +
          barW +
          '" height="' +
          hOk +
          '" fill="#22c55e"/>';
        bars +=
          '<text x="' +
          (xOk + barW / 2) +
          '" y="' +
          (y(r.ok) - 6) +
          '" text-anchor="middle" font-size="12" font-weight="700" fill="#166534" font-family="Manrope,Segoe UI,sans-serif">' +
          r.ok +
          '</text>';
      }
      if (r.late > 0) {
        bars +=
          '<rect x="' +
          xLate +
          '" y="' +
          y(r.late) +
          '" width="' +
          barW +
          '" height="' +
          hLate +
          '" fill="#ef4444"/>';
        bars +=
          '<text x="' +
          (xLate + barW / 2) +
          '" y="' +
          (y(r.late) - 6) +
          '" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c" font-family="Manrope,Segoe UI,sans-serif">' +
          r.late +
          '</text>';
      }
      var ty = y(r.total);
      linePts.push([cx, ty]);
      bars +=
        '<text x="' +
        cx +
        '" y="' +
        (ty - 14) +
        '" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8" font-family="Manrope,Segoe UI,sans-serif">' +
        r.total +
        '</text>';
      bars +=
        '<text x="' +
        cx +
        '" y="' +
        (H - 18) +
        '" text-anchor="middle" font-size="13" fill="#374151" font-family="Manrope,Segoe UI,sans-serif">' +
        months[i] +
        '</text>';
    });
    var poly = linePts
      .map(function (p) {
        return p.join(',');
      })
      .join(' ');
    var dots = linePts
      .map(function (p) {
        return (
          '<circle cx="' +
          p[0] +
          '" cy="' +
          p[1] +
          '" r="5.5" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>'
        );
      })
      .join('');
    host.innerHTML =
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="SLA e tendência mensal de atividades">' +
      grid +
      '<text transform="translate(18 ' +
      (pad.t + pad.t + plotH) / 2 +
      ') rotate(-90)" text-anchor="middle" font-size="13" fill="#4b5563" font-family="Manrope,Segoe UI,sans-serif">Volume de Atividades</text>' +
      bars +
      '<polyline points="' +
      poly +
      '" fill="none" stroke="#2563eb" stroke-width="2.5"/>' +
      dots +
      '</svg>';
    host.dataset.ready = '1';
  }

  function paintTop15Chart(host) {
    if (!host || host.dataset.ready === '1') return;
    var items = [
      { name: 'Lubrin Lubrificação Industrial', v: 32, type: 'deal' },
      { name: 'Energold Drilling Brasil', v: 28, type: 'deal' },
      { name: 'tsm', v: 26, type: 'deal' },
      { name: '[IA] Produflex ind. Borracha ltda', v: 23, type: 'deal' },
      { name: 'Jirau Energia S.a.', v: 23, type: 'deal' },
      { name: 'IRMAOS GONCALVES COMERCIO E INDUSTRIA LTDA', v: 23, type: 'deal' },
      { name: '[IA] Bianchini SA', v: 22, type: 'deal' },
      { name: 'Essencis MG', v: 20, type: 'deal' },
      { name: 'Contato (ID 37)', v: 19, type: 'contact' },
      { name: '[IA] ecolab', v: 19, type: 'deal' },
      { name: '[IA] Alimentos Zaeli', v: 19, type: 'deal' },
      { name: 'DESTACA ENGENHARIA DE FUNDACOES E INFRA ESTRUTURAS...', v: 18, type: 'deal' },
      { name: '[IA] kaefer', v: 18, type: 'deal' },
      { name: 'Agro Paraná', v: 18, type: 'deal' },
      { name: '[IA] FPT', v: 18, type: 'deal' }
    ];
    var W = 1000;
    var H = 520;
    var pad = { l: 310, r: 48, t: 18, b: 42 };
    var plotW = W - pad.l - pad.r;
    var plotH = H - pad.t - pad.b;
    var xMax = 35;
    var rowH = plotH / items.length;
    var barH = Math.min(18, rowH * 0.62);
    function x(v) {
      return pad.l + (v / xMax) * plotW;
    }
    var grid = '';
    for (var v = 0; v <= xMax; v += 5) {
      var xx = x(v);
      grid +=
        '<line x1="' +
        xx +
        '" y1="' +
        pad.t +
        '" x2="' +
        xx +
        '" y2="' +
        (H - pad.b) +
        '" stroke="#d1d5db" stroke-width="1" stroke-dasharray="2 4"/>';
      grid +=
        '<text x="' +
        xx +
        '" y="' +
        (H - 16) +
        '" text-anchor="middle" font-size="12" fill="#6b7280" font-family="Manrope,Segoe UI,sans-serif">' +
        v +
        '</text>';
    }
    var bars = '';
    items.forEach(function (it, i) {
      var cy = pad.t + rowH * (i + 0.5);
      var w = (it.v / xMax) * plotW;
      var color = it.type === 'contact' ? '#16a34a' : '#1e3a8a';
      var label = it.name.length > 42 ? it.name.slice(0, 41) + '…' : it.name;
      bars +=
        '<text x="' +
        (pad.l - 10) +
        '" y="' +
        (cy + 4) +
        '" text-anchor="end" font-size="11.5" fill="#1f2937" font-family="Manrope,Segoe UI,sans-serif">' +
        esc(label) +
        '</text>';
      bars +=
        '<rect x="' +
        pad.l +
        '" y="' +
        (cy - barH / 2) +
        '" width="' +
        w +
        '" height="' +
        barH +
        '" fill="' +
        color +
        '"/>';
      bars +=
        '<text x="' +
        (pad.l + w + 6) +
        '" y="' +
        (cy + 4) +
        '" font-size="12" font-weight="700" fill="#111827" font-family="Manrope,Segoe UI,sans-serif">' +
        it.v +
        '</text>';
    });
    host.innerHTML =
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="Top 15 contas de maior esforço">' +
      grid +
      bars +
      '<text x="' +
      (pad.l + plotW / 2) +
      '" y="' +
      (H - 2) +
      '" text-anchor="middle" font-size="12" fill="#4b5563" font-family="Manrope,Segoe UI,sans-serif">Volume Total de Atividades</text></svg>';
    host.dataset.ready = '1';
  }

  function ensureArCharts() {
    paintSlaChart(document.getElementById('arChartSla'));
    paintTop15Chart(document.getElementById('arChartTop15'));
  }

  function renderSign(s) {
    var bg = esc(s.bg || AR_HERO_BG);
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--sign ar-hero">' +
      '<div class="ar-hero-bg ar-hero-bg--soft" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-hero-veil" aria-hidden="true"></div>' +
      '<div class="ar-hero-grain" aria-hidden="true"></div>' +
      '<div class="ar-sign-inner">' +
      '<span class="melvin-logo-lockup ar-cover-logo" role="img" aria-label="Melvin"></span>' +
      '<p class="ar-sign-kicker">' +
      esc(s.kicker || 'AR · Análise de resultado') +
      '</p>' +
      '<p class="ar-sign-lead">' +
      esc(s.lead || 'Relatório elaborado por') +
      '</p>' +
      '<h3 class="ar-sign-name">' +
      esc(s.name) +
      '</h3>' +
      '<p class="ar-sign-role">' +
      esc(s.role) +
      '</p>' +
      '<div class="ar-hero-rule" aria-hidden="true"></div>' +
      '<p class="ar-sign-meta">' +
      esc(s.meta) +
      '</p>' +
      '</div></div>'
    );
  }

  function renderSlide(s, i) {
    var inner = '';
    switch (s.type) {
      case 'cover':
        inner = renderCover(s);
        break;
      case 'objectives':
        inner = renderObjectives(s);
        break;
      case 'bullets':
        inner = renderBullets(s);
        break;
      case 'section':
        inner = renderSection(s);
        break;
      case 'table':
        inner = renderTable(s);
        break;
      case 'matrix':
        inner = renderMatrix(s);
        break;
      case 'viz':
        inner = renderViz(s);
        break;
      case 'split':
        inner = renderSplit(s);
        break;
      case 'plan':
        inner = renderPlan(s);
        break;
      case 'cta':
        inner = renderCta(s);
        break;
      case 'chart':
        inner = renderChart(s);
        break;
      case 'sign':
        inner = renderSign(s);
        break;
      default:
        inner =
          '<div class="ar-slide-canvas"><p>' + esc(s.title || 'Slide') + '</p></div>';
    }
    var label = s.title || s.type || 'Slide ' + (i + 1);
    var cls = i === 0 ? 'ar-slide is-active' : 'ar-slide';
    var hidden = i === 0 ? '' : ' hidden';
    return (
      '<article class="' +
      cls +
      '" data-ar-slide="' +
      (i + 1) +
      '" aria-label="' +
      esc(label) +
      '"' +
      hidden +
      '>' +
      inner +
      '</article>'
    );
  }

  function renderArDeckSlides(viewport, slides) {
    if (!viewport) return;
    var list = slides || window.AR_DECK_SLIDES || [];
    viewport.innerHTML = list
      .map(function (s, i) {
        return renderSlide(s, i);
      })
      .join('');
  }

  window.renderArDeckSlides = renderArDeckSlides;

  window.initArDeckFromData = function initArDeckFromData() {
    var root = document.getElementById('arDeck');
    if (!root) return;
    var viewport = document.getElementById('arDeckViewport');
    renderArDeckSlides(viewport, window.AR_DECK_SLIDES);

    var slides = Array.from(root.querySelectorAll('[data-ar-slide]'));
    var counter = document.getElementById('arDeckCounter');
    var prevBtn = document.getElementById('arDeckPrev');
    var nextBtn = document.getElementById('arDeckNext');
    var fsBtn = document.getElementById('arDeckFs');
    var index = 0;

    function go(to) {
      if (!slides.length) return;
      index = Math.max(0, Math.min(slides.length - 1, to));
      slides.forEach(function (slide, i) {
        var on = i === index;
        slide.classList.toggle('is-active', on);
        if (on) slide.removeAttribute('hidden');
        else slide.setAttribute('hidden', '');
      });
      if (counter) counter.textContent = index + 1 + ' / ' + slides.length;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    }

    function syncFsUi() {
      var fs = !!(
        document.fullscreenElement === root ||
        document.webkitFullscreenElement === root
      );
      root.classList.toggle('is-fs', fs);
      if (fsBtn) fsBtn.textContent = fs ? '⛶ Sair da tela cheia' : '⛶ Tela cheia';
    }

    async function toggleFs() {
      try {
        if (
          document.fullscreenElement === root ||
          document.webkitFullscreenElement === root
        ) {
          if (document.exitFullscreen) await document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } else if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          root.webkitRequestFullscreen();
        }
      } catch (e) {}
      syncFsUi();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(index + 1); });
    if (fsBtn) fsBtn.addEventListener('click', toggleFs);
    document.addEventListener('fullscreenchange', syncFsUi);
    document.addEventListener('webkitfullscreenchange', syncFsUi);

    function onKey(e) {
      var section = document.getElementById('ar-atual');
      var active = section && section.classList.contains('page-active');
      var fs =
        document.fullscreenElement === root ||
        document.webkitFullscreenElement === root;
      if (!active && !fs) return;
      if (e.key === 'ArrowRight') {
        go(index + 1);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        go(index - 1);
        e.preventDefault();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFs();
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', onKey);

    ensureArCharts();
    go(0);
    try {
      root.focus({ preventScroll: true });
    } catch (e) {}
  };
})();
