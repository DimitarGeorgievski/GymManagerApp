import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';

@UseGuards(AuthGuard, RoleGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)
  @Post()
  create(@Body() createFoodDto: CreateFoodDto, @Req() req) {
    return this.foodService.create(createFoodDto, req.user.id);
  }
  @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)
  @Get()
  findAll() {
    return this.foodService.findAll();
  }

    @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }
    @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)
  @Get('/nutrition/today')
  getTodaysNutrition(@Req() req) {
    return this.foodService.getTodaysNutrition(req.user.id);
  }
    @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)
  @Get('/name/:name')
  findOneByName(@Param('name') name: string) {
    return this.foodService.findOneByName(name);
  }
  @Roles(roleType.ADMIN, roleType.TRAINER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }
  @Roles(roleType.USER,roleType.ADMIN, roleType.TRAINER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
