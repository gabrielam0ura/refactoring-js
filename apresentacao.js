const formatarMoeda = require('./util');

function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    const valor = calc.calcularTotalApresentacao(apre);
    const peca = calc.repo.getPeca(apre);
    faturaStr += `  ${peca.nome}: ${formatarMoeda(valor)} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  return faturaStr;
}

module.exports = gerarFaturaStr;
