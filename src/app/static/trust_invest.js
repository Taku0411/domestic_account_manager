async function draw_trust_invest() {
  const container = document.getElementById("segment");
  const chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries");
  const response = await fetch("/trust_invest");
  const data = await response.json();
  console.log(data);

  // disable utc
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  // for total data
  total_data = [
    [], [], []
  ]
  for (var i = 0; i < data["date"].length; i++) {
    const date = Date.parse(data["date"][i])
    total_data[0].push([date, data["total"]["invested_amount"][i]])
    total_data[1].push([date, data["total"]["gain_loss"][i]])
    total_data[2].push([date, data["total"]["gain_loss_percentage"][i]])
  }

  // for each data
  each_data = []
  for (var i = 0; i < Number(data["ndata"]); i++) {
    tmp = [
      [], [], []
    ]
    for (var j = 0; j < data["date"].length; j++) {
      const date = Date.parse(data["date"][j]);
      tmp[0].push([date, data[String(i)]["data"]["invested_amount"][j]])
      tmp[1].push([date, data[String(i)]["data"]["gain_loss"][j]])
      tmp[2].push([date, data[String(i)]["data"]["gain_loss_percentage"][j]])
    }
    each_data.push(tmp)
  }
  console.log(each_data)

  Highcharts.chart(chartTotalTimeSeries, {
    chart: {
      zooming: {
        type: "x"
      },
    },
    title: {text: ""},
    xAxis: {
      type: "datetime",
    },
    yAxis: [{
      title: {
        text: "円",
      }
    }, {
      title: {
        text: "%"
      },
      opposite: true,
    },
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      area: {
        stacking: "normal",
        lineWidth: 1
      },
    },
    legend: {
      itemMarginBottom: -10,
      itemMarginTop: 10
    },
    series: [{
      name: "評価損益",
      type: "area",
      data: total_data[1],
      yAxis: 0
    }, {
      name: "投資額",
      type: "area",
      data: total_data[0],
      yAxis: 0
    }, {
      name: "評価損益率",
      type: "spline",
      data: total_data[2],
      yAxis: 1,
      lineWidth: 3,
      color: Highcharts.getOptions().colors[3],
    },
    ]
  });

  for (var i = 0; i < Number(data["ndata"]); i++) {

    // time
    for (var j = 0; j < data["date"].length; j++) {
    }
    const i_data = data[String(i)];
    const tmp = document.createElement("div");
    val = i_data["data"]["net_asset_value"].at(-1)
    num = formatNumber(val);
    tmp.className = "w-full lg:w-1/2 p-0 pb-3 lg:p-3";
    const html = `
            <p class="text-xl pb-3 items-center">
              <i class="fas fa-magnifying-glass-chart mr-3"></i> ${i_data["invest_name"]}（${i_data["bank_name"]}）：${num}円 
            </p>
            <div class="p-4 pb-0 bg-white">
              <div id="chartTimeSeries_${i}" class="h-64"></div>
            </div>
  `
    tmp.innerHTML = html;
    container.appendChild(tmp);
  }

  for (var i = 0; i < Number(data["ndata"]); i++) {
    var chart_i = document.getElementById("chartTimeSeries_" + String(i));
    Highcharts.chart(chart_i, {
      chart: {
        zooming: {
          type: "x"
        },
      },
      title: {text: ""},
      xAxis: {
        type: "datetime",
      },
      yAxis: [{
        title: {
          text: "円",
        }
      }, {
        title: {
          text: "%"
        },
        opposite: true,
      },
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        area: {
          stacking: "normal",
          lineWidth: 1
        },
      },
      legend: {
        itemMarginBottom: -10,
        itemMarginTop: 10
      },
      series: [{
        name: "評価損益",
        type: "area",
        data: each_data[i][1],
        yAxis: 0
      }, {
        name: "投資額",
        type: "area",
        data: each_data[i][0],
        yAxis: 0
      }, {
        name: "評価損益率",
        type: "spline",
        data: each_data[i][2],
        yAxis: 1,
        lineWidth: 3,
        color: Highcharts.getOptions().colors[3],
      },
      ]
    });
  }

}
