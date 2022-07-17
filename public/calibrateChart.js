const canvas = document.getElementById('myChart');
canvas.height="400px";
canvas.width="400px";
const ctx = canvas.getContext('2d');

const data = {
  labels: [],
  datasets: [{
    label: 'Actual values',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Predicted Values',
    data: [],
    fill: false,
    borderColor: 'rgb(255, 0, 0)',
    tension: 0.1
  }]
};
const myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function setData(chart, labels, data, dataset) {
    chart.data.labels = labels;
    chart.data.datasets[dataset].data = data;
    chart.update();
}
