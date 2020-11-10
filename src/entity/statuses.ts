import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Geometry } from 'geojson';
import { StatusesEnum } from '../models/statusData';

@Entity('statuses')
@Index('pathIndex', ['fileName', 'directoryName'], { unique: true })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  @Index('taskIndex', { unique: true })
  public taskId: string;

  @Column()
  @Index('userIndex')
  public userId: string;

  @Column()
  public fileName: string;

  @Column()
  public directoryName: string;

  @Column()
  public fileURI: string;

  @Column()
  public progress: number;

  @Column({ type: 'enum', enum: StatusesEnum })
  public status: StatusesEnum;

  @Column('geometry', {
    spatialFeatureType: 'Geometry',
    srid: 4326,
  })
  @Index('geometryIndex', { spatial: true })
  public geometry: Geometry;

  @Column('double precision')
  public estimatedFileSize: number;

  @Column('double precision')
  public realFileSize: number;

  @Column('timestamp with time zone')
  public creationTime: Date;

  @Column('timestamp with time zone')
  public updatedTime: Date;

  @Column('timestamp with time zone')
  @Index('expirationTimeIndex')
  public expirationTime: Date;

  public constructor(init?: Partial<StatusEntity>) {
    Object.assign(this, init);
  }
}
