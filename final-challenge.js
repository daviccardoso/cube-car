(function(DOM, document) {
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

        $nome.get().textContent = dados.name;
        $telefone.get().textContent = dados.phone;
      },

      manipularSubmitForm: function manipularSubmitForm(event) {
        event.preventDefault();
        app().atualizarDadosTabela();
      },

      atualizarDadosTabela: function atualizarDadosTabela() {
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

        imagem.src = new DOM('[data-js="imagem"]').get().value;
        tdMarcaModelo.textContent = new DOM('[data-js="marca-modelo"]').get().value;
        tdAno.textContent = new DOM('[data-js="ano"]').get().value;
        tdPlaca.textContent = new DOM('[data-js="placa"]').get().value;
        tdCor.textContent = new DOM('[data-js="cor"]').get().value;
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', this.excluirCarro, false);

        tdImagem.appendChild(imagem);
        trCadastro.appendChild(tdImagem);
        trCadastro.appendChild(tdMarcaModelo);
        trCadastro.appendChild(tdAno);
        trCadastro.appendChild(tdPlaca);
        trCadastro.appendChild(tdCor);
        tdExcluir.appendChild(btnExcluir);
        trCadastro.appendChild(tdExcluir);
        trCadastro.setAttribute('data-js', tdPlaca.textContent);
        docFragment.appendChild(trCadastro);

        new DOM('[data-js="dados"]').get().appendChild(docFragment);
      },

      excluirCarro: function excluirCarro() {
        var placa = this.parentNode.parentNode.getAttribute('data-js');
        var trCadastro = new DOM('[data-js="' + placa + '"]');
        new DOM('[data-js="dados"').get().removeChild(trCadastro.get());
      },

      adicionarEventos: function adicionarEventos() {
        new DOM('[data-js="cadastro"]').on('submit', this.manipularSubmitForm);
      }
    };
  }

  app().init();
})(window.DOM, document);
