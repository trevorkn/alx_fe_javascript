const quotes = [
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

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>- ${randomQuote.category}</small>
  `;
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

// Attach event and run functions after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();  // <-- this line satisfies the requirement
  renderQuoteList();
});
