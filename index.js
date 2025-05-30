const { readFileSync } = require('fs');

const Repositorio = require('./repositorio');
const ServicoCalculoFatura = require('./servico');
const gerarFaturaStr = require('./apresentacao');

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
