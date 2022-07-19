import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPost } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: IPost[] = [];
  private postsUpdated = new Subject<IPost[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((res) => {
          return res.posts.map((post: any) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            };
          });
        })
      )
      .subscribe(
        (transformedPost: IPost[]) => {
          this.posts = transformedPost;
          console.log(transformedPost);
          this.postsUpdated.next([...this.posts]);
        },
        (err) => console.log(err)
      );
  }

  getUpdatedPostsListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): Observable<void> {
    const post = { id: '', title, content };
    return this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .pipe(
        map((res) => {
          post.id = res.postId;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
          console.log(res.postId);
        })
      );
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
    }>('http://localhost:3000/api/posts/' + id);
    // const post = this.posts.find(po => po.id === id)
    // if (post && post.id) {
    //     return post;
    // }
    // return {
    //     id: '',
    //     title: '',
    //     content: ''
    // }
  }

  updatePost(post: IPost): Observable<void> {
    return this.http
      .put('http://localhost:3000/api/posts/' + post.id, post)
      .pipe(
        map((res) => {
          console.log(res);
          const postId = this.posts.findIndex((p) => p.id === post.id);
          this.posts[postId] = post;
          this.postsUpdated.next([...this.posts]);
        })
      );
  }

  deletePost(potsId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + potsId)
      .subscribe((res) => {
        const updatedPost = this.posts.filter((post) => post.id !== potsId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
