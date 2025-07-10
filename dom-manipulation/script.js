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

  //update category dropdown if the category is new
  const categorySelect = document.getElementById("categoryFilter");
  const existingOptions = Array.from(categorySelect.options).map(opt => opt.value);
  if (!existingOptions.includes(quoteCategory)) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory.charAt(0).toUpperCase() + quoteCategory.slice(1);
    categorySelect.appendChild(newOption);
  }

  //Optional: re-save the currently selected category (to persist context)
  localStorage.setItem("selectedCategory", categorySelect.value);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  showRandomQuote();
  renderQuoteList();
  filterQuotes();
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
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const categories = new Set();

    quotes.forEach(quote => {
      categories.add(quote.category);
    });

    //Clear existing options except the first "All Categories"
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categorySelect.appendChild(option);
    });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  //save the selected category to local storage
  localStorage.setItem("selectedCategory", selectedCategory);

  const listContainer = document.getElementById("quoteList");
  listContainer.innerHTML = ""

  const filteredQuotes = selectedCategory === "all"
  ? quotes
  : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    listContainer.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }
  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" -${quote.category}`;
    listContainer.appendChild(p);
  });
}

const serverAPI = "https://jsonplaceholder.typicode.com/posts";

//function 5 quotes from server and display them
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(serverAPI);
    const data = await res.json();

    const container = document.getElementById("serverQuotes");
    container.innerHTML = "<h3>Fetched from Server:</h3>";

    const localQuotes = JSON.parse(localStorage.getItem("allQuotes")) || [];
    let updated = false;

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: post.body
    }));

    serverQuotes.forEach((serverQuote, i) => {
      const p = document.createElement("p");
      p.textContent = `"${serverQuote.text}" - (${serverQuote.category}) [ID: ${i + 1}]`;
      container.appendChild(p);

      const localIndex = localQuotes.findIndex(q => q.text === serverQuote.text);

      if (localIndex === -1) {
        localQuotes.push(serverQuote);
        updated = true;
      } else if (localQuotes[localIndex].category !== serverQuote.category) {
        const userChoice = confirm(`Conflict detected for quote:\n"${serverQuote.text}"\n\nLocal category: "${localQuotes[localIndex].category}"\nServer category: "${serverQuote.category}"\n\nDo you want to replace the local version with the server version?`);
        if (userChoice) {
          localQuotes[localIndex] = serverQuote;
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem("allQuotes", JSON.stringify(localQuotes));
      quotes = localQuotes;
      renderQuoteList();
      populateCategories();

      const notice = document.getElementById("syncNotice");
      if (notice) {
        notice.textContent = "Quotes updated from server.";
        setTimeout(() => {
          notice.textContent = "";
        }, 5000);
      }
    }
  } catch (err) {
    console.error("Failed to fetch from server:", err);
  }
}

function postLocalQuotesToServer () {
  const allQuotes = JSON.parse(localStorage.getItem("allQuotes")) || [];

  if (allQuotes.length === 0) {
    alert("No quotes in localStorage to post.");
    return;
  }
  
  allQuotes.forEach((quote, index) => {
    const payload = {
      title: quote.text,
      body: quote.category,
      userId: 1
    };
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      console.log(`Posted quote #${index + 1}:`, data);
      if (index === allQuotes.length - 1) {
        alert("All local quotes posted to server (simulated).");
      }
    })
    .catch(err => {
      console.error(`Failed to post quote #${index + 1}:`, err);
    });
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

  populateCategories();

  //Restore last selected category from local storage
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.value = savedCategory;
    filterQuotes()
  }
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 15000);
  document.getElementById("postServerQuote").addEventListener("click", postLocalQuotesToServer);
});
