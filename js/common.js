// Генерация глобального уникального идентификатора, для поиска объектов в DOM
function generateGUID() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
      var r = Math.random() * 16 | 0, v = r;
      return v.toString(16);
    });
}

function hardParseInt(value, def_value){
  value = parseInt(value);
  if(isNaN(value)){
    return def_value;
  }else{
    return value;
  }
}