import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  user_id: string; // owner

}
