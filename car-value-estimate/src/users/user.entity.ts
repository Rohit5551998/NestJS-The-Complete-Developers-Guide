import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Report } from "../reports/report.entity";
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with ID ${this.id}`)
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User with ID ${this.id}`)
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with ID ${this.id}`)
  }
}