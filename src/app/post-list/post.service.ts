import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { IPost } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: IPost[] = [];
    private postsUpdated = new Subject<IPost[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
            .pipe(
                map(res => {
                    return res.posts.map((post: any) => {
                        return {
                            id: post._id,
                            title: post.title,
                            content: post.content
                        }
                    })
                })
            )
            .subscribe(
                (transformedPost: IPost[]) => {
                    this.posts = transformedPost;
                    console.log(transformedPost)
                    this.postsUpdated.next([...this.posts]);
                }, 
                err => console.log(err)
            );
    }

    getUpdatedPostsListner() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post = { id: '', title, content };
        this.http.post<{ message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe(res => {
                post.id = res.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts])
            });
    }

    deletePost(potsId: string) {
        this.http.delete('http://localhost:3000/api/posts/'+ potsId).subscribe(res => {
            const updatedPost = this.posts.filter(post => post.id !== potsId)
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
        });
    }
}
