
var lbs = [];
for (var i = 0; i < vals.length; i++) {
    lbs.push('#'+(i+1));
}
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: lbs,
        datasets: [{
            label: '# connection available',
            data: vals,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
