# Direção visual

Rossini Steakhouse em São Luís: conhecer o rodízio, ver os valores, conhecer a história da família e pedir mesa para grupos.

## Identidade — extraída em 25/09/2026

Fontes: Instagram oficial (@rossinisteakhouse: artes de promoção, destaques "Valores", "Horários" e capas), Google Maps (fachada e salão) e site oficial (logo em alta resolução e foto do salão).

- **Preto quente e brasa:** fundos #0b0907 a #1e1712; painéis em degradê marrom #4a2412 → #1b0e07, como os destaques "Valores" e "Horários".
- **Amarelo-ouro:** #f6b92b para destaques, etiquetas ("ALMOÇO", "JANTAR", "NESTA TERÇA") e botões, sempre com texto escuro por cima. Não usar amarelo como texto sobre a pedra clara; ali o acento é bronze #8a5700.
- **Pedra e aço:** a seção "Nossa história" usa a pedra clara #ece6dc da parede do salão, textura sutil e trilho preto com marcadores quadrados, como a grade de aço que segura os vasos.
- **Tipografia:** Bebas Neue para títulos em caixa alta (as artes usam condensada branca); Yellowtail, script dourado, só em chamadas curtas ("Rodízio completo", "Jantar", "Almoço", assinatura "Família Rossini"); Montserrat para texto, preços e rótulos espaçados.
- **Logo:** sempre o arquivo oficial. Versão horizontal branca no cabeçalho e no quadro de valores (igual às artes); vertical branca no rodapé; versão preta para fundos claros.

Os tokens de style.css são a fonte da implementação.

## Composição

- Hero com a foto real dos cortes, degradê à esquerda e brilho de brasa embaixo; bloco de preço no formato das artes (etiqueta amarela, R$ grande, barra dourada, descrição).
- Faixa de horários logo abaixo da dobra.
- Rodízio: título, lista do que está incluso e duas fotos reais escalonadas.
- Valores: quadro de preços com pontilhado, subtítulos em script e logo no topo, reproduzindo o destaque "Valores".
- Nossa história: pedra clara, foto real do salão e da família, linha do tempo e citação da família.
- Prêmios: cartão principal com louros dourados para o Travellers' Choice 2026 e dois cartões de avaliação.
- Reservas, horários e localização, rodapé com dados legais.

## Comportamento

Movimento sutil: zoom de entrada da foto (4,8 s), entrada escalonada do título e revelação única das fotos. Respeita a preferência do sistema e tem botão "Reduzir movimento". Conteúdo visível sem JavaScript; sem JavaScript, o formulário dá lugar a um link direto para o WhatsApp.

Texto funcional com no mínimo 12 px (a maior parte entre 14 e 18 px). Foco visível em amarelo (aço na seção clara). Botões com 6 px de raio e alvos de toque de 44 px ou mais.

## Responsividade

Menu recolhe abaixo de 1024 px. Abaixo de 900 px as grades viram uma coluna; abaixo de 760 px a linha do tempo fica vertical e surge a barra fixa com Ligar, Como chegar e Reservar, respeitando a área segura.
