import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './appRoutingModule';
import { AppLoginComponent } from './common/login/app.login.comp';
import { AppLayoutComponent} from './common/layout/app.layout.comp';
import {AppInvoiceComponent} from './invoices/app.invoice.comp';
import { AppInvoiceCRUDComponent } from './invoices/app.invoiceCRUD.comp';
import { AppService } from './services/app.service';
import { AppUserAuthService } from './services/app.userAuth.service';
import {AppInlineAlertComponent} from './uicomponents/app.inlineAlert';
import { AppSpinnerComponent } from './uicomponents/app.spinner.comp';
import { AppLoaderService } from './services/app.loader.service';
import { AppHTTPInterceptorService } from './services/app.httpInterceptor.service';
import {AppNotFoundComponent} from './app.notFound.comp';
import { AppDateDirective } from './uicomponents/app-date-comp';
import { AppRestrictInputNumberDirective } from './uicomponents/app-restrict-input.dir';
import { AppRoutingService } from './services/app.routing.service';
import { AppAssociativesComponent } from './associative/app.assoc.comp';
import { AppAssociativeCRUDComponent } from './associative/app.assocCRUD.comp';
import { AppAssignmentComponent } from './assignments/app.assign.comp';
import { AppAssignmentCRUDComponent } from './assignments/app.assign.CRUD.comp';
import { AppClientsComponent } from './clients/app.client.comp';
import { AppClientCRUDComponent } from './clients/app.client.crud.comp';
import { AppFaxDirective } from './uicomponents/app-fax';
import { AppClientContactComponent } from './clients/app.contact.comp';
import { AppGridComponent } from './uicomponents/e3Grid/app.e3.grid.comp';
import { AppE3GridService } from './uicomponents/e3Grid/app.e3Grid.Service';
import { AppE3GridLoader } from './uicomponents/e3Grid/app.e3GridLoader.serv';
import { AppExpensesComponent } from './expenses/app.expenses.comp';
import { AppGridService } from './services/app.grid.service';
import { AppAccountReceivableComponent } from './accountrecive/app.acctreceive.comp';
import { AppAccountReceiveCRUDComponent } from './accountrecive/app.acctreceiveCRUD.comp';
import {AutofocusDirective} from './uicomponents/app-auto-focus.dir';
import {AppExpenseCRUDComponent} from './expenses/app.expensCRUD.comp';
import {AppReportsComponent} from './reports/app.reports.comp';
import { AppReportExpensesComponent } from './reports/expenses/app.rep-exp.comp';
import { AppReportAssociatesComponent } from './reports/assoc/app.repo-assoc.comp';
import { AppValidateDirective } from './uicomponents/app.validate.dir';
import { AppReportAssociateDetailsComponent } from './reports/assoc/app.repo.assoc.details.comp';
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

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AppInvoiceComponent,
    AppLoginComponent,
    AppInlineAlertComponent,
    AppSpinnerComponent,
    AppNotFoundComponent,
    AppInvoiceCRUDComponent,
    AppDateDirective,
    AppRestrictInputNumberDirective,
    AppAssociativesComponent,
    AppAssociativeCRUDComponent,
    AppAssignmentComponent,
    AppAssignmentCRUDComponent,
    AppClientsComponent,
    AppClientCRUDComponent,
    AppFaxDirective,
    AppClientContactComponent,
    AppGridComponent,
    AppExpensesComponent,
    AppAccountReceivableComponent,
    AppAccountReceiveCRUDComponent,
    AutofocusDirective,
    AppExpenseCRUDComponent,
    AppReportsComponent,
    AppReportExpensesComponent,
    AppReportAssociatesComponent,
    AppValidateDirective,
    AppReportAssociateDetailsComponent,
    AppAdminCompensationComponent,
    AppAdminIncomeAssignmentComponent,
    AppAdminCompensationCRUDComponent,
    AppRoleAllotmentComponent,
    AppRoleAssociateCRUDComponent,
    AppRoleResourceAllotmentComponent,
    AppRoleResourceCRUDComponent,
    AppAdminEmployeeExpensesComponent,
    AppAdminExpenseCRUDComponent,
    AppAssociateClientAssignmentComponent,
    AppAssociatePersonalComponent,
    AppAssociateStatementComponent,
    AppAssociateStatementDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {  provide: HTTP_INTERCEPTORS,
    useClass: AppHTTPInterceptorService,
    multi: true
 }, AppService, AppUserAuthService, AppLoaderService, AppRoutingService, AppE3GridService, AppGridService, AppE3GridLoader],
  bootstrap: [AppComponent]
})
export class AppModule { }
