import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: [true, 'video is required']
    },
    tumbnail:{
        type: String,
        required: true
    }, 
    title:{
        type: String,
        required: true
    }, 
    description:{
        type: String,
        required: true
    },
    duration:{
        type: Number, // cloudnary gives info of video uploaded
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate) // ap apnay khud kay plugin bhi add karsaktay ho mongoose ma

export const Video = mongoose.model('Video', videoSchema);