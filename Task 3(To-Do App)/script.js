// Task Management System
class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
    }

    initializeElements() {
        // Input elements
        this.taskInput = document.getElementById('taskInput');
        this.taskPriority = document.getElementById('taskPriority');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        
        // Filter and sort elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortTasks');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Display elements
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.progressBar = document.getElementById('progressBar');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.progressDetails = document.getElementById('progressDetails');
        
        // Stats elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editTaskPriority = document.getElementById('editTaskPriority');
        this.closeModalBtn = document.getElementById('closeModal');
        this.cancelEditBtn = document.getElementById('cancelEdit');
        this.saveEditBtn = document.getElementById('saveEdit');
        
        // Notification container
        this.notificationContainer = document.getElementById('notificationContainer');
    }

    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });

        // Sort event
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        // Clear all event
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());

        // Modal events
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.saveEditBtn.addEventListener('click', () => this.saveTaskEdit());
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });

        // Edit input keypress
        this.editTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveTaskEdit();
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editModal.classList.contains('active')) {
                this.closeEditModal();
            }
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTask() {
        const text = this.taskInput.value.trim();
        const priority = this.taskPriority.value;

        if (!text) {
            this.showNotification('Please enter a task!', 'error');
            this.taskInput.focus();
            return;
        }

        if (text.length < 3) {
            this.showNotification('Task must be at least 3 characters long!', 'error');
            return;
        }

        const task = {
            id: this.generateId(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();

        // Clear input
        this.taskInput.value = '';
        this.taskPriority.value = 'medium';

        // Show success notification
        this.showNotification('Task added successfully!', 'success');

        // Add animation to new task
        setTimeout(() => {
            const taskElement = this.tasksList.querySelector('.task-item');
            if (taskElement) {
                taskElement.style.animation = 'none';
                taskElement.offsetHeight; // Trigger reflow
                taskElement.style.animation = 'slideIn 0.3s ease-out';
            }
        }, 10);
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        
        if (taskElement) {
            taskElement.style.animation = 'slideOut 0.3s ease-out';
            taskElement.addEventListener('animationend', () => {
                this.tasks.splice(taskIndex, 1);
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.updateProgress();
                this.showNotification('Task deleted!', 'info');
            });
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();

            const message = task.completed ? 'Task completed! 🎉' : 'Task marked as pending';
            this.showNotification(message, task.completed ? 'success' : 'info');
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            this.editTaskInput.value = task.text;
            this.editTaskPriority.value = task.priority;
            this.openEditModal();
        }
    }

    saveTaskEdit() {
        const newText = this.editTaskInput.value.trim();
        const newPriority = this.editTaskPriority.value;

        if (!newText) {
            this.showNotification('Task cannot be empty!', 'error');
            return;
        }

        if (newText.length < 3) {
            this.showNotification('Task must be at least 3 characters long!', 'error');
            return;
        }

        const task = this.tasks.find(task => task.id === this.editingTaskId);
        if (task) {
            task.text = newText;
            task.priority = newPriority;
            
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    openEditModal() {
        this.editModal.classList.add('active');
        this.editTaskInput.focus();
        this.editTaskInput.select();
    }

    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editingTaskId = null;
    }

    clearAllTasks() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to clear!', 'info');
            return;
        }

        const confirmed = confirm('Are you sure you want to delete all tasks? This action cannot be undone.');
        if (confirmed) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();
            this.showNotification('All tasks cleared!', 'info');
        }
    }

    filterTasks(tasks) {
        switch (this.currentFilter) {
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'pending':
                return tasks.filter(task => !task.completed);
            default:
                return tasks;
        }
    }

    sortTasks(tasks) {
        switch (this.currentSort) {
            case 'oldest':
                return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return tasks.sort((a, b) => {
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
            case 'alphabetical':
                return tasks.sort((a, b) => a.text.localeCompare(b.text));
            default: // newest
                return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    renderTasks() {
        let filteredTasks = this.filterTasks([...this.tasks]);
        filteredTasks = this.sortTasks(filteredTasks);

        if (filteredTasks.length === 0) {
            this.tasksList.style.display = 'none';
            this.emptyState.style.display = 'block';
            
            // Update empty state message based on filter
            const emptyMessages = {
                all: 'No tasks yet',
                completed: 'No completed tasks',
                pending: 'No pending tasks'
            };
            
            this.emptyState.querySelector('h3').textContent = emptyMessages[this.currentFilter];
        } else {
            this.tasksList.style.display = 'block';
            this.emptyState.style.display = 'none';
        }

        this.tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');

        // Bind task events
        this.bindTaskEvents();
    }

    createTaskHTML(task) {
        const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const completedDate = task.completedAt ? 
            new Date(task.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : null;

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask('${task.id}')">
                    <i class="fas fa-check"></i>
                </div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                        <span class="task-date">
                            ${task.completed && completedDate ? `Completed: ${completedDate}` : `Created: ${createdDate}`}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" onclick="todoApp.editTask('${task.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete-btn" onclick="todoApp.deleteTask('${task.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindTaskEvents() {
        // This method is called after rendering tasks to ensure all events are properly bound
        // Individual task events are handled via onclick attributes for simplicity
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        // Animate counter updates
        this.animateCounter(this.totalTasksEl, total);
        this.animateCounter(this.completedTasksEl, completed);
        this.animateCounter(this.pendingTasksEl, pending);
    }

    updateProgress() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const percentage = total === 0 ? 0 : Math.max(0, Math.min(100, Math.round((completed / total) * 100)));

        // Update progress circle
        const circumference = 283; // 2 * π * 45 (radius)
        const offset = circumference - (percentage / 100) * circumference;
        
        this.progressBar.style.strokeDashoffset = offset;
        
        // Update progress text with animation
        this.animatePercentage(this.progressPercentage, percentage);
        this.progressDetails.textContent = `${completed}/${total} tasks`;

        // Add completion celebration
        if (total > 0 && percentage === 100) {
            this.celebrateCompletion();
        }
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        
        // Ensure targetValue is not negative
        targetValue = Math.max(0, targetValue);
        
        // If values are the same, no animation needed
        if (currentValue === targetValue) {
            element.textContent = targetValue;
            return;
        }
        
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = 500; // ms
        const steps = Math.abs(targetValue - currentValue);
        const stepDuration = steps === 0 ? 0 : Math.max(10, duration / steps); // Minimum 10ms per step

        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            
            // Ensure current value doesn't go below 0 or beyond target
            if (increment > 0) {
                current = Math.min(current, targetValue);
            } else {
                current = Math.max(0, Math.max(current, targetValue));
            }
            
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    animatePercentage(element, targetPercentage) {
        const currentPercentage = parseInt(element.textContent) || 0;
        
        // Ensure targetPercentage is within valid bounds
        targetPercentage = Math.max(0, Math.min(100, targetPercentage));
        
        // If values are the same, no animation needed
        if (currentPercentage === targetPercentage) {
            element.textContent = `${targetPercentage}%`;
            return;
        }
        
        const increment = targetPercentage > currentPercentage ? 1 : -1;
        const duration = 500; // ms
        const steps = Math.abs(targetPercentage - currentPercentage);
        const stepDuration = steps === 0 ? 0 : Math.max(10, duration / steps); // Minimum 10ms per step

        let current = currentPercentage;
        const timer = setInterval(() => {
            current += increment;
            
            // Ensure current percentage stays within valid bounds (0-100)
            if (increment > 0) {
                current = Math.min(current, targetPercentage);
            } else {
                current = Math.max(0, Math.max(current, targetPercentage));
            }
            
            element.textContent = `${current}%`;
            
            if (current === targetPercentage) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    celebrateCompletion() {
        // Create celebration effect
        this.showNotification('🎉 All tasks completed! Great job!', 'success');
        
        // Add a temporary celebration class to progress circle
        const progressCircle = document.getElementById('progressCircle');
        progressCircle.style.animation = 'pulse 0.6s ease-in-out 3';
        
        setTimeout(() => {
            progressCircle.style.animation = '';
        }, 1800);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        this.notificationContainer.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    // Export tasks to JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Tasks exported successfully!', 'success');
    }

    // Import tasks from JSON
    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    this.tasks = importedTasks;
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.updateProgress();
                    this.showNotification('Tasks imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showNotification('Error reading file!', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Search functionality
    searchTasks(query) {
        const filteredTasks = this.tasks.filter(task => 
            task.text.toLowerCase().includes(query.toLowerCase())
        );
        
        // Temporarily override the filter to show search results
        const originalFilter = this.currentFilter;
        this.renderTasksWithCustomFilter(filteredTasks);
    }

    renderTasksWithCustomFilter(tasks) {
        if (tasks.length === 0) {
            this.tasksList.style.display = 'none';
            this.emptyState.style.display = 'block';
            this.emptyState.querySelector('h3').textContent = 'No matching tasks found';
        } else {
            this.tasksList.style.display = 'block';
            this.emptyState.style.display = 'none';
        }

        this.tasksList.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
        this.bindTaskEvents();
    }
}

// Add slideOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task quickly
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === document.getElementById('taskInput')) {
            todoApp.addTask();
        }
    }
    
    // Ctrl/Cmd + E to export tasks
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        todoApp.exportTasks();
    }
});

// Add search functionality to the header (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
    // Add search input to header if needed
    const searchFeature = `
        <div class="search-container" style="margin-top: 1rem;">
            <input type="text" id="searchInput" placeholder="Search tasks..." 
                   style="width: 100%; padding: 0.75rem; border: 2px solid rgba(255,255,255,0.3); 
                          border-radius: 8px; background: rgba(255,255,255,0.1); color: white; outline: none;">
        </div>
    `;
    
    // Uncomment the next line if you want to add search functionality
    // document.querySelector('.header-content').insertAdjacentHTML('beforeend', searchFeature);
});

// Performance optimization: Debounced search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker if you want PWA functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}