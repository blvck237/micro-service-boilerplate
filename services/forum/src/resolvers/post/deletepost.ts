import { PostService } from '../../services/post.service';
import { PostRepository } from '../../repositories/post.repository';
import DataBaseHandler from '../../loaders/database';
import { CollectionsEnum } from '../../types/db';

export const deletePost = async (parent: any, args: any, context: any, info: any) => {
  try {
    const { _id } = args;
    const db = DataBaseHandler.getDb();
    const postRepository = new PostRepository(db, CollectionsEnum.POSTS);
    const postService = new PostService(postRepository);
    const result = await postService.deletePost(_id, 'testId');
    return result;
  } catch (error) {
    console.error(error);
  }
};
