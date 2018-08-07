import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  downloadFile() {
    return this.http
      .get('http://localhost:4000/api/login_records_report_by_month', {
        responseType: 'blob' as 'json'
      })
      .map(res => {
        return {
          filename: 'Monthly Attendance Report.xlsx',
          data: res
        };
      })
      .subscribe(res => {
        console.log('start download:',res);
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });
  }

}
