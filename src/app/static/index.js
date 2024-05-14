async function draw() {
  var chartTotalPortfolio = document.getElementById("chartTotalPortfolio")
  const response1 = await fetch("/TotalPortfolio");
  const data1 = await response1.json();
  console.log(data1);

  var charts = new Chart(chartTotalPortfolio, {
    type: "pie",
    data: {
      labels: data1["labels"],
      datasets: [{
        data: data1["value"],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      }]
    },
    options: {
    },
  });

  var chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries")
  const response2 = await fetch("/TotalTimeSeries")
  const data2 = await response2.json()
  console.log(data2)
  var TotalTimeSeries = new Chart(chartTotalTimeSeries, {
    type: "line",
    data: {
      labels: data2["date"],
      datasets: [
        // cash_deposit
        {
          fill: "origin",
          stack: 1,
          label: "預金",
          data: data2["value"]["cash_deposit"],
          lineTransition: 0,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        // trust_invest
        {
          fill: "-1",
          stack: 1,
          label: "投資信託",
          data: data2["value"]["trust_invest"],
          lineTransition: 0,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
      ]
    },
    options: {
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "YYYY/MM/DD"
            }
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "円"
          },
          ticks: {
            suggestedMin: 0,
            callback: function (label, index, labels) {
              return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
          },
          stacked: true
        }]
      },
      plugins: {
        filter: {
          propagate: true
        }
      }
    }
  }
  );

  var chartTotalCashDeposit = document.getElementById("chartTotalCashDeposit")
  var TotalCashDeposit = new Chart(chartTotalCashDeposit,
    {
      type: "line",
      data: {
        labels: data2["date"],
        datasets: [
          {
            // cash_deposit
            fill: false,
            data: data2["value"]["cash_deposit"],
            lineTransition: 0,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "YYYY/MM/DD"
              }
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "円"
            },
            ticks: {
              callback: function (label, index, labels) {
                return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }]
        },
        plugins: {
          filter: {
            propagate: true
          }
        }
      }

    }
  );
  var chartTotalTrustInvest = document.getElementById("chartTotalTrustInvest")
  var TotalTrustInvest = new Chart(chartTotalTrustInvest,
    {
      type: "line",
      data: {
        labels: data2["date"],
        datasets: [
          {
            // cash_deposit
            fill: false,
            data: data2["value"]["trust_invest"],
            lineTransition: 0,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "YYYY/MM/DD"
              }
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "円"
            },
            ticks: {
              callback: function (label, index, labels) {
                return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }]
        },
        plugins: {
          filter: {
            propagate: true
          }
        }
      }

    }
  );
}

draw()
