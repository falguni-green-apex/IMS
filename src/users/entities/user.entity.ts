import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum UserRolesEnum {
    ADMIN = 'admin',
    USER = 'user'
}

@Schema()
export class User {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({required: true, type: String, enum: UserRolesEnum, default: UserRolesEnum.USER})
    role: UserRolesEnum;

    @Prop({default: false})
    is_deleted: boolean;

    @Prop()
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
