"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaPlus, FaMinus } from "react-icons/fa";
import { BsPinterest } from "react-icons/bs";
import { Lato, Noto_Sans, Poppins } from "next/font/google";
import parse, { DOMNode, Element } from "html-react-parser";
import About from "@/app/components/widgets/About";
import Newsletter from "@/app/components/sections/static/Newsletter";
import { fetchSocialLinks } from "@/api/rest/fetchFunctions";
import { SocialLinks } from "@/libs/interfaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });
const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });

interface PostProps {
  post: {
    title: string;
    content: string;
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
        title: string;
      };
    } | null;
    slug: string;
    tags: {
      nodes: { name: string; slug: string }[];
    };
    author: {
      node: {
        name: string;
        slug: string;
        description: string;
        avatar: {
          url: string;
        };
      };
    } | null;
    seo: {
      metaDesc: string;
      title: string;
      opengraphPublishedTime?: string; // Make this optional
      readingTime?: number; // Make this optional
    };
    categories: {
      nodes: { name: string; slug: string }[];
    };
  };
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const sanitizeHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "");
};

const truncateContent = (content: string, maxLength: number) => {
  const sanitizedContent = sanitizeHtml(content);
  return sanitizedContent.length > maxLength
    ? sanitizedContent.substring(0, maxLength) + "..."
    : sanitizedContent;
};

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const generateTableOfContents = (content: string) => {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/g;
  const toc: { text: string; id: string; level: number }[] = [];
  const modifiedContent = content.replace(
    headingRegex,
    (match, level, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = createSlug(cleanText);
      toc.push({ text: cleanText, id, level: parseInt(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  return { toc, modifiedContent };
};

// Function to replace <a> with Next.js <Link> for internal links
const replaceLinks = (content: string) => {
  return parse(content, {
    replace: (domNode: DOMNode) => {
      if (
        domNode instanceof Element &&
        domNode.name === "a" &&
        domNode.attribs?.href
      ) {
        const href = domNode.attribs.href;
        const isInternal =
          href.startsWith("/") ||
          href.includes(`${process.env.NEXT_PUBLIC_FRONTEND}`); // Adjust for your domain
        if (isInternal) {
          return (
            <Link href={href} className={domNode.attribs.class || ""}>
              {domNode.children.map((child, index) =>
                typeof child === "string"
                  ? child
                  : parse(child as unknown as string)
              )}
            </Link>
          );
        }
      }
    },
  });
};

const socialMediaIcons = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    link: "https://www.facebook.com",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    link: "https://www.twitter.com",
  },
  {
    name: "Pinterest",
    icon: BsPinterest,
    link: "https://www.pinterest.com",
  },
];

const Post: React.FC<PostProps> = ({ post }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSocialLinks = async () => {
      try {
        const fetchedSocialLinks = await fetchSocialLinks();
        setSocialLinks(fetchedSocialLinks);
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };

    getSocialLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width={20} height={20} />
        ))}
      </div>
    );
  }

  if (!socialLinks) {
    return null; // Ensure socialLinks are available before rendering
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const { toc, modifiedContent } = generateTableOfContents(post.content);
  const postUrl = `https://www.${process.env.NEXT_PUBLIC_FRONTEND}/${post.slug}`;

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-16">
      <div className="lg:flex gap-12">
        <MainContent
          post={post}
          modifiedContent={modifiedContent}
          postUrl={postUrl}
          toc={toc}
        />
        <Sidebar />
      </div>
    </main>
  );
};

const TableOfContents = ({
  toc,
}: {
  toc: { text: string; id: string; level: number }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-slate-100 p-5 mb-8">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleToc}
      >
        <h2 className="!font-semibold !text-lg !text-black !uppercase !mb-0">
          See What&apos;s Inside
        </h2>
        {isOpen ? (
          <FaMinus className="text-black" />
        ) : (
          <FaPlus className="text-black" />
        )}
      </div>
      {isOpen && (
        <div className="mt-4 space-y-2">
          <ul>
            {toc.map((item) => (
              <li
                key={item.id}
                className={`pb-2 ${item.level === 3 ? "ml-4" : ""}`}
              >
                <Link
                  href={`#${item.id}`}
                  className="toc-link text-slate-700 font-semibold text-[13px] transition-all hover:text-slate-950"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

const MainContent = ({
  post,
  modifiedContent,
  postUrl,
  toc,
}: {
  post: PostProps["post"];
  modifiedContent: string;
  postUrl: string;
  toc: { text: string; id: string; level: number }[];
}) => (
  <article className="lg:w-9/12">
    <header>
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex justify-start items-center gap-1.5">
          <li className="text-gray-700 text-[13px] font-semibold">
            <Link href="/" className="uppercase">
              Home
            </Link>
          </li>
          <li className="inline-block text-slate-500 text-sm">/</li>
          {post.categories.nodes.length > 0 && (
            <li className="text-gray-700 text-[13px] font-semibold">
              <Link
                href={`/${post.categories.nodes[0].slug}`}
                className="uppercase"
              >
                {post.categories.nodes[0].name}
              </Link>
            </li>
          )}
          <li className="inline-block text-slate-500 text-sm">/</li>
        </ol>
      </nav>
      <h1 className="text-2xl lg:text-3xl font-black text-black mt-0">
        {post.title}
      </h1>
      <p className="text-slate-500 text-sm mt-3 mb-8">{post.seo.metaDesc}</p>
      <div className="flex justify-start items-center gap-3 mb-8">
        {post.author && (
          <div
            className="h-11 w-11 bg-slate-200 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.author.node.avatar.url})` }}
          ></div>
        )}
        <div className="flex justify-center items-start flex-col space-y-1">
          <p className="text-gray-800 text-xs font-medium uppercase">
            BY:{" "}
            <Link
              href="/about"
              className="hover:text-gray-900 font-semibold transition-all duration-500"
            >
              {post.author?.node.name}
            </Link>
          </p>
          <time
            dateTime={post.seo.opengraphPublishedTime || ""}
            className="text-slate-500 uppercase text-xs font-medium"
          >
            Published:{" "}
            <span className="font-semibold">
              {post.seo.opengraphPublishedTime
                ? formatDate(post.seo.opengraphPublishedTime)
                : "Date Unavailable"}
            </span>
          </time>
        </div>
      </div>
      <TableOfContents toc={toc} />
    </header>

    <section className="mt-5">
      <div
        className={`${noto.className} single_content text-[#222] text-[14px] tracking-[.2px] leading-[1.5] mb-8`}
      >
        {replaceLinks(post.content)}
      </div>
    </section>

    {post.tags.nodes.length > 0 && (
      <div className="my-12">
        <div className="flex flex-wrap gap-3 mt-2">
          {post.tags.nodes.map((tag) => (
            <Link
              key={tag.slug}
              href={`/${tag.slug}`}
              className="text-slate-400 text-[13px] hover:text-slate-500 transition"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    )}

    <div className="flex justify-between items-center border-2 border-black p-4 px-6">
      <h6
        className={`!${noto.className} !text-black !text-xs !uppercase !my-0 !font-normal`}
      >
        Spread the love
      </h6>
      <nav>
        <ul className="flex justify-start items-center gap-3">
          <li>
            <Link href="">
              <FaFacebookF className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
          <li>
            <Link href="">
              <FaTwitter className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
          <li>
            <Link href="">
              <BsPinterest className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>

    <div className="my-12">
      <h4
        className={`!${lato.className} !mb-[0.4em] !pb-[0.3em] !text-xs !tracking-[2px] !uppercase !text-[#222222]`}
      >
        About The Author
      </h4>
      <div className="border-[1px] border-slate-200 p-5">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-7">
          <div className="">
            <Image
              src={`${post.author?.node.avatar.url}`}
              alt={`${post.author?.node.name}`}
              title={`${post.author?.node.name}`}
              loading="lazy"
              width={0}
              height={0}
              className="w-20 h-20 rounded-full"
            />
          </div>
          <div
            className={`${poppins.className} text-center md:text-left text-sm flex-col space-y-2.5`}
          >
            <Link
              href={`/${post.author?.node.slug}`}
              className="text-black font-medium"
            >
              {post.author?.node.name}
            </Link>
            <p className={`${noto.className} text-black text-xs mt-2`}>
              {post.author?.node?.description
                ? parse(post.author.node.description)
                : "No author description available."}
            </p>
            <nav>
              <ul className="flex mt-5 justify-center lg:justify-start items-center gap-3">
                {socialMediaIcons.map(({ name, icon: Icon, link }) => (
                  <li key={name}>
                    <Link target="_blank" href={link || "/"} aria-label={name}>
                      <Icon className="size-4 text-[#222222]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div className="my-16">
      <h5
        className={`${lato.className} !text-[12px] !uppercase !text-center !tracking-wide !text-[#222] !mt-0 !mb-4`}
      >
        You May Also Like
      </h5>
    </div>

    <div className="my-16">
      <h5
        className={`${lato.className} !text-[12px] !uppercase !text-center !tracking-widest !text-[#222] !mt-0 !mb-4`}
      >
        Leave A Comment
      </h5>
    </div>
  </article>
);

const Sidebar = () => (
  <aside className="lg:w-3/12">
    <About />
    <Newsletter />
    {/* <RecentPosts /> */}
  </aside>
);

export default Post;
