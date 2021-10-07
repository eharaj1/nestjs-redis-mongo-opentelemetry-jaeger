import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Cats extends Document {

    @Prop()
    cat_name: string;

    @Prop()
    cat_type: string;

    @Prop()
    cat_color: string;

    @Prop({default: false})
    isDeleted: boolean
}

export const CatsSchema = SchemaFactory.createForClass(Cats);