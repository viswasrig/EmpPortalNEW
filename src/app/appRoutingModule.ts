import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppLoginComponent } from './common/login/app.login.comp';
import { AppLayoutComponent } from './common/layout/app.layout.comp';
import {AppInvoiceComponent} from './invoices/app.invoice.comp';
import { AppInvoiceCRUDComponent } from './invoices/app.invoiceCRUD.comp';

import {AppNotFoundComponent} from './app.notFound.comp';
import { AppRoutingService } from './services/app.routing.service';
import { AppAssociativesComponent } from './associative/app.assoc.comp';
import { AppAssociativeCRUDComponent } from './associative/app.assocCRUD.comp';
import { AppAssignmentComponent } from './assignments/app.assign.comp';
import { AppAssignmentCRUDComponent } from './assignments/app.assign.CRUD.comp';
import { AppClientsComponent } from './clients/app.client.comp';
import { AppClientCRUDComponent } from './clients/app.client.crud.comp';
import { AppClientContactComponent } from './clients/app.contact.comp';
import { AppExpensesComponent } from './expenses/app.expenses.comp';
import { AppAccountReceivableComponent } from './accountrecive/app.acctreceive.comp';
import { AppAccountReceiveCRUDComponent } from './accountrecive/app.acctreceiveCRUD.comp';
import {AppExpenseCRUDComponent} from './expenses/app.expensCRUD.comp';
import {AppReportsComponent} from './reports/app.reports.comp';
import { AppReportExpensesComponent } from './reports/expenses/app.rep-exp.comp';
import { AppReportAssociatesComponent } from './reports/assoc/app.repo-assoc.comp';
import { AppReportAssociateDetailsComponent} from './reports/assoc/app.repo.assoc.details.comp';
import { AppAdminCompensationComponent} from './admin/compensation/app.adm.compensation.comp';
import { AppAdminIncomeAssignmentComponent} from './admin/income/app.adm.income.assign.comp';
import { AppAdminCompensationCRUDComponent } from './admin/compensation/app.adm.compensation.compCRUD';
import { AppRoleAllotmentComponent } from './admin/roles/app.adm.roles.comp';
import { AppRoleAssociateCRUDComponent } from './admin/roles/app.adm.roles.crud.comp';
import { AppRoleResourceAllotmentComponent } from './admin/resources/app.admin.resource.comp';
import { AppRoleResourceCRUDComponent } from './admin/resources/app.admin.resource.crud.comp';
import { AppAdminEmployeeExpensesComponent } from './admin/expenses/app.adm.exp.comp';
import { AppAdminExpenseCRUDComponent } from './admin/expenses/app.adm.exp.crud.comp';
import { AppAssociateClientAssignmentComponent } from './associative/app.assoc.clinet.assign.comp';
import { AppAssociatePersonalComponent } from './associative/app.assoc.personal.comp';
import { AppAssociateStatementComponent } from './associative/app.assoc.stmt.comp';
import { AppAssociateStatementDetailsComponent } from './associative/app.assoc.stmt.crud.comp';


declare const utils: any;
const appRoutes: Routes = [
    {path: '', redirectTo: 'layout', pathMatch: 'full'},
    {path: 'login', component: AppLoginComponent},
    {path: '404', component: AppNotFoundComponent},
    {path: 'layout', component: AppLayoutComponent, children: [
        {path: '', redirectTo: 'exp', pathMatch: 'full'},
        {path: 'invoice', component: AppInvoiceComponent},
        {path: 'invnew', component: AppInvoiceCRUDComponent},
        {path: 'crud', component: AppInvoiceCRUDComponent},
        {path: 'ed', component: AppInvoiceCRUDComponent},
        {path: 'de', component: AppInvoiceCRUDComponent},
        {path: 'assoc', component: AppAssociativesComponent},
        {path: 'assocCRUD', component: AppAssociativeCRUDComponent},
        {path: 'assign', component: AppAssignmentComponent},
        {path: 'assignCRUD', component: AppAssignmentCRUDComponent},
        {path: 'clients', component: AppClientsComponent},
        {path: 'clientCRUD', component: AppClientCRUDComponent},
        {path: 'contact', component: AppClientContactComponent},
        {path: 'exp', component: AppExpensesComponent},
        {path: 'expCRUD', component: AppExpenseCRUDComponent},
        {path: 'actreciv', component: AppAccountReceivableComponent},
        {path: 'actrecivCRUD', component: AppAccountReceiveCRUDComponent},
        {path: 'repo', component: AppReportsComponent},
        {path: 'rep-exp', component: AppReportExpensesComponent},
        {path: 'rep-assoc', component: AppReportAssociatesComponent},
        {path: 'rep-assoc-details', component: AppReportAssociateDetailsComponent},
        {path: 'adm-compen', component: AppAdminCompensationComponent},
        {path: 'adm-income', component: AppAdminIncomeAssignmentComponent},
        {path: 'adm-compCRUD', component: AppAdminCompensationCRUDComponent},
        {path: 'adm-as-role', component: AppRoleAllotmentComponent},
        {path: 'adm-as-role-crud', component: AppRoleAssociateCRUDComponent},
        {path: 'adm-role-res', component: AppRoleResourceAllotmentComponent},
        {path: 'adm-res-crud', component: AppRoleResourceCRUDComponent},
        {path: 'adm-expenses', component: AppAdminEmployeeExpensesComponent},
        {path: 'adm-exp-crud', component: AppAdminExpenseCRUDComponent},
        {path: 'assoc-pro', component: AppAssociateClientAssignmentComponent},
        {path: 'assoc-per', component: AppAssociatePersonalComponent},
        {path: 'assoc-stmt', component: AppAssociateStatementComponent},
        {path: 'assoc-stmt-details', component: AppAssociateStatementDetailsComponent},
        {path: '**', redirectTo: '/404'}
    ]}
];

@NgModule({
imports: [
    RouterModule.forRoot(
    appRoutes,
    { enableTracing: true, useHash: true, onSameUrlNavigation: 'reload'} // <-- debugging purposes only
    )
],
exports: [
    RouterModule
]
})
export class AppRoutingModule {
    private SEPERATOR = '/';
    constructor (private appRoutingService: AppRoutingService) {
        this._init(appRoutes, null);
    }

    private _init = (appRoutesData, basepPath) => {
        basepPath = basepPath ? basepPath + this.SEPERATOR : '';
        for (let i = 0; i < appRoutesData.length; i++) {
            const state = appRoutesData[i];
            if ( !utils.isEmpty(state) ) {
                const path = basepPath + state.path;
                if ( !utils.isEmpty(state.children)) {
                    this._init(state.children, path);
                } else {
                    this.appRoutingService.addRouterState(path, null);
                }
            }
        }
    }
 }
