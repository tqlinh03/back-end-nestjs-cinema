import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [
    PermissionsModule,
    TypeOrmModule.forFeature([Role])
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
