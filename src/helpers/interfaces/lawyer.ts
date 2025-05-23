import { Users } from "./user";
import {Location} from './location';
export interface Lawyer {
    _id: string;
    rating: number;
    bio: string;
    availability: [];
    years_of_experience: number;
    location:Location;
    isVerified : boolean;
    user: Users;
    specialization_id: {
        _id: string;
        name: string;
    }
  }