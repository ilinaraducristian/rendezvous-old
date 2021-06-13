import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("servers")
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  user_id: string; // owner

}
