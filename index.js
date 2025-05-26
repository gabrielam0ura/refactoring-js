const { readFileSync } = require('fs');

function calcularCreditos(apre, pecas) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(apre, pecas).tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL", minimumFractionDigits: 2 }
  ).format(valor / 100);
}

function getPeca(apresentacao, pecas) {
  return pecas[apresentacao.id];
}

function calcularTotalApresentacao(apre, pecas) {
  let total = 0;
  switch (getPeca(apre, pecas).tipo) {
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
      throw new Error(`Peça desconhecida: ${getPeca(apre, pecas).tipo}`);
  }
  return total;
}

function calcularTotalFatura(fatura, pecas) {
  let total = 0;
  for (let apre of fatura.apresentacoes) {
    total += calcularTotalApresentacao(apre, pecas);
  }
  return total;
}

function calcularTotalCreditos(fatura, pecas) {
  let creditos = 0;
  for (let apre of fatura.apresentacoes) {
    creditos += calcularCreditos(apre, pecas);
  }
  return creditos;
}

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalApresentacao(apre, pecas))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
  let result = `<html>\n`;
  result += `<p> Fatura ${fatura.cliente} </p>\n`;
  result += `<ul>\n`;
  for (let apre of fatura.apresentacoes) {
    result += `<li> ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalApresentacao(apre, pecas))} (${apre.audiencia} assentos) </li>\n`;
  }
  result += `</ul>\n`;
  result += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))} </p>\n`;
  result += `<p> Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} </p>\n`;
  result += `</html>`;
  return result;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

console.log(gerarFaturaStr(faturas, pecas));
console.log(gerarFaturaHTML(faturas, pecas));
