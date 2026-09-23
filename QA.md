# Verificação — 21/09/2026

- Oito testes de domínio passaram: fuso horário, datas inválidas, segunda-feira, domingo, horários passados, campos obrigatórios e codificação de mensagem.
- Sintaxe dos módulos e do servidor local validada com Node.js.
- Navegador Chromium integrado: larguras 320, 390, 768, 1024 e 1440 px sem overflow horizontal.
- Menu móvel abriu e fechou por Escape. Carrossel e filtros removidos; hero exibe uma única imagem com animação de quatro segundos e regra para movimento reduzido.
- Formulário exibiu os quatro erros esperados quando vazio; bloqueou segunda-feira e ofereceu 34 horários em uma terça-feira futura. Teste confirma mensagem sem telefone e sem valores undefined.
- Nenhum erro de console observado durante a validação desta versão.
- Capturas desktop e móvel revisadas visualmente. Fotos reais de comida têm proveniência em assets/sources.json; imagem do ambiente está identificada como gerada por IA.
- Formatação Prettier verificada. Detector Impeccable: quatro avisos; dois se referem ao lettering STEAKHOUSE de 10 px e dois são falsos positivos de padding nas seções que usam contêiner interno.

Limites: não foi enviada mensagem real nem efetuada reserva; não houve publicação. Safari e Firefox não foram executados. Movimento reduzido foi conferido no CSS, sem emulação do sistema operacional.
