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

            if(column.sorteringEnable){
                if(column._orderDownInUse){
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns webTableOrderSelectingBtns_inuse" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 12v-1.5L10 5.75v2.1l2.2.9v5l-2.2.9v2.1L21 12zm-7-2.62l5.02 1.87L14 13.12V9.38zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/></svg>';
                } else if(column._orderUpInUse){
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns webTableOrderSelectingBtns_inuse" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 12v1.5l11 4.75v-2.1l-2.2-.9v-5l2.2-.9v-2.1L3 12zm7 2.62l-5.02-1.87L10 10.88v3.74zm8-10.37l-3 3h2v12.5h2V7.25h2l-3-3z"/></svg>';
                }else{
                    th.innerHTML += '<svg onclick="globalWebTables[\'' + parent._guid + '\'].sortByColumnID(\'' + column._guid + '\')" class="webTableOrderSelectingBtns" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 12v-1.5L10 5.75v2.1l2.2.9v5l-2.2.9v2.1L21 12zm-7-2.62l5.02 1.87L14 13.12V9.38zM6 19.75l3-3H7V4.25H5v12.5H3l3 3z"/></svg>';
                } 
            }

            if(column.filteringEnable){
                th.innerHTML += '<svg class="webTableOrderSelectingBtns ' + (column.sorteringEnable?"webTableOrderSelectingBtnsSecond":"") + '" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>';
                
                div_filtering = document.createElement('div');
                div_filtering.className = "WebTable-filter_poup"
                
                div_filtering_span = document.createElement('span');
                div_filtering_span.innerHTML = "Filter:";
                div_filtering_value = document.createElement('div');
                div_filtering_value.className = "WebTable-filter_poup-value"
                div_filtering_value.innerHTML = "12"
                div_filtering_value.setAttribute("contenteditable", "true");
                div_filtering_btn_ok = document.createElement('div');
                div_filtering_btn_ok.className = "WebTable-filter_poup-btn WebTable-filter_poup-btn-ok"
                div_filtering_btn_ok.innerHTML = "OK"
                div_filtering_btn_clear = document.createElement('div');
                div_filtering_btn_clear.className = "WebTable-filter_poup-btn WebTable-filter_poup-btn-cancel"
                div_filtering_btn_clear.innerHTML = "Cancel"

                div_filtering.appendChild(div_filtering_span);
                div_filtering.appendChild(div_filtering_value);
                div_filtering.appendChild(div_filtering_btn_ok);
                div_filtering.appendChild(div_filtering_btn_clear);
                div_filtering.appendChild(createClearBothBtn());

                th.appendChild(div_filtering);
            }   

            tr.appendChild(th);
        } 
        table.appendChild(tr);
        
        // String generating 
        if(this.isEditable) if(this.currentActiveString<0 || this.currentActiveString>this.strings._list.length-1) this.currentActiveString = undefined;

        for(let stringNum in this.strings._list){
            let string = this.strings._list[stringNum];
            let tr = document.createElement('tr');

            tr.id=string._guid;

            if(parent.evenColoring && stringNum%2==0) tr.className = "evenRow";

            if(this.isEditable){
                tr.onclick = function(){
                    let objs = document.getElementsByClassName("active_tr" + parent._guid);
                    for(let activeObjectsNum=0; activeObjectsNum<objs.length; activeObjectsNum++){
                        let activeObject = objs[activeObjectsNum];
                        activeObject.classList.remove("active_tr");
                        activeObject.classList.remove("active_tr" + parent._guid);
                    }
                    tr.className += "active_tr active_tr" + parent._guid;
                    parent.currentActiveString = parent.getCurrentActiveStringNum();
                }

                if(this.currentActiveString==stringNum) tr.className += "active_tr active_tr" + parent._guid;
            }

            table.appendChild(tr);

            for(let columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                let td = document.createElement('td');

                if(!column.isCounter) td.innerHTML = string[column.getName()];
                else td.innerHTML = (hardParseInt(stringNum, 0) + 1)
                

                //td.onchange = function(){ console.log("TD on change")};

                if(column.isEditable){
                    let tableObj = this;
                    // On edit
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
                let div = document.createElement('div');
                div.onclick = function(){
                    parent.resetColumnsSizes();
                };
                div.className = "WebTable_functionButton";
                div.innerHTML = '<span>Reset size <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg></span>';
                div_tableButtons.appendChild(div);
            }

            if(this.tableFunctionButton_exportToCSV_Enable){
                let div = document.createElement('div');
                div.className = "WebTable_functionButton";
                div.innerHTML = '<span>To CSV <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg></span>';
                div.onclick = function(){
                    parent.showCodeDialog(parent.generate_CSV());
                }
                div_tableButtons.appendChild(div);
            }

            if(this.tableFunctionButton_exportToXML_Enable){
                let div = document.createElement('div');
                div.className = "WebTable_functionButton";
                div.innerHTML = '<span>To XML <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg></span>';
                div.onclick = function(){
                    parent.showCodeDialog(parent.generate_XML());
                }
                div_tableButtons.appendChild(div);
            }
            
            if(this.tableFunctionButton_exportToJSON_Enable){
                let div = document.createElement('div');
                div.className = "WebTable_functionButton";
                div.innerHTML = '<span>To JSON <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg></span>';
                div.onclick = function(){
                    parent.showCodeDialog(parent.generate_JSON());
                }
                div_tableButtons.appendChild(div);
            }

            div.appendChild(div_tableButtons);

            div.appendChild(createClearBothBtn());
        }

        if(this.isEditable){
            let stringEditingButtonDiv = document.createElement('div');
            stringEditingButtonDiv.className = "WebTable_stringEditBtnsWrapper";

            let stringBTN;
            

            // New string
            stringBTN = document.createElement('div');
            stringBTN.className = "WebTable_stringEditBtn";
            stringBTN.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>';
            stringBTN.onclick = function(){
                parent.strings.add();
                parent.currentActiveString = parent.strings._list.length-1;
                parent.redrawTable();
            }
            stringEditingButtonDiv.appendChild(stringBTN);

            // Remove string
            stringBTN = document.createElement('div');
            stringBTN.className = "WebTable_stringEditBtn";
            stringBTN.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
            stringBTN.onclick = function(){
                parent.removeActiveString();
                parent.redrawTable();
            }
            stringEditingButtonDiv.appendChild(stringBTN);

            // Move string up
            stringBTN = document.createElement('div');
            stringBTN.className = "WebTable_stringEditBtn";
            stringBTN.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
            stringBTN.onclick = function(){
                parent.moveActiveStringUp();
                parent.redrawTable();
            }
            stringEditingButtonDiv.appendChild(stringBTN);

            // Move string down
            stringBTN = document.createElement('div');
            stringBTN.className = "WebTable_stringEditBtn";
            stringBTN.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
            stringBTN.onclick = function(){
                parent.moveActiveStringDown();
                parent.redrawTable();
            }
            stringEditingButtonDiv.appendChild(stringBTN);

            // Dublicate string
            stringBTN = document.createElement('div');
            stringBTN.className = "WebTable_stringEditBtn";
            stringBTN.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
            stringBTN.onclick = function(){
                parent.dublicateActiveString();
                parent.redrawTable();
            }
            stringEditingButtonDiv.appendChild(stringBTN);

            div.appendChild(stringEditingButtonDiv);
            div.appendChild(createClearBothBtn());
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

        this.redrawTable();
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

        this.redrawTable();
    }


    this.showCodeDialog = function(code){
        let dialog = window.open("", "", "width=400,height=400");
        dialog.document.write("<xmp>" + code + "</xmp>");
    }

    this.generate_CSV = function(){
        out = '';

        // Adding columns to XML
        for(columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            console.log(column.getTitle());
            out +=  (columnNum!=0?';':'') + column.getTitle();
        }
        out += '\n';

        // Adding strings to XML
        for(stringNum in this.strings._list){
            let string = this.strings._list[stringNum];
            //console.log(string);
            for(columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                out +=  (columnNum!=0?';':'') + JSON.stringify(string[column.getName()]);
            }            
            out +=  '\n';
        }
        return out;
    }

    this.redrawTable = function(){
        let wrapperElement = document.getElementById(this._wrapper_guid);
        wrapperElement.innerHTML = "";
        wrapperElement.appendChild(this.generateTable(true));
    }

    this.moveActiveStringUp = function(){
        if(this.currentActiveString==undefined) return;
        if(this.currentActiveString==0) return;
        let stringSearch = this.strings._list[this.currentActiveString];

        this.strings._list[this.currentActiveString] = this.strings._list[(this.currentActiveString) - 1];
        this.strings._list[(this.currentActiveString) -1] = stringSearch;
        this.currentActiveString--;
    }

    this.moveActiveStringDown = function(){
        if(this.currentActiveString==undefined) return;
        if(this.currentActiveString>=this.strings._list.length-1) return;
        let stringSearch = this.strings._list[this.currentActiveString];

        this.strings._list[this.currentActiveString] = this.strings._list[(this.currentActiveString) + 1];
        this.strings._list[(this.currentActiveString) + 1] = stringSearch;
        this.currentActiveString++;
    }

    this.removeActiveString = function(){
        if(this.currentActiveString==undefined) return;
        this.strings._list.splice(this.currentActiveString,1);

        this.currentActiveString = undefined;
    }

    this.dublicateActiveString = function(){
        if(this.currentActiveString==undefined) return;
        let stringSearch = this.strings._list[this.currentActiveString];

        let string = this.strings.add();
        for(columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            string[column.getName()] = stringSearch[column.getName()];
        }  
        
        this.currentActiveString = this.strings._list.length-1;
    }

    this.getCurrentActiveStringNum = function(){
        let objs = document.getElementsByClassName("active_tr" + parent._guid);
        for(let activeObjectsNum=0; activeObjectsNum<objs.length; activeObjectsNum++){
            let activeObject = objs[activeObjectsNum];
            for(let stringNum in this.strings._list){
                let stringSearch = this.strings._list[stringNum];
                if(stringSearch._guid==activeObject.id){
                    return hardParseInt(stringNum, undefined);
                }
            }
        }
        return undefined;
    }

    this.generate_XML = function(){
        out = '<?xml version="1.0" encoding="UTF-8"?>';
        out += '\n<table>';

        // Adding columns to XML
        out +=  '\n     <columns>';
        for(columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            out +=  '\n         <column>';
            out +=  '\n             <name>';
            out +=  '\n                 ' + column.getName();
            out +=  '\n             </name>';
            out +=  '\n             <title>';
            out +=  '\n                 ' + column.getTitle();
            out +=  '\n             </title>';
            out +=  '\n         </column>';
        }
        out +=  '\n     </columns>';

        // Adding strings to XML
        out +=  '\n     <strings>';
        for(stringNum in this.strings._list){
            let string = this.strings._list[columnNum];
            out +=  '\n         <string>';
            for(columnNum in this.columns._list){
                let column = this.columns._list[columnNum];
                //new_string[column.name] = string[column.name];
                out +=  '\n             <' + column.getName() + '>';
                out +=  '\n                 ' + string[column.getName()];
                out +=  '\n             </' + column.getName() + '>';
                
                //console.log(string);
            }            
            out +=  '\n         </string>';
        }
        out +=  '\n     </strings>';


        out += '\n</table>';
        return out;
    }

    this.generate_JSON = function(){
        let exportObject = {
            columns: [],
            strings: [],
        };

        // Adding columns to JSON
        for(columnNum in this.columns._list){
            let column = this.columns._list[columnNum];
            exportObject.columns.push({
                name: column.getName(),
                title: column.getTitle(),
            });
        }

        // Adding strings to JSON
        for(stringNum in this.strings._list){
            let string = this.strings._list[columnNum];
            let new_string = {};
            for(columnNum in exportObject.columns){
                let column = exportObject.columns[columnNum];
                new_string[column.name] = string[column.name];
                //console.log(string);
            }            

            exportObject.strings.push(new_string);
        }

        return (JSON.stringify(exportObject, null, 4));
    }

    this._guid = generateGUID();
    this._wrapper_guid = generateGUID();
    this.wrapperStyle = {};
    this.evenColoring = false;
    this.isEditable = false;
    this.tableFunctionButtonsEnable = false;
    this.tableFunctionButton_resize_Enable = true;
    this.tableFunctionButton_exportToCSV_Enable = true;
    this.tableFunctionButton_exportToJSON_Enable = true;
    this.tableFunctionButton_exportToXML_Enable = true;
    this.currentActiveString = undefined;

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
    this.sorteringEnable = false;
    this.filteringEnable = false;
    this.linkEnable = false;
    this.isCounter = false;

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
    if(new.target==undefined) return new WebTableString(columns);
    this.columnStyles = {};
    this._guid = generateGUID();
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

function createClearBothBtn(){
    let clearDiv = document.createElement('div');
    clearDiv.style.clear = "both";
    return clearDiv;
}