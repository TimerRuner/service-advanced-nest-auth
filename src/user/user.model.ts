import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import {Token} from "../token/token.model";
import {Mail} from "../mail/mail.model";

@Table({tableName: "users"})
export class User extends Model<User>{
    @Column({primaryKey: true, unique: true, autoIncrement: true})
    id: number

    @Column({unique: true, allowNull: true, type: DataType.STRING})
    email: string

    @Column({allowNull: false, type: DataType.STRING})
    password: string

    @ForeignKey(() => Token)
    @Column
    tokenId: number;

    @ForeignKey(() => Mail)
    @Column
    mailId: number;

    @BelongsTo(() => Token)
    token: Token;

    @BelongsTo(() => Mail)
    mail: Mail;

}