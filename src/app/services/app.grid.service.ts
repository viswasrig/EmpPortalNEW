import { Injectable } from '@angular/core';


declare const utils: any;

@Injectable()
export class AppGridService {

    constructor() {}

    getTableOptions = () => {
        return {
            gridId: 'ggrid_invoice',
            gridClassName: 'g-grid',
            container: 'g-grid',
            columns: [],
            sortable: false,
            filterable: false,
            rowSelectable: false,
            rowSortIcon: '',
            multiSelectEnable: false,
            inlineEdit: false,
            onSelectRow: null,
            tableClass: 'table-bordered', // table-striped
            dataSource: {data: [], viewData: [], schema: { fields: {}}},
            pager: false,
            pagination: {
                totalRecords: '',
                totalPages: '',
                currentPage: 1,
                pageSize: 50,
                startPage: '',
                endPage: ''}
        };
    }

    getColumnProperties = () => {
        return {
            index: 0,
            id: '',
            title: '',
            field: '',
            classNames: '',
            styles: '',
            enableFilter: false,
            enableSorting: false,
            sort: {orderBy: 'ASC', ASC: 'fa fa-arrow-up', DESC: 'fa fa-arrow-down', sortAction:null},
            filter: null,
            selected: false,
            groupable: false,
            customTemplateFun: '',
            dataType: '',
            template: null,
            width: '',
            height: '',
            onRowSelcet: null,
        };
    }

    getColumn = (index, title, field, datatype, enableSorting, enableFiltering, width) => {
        return {
            title: title, index: index, field: field, dataType: datatype,
            enableSorting: enableSorting, enableFiltering: enableFiltering, width: width,
            valueFormat: { currencyFormat: '', decimalLimit: 2 },
            sort: {orderBy: 'ASC', ASC: 'fa fa-long-arrow-up', DESC: 'fa fa-long-arrow-down', dataType: datatype}
        };
    }

}
