import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  form!: FormGroup;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
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
            this.form.setValue({
              title: post.title,
              content: post.content,
            });
          },
          (err) => console.log(err.message),
          () => (this.isLoading = false)
        );
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSubmitPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService
        .addPost(this.form.value.title, this.form.value.content)
        .subscribe(() => {
          this.router.navigateByUrl('');
        });
    } else {
      this.postService
        .updatePost({
          id: this.postId,
          title: this.form.value.title,
          content: this.form.value.content,
        })
        .subscribe(() => {
          this.router.navigateByUrl('');
        });
    }
    this.form.reset();
  }
}
