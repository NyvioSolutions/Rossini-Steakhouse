# Verificação — identidade do Instagram, Nossa história e Prêmios — 25/09/2026

- Dez testes de reservation.mjs passaram: fuso de São Luís, segunda fechada, domingo e feriados sem reserva (inclui Sexta-feira da Paixão calculada), grupos a partir de 9 pessoas, horários encerrados no dia, observações limitadas a 300 caracteres e mensagem no modelo da casa para o WhatsApp 55 98 8131-0790.
- Sintaxe de script.js, motion.js, reservation.mjs e preview.cjs validada com Node.js.
- Checagem estática do HTML: IDs únicos, âncoras e referências ARIA com destino, arquivos de imagem existentes, links externos com rel, imagens com alt e dimensões, um único h1 e JSON-LD válido.
- Capturas de página inteira via DevTools Protocol (Edge headless) em 1440, 1000, 820, 390 e 375 px: sem rolagem horizontal; menu recolhido abaixo de 1024 px; linha do tempo em 6, 3 e 1 coluna; barra fixa do celular com Ligar, Como chegar e Reservar em uma linha.
- Teste de interação no navegador (375 px): menu abre, fecha com Esc; domingo e segunda mostram erro e bloqueiam horários; terça oferece 34 horários (11h15 a 22h45); envio vazio aponta os erros e foca o nome; envio válido gera o link do WhatsApp (abertura interceptada, nenhuma mensagem enviada).
- A incorporação do Google Maps responde 200, sem bloqueio de iframe, e aponta para "Rossini Steakhouse - Galeria Mall, Av. dos Holandeses, 1". As capturas headless não pintam iframes de outro domínio; conferir o mapa num navegador comum.

Pendências para a casa confirmar antes de publicar: regra de reservas (grupos acima de 8, sem domingo e feriados), textos da linha do tempo (2003, Barriga Verde em 2008) e uso da foto da família. Nenhuma mensagem foi enviada e o site não foi publicado.
