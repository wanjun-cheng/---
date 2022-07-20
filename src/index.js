// 测试webpack模块化
// require('./js/module1');
// let People = require('./js/es6-module');
// let p = new People("Yika");
// p.sayHi();

// ----------js 模块化加载-------------
let CreateStatementData = require('./common/createStatementData');

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
  const data = new CreateStatementData(invoice, plays);
  return renderHtml(data.init());
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
