async function draw_index() {
  var chartTotalPortfolio = document.getElementById("chartTotalPortfolio")
  const response1 = await fetch("/TotalPortfolio");
  const data1 = await response1.json();

  Highcharts.chart(chartTotalPortfolio, {
    chart: {
      type: "pie",
    },
    title: {text: ""},
    series: [
      {
        name: "",
        fontSize: "29px",
        type: "pie",
        data: data1
      }
    ],
    tooltip: {valueSuffix: "円"},
    credits: {
      enabled: false
    },
  });

  var chartTotalTimeSeries = document.getElementById("chartTotalTimeSeries")
  const response2 = await fetch("/TotalTimeSeries")
  const data2 = await response2.json()

  // make x, y pair
  cash_deposit = []
  trust_invest = []
  for (var i = 0; i < data2["date"].length; i++) {
    const date = Date.parse(data2["date"][i]);
    cash_deposit.push([date, data2["value"]["cash_deposit"][i]]);
    trust_invest.push([date, data2["value"]["trust_invest"][i]]);
  }

  // disable utc
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  Highcharts.chart(chartTotalTimeSeries, {
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
        text: "円"
      }
    },
    plotOptions: {
      area: {
        stacking: "normal",
        linewidth: 1
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      itemMarginBottom: -10
    },
    series: [{
      name: "預金",
      data: cash_deposit
    }, {
      name: "投資信託",
      data: trust_invest
    }
    ]
  });
  console.log(data2)

  var chartTotalCashDeposit = document.getElementById("chartTotalCashDeposit")
  Highcharts.chart(chartTotalCashDeposit, {
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
        text: "円"
      }
    },
    credits: {
      enabled: false
    },
    legend: {enabled: false},
    series: [{
      data: cash_deposit
    },]
  });

  var chartTotalTrustInvest = document.getElementById("chartTotalTrustInvest")
  Highcharts.chart(chartTotalTrustInvest, {
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
        text: "円"
      }
    },
    credits: {
      enabled: false
    },
    legend: {enabled: false},
    series: [{
      color: Highcharts.getOptions().colors[1],
      data: trust_invest
    },]
  });
};
