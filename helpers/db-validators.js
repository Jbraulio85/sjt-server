import User from '../src/users/user.model.js'
import Post from '../src/posts/post.model.js'
import Comment from '../src/comments/comment.model.js'

export const existeEmail = async (email = '') => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`El email ${email} ya fue registrado`)
    }
}

export const existePost = async (id = '') => {
    const existe = await Post.findById(id)
    if(!existe){
        throw new Error(`El post con ID ${id} no existe`)
    }
}

export const existeComment = async (id = '') => {
    const existe = await Comment.findById(id)
    if(!existe){
        throw new Error(`El comentario con ID ${id} no existe`)
    }
}

export const isPostOwner = async (id = '', { req }) => {
    const post = await Post.findById(id)
    if(post.author.toString() !== req.uid){
        throw new Error(`No tienes permisos para modificar este post`)
    }
}

export const isCommentOwner = async (id = '', { req }) => {
    const comment = await Comment.findById(id)
    if(comment.author.toString() !== req.uid){
        throw new Error(`No tienes permisos para modificar este comentario`)
    }
}