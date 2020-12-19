import { IsBoolean, IsNotEmpty, IsString, IsUrl, ValidateIf } from "class-validator";

export class CreateWebHookDto {
    @IsUrl({ require_protocol: true }, { message: 'Invalid URL format' })
    @IsNotEmpty({ message: 'URL is mandatory' })
    url: string;
}

export class UpdateWebHookDto {

    @IsNotEmpty({ message: 'Webhook ID is mandatory' })
    @IsString({ message: 'Webhook ID should be a string' })
    id: string;

    @ValidateIf(o => !!o.url)
    @IsUrl({ require_protocol: true }, { message: 'Invalid URL format' })
    @IsNotEmpty({ message: 'URL is mandatory' })
    url: string;

    @ValidateIf(o => o.active)
    @IsBoolean({ message: 'Active should be a boolean value' })
    @IsNotEmpty({ message: 'Active is mandatory' })
    active: boolean;
}