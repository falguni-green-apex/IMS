import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from 'dotenv'
import { UserRolesEnum } from "src/users/entities/user.entity";
dotenv.config()

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException();
            }
            // Decode the JWT token to access its payload
            const decodedToken = this.jwtService.decode(token) as { [key: string]: any };
            // Check if the token is expired
            if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                throw new UnauthorizedException('Token expired');
            }

            // Apply check on roles
            if (decodedToken.role === UserRolesEnum.ADMIN) {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: process.env.JWT_SECRET
                    }
                )
                request['user'] = payload;
                return true;
            } else {
                throw new ForbiddenException('Forbidden resource');
            }
        } catch (err) {
            throw err;
        }
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}