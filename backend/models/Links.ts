import mongoose, {Schema, Document} from 'mongoose'

export interface eLink extends Document {
    source: string;
    target: string; 
}


const linkSchema = new Schema<eLink> ( {
    source: {
        type: String, 
        required: true
    },
    target: {
        type: String,
        required: true
    }
})

const Link = mongoose.model<eLink>('Link', linkSchema)

export default Link