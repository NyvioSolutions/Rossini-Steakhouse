# Rossini Steakhouse

Site estático em HTML, CSS e JavaScript, na identidade visual do Instagram e do salão da Rossini: preto, brasa, amarelo-ouro, pedra e aço. Seções: rodízio, valores, nossa história, prêmios, reservas de grupos e localização.

## Abrir localmente

Com Node.js instalado, execute nesta pasta:

```sh
node preview.cjs
```

Abra http://127.0.0.1:4175. Os módulos precisam de HTTP; não abra o HTML por duplo clique. Não é necessário instalar dependências.

## Publicar

Envie index.html, style.css, script.js, motion.js, reservation.mjs e a pasta assets para uma hospedagem estática HTTPS. Sirva .mjs como text/javascript. preview.cjs é somente uma prévia local. As tags de compartilhamento (og:image, canonical) apontam para https://rossinisteakhouse.com.br/; ajuste se o domínio for outro. Google Fonts, Maps e os links de contato dependem de internet.

## Editar

- Conteúdo, valores, horários, história e prêmios: index.html. Os valores seguem o destaque "Valores" do Instagram; ao mudar, atualize também a frase com a data da tabela.
- Prêmios e notas: seção `#premios`, com a data de consulta no texto.
- Horários: faixa de horários, seção `#localizacao`, rodapé e o JSON-LD no `<head>`; as regras de reserva ficam em reservation.mjs.
- Regras de reserva (número do WhatsApp, grupo mínimo, dias e feriados): constantes no topo de reservation.mjs. Mantenha a lista de pessoas do formulário coerente com `MIN_PARTY_SIZE`.
- Tipografia, cores e responsividade: tokens no início de style.css.
- Menu, destaque da seção atual e formulário: script.js. Entrada e revelação das fotos: motion.js.
- Origem de cada imagem: assets/sources.json.

O formulário pede nome, data, horário, pessoas e observações. Prepara a mensagem no modelo da própria casa para o visitante enviar no WhatsApp de reservas; a reserva só vale após confirmação da equipe. Não armazena dados.

## Validar

```sh
node --test tests/reservation.test.mjs
node --check script.js
node --check motion.js
node --check reservation.mjs
```

O projeto não foi publicado.
