import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CashFlowModule } from '#features/cash-flow';
import { IncomesRoutingModule, IncomesViewComponent } from '#pages/incomes';
import { UiModule } from '#shared/ui';

const declarations = [IncomesViewComponent];
const imports = [CommonModule, IncomesRoutingModule, CashFlowModule, UiModule];

@NgModule({ declarations, imports })
export default class IncomesModule {}
