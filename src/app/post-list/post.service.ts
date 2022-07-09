import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IPost } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: IPost[] = [];
    private postsUpdated = new Subject<IPost[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get<{message: string, posts: IPost[]}>('http://localhost:3000/api/posts').subscribe(res => {
            this.posts = res.posts;
            console.log(res.posts)
            this.postsUpdated.next([...this.posts]);
        }, err => console.log(err))
        // return [...this.posts];
    }

    getUpdatedPostsListner() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post = { id: 'qw', title, content };
        this.http.post('http://localhost:3000/api/posts', post).subscribe(res => {
            console.log(res);        
            this.posts.push(post);
            this.postsUpdated.next([...this.posts])
        })
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts])
    }
}
