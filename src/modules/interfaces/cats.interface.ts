import { Document } from 'mongoose';

export interface ICats extends Document {
    cat_name: string;
    cat_type: string;
    cat_color: string;
}