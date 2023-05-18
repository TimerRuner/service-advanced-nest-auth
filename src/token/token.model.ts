import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";

interface ITokenDto {
    refreshToken: string
    userId: number
}

@Table({tableName: "tokens"})
export class Token extends Model<Token> {
    @Column({primaryKey: true, autoIncrement: true, unique: true})
    id: number

    @Column({unique: true, allowNull: false, type: DataType.STRING(5000)})
    refreshToken: string

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}