/**
 * AR · Análises de Resultados — 17 slides (Melvin)
 * Renders into #arDeckViewport and drives deck navigation.
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

  window.AR_DECK_SLIDES = [
    {
      type: 'cover',
      title: 'Análises de Resultados',
      subtitle: 'AR · Melvin'
    },
    {
      type: 'bullets',
      title: 'Objetivos',
      items: [
        'Analisar a evolução da produção',
        'Avaliar crescimento trimensal',
        'Identificar gargalos',
        'Planificar melhorias',
        'Definir papéis'
      ]
    },
    {
      type: 'section',
      kicker: 'Trimestre',
      title: 'Produtividade',
      subtitle: 'SET · OUT · NOV · 2025'
    },
    {
      type: 'table',
      title: 'Produtividade Mês',
      badge: 'GABRIELY',
      columns: [
        'INDICADOR',
        'META Novembro',
        'Setembro (22 dias)',
        'Outubro (23 dias)',
        'Novembro (19 dias)'
      ],
      rows: [
        ['ATIVIDADES CONCLUÍDAS', '1520', '3277', '2554', '954'],
        ['ATIV. CONCLUÍDAS COM ATRASO', '40%', '22,2%', '22,4%', '26,3%'],
        ['LIGAÇÕES ATENDIDAS', '380', '637 [1895 · 33,6%]', '237 [1330 · 17,8%]', '79 [510 · 15,5%]'],
        ['AGENDAMENTOS [Out/Inb]', '44', '47', '36', '19 [2+17]'],
        ['REUNIÕES REALIZADAS (70%)', '30', '34', '24', '14 [1+13]'],
        ['QUALIDADE DAS REUNIÕES', '90%', '47,1%', '16,6%', '53,8%'],
        ['VENDAS GERADAS (20%)', '5', '0', '0', '3']
      ]
    },
    {
      type: 'section',
      title: 'Estatísticas'
    },
    {
      type: 'table',
      title: 'Produtividade Mês',
      badge: 'TOTAL',
      columns: [
        'INDICADOR',
        'META Novembro',
        'Setembro (22 dias)',
        'Outubro (23 dias)',
        'Novembro (19 dias)'
      ],
      rows: [
        ['ATIVIDADES CONCLUÍDAS', '1520', '2343', '3301', '954'],
        ['ATIV. CONCLUÍDAS COM ATRASO', '40%', '24,5%', '22,1%', '26,3%'],
        ['LIGAÇÕES ATENDIDAS', '380', '1728 [3177]', '731 [2100]', '79 [510 · 15,5%]'],
        ['AGENDAMENTOS', '44', '53', '39', '32'],
        ['REUNIÕES REALIZADAS (70%)', '30', '34', '38', '23'],
        ['QUALIDADE DAS REUNIÕES', '90%', '74,2%', '42,1%', '43,4%'],
        ['VENDAS (Inb+Out+CS) (20%)', '5', '2', '0', '4 [3+0+1]']
      ]
    },
    {
      type: 'table',
      title: 'Taxa de Conversão',
      badge: 'INBOUND',
      columns: ['INDICADOR', 'Setembro', 'Outubro', 'Novembro', 'MELVIN'],
      rows: [
        ['Etapa 1 » Etapa 2', '68,9%', '50,8%', '58,7%', '70%'],
        ['Etapa 2 » Nutrição', '12,8%', '11,7%', '17,4%', '55%'],
        ['Nutrição » Reunião Agendada', '92,7%', '81,8%', '85,0%', '50%'],
        ['Reunião Agendada » Reunião Realizada', '74,5%', '69,4%', '76,5%', '70%'],
        ['Reunião Realizada » Venda', '0%', '0%', '15,4%', '20%'],
        ['Cadastrados » DESCARTADOS', '129%', '85,2%', '145%', '50%']
      ]
    },
    {
      type: 'table',
      title: 'Taxa de Conversão',
      badge: 'OUTBOUND',
      columns: ['INDICADOR', 'Setembro', 'Outubro', 'Novembro', 'BENCH'],
      rows: [
        ['Etapa 1 » Etapa 2', '—', '52,1%', '61,1%', '70%'],
        ['Etapa 2 » Nutrição', '—', '14,2%', '72,7%', '50%'],
        ['Nutrição » Reunião Agendada', '—', '0%', '25,0%', '20%'],
        ['Reunião Agendada » Reunião Realizada', '—', '0%', '50%', '70%'],
        ['Reunião Realizada » Venda', '—', '0%', '0%', '10%'],
        ['Cadastrados » DESCARTADOS', '—', '34,1%', '72,2%', '50%']
      ]
    },
    {
      type: 'section',
      title: 'Gargalos'
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
        '60% no último trimestre.'
      ]
    },
    {
      type: 'section',
      title: 'Melhorias'
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
      title: 'Sprint Dezembro'
    },
    {
      type: 'table',
      title: 'Metas Dezembro',
      badge: 'GABRIELY (full time)',
      note: 'Tempo: 19 dias úteis · Análise dos dados: 01/01/2026',
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
      title: 'Reta Final 2025',
      lines: [
        'O ano não acabou.',
        'A sua melhor venda começa agora.',
        'Foco total no resultado.'
      ],
      pills: ['100% COMPROMISSO', 'VITÓRIA'],
      quote: 'O ano só acaba quando termina.',
      author: 'Jailson Martins'
    },
    {
      type: 'credits',
      title: 'Acompanhamento Estratégico',
      producedBy: 'Jailson Martins',
      role: 'Especialista em Estratégias Comerciais',
      forWho: 'Melvin'
    },
    {
      type: 'sign',
      kicker: 'AR · Análise de resultado',
      lead: 'Relatório elaborado por',
      name: 'Jailson Martins',
      role: 'Engenheiro de Receita · JM7',
      meta: 'Melvin · RevOps Book'
    }
  ];

  function renderCover(s) {
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--cover">' +
      '<span class="melvin-logo-lockup ar-cover-logo" role="img" aria-label="Melvin"></span>' +
      '<h3 class="ar-cover-title">' + esc(s.title) + '</h3>' +
      '<p class="ar-cover-sub">' + esc(s.subtitle) + '</p>' +
      '</div>'
    );
  }

  function renderBullets(s) {
    var items = (s.items || [])
      .map(function (it) {
        return '<li>' + esc(it) + '</li>';
      })
      .join('');
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--bullets">' +
      '<h3 class="ar-slide-heading">' + esc(s.title) + '</h3>' +
      '<ul class="ar-bullets">' + items + '</ul>' +
      '</div>'
    );
  }

  function renderSection(s) {
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--section">' +
      (s.kicker ? '<p class="ar-section-kicker">' + esc(s.kicker) + '</p>' : '') +
      '<h3 class="ar-section-title">' + esc(s.title) + '</h3>' +
      (s.subtitle ? '<p class="ar-section-sub">' + esc(s.subtitle) + '</p>' : '') +
      '</div>'
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
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--table">' +
      '<div class="ar-table-head">' +
      '<h3 class="ar-slide-heading">' +
      esc(s.title) +
      '</h3>' +
      (s.badge ? '<span class="ar-table-badge">' + esc(s.badge) + '</span>' : '') +
      '</div>' +
      (s.note ? '<p class="ar-table-note">' + esc(s.note) + '</p>' : '') +
      '<div class="ar-table-wrap"><table class="ar-data-table">' +
      thead +
      tbody +
      '</table></div>' +
      '</div>'
    );
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
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--split">' +
      '<h3 class="ar-slide-heading">' +
      esc(s.title) +
      '</h3>' +
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
      '</ul></div>' +
      '</div></div>'
    );
  }

  function renderPlan(s) {
    var cards = (s.cards || [])
      .map(function (c) {
        var meta = [];
        if (c.owner) meta.push('<span><em>Resp.</em> ' + esc(c.owner) + '</span>');
        if (c.support) meta.push('<span><em>Apoio</em> ' + esc(c.support) + '</span>');
        if (c.action) meta.push('<span><em>Ação</em> ' + esc(c.action) + '</span>');
        return (
          '<article class="ar-plan-card">' +
          '<h4>' +
          esc(c.title) +
          '</h4>' +
          (meta.length ? '<div class="ar-plan-meta">' + meta.join('') + '</div>' : '') +
          '</article>'
        );
      })
      .join('');
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--plan">' +
      '<h3 class="ar-slide-heading">' +
      esc(s.title) +
      '</h3>' +
      (s.intro ? '<p class="ar-plan-intro">' + esc(s.intro) + '</p>' : '') +
      '<div class="ar-plan-grid">' +
      cards +
      '</div></div>'
    );
  }

  function renderCta(s) {
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
      '<div class="ar-slide-canvas ar-slide-canvas--cta">' +
      '<h3 class="ar-cta-title">' +
      esc(s.title) +
      '</h3>' +
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
      '</div>'
    );
  }

  function renderCredits(s) {
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--credits">' +
      '<h3 class="ar-credits-title">' +
      esc(s.title) +
      '</h3>' +
      '<p class="ar-credits-by">Produzido por</p>' +
      '<p class="ar-credits-name">' +
      esc(s.producedBy) +
      '</p>' +
      '<p class="ar-credits-role">' +
      esc(s.role) +
      '</p>' +
      '<div class="ar-credits-rule" aria-hidden="true"></div>' +
      '<p class="ar-credits-for">Para ' +
      esc(s.forWho) +
      '</p>' +
      '</div>'
    );
  }

  function renderSign(s) {
    return (
      '<div class="ar-slide-canvas ar-slide-canvas--sign">' +
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
      '<div class="ar-sign-rule" aria-hidden="true"></div>' +
      '<p class="ar-sign-meta">' +
      esc(s.meta) +
      '</p>' +
      '</div>'
    );
  }

  function renderSlide(s, i) {
    var inner = '';
    switch (s.type) {
      case 'cover':
        inner = renderCover(s);
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
      case 'split':
        inner = renderSplit(s);
        break;
      case 'plan':
        inner = renderPlan(s);
        break;
      case 'cta':
        inner = renderCta(s);
        break;
      case 'credits':
        inner = renderCredits(s);
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

    go(0);
    try {
      root.focus({ preventScroll: true });
    } catch (e) {}
  };
})();
