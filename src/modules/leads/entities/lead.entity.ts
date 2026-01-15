import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'leads'
})
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    firstName: string

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 50,
        nullable: false
    })
    lastName: string

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    @Index()
    email: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    phone: string

    @Column({
        type: 'int',
        nullable: true
    })
    age: number;
    
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    city: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    country: string
    
    @Column({
        type: 'text',
        nullable: true
    })
    summary: string

    @Column({
        name: 'next_action',
        type: 'text',
        nullable: true
    })
    nextAction: string

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date

}
