const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        category:"inspiration"
    },
    {
        text: "I'm not arguing, I'm just explaining why i'm right.",
        category: "humor"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        category: "life"
    },
    {
        text: "You miss 100%  of the shorts you don't take.",
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
 document.getElementById("newQuote").addEventListener("click", showRandomQuote);

 function addQuote() {
    // Get input values
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    //check if both fields are filled
    if (quoteText === "" || quoteCategory === ""){
        alert("Please enter both quote text and category.");
        return;
    }

    //create new quote object
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    //Add to quote array
    quotes.push(newQuote);

    //Optional clear form inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
 }
 quotes.forEach(quote => {
  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;
  document.body.appendChild(p);
});

