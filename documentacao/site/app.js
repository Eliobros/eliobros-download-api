(function(){
  const routes = {
    '#introducao': '/documentacao/introducao.md',
    '#autenticacao': '/documentacao/autenticacao.md',
    '#chaves': '/documentacao/chaves.md',
    '#downloads': '/documentacao/downloads.md',
    '#estatisticas': '/documentacao/estatisticas.md',
    '#erros': '/documentacao/erros.md',
    '#api': '/documentacao/openapi.yaml'
  };

  const docEl = document.getElementById('doc-container');
  const swagEl = document.getElementById('swagger-container');

  async function fetchText(path){
    const res = await fetch(path, { cache: 'no-cache' });
    if(!res.ok) throw new Error('Falha ao carregar: ' + path);
    return await res.text();
  }

  async function renderMarkdown(mdPath){
    swagEl.style.display = 'none';
    docEl.style.display = 'block';
    const text = await fetchText(mdPath);
    docEl.innerHTML = marked.parse(text);
  }

  async function renderSwagger(yamlPath){
    docEl.style.display = 'none';
    swagEl.style.display = 'block';
    swagEl.innerHTML = '';
    SwaggerUIBundle({
      url: yamlPath,
      domNode: swagEl,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout'
    });
  }

  async function onRoute(){
    const hash = location.hash || '#introducao';
    if(hash === '#api'){
      await renderSwagger(routes['#api']);
    } else if(routes[hash]){
      await renderMarkdown(routes[hash]);
    } else {
      await renderMarkdown(routes['#introducao']);
    }
  }

  window.addEventListener('hashchange', onRoute);
  onRoute();
})();