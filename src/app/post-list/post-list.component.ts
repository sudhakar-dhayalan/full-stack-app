import { Component, OnInit } from "@angular/core";
import { IPost } from "./post.model";
import { PostService } from "./post.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
    posts: IPost[] = [];

    constructor(private postService: PostService) {}

    ngOnInit(): void {
        this.posts = this.postService.getPosts();
        this.postService.getUpdatedPostsListner().subscribe(
            (posts: IPost[]) => this.posts = posts
        )
    }
}