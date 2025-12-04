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
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @Roles(roleType.USER)
  @Get()
  findAll() {
    return this.foodService.findAll();
  }

  @Roles(roleType.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }
  @Roles(roleType.USER)
  @Get('/foodSummary/:id')
  getTodaysNutrition(@Req() req) {
    return this.foodService.getTodaysNutrition(req.user.id);
  }
  @Roles(roleType.USER)
  @Get('/name/:name')
  findOneByName(@Param('name') name: string) {
    return this.foodService.findOneByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
