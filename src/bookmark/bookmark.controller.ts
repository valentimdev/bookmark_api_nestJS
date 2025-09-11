import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService:BookmarkService){}
    @Get()
    getBookmarks
    (@GetUser('id') userId:number){}
    
    @Get(':id')
    getBookmarkById(
    @GetUser('id') userId:number,
    @Param('id',ParseIntPipe) bookmarkId:number){}
    
    @Post()
    createBookmark
    (@GetUser('id') userId:number,
    @Body() dto:CreateBookmarkDto){}
    
    @Patch()
    editBookMarkById(
    @GetUser('id') userId:number,
    @Body() dto: EditBookmarkDto){}

    @Delete()
    deleteBookmarkById(
    @GetUser('id') userId:number,
    @Param('id',ParseIntPipe) bookmarkId:number){}
}
