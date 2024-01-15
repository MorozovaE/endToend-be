import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig } from 'src/config/configurations';

export interface IJwtPayload {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(userData: IJwtPayload) {
    const payload = { user: userData };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<IJwtConfig>('jwt').secret_jwt,
      expiresIn: this.configService.get<IJwtConfig>('jwt').expire_jwt,
    });
  }

  async decode(token: string): Promise<IJwtPayload> {
    return await this.jwtService.verify(token, {
      secret: this.configService.get<IJwtConfig>('jwt').secret_jwt,
    });
  }
}
