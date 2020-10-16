var globalTables = {};
// Object table
function WebTable(){
    if(new.target==undefined) return new WebTable();

    let parent = this;

    this.bottomHeader = false;
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
                webTableString[column.getName()] = "";
            }   

            this._list.push(webTableString);
            return webTableString;
        },
        _list: []
        
    }
    
    this.generateTable = function(ignoreWrapper){

        var table = document.createElement('table');
        table.id = this._guid;
        table.className = "webTable";

        // Colomns generating 
        let tr = document.createElement('tr');
        for(let columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            let th = document.createElement('th')
            th.innerHTML = column.getTitle()
            
            if(column.orderingEnable){
                th.innerHTML += '<svg onclick="globalTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 12v-1.5L10 5.75v2.1l2.2.9v5l-2.2.9v2.1L21 12zm-7-2.62l5.02 1.87L14 13.12V9.38zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/></svg>';
            }

            if(column.selectingEnable){
                th.innerHTML += '<svg class="webTableOrderSelectingBtns ' + (column.orderingEnable?"webTableOrderSelectingBtnsSecond":"") + '" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>';
            }
            

            tr.appendChild(th);
        } 
        table.appendChild(tr);
        
        // String generating 
        for(let stringNum in this.strings._list){
            let string = this.strings._list[stringNum];
            let tr = document.createElement('tr');
            if(parent.evenColoring && stringNum%2==0) tr.className = "evenRow";
            table.appendChild(tr);
            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                let td = document.createElement('td');
                td.innerHTML = string[column.getName()];
                tr.appendChild(td);
            }   
        } 

        if(this.bottomHeader){
            let tr2 = document.createElement('tr');
            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                let th = document.createElement('th')
                th.innerHTML = column.getTitle()
                tr2.appendChild(th);
            } 
            table.appendChild(tr2);
        }
        
        resizableGrid(table);

        // Wrapper
        if(!ignoreWrapper){
            var divWrapper = document.createElement('div');
            divWrapper.className = "webTableWrapper";
            divWrapper.id = this._wrapper_guid;

            // Wrapper styles
            for(let i in this.wrapperStyle){
                divWrapper.style[i] = this.wrapperStyle[i];
            }

            divWrapper.appendChild(table);
            return divWrapper;
        }else{
            return table;
        }
        
    }

    this.sortByColumnID = function(columnID){
        column = this.getColumnByID(columnID);
        if(!column) console.error("Column not found");

        //console.log("Sorting by " + column.getName());
        let wrapperElement = document.getElementById(this._wrapper_guid);
        wrapperElement.innerHTML = "";

        this.strings._list.sort(function (a, b) {
            if (a[column.getName()]>b[column.getName()]){ 
                return 1;
            }else if (a[column.getName()]<b[column.getName()]){  
                return -1;
            }else return 0;
        });

        wrapperElement.appendChild(this.generateTable(true));
    }

    this.getColumnByID = function(columnID){
        for(let i in this.columns._list){
            let column = this.columns._list[i];
            if(column._guid==columnID){
                return column;
            }
        }
        return undefined
    }

    this._guid = generateGUID();
    this._wrapper_guid = generateGUID();
    this.wrapperStyle = {};
    this.evenColoring = false;

    globalTables[this._guid] = this;
}

// Object column
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
    this.orderingEnable = false;
    this.selectingEnable = false;
    this.linkEnable = false;
}


// Object string
function WebTableString(columns){
    if(new.target==undefined) return new WebColumn(columns);
}

// Table resizing
function resizableGrid(table) {
    var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = 'hidden';

    var tableHeight = table.offsetHeight;

    for (var i=0; i<cols.length; i++){
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = 'relative';
        setListeners(div);
    }

    function setListeners(div){
        var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

        div.addEventListener('mousedown', function (e) {
            curCol = e.target.parentElement;
            nxtCol = curCol.nextElementSibling;
            pageX = e.pageX; 
            
            var padding = paddingDiff(curCol);
            
            curColWidth = curCol.offsetWidth - padding;
            if (nxtCol)
                nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener('mouseover', function (e) {
            e.target.style.borderRight = '3px solid #0000ff';
        })

        div.addEventListener('mouseout', function (e) {
            e.target.style.borderRight = '';
        })

        document.addEventListener('mousemove', function (e) {
            if (curCol) {
                var diffX = e.pageX - pageX;
            
                let nextColDif = (nxtColWidth - (diffX));
                let currentColDif = (curColWidth + diffX);

                if(nextColDif<=10 || currentColDif<=10) return;

                if (nxtCol) nxtCol.style.width = nextColDif + 'px';
                curCol.style.width = currentColDif + 'px';
            }
        });

        document.addEventListener('mouseup', function (e) { 
            curCol      = undefined;
            nxtCol      = undefined;
            pageX       = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined;
        });
    }
    
    function createDiv(height){
        var div = document.createElement('div');
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = '7px';
        div.style.position = 'absolute';
        div.style.cursor = 'col-resize';
        div.style.userSelect = 'none';
        div.style.height = '100%';
        return div;
    }
    
    function paddingDiff(col){
    
        if (getStyleVal(col,'box-sizing') == 'border-box'){
            return 0;
        }

        var padLeft = getStyleVal(col,'padding-left');
        var padRight = getStyleVal(col,'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));

    }

    function getStyleVal(elm,css){
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
};