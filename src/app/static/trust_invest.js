async function draw_trust_invest(isFirst) {
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

  if (isFirst) {
    const container = document.getElementById("segment");
    for (let i = 0; i < data["ndata"]; i++) {
      const i_data = data[String(i)];
      const tmp = document.createElement("div");
      val = i_data["data"]["net_asset_value"].at(-1)
      num = formatNumber(val);
      tmp.className = "w-full lg:w-1/2 pl-0 mt-6 lg:pl-2";
      const html = `<p class="text-xl pb-3 flex items-center">
              <i class="fas fa-magnifying-glass-chart mr-3"></i> ${i_data["invest_name"]}（${i_data["bank_name"]}）：${num}円 
            </p>
            <div class="p-6 bg-white">
              <canvas id="chartTimeSeries_${i}" width="400" height="170"></canvas> `
      tmp.innerHTML = html;
      container.appendChild(tmp);
    }
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
            yAxisID: "y2",
            fill: false,
            label: "評価損益率",
            data: data[String(i)]["data"]["gain_loss_percentage"],
            lineTransition: 0,
            borderColor: color_list[0][1],
            backgroundColor: color_list[0][0]
          },
          {
            yAxisID: "y1",
            fill: "origin",
            stack: 1,
            label: "投資額",
            data: data[String(i)]["data"]["invested_amount"],
            lineTransition: 0,
            borderColor: color_list[3][1],
            backgroundColor: color_list[3][1],
          },
          {
            yAxisID: "y1",
            fill: "-1",
            stack: 1,
            label: "評価損益",
            data: data[String(i)]["data"]["gain_loss"],
            lineTransition: 0,
            borderColor: color_list[2][1],
            backgroundColor: color_list[2][1]
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
    });
  }

}
