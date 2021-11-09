import { NotificationService } from './../../../../service/notification/notification.service';
import { Date } from 'src/app/model/date';
import { EmployeePageService } from './../../../../service/main-page/employee-page/employee-page.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Employee } from 'src/app/model/employee';
// lottie
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-show-employee',
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.scss']
})
export class ShowEmployeeComponent implements OnInit {

  options: AnimationOptions = {
    path: '/assets/json/lottie/loading.json',
  };

  constructor(
    public employeePageService: EmployeePageService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.employeePageService.isLoadData = false;
    this.employeePageService.isOutOfData = false;
    this.employeePageService.employees = [];
    this.employeePageService.loadData(0);
  }

  public changeSearch(value: string) {
    this.employeePageService.loadData(1);
  }

  public onChangeSelect(event: any) {
    this.employeePageService.loadData(0);
  }

  public changeSort(sort: string) {
    this.employeePageService.changeSort(sort);
    this.employeePageService.loadData(0);
  }

  public hiddenNotification(): void {
    this.employeePageService.isShowNotification = false;
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  @HostListener('scroll', ['$event']) // for scroll events of the current element
  onScroll(event: Event) {
    var scrollTop = document.getElementById("content-list-e")!.scrollTop;
    var offsetHeight = document.getElementById("content-list-e")!.offsetHeight;
    var scrollHeight = document.getElementById("content-list-e")!.scrollHeight;
    if (!this.employeePageService.isLoadData && !this.employeePageService.isOutOfData) {
      if (scrollTop + offsetHeight > scrollHeight) {
        this.employeePageService.getListEmployee(
          Math.ceil(this.employeePageService.employees.length / 5),
          5,
          this.employeePageService.inputSearch,
          this.employeePageService.getStringMainAttribute(),
          this.employeePageService.getSortString() == "ASC" ? "asc" : "desc",
          0
        )
      }
    }
  }

  public getEmail(email: string) {
    let result = "";
    let length = email.length;
    if (length > 10) {
      for (let i = 0; i < length / 10; i++) {
        result += email.substring(i * 10, i * 10 + 10);
        if (i < length / 10 - 1) {
          result += "<br>"
        }
      }
      if (length % 10 != 0) {
        result += "<br>"
        result += email.substring(result.length, result.length + length % 10)
      }
    } else {
      result = email;
    }
    return result;
  }

  public requestRemoveItem(id: number): void {
    this.employeePageService.idEmployeeNeedRemove = id;
    this.notificationService.titlePopUpYesNoEmployee = "Delete employee";
    this.notificationService.childPopUpYesNoEmployee = `Are you sure you want to delete employee
    #${this.employeePageService.idEmployeeNeedRemove}`
    this.employeePageService.isShowPopupRequest = true;
    this.employeePageService.isProcessRemove = true;
  }

  public hiddenPopup(): void {
    this.employeePageService.isShowPopupRequest = false;
    this.employeePageService.isProcessRemove = false;
  }

  public removeItem(): void {
    this.employeePageService.deleteEmployeeById(this.employeePageService.idEmployeeNeedRemove).subscribe(data => {
      console.log(data);
      this.employeePageService.loadData(0);
      this.employeePageService.isShowPopupRequest = false;
      this.employeePageService.isProcessRemove = false;
      this.employeePageService.isShowNotification = true;
      this.notificationService.titlePopUpNotificationEmployee = "Success";
      this.notificationService.childPopUpNotificationEmployee = `You have successfully deleted the employee #${this.employeePageService.idEmployeeNeedRemove}`;
    });
  }

  public editItem(item: Employee) {
    this.employeePageService.showEditEmployee();
    this.employeePageService.editFirstName = item.firstName!;
    this.employeePageService.editLastName = item.lastName!;
    this.employeePageService.editGender = item.gender!;
    this.employeePageService.editAddress = item.address!;
    this.employeePageService.editEmail = item.email!;
    this.employeePageService.editId = item.id!;
    this.employeePageService.editDepartmentId = item.department?.id!;
    this.employeePageService.editCity = item.city!;
    let month = item.doB?.month! < 10 ? "0" + item.doB?.month : item.doB?.month;
    let day = item.doB?.day! < 10 ? "0" + item.doB?.day : item.doB?.day;
    let date = `${item.doB?.year}-${month}-${day}T00:00`;
    this.employeePageService.editDoB = date;
  }

}
