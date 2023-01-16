
function getColor(stock) {
    if(stock === "GME") {
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT") {
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS") {
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX") {
        return 'rgba(166, 43, 158, 0.7)'
    }
}
//Function to fetch twelvedata 
async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

  
       const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=b3646458106b40f38e00c81cb4505386');

       const result = await response.json();

       const { GME, MSFT, DIS, BNTX } = result;

       const stocks = [GME, MSFT, DIS, BNTX];

    //Variable to create a new array of the same stocks but with reversed value arrays.
    const reversedStocks = stocks.map(stock => {
        return {
            ...stock,
            values: stock.values.reverse()
        }
    })
    //Stock Price Over Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: reversedStocks[0].values.map(value => value.datetime),
            datasets: reversedStocks.map(stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });
    
    //Highest Stock Price Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });
   
    //Bonus Average Stock Price Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )), 
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )), 
                data: stocks.map(stock => (findAverage(stock.values)
                ))
            }]
        } 
    })
}
        //Function to find highest values
    function findHighest(values) {
        return values.reduce((highest, value) => Math.max(highest, parseFloat(value.high)), 0);
    }
    
       //Function to find average values
       function findAverage(values) {
        let total = 0;
        values.forEach(value => {
            total += parseFloat(value.high)
        })
        return total / values.length
    }

main()
