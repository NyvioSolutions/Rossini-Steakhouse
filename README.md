# Rossini Steakhouse — nova apresentação

Site em HTML, CSS e JavaScript puro, sem dependências de produção ou etapa de build.

## Visualizar

Abra `index.html` no navegador. No VS Code, você também pode usar a extensão Live Server.

Com Node.js instalado, execute `node preview.cjs` nesta pasta e acesse http://127.0.0.1:4174.

## O que mudou

- Identidade em carvão, creme e dourado suave, com títulos editoriais e mais espaço entre seções.
- Abertura estática com fotografia e prioridade para a reserva.
- Horários e endereço próximos da abertura.
- Seleção de sabores com categorias e indicação de fotografias ilustrativas.
- Formulário com orientação explícita para continuar no WhatsApp.
- Acesso fixo à reserva e à localização no celular; data e horário em linhas separadas nas telas menores.
- Foco visível, navegação por teclado, mensagens de validação e respeito à preferência por movimento reduzido.

## Manutenção

- `index.html`: conteúdo, horários, endereço e estrutura.
- `style.css`: identidade visual e regras responsivas.
- `script.js`: imagens, categorias, navegação e formulário.
- `favicon.svg`: ícone da página.
- `preview.cjs`: servidor local opcional; não é necessário na hospedagem estática.

As fotos são ilustrativas, carregadas do Unsplash. As fontes vêm do Google Fonts, e o mapa é incorporado do Google Maps. Esses recursos exigem conexão com a internet.

O formulário prepara uma solicitação no WhatsApp. Nenhuma reserva é confirmada automaticamente: a equipe do restaurante confirma a disponibilidade. Horários, endereço e telefone foram preservados do projeto fornecido.

Esta versão está em uma pasta separada; os arquivos originais da Área de Trabalho não foram modificados. Para hospedagem estática, publique `index.html`, `style.css`, `script.js` e `favicon.svg` juntos.
