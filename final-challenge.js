(function(DOM) {
  'use strict';

  function app() {
    var $formCadastro = new DOM('[data-js="cadastro"]');
    var ajax = new XMLHttpRequest();

    function enviarRequisicao() {
      ajax.open('GET', 'company.json');
      ajax.send();
    }

    function verificarStatusRequisicao() {
      if (ajax.readyState === 4 && ajax.status === 200)
        preencherDadosCabecalho();
    }

    function preencherDadosCabecalho() {
      var dados = JSON.parse(ajax.responseText);
      var $nome = new DOM('[data-js="nome"]');
      var $telefone = new DOM('[data-js="telefone"]');

      $nome.get()[0].textContent = dados.name;
      $telefone.get()[0].textContent = dados.phone;
    }

    function manipularSubmitForm(event) {
      event.preventDefault();
      atualizarDadosTabela();
    }

    function atualizarDadosTabela() {
      var carro = criarEstruturaDados();
      carro = prencherDadosEstrutura(carro);
      criarHierarquiaDOMEstrutura(carro);
    }

    function criarEstruturaDados() {
      return {
        docFragment: document.createDocumentFragment(),
        cadastro: document.createElement('tr'),
        imagem: document.createElement('td'),
        linkImagem: document.createElement('a'),
        marcaModelo: document.createElement('td'),
        ano: document.createElement('td'),
        placa: document.createElement('td'),
        cor: document.createElement('td')
      };
    }

    function prencherDadosEstrutura(carro) {
      var $imagem = new DOM('[data-js="imagem"]');
      var $marcaModelo = new DOM('[data-js="marca-modelo"]');
      var $ano = new DOM('[data-js="ano"]');
      var $placa = new DOM('[data-js="placa"]');
      var $cor = new DOM('[data-js="cor"]');

      carro.linkImagem.textContent = 'Foto do Carro';
      carro.linkImagem.href = $imagem.get()[0].value;
      carro.marcaModelo.textContent = $marcaModelo.get()[0].value;
      carro.ano.textContent = $ano.get()[0].value;
      carro.placa.textContent = $placa.get()[0].value;
      carro.cor.textContent = $cor.get()[0].value;

      return carro;
    }

    function criarHierarquiaDOMEstrutura(carro) {
      var $dados = new DOM('[data-js="dados"]');
      
      carro.imagem.appendChild(carro.linkImagem);
      carro.cadastro.appendChild(carro.imagem);
      carro.cadastro.appendChild(carro.marcaModelo);
      carro.cadastro.appendChild(carro.ano);
      carro.cadastro.appendChild(carro.placa);
      carro.cadastro.appendChild(carro.cor);
      carro.docFragment.appendChild(carro.cadastro);
      $dados.get()[0].appendChild(carro.docFragment);
    }

    enviarRequisicao();
    $formCadastro.on('submit', manipularSubmitForm);
    ajax.addEventListener('readystatechange', verificarStatusRequisicao, false);
  }

  app();
})(window.DOM, document);
