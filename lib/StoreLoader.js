var { Promise } = require('when');

var Flux;
var storePromises = {};

function StoreLoader(name, params) {
  var hash = name + Object.keys(params).map(key => ""+params[key]+key);
  var store = Flux.store(name);
  var promise = promiseForStore(hash, store);

  Flux.actions[name](params);
  return promise;
}

function promiseForStore(hash, store) {
  storePromises[hash] = storePromises[hash] || new Promise((res, rej) => {
    store.on('change', () => {
      console.log('change', store.state);
      return store.state.loading == 'loaded' && res(store.state.data);
    });
  });
  return storePromises[hash];
}

module.exports = {
  init(flux) {
    Flux = flux;
    return StoreLoader;
  }
};