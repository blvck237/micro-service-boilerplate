import { ObjectId } from 'mongodb';
import { PostRepository } from '../repositories/post.repository';
import { PostType } from '../types/post';

export class PostService {
  #postRepository: PostRepository;
  constructor(postRepository: PostRepository) {
    this.#postRepository = postRepository;
  }

  async createPost(postData: PostType): Promise<PostType> {
    try {
      const post = await this.#postRepository.create(postData);
      return post;
    } catch (error) {
      throw error;
    }
  }

  // async findPost(_id: string): Promise<PostType> {
  //   try {
  //     const post = await this.#postRepository.findPost(_id);
  //     return post;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async deletePost(_id: ObjectId, userId: string): Promise<boolean> {
    try {
      const deleted = await this.#postRepository.deleteOne({ _id, userId });
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  // async getPostList(query: any, sort: any): Promise<PostType[]> {
  //   try {
  //     const posts = await this.#postRepository.getPostList(query, sort);
  //     return posts;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
