import Post from "./post.model.js";
import User from "../users/user.model.js";
import Comment from "../comments/comment.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.uid;

    const post = await Post.create({
      title,
      content,
      author: authorId,
    });

    await User.findByIdAndUpdate(authorId, {
      $push: { posts: post._id }
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username name surname profilePicture')
      .populate('comments');

    return res.status(201).json({
      message: "Post creado exitosamente",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el post",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username name surname profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username name surname profilePicture'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    return res.status(200).json({
      message: "Posts obtenidos exitosamente",
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los posts",
      error: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'username name surname profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username name surname profilePicture'
        }
      });

    return res.status(200).json({
      message: "Post obtenido exitosamente",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el post",
      error: error.message,
    });
  }
};

