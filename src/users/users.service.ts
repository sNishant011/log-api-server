import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPasswordHash } from 'src/utils/auth.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { passwordHash } = await getPasswordHash(createUserDto.password, 6);
    createUserDto.password = passwordHash;
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();
    return this.findOne(savedUser._id);
  }

  findAll() {
    return this.userModel.find().select(['-password', '-refreshToken']).exec();
  }

  findOne(id: string) {
    return this.userModel
      .findById(id)
      .select(['-password', '-refreshToken'])
      .exec();
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const { passwordHash } = await getPasswordHash(updateUserDto.password, 6);
      updateUserDto.password = passwordHash;
    }
    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        },
      )
      .select(['-password', '-refreshToken']);
  }

  remove(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  getUserInfo(id: string) {
    return this.userModel.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    if (!refreshToken) {
      return this.userModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: { refreshToken: null },
        },
        {
          new: true,
        },
      );
    }
    const { passwordHash: hashedRefreshToken } = await getPasswordHash(
      refreshToken,
      6,
    );
    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: { refreshToken: hashedRefreshToken },
      },
      {
        new: true,
      },
    );
  }
}
