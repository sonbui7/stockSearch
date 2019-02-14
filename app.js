// Stocks array
const stocksList = ['TACO', 'AAPL', 'MSFT', 'TSLA'];

const displayStocks = function () {
    const stock = $(this).attr('data-name');
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,chart&range=1m&last=20`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {

        $('#stock-main').empty();
        $('#stock-info').empty();
        // Creating a new div with a class called "stock-main"
        const stockMain = $('<div>').addClass("stock");
        // Variable that takes in the object of companyName
        const companyName = response.quote.companyName;
        // Variable that created a paragraph tag that has company name inside
        const info1 = $('<p>').text(`Company Name: ${companyName}`);
        // Appended paragraph tag into the Div
        (stockMain).append(info1);

        const stockName = response.quote.symbol;
        const info2 = $('<p>').html(`Stock Symbol: ${stockName}`);
        (stockMain).append(info2);

        const stockPrice = response.quote.latestPrice;
        const info3 = $('<p>').html(`Latest Stock Price ${stockPrice}`);
        (stockMain).append(info3);

        $("#stock-main").append(stockMain)

        for (i = 0; i < 10; i++) {
            const stockSummary = response.news[i].summary
            const stockHeadline = response.news[i].headline
            if (stockSummary === "No summary available.") {
                $('#stock-info').append(`<p>${stockHeadline}</p>`)
            } else {
                $('#stock-info').append(`<p>${stockSummary}</p>`)
            }
        }
    })

}


/* Render function which empties our stock button list
   For loop runs which creates a new button for each stockList
   Adds a class to each stockList
   Gives it a dataname of the StockList
   Appends the new stock button to our stock-buttons array */

const render = function () {
    $('#stock-buttons').empty()

    for (i = 0; i < stocksList.length; i++) {
        const newButton = $(`<button>${stocksList[i]}</button>`);
        newButton.addClass('newStockBtns btn btn-dark');
        newButton.attr('data-name', stocksList[i]);
        $('#stock-buttons').append(newButton);
    };
};

/* preventDefault makes it to where it doesn't refresh the page every time
   you press the button

   Every time we put a stock into the input field and press submit, the 
   variable newStocks captures the value and uppercases it

   newStocks is then pushed into the stocksList array */

const addBtn = function (e) {
    e.preventDefault();
    console.log("This is working")

    const stocksURL = "https://api.iextrading.com/1.0/ref-data/symbols"
    const stocksArray = [];
    $.ajax({
        method: 'GET',
        url: stocksURL
    }).then(function (response) {
        for (i = 0; i < response.length; i++) {
            stocksArray.push(response[i].symbol);
        };

        const stock = $('#stock-input').val().toUpperCase();

        for (i = 0; i < stocksArray.length; i++) {
            if (stocksArray[i] === stock) {
                stocksList.push(stock);
                $('#stock-input').val("");
                render();
                return
            };
        }; 

        alert("Please enter a valid stock symbol");
    });

};
// On click function which adds a stock button
$('#addStockButton').on('click', addBtn);

$('#stock-buttons').on('click', ".newStockBtns", displayStocks);

render();