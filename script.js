// Constants
const moodButtons = document.querySelectorAll('.mood-selection button');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const openCalendarBtn = document.getElementById('openCalendar');
const calendarModal = document.getElementById('calendarModal');
const closeCalendarBtn = document.getElementById('closeCalendar');
const calendarGrid = document.getElementById('calendarGrid');

const moods = {
  happy: { emoji: '😊', colorClass: 'mood-happy' },
  sad: { emoji: '😢', colorClass: 'mood-sad' },
  angry: { emoji: '😡', colorClass: 'mood-angry' },
  calm: { emoji: '😌', colorClass: 'mood-calm' },
  excited: { emoji: '🤩', colorClass: 'mood-excited' }
};

const STORAGE_KEY = 'serenityMoodHistory';

// Load mood history from localStorage or empty array
let moodHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Display mood history
function renderHistory() {
  historyList.innerHTML = '';
  if (moodHistory.length === 0) {
    historyList.innerHTML = '<li style="text-align:center;color:#999;">No mood recorded yet.</li>';
    return;
  }
  moodHistory.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    const date = new Date(entry.date);
    li.textContent = `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}: `;
    const spanEmoji = document.createElement('span');
    spanEmoji.textContent = moods[entry.mood].emoji;
    spanEmoji.style.marginLeft = '6px';
    li.appendChild(spanEmoji);
    historyList.appendChild(li);
  });
}

// Save mood to history
function addMood(mood) {
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0]; // yyyy-mm-dd

  // Prevent multiple entries for same day, replace if exists
  const existingIndex = moodHistory.findIndex(entry => entry.date === todayDate);
  if (existingIndex !== -1) {
    moodHistory[existingIndex].mood = mood;
  } else {
    moodHistory.push({ date: todayDate, mood });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(moodHistory));
  renderHistory();
  triggerEmojiBurst(mood);
}

// Clear mood history
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your mood history?')) {
    moodHistory = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
});

// Trigger emoji burst animation on click
function triggerEmojiBurst(mood) {
  const burstContainer = document.createElement('div');
  burstContainer.classList.add('emoji-burst');
  document.body.appendChild(burstContainer);

  const count = 15;
  const emojiChar = moods[mood].emoji;

  for (let i = 0; i < count; i++) {
    const emoji = document.createElement('span');
    emoji.textContent = emojiChar;
    emoji.style.position = 'absolute';
    emoji.style.left = '50%';
    emoji.style.top = '50%';
    emoji.style.fontSize = '1.7rem';
    emoji.style.opacity = '1';
    emoji.style.pointerEvents = 'none';
    burstContainer.appendChild(emoji);

    // Random movement
    const angle = Math.random() * 2 * Math.PI;
    const distance = 80 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    emoji.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${x}px,${y}px) scale(0.3)`, opacity: 0 }
    ], {
      duration: 900,
      easing: 'ease-out',
      fill: 'forwards'
    });

    setTimeout(() => {
      emoji.remove();
    }, 900);
  }

  setTimeout(() => burstContainer.remove(), 1000);
}

// Mood buttons event
moodButtons.forEach(button => {
  button.addEventListener('click', () => {
    const mood = button.getAttribute('data-mood');
    addMood(mood);
  });
});

// Render calendar modal
function renderCalendar() {
  calendarGrid.innerHTML = '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Show days of week heading
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const dayName = document.createElement('div');
    dayName.textContent = day;
    dayName.classList.add('calendar-day');
    dayName.style.fontWeight = '700';
    dayName.style.color = '#334477dd';
    calendarGrid.appendChild(dayName);
  });

  // Calculate first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Fill empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    calendarGrid.appendChild(emptyDiv);
  }

  // Fill days with mood data circles
  for (let day = 1; day <= daysInMonth; day++) {
    const dateISO = new Date(year, month, day).toISOString().split('T')[0];

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = day;

    // Highlight today
    const todayISO = now.toISOString().split('T')[0];
    if (dateISO === todayISO) {
      dayDiv.classList.add('today');
    }

    // Add mood circle if exists
    const entry = moodHistory.find(e => e.date === dateISO);
    if (entry) {
      const moodCircle = document.createElement('div');
      moodCircle.classList.add('mood-circle', moods[entry.mood].colorClass);
      dayDiv.appendChild(moodCircle);
    }

    calendarGrid.appendChild(dayDiv);
  }
}

// Open calendar modal
openCalendarBtn.addEventListener('click', () => {
  renderCalendar();
  calendarModal.setAttribute('aria-hidden', 'false');
});

// Close calendar modal
closeCalendarBtn.addEventListener('click', () => {
  calendarModal.setAttribute('aria-hidden', 'true');
});

// Close modal on outside click
calendarModal.addEventListener('click', (e) => {
  if (e.target === calendarModal) {
    calendarModal.setAttribute('aria-hidden', 'true');
  }
});

// Initial render
renderHistory();
// Optional interactivity for future extension
const cards = document.querySelectorAll('.mood-card');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const mood = card.querySelector('h2').innerText;
    alert(`You selected: ${mood}`);
  });
});
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Sample emoji events
const emojiMap = {
  1: "🌈", 3: "🌻", 5: "📚", 7: "🎨", 10: "💡", 14: "💖",
  21: "🍓", 22: "🍵", 25: "🌙", 30: "🌊"
};

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
  const firstDay = new Date(year, month).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= lastDate; day++) {
    const today = new Date();
    const isToday = day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
    const emoji = emojiMap[day] || "";

    calendarDays.innerHTML += `
      <div class="${isToday ? 'today' : ''}">
        ${day}
        <span class="emoji">${emoji}</span>
      </div>
    `;
  }

  monthYear.innerText = `${months[month]} ${year}`;
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

renderCalendar(currentMonth, currentYear);
