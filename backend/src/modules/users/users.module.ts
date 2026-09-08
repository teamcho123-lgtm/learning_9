import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { User, UserSchema } from './entities/user.entity.js';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
