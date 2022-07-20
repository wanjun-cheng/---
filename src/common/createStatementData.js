class CreateStatementData {
  constructor(invoice, plays) {
    this.invoice = invoice;
    this.plays = plays;
  }

  init() {
    const statementData = {};
    statementData.customer = this.invoice.customer;
    statementData.performances = this.invoice.performances.map(this.enrichPerformance);
    statementData.totalAmount = this.totalAmount(statementData);
    statementData.totalVolumeCredits = this.totalVolumeCredits(statementData);
    return statementData;
  }

  enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance);
    result.play = this.playFor(result);
    result.amount = this.amountFor(result);
    result.volumeCredits = this.volumeCreditsFor(result);
    return result;
  }

  playFor = (aPerformance) => {
    return this.plays[aPerformance.playID];
  }

  amountFor(aPerformance) {
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

  volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumeCredits;
  }

  totalVolumeCredits(data) {
    let volumeCredits = 0;
    for (let perf of data.performances) {
      volumeCredits += perf.volumeCredits;
    }
    return volumeCredits;
  }

  totalAmount(data) {
    let totalAmount = 0;
    for (let perf of data.performances) {
      totalAmount += perf.amount;
    }
    return totalAmount;
  }
}

module.exports = CreateStatementData;