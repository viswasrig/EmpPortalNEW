export const gridOptions = _gridOptions();


function _gridOptions() {
    return {
        height: 550,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [],
        dataSource: {
            schema: {
                data: [],
                model: {
                    fields: {}
                }
            },
        },
        editable: false,
        resizable: true
    };
}
