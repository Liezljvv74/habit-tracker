const STORAGE_KEY = 'smallStepsHabits';

const state = {
  habits: loadHabits()
};

const habitList = document.querySelector('#habitList');
const emptyState = document.querySelector('#emptyState');
const addForm = document.querySelector('#addForm');
const habitNameInput = document.querySelector('#habitName');
const habitCount = document.querySelector('#habitCount');
const progressPercent = document.querySelector('#progressPercent');
const progressRing = document.querySelector('#progressRing');
const todayLabel = document.querySelector('#todayLabel');
const habitTemplate = document.querySelector('#habitTemplate');
const congrats = document.querySelector('#congrats');
const congratsText = document.querySelector('#congratsText');

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function loadHabits() {
  try {
    const savedHabits = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedHabits) ? savedHabits : [];
  } catch {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
}

function isComplete(habit) {
  return Boolean(habit.completedDates && habit.completedDates[today()]);
}

function render() {
  const completedCount = state.habits.filter(isComplete).length;
  const totalCount = state.habits.length;
  const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  habitList.replaceChildren();
  state.habits.forEach((habit) => {
    const card = habitTemplate.content.cloneNode(true);
    const article = card.querySelector('.habit-card');
    const completeButton = card.querySelector('[data-action="toggle"]');
    const status = card.querySelector('[data-field="status"]');
    const complete = isComplete(habit);

    article.dataset.id = habit.id;
    article.classList.toggle('completed', complete);
    card.querySelector('[data-field="name"]').textContent = habit.name;
    status.textContent = complete ? 'Completed today' : 'Not done yet';
    completeButton.setAttribute('aria-label', complete ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`);
    habitList.append(card);
  });

  emptyState.hidden = totalCount > 0;
  habitCount.textContent = `${totalCount} ${totalCount === 1 ? 'habit' : 'habits'}`;
  progressPercent.textContent = `${percentage}%`;
  progressRing.style.setProperty('--progress-angle', `${percentage * 3.6}deg`);
  progressRing.setAttribute('aria-label', `${percentage}% of today's habits complete`);
  congrats.hidden = !(totalCount > 0 && completedCount === totalCount);
}

// Wrap each letter in its own span so the CSS flicker animation can stagger
// the colour cycle one character at a time.
function splitCongratsLetters() {
  const letters = [...congratsText.textContent];
  congratsText.replaceChildren(...letters.map((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.setProperty('--i', index);
    return span;
  }));
}

function addHabit(name) {
  state.habits.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name,
    completedDates: {}
  });
  saveHabits();
  render();
}

function toggleHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  habit.completedDates = habit.completedDates || {};
  if (isComplete(habit)) {
    delete habit.completedDates[today()];
  } else {
    habit.completedDates[today()] = true;
  }
  saveHabits();
  render();
}

function renameHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  const card = habitList.querySelector(`[data-id="${id}"]`);
  const nameHeading = card.querySelector('[data-field="name"]');
  const editButton = card.querySelector('[data-action="edit"]');
  const input = document.createElement('input');
  input.className = 'habit-edit-input';
  input.type = 'text';
  input.maxLength = 80;
  input.value = habit.name;
  input.setAttribute('aria-label', `New name for ${habit.name}`);
  nameHeading.replaceWith(input);
  editButton.dataset.action = 'save';
  editButton.textContent = 'Save';
  editButton.setAttribute('aria-label', `Save new name for ${habit.name}`);
  input.focus();
  input.select();
}

function deleteHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  state.habits = state.habits.filter((item) => item.id !== id);
  saveHabits();
  render();
}

function saveRenamedHabit(id) {
  const card = habitList.querySelector(`[data-id="${id}"]`);
  const input = card.querySelector('.habit-edit-input');
  const name = input.value.trim();
  if (!name) return;
  const habit = state.habits.find((item) => item.id === id);
  habit.name = name;
  saveHabits();
  render();
}

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = habitNameInput.value.trim();
  if (!name) return;
  addHabit(name);
  addForm.reset();
  habitNameInput.focus();
});

habitList.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  const card = event.target.closest('.habit-card');
  if (!actionButton || !card) return;
  const { id } = card.dataset;
  const action = actionButton.dataset.action;
  if (action === 'toggle') toggleHabit(id);
  if (action === 'edit') renameHabit(id);
  if (action === 'save') saveRenamedHabit(id);
  if (action === 'delete') deleteHabit(id);
});

todayLabel.textContent = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}).format(new Date());

splitCongratsLetters();
render();
