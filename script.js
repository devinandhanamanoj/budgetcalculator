
const USERS_KEY = 'budget_app_users';
const SESSION_KEY = 'budget_app_session';

function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function registerUser() {
    const regUsername = document.getElementById('regUsername');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const registerMessage = document.getElementById('registerMessage');

    const username = regUsername.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    registerMessage.className = 'message';

    if (!username || !email || !password) {
        registerMessage.textContent = 'All fields are required.';
        registerMessage.classList.add('error');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        registerMessage.textContent = 'Please enter a valid email address.';
        registerMessage.classList.add('error');
        return;
    }
    if (password.length < 4) {
        registerMessage.textContent = 'Password must be at least 4 characters.';
        registerMessage.classList.add('error');
        return;
    }

    const users = getUsers();
    if (users.some(u => u.username === username)) {
        registerMessage.textContent = 'Username already exists. Choose another.';
        registerMessage.classList.add('error');
        return;
    }
    if (users.some(u => u.email === email)) {
        registerMessage.textContent = 'Email already registered. Try logging in.';
        registerMessage.classList.add('error');
        return;
    }

    users.push({ username: username, email: email, password: password });
    saveUsers(users);

    registerMessage.textContent = '✅ Registration successful! Redirecting to login...';
    registerMessage.classList.add('success');

    regUsername.value = '';
    regEmail.value = '';
    regPassword.value = '';
    setTimeout(function () {
        window.location.href = 'login.html';
    }, 1500);
}

function loginUser() {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    loginMessage.className = 'message';

    if (!email || !password) {
        loginMessage.textContent = 'Please enter email and password.';
        loginMessage.classList.add('error');
        return;
    }

    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
        loginMessage.textContent = 'Invalid email or password.';
        loginMessage.classList.add('error');
        return;
    }
    setSession({ username: foundUser.username, email: foundUser.email });
    window.location.href = 'index.html';
}

let currentIncome = 0;
let incomeSet = false;

function initBudgetPage() {
    const session = getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('greeting').textContent = 'Hey, ' + session.username + '!';
}

function logoutUser() {
    clearSession();
    window.location.href = 'login.html';
}

function calculateIncome() {
    const totalIncome = document.getElementById('totalIncome');
    const incomeDisplay = document.getElementById('incomeDisplay');
    const incomeValue = document.getElementById('incomeValue');
    const expensesSection = document.getElementById('expensesSection');

    const incomeVal = parseFloat(totalIncome.value);

    if (isNaN(incomeVal) || incomeVal <= 0) {
        alert('Please enter a valid positive income amount.');
        return;
    }

    currentIncome = incomeVal;
    incomeSet = true;

    incomeValue.textContent = 'R ' + incomeVal.toFixed(2);
    incomeDisplay.classList.remove('hidden');
    expensesSection.classList.remove('hidden');
    document.getElementById('rent').value = '0';
    document.getElementById('groceries').value = '0';
    document.getElementById('transport').value = '0';
    document.getElementById('entertainment').value = '0';
    document.getElementById('other').value = '0';

    document.getElementById('balanceAmount').textContent = 'R ' + incomeVal.toFixed(2);
    document.getElementById('balanceMessage').className = 'message';
    document.getElementById('insufficientMessage').style.display = 'none';
}

function calculateBalance() {
    if (!incomeSet) {
        alert('Please calculate your income first.');
        return;
    }

    const rentVal = parseFloat(document.getElementById('rent').value) || 0;
    const groceriesVal = parseFloat(document.getElementById('groceries').value) || 0;
    const transportVal = parseFloat(document.getElementById('transport').value) || 0;
    const entertainmentVal = parseFloat(document.getElementById('entertainment').value) || 0;
    const otherVal = parseFloat(document.getElementById('other').value) || 0;

    const totalExpenses = rentVal + groceriesVal + transportVal + entertainmentVal + otherVal;
    const balance = currentIncome - totalExpenses;

    const balanceAmount = document.getElementById('balanceAmount');
    const balanceMessage = document.getElementById('balanceMessage');
    const insufficientMessage = document.getElementById('insufficientMessage');

    balanceAmount.textContent = 'R ' + balance.toFixed(2);
    balanceMessage.className = 'message';
    insufficientMessage.style.display = 'none';

    if (balance > 0) {
        balanceMessage.textContent = 'You have saved R ' + balance.toFixed(2) + '.';
        balanceMessage.classList.add('success');
    } else if (balance < 0) {
        const overspent = Math.abs(balance);
        balanceMessage.textContent = 'You have overspent by R ' + overspent.toFixed(2) + '.';
        balanceMessage.classList.add('error');
        insufficientMessage.style.display = 'block';
    } else {
        balanceMessage.textContent = 'You have R 0.00 left.';
        balanceMessage.classList.add('success');
    }
}