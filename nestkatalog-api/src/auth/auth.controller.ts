import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı oluşturuldu + JWT token' })
  @ApiResponse({ status: 409, description: 'Email zaten kayıtlı' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Giriş yap ve JWT token al' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş + access_token' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aktif kullanıcı bilgisi' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgisi (şifresiz)' })
  @ApiResponse({ status: 401, description: 'Token gerekli' })
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.sub);
  }
}
