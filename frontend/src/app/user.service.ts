import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  forgotPassword(data: { email: any; }) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
