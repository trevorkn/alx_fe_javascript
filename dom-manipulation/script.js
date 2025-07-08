let quotes = JSON.parse(localStorage.getItem("allQuotes"));
if(!quotes) {
    
 quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "inspiration"
  },
  {
    text: "I'm not arguing, I'm just explaining why I'm right.",
    category: "humor"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "life"
  },
  {
    text: "You miss 100% of the shots you don't take.",
    category: "motivation"
  },
  {
    text: "To love and be loved is to feel the sun from both sides.",
    category: "love"
  }
];
}
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>- ${randomQuote.category}</small>
  `;

  //Load quotes from sessionStorage (or initialize empty array)
  let shownQuotes = JSON.parse(sessionStorage.getItem("shownQuotes")) || [];

  //optional: prevent duplicates
  const alreadyShown = shownQuotes.some(
    q => q.text === randomQuote.text && q.category === randomQuote.category
  );
  if (!alreadyShown) {
    shownQuotes.push(randomQuote);
    sessionStorage.setItem("shownQuotes", JSON.stringify(shownQuotes));
  }
}

function renderQuoteList() {
  const listContainer = document.getElementById("quoteList");
  listContainer.innerHTML = "";

  quotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    listContainer.appendChild(p);
  });
}

function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);
  localStorage.setItem("allQuotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
  renderQuoteList();
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  inputText.type = "text";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.type = "text";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

function syncSessionToLocal() {
    const sessionQuotes = sessionStorage.getItem("shownQuotes");
    if (sessionQuotes) {
        localStorage.setItem("shownQuotesBackup", sessionQuotes);
    }
}

function exportQuotesToJSON() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], {type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
     const fileReader = new FileReader();
     fileReader.onload = function(event) {
       const importedQuotes = JSON.parse(event.target.result);
       importedQuotes.forEach(newQuote => {
        const exists = quotes.some(q => q.text === newQuote.text && q.category === newQuote.category);
        if (!exists) {
            quotes.push(newQuote);
        }
       })
       saveQuotes();
       alert("Quotes imported Successfully!")
       
     };
     fileReader.readAsText(event.target.files[0]); 
}
function saveQuotes() {
    //save to localStorage
    localStorage.setItem("allQuotes", JSON.stringify(quotes));

    //update for the UI to show all quotes
    updateQuoteListUI();
}

function updateQuoteListUI() {
    const quoteListDiv = document.getElementById("quoteList");
    quoteListDiv.innerHTML = ""
    
    quotes.forEach((quote) => {
        const quoteElement = document.createElement("div");
        quoteElement.textContent = `"${quote.text}" - [${quote.category}]`;
        quoteListDiv.appendChild(quoteElement);
    });
}
// Attach event and run functions after DOM is ready
document.addEventListener("DOMContentLoaded", () => {

    //Restore session from localstorage
    if (!sessionStorage.getItem("shownQuotes")) {
      const backup = localStorage.getItem("shownQuotesBackup");
      if (backup) {
        sessionStorage.setItem("shownQuotes", backup);
      }
    }

    document.getElementById("exportQuotes").onclick = exportQuotesToJSON;
    
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();  // <-- this line satisfies the requirement
  renderQuoteList();
  
  //Star syncing sessionStorage to localStorage every 2 minutes
  setInterval(syncSessionToLocal, 2 * 60 * 1000);

  //Sync one last time before the page unloads
  window.addEventListener("beforeunload", syncSessionToLocal);
});
