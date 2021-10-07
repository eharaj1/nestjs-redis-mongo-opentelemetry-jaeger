import {IsNotEmpty, IsNumberString} from "class-validator";

export class CatCreateValidator{
    @IsNotEmpty()
    cat_name: string;

    @IsNotEmpty()
    cat_type: string;

    @IsNotEmpty()
    cat_color: string;
}