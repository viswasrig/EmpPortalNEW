const GRID_CONSTANTS = {
    FILTER_TYPES: {
        BASIC: 'BASIC',
        POP_UP: 'POP_UP',
        DROP_DOWN: 'DROP_DOWN'
    },
    POP_UP_SUB_TYPES: {
        DROPDOWN_CONDITIONS: 'DROPDOWN_CONDITIONS',
        DROP_DOWN_CHECK_BOX: 'DROP_DOWN_CHECK_BOX'
    },
    SORT:{
        ASC:'ASC',
        DESC:'DESC'
    },
    DATA_TYPES: {
        NUMBER: 'number',
        STRING: 'string',
        BOOLEAN: 'boolean',
        YESORNO: 'yesOrNO',
        OBJECT: 'object',
        ARRAY: 'array',
        FUNC: 'function',
        DATE:'date',
        DATE_TIME:'datetime',
        ACTION:'action',
        CUSTOM_ACTION:'customaction',
        CURRENCY:'currency',
        URL:'url',
        ACTION_BUTTONS:'actionbuttons',
        IMAGE:'image'
    }

};
window.gGrid = window.gGrid||{};
window.gGrid['GRID_CONSTANTS'] =GRID_CONSTANTS;