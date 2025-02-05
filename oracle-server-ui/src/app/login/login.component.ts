import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { environment } from '../../environments/environment'

import { AuthService } from '~service/auth.service'
import { AlertType } from '../component/alert/alert.component'

import { MessageService } from '~service/message.service'
import { MessageType } from '~type/oracle-server-types'
import { getMessageBody } from '~util/oracle-server-util'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public AlertType = AlertType
  
  debug = environment.debug // flag for debugging buttons

  form: FormGroup

  executing = false
  loginExecuting = false

  error: any

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      user: [environment.user, Validators.required],
      password: [environment.password, Validators.required],
    })
    // if (environment.autoLogin && this.authService.expiration === undefined) {
    //   console.debug('autoLogin')
    //   this.login()
    // }
  }

  private errorHandler(err: any) {
    console.error('login error', err)
    this.executing = false
    this.loginExecuting = false
    this.error = err.error
  }

  login() {
    const v = this.form.value
    if (v.user && v.password) {
      this.error = undefined
      this.executing = true
      this.loginExecuting = true
      this.authService.login(v.user, v.password).subscribe(_ => {
        this.executing = false
        this.loginExecuting = false
      }, this.errorHandler.bind(this))
    }
  }

  authTest() {
    console.debug('authTest()')
    this.authService.authTest().subscribe(result => {
      console.debug(' authTest()', result)
    })
  }

  refresh() {
    console.debug('refresh()')
    this.executing = true
    this.authService.refresh().subscribe(result => {
      console.debug(' refresh()', result)
      this.executing = false
    }, this.errorHandler.bind(this))
  }

  logout() {
    console.debug('logout()')
    this.executing = true
    this.authService.logout().subscribe(result => {
      console.debug(' logout()', result)
      this.executing = false
    }, this.errorHandler.bind(this))
  }

  getVersionThroughAPI() {
    console.debug('getVersionThroughAPI()')
    this.messageService.sendMessage(getMessageBody(MessageType.getversion)).subscribe(r => {
      console.debug(' getVersionThroughAPI()', r)
    })
  }

  getOracleNameThroughAPI() {
    console.debug('getOracleNameThroughAPI()')
    this.messageService.sendMessage(getMessageBody(MessageType.getoraclename)).subscribe(r => {
      console.debug(' getOracleNameThroughAPI()', r)
    })
  }

}
