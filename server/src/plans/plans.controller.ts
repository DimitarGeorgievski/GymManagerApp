import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Roles } from 'src/auth/role.decorator';
import { roleType } from 'src/users/enum/user.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Roles(roleType.ADMIN, roleType.TRAINER)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}
  
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }
  
  @Roles(roleType.USER)
  @Get()
  findAll() {
    return this.plansService.findAll();
  }
  
  @Roles(roleType.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }
  
  @Roles(roleType.USER)
  @Get('/title/:title')
  findOneByTitle(@Param('title') title: string) {
    return this.plansService.findOne(title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
