import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUrl, Max, Min, ValidateIf } from "class-validator";

export class CreateServiceDto {
    @IsString({ message: 'Service Name should be string' })
    @IsNotEmpty({ message: 'Service Name is mandatory' })
    serviceName: string;

    @IsUrl({ require_protocol: true })
    @IsNotEmpty({ message: 'URL is mandatory' })
    url: string;

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsNotEmpty({ message: 'Interval is mandatory' })
    @Min(5, { message: 'PING Interval cannot be less than 5sec' })
    @Max(500, { message: 'PING Interval cannot be greater than 500sec' })
    interval: number;
}

export class UpdateServiceDto {
    @IsString({ message: 'Service ID is should be a string' })
    @IsNotEmpty({ message: 'Service ID is mandatory' })
    serviceId: string;

    @ValidateIf(o => !!o.serviceName)
    @IsString({ message: 'Service Name should be string' })
    @IsNotEmpty({ message: 'Service Name is mandatory' })
    serviceName: string;

    @ValidateIf(o => !!o.url)
    @IsUrl({ require_protocol: true })
    @IsNotEmpty({ message: 'URL is mandatory' })
    url: string;


    @ValidateIf(o => !!o.interval)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsNotEmpty({ message: 'Interval is mandatory' })
    @Min(5, { message: 'PING Interval cannot be less than 5sec' })
    @Max(500, { message: 'PING Interval cannot be greater than 500sec' })
    interval: number;

    @ValidateIf(o => o.active)
    @IsBoolean({ message: 'Active should be a boolean value' })
    @IsNotEmpty({ message: 'Active is mandatory' })
    active: boolean;
}