import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Incident } from "./Incident";
import { User } from "./User";

@Entity({ name: "notes" })
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(() => Incident, (incident) => incident)
  @JoinColumn({ name: "incidentId" })
  incident: Incident;
  @Column()
  incidentId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "authorId" })
  author: User;
  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
