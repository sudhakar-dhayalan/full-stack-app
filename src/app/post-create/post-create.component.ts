import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostService } from '../post-list/post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: any;
  isLoading = false;
  form!: FormGroup;
  imagePreview = '';

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
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.postId = params.get('postId');
        this.postService.getPost(this.postId).subscribe(
          (post) => {
            this.form.setValue({
              title: post.title,
              content: post.content,
              image: post.imagePath,
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
        .addPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        )
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    } else {
      this.postService
        .updatePost({
          id: this.postId,
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: this.form.value.imagePath,
        })
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
    this.form.reset();
  }

  onImageUpload(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    let file!: File;
    if (files && files.length && files[0]) {
      file = files[0];
    }
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    console.log(file);
    reader.readAsDataURL(file);
  }
}
