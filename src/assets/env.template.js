(function (window) {
  window['env'] = window['env'] || {};

  const env = JSON.parse('${ENV}');

  window['env'] = env || {};

})(this);
