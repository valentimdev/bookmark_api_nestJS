import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

    signin(){return {msg:'teste'}}

    signup(){return "correto"}
}