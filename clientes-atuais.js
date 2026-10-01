(function () {
    /** Login, produto, cliente, contato, e-mail, WhatsApp, ICP */
    var ROWS = [
        ["admin@adinor.com", "SOFTWARE", "ADINOR INDUSTRIA E COMERCIO DE ADITIVOS LTDA", "Ramos", "ramos.somar.correia@hotmail.com", "", ""],
        ["admin@aguafortesaneamentoambiental.com", "SOFTWARE", "AGUA FORTE SANEAMENTO AMBIENTAL LTDA", "Wagner / Luciano", "... / luciano@aguafortesaneamento.com.br", "11 97441-1622 / ...", "Não"],
        ["admin@aguadiamanteazul.com", "SOFTWARE", "Água Mineral Diamante Azul", "Pedro", "edro.schobiner@aguadiamanteazul.com.br", "81 9631-7777", "Não"],
        ["admin@akko.com", "SOFTWARE", "AKKO", "Andre", "andre.guerra@akko.com.br", "27 99943-8807", "Não"],
        ["admin@alfama.com", "SOFTWARE", "ALFAMA ALIMENTOS (CASCAVEL-PR)", "Yoselin / Daniel", "yoselin.mavares@alfama.com.br / daniel.stasiak@alfama.com.br", "45984120894 / (45) 9.9810-0337", "Não"],
        ["admin@alfama.com", "SOFTWARE", "ALFAMA ALIMENTOS (LOUVEIRA-SP)", "Anderson / Laerte", "anderson.royo@alfama.com.br / laerte.jorge@alfama.com.br", "19 98764-2798", "Não"],
        ["admin@algartech.com", "SOFTWARE", "ALGAR TECH", "Juliana", "julianarcda@algartech.com", "34 9802-7740", "Sim"],
        ["admin@aliancamet.com", "SOFTWARE", "ALIANCA METALURGICA S.A.", "Francisco", "francisco.chagas@aliancametalurgica.com.br", "11 99917-4821", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Aruja", "William", "william.lobo@alsco.com.br", "11 95783-0087", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL BA", "Hanyel", "manutsv@alsco.com.br", "71 98652-7938", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL BH", "Ademir / Júlio", "ademir.silva@alsco.com.br / rotasbh@alsco.com.br", "31 98861-1504 / 31 9764-5981", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL CF", "Antonio", "manutcf@slsco.com.br", "11 99735-9783", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Curitiba", "Alceu", "alceu.silveira@alsco.com.br", "41 9819-6662", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Manaus", "Cristhiano", "cristhiano.alcantara@alsco.com.br", "92 8180-1015", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Recife", "Flavio", "manutre@alsco.com.br", "81 8864-3758", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL RJ", "Thiago", "Manutencaorj@alsco.com.br", "21 99653-9277", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL RS", "Rodrigo", "rodrigo.pedroso@alsco.com.br", "51 8498-4000", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Santo Amaro", "Jose Almir / André (Auditor) / Danilo (Auditor)", "jose.almir@alsco.com.br / andre.cruvinel@alsco.com.br / danilo.andrade@alsco.com.br", "11 94467-6340 / 11 99824-0623 / 11 99825-0239", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Vila Maria", "Fabio / Sidnei", "fabio.carvalho@alsco.com.br / sidnei.souza@alsco.com.br", "11 98683-4027 / 11 98085-8543", "Sim"],
        ["admin@alscotoalheirobrasilltda.com", "SOFTWARE", "ALSCO TOALHEIRO BRASIL Vitoria (Espírito Santo)", "Joilton", "manutvt@alsco.com.br", "27 99998-8696", "Sim"],
        ["admin@legat.com", "SOFTWARE", "ASTRA SOLAR", "Fabio", "fabio.magalhaes@astrasolar.com.b", "34 9183-5407", "Não"],
        ["admin@AmendoasdoBrasil.com", "SOFTWARE", "AMENDOAS DO BRASIL", "Francisco", "franciscoalves@amendoasdobrasil.com.br", "85 9693-9672", "Sim"],
        ["admin@andrealannutricaoanimal.com", "SOFTWARE", "ANDREALAN INDUSTRIA DE NUTRICAO ANIMAL LTDA", "Allan", "allan@andrealan.com.br", "55 48 9911-6228", "Sim"],
        ["admin@apolo.com", "SOFTWARE", "APOLO TUBULARS S/A", "Abner", "abner.claro@apolotubulars.com.br", "12 99640-6085", "Sim"],
        ["admin@avplasembalagens.com", "SOFTWARE", "AVPLAS EMBALAGENS", "Igor", "producao2@avplas.com", "47 9215-6172", "Sim"],
        ["admin@azevedosoaresindustriaecomerciodeargamassa.com", "SOFTWARE", "AZEVEDO SOARES IND. E COM. DE ARGAMASSAS LTDA", "João", "industrial@azevedosoares.ind.br / fabrica@azevedosoares.ind.br", "82 9647-2188", "Não"],
        ["admin@betaplastic.com", "SOFTWARE", "BETA PLASTIC EIRELI (Plásticos PB)", "Idinei", "manutencao@plasticospb.com.br", "46 99978-5708", "Não"],
        ["admin@grupoberger.com", "SOFTWARE", "BERGER - OVOS SANTA MARIA", "Lorenzzo", "lorenzzo.berger@gmail.com", "27 99777-7147", "Sim"],
        ["admin@brasalimentindcomcarnes.com", "SOFTWARE", "BERNA (BRASALIMENT INDUSTRIA E COMERCIO DE CARNES LTDA)", "Victor", "manutencao3@berna.com.br", "19 99962-1843", "Sim"],
        ["admin@biobasealimentacaoanimal.com", "SOFTWARE", "BIOBASE ALIMENTAÇÃO ANIMAL LTDA", "Cleiton", "", "55 49 9832-7439", "Sim"],
        ["admin@biometanosul.com", "AMBOS", "BIOMETANO - MINAS DO LEÃO (CRVR)", "Leandro", "lsverssute@crvr.com.br", "51 98027-3385", "Sim"],
        ["admin@biometanosulsaoleopoldo.com", "SOFTWARE", "BIOMETANO - SÃO LEOPOLDO (CRVR)", "Carlos Eduardo (PCM) / Wanderson", "ccosta@biometanors.com.br / wbueno@biometanors.com.br", "51 99259-1535 / 11 97434-7134", "Sim"],
        ["Admin@bioquima.com", "SOFTWARE", "BIOQUIMA", "Uelington / Joice", "pcm02@bioquima.com / Pcm01@bioquima.com", "37 9931-1370 / 37 9814-5824", "Não"],
        ["admin@biotermicasa.com", "SOFTWARE", "BIOTERMICA ENERGIA S.A. (CRVR)", "Leonardo", "llenz@crvr.com.br", "(51) 99969-7709", "Sim"],
        ["admin@boibrasil.com", "SOFTWARE", "INDUSTRIA E COMERCIO DE CARNES E DERIVADOS BOI BRASIL LTDA", "Eldnei", "manutencao@boibrasil.ind.br", "63 8437-4222", "Sim"],
        ["admin@boibrasilaraguaina.com", "SOFTWARE", "INDUSTRIA E COMERCIO DE CARNES E DERIVADOS BOI BRASIL 2 LTDA - ARAGUAÍNA", "Leonardo", "pcm.araguaina@boibrasil.ind.br", "+55 63 99211-0239", "Sim"],
        ["admin@borgwarner.com", "SOFTWARE", "BORGWARNER - PHINIA", "Matheus / Elias", "msalsi@phinia.com / epranger@phinia.com", "47 8891-6316 / 47 8831-9045", "Sim"],
        ["admin@brasfrut.com", "SOFTWARE", "BRASFRUT-FRUTOS DO BRASIL LTDA", "Carliane / Jaiza", "c.alberto@brasfrut.com.br", "75 98149-2475 / 75 2101-5536", "Sim"],
        ["admin@caincoequipparapanificacaoltda.com", "SOFTWARE", "CAINCO EQUIP PARA PANIFICAÇÃO LTDA", "Roberto", "roberto.takehara@cainco.com.br", "14 98167-4930", "Sim"],
        ["admin@cahpsa.com", "SOFTWARE", "Cahpsa (Corporacion de Alimentos e Higiene del Paraguay S.A.)", "Cristiano / Blanca", "cristiano.gomezdasilva@cahpsa.com / blanca.recalde@cahpsa.com", "16 99141-8125", "Sim"],
        ["admin@caltrevo.com", "SOFTWARE", "CAL TREVO INDUSTRIAL", "Obernando", "obernando@caltrevobrasil.com.br", "79 99924-2416", "Sim"],
        ["admin@supermercadosguanabara.com", "SOFTWARE", "CASAS GUANABARA", "Alex / Igor", "alexsuares@supermercadosguanabara.com.br / igorsousa@supermercadosguanabara.com.br", "21 97122-7569 / 21 99823-1644", "Sim"],
        ["admin@cooperativaagropecuariadeparapua.com", "SOFTWARE", "CASUL (COOPERATIVA AGROPECUÁRIA DE PARAPUÃ)", "Bruno / Roberlei", "bruno@casul.com.br", "18 99143-8692", "Sim"],
        ["admin@cbl.com", "SOFTWARE", "CBL COMPANHIA BRASILEIRA DE LOGÍSTICA S/A", "Douglas", "douglas.placedino@cblterminais.com.br", "35 8873-4790", "Não"],
        ["admin@cercenasa.com", "SOFTWARE", "CERCENA S/A INDÚSTRIA METALÚRGICA", "Mauricio / Matheus", "mauricio.s@cercena.com.br / matheus.r@cercena.com.br", "54 9213-9779 / 54 9613-7353", "Sim"],
        ["admin@imperadordasindustriasdebebidasdobrasilltda.com", "SOFTWARE", "CERVEJARIA CAMBE - IMPERADOR DAS INDUSTRIA DE BEBIDAS DO BRASIL (IIBB) - BRASSER", "André / Daniel", "manutencao@cervejariacambe.com.br / manutencao@iibb.com.br", "43 9803-9110 / 43 9927-9118", "Sim"],
        ["admin@cicoplast.com", "SOFTWARE", "CICOPLAST", "Danilo", "manutencao@cicoplast.com.br", "(19) 98133-0634", "Não"],
        ["admin@cimolmoveis.com", "SOFTWARE", "CIMOL - COMERCIO E INDUSTRIA DE MOVEIS LTDA", "Wanderley", "wanderleyandrade321@gmail.com", "27 99859-3131", "Não"],
        ["admin@cipatex.com", "SOFTWARE", "CIPATEX IMPREGNADORA DE PAPEIS E TECIDOS LTDA", "Caio / Renan", "caio.magrini@cipatex.com.br / renan.oliveira@cipatex.com.br", "15 99689-2135 / 15 99735-1614", "Sim"],
        ["admin@cnscentraldenucleossiliciosos.com", "SOFTWARE", "CNS - CENTRAL DE NÚCLEOS SILICIOSOS", "Daniel", "daniel.santos@cnscores.com", "55 35 99222-7439", ""],
        ["admin@companhiadebebidasbrasilcobeb.com", "SOFTWARE", "COBEB - COMPANHIA DE BEBIDAS BRASIL", "Leonardo", "Leonardo.soares@cobeb.com.br", "37 9194-6259", "Não"],
        ["admin@cobresul.com", "SOFTWARE", "COBRESUL", "Fábio Bernardes / Fábio Augusto", "fabio.bernardes@cobresul.com.br / fabio.augusto@cobresul.com.br", "47 9917-6531 / 11 99180-9367", "Não"],
        ["admin@sindiinvestimentos.com", "SOFTWARE", "CONDOMINIO DE GALPOES SINDI INVESTIMENTOS", "Joaquim / Fernanda", "jmoreira@consultoriafundo.com.br / operacoes@cgsindinvest.com.br", "31 8778-2052", ""],
        ["admin@condor.com", "SOFTWARE", "CONDOR S/A INDÚSTRIA QUÍMICA", "Renan", "renan.batista@condornaoletal.com.br", "(21) 97565-6800", ""],
        ["admin@connancomercionacionaldenutricaoanimalltda.com", "SOFTWARE", "Connan", "Diogo / Bruno", "pcm@connan.com.br / bruno.marson@connan.com.br", "15 99694-3730 / 15 98129-7910", "Sim"],
        ["admin@maris.com", "SOFTWARE", "COMPESCAL COMERCIO DE PESCADO ARACATIENSE LTDA (Maris)", "João Paulo", "joaopaulocompescal@gmail.com", "88 9951-0642", "Sim"],
        ["admin@cooperativaagropecuariacentroserrana.com", "SOFTWARE", "NATER COOP (Cooperativa Agropecuaria Centro Serrana)", "Lucas / Gilliard", "lucas.biral@nater.coop.br / gilliard.camuzzi@nater.coop.br", "27 99859-7303 / 27 99640-6600", "Sim"],
        ["admin@coplatex.com", "SOFTWARE", "Coplatex Indústria e Comércio de Tecidos S.A.", "Saulo Sousa", "saulo.sousa@protectagroup.com.br", "11 97035-2540", ""],
        ["admin@cottonbaby.com", "SOFTWARE", "COTTONBABY INDUSTRIA E COMERCIO LTDA.", "Angelo", "angelo.botelho@cottonbaby.com.br", "48 9931-1135", "Sim"],
        ["admin@crvrmanutencao.com", "SOFTWARE", "CRVR MINAS DO LEÃO", "Thais / Monique", "talmeida@crvr.com.br / mopereira@crvr.com.br", "51 9712-4809 / 51 8912-9511", "Sim"],
        ["admin@crvrglobal.com", "SOFTWARE", "CRVR SANTA MARIA", "Diani Leal / Juliana Feijó", "zleal@crvr.com.br / jhermes@crvr.com.br", "53 9134-3151 / 55 9707-9235", "Sim"],
        ["admin@crvrglobal.com", "SOFTWARE", "CRVR GIRUÁ", "Gabriel / Karolina", "gkuhn@crvr.com.br / kpvieira@crvr.com.br", "55 99702-7031 / 55 99676-1820", "Sim"],
        ["admin@crvrglobal.com", "SOFTWARE", "CRVR CAPELA DE SANTANA", "Marcos Vinicius / Daniela Souza (Estagiária)", "mvoliveira@essencis.com.br / dssouza@essencis.com.br", "51 9895-2198 / 51 9905-9088", "Sim"],
        ["admin@crvrglobal.com", "SOFTWARE", "CRVR VICTOR GRAEFF", "Alexandre / Welerson", "casilva@crvr.com.br / warosa@crvr.com.br", "54 9957-7744 / 54 9249-1733", "Sim"],
        ["admin@crvrglobal.com", "SOFTWARE", "CRVR SÃO LEOPOLDO", "Júlia da Silveira / Igor Bombardelli", "juliasilveira@crvr.com.br / igorbaratieri@crvr.com.br", "51 9520-0914 / 51 9858-2730", "Sim"],
        ["admin@dfernandesengenharia.com", "SOFTWARE", "D FERNANDES ENGENHARIA", "Diego", "diego@grupodfernandes.com.br", "+55 27 99829-6022", "Não"],
        ["admin@dacolonia.com", "SOFTWARE", "DACOLONIA", "Valdeir / Ronaldo / Gabriel", "valdeir.nascimento@dacolonia.com.br / ronaldo.meregalli@dacolonia.com.br / gabriel.lopes@dacolonia.com.br", "51 9690-0761 / 51 9838-5835 / 51 99838-5835", "Sim"],
        ["admin@delpengenharia.com", "SOFTWARE", "DELP ENGENHARIA", "Edmar", "edmar.camilo@delp.com.br", "31 98235-6488", "Sim"],
        ["admin@sopremaltda.com", "SOFTWARE", "DENVER IMPERMEABILIZANTE (SOPREMA)", "Daniel", "", "11 95842-0090", "Não"],
        ["admin@dpvprodutosquimicos.com", "SOFTWARE", "DPV PRODUTOS QUÍMICOS", "Danilo", "danilo.damaceno@dpv.com.br", "(19) 99678-1799", "Sim"],
        ["admin@ecomet.com", "SOFTWARE", "ECOMET", "Oseias", "oseias.soares@ecomet.com.br", "51 8124-7107", "Não"],
        ["admin@edentecindustriaecomercioltda.com", "SOFTWARE", "EDENTEC", "Robson", "robson@edentec.com.br", "15 99611-6577", "Sim"],
        ["admin@ekwdobrasil.com", "SOFTWARE", "EKW DO BRASIL - PRODUTOS REFRATARIOS LTDA", "Bruno", "bruno@ekwdobrasil.com.br", "47 9123-6973", "Sim"],
        ["admin@grupopaxelvin.com", "SOFTWARE", "ELVIN LUBRIFICANTES INDUSTRIA E COMERCIO LTDA", "Erick", "eric.asbahr@paxlub.com.br", "19 99274-6327", "Sim"],
        ["admin@embasul.com", "SOFTWARE", "EMBASUL - INDUSTRIA E COMERCIO DE EMBALAGENS LTDA", "Fábio / Daigor", "gm@embasul.com.br / pcm@embasul.com.br", "51 8238-0123 / 51 9959-1807", "Sim"],
        ["admin@emibra.com", "SOFTWARE", "EMIBRA INDÚSTRIA E COMÉRCIO DE EMBALAGENS LTDA", "Nilson / Renato", "nilson.dutra@emibra.com.br / renato.figueiredo@emibra.com.br", "11 95245-0932 / 11 99760-2332", "Sim"],
        ["admin@engeman.com", "SOFTWARE", "ENGEMAN MANUTENCAO DE EQUIPAMENTOS COM E INDUSTRIA LTDA", "Hugo / Ana", "hugo.guimaraes@engeman.net / ana.junger@engeman.net", "51 8013-3992", "Sim"],
        ["admin@engemoldeengenharia.com", "SOFTWARE", "ENGEMOLDE ENGENHARIA, INDÚSTRIA E COMÉRCIO LTDA.", "Gabriel", "manutencao@engemolde.com.br", "21 97192-1198", ""],
        ["admin@engedelta.com", "SOFTWARE", "ENGEDELTA", "Luiz Gustavo", "manutencao@engedelta.com.br", "63 8502-4551", "Sim"],
        ["admin@farmotec.com", "SOFTWARE", "FARMOTEC", "Manuel", "logistica@farmotec.com.br", "38 99984-5009", "Não"],
        ["admin@fckpremoldados.com", "SOFTWARE", "FCK PREMOLDADOS LTDA", "Luan", "", "31 9782-3343", "Sim"],
        ["admin@fertgrow.com", "SOFTWARE", "FERTGROW S.A", "Itanel", "itanel.carvalho@fertgrow.com.br", "98 8601-2826", "Sim"],
        ["admin@fortindustriaecomerciodeembalagensltda.com", "SOFTWARE", "FORT INDUSTRIA E COMERCIO DE EMBALAGENS LTDA", "Mariane", "mariane.alves@fortpaletes.com.br", "15 99770-7752", "Sim"],
        ["admin@frigoalas.com", "SOFTWARE", "FRIGOALAS", "Guilherme (PCM) / Alisson (Gerente geral)", "guilhermeblessed26@gmail.com / pcp@frigoalas.com.br", "75 8868-4142 / 75 9871-4251", "Sim"],
        ["admin@laticiniosfriolack.com", "SOFTWARE", "FRIOLACK", "Cleomar PCM / Cleiton Gerente de Manutenção", "manutencao@friolack.com.br / supervisor.manutencao@friolack.com.br", "54 9930-6090", "Sim"],
        ["admin@fundicaofundifer.com", "SOFTWARE", "FUNDIFER", "Kaue", "manutencao@fundifer.com.br", "47 9270-6269", "Não"],
        ["admin@furgaoibipora.com", "SOFTWARE", "FURGAO IBIPORA", "Vinicius / Ivan", "Vinicius.mille@furgaoibipora.com.br / ivan.pires@furgaoibipora.com.br", "43 9909-4875 / 43 99809-0084", "Sim"],
        ["admin@grupogera.com", "SOFTWARE", "GERAR SERVICOS E ENGENHARIA", "Pedro / Felipe", "pedro.kemel@grupogera.com / felipe.teixeira@grupogera.com", "21 99755-1509 / 21 96752-1030", "Não"],
        ["admin@geocontrole.com", "SOFTWARE", "GEOCONTROLE", "Helder (Sondas) / Alecio (Frotas)", "heldergomes@geocontrole.com / logisticabr@geocontrole.com", "31 99942-0818 / 31 9866-0946", "Sim"],
        ["admin@geominas.com", "SOFTWARE", "GEOMINAS", "Magson / Julio", "magson.araujo@grupogeominas.com.br / julio.gabriel@grupogeominas.com.br", "94 9162-2744 / 94 8445-5417", "Não"],
        ["admin@aguagoya.com", "SOFTWARE", "GOYA", "Pablo / Lucas", "pablo.augusto@aguagoya.com.br / lucas.vieira@aguagoya.com.br", "64 9318-3229 / 64 9317-6964", "Não"],
        ["admin@brogota.com", "SOFTWARE", "GRAFICA E EDITORA BROGOTA LTDA", "Antonio", "manutencao2@brogota.com.br", "11 98609-4346", "Não"],
        ["admin@granaco.com", "SOFTWARE", "GRANAÇO", "Geovani", "geovani@granaco.com.br", "47 99790-0010", "Sim"],
        ["admin@guaraves1.com", "SOFTWARE", "GUARAVES (UNIDADE MONICA)", "Monica", "monica.matias@guaraves.com.br", "83 8655-4881", "Sim"],
        ["admin@guaravesguarabiraavesltda.com", "SOFTWARE", "GUARAVES GUARABIRA AVES LTDA (UNIDADE MARCOS)", "Marcos", "jose.sergio@guaraves.com.br", "83 99118-7348", "Sim"],
        ["admin@guamaambiental.com", "SOFTWARE", "GUAMA AMBIENTAL (GRUPO SOLVI/CRVR)", "Lucas / Bruno", "lfbrito@guamaambiental.com.br", "91 9167-1094", "Sim"],
        ["admin@guayaki.com", "AMBOS", "GUAYAKI YERBA MADRE BRASIL PRODUCAO E COMERCIO LTDA.", "Gilmar", "gilmar.lejambre@guayaki.com", "42 8434-5112", "Sim"],
        ["admin@grandeoeste.com", "AMBOS", "GRANDE OESTE", "Guilherme", "guilherme.luz@coopgrandeoeste.com.br", "35 9828-0538", "Sim"],
        ["admin@h2energy.com", "SOFTWARE", "H2ENERGY", "Marcel / Matheus", "marcel.lopes@h2energy.com.br / matheus.oliveira@h2energy.com.br", "11 91621-3927 / 11 91768-6360", "Não"],
        ["admin@hinodegroup.net", "SOFTWARE", "HINODE", "Sirlei", "sirlei.neves@grupohinode.com", "11 98968-5455", "Sim"],
        ["admin@humenergiasa.com", "SOFTWARE", "HUM ENERGIA", "Wagner", "wagner.souza@somoshum.com.br", "24 99985-8380", "Não"],
        ["admin@umisan.com", "AMBOS", "HYDROSOLOS LOCACOES LTDA", "Emerson / Bruno", "emerson.vicente@hydrosolos.com.br / bruno.menezes@umi.com.br", "27 99524-0424 / 27 99589-2570", "Não"],
        ["admin@ibarrefratarios.com", "SOFTWARE", "INDUSTRIAS BRASILEIRAS DE ARTIGOS REFRATARIOS - IBAR", "Eliabe", "eliabe.santos@ibar.com.br", "11 95937-7722", "Sim"],
        ["admin@imerysdobrasil.com", "SOFTWARE", "IMERYS", "Renato (Key User) / Edson (Gerente Geral)", "renato.barbosa@imerys.com / edson.siqueira@imerys.com", "19 99700-9042 / 19 99989-9858", "Sim"],
        ["admin@laticiniossilvianopolis.com", "SOFTWARE", "INDÚSTRIA DE LATICINIOS SILVIANOPÓLIS EIRELI (SULMINAS LATICÍNIOS)", "Maurilio", "manutencaosm@queijosulminas.com.br", "35 9704-8533", "Sim"],
        ["admin@industriaderacoesgolfinho.com", "SOFTWARE", "INDUSTRIA E COMERCIO DE RAÇÕES GOLFINHO LTDA", "Jonas", "jonasdomingues@racoesgolfinho.com.br / antonielcosta@racoesgolfinho.com.br", "88 9493-0506", "Sim"],
        ["admin@inroda.com", "SOFTWARE", "INRODA MAQUINAS AGRICOLAS", "Renan", "renan.ribeiro@inroda.com.br", "14 99774-5264", "Sim"],
        ["admin@intermaritima.com", "SOFTWARE", "INTERMARITIMA (Vinicius)", "Junilson / David", "Junilson.machado@intermaritima.com.br / David.santos@intermaritima.com.br", "71 8881-4665 / 71 8192-3625", "Sim"],
        ["admin@intersal.com", "SOFTWARE", "INTERSAL (Vinicius)", "Hugo / Marcos / Vitor", "hugo.vieira@intersal.com.br / marcos.freitas@intersal.com.br / Vitor.coelho@intersal.com.br", "84 9655-7179 / 84 8607-6927 / 84 9619-0179", "Sim"],
        ["admin@inventuspower.com", "SOFTWARE", "INVENTUS POWER", "Taiany / Apoliano", "taiany.maciel@inventuspower.com / apoliano.oliveira@inventuspower.com", "92 9174-5867 (Taiany)", "Sim"],
        ["admin@jcb.com", "SOFTWARE", "JCB", "Maria Eduarda / Vinicius Magoga", "maria.santos@jcb.com / vinicius.magoga@jcb.com", "15 97405-9363 / 15 99738-0302", "Sim"],
        ["admin@johnsonelectric.com", "SOFTWARE", "JOHNSON ELETRIC", "Daniel / Luciano / Klayton", "daniel.gomes@johnsonelectric.com / Luciano.herculano@johnsonelectric.com / Klayton.moreira@johnsonelectric.com", "11 95063-3792 / 11 99837-1962 / 11 96243-9982", "Sim"],
        ["admin@inroda.com", "SOFTWARE", "JUNCO", "Ezequiel", "manutencao@junco.com.br", "34 99199-8815", "Sim"],
        ["admin@kuhndobrasilsa.com", "SOFTWARE", "KUHN DO BRASIL", "Paulo", "paulo.oliveira@kuhn.com", "54 9912-0259", "Sim"],
        ["admin@lavitaalimentos.com", "SOFTWARE", "LA VITA ALIMENTOS", "Richard / Marcos / Rafael", "richard.silva@lavita.com.br / manutencao@lavita.com.br / msantana_lavita@hotmail.com / rafael.prado@lavita.com.br", "19 99976-7230 / 19 99839-4388 / 19 99763-6477", "Não"],
        ["admin@labovetprodutosveterinarios.com", "SOFTWARE", "LABOVET PRODUTOS VETERINARIOS LTDA", "Roquelando", "roquelando.nunes@labovet.com.br", "75 9121-0569", "Não"],
        ["admin@grupogera.com", "SOFTWARE", "LASERFLEX SOLUCOES PARA FLEXOGRAFIA", "Arthur", "manutencao@laserflex.com.br", "41 9922-7470", "Sim"],
        ["admin@lauerengenharia.com", "SOFTWARE", "LAUER ENGENHARIA MAQUINAS E SERVICOS LTDA", "Renan / Jean", "renan.vitor@csn.lauerengenharia.com.br / jean.neto@vr.lauerengenharia.com.br", "24 98148-1782 / 24 99913-1920", "Não"],
        ["admin@laticinioburitis.com", "SOFTWARE", "LATICINIOS BURITIS", "Jefferson (Gerente Manutenção) / Aniel (Supervisor Manutenção) / Marco (Auxiliar PCM)", "manutencao@laticiniosburitis.com.br / aniel@laticiniosburitis.com.br / pcm@laticiniosburitis.com.br", "11 94398-1045 (Jefferson) / 11 91181-8592 (Aniel) / 38 9730-0016 (Marco)", "Sim"],
        ["admin@lealferindustriaecomerciodeacos.com", "SOFTWARE", "LEALFER INDUSTRIA E COMERCIO DE ACO LTDA", "Juliana", "ass.manutencao@lealfer.com.br", "11 93744-1854", "Sim"],
        ["admin@trelac.com", "SOFTWARE", "LEITE UNIAO (TRELAC)", "Pricila", "", "45 99156-3972", "Não"],
        ["admin@lgflocacoeseservicosagricolaseireli.com", "SOFTWARE", "LGF LOCAÇÕES E SERVIÇOS AGRÍCOLAS", "Luigi", "luigigraciano@yahoo.com.br", "17 99726-7449", "Não"],
        ["admin@madesp.com", "SOFTWARE", "MADESP IND. E COMERCIO DE MADEIRAS LTDA.", "Wagner e Gabriel", "industrial@madesp.ind.br / pcp2@madesp.ind.br", "47 9216-0950", "Não"],
        ["admin@margirius.com", "SOFTWARE", "MAR GIRIUS CONTINENTAL INDUSTRIA DE CONT ELETRICOS LTDA", "Thadeu", "tgoncalves@margirius.com.br", "19 98203-6011", "Sim"],
        ["admin@marilianutri.com", "SOFTWARE", "MARILIA NUTRI", "Vanderson / Paulo", "pcm@marilianutri.com.br / paulo.pommerening@marilianutri.com.br / vandersonisaac10@gmail.com", "69 9322-7282 / 69 9366-9102", "Não"],
        ["admin@marnaprefabricados.com", "SOFTWARE", "MARNA", "John", "manutencao@marna.com.br", "41 8825-6699", "Não"],
        ["admin@matsuko.com", "SOFTWARE", "MATSUKO", "José Roberto", "jose.ferreira@matsuko.com", "15 99623-6888", "Não"],
        ["admin@maxinutrilaboratorionutraceuticoeireliepp.com", "SOFTWARE", "MAXINUTRI LABORATORIO NUTRACEUTICO - EIRELI - EPP", "Andrey", "mecanico@maxinutri.com.br / andrey@maxinutri", "43 99954-1068", "Não"],
        ["admin@metalcandeia.com", "SOFTWARE", "METALÚRGICA CANDEIAS", "Vanderlei", "vanderlei.rensch@metalcandeia.com.br", "55 9909-0061", "Sim"],
        ["admin@owensillinoisunidadedescalvado.com", "SOFTWARE", "MINERACAO DESCALVADO LIMITADA", "Ozeas / João", "ozeas.trambini@o-i.com / joao.guerra@o-i.com", "19 97157-7860 / 19 99133-3555", "Sim"],
        ["admin@multtemperacoat.com", "SOFTWARE", "MTC TRAT/MTC TOOLS", "João Paulo", "manutencao@mtctrat.com.br", "11 96151-5925", "Sim"],
        ["admin@multicel.com", "SOFTWARE", "MULTICEL PIGMENTOS INDUSTRIA E COMERCIO LTDA.", "Saulo Santos", "ssantos@multicel.com.br", "11 97482-8054", "Sim"],
        ["admin@m2industriadevidro.com", "SOFTWARE", "TTR VIDROS - M2 INDUSTRIA DE VIDROS (GRUPO MARQUES)", "Hendrika", "manutencao@ttrvidros.com.br", "55 24 99208-9609", "Sim"],
        ["admin@m2industriadevidro.com", "SOFTWARE", "SAINT GERMAIN VIDROS (GRUPO MARQUES)", "Tharcyo", "pcm@blindexrio.com.br", "21 98235-5615", "Sim"],
        ["admin@newjetsolucoesindustriais.com", "SOFTWARE", "NEWJET SERVIÇOS INDUSTRIAIS - EIRELI", "Gabriele", "planejamento@newjet.net.br", "91 99819-6812", "Não"],
        ["admin@oceanamineraismarinhos.com", "SOFTWARE", "OCEANA MINERALS", "Luis / Claudio", "luis.ribeiro@oceanaminerals.com / claudio.araujo@oceanaminerals.com", "98 8215-0303 / 98 8479-0364", "Sim"],
        ["admin@oxiquimicaagrociencia.com", "SOFTWARE", "Oxiquimica Agrociencia Ltda", "Lucas / Felipe", "lucas.medeiros@oxiquimica.com.br / felipehenrique.festa@oxiquimica.com.br", "16 99992-8880 / 16 99738-5826", "Sim"],
        ["admin@patriani.com", "SOFTWARE", "PATRIANI", "Renato", "renato.garcia@construtorapatriani.com.br", "11 99894-9803", "Não"],
        ["admin@alpasulindustrial.com", "SOFTWARE", "PLASTIBEN (ALPA SUL INDUSTRIAL)", "Jackson", "jackson@alpaindustrial.com.br", "4799796478", "Não"],
        ["admin@mbplasticos.com", "SOFTWARE", "PLASTICOS MB", "Brunno / José Roberto / Kelvin", "tic01@plasticosmb.com.br / Gind@plasticosmb.com.br / aprendiz01@plasticosmb.com.br", "11 95128-3822 / 19 99657-1995 / 19 99701-0806", "Sim"],
        ["admin@polenghi.com", "SOFTWARE", "POLENGHI INDÚSTRIAS ALIMENTÍCIAS LTDA", "Leopoldo", "leopoldo.rabelo@polenghi.com.br", "34 8825-0372", "Sim"],
        ["admin@portital.com", "SOFTWARE", "PORTITAL", "Roberto / João", "Rovluz@live.com / joaosantana949033@gmail.com", "11 99808-4511 / 11 98751-3046", "Não"],
        ["admin@portobrasilceramica.com", "SOFTWARE", "PORTO BRASIL CERAMICA", "Otávio", "mecanica@portobrasilceramica.com.br", "19 97113-6471", "Sim"],
        ["admin@premobras.com", "SOFTWARE", "PREMOBRAS PREMOLDADOS BRASILEIROS LTDA", "Junior", "Junior@premobras.com.br", "28 99955-7826", "Sim"],
        ["admin@pritamfrutexportacaoltda.com", "SOFTWARE", "PRITAM FRUIT", "Fernando / Wellington Passos", "fernandomarins@pritamfrut.com / compras@pritamfrut.com", "74 9112-2000 / 74 8102-4465", "Sim"],
        ["admin@proteinortealimentossa.com", "SOFTWARE", "PROTEINORTE ALIMENTOS SA", "Kevin / Joander", "kevin.roberto@proteinorte.com.br / pcm.mnt@proteinorte.com.br", "44 9990-6249 / 27 99903-5643", "Sim"],
        ["admin@protendit.com", "SOFTWARE", "PROTENDIT", "Charlison / Vittor", "charlison.carvalho@protendit.com.br / vittor.machado@protendit.com.br", "11 94611-0913 / 11 94611-0933", "Sim"],
        ["admin@pumalajesalveolares.com", "SOFTWARE", "PUMA LAJES ALVEOLARES", "Nilson / Renato", "alex@puma.com.br", "11 96593-3852", "Sim"],
        ["admin@qualittialimentos.com", "SOFTWARE", "QUALITTI ALIMENTOS (AGROINDUSTRIA DE ALIMENTOS AVESUI LTDA)", "Abel / Everson", "abel.lucas@qualitti.com.br / manutencao02@qualitti.com.br", "64 9336-5015 / 64 9320-8299", "Sim"],
        ["admin@reciaco.com", "SOFTWARE", "RECIACO INDUSTRIA DE TRANSFORMACAO DE ACO LTDA", "Davi", "davicoelhogrupocompal@gmail.com", "84 9207-4927", ""],
        ["admin@rexembalagens.com", "SOFTWARE", "REX EMBALAGENS", "Gabriele", "gabriele.zanatta@rexembalagens.com.br", "55 9976-7880", "Sim"],
        ["admin@romagnoleprodutoseletricossa.com (base nova atual) / admin@romagnole.com", "SOFTWARE", "ROMAGNOLE", "Renica", "renica@romagnole.com.br", "43 99196722", "Sim"],
        ["admin@sealocacoesemanutencao.com", "SOFTWARE", "S&A LOCAÇÕES E MANUTENÇÃO", "Jefferson", "jeffersondickel@hotmail.com", "66 99234-1715", ""],
        ["admin@sanovo.com", "SOFTWARE", "SANOVO", "Jesse", "jesse.oliveira@sanovo.com.br", "15 99669-1338 / 15 32383239 (ramal)", "Sim"],
        ["admin@schottflatglassdobrasil.com", "SOFTWARE", "SCHOTT FLAT GLASS DO BRASIL", "Fernando Freitas", "fernando.freitas@schott.com", "19 98363-6289", "Sim"],
        ["admin@smsistemasmodulares.com", "SOFTWARE", "S.M. SISTEMAS MODULARES LTDA", "Ulisses / Antonio", "ugarcia@sml.com.br / agoliveira@sml.com.br", "12 97406-8652 / 12 99727-0351", "Não"],
        ["admin@gruposamaria.com", "SOFTWARE", "SAMARIA UNIDADE DE BENEFICIAMENTO LTDA", "Jefferson", "jeferson.sa@potipora.com.br", "87 8144-6920", "Sim"],
        ["admin@sbr.com", "SOFTWARE", "SBR SOLUCOES EM BENEFICIAMENTO DE RESIDUOS E COMERCIO LTDA (AFZ)", "Eduardo", "assistmanutencao@afzengenharia.com.br", "11 97417-9528", "Sim"],
        ["admin@schwancosmeticsdobrasilltda.com", "SOFTWARE", "SCHWAN COSMETICS DO BRASIL LTDA", "Thiago", "thiago.arriello@schwancosmetics.com", "41 9153-7660", "Sim"],
        ["admin@metalurgicaskymsen.com", "SOFTWARE", "METALURGICA SKYMSEN LTDA", "Ivanilson", "ivanilson.souza@skymsen.com", "47 9273-5389", "Sim"],
        ["admin@skystonebrasil.com", "SOFTWARE", "SKYSTONE DO BRASIL LTDA", "André / João Vitor", "manutencao02@skystonebrasil.com.br / joao.vicente@skystonebrasil.com.br", "+55 27 99725-8539", "Não"],
        ["admin@smrcautomotivearg.com", "SOFTWARE", "SMRC FABRICACAO E COMERCIO DE PRODUTOS AUTOMOTIVOS (ARGENTINA) MOTHERSON", "Kevin", "kevinlihue.coronel@motherson.com", "54 9 11 3692-2125", "Sim"],
        ["admin@motherson.com", "SOFTWARE", "SMRC FABRICACAO E COMERCIO DE PRODUTOS AUTOMOTIVOS DO BRASIL LTDA MOTHERSON (GRAVATAI)", "Rafael Grizza", "Rafael.Grizza@motherson.com", "51 99646-6990", "Sim"],
        ["admin@mothersonguarulhos.com", "SOFTWARE", "SMRC FABRICACAO E COMERCIO DE PRODUTOS AUTOMOTIVOS DO BRASIL LTDA MOTHERSON (GUARULHOS)", "Luciano / Emerson", "Luciano.Queiroz@motherson.com / Emerson.Silva@motherson.com", "11 94284-4308 / 11 98651-4075", "Sim"],
        ["admin@mothersonvarzeapaulista.com", "SOFTWARE", "MOTHERSON (VARZEA PAULISTA - BALDI INDUSTRIA E COMERCIO LTDA", "Sidney", "sidney.souza@motherson.com", "11 91930-2071", "Sim"],
        ["admin@somaialimentos.com", "SOFTWARE", "SOMAI ALIMENTOS", "Gabriel", "gabriel.fagundes@somainordeste.com.br", "38 99744-0046", "Sim"],
        ["admin@suincofrigorifico.com", "SOFTWARE", "SUINCO - COOPERATIVA DE SUINOCULTORES LTDA", "Marcos / Fernanda / Elton", "marcosvinicius.tm@yahoo.com / fernanda.faria@suinco.com.br / elton.junior@suinco.com.br", "38 98817-8969 / 34 9665-6288", "Sim"],
        ["admin@supley.com", "SOFTWARE", "SUPLEY LABORATÓRIO DE ALIMENTOS E SUPLEMENTOS NUTRICIONAIS LTDA", "Rafael / Herik", "rafael.spinelli@supley.com.br / herik.baratella@supley.com.br", "16 99239-4482 / 16 99797-0231", "Sim"],
        ["admin@suincofrigorifico.com", "SOFTWARE", "SWEET FRUITS", "Daniela / Murilo (Coordenador)", "daniela.barros@sweetfruits.com.br / murilo.nascimento@sweetfruits.com.br", "74 8103-8787", "Sim"],
        ["admin@ta.com", "SOFTWARE", "T&A PRÉ FABRICADOS", "Robson e Eduardo", "manutencao.ba@tea.com.br / manutencao@tea.com.br", "71 98424-4463", "Sim"],
        ["admin@tamcolubrificantesederivados.com", "SOFTWARE", "TAMCO LUBRIFICANTES (GRUPO MOOVE)", "Jackson", "jackson.cunha@tamcolubrificantes.com.br", "19 99519-4554", "Sim"],
        ["admin@latamairlines.com", "SOFTWARE", "TAM LINHAS AEREAS S.A.", "Raul", "raul.penedo@latam.com", "16 99176-0626", "Sim"],
        ["admin@techplast.com", "SOFTWARE", "TECHPLAST INDUSTRIA E COMÉRCIO DE PLÁSTICOS LTDA", "Laura / Newton", "lauraandradesouza07@gmail.com / manutencaotampplast@gmail.com", "82 8842-7850", "Não"],
        ["admin@cpitegus.com", "SOFTWARE", "TEGUS", "Alex / João / Elida", "alex.mota@ymail.com / pcm.tegus@cpitegus.com.br / pcm.manutencao@cpitegus.com.br", "12 99621-1591 / 12 99118-0411 / 12 99177-1789", "Sim"],
        ["admin@teixeiratextil.com", "SOFTWARE", "TEIXEIRA TEXTIL INDUSTRIA E COMERCIO DE TECIDOS E", "Eduardo", "Eduardo.luz@teixeiratextil.com.br", "48 9907-1955", "Sim"],
        ["admin@tekniabrasil.com", "SOFTWARE", "TEKNIA BRASIL LTDA.", "Caio / Fabiano / Vinícius", "caio.silva@tekniagroup.com / fabiano.silva@tekniagroup.com / vinicius.pereira@tekniagroup.com", "11 97163-3420 / 12 99644-5218 / 12 98246-5242", "Sim"],
        ["admin@telasul.com.br", "SOFTWARE", "TELASUL INDUSTRIA DE MOVEIS S.A.", "Marcos", "marcos.taglietti@telasul.com.br", "54 3463-9465", "Não"],
        ["admin@termoverde.com", "SOFTWARE", "TERMOVERDE", "Jorge", "jhnascimento@termoverde.com.br", "71 8766-7493", ""],
        ["admin@tirolez.com", "SOFTWARE", "TIROLEZ / LEVITARE", "Cristiano / Roni / Lucas / Dercílio", "cristiano.pereira@tirolez.com.br / roniester.gontijo@tirolez.com.br / lucas.vieira@tirolez.com.br / dercilio.costa@tirolez.com.br", "34 98844-2755 / 16 99633-4126 / 17 99781-9574 / 17 99676-0913", "Sim"],
        ["admin@tstrimbrasilsa.com", "SOFTWARE", "TSTRIM / TSTECH", "Lucas", "lucas.lopes@tstech", "35 9921-4107", "Sim"],
        ["admin@tstrimbrasilsa.com", "SOFTWARE", "UNICOBA DA AMAZONIA", "Franciney / Monike", "franciney.felix@ucbsa.com.br / monike.garcia@ucbsa.com.br", "92 9109-6816 / 92 8451-4052", "Sim"],
        ["admin@unilin.com", "SOFTWARE", "UNILIN DO BRASIL REVESTIMENTOS LTDA.", "Mateus", "Mateus.DREVENIASKI@unilin.com.br", "41 9938-0239", "Não"],
        ["admin@universalchemical.com", "SOFTWARE", "UNIVERSAL CHEMICAL", "Icaro", "icaro.araujo@uchem.com.br", "15 98823-5216", "Sim"],
        ["admin@usibras.com", "SOFTWARE", "USIBRAS", "Fernando / Pedro", "fernando.penha@dunorte.net / pedro.rafael@dunorte.net", "85 8140-4495 / 84 98833-3478", "Sim"],
        ["admin@validsa.com", "SOFTWARE", "VALID SOLUÇÕES S A", "Wilden Coordenador - CARTÕES / Joyce PCM - CARTÕES / Alex Lider - GRÁFICA E ID / Stefani PCM - GRÁFICA E ID", "wilden.carneiro@valid.com / joyce.asilva@valid.com / alex.aquino@valid.com / sthephany.macedo@valid.com", "11 99797-7527 (Wilden) / 15 99814-3364 (Joyce) / 15 99770-2018 (Alex) / 11 99998-4828 (Sthephany)", "Sim"],
        ["admin@verdealagoas.com", "SOFTWARE", "VERDE ALAGOAS", "Carine / Junior", "Cpiress@verdealagoas.com.br / aalvesj@verdealagoas.com.br", "82 8231-0281 / 82 8230-9957", "Não"],
        ["admin@vienasiderurgicasa.com", "SOFTWARE", "VIENA SIDERURGICA S.A.", "Alex", "manutencao@vienasa.com.br", "99 9126-1934", "Sim"],
        ["admin@voestalpine.com", "SOFTWARE", "VOESTALPINE", "EVERTON", "Everton.Silva@voestalpine.com", "11 971653512", "Não"],
        ["admin@vpjalimentos.com", "SOFTWARE", "VPJ ALIMENTOS", "Carlos", "Carlossantosjcss@outlook.com / alex@vpjalimentos.com.br", "19 97143-7709", "Sim"],
        ["admin@wasiqueiraengenharia.com", "SOFTWARE", "WA SIQUEIRA ENGENHARIA", "Matheus", "matheus.wasiqueira@gmail.com", "21 97679-2335", "Sim"],
        ["admin@2eambiental.com", "SOFTWARE", "YVY RECICLAGEM", "Icaro / Igor", "lmargre@yvyreciclagem.com.br / igoncalves@yvyreciclagem.com.br", "11 99856-4610 / 11 97532-6038", "Sim"],
        ["admin@zaltana.com", "SOFTWARE", "ZALTANA INDÚSTRIA E COMÉRCIO DE ALIMENTOS S/A", "Chety", "pcm@zaltanapescados.com.br", "69 9323-2054", "Sim"],
        ["admin@Zelopack.com", "SOFTWARE", "ZELOPACK", "DIEGO", "manutencao@zelopack.com.br", "16 99651-8606", "Sim"],
        ["admin@jt.com", "SOFTWARE", "J&T (versão estudante/gratuito)", "Diego", "diego_ntg@hotmail.com", "11 97105-0219", "NA"],
        ["admin@lepanalimentos.com", "SOFTWARE", "LEPAN ALIMENTOS (versão estudante/gratuito)", "Maycon", "manutencao@lepanalimentos.com.br", "11 5843-6610 / 11 4779-4376", "NA"],
        ["admin@senaijuazeirodonorte.com", "SOFTWARE", "SENAI Juazeiro do Norte - Ceara (versão estudante/gratuito)", "Pedro", "pedro.costa@docente.senai-ce.org.br", "88 99782-8667", "NA"],
        ["admin@excellenceschool.com", "SOFTWARE", "Excellence School (versão estudante/gratuito)", "Edson", "edsonmalique@gmail.com", "", "NA"],
        ["admin@excellenceschool20252.com", "SOFTWARE", "Excellence School 2 (versão estudante/gratuito)", "Cristovão", "cristovaosumbane@gmail.com", "", "NA"],
        ["admin@goassetadmin.com / treinamento@goassets.com", "SOFTWARE", "PROJETO GO ASSESTS", "Weslle", "rochaweslle@gmail.com", "", "NA"]
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
        if (value === "NA") return "cli-icp cli-icp--na";
        return "cli-icp cli-icp--empty";
    }

    function render(query) {
        var body = document.getElementById("cliBody");
        var count = document.getElementById("cliCount");
        var empty = document.getElementById("cliEmpty");
        if (!body) return;
        var q = norm(query);
        var html = "";
        var shown = 0;
        ROWS.forEach(function (row, index) {
            if (q && norm(row[2]).indexOf(q) === -1) return;
            shown += 1;
            var produto = row[1] === "AMBOS" ? "cli-prod cli-prod--ambos" : "cli-prod";
            html += "<tr>" +
                '<td class="cli-num">' + (index + 1) + "</td>" +
                '<td class="cli-login">' + stack(row[0]) + "</td>" +
                '<td><span class="' + produto + '">' + esc(row[1]) + "</span></td>" +
                '<td class="cli-name">' + esc(row[2]) + "</td>" +
                "<td>" + stack(row[3]) + "</td>" +
                "<td>" + stack(row[4], "mail") + "</td>" +
                "<td>" + stack(row[5], "tel") + "</td>" +
                '<td><span class="' + icpClass(row[6]) + '">' + esc(row[6] || "—") + "</span></td>" +
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
        var input = document.getElementById("cliSearch");
        if (!input) return;
        render("");
        input.addEventListener("input", function () { render(input.value); });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();
