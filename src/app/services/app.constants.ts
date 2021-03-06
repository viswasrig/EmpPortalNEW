const _appConstants = {
    ALERT_TYPES: {
        ERROR: 'Errors',
        SUCCESS: 'Success',
        INFO: 'Info'
    },
    ROLE_TYPES: {
        SUP_ADM: 'Super Admin',
        ADMIN: 'Admin'
    },
    RESOURCES_CODES: {
        DASH: 'DASH',
        ASSOC: 'ASSOC',
        INVOC: 'INVOC',
        ASGMT: 'ASGMT',
        CLIENT: 'CLIENT',
        ADMIN: 'ADMIN',
        RPRTS: 'RPRTS',
        TMSHT: 'TMSHT',
        ACCT_RECEIVE: 'ACCT_RECEIVE',
        REPORT_ASSOC: 'REPORT_ASSOC',
        REPORT_EXP: 'REPORT_EXP',
        ACCT_RECEIVE_EXPENSES: 'ACCT_RECEIVE_EXPENSES',
        ACCT_INV_RECIEVE: 'ACCT_INV_RECIEVE',
        ADMIN_COMPEN: 'ADMIN_COMPEN',
        ADMIN_INCOME_ASSIGN: 'ADMIN_INCOME_ASSIGN',
        ADMIN_EXPENSES: 'ADMIN_EXPENSES',
        HOME: 'HOME',
        ROLE_ALLOCATE: 'ROLE_ALLOCATE',
        RESOURCE_ALLOCATE: 'RESOURCE_ALLOCATE',
        SDTL: 'SDTL',
        PDTL: 'PDTL',
        ADTL: 'ADTL'
    },
    RESOURCES: {
        DASH: 'Dashboard',
        ASSOC: 'Associates',
        INVOC: 'Invoices',
        ASGMT: 'Assignments',
        CLIENT: 'Clients',
        ADMIN: 'Administrator',
        RPRTS: 'Reports',
        TMSHT: 'Timesheets',
        ACCT_RECEIVE: 'Account Receivable',
        ADMIN_COMPEN: 'Compensation',
        ADMIN_INCOME_ASSIGN: 'Income Assignment',
        ADMIN_EXPENSES: 'Exployee Expenses',
        HOME: 'Home',
        SDTL: 'Statement',
        PDTL: 'Personal Details',
        ADTL: 'Project Details'
    },
    CONFIG: {
        BASE_URL: 'http://www.e3globalinc.com/EmpPortalNew/',
        PROD_URL: 'http://www.e3globalinc.com/EmpPortalNew/',
        DEV_URL: 'http://localhost:80/',
        ALL_INVOCIES_TYPE: 'api/invoices/allinvoices.php',
        ADD_INVOICE: 'api/invoices/addInvoice.php',
        SEARCH_ASSOCIATIVE: 'api/invoices/associativeSearch.php',
        SEARCH_ASSIGNMENT: 'api/invoices/assignmentSearch.php',
        EDIT_INVOICE: 'api/invoices/updateInvoice.php',
        RECIVE_PAYMENT_INVOICE: 'api/invoices/receivePayment.php',
        DELETE_INVOICE: 'api/invoices/invoiceDelete.php',
        REOPEN_INVOICE: 'api/invoices/reopenInvoice.php',
        ALL_ASSOCIATES: 'api/associates/allAssociates.php',
        NEW_ASSOCIATE: 'api/associates/createAssociate.php',
        EDIT_ASSOCIATE: 'api/associates/updateAssociate.php',
        DELETE_ASSOCIATE: 'api/associates/deleteAssociate.php',
        ALL_ASSIGNMENTS: 'api/assignments/allAssignments.php',
        NEW_ASSIGNMENT: 'api/assignments/createAssignment.php',
        EDIT_ASSIGNMENT: 'api/assignments/updateAssignment.php',
        DELETE_ASSIGNMENT: 'api/assignments/deleteAssignment.php',
        SEARCH_BYNAME_ASSOCIATE: 'api/assignments/searchAssociateByName.php',
        SEARCH_BYNAME_CLIENT: 'api/assignments/searchClientsByName.php',
        ALL_CLIENTS: 'api/clients/allClients.php',
        NEW_CLIENT: 'api/clients/createClient.php',
        EDIT_CLIENT: 'api/clients/updateClient.php',
        UPDATE_CLIENT: 'api/clients/updateClient.php',
        DELETE_CLIENT: 'api/clients/deleteClient.php',
        ALL_EXPENSES_BYUSERID: 'api/expenses/allExpensesByLogin.php',
        NEW_EXPENSE: 'api/expenses/createExpense.php',
        EDIT_EXPENSE: 'api/expenses/editExpense.php',
        DELETE_EXPENSE: 'api/expenses/deleteExpense.php',
        ALL_EXPENSES: 'api/expenses/allExpenses.php',
        ALL_ASSOCIATES_BY_TYPE: 'api/associates/allAssociatesReport.php',
        ALL_EXPENSES_BY_TYPE: 'api/expenses/allExpensesByType.php',
        ALL_ASSOCIATE_INCOME: 'api/associates/associateDetailsIncomeReport.php',
        ALL_ASSOCIATE_EXPENSE: 'api/associates/associateDetailsExpenseReport.php',
        ALL_ASSOCIATE_SUMMARY: 'api/associates/associateDetailsSummaryReport.php',
        ALL_COMPENSATIONS_BY_STATUS: 'api/compensations/AllCompensationsByStatus.php',
        CLOSE_COMPENSATION: 'api/compensations/closeCompensations.php',
        DELETE_COMPENSATION: 'api/compensations/deleteCompensation.php',
        CREATE_COMPENSATION: 'api/compensations/createCompensation.php',
        EDIT_COMPENSATION: 'api/compensations/updateCompensation.php',
        VIEW_COMPENSATION: 'api/compensations/viewCompensation.php',
        ALL_PAID_INVOICES: 'api/invoices/allPaidInvoices.php',
        ADM_ASSIGN_INCOME: 'api/income/assignIncome.php',
        ADM_ALL_ROLES_ASSOCIATED: 'api/roleandResources/allRoles.php',
        ALL_ROLES: 'api/roleandResources/allAvailableRoles.php',
        CREATE_NEW_ROLE: 'api/roleandResources/createRole.php',
        CREATE_NEW_ROLE_ASSOCIATE_MAP: 'api/roleandResources/createRoleMap.php',
        EDIT_ROLE_ASSOCIATE_MAP: 'api/roleandResources/updateRoleAndAssociateMap.php',
        DELETE_ROLE_ASSOCIATE_MAP: 'api/roleandResources/deleteRoleAndAssociateMap.php',
        ALL_RESOUCES_MAP_TO_ROLE: 'api/roleandResources/allResourcesMapToRole.php',
        ALL_RESOURCES: 'api/roleandResources/allAvailableResources.php',
        NEW_RESOURCE: 'api/roleandResources/createResource.php',
        NEW_RESOURCE_ROLE: 'api/roleandResources/createRoleAndResourceMap.php',
        EDIT_ROLE_RESOURCE_MAP: 'api/roleandResources/updateRoleAndResourceMap.php',
        DELETE_ROLE_RESOURCE_MAP: 'api/roleandResources/deleteRoleAndResourceMap.php',
        VIEW_ROLE_ASSOCAITE_MAP: 'api/roleandResources/viewRoleAndAssociateMap.php',
        VIEW_ROLE_RESOURCE_MAP: 'api/roleandResources/viewRoleAndResourceMap.php',
        ALL_ASSOCIATE_EXPENSES: 'api/expenses/allAssociateExpensesByType.php',
        ALL_COMPANY_EXPENSES: 'api/expenses/allCompanyExpensesByType.php',
        ASSIGN_EXPENSE_TRANS: 'api/expenses/expenseTransform.php',
        ADDRESS_DETAILS_USERID: 'api/associates/associateFullDetails.php',
        ALL_ASSIGNMENTS_BY_LOGIN: 'api/assignments/allAssignmentByLogin.php'

    },
    ROUTE: {
        BASE_PATH: './'
    },
    CRUD: {
        NEW: 'NEW',
        EDIT: 'EDIT',
        DELETE: 'DELETE',
        REPAY: 'REPAY',
        VIEW: 'VIEW',
        REOPEN: 'REOPEN',
        CLOSE: 'CLOSE',
        ASSIGN: 'ASSIGN'
    },
    DATA_TYPES: {
        STRING: 'string',
        NUMBER: 'number',
        DATE: 'date',
        DATETIME: 'datetime',
        URL: 'url',
        IMAGE: 'image',
        ACTIONS: 'actions',
        BOOLEAN: 'boolean',
        YESORNO: 'yesOrNO',
        OBJECT: 'object',
        ARRAY: 'array',
        FUNC: 'function',
        DATE_TIME: 'datetime',
        ACTION: 'action',
        CUSTOM_ACTION:'customaction',
        CURRENCY: 'currency',
        ACTION_BUTTONS: 'actionbuttons'
    }


};
export const APP_CONSTANTS = _appConstants;
