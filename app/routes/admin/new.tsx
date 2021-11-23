import {
  redirect,
  Form,
  ActionFunction,
  useActionData,
  useTransition,
} from "remix";
import { createPost, NewPostErrors } from "~/posts";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: NewPostErrors = {
    title: false,
    slug: false,
    markdown: false,
  };
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (errors.title || errors.slug || errors.markdown) {
    return errors;
  }
  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });
  await createPost({ title, slug, markdown });
  return redirect("/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:
          {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown</label>
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">Create Post</button>
        {transition.submission ? "Creating..." : "Create Post"}
      </p>
    </Form>
  );
}
