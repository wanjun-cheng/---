// import {CreateStatementData} from "./common/createStatementData";
// console.log(CreateStatementData);

const p1 = new Promise((resolve, reject) => {
  $.getJSON('./src/config/plays.json', function (data) {
    resolve(data);
  })
})

const p2 = new Promise((resolve, reject) => {
  $.getJSON('./src/config/invoices.json', function (data) {
    resolve(data);
  })
})

Promise.all([p1, p2]).then((result) => {
  console.log('start');
  console.log(result);

  if (result && result.length) {
    const plays = result[0];
    const invoice = result[1][0];
    // 打印账单详情
    const text = htmlStatement(invoice, plays);
    $("#page").html(text);
  }
});


function htmlStatement(invoice, plays) {
  return renderHtml(CreateStatementData1(invoice, plays));
}

function renderHtml(data) {
  let result = `<h2>Statement for ${data.customer}</h2>`;
  for (let perf of data.performances) {
    result += `<p>${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)</p>`;
  }

  result += `<p>Amount owes is ${usd(data.totalAmount / 100)}</p>`;
  result += `<p>You earned ${data.totalVolumeCredits} credits</p>`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
}



// 需提到独立文件
const CreateStatementData1 = (invoice, plays) => {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknow type: ${aPerformance.play.type}`);
    }
    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumeCredits;
  }

  function totalVolumeCredits(data) {
    let volumeCredits = 0;
    for (let perf of data.performances) {
      volumeCredits += perf.volumeCredits;
    }
    return volumeCredits;
  }

  function totalAmount(data) {
    let totalAmount = 0;
    for (let perf of data.performances) {
      totalAmount += perf.amount;
    }
    return totalAmount;
  }

}
