export interface StatusData {
    taskId: string;
    userId?: string;
    fileName?: string;
    directoryName?: string;
    fileURI?: string;
    progress?: number;
    status?: string;
    bbox?: string;
    estimatedFileSize?: string;
    realFileSize?: string;
    creationTime?: string;
    lastUpdatedTime?: string;
    expirationTime?: string;
}