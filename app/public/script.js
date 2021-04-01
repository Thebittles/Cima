
let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new Chart(myChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge'],
        datasets: [{
            label: 'Population',
            data: [1000, 2000, 3000, 4000, 5000, 6000]
        }]
    },
    options: {}
});