import {ProficiencyEnum} from "../../../common/enums/profeciency.enum";
import {IsBoolean, IsString} from "class-validator";

export class CreateUserlanguageDto {
    @IsString()
    name: string;


    level: ProficiencyEnum;

    @IsBoolean()
    isNative: boolean

}
