(function () {
    /** Cliente, contato, login, WhatsApp, ICP, observações, motivo do churn */
    var ROWS = [
        ["NOVO NORDISK", "Lazaro", "LDQM@novonordisk.com", "38 99209-5409", "Sim", "Não estão usando o sistema. Já tinha um fluxo baixo de utilização e já tem um tempo que não estão encerrando as OS. Última OS encerrada em 26/09/2024.", ""],
        ["ECOVASO", "Gabrielly", "pcm@ecovaso.com.br", "(19) 99628-1533", "Não", "No último mês o fluxo caiu bastante. Última corretiva gerada dia 17/09, última OS encerrada dia 23/08, sem programação e SS recentes, mas ainda assim pendentes. Disse que pararam de usar o sistema, porém disse que o motivo é interno.", "Provavelmente corte de custo. Só disse que não era problema com o sistema."],
        ["DURLI", "Paulo", "", "+55 41 9229-8304", "Sim", "Não geraram SSs no último mês, nem OSs corretivas. Encerraram apenas uma preventiva e só estão utilizando a programação automática (sem encerrar as OSs).", ""],
        ["ENGEFORTE", "Eduardo Mattos", "eduardo.mattos@engeforteengenharia.com.br", "31 97166-8474", "Não", "Está com um fluxo médio de OSs, sem usar programação e sem SS recente. Pediram cancelamento, devido troca de sistema para um que atenda melhor frota, vai para Engeman. Mesmo assim recentemente estão usando o sistema da mesma forma.", "Disse que precisava de um sistema mais voltado para frota. Foi para Engeman."],
        ["CORREDOR - CLI", "Jonas / Paulo", "jonas.castro@cli-br.com / pgalvao@cli-br.com", "98 99232-9662 / 11 91561-2117", "Sim", "Somente 1 SS aberta e nenhuma corretiva gerada. Usam a programação, mas apenas OSs automáticas.", ""],
        ["TOTAL ENGENHARIA E MANUTENÇÃO", "Lucas", "total.eng.manut@gmail.com", "68 99909-6623", "Não", "Empresa recente, praticamente não utilizam o sistema. Não fizeram treinamento.", ""],
        ["INSIBRAS - INDÚSTRIA SIDERÚRGICA BRASIL LTDA", "Fábio e Icaro", "manutencao@insibras.com.br / compras@insibras.com.br", "37 9925-1043", "Não", "", ""],
        ["FRANBOM", "Matheus / João", "pcm@franbom.com.br / franbomgerenciamanutecao@gmail.com", "33 9875-2417 / 33 99998-4718", "Sim", "Estão com bom fluxo de OS, com baixa programação, boa geração de SS recentes, mas a melhorar a saída.", "Novo gerente disse que a saída foi porque não utilizavam o sistema no máximo e não tinham tempo para usar nem treinar. Agora o foco é ajustar a execução."],
        ["FOREST PAPER", "Clovis / Ricardo / Denis", "clovis.alves@forestpaper.com.br / jose.ribeiro@forest.ind.br / denis.pardo@revita.ind.br", "+55 42 9151-0131 / 19 98984-9559 / 42 9909-2002", "Sim", "Telêmaco ainda estão organizando, mas não começaram a usar. Mairiporã: baixo fluxo de OSs. Unidade de celulose: bom fluxo de OS. Programação pode melhorar, baixo fluxo de SS. Dados técnicos de forma geral a preencher. Em treinamento.", "Estavam bloqueados desde novembro de 2024 por falta de pagamento. Por não resolver, o contrato foi cancelado em março de 2025 e passado para o jurídico."],
        ["TRES IRMAOS INDUSTRIA E COMERCIO DE PAES LTDA", "Alcemar", "alcemar.tresirmaos@gmail.com", "21 98532-6611", "Não", "", ""],
        ["LM WIND POWER DO BRASIL S.A.", "Rodolfo / Ediel", "rodolfo.cabral@ge.com / Ediel.dasilva@lmwindpower.com", "81 8269-1440 / 81 9510-4457", "Sim", "Não estão usando o sistema desde março/2025. Fecharam a planta.", "Empresa fechou as operações no Brasil."],
        ["GTEX BRASIL", "Cleber / Eduardo", "cleber.venancio@gtexbrasil.com.br / eduardo.ferrari@gtexbrasil.com.br", "11 98807-7811 / 11 95083-3278", "Não", "Estão com bom fluxo de OSs e SS. Pode melhorar programação e saída de SS.", "Não consegui contato com o cliente. Tentamos várias vezes, por vários meios, para entender o motivo. Pedido veio da equipe comercial. Eduardo, PCM, saiu da empresa menos de um mês antes do pedido de cancelamento. Fabrício descobriu que trocaram para a Tractian. Segundo o Cleber, o pessoal estava tendo dificuldades com o Melvin. Porém nunca relataram nada e usavam o sistema muito bem."],
        ["VIAÇÃO ANDRADE (VIAÇÃO VERDE)", "Fernando", "manutencao@viacaoandrade.com.br", "34 9986-8744", "Não", "Seguem da mesma forma, com fluxo bom de OS e SS, porém muita SS pendente. Programação ok, mas pode melhorar. A preencher dados técnicos.", "Troca para um sistema mais completo, contemplando compras e demais itens. Vão deixar de usar 3 sistemas para usar um mais focado em frotas, gerando menos custo (FrotaSaaS)."],
        ["JASSY", "Nailton / Raphael", "nailton.santana@jassy.ag / raphael.cabral@jassy.ag", "64 9228-0068 / 64 9241-3966", "Não", "Pediram cancelamento na segunda, dia 14/07, para trocar de sistema. Última OS encerrada dia 02/06. Demais fluxos mais lentos desde o meio de junho.", ""],
        ["REAL CAFÉ GRUPO TRISTÃO", "Leandro Benincá", "leandro.beninca@realcafe.com.br", "+55 27 99751-5500", "Sim", "Empresa com sensores. Fez downgrade recentemente.", ""],
        ["BRASFRUT-FRUTOS DO BRASIL LTDA", "Carliane / Jaiza", "c.alberto@brasfrut.com.br", "75 98149-2475 / 75 2101-5536", "Sim", "Segue da mesma forma, somente registrando as OSs. Ainda com poucos planos criados, porém inativos, sem SS recentes e ainda sem programação.", ""],
        ["RMP / RP3 EMPREENDIMENTOS (DOMINO'S)", "Jorge", "jorge.silva@dominos.com.br", "11 96538-9761", "Não", "Não estão utilizando o sistema. Nenhuma SS aberta e OS encerrada no último mês. Jorge saiu da empresa e, segundo o Abner, a fábrica fechou.", ""],
        ["GRUPO AYSU", "Jean", "industrial@grupoaysu.com.br", "+55 66 9639-1969", "Sim", "Projeto Senai MT. Onboarding presencial para o dia 23/06/2025.", ""],
        ["TECHNIPFMC", "Frederico", "frederico.nascimento@technipfmc.com", "+55 21 99707-6714", "Sim", "POC de sensores embarcados no navio Coral do Atlântico, em implementação.", ""],
        ["JH TINTURARIA E ESTAMPARIA", "Luiz Fernando", "manutencao@jhtinturaria.com.br", "47 9788-3518", "Não", "Estão com bastante volume de SS e OS corretiva, mas não estão criando OSs preventivas. Não utilizam a programação.", ""],
        ["CYSY MINERAÇÃO LTDA (COQUE SUL)", "Gilberto", "gilberto_silvano@hotmail.com", "48 9927-1926", "Sim", "Segue com o mesmo fluxo. Melhorou um pouco o encerramento das preventivas automáticas, voltou a usar SS e teve apenas 1 corretiva no último mês (10/06). Está usando agora apenas a unidade CYSY (F01). Coque Sul cancelou o plano.", ""],
        ["KAMYLUS MALHAS LTDA", "Jeferson", "danilo.w@kamylus.com.br", "47 98888-0601", "Sim", "Cliente formalizou churn no e-mail de renovação devido ao reajuste de preço. Estratégia de aumentar MRR abaixo de 500/mês.", ""],
        ["BACIO DI LATTIO", "Renato / Caio", "Renato.fontana@bdil.com.br / caio.roque@bdil.com.br", "11 97304-6362 / 11 94347-1928", "Sim", "Treinamento foi finalizado. Estão utilizando bem o sistema.", ""],
        ["KOALA", "Alejandro / Isabelle", "alejandro@koalasystem.com.br / isabelle.vieira@genti.net.br", "71 98165-5818 / 71 9266-0888", "Não", "Baixo fluxo de OS, mas após a saída da Hanna ainda estão usando. Programação pode melhorar, pouca SS recente, a preencher alguns dados técnicos.", "Cancelado porque não encontraram pessoal para PCM. Passou várias pessoas que não atenderam as expectativas deles."],
        ["HUMANITY ENGENHARIA (HJB)", "Waldecir / Hugo", "manutencao.hjb@indsh.org.br / diretor@humanityengenharia.com", "91 98412-4965 / 91 8101-8941", "Não", "Segue com um bom fluxo de OS corretivas e SS. Programação baixa. Pode melhorar o preenchimento de preventivas. Várias SS em aberto e falta preenchimento em alguns dados técnicos. Estamos em processo de churn.", "Cancelou porque, ao comprar algumas válvulas, ganharam acesso a um sistema de forma gratuita, e esse sistema vai atender os processos deles."],
        ["SODRUGESTVO (ALIANÇA AGRÍCOLA)", "Bruno", "b.zerbinati@aliancaagricola.com.br", "34 8852-5406 / 16 99773-8531", "Sim", "Segue da mesma forma, com bom fluxo de OS e SS, pouca programação e pode melhorar a saída de SS.", "Cancelou devido ao encerramento das atividades da empresa no Brasil."],
        ["FM PNEUS LTDA 1 - MARAVILHA", "Arthur / Richard", "manutencao@fmpneus.com.br / manutencao1@fmpneus.com.br", "49 99173-2153 / 49 99176-3181", "Sim", "Mantém a mesma coisa. Não estão usando o sistema. Última OS encerrada em 24/07/2025. Não respondem mensagem de WhatsApp. Enviado e-mail para os contatos do Omie.", ""],
        ["KELCO INDUSTRIAL PRODUTOS ANIMAIS LTDA", "Willer", "wnribeiro@bentonit.com.br", "18 99781-1250", "Sim", "Segue com ótimo fluxo de utilização. Estão usando bem todos os recursos, bom encerramento e poucas OS em backlog.", ""],
        ["MFG AGROPECUÁRIA (MINEIROS - GO)", "Leiliane", "leiliane.lima@mfgagropecuaria.com.br", "55 64 9969-8076", "Sim", "Estão com bom fluxo de abertura e encerramento de OS manual, porém estão com baixo fluxo de utilização de preventivas automáticas e não estão usando SS e programação.", ""],
        ["MFG AGROPECUÁRIA (CAMPO NOVO DO PARECIS - MT)", "Ivan Silva (Coordenador) / Paloma (Key user)", "ivan.silva@mfgagropecuaria.com.br / paloma.tavares@mfgagropecuaria.com", "45 9112-4329 (Paloma)", "Sim", "Finalizado o treinamento recentemente e, em geral, estão indo muito bem com a utilização do sistema. Estão iniciando aos poucos os planos de manutenção, mas já estão abrindo SS e OS manual, e estão iniciando a utilização da programação semanal.", ""],
        ["MFG AGROPECUÁRIA (CAMPO VERDE - MT)", "Maria Isabel (Coordenadora)", "maria.bammesberger@mfgagropecuaria.com.br", "", "Sim", "Finalizado o treinamento recentemente e, em geral, estão indo muito bem com a utilização do sistema. Estão iniciando aos poucos os planos de manutenção, mas já estão abrindo SS e OS manual, e estão iniciando a utilização da programação semanal.", ""],
        ["MFG AGROPECUÁRIA (PEREIRA BARRETO - SP)", "Daniela (Coordenadora) / Luiz Reis (Key user)", "daniela.finger@mfgagropecuaria.com.br / luiz.reis@mfgagropecuaria.com.br", "12 99680-8367 (Luiz)", "Sim", "Finalizado recentemente o treinamento e ainda estão em fase de implementação. Não começaram a usar o sistema.", ""],
        ["CASUL (COOPERATIVA AGROPECUÁRIA DE JUNQUEIRÓPOLIS)", "Cristiano", "Cristiano.silva@casul.com.br", "18 99143-8692", "Sim", "Praticamente não estão usando. O key user da unidade saiu e, aparentemente, ainda não foi colocada ninguém no lugar para utilizar o Melvin.", ""],
        ["AGRO JACAREZINHO", "Bruno", "bruno.moura@agrojacarezinho.com.br", "65 9987-0660", "Sim", "", ""],
        ["WANDERCLEY NASCIMENTO DA SILVA (COSANPA)", "David / Wanderley", "david.maciel@cosanpa.pa.gov.br / gestor.manutencao.pcm@hotmail.com", "91 8361-9381", "Não", "Estão utilizando muito pouco o sistema. Última OS criada há mais de 20 dias. Última SS criada há 2 meses.", ""],
        ["ACREP SA", "João Tati", "jtati@acrepsa.ao", "+244 937 941 808", "Sim", "Cliente não está mais usando o sistema. Disse que não ia renovar. Estamos tentando negociar para reverter.", "Não renovaram devido a reestruturação interna e opção por um sistema mais barato e local."],
        ["LOCNORTH LOCAÇÕES E SERVIÇOS", "Gedi e Magno", "gedifialho@locnorth.com.br / magno.ricardo@locnorth.com.br", "94 9975-0619", "Não", "Cliente usa mais OS manual. Tem um bom fluxo de encerramento, apesar de serem poucas OS (devido ao segmento prestador de serviços), mas sempre mantendo atualizado. Ainda não está usando SS nem programação. Tem alguns planos cadastrados, mas ainda não iniciou a utilização.", ""],
        ["GABCO", "Edson", "Edson.ferreira@gabco.com.br", "11 97630-9290", "Sim", "Continua do mesmo jeito (19/12). Não estão fazendo o treinamento. Fizeram apenas a reunião 01 e sumiram. Tentei agendar várias vezes a reunião para continuar o treinamento, sem sucesso. Teve alguns meses em que dois colaboradores estavam de férias, em julho e agosto. Disseram que iam agendar quando o pessoal voltasse, mas até hoje não consegui. De lá para cá venho fazendo contato e algumas vezes respondem que vão ver e depois retornam. Último contato dia 10/10, do Kleiton: solicitou o agendamento, mandei o link, porém ele não retornou. Enviada mensagem novamente em 19/12 e ele ainda não respondeu.", "Cliente não utilizou o sistema desde que contratou. Fez apenas 2 reuniões e cadastrou ativos. Segundo informações, quando contrataram o software era uma exigência do cliente deles (LAFEPE), a qual eles iriam prestar serviços. Depois que entrou, não deram continuidade. Fiz diversas tentativas de contato para treinamentos e reuniões e eles nunca retornavam. Às vezes respondiam dizendo que iam ver uma data e depois sumiam. Outras vezes só visualizavam e não respondiam. Tentei WhatsApp, ligação e e-mail. Apenas no e-mail de renovação sinalizaram que não iriam mais seguir e solicitaram o cancelamento. Cliente não é ICP (prestador de serviços) e não tinha time de PCM."],
        ["NASA IND IMP E EXP DE MANUFATURADOS EIRELI", "Joice", "compras1@nasa.ind.br", "47 9778-0107", "Sim", "Baixa utilização, mas usam. Geram SS, encerram OSs manuais, mas não utilizam preventivas.", ""],
        ["MIRANDA AGROFLORESTAL", "Pedro", "grupomirandasf@gmail.com", "38 99900-9009", "Não", "Ainda não começaram a usar o sistema. Fizeram a renovação recentemente e pediram uma reciclagem de treinamento. Estavam aguardando o Pedro retornar das férias para agendar. Mensagem enviada, aguardando o retorno do cliente.", "Cliente não era ICP. Não estava usando o sistema e estava em atraso de pagamento das faturas. Já havia feito uma primeira negociação, porém não cumpriram o acordo. Por decisão do financeiro Melvin, optou-se pelo cancelamento do contrato."],
        ["DBL BEBIDAS", "Luelson", "luelsonfrazao@psiu.ind.br", "98 98701-0361", "Sim", "Cliente está com bloqueio temporário para regularização da renovação contratual Melvin desde o dia 10/11.", "Encerramento de contrato por parte da Melvin, devido a pendência de pagamento. Empresa em processo de recuperação judicial (está no jurídico)."],
        ["INDUSTRIA DE MOVEIS 3 IRMAOS SOCIEDADE ANONIMA", "Dyovan", "dyovan@tresirmaos.net", "47 9644-4891", "Sim", "Continua com ótimo fluxo de encerramento. Usa muito preventivas, SS, corretivas e programação. Usam todos os recursos.", "Encerramento de contrato por parte da Melvin, devido a pendência de pagamento. Empresa em processo de recuperação judicial (está no jurídico)."],
        ["HIDROHARD", "Fabiano", "fabiano@hidrohard.com.br", "(51) 99873-3492", "Não", "Estão com bom fluxo de OS e SS, sem programação, mas pretendem usar. A preencher alguns dados técnicos.", "Disseram que estão trocando o segmento de serviço para somente assistência técnica, parando com os contratos de manutenção."],
        ["MOVEIS PEROBA", "Otavio / Maxwell", "otavio@moveisperoba.com.br / controleindustrial@moveisperoba.com.br", "27 99973-3953 / 27 99803-3787", "Sim", "Segue com ótimo fluxo de OSs e SS. Pode melhorar preventivas. Programação está ok, mas pode melhorar. Ainda há dados técnicos a preencher.", "Foi solicitada a não renovação do contrato porque não têm pessoas específicas para usar o sistema, nem verba para contratar, e ainda têm vários outros pontos para melhorar na manutenção. Em ligação para entender melhor, esses pontos foram reforçados."],
        ["MILLROLL", "", "mwilliam@millroll.com.br", "+55 31 9477-7463", "Não", "Implementação.", ""],
        ["FLAMINGO PAPEIS", "Fabiano", "fabiano.campos@sistemaflamingo.com.br", "", "Sim", "Não estão utilizando o sistema.", ""],
        ["METRION - SOLUCOES SUSTENTAVEIS DE INTELIGENCIA E GOVERNANCA EMPRESARIAL LTDA", "Luis", "luis.catarino@metrion.com.br / philipe.gabillaud@metrion.com.br", "(67) 9976-1990", "", "Ótima utilização no geral. Fecharam upgrade de filiais recentemente.", ""],
        ["VIA PACK BRASIL", "Edson", "ti@viapackbrasil.com.br", "6 98116-7091", "Sim", "Cliente não usou praticamente nada do sistema. Só cadastrou ativos e materiais e solicitou o cancelamento no dia 19/12.", ""]
    ];

    function norm(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function parts(value) {
        return String(value || "")
            .split(/\s*\/\s*/)
            .map(function (part) { return part.trim(); })
            .filter(Boolean);
    }

    function esc(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function stack(value, kind) {
        var list = parts(value);
        if (!list.length) return '<span class="cli-empty-cell">—</span>';
        return list.map(function (item) {
            if (kind === "mail" && item.indexOf("@") !== -1 && item.indexOf(" ") === -1) {
                return '<a href="mailto:' + esc(item) + '">' + esc(item) + "</a>";
            }
            if (kind === "tel") {
                var digits = item.replace(/[^\d+]/g, "");
                if (digits.length >= 8) return '<a href="tel:' + esc(digits) + '">' + esc(item) + "</a>";
            }
            return "<span>" + esc(item) + "</span>";
        }).join("");
    }

    function icpClass(value) {
        if (value === "Sim") return "cli-icp cli-icp--sim";
        if (value === "Não") return "cli-icp cli-icp--nao";
        return "cli-icp cli-icp--empty";
    }

    function note(value) {
        var text = String(value || "").trim();
        if (!text) return '<span class="cli-empty-cell">—</span>';
        return '<p class="cli-note">' + esc(text) + "</p>";
    }

    function render(query) {
        var body = document.getElementById("churnBody");
        var count = document.getElementById("churnCount");
        var empty = document.getElementById("churnEmpty");
        if (!body) return;
        var q = norm(query);
        var html = "";
        var shown = 0;
        ROWS.forEach(function (row, index) {
            var hay = norm(row[0] + " " + row[1] + " " + row[5] + " " + row[6]);
            if (q && hay.indexOf(q) === -1) return;
            shown += 1;
            html += "<tr>" +
                '<td class="cli-num">' + (index + 1) + "</td>" +
                '<td class="cli-name">' + esc(row[0]) + "</td>" +
                "<td>" + stack(row[1]) + "</td>" +
                "<td>" + stack(row[2], "mail") + "</td>" +
                "<td>" + stack(row[3], "tel") + "</td>" +
                '<td><span class="' + icpClass(row[4]) + '">' + esc(row[4] || "—") + "</span></td>" +
                "<td>" + note(row[5]) + "</td>" +
                "<td>" + note(row[6]) + "</td>" +
                "</tr>";
        });
        body.innerHTML = html;
        if (count) {
            count.textContent = q
                ? shown + " de " + ROWS.length + " clientes"
                : ROWS.length + " clientes";
        }
        if (empty) empty.hidden = shown !== 0;
    }

    function boot() {
        var input = document.getElementById("churnSearch");
        if (!input) return;
        render("");
        input.addEventListener("input", function () { render(input.value); });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
