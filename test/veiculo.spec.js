// Carrega todas dependências
const should = require("should");
const request = require("request");
const chai = require("chai");
const expect = chai.expect;
const url = " http://localhost:8000/";


describe("Testes API Veículos", () => {

  it('Teste GET /veiculos', (done) => {
    request.get({url: url + "/veiculos"}, (error, response, body) => {

      expect(response.statusCode).to.equal(200);

      done();
    });
  });
}); 