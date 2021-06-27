import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import BaseModel from "./BaseModel";
import { User } from "./User";
import { Note } from "./Note";

type Type = "employee" | "environmental" | "property" | "vehicle" | "fire";

@Entity({ name: "incidents" })
export class Incident extends BaseModel {
  @Column({ type: "varchar", length: 60 })
  title: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: ["employee", "environmental", "property", "vehicle", "fire"],
    default: "employee",
  })
  type: Type;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "assigneeId" })
  assignee: User;
  @Column()
  assigneeId: string;

  @OneToMany(() => Note, (note) => note.incident)
  @JoinColumn()
  notes: Note[];

  @Column({ default: false })
  isResolved: boolean;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "closedById" })
  closedBy: User;
  @Column({ type: "text", nullable: true })
  closedById: string | null;

  @Column({ type: "timestamp", nullable: true })
  closedAt: Date | null;

  @Column({ default: false })
  isAcknowledged: boolean;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "acknowledgedById" })
  acknowledgedBy: User;
  @Column({ type: "text", nullable: true })
  acknowledgedById: string | null;

  @Column({ type: "timestamp", nullable: true })
  acknowledgedAt: Date | null;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "createdById" })
  createdBy: User;
  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: "updatedById" })
  updatedBy: User;
  @Column({ nullable: true })
  updatedById: string;
}
