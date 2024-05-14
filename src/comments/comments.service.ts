import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository, TreeRepository, getConnection } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: TreeRepository<Comment>,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const newComment = await this.commentsRepository.create({
      ...createCommentDto,
    });
    return await this.commentsRepository.save(newComment);
  }

  async createReply(commentId: number, createCommentDto: CreateCommentDto) {
    const { content, user } = createCommentDto;
    //find parentComment
    const parentComment = await this.commentsRepository.findOne({
      where: { _id: commentId },
    });
    // create new replycomment
    const replyComment = await this.commentsRepository.create({
      content,
      user,
      parent_comment: parentComment,
    });
    return await this.commentsRepository.save(replyComment);
  }

  // async findAll(
  //   movieId: number,
  //   options: IPaginationOptions,
  // ): Promise<Pagination<Comment>> {
  //   const queryBuilder = this.commentsRepository
  //     .createQueryBuilder('comment')
  //     .leftJoinAndSelect('comment.user', 'user')
  //     .leftJoinAndSelect('comment.movie', 'movie')
  //     .leftJoinAndSelect('comment.replies', 'replies')
  //     .leftJoinAndSelect('replies.user', 'reply_user')
  //     // .leftJoinAndSelect('replies.replies', 'reply_replies')
  //     .where(`comment.movie_id = ${movieId}`)
  //     .orderBy('comment._id');
  //   return paginate<Comment>(queryBuilder, options);
  // }

  // async find(movieId: number): Promise<Comment[]> {
  //   return this.commentsRepository
  //     .createQueryBuilder('comment')
  //     .leftJoin('comment.movie', 'movie') // Join với bảng movie
  //     .where(`comment.movie_id = ${movieId}`) // Điều kiện tìm kiếm: movie.id = movieId
  //     .getMany();
  // }

  async update(_id: number, updateCommentDto: UpdateCommentDto) {
    // const { permissions} = updateSeatDto
    // const role = await this.commentsRepository.findOne({
    //   where: {_id},
    //   relations: {
    //     permissions: true
    //   }
    // })
    // const newPermission = await this.permissionService.findByIds(permissions)
    // const updateRole = await Object.assign(role, updateRoleDto)
    // updateRole.permissions = newPermission
    // return await this.commentsRepository.save(updateRole)
  }

  async findCommentByMovieId(movieId: number) {
    // const comment = 1
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.movie', 'movie')
      .where(`comment.movie_id = ${movieId}`) //This is the part we are missing in the typeorm library
      // .andWhere('entity.parent IS NULL')
      .getMany();

    await Promise.all(
      comments.map((root) => this.commentsRepository.findDescendantsTree(root, {
        relations: ['user']
      })),
    );
    return comments;
  }
}
