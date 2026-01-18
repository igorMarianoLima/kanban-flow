import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from './guards/auth.guard';
import { HashService } from './hash.service';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.getJwtConfig();

        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: jwt.expiresIn,
            issuer: jwt.issuer,
            audience: jwt.audience,
          },
        };
      },
    }),
  ],
  providers: [AuthService, AuthGuard, HashService, SuperAdminGuard],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule, HashService, UserModule, SuperAdminGuard],
})
export class AuthModule {}
