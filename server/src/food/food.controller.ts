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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';

@ApiTags('food')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Post()
  @ApiOperation({ summary: 'Create a new food entry' })
  @ApiResponse({ status: 201, description: 'Food created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiBody({ type: CreateFoodDto })
  create(@Body() createFoodDto: CreateFoodDto, @Req() req) {
    return this.foodService.create(createFoodDto, req.user.id);
  }
  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Get()
  @ApiOperation({ summary: 'Get all food entries for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of food entries' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  findAll() {
    return this.foodService.findAll();
  }

  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Get(':id')
  @ApiOperation({ summary: 'Get food entry by ID' })
  @ApiResponse({ status: 200, description: 'Food entry found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Food entry not found' })
  @ApiParam({ name: 'id', description: 'Food entry ID' })
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }
  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Get('/nutrition/today')
  @ApiOperation({ summary: 'Get today\'s nutrition summary for authenticated user' })
  @ApiResponse({ status: 200, description: 'Today\'s nutrition summary' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  getTodaysNutrition(@Req() req) {
    return this.foodService.getTodaysNutrition(req.user.id);
  }
  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Get('/name/:name')
  @ApiOperation({ summary: 'Get food entry by name' })
  @ApiResponse({ status: 200, description: 'Food entry found' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Food entry not found' })
  @ApiParam({ name: 'name', description: 'Food name' })
  findOneByName(@Param('name') name: string) {
    return this.foodService.findOneByName(name);
  }
  @Roles(roleType.ADMIN, roleType.TRAINER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update food entry' })
  @ApiResponse({ status: 200, description: 'Food entry updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TRAINER or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Food entry not found' })
  @ApiParam({ name: 'id', description: 'Food entry ID' })
  @ApiBody({ type: UpdateFoodDto })
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(id, updateFoodDto);
  }
  @Roles(roleType.USER, roleType.ADMIN, roleType.TRAINER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete food entry' })
  @ApiResponse({ status: 200, description: 'Food entry deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires USER, TRAINER, or ADMIN role' })
  @ApiResponse({ status: 404, description: 'Food entry not found' })
  @ApiParam({ name: 'id', description: 'Food entry ID' })
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
