(function(DOM, document) {
  'use strict';

  const app = (function() {
    const urlBackEnd = 'http://localhost:3000/car';

    function obterDadosDaCompanhia() {
      criarRequisicaoAJAX({
        metodo: 'GET',
        url: 'company.json',
        callback: preencherDadosCabecalho
      });
    }

    function criarRequisicaoAJAX({ metodo, url, dados, callback }) {
      const ajax = new XMLHttpRequest();

      ajax.open(metodo, url);

      if (metodo !== 'GET') {
        ajax.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
      }

      ajax.send(dados);
      ajax.addEventListener('readystatechange', callback, false);
    }

    function verificarStatusRequisicao(ajax) {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function preencherDadosCabecalho() {
      if (!verificarStatusRequisicao(this)) return;

      const $nome = new DOM('[data-js="nome"]').get();
      const $telefone = new DOM('[data-js="telefone"]').get();
      const dados = JSON.parse(this.responseText);

      $nome.textContent = dados.name;
      $telefone.textContent = dados.phone;
    }

    function obterDadosCarros() {
      criarRequisicaoAJAX({
        metodo: 'GET',
        url: urlBackEnd,
        callback: atualizarDadosTabela
      });
    }

    function limparDadosTabela() {
      const dados = new DOM('[data-js="dados"]').get();

      while (dados.firstChild) {
        dados.removeChild(dados.firstChild);
      }
    }

    function atualizarDadosTabela() {
      if (!verificarStatusRequisicao(this)) return;

      const carros = JSON.parse(this.responseText);

      limparDadosTabela();

      carros.forEach(carro => {
        const docFragment = document.createDocumentFragment();
        const trCadastro = document.createElement('tr');
        const btnExcluir = document.createElement('button');
        const tdImagem = document.createElement('td');
        const imagem = document.createElement('img');
        const tdMarcaModelo = document.createElement('td');
        const tdAno = document.createElement('td');
        const tdPlaca = document.createElement('td');
        const tdCor = document.createElement('td');
        const tdExcluir = document.createElement('td');

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
      const image = new DOM('[data-js="imagem"]').get().value;
      const brandModel = new DOM('[data-js="marca-modelo"]').get().value;
      const year = new DOM('[data-js="ano"]').get().value;
      const plate = new DOM('[data-js="placa"]').get().value;
      const color = new DOM('[data-js="cor"]').get().value;

      return `image=${image}&brandModel=${brandModel}&year=${year}\
              &plate=${plate}&color=${color}`;
    }

    function inserirCarro() {
      criarRequisicaoAJAX({
        metodo: 'POST',
        url: urlBackEnd,
        dados: criarQueryStringCadastro()
      });

      obterDadosCarros();
    }

    function excluirCarro() {
      const placa = this.getAttribute('data-button');
      const trCadastro = new DOM('[data-js="' + placa + '"]').get();

      new DOM('[data-js="dados"').get().removeChild(trCadastro);

      criarRequisicaoAJAX({
        metodo: 'DELETE',
        url: urlBackEnd,
        dados: `plate=${placa}`
      });
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
      }
    };
  })();

  app.init();
})(window.DOM, document);
