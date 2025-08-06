import { User } from '../../users/entities/user.entity';
import { Segment } from '../../catalogs/entities/segment.entity';
export declare class Client {
    id: number;
    clientIdentifier: string;
    name: string;
    segmentId: number;
    status: string;
    createdBy: number;
    createdAt: Date;
    modifiedBy: number | null;
    modifiedAt: Date | null;
    segment: Segment;
    creator: User;
    modifier: User;
}
