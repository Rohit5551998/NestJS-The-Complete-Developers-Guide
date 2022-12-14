import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  NotFoundException,
  Session,
  UseGuards,
  // UseInterceptors,
  // ClassSerializerInterceptor, 
} from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService, 
    private authService: AuthService,
  ) {}

  // Session Test Routes
  // @Get('/colors/:color')
  // setColor(@Param('color') color:string, @Session() session:any) {
  //   session.color = color;
  // }

  // // @Get('/colors')
  // getColor(@Session() session:any) {
  //   console.log(session.color);
  //   return session.color;
  // }
  
  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  // Without custom decorator
  // @Get('whoami')
  // whoAmI(@Request() request:Request) {
  //   return request.currentUser;
  // }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    // Not required since guard is used
    // if (!user) {
    //   throw new NotFoundException('No User Signed In');
    // }
    return user;
  }

  @Get('/signout')
  signOut(@Session() session: any) {
    if (!session.userId) {
      throw new NotFoundException('No User Signed In');
    }
    session.userId = null;
    return "User signed out successfully";
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // console.log(body);
    // this.usersService.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // console.log('Handler is Running!!!');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id:string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
