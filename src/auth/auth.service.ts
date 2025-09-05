import { Injectable } from "@nestjs/common";
import { User,Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService){}

    async signup(dto:AuthDto){
        //gerar o hash do password
        const hash = await argon.hash(dto.password);
        //salvar o novo usuario no banco de dados
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash,
            }
        });
        return user
    }

    signin(dto:AuthDto){
        return {msg:'teste'}
    }

}