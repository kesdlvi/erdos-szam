import mongoose, {Schema, Document} from 'mongoose'

export interface eNode extends Document {
    name: string;
    x: number;
    y: number;
    occupation: string;
    description: string;
    ErdosNumber: number;
    CoAuthor: string; 
}




const nodeSchema = new Schema<eNode>({
    name: {
        type: String,
        required:true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ErdosNumber: {
        type: Number,
        required: true
    },
    CoAuthor: {
        type: String,
        required: false
    }
})





const Node =  mongoose.model<eNode>('Node', nodeSchema)


export default Node; 