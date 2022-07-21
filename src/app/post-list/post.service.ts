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
              imagePath: post.imagePath,
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

  addPost(title: string, content: string, image: File): Observable<void> {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title.slice(0, 15));
    return this.http
      .post<{
        message: string;
        post: IPost;
      }>('http://localhost:3000/api/posts', postData)
      .pipe(
        map((res) => {
          const post = {
            id: res.post.id,
            content: content,
            title: title,
            imagePath: res.post?.imagePath,
          };
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
          console.log(res.post.id);
        })
      );
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
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
