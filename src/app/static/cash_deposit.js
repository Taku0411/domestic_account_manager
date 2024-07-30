async function draw_cash_deposit(isFirst) {
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

  if (isFirst) {
    const container = document.getElementById("segment");
    for (let i = 0; i < Number(data["ndata"]); i++) {
      const i_data = data[String(i)];
      const tmp = document.createElement("div");
      num = formatNumber(i_data["data"].at(-1));
      tmp.className = "w-full lg:w-1/2 pl-0 mt-6 lg:pl-6 h-96";
      const html = `<p class="text-xl pb-3 flex items-center h-1/4 lg:h-1/6">
              <i class="fas fa-magnifying-glass-chart mr-3"></i> ${i_data["account_name"]}（${i_data["account_type"]}）：${num}円 
            </p>
            <div class="p-3 bg-white h-3/4 lg:h-5/6">
              <canvas id="chartTimeSeries_${i}"></canvas> `
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
