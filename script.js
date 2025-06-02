const apiKey = '4d75183295913422ce61a3ccf141c259'; // Replace with your TMDb API key
const imageBaseURL = 'https://image.tmdb.org/t/p/w500';

let userLists = {
  favorites: [],
  watching: [],
  watched: [],
  later: []
};

function saveToLocalStorage() {
  localStorage.setItem('bingeLists', JSON.stringify(userLists));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('bingeLists');
  if (data) {
    userLists = JSON.parse(data);
  }
}

function showCategory(category) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (['favorites', 'watching', 'watched', 'later'].includes(category)) {
    const list = userLists[category];
    if (list.length === 0) {
      content.innerHTML = `<p>No items in ${category} list.</p>`;
      return;
    }
    list.forEach(item => {
      const card = createCard(item);
      content.appendChild(card);
    });
  } else {
    fetch(`https://api.themoviedb.org/3/${category}/popular?api_key=${apiKey}&language=en-US&page=1`)
      .then(response => response.json())
      .then(data => {
        data.results.forEach(item => {
          const card = createCard(item);
          content.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        content.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
      });
  }
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = item.title || item.name;
  const imagePath = item.poster_path ? `${imageBaseURL}${item.poster_path}` : 'placeholder.jpg';

  card.innerHTML = `
    <img src="${imagePath}" alt="${title}" />
    <h3>${title}</h3>
    <button onclick="addToList('favorites', ${item.id}, '${title}', '${item.poster_path}')">❤️ Favorite</button>
    <button onclick="addToList('watching', ${item.id}, '${title}', '${item.poster_path}')">👀 Watching</button>
    <button onclick="addToList('watched', ${item.id}, '${title}', '${item.poster_path}')">✅ Watched</button>
    <button onclick="addToList('later', ${item.id}, '${title}', '${item.poster_path}')">🕒 Later</button>
    <button onclick="removeFromLists(${item.id})">🗑️ Remove</button>
  `;
  return card;
}

function addToList(listName, id, title, posterPath) {
  const exists = userLists[listName].some(item => item.id === id);
  if (!exists) {
    userLists[listName].push({ id, title, poster_path: posterPath });
    saveToLocalStorage();
    alert(`${title} added to ${listName}`);
  } else {
    alert(`${title} is already in ${listName}`);
  }
}

function removeFromLists(id) {
  let removed = false;
  for (const listName in userLists) {
    const index = userLists[listName].findIndex(item => item.id === id);
    if (index !== -1) {
      userLists[listName].splice(index, 1);
      removed = true;
    }
  }
  if (removed) {
    saveToLocalStorage();
    alert('Item removed from your lists');
    showCategory('favorites'); // Refresh the current view
  } else {
    alert('Item not found in your lists');
  }
}

window.onload = () => {
  loadFromLocalStorage();
  showCategory('movie');
};
