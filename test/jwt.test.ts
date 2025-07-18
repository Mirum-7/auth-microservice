import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from '../src/modules/jwt/jwt.service';

describe('JWT Token Service', () => {
  let service: JwtTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: {
            issuer: 'auth-microservice-test',
            audience: 'mirum7-app-test',
          },
        }),
      ],
      providers: [JwtTokenService],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate access and refresh tokens', async () => {
    const userId = 'test-user-id';
    const role = 'user';

    const tokens = await service.generateTokens(userId, role);

    expect(tokens).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should verify valid tokens', async () => {
    const userId = 'test-user-id';
    const role = 'user';

    const tokens = await service.generateTokens(userId, role);
    
    // Verify access token
    const accessPayload = await service.verifyToken(tokens.accessToken);
    expect(accessPayload.userId).toBe(userId);
    expect(accessPayload.role).toBe(role);
    expect(accessPayload.type).toBe('access');

    // Verify refresh token
    const refreshPayload = await service.verifyToken(tokens.refreshToken);
    expect(refreshPayload.userId).toBe(userId);
    expect(refreshPayload.type).toBe('refresh');
  });

  it('should throw error for invalid tokens', async () => {
    const invalidToken = 'invalid.token.here';

    await expect(service.verifyToken(invalidToken)).rejects.toThrow();
  });
});