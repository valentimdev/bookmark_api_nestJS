import { ForbiddenException, Injectable } from "@nestjs/common";
import { User,Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService){}

    async signup(dto:AuthDto){
        //gerar o hash do password
        const hash = await argon.hash(dto.password);
        //salvar o novo usuario no banco de dados
        try{
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash,
            },
        });
        delete user.hash;
        return user
    }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P20002'){
                    throw new ForbiddenException('Credenciais ja estao em uso');
                }
            }
            throw error;
        }        
    }

    async signin(dto:AuthDto){
        //encontrar o usuario por email
        const user = await this.prisma.user.findUnique({
            where:{email:dto.email}
        },
        );
        //se nao encontrar, lancar excecao
        if(!user) throw new ForbiddenException('Credenciais incorretas');
        //se encontrar, verificar se o password esta correto
        const isPasswordValid = await argon.verify(user.hash, dto.password);
        //se o password estiver incorreto, lancar excecao
        if(!isPasswordValid) throw new ForbiddenException('Credenciais incorretas'); 

        //se o password estiver correto, retornar o usuario
        delete user.hash;
        return user;
    }

}