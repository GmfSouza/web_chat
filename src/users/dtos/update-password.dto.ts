import { IsNotEmpty, IsString, Matches } from "class-validator";
import { IsStrongPasswordCustom } from "src/common/decorators/strong-password.decorator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPass: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPasswordCustom()
    newPass: string;

    @IsNotEmpty()
    @IsString()
    confirmPass: string;
}