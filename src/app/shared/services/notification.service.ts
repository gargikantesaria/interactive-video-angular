import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  //  For notification
  showToast(msg, type) {
    type == "error" ? this.toastr.error(msg, 'Error') : this.toastr.success(msg, 'Success');
  }
}
