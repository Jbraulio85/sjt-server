import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [25, 'El nombre no puede tener más de 25 caracteres'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        maxLength: [25, 'El apellido no puede tener más de 25 caracteres'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'El username es obligatorio'],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minLength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    profilePicture:{
        type: String,
        default: ''
    },
    phone: {
        type: String,
        minLength: [8, 'El teléfono debe tener al menos 8 caracteres'],
        maxLength: [8, 'El teléfono no debe de tener más de 8 caracteres'],
        trim: true
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
    timestamps: true,
    versionKey: false
})

userSchema.methods.toJSON = function() {
    const { password, _id, ...user} = this.toObject();
    return { uid: _id, ...user}
}

export default model('User', userSchema)