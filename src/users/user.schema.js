import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required for the user."]
    },
    email: {
        type: String,
        required: [true, "email of the user is required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please provide valis email"]
    },
    password: {
        type: String,
        required: [true, "password of the user is required"],
        validate: {
          validator: function (value) {
            return /^[A-Z](?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{7,}$/.test(value);
          },
          message: `Password must start with a capital letter, 
                    be at least 8 characters long, 
                    and contain at least one special character and one digit.`
        }
      },
    gender: {
        type: String,
        required: [true, "gender should be given for the user"],
        enum: { values: ["Male", "Female", "Other"], message: '{VALUE} is supported' }
    },
    friendRequests : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'friendRequests'
        }
    ],
    friends : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'users'
        }
    ],
    totalFriends : {
        type : Number,
        default : 0
    }
});
export const userModel = mongoose.model('users', userSchema);