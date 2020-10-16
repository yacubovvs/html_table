// Генерация глобального уникального идентификатора, для поиска объектов в DOM
function generateGUID() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
      var r = Math.random() * 16 | 0, v = r;
      return v.toString(16);
    });
}