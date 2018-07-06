/*This is important becoz it restricts the client side user to aceess limited valid data from server. Becoz angualr shows users data only that is defined here with types ...else gives error not defined

In this application Interfaces are used for defining the models/classes==>

Ex. Supoose in login.component.ts we want to show valid data of current user then we can write: 
 let current_user: User; 

 then it shows only the data that is defined here not mote event if getting a lot from server
 */

export class User {
    email: string;
    name: string;
    password: string;
    roleid: string;
    is_active: boolean;
    
}