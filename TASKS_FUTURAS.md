# TASKS Futuras — MELVIN RevOps (REBUILD 7)

Documento de backlog para retomadas. Atualizado em **27/07/2026**.

---

## Páginas ocultas do menu (atalho por URL)

Estas páginas **não aparecem no menu lateral**, mas abrem se você digitar o hash na barra de endereços:

| Página | Atalho (barra de endereços) |
|---|---|
| **Plano de Ação** | `index.html#plano-acao` |
| **Arquivo GIM · Objeções (fonte)** | `index.html#gim-objecoes` |
| *(ex.) Central de Comando antiga* | conteúdo substituído pela landing `#home-dashboard` |

> **Removido em 02/09/2026:** páginas Stand-by · rotinas (`#presales-inbound`, `#presales-outbound`, `#rotina-closer`) — excluídas do Book. Menu interno renomeado para **RevOps Jailson** (Ativos + Entregues).

**Como usar:** abra o site e acrescente `#plano-acao` ao final da URL, ex.:

```
.../Melvin/index.html#plano-acao
```

O roteador SPA (`app.js`) continua reconhecendo o hash — só o item de menu foi removido.

---

## Landing atual (🏠)

- **ID:** `#home-dashboard`
- **Conteúdo:** Playbook Comercial MELVIN (hero + pills)
- **Default** ao abrir o site / botão 🏠

---

## Kits de Objeções Presales (ativos)

| Canal | ID | Nota |
|---|---|---|
| Inbound | `#matriz-objecoes-in` | Kit leve (SDR) — busca + filtros + fala pronta |
| Outbound | `#matriz-objecoes-out` | Kit pesado (BDR) — inclui Kill/Negociar |
| Arquivo GIM | `#gim-objecoes` | Fonte canônica (oculto do menu) |

---

## Gaps de conteúdo no documento-mor

| Prioridade | Item | ID / Local | Nota |
|---|---|---|---|
| P0 | Feedback de Call Outbound | `#feedback-reuniao-out` | Único `dot-pending` no menu. Espelhar `#feedback-reuniao-in` |
| P1 | Objeções Em construção (kits) | `#matriz-objecoes-out` | Suprimentos + Sensores (~stubs) |
| P2 | Glossário GIM | `#gim-glossario` | Página Em construção (fora do menu) |
| P2 | Produto M&A EAD — descrição | `#gim-produtos` | “Descrição pendente” |

---

## Go-live operacional

Ver **Plano de Ação** (`#plano-acao` via URL) Fases B–D:

- **B** Inbound: SLA &lt;15 min, Filtro SPN, D1–D15, réguas agenda
- **C** Outbound: Copilot → Bitrix, Tier 1, D1–D35, réguas Out
- **D** Governança: Lost obrigatório, Feedback Closer 2h, CS

---

## ROADMAP — Objeções colaborativas (futuro)

**Status:** adiado · retomar quando for prioridade  
**Objetivo:** Presales inserir novas objeções no kit In/Out para a equipe toda ler.

| Item | Detalhe |
|---|---|
| Por que não agora | Site estático (GitHub Pages) não grava dados compartilhados sozinho |
| Caminho recomendado | Google Sheets (ou Supabase) + formulário no kit + listagem dinâmica |
| Escopo mínimo | Modal “Nova objeção” · canal In/Out · fala pronta · tags · autenticação leve |
| Fora de escopo agora | localStorage-only (não compartilha entre pessoas) |

```
[ ] Definir backend (Sheets vs Supabase)
[ ] Modelar colunas da planilha / tabela
[ ] UI: botão + modal nos kits #matriz-objecoes-in / -out
[ ] Leitura das objeções novas + merge com cards fixos
[ ] Controle de quem pode escrever (auth / token)
```

---

## Ideias / melhorias futuras

- [ ] Reexibir Plano de Ação no menu Comando (se a operação pedir)
- [ ] Dashboard vivo com métricas Bitrix
- [ ] Completar Feedback Out + stubs de Objeções (Sensores/Negociação)
- [ ] Publicar `#gim-glossario` no menu GIM quando preenchido
- [ ] **Objeções colaborativas** (ver ROADMAP acima)

---

## Como reexibir o Plano de Ação no menu

```
[ ] Reinserir <a href="#plano-acao"> em Comando (sidebar)
[ ] Remover data-hidden-nav da section (opcional)
[ ] Atualizar este arquivo
```
