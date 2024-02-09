import mongoose,{models,Schema} from "mongoose";
const mycategoriesSchema = new Schema({ 
    mycategoryId:{
        //type:mongoose.Schema.Types.ObjectId,
        type:mongoose.Types.ObjectId,
        ref: "Category"
    },
    //isChecked:Boolean,
    planamount:{
        default:1.00,
        type: mongoose.Schema.Types.Decimal128,
        //required:true
    },
    categorynotes:{ type:String }
})
const SpendingplanSchema = new Schema(
    {
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    planmonthyear:{
        type: Date,
        default: new Date(),
        required:true
    },
    mycategories:[mycategoriesSchema],
    //mycategory: {
    //    mycategoryId:{
    //    type:mongoose.SchemaTypes.ObjectId,
    //    ref: "Category"
    //    },
    //    //isChecked:Boolean,
    //    planamount:{
    //        //default:0.00,
    //        type: { type:mongoose.SchemaTypes.Decimal128 },
    //        required:true
    //    },
    //    categorynotes:{ type:String }
    //    },
    //mycategories:[
    //    { 
    //        mycategoryId:{
    //            type:mongoose.SchemaTypes.ObjectId,
    //            ref: "Category"
    //        },
    //        //isChecked:Boolean,
    //        planamount:{
    //            //default:0.00,
    //            type: { type:mongoose.SchemaTypes.Decimal128 },
    //            required:true
    //        },
    //        categorynotes:{ type:String }
    //        }
    //]
    },
    {timestamps: true}
);
const Spendingplan = mongoose.models.Spendingplan || mongoose.model("Spendingplan", SpendingplanSchema);
export default Spendingplan;