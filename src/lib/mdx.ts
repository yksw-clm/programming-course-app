import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "contents");

export function getPostSlugs() {
  return fs.readdirSync(contentDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matterでメタデータと本文を分離
  const { data, content } = matter(fileContents);

  return { slug: realSlug, meta: data, content };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug));

  // ファイル名順でソート
  return posts.sort((post1, post2) => (post1.slug > post2.slug ? 1 : -1));
}

export function getAdjacentPosts(currentSlug: string) {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}