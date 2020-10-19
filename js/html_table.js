var globalWebTables = {};
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

        let tableTotalEnable = false;

        // Coloumns generating 
        let tr = document.createElement('tr');

        for(let columnNum in this.columns._list){

            let column = this.columns._list[columnNum];

            if(column.totalEnable){
                tableTotalEnable = true;
            }

            let th = document.createElement('th')
            th.innerHTML = column.getTitle();

            th.id = column._guid;
            th.setAttribute("table", parent._guid);

            for(let style in column.style){
                th.style[style] = column.style[style];
            }

            if(column.columnWidth!=undefined){
                th.style.width = column.columnWidth + "px";
            }

            if(column.orderingEnable){
                if(column._orderDownInUse){
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns webTableOrderSelectingBtns_inuse" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 12v-1.5L10 5.75v2.1l2.2.9v5l-2.2.9v2.1L21 12zm-7-2.62l5.02 1.87L14 13.12V9.38zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/></svg>';
                } else if(column._orderUpInUse){
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns webTableOrderSelectingBtns_inuse" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 12v1.5l11 4.75v-2.1l-2.2-.9v-5l2.2-.9v-2.1L3 12zm7 2.62l-5.02-1.87L10 10.88v3.74zm8-10.37l-3 3h2v12.5h2V7.25h2l-3-3z"/></svg>';
                }else{
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 12v-1.5L10 5.75v2.1l2.2.9v5l-2.2.9v2.1L21 12zm-7-2.62l5.02 1.87L14 13.12V9.38zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/></svg>';
                } 
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

                //td.onchange = function(){ console.log("TD on change")};

                if(column.isEditable){
                    let tableObj = this;
                    let onChangeFunction = function(){
                        string[column.getName()] = this.innerHTML.trim();
                        // Recounting total
                        if(column.totalEnable && column.totalFixedValue==undefined){
                            let countingTotalValue = tableObj.getColumnTotal(column);
                            column.totalCell.innerHTML = countingTotalValue;
                        }
                            
                    }

                    td.addEventListener("input",    onChangeFunction, false);
                    //td.addEventListener("blur",     onChangeFunction, false);
                    //td.addEventListener("keyup",    onChangeFunction, false);
                    //td.addEventListener("paste",    onChangeFunction, false);
                    //td.addEventListener("cut",      onChangeFunction, false);
                    //td.addEventListener("mouseup",  onChangeFunction, false);
                }

                if(column.isEditable){
                    td.setAttribute("contenteditable", "true");
                }

                if(string.columnStyles[column.getName()]!=undefined){
                    for(let style in string.columnStyles[column.getName()]){
                        td.style[style] = string.columnStyles[column.getName()][style];
                    }
                }

                tr.appendChild(td);
            }   
        } 

        // Total
        if(tableTotalEnable){
            let tr_total = document.createElement('tr');

            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                let td = document.createElement('td');
                if(column.totalEnable){
                    if(column.totalFixedValue==undefined){
                        // Recounting total
                        let countingTotalValue = this.getColumnTotal(column);
                        td.innerHTML = countingTotalValue;
                        column.totalCell = td;
                    }else td.innerHTML = column.totalFixedValue;
                }

                td.className = "totalCell";
                for(let style in column.totalCellStyle){
                    td.style[style] = column.totalCellStyle[style];
                }

                tr_total.appendChild(td);
            } 
            table.appendChild(tr_total);
        }

        // Second title
        if(this.bottomHeader){
            let tr2 = document.createElement('tr');
            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                let th = document.createElement('th')
                th.innerHTML = column.getTitle();
                tr2.appendChild(th);
            } 
            table.appendChild(tr2);
        }
        
        resizableGrid(table);

        let div = document.createElement('div');

        if(this.tableFunctionButtonsEnable){
            let div_tableButtons = document.createElement('div');
            div_tableButtons.className = "WebTable_functionButtonsWrapper";

            if(this.tableFunctionButton_resize_Enable){
                let span = document.createElement('span');
                span.onclick = function(){
                    //console.log(this);
                    parent.resetColumnsSizes();
                };
                span.className = "WebTable_functionButton";
                span.innerHTML = 'Reset size <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>';
                div_tableButtons.appendChild(span);
            }

            if(this.tableFunctionButton_exportToCSV_Enable){
                let span = document.createElement('span');
                span.className = "WebTable_functionButton";
                span.innerHTML = 'To CSV <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';
                div_tableButtons.appendChild(span);
            }

            if(this.tableFunctionButton_exportToJSON_Enable){
                let span = document.createElement('span');
                span.className = "WebTable_functionButton";
                span.innerHTML = 'To XML <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';
                div_tableButtons.appendChild(span);
            }
            
            if(this.tableFunctionButton_exportToXML_Enable){
                let span = document.createElement('span');
                span.className = "WebTable_functionButton";
                span.innerHTML = 'To JSON <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>';
                div_tableButtons.appendChild(span);
            }

            div.appendChild(div_tableButtons);
        }

        div.appendChild(table);
        
        // Wrapper
        if(!ignoreWrapper){
            var divWrapper = document.createElement('div');
            divWrapper.className = "webTableWrapper";
            divWrapper.id = this._wrapper_guid;

            // Wrapper styles
            for(let i in this.wrapperStyle){
                divWrapper.style[i] = this.wrapperStyle[i];
            }

            divWrapper.appendChild(div);
            return divWrapper;
        }else{
            return div;    
        }
        
    }

    this.sortByColumnID = function(columnID){
        column = this.getColumnByID(columnID);
        if(!column) console.error("Column not found");

        // cancel any ather sortings
        for(let i in this.columns._list){
            let column = this.columns._list[i];
            if(column._guid!=columnID){
                column._orderUpInUse = false;
                column._orderDownInUse = false;
            }
        }

        // apply sorting
        if(column._orderDownInUse){
            column._orderDownInUse = false;
            column._orderUpInUse = true;
        }else if(column._orderUpInUse){
            column._orderUpInUse = false;
            column._orderDownInUse = true;
        }else{
            column._orderDownInUse = true;
        }

        let wrapperElement = document.getElementById(this._wrapper_guid);
        wrapperElement.innerHTML = "";

        if(column._orderDownInUse){
            this.strings._list.sort(function (a, b) {
                if (a[column.getName()]>b[column.getName()]){ 
                    return 1;
                }else if (a[column.getName()]<b[column.getName()]){  
                    return -1;
                }else return 0;
            });
        }else{
            this.strings._list.sort(function (a, b) {
                if (a[column.getName()]<b[column.getName()]){ 
                    return 1;
                }else if (a[column.getName()]>b[column.getName()]){  
                    return -1;
                }else return 0;
            });
        }
        

        wrapperElement.appendChild(this.generateTable(true));
    }

    this.getColumnTotal = function(column){
        let countingTotalValue = 0;
        for (let stringNum in this.strings._list){
            let string = this.strings._list[stringNum];
            countingTotalValue += hardParseInt(string[column.getName()], 0);
        }
        return countingTotalValue;
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

    this.resetColumnsSizes = function(){

        for(let columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            column.columnWidth = undefined;
        }

        let wrapperElement = document.getElementById(this._wrapper_guid);
        wrapperElement.innerHTML = "";
        wrapperElement.appendChild(this.generateTable(true));
    }

    this._guid = generateGUID();
    this._wrapper_guid = generateGUID();
    this.wrapperStyle = {};
    this.evenColoring = false;

    this.tableFunctionButtonsEnable = false;
    this.tableFunctionButton_resize_Enable = true;
    this.tableFunctionButton_exportToCSV_Enable = true;
    this.tableFunctionButton_exportToJSON_Enable = true;
    this.tableFunctionButton_exportToXML_Enable = true;

    globalWebTables[this._guid] = this;
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

    this._orderDownInUse = false;
    this._orderUpInUse = false;

    this.columnWidth = undefined;
    this.style = {};
    this.resizable = true;
    this.totalEnable = false;
    this.totalFixedValue = undefined;
    this.totalCellStyle = {}
    this.isEditable = false;
    this.totalCell = undefined;
}


// Object string
function WebTableString(columns){
    if(new.target==undefined) return new WebColumn(columns);
    this.columnStyles = {};
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

                let table = globalWebTables[curCol.getAttribute("table")];
                
                //console.log(tablee.getColumnByID(curCol.id));
                //columnWidth
                let curColumn = table.getColumnByID(curCol.id);
                if(!curColumn.resizable) return;

                if (nxtCol){
                    let nextColumn = table.getColumnByID(nxtCol.id);
                    nextColumn.columnWidth = nextColDif;
                    if(nextColumn.resizable) nxtCol.style.width = nextColDif + 'px';
                }

                
                curColumn.columnWidth = currentColDif;
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