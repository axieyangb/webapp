export class User
{
    username:string=localStorage["username"];
    password:string;
    confirmpassword:string;
    phonenumber:number;
    email:string;
    grant_type:string="password";
    token:string=localStorage["token"];
}