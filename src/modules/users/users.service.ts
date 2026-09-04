import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity.js';
import { isValidObjectId, Model } from 'mongoose';
import { hashPasswordHelper } from '../../helper/util.js';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email })
    if (user) {
      return true
    } else {
      return false
    }
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return user;
  }


  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto

    const isEmailExist = await this.isEmailExist(email)
    if (isEmailExist) {
      throw new Error('Email da ton tai')
    }

    const hashedPassword = await hashPasswordHelper(createUserDto.password)

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      image
    })

    return newUser;
  }

  async findAll(query: any, current: number, pageSize: number) {
    const skip = (current - 1) * pageSize;
    return this.userModel
      .find()
      .select('-password')
      .sort({ _id: 1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
  }

  //Tái sử dụng hàm findOne để tìm kiếm user theo email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(updateUserDto: UpdateUserDto) {
    const updatedData = { ...updateUserDto }

    if (updateUserDto.email) {
      const emailExists = await this.userModel.exists({
        email: updateUserDto.email,
        _id: { $ne: updatedData._id, },
      });

      if (emailExists) {
        throw new BadRequestException(`Email đã tồn tại: ${updateUserDto.email}`,);
      }
    }

    if (updateUserDto.password) {
      const hashedPassword = await hashPasswordHelper(updateUserDto.password)
      updatedData.password = hashedPassword
    }

    const updatedeUser = await this.userModel.findByIdAndUpdate(
      updatedData._id,
      {
        $set: updatedData,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select('-password')
      .exec();

    if (!updatedeUser) {
      throw new NotFoundException(`Không tìm thấy user có id: ${updatedData._id}`,);
    }

    return updatedeUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user có id: ${id}`,);
    }

    return `This action removes a #${id} user`;
  }
}
