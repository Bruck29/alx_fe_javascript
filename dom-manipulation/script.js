
        let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

        function addQuote() {
            const newQuote = document.getElementById('newQuote').value;
            if (newQuote) {
                quotes.push(newQuote);
                localStorage.setItem('quotes', JSON.stringify(quotes));
                displayQuotes();
                document.getElementById('newQuote').value = '';
            }
        }

        function displayQuotes() {
            const quoteList = document.getElementById('quoteList');
            quoteList.innerHTML = '';
            quotes.forEach((quote, index) => {
                const li = document.createElement('li');
                li.textContent = quote;
                quoteList.appendChild(li);
            });
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

        function saveLastViewedQuote(index) {
            sessionStorage.setItem('lastViewedQuote', index);
        }

        function loadLastViewedQuote() {
            const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
            if (lastViewedQuote !== null) {
                alert(`Last viewed quote: ${quotes[lastViewedQuote]}`);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            displayQuotes();
            loadLastViewedQuote();
        });