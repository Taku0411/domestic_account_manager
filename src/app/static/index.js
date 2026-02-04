const nf = new Intl.NumberFormat('en-US', {
  signDisplay: 'always'
});

async function draw_index() {
  // chartTotalPortfolio
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

  var chartTotalPortfolioValue = document.getElementById("chartTotalPortfolioValue")
  var sum = data1[0]["y"] + data1[1]["y"];
  chartTotalPortfolioValue.innerHTML = `${sum.toLocaleString()}円`

  // chartTotal
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
    tooltip: {valueSuffix: "円"},
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

  // chartTotalCashDeposit
  var chartTotalCashDeposit = document.getElementById("chartTotalCashDeposit")
  Highcharts.chart(chartTotalCashDeposit, {
    chart: {
      type: "area",
      zooming: {
        type: "x"
      }
    },
    title: {text: ""},
    tooltip: {valueSuffix: "円"},
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
  var chartTotalCashDepositValue = document.getElementById("chartTotalCashDepositValue")
  var val = data2["value"]["cash_deposit"].slice(-1)[0];
  var val2 = data2["value"]["cash_deposit"].slice(-2)[0];
  chartTotalCashDepositValue.innerHTML = `${val.toLocaleString()}円 (前日比${nf.format(val -val2)})`

  // totalTrustInvest
  var chartTotalTrustInvest = document.getElementById("chartTotalTrustInvest")
  Highcharts.chart(chartTotalTrustInvest, {
    chart: {
      type: "area",
      zooming: {
        type: "x"
      }
    },
    title: {text: ""},
    tooltip: {valueSuffix: "円"},
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
  var chartTotalTrustInvestValue= document.getElementById("chartTotalTrustInvestValue")
  var val = data2["value"]["trust_invest"].slice(-1)[0];
  var val2 = data2["value"]["trust_invest"].slice(-2)[0];
  chartTotalTrustInvestValue.innerHTML = `${val.toLocaleString()}円 (前日比${nf.format(val -val2)})`
};
