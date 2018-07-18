(function(DOM, document) {
  'use strict';

  function app() {
    return {
      init: function init() {
        this.obterDadosDaCompanhia();
        this.obterDadosCarros();
        this.adicionarEventos();
      },

      obterDadosDaCompanhia: function obterDadosDaCompanhia() {
        this.criarRequisicaoAJAX('GET', 'company.json', undefined, undefined, this.preencherDadosCabecalho);
      },

      criarRequisicaoAJAX: function criarRequisicaoAJAX(metodo, url, header, dados, callback) {
        var ajax = new XMLHttpRequest();

        ajax.open(metodo, url);

        if (header)
          ajax.setRequestHeader.apply(ajax, header);

        ajax.send(dados);
        ajax.addEventListener('readystatechange', callback, false);
      },

      verificarStatusRequisicao: function verificarStatusRequisicao(ajax) {
        return ajax.readyState === 4 && ajax.status === 200;
      },

      preencherDadosCabecalho: function preencherDadosCabecalho() {
        if (!app().verificarStatusRequisicao(this))
          return;

        var $nome = new DOM('[data-js="nome"]').get();
        var $telefone = new DOM('[data-js="telefone"]').get();
        var dados = JSON.parse(this.responseText);
        
        $nome.textContent = dados.name;
        $telefone.textContent = dados.phone;
      },

      obterDadosCarros: function obterDadosCarros() {
        this.criarRequisicaoAJAX(
          'GET',
          'http://localhost:3000/car',
          undefined,
          undefined,
          this.atualizarDadosTabela);
      },

      limparDadosTabela: function limparDadosTabela() {
        var dados = new DOM('[data-js="dados"]').get();

        while (dados.firstChild) {
          dados.removeChild(dados.firstChild);
        }
      },

      atualizarDadosTabela: function atualizarDadosTabela() {
        if (!app().verificarStatusRequisicao(this))
          return;

        var carros = JSON.parse(this.responseText);

        app().limparDadosTabela();

        carros.forEach(function(carro) {
          var docFragment = document.createDocumentFragment();
          var trCadastro = document.createElement('tr');
          var btnExcluir = document.createElement('button');
          var tdImagem = document.createElement('td');
          var imagem = document.createElement('img');
          var tdMarcaModelo = document.createElement('td');
          var tdAno = document.createElement('td');
          var tdPlaca = document.createElement('td');
          var tdCor = document.createElement('td');
          var tdExcluir = document.createElement('td');

          imagem.src = carro.image;
          tdMarcaModelo.textContent = carro.brandModel;
          tdAno.textContent = carro.year;
          tdPlaca.textContent = carro.plate;
          tdCor.textContent = carro.color;
          btnExcluir.textContent = 'Excluir';
          btnExcluir.setAttribute('data-button', carro.plate);
          btnExcluir.addEventListener('click', app().excluirCarro, false);

          tdImagem.appendChild(imagem);
          trCadastro.appendChild(tdImagem);
          trCadastro.appendChild(tdMarcaModelo);
          trCadastro.appendChild(tdAno);
          trCadastro.appendChild(tdPlaca);
          trCadastro.appendChild(tdCor);
          tdExcluir.appendChild(btnExcluir);
          trCadastro.appendChild(tdExcluir);
          trCadastro.setAttribute('data-js', carro.plate);
          docFragment.appendChild(trCadastro);
          new DOM('[data-js="dados"]').get().appendChild(docFragment);
        });
      },

      criarQueryStringCadastro: function criarQueryStringCadastro() {
        var image = new DOM('[data-js="imagem"]').get().value;
        var brandModel = new DOM('[data-js="marca-modelo"]').get().value;
        var year = new DOM('[data-js="ano"]').get().value;
        var plate = new DOM('[data-js="placa"]').get().value;
        var color = new DOM('[data-js="cor"]').get().value;
        return 'image=' + image + '&brandModel=' + brandModel + '&year=' + year + '&plate=' + plate + '&color=' + color;
      },

      inserirCarro: function inserirCarro() {
        this.criarRequisicaoAJAX(
          'POST',
          'http://localhost:3000/car',
          ['Content-Type', 'application/x-www-form-urlencoded'],
          this.criarQueryStringCadastro()
        );

        this.obterDadosCarros();
      },

      excluirCarro: function excluirCarro() {
        var placa = this.getAttribute('data-button');
        var trCadastro = new DOM('[data-js="' + placa + '"]').get();

        new DOM('[data-js="dados"').get().removeChild(trCadastro);

        app().criarRequisicaoAJAX(
          'DELETE',
          'http://localhost:3000/car',
          ['Content-Type', 'application/x-www-form-urlencoded'],
          'plate=' + placa
        );
      },

      manipularSubmitForm: function manipularSubmitForm(event) {
        event.preventDefault();
        app().inserirCarro();
      },

      adicionarEventos: function adicionarEventos() {
        new DOM('[data-js="cadastro"]').on('submit', this.manipularSubmitForm);
      }
    };
  }

  app().init();
})(window.DOM, document);
