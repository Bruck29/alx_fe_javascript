let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

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

    document.addEventListener('DOMContentLoaded', () => {
      displayQuotes();
      loadLastViewedQuote(); });