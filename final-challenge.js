(function(DOM) {
  'use strict';

  function app() {
    return {
      init: function init() {
        this.obterDadosDaCompanhia();
        this.adicionarEventos();
      },
      
      obterDadosDaCompanhia: function obterDadosDaCompanhia() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'company.json');
        ajax.send();
        ajax.addEventListener('readystatechange', this.verificarStatusRequisicao, false);
      },

      verificarStatusRequisicao: function verificarStatusRequisicao() {
        if (this.readyState === 4 && this.status === 200)
          app().preencherDadosCabecalho.call(this);
      },

      preencherDadosCabecalho: function preencherDadosCabecalho() {
        var dados = JSON.parse(this.responseText);
        var $nome = new DOM('[data-js="nome"]');
        var $telefone = new DOM('[data-js="telefone"]');

        $nome.get()[0].textContent = dados.name;
        $telefone.get()[0].textContent = dados.phone;
      },

      manipularSubmitForm: function manipularSubmitForm(event) {
        event.preventDefault();
        app().atualizarDadosTabela();
      },

      atualizarDadosTabela: function atualizarDadosTabela() {
        var carro = this.criarEstruturaDados();
        carro = this.prencherDadosEstrutura(carro);
        this.criarHierarquiaDOMEstrutura(carro);
      },

      criarEstruturaDados: function criarEstruturaDados() {
        return {
          docFragment: document.createDocumentFragment(),
          cadastro: document.createElement('tr'),
          imagem: document.createElement('td'),
          linkImagem: document.createElement('img'),
          marcaModelo: document.createElement('td'),
          ano: document.createElement('td'),
          placa: document.createElement('td'),
          cor: document.createElement('td')
        };
      },

      prencherDadosEstrutura: function prencherDadosEstrutura(carro) {
        var $imagem = new DOM('[data-js="imagem"]');
        var $marcaModelo = new DOM('[data-js="marca-modelo"]');
        var $ano = new DOM('[data-js="ano"]');
        var $placa = new DOM('[data-js="placa"]');
        var $cor = new DOM('[data-js="cor"]');

        carro.linkImagem.textContent = 'Foto do Carro';
        carro.linkImagem.src = $imagem.get()[0].value;
        carro.marcaModelo.textContent = $marcaModelo.get()[0].value;
        carro.ano.textContent = $ano.get()[0].value;
        carro.placa.textContent = $placa.get()[0].value;
        carro.cor.textContent = $cor.get()[0].value;

        return carro;
      },

      criarHierarquiaDOMEstrutura: function criarHierarquiaDOMEstrutura(carro) {
        var $dados = new DOM('[data-js="dados"]');

        carro.imagem.appendChild(carro.linkImagem);
        carro.cadastro.appendChild(carro.imagem);
        carro.cadastro.appendChild(carro.marcaModelo);
        carro.cadastro.appendChild(carro.ano);
        carro.cadastro.appendChild(carro.placa);
        carro.cadastro.appendChild(carro.cor);
        carro.docFragment.appendChild(carro.cadastro);
        $dados.get()[0].appendChild(carro.docFragment);
      },

      adicionarEventos: function adicionarEventos() {
        new DOM('[data-js="cadastro"]').on('submit', this.manipularSubmitForm);
      }
    };
  }

  app().init();
})(window.DOM, document);
