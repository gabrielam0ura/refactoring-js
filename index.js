const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.getPeca(pecas, apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    const peca = this.getPeca(pecas, apre);
    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(pecas, apre);
    }
    return total;
  }

  getPeca(pecas, apresentacao) {
    return pecas[apresentacao.id];
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL", minimumFractionDigits: 2 }
  ).format(valor / 100);
}

function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    const valor = calc.calcularTotalApresentacao(pecas, apre);
    const peca = calc.getPeca(pecas, apre);
    faturaStr += `  ${peca.nome}: ${formatarMoeda(valor)} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// function gerarFaturaHTML(fatura, pecas) {
//   let result = `<html>\n`;
//   result += `<p> Fatura ${fatura.cliente} </p>\n`;
//   result += `<ul>\n`;
//   for (let apre of fatura.apresentacoes) {
//     result += `<li> ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalApresentacao(apre, pecas))} (${apre.audiencia} assentos) </li>\n`;
//   }
//   result += `</ul>\n`;
//   result += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))} </p>\n`;
//   result += `<p> Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} </p>\n`;
//   result += `</html>`;
//   return result;
// }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura();
console.log(gerarFaturaStr(faturas, pecas, calc));
