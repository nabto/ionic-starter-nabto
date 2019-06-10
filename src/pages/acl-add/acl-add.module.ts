import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AclAddPage } from './acl-add';

@NgModule({
  declarations: [AclAddPage],
  imports: [IonicPageModule.forChild(AclAddPage)],
})
export class AclAddPageModule { }
