import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        productName:{type:String, required:true},
        productDesc:{type:String, required:true},

        productImg:[
            {
                url:{type:String, required:true},
                pubic_id:{type:String, required:true},
            }
        ],
        productPrice:{type:number},
        category:{type:String},
        brand:{type:String}

    },
    {timeStamps:true}
)

export const Product = mongoose.model("Product", productSchema)