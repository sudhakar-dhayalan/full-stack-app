import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IPost } from '../post-list/post.model';
import { PostService } from '../post-list/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: any;
  post: IPost = {
    id: 'a',
    title: '',
    content: '',
  };
  isLoading = false;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.postId = params.get('postId');
        this.postService.getPost(this.postId).subscribe(
          (post) => {
            this.post = {
              id: post._id,
              title: post.title,
              content: post.content,
            };
            this.isLoading = false;
          },
          (err) => console.log(err.message)
        );
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSubmitPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService
        .addPost(form.value.title, form.value.content)
        .subscribe(() => {
          this.router.navigateByUrl('');
        });
    } else {
      this.postService
        .updatePost({
          id: this.postId,
          title: form.value.title,
          content: form.value.content,
        })
        .subscribe(() => {
          this.router.navigateByUrl('');
        });
    }
    form.resetForm();
  }
}
