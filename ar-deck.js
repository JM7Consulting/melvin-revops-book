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
  var MX_MONTHS = ['Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'];
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
      title: 'Resumo de SLA por Mês',
      badge: 'GABRIELY',
      note: 'Usuária: Gabriely Silva · ' + AR_PERIOD.label,
      columns: ['Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'],
      rows: [
        {
          label: 'Atividades concluídas',
          values: ['52', '1.106', '1.035', '1.615', '1.152', '1.453']
        },
        {
          label: 'Atividades com atraso (percentual)',
          values: ['0,0%', '9,8%', '24,3%', '8,3%', '22,2%', '25,8%'],
          tones: ['ok', 'ok', 'bad', 'ok', 'bad', 'bad']
        },
        { label: 'Ligações Iniciadas', values: ['', '', '', '', '', ''] },
        { label: 'Ligações Atendidas', values: ['', '', '', '', '', ''] },
        { label: 'Ligações — mais de 30 segundos', values: ['', '', '', '', '', ''] },
        { label: 'Agendamentos Marcados', values: ['', '', '', '', '', ''] },
        { label: 'Reuniões realizadas', values: ['', '', '', '', '', ''] },
        { label: 'Cancelamentos', values: ['', '', '', '', '', ''] },
        { label: 'No Show', values: ['', '', '', '', '', ''] },
        { label: 'Vendas', values: ['', '', '', '', '', ''] }
      ]
    },
    {
      type: 'chart',
      chart: 'sla',
      title:
        'Dashboard RevOps: SLA e Tendência Mensal de Atividades · ' +
        AR_PERIOD.label +
        ' (Usuária: Gabriely Silva)',
      legends: [
        { cls: 'ar-leg--trend', label: 'Tendência (Volume Total)' },
        { cls: 'ar-leg--ok', label: 'Concluído no Prazo' },
        { cls: 'ar-leg--late', label: 'Concluído em Atraso' }
      ]
    },
    {
      type: 'chart',
      chart: 'top15',
      title:
        'Raio-X de Oportunidades: Top 15 Contas de Maior Esforço · ' +
        AR_PERIOD.label +
        ' (Usuária: Gabriely Silva)',
      footLegends: [
        { cls: 'ar-leg--deal', label: 'DEAL' },
        { cls: 'ar-leg--contact', label: 'CONTACT' }
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
      title: 'Produtividade Mês',
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
      type: 'table',
      title: 'Metas',
      badge: 'GABRIELY (full time)',
      note: 'Referência: ' + AR_PERIOD.label + ' · metas do ciclo seguinte',
      columns: ['INDICADOR', 'TOTAL MÊS', 'MÉDIAS'],
      rows: [
        ['ATIVIDADES CONCLUÍDAS', '1520', '80/dia'],
        ['ATIV. CONC. COM ATRASO', '40%', '40%'],
        ['LIGAÇÕES ATENDIDAS', '380', '20/dia'],
        ['AGENDAMENTOS', '28', '1,5/dia'],
        ['REUNIÕES REALIZADAS (70%)', '19', '1,1/dia'],
        ['QUALIDADE DAS REUNIÕES', '90%', '90%'],
        ['VENDAS GERADAS (20%)', '3', '0,2/dia']
      ]
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
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--' +
      kind +
      ' ar-panel">' +
      '<div class="ar-panel-bg" style="background-image:url(\'' +
      bg +
      '\')" aria-hidden="true"></div>' +
      '<div class="ar-panel-veil" aria-hidden="true"></div>' +
      '<div class="ar-panel-body">' +
      '<header class="ar-panel-head">' +
      '<div class="ar-panel-head-text">' +
      '<p class="ar-panel-kicker">Melvin · AR' +
      (period ? ' · ' + esc(period) : '') +
      '</p>' +
      '<h3 class="ar-panel-title">' +
      esc(s.title) +
      '</h3>' +
      (s.note
        ? '<p class="ar-panel-note">' + esc(s.note) + '</p>'
        : s.lead
          ? '<p class="ar-panel-note">' + esc(s.lead) + '</p>'
          : '') +
      '</div>' +
      (s.badge ? '<span class="ar-panel-badge">' + esc(s.badge) + '</span>' : '') +
      '</header>' +
      '<div class="ar-panel-content">' +
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

  function renderMatrix(s) {
    var cols = s.columns || [];
    var colCount = cols.length;
    var head =
      '<div class="ar-mx-head" style="--cols:' +
      colCount +
      '">' +
      '<div class="ar-mx-corner"><span>Indicador</span></div>' +
      cols
        .map(function (c, i) {
          return (
            '<div class="ar-mx-month" style="--i:' +
            i +
            '"><span class="ar-mx-month-abbr">' +
            esc(String(c).slice(0, 3).toUpperCase()) +
            '</span><span class="ar-mx-month-name">' +
            esc(c) +
            '</span></div>'
          );
        })
        .join('') +
      '</div>';
    var body = (s.rows || [])
      .map(function (row, ri) {
        var vals = row.values || [];
        var tones = row.tones || [];
        var cells = '';
        for (var ci = 0; ci < colCount; ci++) {
          var v = vals[ci] == null ? '' : String(vals[ci]);
          var empty = !v.trim();
          var tone = tones[ci] || '';
          var cls =
            'ar-mx-cell' +
            (empty ? ' is-empty' : ' is-filled') +
            (tone === 'ok' ? ' is-ok' : '') +
            (tone === 'bad' ? ' is-bad' : '') +
            (tone === 'warn' ? ' is-warn' : '');
          cells +=
            '<div class="' +
            cls +
            '" style="--i:' +
            ci +
            '">' +
            (empty ? '<span class="ar-mx-ghost" aria-hidden="true"></span>' : esc(v)) +
            '</div>';
        }
        return (
          '<div class="ar-mx-row" style="--cols:' +
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
      '<div class="ar-mx">' +
      head +
      '<div class="ar-mx-body">' +
      body +
      '</div></div>';
    return arPanelShell('matrix', s, inner);
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
    var chartTitle =
      s.chart === 'sla'
        ? 'SLA e tendência mensal'
        : s.chart === 'top15'
          ? 'Top 15 contas de maior esforço'
          : s.title;
    var inner =
      (legends
        ? '<div class="ar-chart-legend" aria-hidden="true">' + legends + '</div>'
        : '') +
      '<div class="ar-chart-frame" id="' +
      frameId +
      '"></div>' +
      foot;
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
