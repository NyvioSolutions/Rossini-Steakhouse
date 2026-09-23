# Rossini Steakhouse

Site estático em HTML, CSS e JavaScript. Hero com foto real de cortes e movimento sutil; rodízio a partir de R$ 105; formulário sem telefone.

## Abrir localmente

Com Node.js instalado, execute nesta pasta:

```sh
node preview.cjs
```

Abra http://127.0.0.1:4175. Os módulos precisam de HTTP; não abra o HTML por duplo clique. Não é necessário instalar dependências.

## Publicar

Envie index.html, style.css, script.js, reservation.mjs e assets para uma hospedagem estática HTTPS. Sirva .mjs como text/javascript. preview.cjs é somente uma prévia local. Google Fonts, Maps e os links de contato dependem de internet.

## Editar

- Conteúdo, preço e contatos: index.html.
- Tipografia, cores, animação e responsividade: style.css.
- Menu e formulário: script.js.
- Datas, horários e mensagem: reservation.mjs; manter horários coerentes com o HTML.
- Imagens reais de comida: assets/sources.json.
- Imagem provisória de ambiente: assets/ambiente-ilustrativo.webp. Veja as instruções e prompt em assets/ambiente-ilustrativo.md.

A imagem de ambiente é gerada por IA e identificada como ilustrativa. Não retrata a Rossini. O preço inicial foi informado pelo proprietário; condições variam. Endereço, telefone comercial e horários completos foram preservados do projeto recebido.

O formulário pede nome, data, horário e pessoas. Prepara a mensagem para o visitante enviar; a reserva só é válida após confirmação da equipe. Não armazena dados nem consulta disponibilidade de mesas.

## Validar

```sh
node --test tests/reservation.test.mjs
node --check script.js
node --check reservation.mjs
```

O projeto não foi publicado.
