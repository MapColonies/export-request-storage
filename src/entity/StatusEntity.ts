import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity("statuses")
@Index(['fileName', 'directoryName'], { unique: true })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  @Index({ unique: true })
  public taskId: string;

  @Column()
  @Index({ unique: true })
  public userId: string;

  @Column()
  public fileName: string;

  @Column()
  public directoryName: string;

  @Column()
  public fileURI: string;

  @Column()
  public progress: number;

  @Column()
  public status: string;

  @Column()
  public bbox: string;

  @Column()
  public estimatedFileSize: string;

  @Column()
  public realFileSize: string;

  @Column()
  public creationTime: string;

  @Column()
  public lastUpdatedTime: string;

  @Column()
  public expirationTime: string;

  public constructor(init?: Partial<StatusEntity>) {
    Object.assign(this, init);
  }
}
