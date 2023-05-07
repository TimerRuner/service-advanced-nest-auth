import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";

interface IMailDto {
    refreshToken: string
    activationLink: string
    userId: number
}

@Table({tableName: "mails"})
export class Mail extends Model<Mail, IMailDto> {
    @Column({primaryKey: true, autoIncrement: true, unique: true})
    id: number

    @Column({unique: true, allowNull: false, type: DataType.STRING})
    activationLink: string

    @Column({defaultValue: false, allowNull: false, type: DataType.BOOLEAN})
    isActivate: boolean

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}