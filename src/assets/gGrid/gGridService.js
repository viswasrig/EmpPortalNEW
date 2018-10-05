const gGridService = (function(){
    // Variable Declarations
    let DATA_TYPES = null;

    function _getRandomId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (let i = 0; i < 5; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    function _createElement(type){
        return $(type);
    }

    function createDefaultTemplate(){
        return _createElement('<div />').attr('id', _getRandomId()).addClass('td-div');
    }

    function _getCellTemplate(column, data){
        const DTYPES = gGrid.GRID_CONSTANTS.DATA_TYPES;
        DATA_TYPES = DTYPES;
        let dataType = column.dataType || DATA_TYPES.STRING;
        let template = createDefaultTemplate().on('click',function(e){
            // function(column);
            if (column.enableFiltering) { 
                onClickRowColumn(column,data);
            }
        });
        switch(dataType){
            case DATA_TYPES.STRING:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.NUMBER:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.BOOLEAN:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.YESORNO:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.OBJECT:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.ARRAY:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.FUNC:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.DATE:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.DATE_TIME:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.ACTION_BUTTONS:{
                buildActionButtons(template, column.buttons,data);
                /* if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                } */
                break;
            }
            case DATA_TYPES.ACTION:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.CUSTOM_ACTION:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.CURRENCY:{
                let currency = column.valueFormat.currencyFormat;
                let decimalLimit = column.valueFormat.decimalLimit;
                let value = data[column.field]||'0.00'
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    let floatValue = currency + parseFloat(value).toFixed(decimalLimit);
                    $(template).html(floatValue);
                }
                break;
            }
            case DATA_TYPES.URL:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            case DATA_TYPES.IMAGE:{
                if(column.customTemplateFun){
                    template = column.customTemplateFun(column,data);
                }else{
                    $(template).html(data[column.field]||'');
                }
                break;
            }
            default:

        }
        return template;
    }

    function buildActionButtons(template, buttons,item){
        for(let i=0;i<buttons.length;i++){
            let button = buttons[i];
            let isVisible = true;
            let anchor =  _createElement('<a />').attr('href','javascript:void(0)').addClass(button.pClass).attr('title',button.title).on('click',function(e){
                if(button.onClick){
                    button.onClick(button.actionType,item);
                }
            });
            let span = _createElement('<span />').addClass(button.buttonClassName);
            $(span).appendTo(anchor);
            if(button.visibleIf){
                let f = new Function('item','' + button.visibleIf+'');
                isVisible = f(item);
            }
            if(isVisible){
                $(anchor).appendTo(template);
            }

        }
    }


    function paginationTemplate(pagination){
        let paginationClass = pagination.paginationClass || 'pagination';
        let prevTxt = pagination.prevTxt || 'Previous';
        let nextTxt = pagination.nextTxt || 'Next';
        let nextClass = '', prevClass='', lastClass= '', firstClass= '', pageClass='', activeClass='',disabledClass='';
        let pageSize = pagination.pageSize;
        let totalPages = pagination.totalPages ;
        let currentPage = pagination.currentPage;
        let startPage = pagination.startPage;
        let endPage = pagination.endPage;
        let totalRecords = pagination.totalRecords;

        firstClass = pagination.firstClass||'fa fa-angle-double-left';
        lastClass = pagination.lastClass||'fa fa-angle-double-right';
        let pageChange = pagination.changePage;

        let pageContainer = _createElement('<div/>').attr('id', _getRandomId()).addClass('table-pagination w-100');
        let msg = 'Showing ' + currentPage + ' to ' + totalPages + ' of ' + totalRecords + ' entries';
        let divLeft = _createElement('<div />').attr('id',_getRandomId()).addClass('float-left');
        divLeft =$(divLeft).html(msg).addClass('small');
        $(divLeft).appendTo(pageContainer);
        let ulRight = _createElement('<ul />').attr('id',_getRandomId()).addClass(paginationClass).addClass('float-right');
        
        const firstLi = buildPageLink(firstClass,'',1,pageChange);
        $(firstLi).removeClass(currentPage>1?'disabled':'na').addClass(currentPage === 1?'disabled':'na');
        $(firstLi).appendTo(ulRight);
        
        const prevLi = buildPageLink('', prevTxt,currentPage-1 <= 0 ? 1 :currentPage-1,pageChange);
        $(prevLi).removeClass(currentPage>1?'disabled':'na').addClass(currentPage === 1?'disabled':'na');
        $(prevLi).appendTo(ulRight);

        for(let i= startPage; i <= endPage; i++){
            let numBerLi = buildPageLink('',i,i,pageChange);
            if( currentPage === i){
                $(numBerLi).addClass('active');
            }
            $(numBerLi).appendTo(ulRight);
        }

        const nextLi = buildPageLink(nextClass,nextTxt, currentPage+1 >= totalPages ? totalPages:currentPage+1, pageChange);
        $(nextLi).removeClass(currentPage < totalPages?'disabled':'na').addClass(currentPage === totalPages?'disabled':'na');
        $(nextLi).appendTo(ulRight);

        const lastLi = buildPageLink(lastClass, '', totalPages, pageChange);
        $(lastLi).removeClass(currentPage < totalPages?'disabled':'na').addClass(currentPage === totalPages?'disabled':'na');
        $(lastLi).appendTo(ulRight);

        $(ulRight).appendTo(pageContainer);
        return pageContainer;
    }

    buildPageLink = (className,title,pageNo, action) => { 
        let li = _createElement('<li />').addClass('page-item');
        let atag = _createElement('<a />').addClass('page-link').attr('href','javascript:void(0)');
        let span = _createElement('<span />').addClass(className).html(title);
        $(li).on('click',function(e){
            action(pageNo)
        });
        $(span).appendTo(atag);
        $(atag).appendTo(li);
        return li;
    }

    sortByKeyAndOrder = (data, column) =>{
        let orderBy = column.sort.orderBy;
        let key = column.field;
        let dataType = column.sort.dataType;
        let sortOrder = orderBy === 'DESC' ? -1:1;
        data .sort((a,b) => {
            let result = 0;
            switch(dataType){
                case 'number':
                case 'stringnumber':
                    result =  a[key] - b[key];
                    break;
                case 'string':
                    result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
                    break;
                case 'date':
                case 'datetime':
                    let inputFormat = column.format || "MM/DD/YYYY";
                    let fromDate = moment(a[key],inputFormat).toDate().getTime();
                    let lastDate = moment(b[key],inputFormat).toDate().getTime();
                    result = fromDate-lastDate;
                default:
                    result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
                    break;
            }
            return result * sortOrder;
        });
        return data;
    }

    buildSortElement = (column) =>{
        let sortA = _createElement('<a />').attr('href','javascript:void(0)').on('click', function(e){
            if(column.sortAction){
                column.sortAction(column, this);
            }
        });
        let sortSpan = _createElement('<span />')
        let iconClass = column.sort[column.sort.orderBy]
        $(sortSpan).addClass(iconClass).addClass('float-right');
        $(sortSpan).appendTo(sortA);
        return sortA;
    }

    buildFilterTrElement = (columns,action) => {
        let theadTrTd = _createElement('<tr/>').addClass('filter-row').attr('id',_getRandomId());
        for(let i =0; i< columns.length;i++){
            columns[i].filterAction = action;
            let col$ = buildFilterTdElement(columns[i]);
            $(col$).appendTo(theadTrTd);
        }
        return theadTrTd;
    }
   
    buildFilterTdElement = (column) => {
        let theadTrTd = _createElement('<td/>').attr('id',_getRandomId());
        let filterEle = _createElement('<div/>').addClass(column.className || 'filter-div d-block w-100').attr('id',_getRandomId());
        let firstDiv = _createElement('<div/>').addClass(column.className || 'd-inline-block filter-f-input-c w-100');
        let secondDiv = _createElement('<div/>').addClass(column.className || 'd-inline-block filter-s-input-c position-relative float-right');
        let inputelement = _createElement('<input/>').attr('type','text').attr('name','filter_'+column.field).addClass('form-control').on('change, keyup',function(e){
            if(column.filterAction){
                column.filterAction(column,this); 
            }
        });
        
        let spanEle = _createElement('<span />').addClass('').on('click',function(e){
            $(inputelement).val('');
            if(column.filterAction){
                column.filterAction(column,inputelement); 
            }
        });
        if(column.enableFiltering){
            $(inputelement).appendTo(firstDiv);
            $(spanEle).appendTo(secondDiv);
        }
        $(firstDiv).appendTo(filterEle);
        $(secondDiv).appendTo(filterEle);
        $(filterEle).appendTo(theadTrTd)
        return theadTrTd;
    }

    function onClickRowColumn(column, data) { 
        let tdEle =  $('.g-grid').find('table > thead>tr > td:eq(' + column.index + ')');
        if ( $(tdEle) && $(tdEle).length > 0) { 
            let inputEle =  $(tdEle).find('input');
            if (inputEle && $(inputEle).length > 0) {
                $(inputEle).val(data[column.field]);
                column.filterAction(column,$(inputEle));
             }
        }
    }

    return{
        getCellTempplate:_getCellTemplate,
        getRandomId: _getRandomId,
        createElement:_createElement,
        buildPagination: paginationTemplate,
        sortByKeyAndOrder:sortByKeyAndOrder,
        buildSortElement: buildSortElement,
        buildFilterRow: buildFilterTrElement
    };

})();
window.gGrid = window.gGrid || {};
window.gGrid['gGridService'] = gGridService; 