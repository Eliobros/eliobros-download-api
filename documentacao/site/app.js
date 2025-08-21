(function(){
  const routes = {
    '#introducao': '../introducao.md',
    '#autenticacao': '../autenticacao.md',
    '#chaves': '../chaves.md',
    '#downloads': '../downloads.md',
    '#estatisticas': '../estatisticas.md',
    '#erros': '../erros.md',
    '#api': '../openapi.yaml'
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