'use strict';

// Centralized, illustrative photography and menu content.
const images = {
  hero: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=2400&q=85',
  steak: 'https://images.unsplash.com/photo-1611171711791-b34fa42e9fc2?auto=format&fit=crop&w=900&q=85',
  sushi: 'https://images.unsplash.com/photo-1603362305302-f034a317a924?auto=format&fit=crop&w=900&q=85',
  cocktail: 'https://images.unsplash.com/photo-1655933733028-800c78825738?auto=format&fit=crop&w=900&q=85',
  dessert: 'https://images.unsplash.com/photo-1645805740318-31bb7604ffd9?auto=format&fit=crop&w=900&q=85',
  interior: 'https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?auto=format&fit=crop&w=1800&q=85'
};
document.querySelectorAll('[data-image]').forEach(element => {
  const url = images[element.dataset.image];
  if (element.tagName === 'IMG') element.src = url;
  else element.style.backgroundImage = `url("${url}")`;
});

const dishes = [
  { name: 'Cortes na brasa', category: 'cortes', label: 'Cortes nobres', image: 'steak', description: 'Suculência, sabor e o cuidado com o ponto de cada corte.', badge: 'Da nossa brasa' },
  { name: 'Seleção japonesa', category: 'buffet', label: 'Buffet & sushi', image: 'sushi', description: 'Delicadeza e frescor para completar a sua experiência.' },
  { name: 'Um brinde ao momento', category: 'bebidas', label: 'Bebidas & coquetéis', image: 'cocktail', description: 'Combinações para acompanhar a conversa e os bons sabores.' },
  { name: 'O lado doce', category: 'sobremesas', label: 'Sobremesas', image: 'dessert', description: 'Uma pausa doce para encerrar sua visita com sabor.' }
];
const grid = document.querySelector('#menu-grid');
function renderMenu(filter = 'all') {
  const selected = dishes.filter(dish => filter === 'all' || dish.category === filter);
  grid.replaceChildren(...selected.map(dish => {
    const card = document.createElement('article');
    card.className = 'dish';
    card.innerHTML = `<div class="dish-image"><img src="${images[dish.image]}" alt="${dish.name} — imagem ilustrativa" width="600" height="550" loading="lazy">${dish.badge ? `<span class="badge">${dish.badge}</span>` : ''}</div><p class="category">${dish.label}</p><h3>${dish.name}</h3><p>${dish.description}</p>`;
    return card;
  }));
  document.querySelector('#filter-status').textContent = `${selected.length} ${selected.length === 1 ? 'opção exibida' : 'opções exibidas'}.`;
}
renderMenu();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  renderMenu(button.dataset.filter);
}));

// Mobile navigation closes on selection, Escape and an outside click.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Progressive scroll effects: content remains visible without observer support.
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('ready'); reveals.observe(element); });
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navigation.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-20% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sections.observe(section));
}

// Reservation requests are composed locally, then explicitly sent by the guest on WhatsApp.
const form = document.querySelector('#reservation-form');
const dateInput = form.elements.date;
const timeInput = form.elements.time;
const phoneInput = form.elements.phone;
function restaurantNow() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Fortaleza', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
}
function slotsFor(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const weekday = new Date(`${date}T12:00:00-03:00`).getUTCDay();
  if (weekday === 1) return [];
  const slots = [];
  const addSlots = (start, end) => { for (let minute = start; minute < end; minute += 15) slots.push(`${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`); };
  addSlots(11 * 60 + 15, 15 * 60);
  if (weekday !== 0) addSlots(18 * 60 + 15, 23 * 60);
  const now = restaurantNow();
  return date < now.date ? [] : slots.filter(time => date !== now.date || time > now.time);
}
function refreshSlots() {
  dateInput.min = restaurantNow().date;
  const previous = timeInput.value;
  const slots = slotsFor(dateInput.value);
  timeInput.replaceChildren(new Option(dateInput.value ? (slots.length ? 'Selecione o horário' : 'Sem horários nesta data') : 'Selecione a data', ''));
  slots.forEach(slot => timeInput.add(new Option(slot, slot)));
  if (slots.includes(previous)) timeInput.value = previous;
}
function validateField(field) {
  let message = '';
  const value = field.value.trim();
  if (!value) message = 'Preencha este campo.';
  else if (field.name === 'name' && value.length < 2) message = 'Informe seu nome com pelo menos 2 letras.';
  else if (field.name === 'phone' && !/^[1-9]{2}\d{8,9}$/.test(value.replace(/\D/g, ''))) message = 'Informe um telefone com DDD (10 ou 11 dígitos).';
  else if (field.name === 'date') {
    if (value < restaurantNow().date) message = 'Escolha hoje ou uma data futura.';
    else if (new Date(`${value}T12:00:00-03:00`).getUTCDay() === 1) message = 'Às segundas, a casa está fechada.';
    else if (!slotsFor(value).length) message = 'Não há mais horários. Escolha outra data.';
  } else if (field.name === 'time' && !slotsFor(dateInput.value).includes(value)) message = 'Selecione um horário disponível.';
  field.setAttribute('aria-invalid', String(Boolean(message)));
  document.querySelector(`#${field.id}-error`).textContent = message;
  return !message;
}
const fields = [...form.querySelectorAll('input, select')];
fields.forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    document.querySelector('#reservation-link').hidden = true;
    document.querySelector('#form-status').textContent = '';
  });
});
dateInput.addEventListener('change', () => { refreshSlots(); validateField(dateInput); document.querySelector('#time-error').textContent = ''; timeInput.removeAttribute('aria-invalid'); });
phoneInput.addEventListener('input', () => {
  const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
  phoneInput.value = digits.length > 2 ? `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length > 10 ? 7 : 6)}${digits.length > 6 ? '-' + digits.slice(digits.length > 10 ? 7 : 6) : ''}` : digits;
});
refreshSlots();
form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) { form.querySelector('[aria-invalid="true"]').focus(); return; }
  const formattedDate = dateInput.value.split('-').reverse().join('/');
  const message = `Olá, Rossini! Gostaria de solicitar uma reserva.\n\nNome: ${form.elements.name.value.trim()}\nTelefone: ${phoneInput.value}\nData: ${formattedDate}\nHorário: ${timeInput.value}\nPessoas: ${form.elements.people.value}\n\nAguardo a confirmação da disponibilidade. Obrigado(a)!`;
  const url = `https://wa.me/559833033769?text=${encodeURIComponent(message)}`;
  const fallback = document.querySelector('#reservation-link');
  fallback.href = url;
  fallback.hidden = false;
  document.querySelector('#form-status').textContent = 'Solicitação preparada! Envie a mensagem no WhatsApp para consultar a disponibilidade.';
  window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelectorAll('.whatsapp').forEach(link => { link.href = 'https://wa.me/559833033769?text=' + encodeURIComponent('Olá, Rossini! Gostaria de informações e de reservar uma mesa.'); });
document.querySelector('#year').textContent = new Date().getFullYear();
