function toggleTodo() {
 const section = document.getElementById('todo-section');
 section.classList.toggle('active');
 if (section.classList.contains('active')) {
 document.getElementById('todoInput').focus();
 }
}

function addTodo() {
 const input = document.getElementById('todoInput');
 const text = input.value.trim();
 if (!text) return;

 const list = document.getElementById('todoList');
 const item = document.createElement('li');
 item.className = 'todo-item';

 const check = document.createElement('input');
 check.type = 'checkbox';
 check.className = 'todo-check';
 check.onchange = function() {
 textSpan.classList.toggle('done');
 updateCount();
 saveTasks();
 };

 const textSpan = document.createElement('span');
 textSpan.className = 'todo-text';
 textSpan.textContent = text;

 const delBtn = document.createElement('button');
 delBtn.className = 'todo-delete';
 delBtn.textContent = '✕';
 delBtn.onclick = function() {
 item.remove();
 updateCount();
 saveTasks();
 };

 item.appendChild(check);
 item.appendChild(textSpan);
 item.appendChild(delBtn);
 list.appendChild(item);

 input.value = '';
 input.focus();
 updateCount();
 saveTasks();
}

function updateCount() {
 const items = document.querySelectorAll('.todo-item');
 const done = document.querySelectorAll('.todo-check:checked');
 document.getElementById('todoCount').textContent =
 `${done.length} / ${items.length} tasks`;
}

function saveTasks() {
 const items = document.querySelectorAll('.todo-item');
 const tasks = [];
 items.forEach(item => {
 const text = item.querySelector('.todo-text').textContent;
 const done = item.querySelector('.todo-check').checked;
 tasks.push({ text, done });
 });
 localStorage.setItem('cozyTasks', JSON.stringify(tasks));
}

function loadTasks() {
 const saved = localStorage.getItem('cozyTasks');
 if (!saved) return;

 const tasks = JSON.parse(saved);
 tasks.forEach(task => {
 const list = document.getElementById('todoList');

 const item = document.createElement('li');
 item.className = 'todo-item';

 const check = document.createElement('input');
 check.type = 'checkbox';
 check.className = 'todo-check';
 check.checked = task.done;
 check.onchange = function() {
 textSpan.classList.toggle('done');
 updateCount();
 saveTasks();
 };

 const textSpan = document.createElement('span');
 textSpan.className = 'todo-text';
 textSpan.textContent = task.text;
 if (task.done) textSpan.classList.add('done');

 const delBtn = document.createElement('button');
 delBtn.className = 'todo-delete';
 delBtn.textContent = '✕';
 delBtn.onclick = function() {
 item.remove();
 updateCount();
 saveTasks();
 };

 item.appendChild(check);
 item.appendChild(textSpan);
 item.appendChild(delBtn);
 list.appendChild(item);
 });
 updateCount();
}

document.addEventListener('DOMContentLoaded', function() {
 loadTasks();
 document.getElementById('todoInput').addEventListener('keypress', function(e) {
 if (e.key === 'Enter') addTodo();
 });
});

//habit tracker//

const HABIT_STORAGE_KEY = 'bunnyHabits';

let habits = [];
let lastDate = null;
let streak = 0;

function getBunny(streak) {
 if (streak === 0) return { emoji: '🐇', msg: 'A little bunny arrived! Start your streak!' };
 if (streak <= 2) return { emoji: '🐰', msg: `${streak}-day streak! Keep going!` };
 if (streak <= 4) return { emoji: '🐰✨', msg: `${streak} days! Your bunny is getting sparkly!` };
 if (streak <= 6) return { emoji: '🌸🐰', msg: `${streak} days! Flowers are blooming!` };
 if (streak <= 9) return { emoji: '🌟🐰', msg: `${streak} days! Star bunny status!` };
 if (streak <= 13) return { emoji: '👑🐰', msg: `${streak} days! Royal bunny!` };
 return { emoji: '🌈🐰✨', msg: `${streak} days! LEGENDARY RAINBOW BUNNY! 🌈` };
}

function getTodayKey() {
 const now = new Date();
 return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getYesterdayKey() {
 const d = new Date();
 d.setDate(d.getDate() - 1);
 return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadHabits() {
 const saved = localStorage.getItem(HABIT_STORAGE_KEY);
 if (!saved) {
 habits = [];
 lastDate = null;
 streak = 0;
 return;
 }

 try {
 const data = JSON.parse(saved);
 habits = data.habits || [];
 lastDate = data.lastDate || null;
 streak = data.streak || 0;

 const today = getTodayKey();
 const yesterday = getYesterdayKey();

 if (lastDate && lastDate!== today && lastDate!== yesterday) {
 streak = 0;
 habits.forEach(h => h.doneToday = false);
 } else if (lastDate === yesterday) {
 habits.forEach(h => h.doneToday = false);
 } else if (lastDate!== today) {
 habits.forEach(h => h.doneToday = false);
 }
 } catch (e) {
 habits = [];
 lastDate = null;
 streak = 0;
 }
}

function saveHabits() {
 localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify({
 habits: habits,
 lastDate: lastDate,
 streak: streak
 }));
}

function updateBunny() {
 const { emoji, msg } = getBunny(streak);
 const bunnyEl = document.getElementById('bunnyEmoji');
 if (!bunnyEl) return;
 bunnyEl.textContent = emoji;
 bunnyEl.classList.remove('bounce');
 void bunnyEl.offsetWidth;
 bunnyEl.classList.add('bounce');
 document.getElementById('bunnyMessage').textContent = msg;
 document.getElementById('streakCount').textContent = streak;
}

function renderHabits() {
 const list = document.getElementById('habitList');
 if (!list) return;
 list.innerHTML = '';

 if (habits.length === 0) {
 list.innerHTML = '<li style="text-align:center;color:#b0a0b8;padding:1rem;">Add a habit to start tracking! 🌱</li>';
 updateBunny();
 return;
 }

 habits.forEach((habit, index) => {
 const item = document.createElement('li');
 item.className = 'habit-item';
 if (habit.doneToday) item.classList.add('habit-done');

 const check = document.createElement('input');
 check.type = 'checkbox';
 check.className = 'habit-check';
 check.checked = habit.doneToday;
 check.onchange = function() {
 habit.doneToday = check.checked;
 if (check.checked) {
 item.classList.add('habit-done');
 } else {
 item.classList.remove('habit-done');
 }
 checkAllHabitsDone();
 saveHabits();
 };

 const nameSpan = document.createElement('span');
 nameSpan.className = 'habit-name';
 nameSpan.textContent = habit.name;

 const streakBadge = document.createElement('span');
 streakBadge.className = 'habit-streak';
 streakBadge.textContent = `${habit.streak || 0}🔥`;

 const delBtn = document.createElement('button');
 delBtn.className = 'habit-delete';
 delBtn.textContent = '✕';
 delBtn.onclick = function() {
 habits.splice(index, 1);
 renderHabits();
 saveHabits();
 checkAllHabitsDone();
 };

 item.appendChild(check);
 item.appendChild(nameSpan);
 item.appendChild(streakBadge);
 item.appendChild(delBtn);
 list.appendChild(item);
 });

 updateBunny();
}

function checkAllHabitsDone() {
 const today = getTodayKey();
 let allDone = habits.length > 0 && habits.every(h => h.doneToday);

 if (allDone && lastDate!== today) {
 if (lastDate === getYesterdayKey()) {
 streak += 1;
 } else if (lastDate === null) {
 streak = 1;
 } else {
 streak = 1;
 }
 lastDate = today;
 saveHabits();
 updateBunny();
 }
}

function addHabit() {
 const input = document.getElementById('habitInput');
 const text = input.value.trim();
 if (!text) return;

 if (habits.some(h => h.name.toLowerCase() === text.toLowerCase())) {
 alert('You already have this habit! 🐰');
 return;
 }

 habits.push({
 name: text,
 doneToday: false,
 streak: 0,
 created: getTodayKey()
 });

 input.value = '';
 input.focus();
 renderHabits();
 saveHabits();
}

function openHabitPopup() {
 loadHabits();
 renderHabits();
 document.getElementById('habitOverlay').classList.add('open');
 document.body.style.overflow = 'hidden';
}

function closeHabitPopup(e) {
 if (e && e.target!== e.currentTarget) return;
 document.getElementById('habitOverlay').classList.remove('open');
 document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {

 loadTasks();
 document.getElementById('todoInput').addEventListener('keypress', function(e) {
 if (e.key === 'Enter') addTodo();
 });


 const habitCard = document.querySelector('.card-2');
 if (habitCard) {
 habitCard.onclick = openHabitPopup;
 habitCard.style.cursor = 'pointer';
 }


 const addBtn = document.getElementById('addHabitBtn');
 const habitInput = document.getElementById('habitInput');
 const resetBtn = document.getElementById('resetHabitsBtn');

 if (addBtn) addBtn.addEventListener('click', addHabit);
 if (habitInput) {
 habitInput.addEventListener('keypress', function(e) {
 if (e.key === 'Enter') addHabit();
 });
 }
 if (resetBtn) {
 resetBtn.addEventListener('click', function() {
 if (confirm('Reset all habits and streak? Your bunny will be sad 😢')) {
 habits = [];
 lastDate = null;
 streak = 0;
 renderHabits();
 saveHabits();
 }
 });
 }
});

let stopwatchInterval = null;
let stopwatchRunning = false;
let stopwatchTime = 0; //this is in milisec
let lapCount = 0;

 function formatStopwatch(ms) {
  const totalSec = Math.floor(ms/ 1000);
  const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSec % 360)/ 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
 
  return`${hours}:${mins}:${secs}`; 

}


function updateStopwatchDisplay (){
 document.getElementById('stopwatchDisplay').textContent = formatStopwatch(stopwatchTime);

}


function startStopwatch(){
 if (stopwatchRunning) return;
 stopwatchRunning = true;
 document.getElementById('swStartBtn').textContent = '⏸ Pause';
 document.getElementById('swStartBtn').onclick = pauseStopwatch;
 document.getElementById('swLapBtn').disabled = false;

 const startTime = Date.now() - stopwatchTime;
 stopwatchInterval = setInterval(() => {
 stopwatchTime = Date.now() - startTime;
 updateStopwatchDisplay();
 }, 10);
}

function pauseStopwatch() {
  stopwatchRunning = false;
  clearInterval(stopwatchInterval);
  document.getElementById('swStartBtn').textContent = '▶ Resume';
  document.getElementById('swStartBtn').onclick = startStopwatch;
  document.getElementById('swLapBtn').disabled = true;

}

function resetStopwatch () {
 stopwatchRunning = false;
 clearInterval(stopwatchInterval);
 stopwatchTime = 0;
 lapCount = 0;
 updateStopwatchDisplay();
 document.getElementById('swStartBtn').textContent ='▶ Start';
 document.getElementById('swStartBtn').onclick = startStopwatch;
 document.getElementById('swLapBtn').disabled = true;
 document.getElementById('lapList').innerHTML = '';

}

function lapStopwatch() {
 if(!stopwatchRunning) return;
 lapCount++;
 const list = document.getElementById('lapList');
 const item = document.createElement('li');
 item.className = 'lap-item';
 item.textContent = `Lap${lapCount}: ${formatStopwatch(stopwatchTime)}`;
 list.appendChild(item);
}


function openStopwatch() {
 document.getElementById('stopwatchOverlay').classList.add('open');
 document.body.style.overflow = 'hidden';
}

function closeStopwatch(e) {
 if (e && e.target!== e.currentTarget) return;
 document.getElementById('stopwatchOverlay').classList.remove('open');
 document.body.style.overflow = '';
}





