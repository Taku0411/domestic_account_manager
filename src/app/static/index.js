const color_list =
  [
    ['rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)',],
    ['rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)',],
    ['rgba(255, 206, 86, 0.2)', 'rgba(255, 206, 86, 1)',],
    ['rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)',],
    ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)',],
    ['rgba(255, 159, 64, 0.2)', 'rgba(255, 159, 64, 1)'],
  ];
function formatNumnber(label) {
  return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function draw_index() {
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
          borderColor: color_list[0][1],
          backgroundColor: color_list[0][0]
        },
        // trust_invest
        {
          fill: "-1",
          stack: 1,
          label: "投資信託",
          data: data2["value"]["trust_invest"],
          lineTransition: 0,
          borderColor: color_list[1][1],
          backgroundColor: color_list[1][0]
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
            borderColor: color_list[0][0],
            backgroundColor: color_list[0][1]
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
            borderColor: color_list[1][0],
            backgroundColor: color_list[1][1]
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

async function draw_cash_deposit() {
  var chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries")
  const response = await fetch("/cash_deposit")
  const data = await response.json()
  console.log(data)
  var TotalTimeSeries = new Chart(chartTotalTimeSeries,
    {
      type: "line",
      data: {
        labels: data["date"],
      },
      options: {
        respons: true,
        maintainAspectRatio: false,
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
  for (let i = 0; i < data["ndata"]; i++) {
    const i_data = data[String(i)];
    if (i == 0) {
      TotalTimeSeries.data.datasets.push(
        {
          fill: "origin",
          stack: 1,
          label: i_data["account_name"],
          data: i_data["data"],
          lineTransition: 0,
          backgroundColor: color_list[i][0],
          borderColor: color_list[i][1],
        }
      );
    }
    else {
      TotalTimeSeries.data.datasets.push(
        {
          fill: "-1",
          stack: 1,
          label: i_data["account_name"],
          data: i_data["data"],
          lineTransition: 0,
          backgroundColor: color_list[i][0],
          borderColor: color_list[i][1],
        }
      );
    }
  }
  TotalTimeSeries.update();

  const container = document.getElementById("segment")

  for (let i = 0; i < Number(data["ndata"]); i++) {
    const i_data = data[String(i)];
    const tmp = document.createElement("div");
    num = formatNumnber(i_data["data"].at(-1));
    tmp.className = "w-full lg:w-1/2 pl-0 mt-6 lg:pl-2";
    const html = `<p class="text-xl pb-3 flex items-center">
              <i class="fas fa-magnifying-glass-chart mr-3"></i> ${i_data["account_name"]}（${i_data["account_type"]}）：${num}円 
            </p>
            <div class="p-6 bg-white">
              <canvas id="chartTimeSeries_${i}" width="400" height="170"></canvas> `
    tmp.innerHTML = html;
    container.appendChild(tmp);

  }

  for (let i = 0; i < Number(data["ndata"]); i++) {
    var chart_i = document.getElementById("chartTimeSeries_" + String(i));
    var chart = new Chart(chart_i, {
      type: "line",
      data:
      {
        labels: data["date"],
        datasets: [
          {
            fill: false,
            label: data[String(i)]["account_type"],
            data: data[String(i)]["data"],
            lineTransition: 0,
            borderColor: color_list[i][1],
            backgroundColor: color_list[i][0],
          }

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
              callback: function (label, index, labels) {
                return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            },
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

    console.log(document.getElementById("segment"))
  }
}

async function draw_trust_invest() {
  var chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries");

  const response = await fetch("/trust_invest");
  const data = await response.json();
  console.log(data);
  var TotalTimeSeries = new Chart(chartTotalTimeSeries,
    {
      type: "line",
      data: {
        labels: data["date"],
        datasets: [
          // gain loss percentage
          {
            yAxisID: "y2",
            fill: false,
            label: "評価損益率",
            data: data["total"]["gain_loss_percentage"],
            lineTransition: 0,
            borderWidth: 4,
            borderColor: color_list[0][1],
            backgroundColor: color_list[0][0]
          },
          // invested amount
          {
            yAxisID: "y1",
            fill: "origin",
            stack: 1,
            label: "投資額",
            data: data["total"]["invested_amount"],
            lineTransition: 0,
            borderColor: color_list[3][1],
            backgroundColor: color_list[3][1],
          },
          // gain loss
          {
            yAxisID: "y1",
            fill: "-1",
            stack: 1,
            label: "評価損益",
            data: data["total"]["gain_loss"],
            lineTransition: 0,
            borderColor: color_list[2][1],
            backgroundColor: color_list[2][1],
          },
        ]
      },
      options: {
        respons: true,
        maintainAspectRatio: false,
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
          yAxes: [
            {
              id: "y1",
              position: "left",
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
              stacked: true,
            },
            {
              id: "y2",
              position: "right",
              scaleLabel: {
                display: true,
                labelString: "%"
              },
            }
          ]
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
