// Планировщик жизни на 12 недель - основная логика (обновленная версия)
class LifePlanner {
    constructor() {
        this.currentWeek = 1;
        this.startDate = new Date('2025-09-29');

        // Данные сфер жизни
        this.spheres = [
            {
                name: 'Здоровье', 
                color: '#4CAF50', 
                goals: ['Тренировки 2-3 раза/нед', 'Экраны off в 22:00', 'Душ через день']
            },
            {
                name: 'Карьера', 
                color: '#2196F3', 
                goals: ['Навык 3-5 ч/нед', 'Артефакт раз в 2 недели']
            },
            {
                name: 'Финансы', 
                color: '#FF9800', 
                goals: ['Стратегия погашения кредитов']
            },
            {
                name: 'Отношения', 
                color: '#E91E63', 
                goals: ['5 минут честности с собой 4/7']
            },
            {
                name: 'Соцсвязи', 
                color: '#9C27B0', 
                goals: ['2 события/мес', '3 фоллоу-апа']
            },
            {
                name: 'Развитие', 
                color: '#795548', 
                goals: ['Психотерапия 2-4/мес', 'Чтение 5-10 стр/день']
            },
            {
                name: 'Кондитерка', 
                color: '#F44336', 
                goals: ['Практика 3-5 ч/нед', '4 изделия за 8 недель']
            },
            {
                name: 'Досуг', 
                color: '#009688', 
                goals: ['Планирование Кавказа']
            },
            {
                name: 'Духовность', 
                color: '#673AB7', 
                goals: ['Осознанность 5/7', 'Обзор паттернов/нед']
            }
        ];

        // Еженедельные задачи
        this.weeklyTasks = [
            {
                task: 'Тренировка', 
                type: '3x в неделю', 
                days: 'Пн/Ср/Сб', 
                sphere: 'Здоровье',
                id: 'workout'
            },
            {
                task: 'Экраны off в 22:00', 
                type: 'ежедневно', 
                days: '5/7', 
                sphere: 'Здоровье',
                id: 'screens_off'
            },
            {
                task: 'Душ', 
                type: 'через день', 
                days: 'по четным', 
                sphere: 'Здоровье',
                id: 'shower'
            },
            {
                task: 'Навык развитие', 
                type: '3-5 часов', 
                days: 'Пн/Ср/Сб', 
                sphere: 'Карьера',
                id: 'skill_development'
            },
            {
                task: '5 минут честности', 
                type: 'ежедневно', 
                days: '4/7', 
                sphere: 'Отношения',
                id: 'honesty'
            },
            {
                task: 'Чтение', 
                type: 'ежедневно', 
                days: '5-10 стр', 
                sphere: 'Развитие',
                id: 'reading'
            },
            {
                task: 'Кондитерка', 
                type: 'практика', 
                days: 'Пн/Ср/Сб', 
                sphere: 'Кондитерка',
                id: 'confectionery'
            },
            {
                task: 'Осознанность', 
                type: 'ежедневно', 
                days: '5-10 мин', 
                sphere: 'Духовность',
                id: 'mindfulness'
            }
        ];

        // Ежедневные привычки
        this.dailyHabits = [
            { name: 'Экраны off', target: '5/7 дней', id: 'screens' },
            { name: 'Чтение', target: '5-10 страниц', id: 'reading' },
            { name: 'Осознанность', target: '5-10 минут', id: 'mindfulness' },
            { name: '5 минут честности', target: '4/7 дней', id: 'honesty' }
        ];

        this.data = this.loadData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.updateWeeksView();
        this.updateHabitsView();
        this.updateRetrospectiveView();
    }

    setupEventListeners() {
        // Навигация по табам
        document.querySelectorAll('.nav__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Навигация по неделям
        document.getElementById('prevWeek')?.addEventListener('click', () => {
            if (this.currentWeek > 1) {
                this.currentWeek--;
                this.updateWeeksView();
            }
        });

        document.getElementById('nextWeek')?.addEventListener('click', () => {
            if (this.currentWeek < 12) {
                this.currentWeek++;
                this.updateWeeksView();
            }
        });

        // Экспорт/импорт данных
        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importData')?.addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile')?.addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Закрытие модального окна
        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });
    }

    switchTab(tabName) {
        // Обновляем активную кнопку
        document.querySelectorAll('.nav__btn').forEach(btn => {
            btn.classList.remove('nav__btn--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('nav__btn--active');

        // Обновляем активный контент
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('tab-content--active');
        });
        document.getElementById(tabName)?.classList.add('tab-content--active');

        // Обновляем данные в зависимости от таба
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'weeks') {
            this.updateWeeksView();
        } else if (tabName === 'habits') {
            this.updateHabitsView();
        } else if (tabName === 'retrospective') {
            this.updateRetrospectiveView();
        }
    }

    updateDashboard() {
        document.getElementById('currentWeek').textContent = this.currentWeek;

        // Обновляем общий прогресс
        const overallProgress = this.calculateOverallProgress();
        document.getElementById('overallProgress').style.width = `${overallProgress}%`;
        document.getElementById('overallPercentage').textContent = `${Math.round(overallProgress)}%`;

        // Обновляем сферы
        const spheresGrid = document.getElementById('spheresGrid');
        if (spheresGrid) {
            spheresGrid.innerHTML = '';

            this.spheres.forEach(sphere => {
                const progress = this.calculateSphereProgress(sphere.name);
                const card = this.createSphereCard(sphere, progress);
                spheresGrid.appendChild(card);
            });
        }
    }

    createSphereCard(sphere, progress) {
        const card = document.createElement('div');
        card.className = 'sphere-card';
        card.style.borderLeftColor = sphere.color;

        const progressColor = progress >= 70 ? '#4CAF50' : progress >= 40 ? '#FF9800' : '#F44336';

        // Получаем кастомные цели из localStorage
        const customGoals = this.getCustomGoals(sphere.name);
        const allGoals = [...sphere.goals, ...customGoals];

        card.innerHTML = `
            <div class="sphere-card__header">
                <h3 class="sphere-card__title">${sphere.name}</h3>
                <span class="sphere-card__percentage" style="color: ${progressColor}">
                    ${Math.round(progress)}%
                </span>
            </div>
            <ul class="sphere-card__goals">
                ${allGoals.map(goal => `<li>${goal}</li>`).join('')}
            </ul>
            <div class="sphere-card__actions">
                <button class="btn-add-goal" data-sphere="${sphere.name}">
                    <span class="btn-add-goal__icon">+</span>
                    Добавить цель
                </button>
            </div>
            <div class="progress-bar">
                <div class="progress-bar__fill" style="width: ${progress}%; background: ${progressColor}"></div>
            </div>
        `;

        // Добавляем обработчик для кнопки добавления цели
        const addButton = card.querySelector('.btn-add-goal');
        addButton.addEventListener('click', () => {
            this.showAddGoalModal(sphere.name);
        });

        return card;
    }

    getCustomGoals(sphereName) {
        if (!this.data.customGoals) {
            this.data.customGoals = {};
        }
        return this.data.customGoals[sphereName] || [];
    }

    addCustomGoal(sphereName, goal) {
        if (!this.data.customGoals) {
            this.data.customGoals = {};
        }
        if (!this.data.customGoals[sphereName]) {
            this.data.customGoals[sphereName] = [];
        }
        this.data.customGoals[sphereName].push(goal);
        this.saveData();
    }

    showAddGoalModal(sphereName) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h3>✨ Добавить цель в сферу "${sphereName}"</h3>
            <div class="add-goal-form">
                <div class="form-group">
                    <label class="form-label">Название цели</label>
                    <input type="text" 
                           class="form-input" 
                           id="newGoalTitle"
                           placeholder="Например: Изучить английский 30 мин/день"
                           maxlength="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Описание (опционально)</label>
                    <textarea class="form-textarea" 
                              id="newGoalDescription"
                              placeholder="Дополнительные детали цели..."
                              rows="3"
                              maxlength="200"></textarea>
                </div>
                <div class="modal-actions">
                    <button class="btn btn--primary" onclick="app.saveNewGoal('${sphereName}')">
                        ➕ Добавить цель
                    </button>
                    <button class="btn btn--secondary" onclick="app.closeModal()">
                        Отмена
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modal').classList.add('modal--active');

        // Фокус на поле ввода
        setTimeout(() => {
            document.getElementById('newGoalTitle')?.focus();
        }, 100);

        // Обработка Enter
        document.getElementById('newGoalTitle')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveNewGoal(sphereName);
            }
        });
    }

    saveNewGoal(sphereName) {
        const title = document.getElementById('newGoalTitle')?.value.trim();
        const description = document.getElementById('newGoalDescription')?.value.trim();

        if (!title) {
            alert('Пожалуйста, введите название цели');
            return;
        }

        // Формируем текст цели
        let goalText = title;
        if (description) {
            goalText += ` (${description})`;
        }

        this.addCustomGoal(sphereName, goalText);
        this.closeModal();
        this.updateDashboard();

        // Показываем уведомление об успехе
        this.showNotification(`Цель добавлена в сферу "${sphereName}"!`, 'success');
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__text">${message}</span>
            <button class="notification__close">&times;</button>
        `;

        // Добавляем на страницу
        document.body.appendChild(notification);

        // Показываем анимацию
        setTimeout(() => notification.classList.add('notification--show'), 10);

        // Автоматическое скрытие через 4 секунды
        setTimeout(() => {
            this.hideNotification(notification);
        }, 4000);

        // Обработчик закрытия
        notification.querySelector('.notification__close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    updateWeeksView() {
        const weekNumberEl = document.getElementById('weekNumber');
        if (weekNumberEl) {
            weekNumberEl.textContent = this.currentWeek;
        }

        // Обновляем даты недели
        const weekStart = new Date(this.startDate);
        weekStart.setDate(weekStart.getDate() + (this.currentWeek - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekDatesEl = document.getElementById('weekDates');
        if (weekDatesEl) {
            weekDatesEl.textContent = `${this.formatDate(weekStart)} — ${this.formatDate(weekEnd)}`;
        }

        // Группируем задачи по сферам
        const tasksBySphere = {};
        this.weeklyTasks.forEach(task => {
            if (!tasksBySphere[task.sphere]) {
                tasksBySphere[task.sphere] = [];
            }
            tasksBySphere[task.sphere].push(task);
        });

        // Создаем HTML для задач
        const tasksContainer = document.getElementById('tasksContainer');
        if (tasksContainer) {
            tasksContainer.innerHTML = '';

            Object.keys(tasksBySphere).forEach(sphereName => {
                const sphere = this.spheres.find(s => s.name === sphereName);
                const tasks = tasksBySphere[sphereName];
                const sphereProgress = this.calculateSphereProgress(sphereName, this.currentWeek);

                const group = document.createElement('div');
                group.className = 'task-group';

                group.innerHTML = `
                    <div class="task-group__header">
                        <h3 class="task-group__title" style="color: ${sphere.color}">
                            ${sphereName}
                        </h3>
                        <span class="task-group__progress">
                            ${Math.round(sphereProgress)}%
                        </span>
                    </div>
                    <div class="tasks-list">
                        ${tasks.map(task => this.createTaskHTML(task, this.currentWeek)).join('')}
                    </div>
                `;

                tasksContainer.appendChild(group);
            });

            // Добавляем обработчики чекбоксов
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    this.toggleTask(e.target.dataset.taskId, this.currentWeek, e.target.checked);
                    this.updateDashboard();
                });
            });
        }
    }

    createTaskHTML(task, week) {
        const isCompleted = this.isTaskCompleted(task.id, week);
        const completedClass = isCompleted ? 'task-item--completed' : '';

        return `
            <div class="task-item ${completedClass}">
                <input type="checkbox" 
                       class="task-checkbox" 
                       data-task-id="${task.id}"
                       ${isCompleted ? 'checked' : ''}>
                <div class="task-info">
                    <div class="task-name">${task.task}</div>
                    <div class="task-details">${task.type} • ${task.days}</div>
                </div>
            </div>
        `;
    }

    updateHabitsView() {
        const habitsGrid = document.getElementById('habitsGrid');
        if (habitsGrid) {
            habitsGrid.innerHTML = '';

            this.dailyHabits.forEach(habit => {
                const card = this.createHabitCard(habit);
                habitsGrid.appendChild(card);
            });
        }
    }

    createHabitCard(habit) {
        const card = document.createElement('div');
        card.className = 'habit-card';

        const streak = this.calculateHabitStreak(habit.id);
        const currentWeekDays = this.getCurrentWeekDays();

        card.innerHTML = `
            <div class="habit-header">
                <h3 class="habit-name">${habit.name}</h3>
                <span class="habit-streak">${streak} дней подряд</span>
            </div>
            <div class="habit-calendar">
                ${currentWeekDays.map((day, index) => {
                    const isCompleted = this.isHabitCompleted(habit.id, day);
                    const isToday = this.isToday(day);
                    return `
                        <div class="habit-day ${isCompleted ? 'habit-day--completed' : ''} ${isToday ? 'habit-day--today' : ''}"
                             data-habit="${habit.id}" data-date="${day.toISOString().split('T')[0]}">
                            ${day.getDate()}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="form-group">
                <div class="progress-bar">
                    <div class="progress-bar__fill" style="width: ${this.calculateHabitWeekProgress(habit.id)}%"></div>
                </div>
            </div>
        `;

        // Добавляем обработчики для дней привычки
        card.querySelectorAll('.habit-day').forEach(day => {
            day.addEventListener('click', (e) => {
                const habitId = e.target.dataset.habit;
                const date = e.target.dataset.date;
                this.toggleHabit(habitId, date);
                this.updateHabitsView();
            });
        });

        return card;
    }

    updateRetrospectiveView() {
        const form = document.getElementById('retrospectiveForm');
        if (!form) return;

        const retrospective = this.data.retrospectives?.[this.currentWeek] || {};

        form.innerHTML = `
            <div class="form-group">
                <label class="form-label">Неделя ${this.currentWeek}</label>
            </div>

            <div class="form-group">
                <label class="form-label">🎉 Победы недели</label>
                <textarea class="form-textarea" 
                          data-field="victories"
                          placeholder="Чем гордитесь за эту неделю?">${retrospective.victories || ''}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">⚡ Барьеры и сложности</label>
                <textarea class="form-textarea" 
                          data-field="barriers"
                          placeholder="Что мешало достигать целей?">${retrospective.barriers || ''}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">🔧 Что улучшить на следующей неделе</label>
                <textarea class="form-textarea" 
                          data-field="improvements"
                          placeholder="Какие изменения внесёте?">${retrospective.improvements || ''}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">📊 Уровень тревоги (0-10)</label>
                <input type="number" class="form-input" 
                       data-field="anxiety"
                       min="0" max="10" 
                       value="${retrospective.anxiety || ''}"
                       placeholder="От 0 (спокойно) до 10 (очень тревожно)">
            </div>

            <button class="btn btn--primary" onclick="app.saveRetrospective()">
                💾 Сохранить ретроспективу
            </button>
        `;
    }

    saveRetrospective() {
        const form = document.getElementById('retrospectiveForm');
        const data = {};

        form.querySelectorAll('[data-field]').forEach(field => {
            data[field.dataset.field] = field.value;
        });

        if (!this.data.retrospectives) {
            this.data.retrospectives = {};
        }

        this.data.retrospectives[this.currentWeek] = data;
        this.saveData();

        this.showNotification('Ретроспектива сохранена!', 'success');
    }

    // Вспомогательные методы
    calculateOverallProgress() {
        let totalProgress = 0;
        this.spheres.forEach(sphere => {
            totalProgress += this.calculateSphereProgress(sphere.name);
        });
        return totalProgress / this.spheres.length;
    }

    calculateSphereProgress(sphereName, week = null) {
        const sphereTasks = this.weeklyTasks.filter(task => task.sphere === sphereName);
        if (sphereTasks.length === 0) return 0;

        let completed = 0;
        if (week) {
            // Progress for specific week
            sphereTasks.forEach(task => {
                if (this.isTaskCompleted(task.id, week)) completed++;
            });
        } else {
            // Overall progress across all weeks
            for (let w = 1; w <= this.currentWeek; w++) {
                sphereTasks.forEach(task => {
                    if (this.isTaskCompleted(task.id, w)) completed++;
                });
            }
            completed = completed / this.currentWeek;
        }

        return (completed / sphereTasks.length) * 100;
    }

    isTaskCompleted(taskId, week) {
        return this.data.tasks?.[`${taskId}_${week}`] || false;
    }

    toggleTask(taskId, week, completed) {
        if (!this.data.tasks) this.data.tasks = {};
        this.data.tasks[`${taskId}_${week}`] = completed;
        this.saveData();
    }

    isHabitCompleted(habitId, date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.data.habits?.[`${habitId}_${dateStr}`] || false;
    }

    toggleHabit(habitId, dateStr) {
        if (!this.data.habits) this.data.habits = {};
        const key = `${habitId}_${dateStr}`;
        this.data.habits[key] = !this.data.habits[key];
        this.saveData();
    }

    calculateHabitStreak(habitId) {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            if (this.isHabitCompleted(habitId, date)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    calculateHabitWeekProgress(habitId) {
        const weekDays = this.getCurrentWeekDays();
        let completed = 0;

        weekDays.forEach(day => {
            if (this.isHabitCompleted(habitId, day)) {
                completed++;
            }
        });

        return (completed / weekDays.length) * 100;
    }

    getCurrentWeekDays() {
        const days = [];
        const weekStart = new Date(this.startDate);
        weekStart.setDate(weekStart.getDate() + (this.currentWeek - 1) * 7);

        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            days.push(day);
        }

        return days;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    formatDate(date) {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Управление данными
    loadData() {
        const savedData = localStorage.getItem('lifePlannerData');
        if (savedData) {
            return JSON.parse(savedData);
        }

        return {
            tasks: {},
            habits: {},
            retrospectives: {},
            customGoals: {}
        };
    }

    saveData() {
        localStorage.setItem('lifePlannerData', JSON.stringify(this.data));
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `life-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Данные экспортированы!', 'success');
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.saveData();
                this.init();
                this.showNotification('Данные успешно импортированы!', 'success');
            } catch (error) {
                this.showNotification('Ошибка импорта файла', 'error');
            }
        };
        reader.readAsText(file);
    }

    closeModal() {
        document.getElementById('modal')?.classList.remove('modal--active');
    }
}

// Инициализация приложения
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new LifePlanner();
});

// Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
