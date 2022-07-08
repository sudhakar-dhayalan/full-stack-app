import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IPost } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: IPost[] = [];
    private postsUpdated = new Subject<IPost[]>();

    getPosts() {
        return [...this.posts];
    }

    getUpdatedPostsListner() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post = { title, content };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
    }
}
