import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import * as dto from "./dto";

@Controller('auth')
export class AuthControler{
    constructor(private authService: AuthService){}
    
    @Post('signup')
    signup(@Body() dto: dto.AuthDto){
        return this.authService.signup(dto);
    } 
    
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: dto.AuthDto){
        console.log('oi')
        return this.authService.signin(dto);
    }
}