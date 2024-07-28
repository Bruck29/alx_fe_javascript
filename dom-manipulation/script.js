let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const data = await response.json();
    const serverQuotes = data.map(item => ({ text: item.title, category: item.body }));
    syncQuotes(serverQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

function syncQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const mergedQuotes = [...new Set([...serverQuotes.map(JSON.stringify), ...localQuotes.map(JSON.stringify)])].map(JSON.parse);
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  displayQuotes();
  populateCategories();
  document.getElementById('syncMessage').textContent = "Quotes synced with server!";
}

setInterval(fetchQuotesFromServer, 10000);

document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  displayQuotes();
  populateCategories();
  loadLastViewedQuote();
  loadLastSelectedFilter();
  fetchQuotesFromServer();
});

function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteForm');
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuote';
  quoteInput.placeholder = 'Enter a new quote';
  
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'quoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;
  
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

function addQuote() {
  const quoteInput = document.getElementById('newQuote');
  const categoryInput = document.getElementById('quoteCategory');
  const quote = quoteInput.value;
  const category = categoryInput.value;
  if (quote && category) {
    const newQuote = { text: quote, category: category };
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    postQuoteToServer(newQuote);
    quoteInput.value = '';
    categoryInput.value = '';
    displayQuotes();
    populateCategories();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: quote.text, body: quote.category }),
    });
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

function displayQuotes() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  quotes.forEach((quote, index) => {
    if (selectedCategory === 'all' || quote.category === selectedCategory) {
      const li = document.createElement('li');
      li.textContent = `"${quote.text}" - ${quote.category}`;
      quoteDisplay.appendChild(li);
      li.onclick = () => saveLastViewedQuote(index);
    }
  });
}

function saveLastViewedQuote(index) {
  sessionStorage.setItem('lastViewedQuote', index);
}

function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote !== null) {
    const quote = quotes[lastViewedQuote];
    alert(`Last viewed quote: "${quote.text}" - ${quote.category}`);
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const exportFileDefaultName = 'quotes.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    displayQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function showRandomQuote() {
  if (quotes.length === 0) {
    alert('No quotes available.');
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const randomQuoteElement = document.getElementById('randomQuote');
  randomQuoteElement.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  displayQuotes();
}

function loadLastSelectedFilter() {
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
    filterQuotes();
  }
}