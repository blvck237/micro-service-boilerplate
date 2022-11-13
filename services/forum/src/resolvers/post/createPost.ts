import { PostService } from '../../services/post.service';
import { PostRepository } from '../../repositories/post.repository';
import DataBaseHandler from '../../loaders/database';
import { CollectionsEnum } from '../../types/db';
import { InternalServerException } from '../../core/error/exceptions';

export const createPost = async (parent: any, args: any, context: any, info: any) => {
  try {
    const { user } = context;
    const { title, content } = args;
    const db = DataBaseHandler.getDb();
    const postRepository = new PostRepository(db, CollectionsEnum.POSTS);
    const postService = new PostService(postRepository);
    const post = await postService.createPost({
      title,
      content,
      createdById: user._id,
    });
    return post;
  } catch (error) {
    throw new InternalServerException(error);
  }
};
