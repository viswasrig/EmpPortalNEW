// import 'moment'; 
let loader = (function (gGridParam) {

    let gridOptions = {};
    let gridContainerEle = null;
    let tableEle = null;
    let GRID_CONSTANTS = null;
    function initilizeTable(options) {
        defaultGridProperties();
        options = $.extend(gridOptions, options);
        gridOptions = options;
        let tableClass = options.tableClass || '';
        let gridContainer = options.container;
        gridContainerEle = $('.' + gridContainer);
        if (!($(gridContainerEle) && $(gridContainerEle).length > 0)) {
            gridContainerEle = $('<div>').addClass(gridContainer);
        }
        GRID_CONSTANTS = gGrid.GRID_CONSTANTS;
        tableEle = $(gridContainerEle).find('table');
        let isTableexists = $(tableEle) && $(tableEle).length > 0;
        if (isTableexists) {
            $(tableEle).remove();
        }
    
        tableEle = createElement('<table />').addClass('table gGrid-table').addClass(tableClass).attr('id',getRandomId());
        buildColumns();
        if(gridOptions.pager){
            initPagination();
            pagination();
        }
        buildTableBody();
        $(tableEle).appendTo(gridContainerEle);
        if(gridOptions.pager){
            pagination();
        }
        
    }

    initPagination = () =>{
        gridOptions.pagination = {
            totalRecords: '',
            totalPages: '',
            currentPage: 1,
            pageSize: 50,
            startPage: '',
            endPage: ''}
    }

    function createElement(type) {
        return gGrid.gGridService.createElement(type);
    }

    function buildColumns() {
        let columns = gridOptions.columns;
        let thead = createElement('<thead />').attr('id',getRandomId());
        let theadRow = createElement('<tr />').attr('id',getRandomId());
         // check Table level Sorting is Enabled or Column Level
         let tableLevelSort = gridOptions.sorting || false;
         let tableLevelFilter = gridOptions.filtering || false;
         let isTableFilterSelected = tableLevelFilter;
        for (let i = 0; i < columns.length; i++) {
            let width = (100 / columns.length) + '%';
            columns[i].width = columns[i].width ||width;
            columns[i].enableSorting =  columns[i].enableSorting || tableLevelSort;
            isTableFilterSelected =  isTableFilterSelected || columns[i].enableFiltering;
                const col$ = buildColumn(columns[i]);
            $(col$).appendTo(theadRow);
        }
        $(theadRow).appendTo(thead);
        if(isTableFilterSelected){
            let filterRowEle = buildFilterRowElement(columns);
            $(filterRowEle).appendTo(thead);
        }
        $(thead).appendTo(tableEle);
        // console.log($(tableEle));
    }

    buildFilterRowElement = (columns) =>{
        return gGrid.gGridService.buildFilterRow(columns, filterData);
    }

    function getRandomId() {
        return gGrid.gGridService.getRandomId();
    }

    function buildColumn(column) {
        let theadRowTh = createElement('<th />').attr('id',getRandomId()).addClass('thead');
        $(theadRowTh).attr('width', column.width);
        let div = createElement('<div/>').addClass(column.className || '').attr('id',getRandomId());
        let titleSpan = createElement('<span/>').html(column.title);
        $(titleSpan).appendTo(div);
        
        if(column.enableSorting && column.sort){
            column['sortAction'] = buildSort;
            let sortEle = gGrid.gGridService.buildSortElement(column);
            $(sortEle).appendTo(div);
        }
        $(div).appendTo(theadRowTh);
        return theadRowTh;
    }

    buildSort = (column, ele) =>{
        let removeClass = column.sort[column.sort.orderBy];
        sortTableData(column);
        let sort =column.sort;
        let addClass = column.sort[column.sort.orderBy];
        $(ele).find('span').removeClass(removeClass).addClass(addClass); 
    }

    sortTableData = (column) =>{
        let data = _.cloneDeep(gridOptions.dataSource.data); 
        column.sort.orderBy = column.sort.orderBy === GRID_CONSTANTS.SORT.ASC ? GRID_CONSTANTS.SORT.DESC: GRID_CONSTANTS.SORT.ASC;
        data = gGrid.gGridService.sortByKeyAndOrder(data, column);
        gridOptions.dataSource.data = data;
        rebuildTableBody();
    }


    filterData = (column, ele) =>{
        let value = $(ele).val();
        let data = _.cloneDeep(gridOptions.dataSource.originalData ||[]);
        gridOptions.dataSource.originalData = gridOptions.dataSource.originalData || data;
        let newData = [];
        if(value && value.length>0 ){
            for(let i=0; i< data.length; i++){
                let record = data[i];
                let matchedValue = record[column.field] ||''; 
                switch(column.dataType){
                    case GRID_CONSTANTS.DATA_TYPES.STRING:
                        matchedValue = matchedValue.toLowerCase();
                        value = value.toLowerCase();
                        break;
                    case GRID_CONSTANTS.DATA_TYPES.NUMBER:
                        matchedValue = matchedValue;
                        value = value.toLowerCase();
                        break;
                }
                if(matchedValue.indexOf(value) > -1){
                    newData.push(record);
                }
            }
            $(ele).parent().next().find('span').addClass('fa fa-close');
        }else{
            $(ele).parent().next().find('span').removeClass('fa fa-close');
            newData = _.cloneDeep(gridOptions.dataSource.originalData);  
        }
        gridOptions.dataSource.data = newData;
        if(gridOptions.pager){
            gridOptions.pagination.currentPage =1;
            gridOptions.pagination.startPage = '';
            gridOptions.pagination.endPage = ''
        }
        rebuildTableBody();
    }

    function buildTableBody(){
        let tableBody = $(tableEle).find('tbody');
       let  isTableBody  = $(tableBody).length;
            if(!isTableBody){
                tableBody = createElement('<tbody />').attr('id', getRandomId()).addClass('tbody');
            }else{
                $(tableBody).find('tr').remove();
            }

        let dataSource = gridOptions.dataSource;
        let columns = gridOptions.columns;
        let data = _.cloneDeep(dataSource && dataSource.data ||[]);
        let startIndex = 0;
        let endIndex = 1;
        if(!data || data && data.length == 0){
            let tr = createElement('<tr />').attr('id', getRandomId()).addClass('tbody-tr');
            let td = createElement('<td />').attr('id',getRandomId()).addClass('tr-nodata').attr('colspan',columns.length);
            let div = createElement('<div />').addClass('text-center').html('No Data Available');
            $(div).appendTo(td);
            $(td).appendTo(tr);
            $(tr).appendTo(tableBody);
            $(tableBody).appendTo(tableEle);
            return;
        }
        if(gridOptions.pager){
            let paginationObj = gridOptions.pagination;
            startIndex =  (paginationObj.currentPage-1)*paginationObj.pageSize;
            endIndex = (paginationObj.currentPage-1)*paginationObj.pageSize+paginationObj.pageSize;
        }
        dataSource.viewData = gridOptions.pager ? data.slice(startIndex, endIndex):data
        dataSource.schema = {fields:{}};
        for(let i=0; i< dataSource.viewData.length; i++){
            let record = dataSource.viewData[i];
            let tr = createElement('<tr />').attr('id', getRandomId()).addClass('tbody-tr').on('dblclick',function(e){
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                }else{
                    $(this).addClass('selected');
                    if(gridOptions.onSelectRow){
                        gridOptions.onSelectRow(i, record);
                    }
                }
            });
            for(let j=0;j<columns.length;j++){
                let td = createElement('<td />').attr('id', getRandomId()).addClass('tbody-tr-td');
               let template = gGrid.gGridService.getCellTempplate(columns[j],record);
               $(template).appendTo(td);
               $(td).appendTo(tr);
               dataSource.schema.fields[columns[j]['field']] = columns[j]['dataType'];  
            }
            $(tr).appendTo(tableBody);
        }
        gridOptions.dataSource = dataSource;
        $(tableBody).appendTo(tableEle);
    }

    function rebuildTableBody(){
        buildTableBody();
        if(gridOptions.pager){
            pagination();
        }
    }


    function defaultGridProperties(){
        gridOptions = gGrid.gGridProps.getTableProperties();
    }

    function pagination(){
        let pagination = gridOptions.pagination;
        let data = gridOptions.dataSource && gridOptions.dataSource.data || [];
        pagination.totalRecords = data.length;
        pagination.pageSize = pagination.pageSize || 10;
        pagination.totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);
        pagination.currentPage = pagination.currentPage || 1;
        pagination.startPage = pagination.startPage || 1;
        pagination.endPage = pagination.endPage || pagination.totalPages;
        pagination.pages = _.range(pagination.startPage,pagination.endPage+1);
        gridOptions.pagination = pagination;
        pagination.changePage = changePage;
        let pagerEle = gGrid.gGridService.buildPagination(pagination);
        let tablePagination = $('.table-pagination');
        if($(tablePagination).length  >0 ){
            $(tablePagination).remove();
        }
        $(pagerEle).insertAfter(tableEle);
    }

    function changePage(pageNo){
        
        if(gridOptions.pagination.currentPage == pageNo  || gridOptions.pagination.currentPage === pageNo){
            return;
        }
        gridOptions.pagination.currentPage = pageNo;
        rebuildTableBody();

    }

    


    let gGrid_ = {
        init: initilizeTable
    };
    return gGrid_;
})(window.gGrid);
window.gGrid = gGrid || {};
window.gGrid['loader'] = loader;