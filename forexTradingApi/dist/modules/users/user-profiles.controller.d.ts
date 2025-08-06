import { UsersService } from './users.service';
export declare class UserProfilesController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllProfiles(): Promise<import("./entities/user-profile.entity").UserProfile[]>;
    getProfileById(id: number): Promise<import("./entities/user-profile.entity").UserProfile>;
    getUsersByProfile(profileId: number): Promise<import("./entities/user.entity").User[]>;
}
