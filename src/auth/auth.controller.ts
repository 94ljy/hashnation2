import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import { AuthenticatedUser } from '../common/authenticated.user'
import { User } from '../common/user.decorator'
import { AuthService } from './auth.service'
import { UserSignUpDto } from './dto/user-signup.dto'
import { Public } from './guard/auth.guard'
import { LoginGuard } from './guard/login.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LoginGuard)
    @Post('/sign-in')
    async signin(@Req() req: any, @User() user: AuthenticatedUser) {
        try {
            await this.authService.updateUserLastLogin(user.id)
        } catch (e) {
            req.logout()
        }
        return {}
    }

    @Public()
    @Post('sign-up')
    async signup(@Body() userSignupDto: UserSignUpDto) {
        await this.authService.signUp(
            userSignupDto.username,
            userSignupDto.password,
            userSignupDto.email,
        )
        return {
            message: 'successfully signed up',
        }
    }

    @Post('/sign-out')
    async signout(@Req() req: any) {
        req.logout()
        return {}
    }

    @Get('/me')
    async me() {
        return {}
    }
}
