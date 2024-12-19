// Global variables to store user data
let currentUser = null;
let calendars = [];
let events = {};
let publicCalendars = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Login user
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For simplicity, use a basic check (replace with an API call in a real application)
    if (username === 'user' && password === 'password') {
        currentUser = username;
        document.getElementById('user-name').innerText = currentUser;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        loadUserCalendars();
        loadPublicCalendars();
        loadCalendar();
    } else {
        alert('Invalid credentials');
    }
}

// Create a new account
function createAccount() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    // For simplicity, we only check if fields are filled
    if (username && password) {
        alert('Account created successfully!');
        toggleForms();
    } else {
        alert('Please fill in all fields');
    }
}

// Toggle between login and registration forms
function toggleForms() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Load user calendars
function loadUserCalendars() {
    const userCalendarsList = document.getElementById('user-calendars');
    userCalendarsList.innerHTML = '';
    calendars.forEach((cal, index) => {
        const li = document.createElement('li');
        li.innerText = cal.name;
        li.setAttribute('onclick', `viewCalendar(${index})`);
        userCalendarsList.appendChild(li);
    });
}

// Load public calendars
function loadPublicCalendars() {
    const publicCalendarsList = document.getElementById('public-calendars');
    publicCalendarsList.innerHTML = '';
    publicCalendars.forEach((cal, index) => {
        const li = document.createElement('li');
        li.innerText = cal.name;
        publicCalendarsList.appendChild(li);
    });
}

// Create a new calendar
function createCalendar() {
    const calendarName = prompt('Enter calendar name:');
    if (calendarName) {
        calendars.push({ name: calendarName, events: [] });
        loadUserCalendars();
    }
}

// View a calendar
function viewCalendar(index) {
    const calendar = calendars[index];
    document.getElementById('calendar-title').innerText = calendar.name;
    document.getElementById('calendar-view').style.display = 'block';
    loadCalendar();
}

// Load a calendar view
function loadCalendar() {
    const monthYear = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    monthYear.innerText = `${getMonthName(currentMonth)} ${currentYear}`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDay();

    // Create day elements
    let dayIndex = 1;
    for (let row = 0; row < 6; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 7; col++) {
            const td = document.createElement('td');
            if ((row === 0 && col < firstDayOfMonth) || dayIndex > daysInMonth) {
                td.className = 'calendar-day other-month';
            } else {
                td.className = 'calendar-day';
                td.innerText = dayIndex++;
                td.setAttribute('onclick', `viewEvents(${td.innerText})`);
            }
            tr.appendChild(td);
        }
        calendarGrid.appendChild(tr);
    }
}

// Get month name from month index
function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}

// Navigate through months
function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
}

// Navigate through years
function navigateYear(direction) {
    currentYear += direction;
    loadCalendar();
}

// View events for a day
function viewEvents(day) {
    const eventsList = document.getElementById('event-list');
    eventsList.innerHTML = '';

    const selectedDate = `${currentYear}-${currentMonth + 1}-${day}`;
    const calendar = calendars.find(cal => cal.name === document.getElementById('calendar-title').innerText);
    const dayEvents = calendar.events.filter(event => event.date === selectedDate);

    dayEvents.forEach(event => {
        const li = document.createElement('li');
        li.innerText = event.name;
        eventsList.appendChild(li);
    });
}

// Add event to a calendar
function addEvent() {
    const eventName = prompt('Enter event name:');
    const eventDate = `${currentYear}-${currentMonth + 1}-${new Date().getDate()}`;
    if (eventName) {
        const calendar = calendars.find(cal => cal.name === document.getElementById('calendar-title').innerText);
        calendar.events.push({ name: eventName, date: eventDate });
        loadCalendar();
    }
}

// Modify an event
function modifyEvent() {
    const eventName = prompt('Enter the name of the event to modify:');
    const newEventName = prompt('Enter new name for the event:');
    const calendar = calendars.find(cal => cal.name === document.getElementById('calendar-title').innerText);
    const event = calendar.events.find(evt => evt.name === eventName);
    if (event && newEventName) {
        event.name = newEventName;
        loadCalendar();
    } else {
        alert('Event not found');
    }
}

// Delete an event
function deleteEvent() {
    const eventName = prompt('Enter the name of the event to delete:');
    const calendar = calendars.find(cal => cal.name === document.getElementById('calendar-title').innerText);
    const eventIndex = calendar.events.findIndex(evt => evt.name === eventName);
    if (eventIndex !== -1) {
        calendar.events.splice(eventIndex, 1);
        loadCalendar();
    } else {
        alert('Event not found');
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('user-name').innerText = '';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
}
