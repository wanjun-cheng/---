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
    const text = statement(invoice, plays);
    $("#page").html(text);
  }
});

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `<h2>Statement for ${invoice.customer}</h2>`;
  const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknow type: ${perf.type}`);
    }

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    // print line for this order
    result += `<p>${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)</p>`;
    totalAmount += thisAmount;
  }

  result += `<p>Amount owes is ${format(totalAmount / 100)}</p>`;
  result += `<p>You earned ${volumeCredits} credits</p>`;

  return result;
}
