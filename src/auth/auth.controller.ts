import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decoretor/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @Post('/login')
  async login(
    @Req() req, 
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  @ResponseMessage("Logout User")
  @Post("/logout")
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser
    ){
    
    return this.authService.logout(response, user);
  }

  @Public() 
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshtoken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshtoken,response);
  }

  @ResponseMessage("Get a account")
  @Get("/account")
  handleFetchAccount(@User() user: IUser){
    console.log("account: ", user)
    return this.userService.findOne(user._id)
  }

}
