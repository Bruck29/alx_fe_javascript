 let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

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
        quotes.push({ text: quote, category: category });
        localStorage.setItem('quotes', JSON.stringify(quotes));
        quoteInput.value = '';
        categoryInput.value = '';
        displayQuotes();
      } else {
        alert('Please enter both a quote and a category.');
      }
    }

    function displayQuotes() {
      const quoteList = document.getElementById('quoteList');
      quoteList.innerHTML = '';
      quotes.forEach((quote, index) => {
        const li = document.createElement('li');
        li.textContent = `"${quote.text}" - ${quote.category}`;
        quoteList.appendChild(li);
        li.onclick = () => saveLastViewedQuote(index); 
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
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'quotes.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
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

    document.addEventListener('DOMContentLoaded', () => {
      createAddQuoteForm(); 
      displayQuotes();
      loadLastViewedQuote();
    });