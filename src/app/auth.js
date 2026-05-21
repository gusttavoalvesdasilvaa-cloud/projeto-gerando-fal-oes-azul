const STORAGE_USERS = 'ecowater-users';
const STORAGE_CURRENT = 'ecowater-current-user';

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function findUser(email) {
  return getUsers().find((user) => user.email === email.toLowerCase());
}

function setCurrentUser(email) {
  localStorage.setItem(STORAGE_CURRENT, email.toLowerCase());
}

function getCurrentUser() {
  const email = localStorage.getItem(STORAGE_CURRENT);
  if (!email) return null;
  return findUser(email);
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_CURRENT);
}

function registerUser(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, message: 'Todos os campos são obrigatórios.' };
  }

  const normalizedEmail = email.toLowerCase();
  if (findUser(normalizedEmail)) {
    return { success: false, message: 'Este email já está cadastrado.' };
  }

  const users = getUsers();
  const newUser = { name, email: normalizedEmail, password, points: 0 };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(normalizedEmail);
  return { success: true, user: newUser };
}

function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Informe email e senha.' };
  }

  const user = findUser(email);
  if (!user) {
    return { success: false, message: 'Usuário não encontrado. Cadastre-se primeiro.' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Senha incorreta. Tente novamente.' };
  }

  setCurrentUser(user.email);
  return { success: true, user };
}

function updateUserPoints(email, additionalPoints) {
  const users = getUsers();
  const index = users.findIndex((user) => user.email === email.toLowerCase());
  if (index === -1) return null;
  users[index].points = (users[index].points || 0) + additionalPoints;
  saveUsers(users);
  return users[index].points;
}

function getUserPoints(email) {
  const user = findUser(email);
  return user ? user.points || 0 : 0;
}

function requireLogin(redirectUrl) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl || 'login.html';
    return null;
  }
  return user;
}
