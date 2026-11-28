
export interface CreatePostDto {
  content: string;
  allowsComments?: boolean;
}

export interface UpdatePostDto {
  content?: string;
  allowsComments?: boolean;
}

export interface PostQueryDto {
  page?: number;
  limit?: number;
}
