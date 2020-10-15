var a;

// Генерация глобального уникального идентификатора, для поиска объектов в DOM
function generateGUID() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
      var r = Math.random() * 16 | 0, v = r;
      return v.toString(16);
    });
}

//Объект таблицы
function WebTable(){
    if(new.target==undefined) return new WebTable();

    let parent = this;

    this.columns = {
        parent: parent,
        get_by_id: function(id){

        },
        get_by_position: function(position){

        },
        add: function(column){
            this._list.push(column);
        },
        remove_by_id: function(id){

        },
        remove_by_position: function(position){

        },
        remove: function(column){

        },
        _list: []
    };

    this.strings = {
        parent: parent,
        add: function(){
            let webTableString = new WebTableString(parent.columns._list);
            

            for(let columnNum in parent.columns._list){
                let column = parent.columns._list[columnNum];
                webTableString[column.getName] = "_" + column.getName;
            }   

            this._list.push(webTableString);
        },
        _list: []
        
    }
    
    this.render = function(){
        var out = "";
        out += "<table>"

        /* КОЛОНКИ */

        out += "<tr>";
        for(let columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            out += "<td>" + column.getTitle() + "</td>";
        } 
        out += "</tr>";

        /* СТРОКИ */
        for(let stringNum in this.strings._list){
            let string = this.strings._list[stringNum];
            out += "<tr>";
            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                out += "<td>" + string[column] + "</td>";
            }   
            out += "</tr>";
            //out += "<td>" + column.getTitle() + "</td>";
        } 

        out += "</table>"
        return out;
    }

    this._guid = generateGUID();
}

//Объект колонки
function WebColumn(name, title){
    if(new.target==undefined) return new WebColumn(name, title);

    this.setName = function(name){
        if(name==undefined) name="";
        this._name = name;
    }

    this.getName = function(){
        return this._name;
    }

    this.setTitle = function(title){
        if(title==undefined) title="";
        this._title = title;
    }

    this.getTitle = function(){
        return this._title;
    }

    this.setName(name);
    this.setTitle(title);
    this._guid = generateGUID();
}


//Объект строки
function WebTableString(columns){
    if(new.target==undefined) return new WebColumn(columns);
}