import {BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";
import {Token} from "../token/token.model";
import {Mail} from "../mail/mail.model";

interface IUserDto {
    email: string
    password: string
}

@Table({tableName: "users"})
export class User extends Model<User, IUserDto>{
    @Column({primaryKey: true, unique: true, autoIncrement: true})
    id: number

    @Column({unique: true, allowNull: true, type: DataType.STRING})
    email: string

    @Column({allowNull: false, type: DataType.STRING})
    password: string

    @BelongsTo(() => Token)
    token: Token;

    @BelongsTo(() => Mail)
    mail: Mail;

}