(function(DOM, document) {
  'use strict';

  var app = (function() {
    function obterDadosDaCompanhia() {
      criarRequisicaoAJAX('GET', 'company.json', undefined, undefined, preencherDadosCabecalho);
    }

    function criarRequisicaoAJAX(metodo, url, header, dados, callback) {
      var ajax = new XMLHttpRequest();

      ajax.open(metodo, url);

      if (header)
        ajax.setRequestHeader.apply(ajax, header);

      ajax.send(dados);
      ajax.addEventListener('readystatechange', callback, false);
    }

    function verificarStatusRequisicao(ajax) {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function preencherDadosCabecalho() {
      if (!verificarStatusRequisicao(this))
        return;

      var $nome = new DOM('[data-js="nome"]');
      var $telefone = new DOM('[data-js="telefone"]');
      var dados = JSON.parse(this.responseText);
      $nome.get().textContent = dados.name;
      $telefone.get().textContent = dados.phone;
    }

    function obterDadosCarros() {
      criarRequisicaoAJAX(
        'GET',
        'http://localhost:3000/car',
        undefined,
        undefined,
        atualizarDadosTabela);
    }

    function limparDadosTabela() {
      var dados = new DOM('[data-js="dados"]').get();

      while (dados.firstChild) {
        dados.removeChild(dados.firstChild);
      }
    }

    function atualizarDadosTabela() {
      if (!verificarStatusRequisicao(this))
        return;

      var carros = JSON.parse(this.responseText);

      limparDadosTabela();

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
        btnExcluir.setAttribute('data-button', carro.plate)
        btnExcluir.addEventListener('click', excluirCarro, false);

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
    }

    function criarQueryStringCadastro() {
      var image = new DOM('[data-js="imagem"]').get().value;
      var brandModel = new DOM('[data-js="marca-modelo"]').get().value;
      var year = new DOM('[data-js="ano"]').get().value;
      var plate = new DOM('[data-js="placa"]').get().value;
      var color = new DOM('[data-js="cor"]').get().value;
      return 'image=' + image + '&brandModel=' + brandModel + '&year=' + year + '&plate=' + plate + '&color=' + color;
    }

    function inserirCarro() {
      criarRequisicaoAJAX(
        'POST',
        'http://localhost:3000/car',
        ['Content-Type', 'application/x-www-form-urlencoded'],
        criarQueryStringCadastro()
      );

      obterDadosCarros();
    }

    function excluirCarro() {
      var placa = this.getAttribute('data-button');
      var trCadastro = new DOM('[data-js="' + placa + '"]');

      new DOM('[data-js="dados"').get().removeChild(trCadastro.get());

      criarRequisicaoAJAX(
        'DELETE',
        'http://localhost:3000/car',
        ['Content-Type', 'application/x-www-form-urlencoded'],
        'plate=' + placa
      );
    }

    function manipularSubmitForm(event) {
      event.preventDefault();
      inserirCarro();
    }

    function adicionarEventos() {
      new DOM('[data-js="cadastro"]').on('submit', manipularSubmitForm);
    }

    return {
      init: function init() {
        obterDadosDaCompanhia();
        obterDadosCarros();
        adicionarEventos();
      },
    };
  })();

  app.init();
})(window.DOM, document);
