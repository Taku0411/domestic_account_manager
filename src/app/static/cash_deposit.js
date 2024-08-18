async function draw_cash_deposit(isFirst) {
  const container = document.getElementById("segment");
  const chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries")
  const response = await fetch("/cash_deposit")
  const data = await response.json()

  const total = Highcharts.chart(chartTotalTimeSeries, {
    chart: {
      type: "area",
      zooming: {
        type: "x"
      },
    },
    title: {text: ""},
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "円",
      },
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      area: {
        stacking: "normal",
        linewidth: 1
      },
    },
  },
  );

  // insert elements
  for (let i = 0; i < Number(data["ndata"]); i++) {
    const i_data = data[String(i)];
    const tmp = document.createElement("div");
    num = i_data["data"].at(-1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    tmp.className = "w-full lg:w-1/2 p-0 pb-3 lg:p-3";
    const html = `
            <p class="text-xl pb-3 items-center">
              <i class="fas fa-magnifying-glass-chart mr-3"></i> ${i_data["account_name"]}（${i_data["account_type"]}）：${num}円 
            </p>
            <div class="p-6 bg-white">
              <div id="chartTimeSeries_${i}" class="h-64"></div>
            </div>`
    tmp.innerHTML = html;
    container.appendChild(tmp);

  }

  // data
  for (var i = 0; i < Number(data["ndata"]); i++) {
    each_data = []

    // time
    for (var j = 0; j < data["date"].length; j++) {
      each_data.push([Date.parse(data["date"][j]), data[String(i)]["data"][j]]);
    }

    // add to total
    total.addSeries({
      name: data[String(i)]["account_name"],
      data: each_data
    });

    // add element
    var i_chart = document.getElementById("chartTimeSeries_" + String(i));
    Highcharts.chart(i_chart, {
      chart: {
        type: "area",
        zooming: {
          type: "x"
        }
      },
      title: {text: ""},
      xAxis: {
        type: "datetime"
      },
      yAxis: {
        title: {
          text: "yen"
        }
      },
      credits: {
        enabled: false
      },
      legend: {enabled: false},
      series: [{
        name: "",
        data: each_data,
        color: Highcharts.getOptions().colors[i],
      },],
    });
  }
  console.log(each_data)
}
