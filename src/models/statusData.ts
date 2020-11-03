import { Geometry } from "geojson";

export interface StatusData {
    taskId: string;
    userId?: string;
    fileName?: string;
    directoryName?: string;
    fileURI?: string;
    progress?: number;
    status?: string;
    geometry?: Geometry;
    estimatedFileSize?: number;
    realFileSize?: number;
    creationTime?: Date;
    updatedTime?: Date;
    expirationTime?: Date;
}
