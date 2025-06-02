const data = {
  movies: ['Barbie', 'The Princess Diaries'],
  kdrama: ['Crash Landing on You', 'Goblin'],
  cdrama: ['Love O2O', 'Eternal Love'],
  thaidrama: ['2gether', 'F4 Thailand'],
};

const userList = {
  favorite: [],
  watching: [],
  watched: [],
  saveForLater: [],
};

function saveToStorage() {
  localStorage.setItem('bingeList', JSON.stringify(userList));
}

function loadFromStorage() {
  const saved = localStorage.getItem('bingeList');
  if (saved) Object.assign(userList, JSON.parse(saved));
}

function showCategory(category) {
  const container = document.getElementById('content');
  container.innerHTML = '';

  if (category === 'saved') {
    Object.keys(userList).forEach(listName => {
      container.innerHTML += `<h2>${listName.charAt(0).toUpperCase() + listName.slice(1)}</h2>`;
      userList[listName].forEach(item => {
        container.innerHTML += `<div class="card">${item}</div>`;
      });
    });
    return;
  }

  data[category].forEach(title => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${title}</strong><br/>
      <button onclick="addToList('favorite', '${title}')">❤️ Favorite</button>
      <button onclick="addToList('watching', '${title}')">👀 Watching</button>
      <button onclick="addToList('watched', '${title}')">✅ Watched</button>
      <button onclick="addToList('saveForLater', '${title}')">🕒 Later</button>`;
    container.appendChild(card);
  });
}

function addToList(listName, title) {
  if (!userList[listName].includes(title)) {
    userList[listName].push(title);
    saveToStorage();
    alert(`Added to ${listName}`);
  } else {
    alert('Already added');
  }
}

window.onload = () => {
  loadFromStorage();
  showCategory('movies');
};
