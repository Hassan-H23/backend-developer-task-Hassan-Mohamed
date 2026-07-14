import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
@Table({ tableName: 'members' })
export class Member extends Model<Member> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  gender: string;

  @Column({ type: DataType.STRING, allowNull: false })
  dateOfBirth: string;

/**
 * The date when the member subscribed to the club.
 */
 @Column({ type: DataType.STRING, allowNull: false })
  subscriptionDate: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  phone?: string;

  @Column({ type: DataType.UUID })
  
  @ForeignKey(() => Member)
  centralMemberId?: string;

  @BelongsTo(() => Member)
  centralMember?: Member;
  
}
