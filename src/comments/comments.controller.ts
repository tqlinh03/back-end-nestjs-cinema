import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Comment } from './entities/comment.entity';
import { Public } from 'src/decoretor/customize';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Post(":commentId")
  createReply(
    @Param('commentId') commentId: number,
    @Body()  createCommentDto: CreateCommentDto) {
    return this.commentsService.createReply(+commentId, createCommentDto);
  }

  // @Get(':movieId')
  // async findAll(
  //   @Param('movieId') movieId: string,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // ): Promise<Pagination<Comment>> {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.commentsService.findAll(+movieId,{ 
  //     page,
  //     limit,
  //     route: 'http://localhost:8000/api/v1/comments',
  //   });
  // }

  @Public()
  @Get(':movieId')
  findById(@Param('movieId') movieId: string) {
    return this.commentsService.findCommentByMovieId(+movieId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentsService.findCommentByMovieId(+id);
  // }
}
