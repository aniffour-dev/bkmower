// import { gql } from "@apollo/client";
// import client from "@/api/apollo/client";

// // Define the type for the nodes
// interface NodeWithSlug {
//   slug: string;
// }

// export async function getAllSlugs() {
//   const { data } = await client.query({
//     query: gql`
//       query GetAllSlugs {
//         categories(first: 100) {
//           nodes {
//             slug
//           }
//         }
//         pages(first: 100) {
//           nodes {
//             slug
//           }
//         }
//         posts(first: 100) {
//           nodes {
//             slug
//           }
//         }
//         tags(first: 100) {
//           nodes {
//             slug
//           }
//         }
//         users {
//           nodes {
//             slug
//           }
//         }
//       }
//     `,
//   });

//   return [
//     ...data.categories.nodes.map((n: NodeWithSlug) => n.slug),
//     ...data.pages.nodes.map((n: NodeWithSlug) => n.slug),
//     ...data.posts.nodes.map((n: NodeWithSlug) => n.slug),
//     ...data.tags.nodes.map((n: NodeWithSlug) => `tag/${n.slug}`), // Prefix tag slugs with 'tag/'
//   ];
// }

// export async function getContentBySlug(
//   slug: string,
//   page: number = 1,
//   perPage: number = 10
// ) {
//   const { data } = await client.query({
//     query: gql`
//       query GetContentBySlug($slug: ID!) {
//         category(id: $slug, idType: SLUG) {
//           id
//           name
//           slug
//           categoryImage
//           description
//           seo {
//             metaDesc
//             title
//           }
//           posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
//             nodes {
//               title
//               slug
//               content
//               date
//               seo {
//                 readingTime
//                 metaDesc
//                 opengraphPublishedTime
//               }
//               featuredImage {
//                 node {
//                   sourceUrl
//                   altText
//                 }
//               }
//             }
//           }
//           children {
//             nodes {
//               name
//               slug
//               description
//               posts {
//                 nodes {
//                   title
//                   date
//                   slug
//                   content
//                   featuredImage {
//                     node {
//                       sourceUrl
//                       altText
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }

//         page(id: $slug, idType: URI) {
//           id
//           title
//           content
//           slug
//           seo {
//             metaDesc
//             title
//           }
//         }

//         post(id: $slug, idType: SLUG) {
//           id
//           title
//           content
//           slug
//           author {
//             node {
//               name
//               slug
//               description
//               avatar {
//                 url
//               }
//               seo {
//                 social {
//                   facebook
//                   instagram
//                   pinterest
//                 }
//               }
//             }
//           }
//           featuredImage {
//             node {
//               sourceUrl
//               altText
//               title
//             }
//           }
//           seo {
//             metaDesc
//             title
//             opengraphPublishedTime
//             opengraphModifiedTime
//             readingTime
//           }
//           categories {
//             nodes {
//               name
//               slug
//               posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
//                 nodes {
//                   title
//                   slug
//                   content
//                   date
//                   seo {
//                     metaDesc
//                     title
//                     opengraphPublishedTime
//                   }
//                   featuredImage {
//                     node {
//                       sourceUrl
//                       altText
//                     }
//                   }
//                 }
//               }
//             }
//           }
//           tags {
//             nodes {
//               name
//               slug
//             }
//           }
//         }

//         user(id: $slug, idType: SLUG) {
//           id
//           name
//           slug
//           description
//           posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
//             nodes {
//               title
//               slug
//               categories {
//                 nodes {
//                   name
//                   slug
//                 }
//               }
//               content
//               date
//               seo {
//                 readingTime
//                 metaDesc
//                 opengraphPublishedTime
//               }
//               featuredImage {
//                 node {
//                   sourceUrl
//                   altText
//                 }
//               }
//             }
//           }
//           avatar {
//             url
//           }
//           seo {
//             social {
//               facebook
//               instagram
//               pinterest
//             }
//           }
//         }

//         tag(id: $slug, idType: SLUG) {
//           id
//           name
//           slug
//           posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
//             nodes {
//               title
//               slug
//               categories {
//                 nodes {
//                   name
//                   slug
//                 }
//               }
//               content
//               date
//               seo {
//                 readingTime
//                 metaDesc
//                 opengraphPublishedTime
//               }
//               featuredImage {
//                 node {
//                   sourceUrl
//                   altText
//                 }
//               }
//             }
//           }
//         }
//       }
//     `,
//     variables: { slug },
//   });

//   if (data.category) return { ...data.category, type: "category" };
//   if (data.page) return { ...data.page, type: "page" };
//   if (data.post) return { ...data.post, type: "post" };
//   if (data.tag) return { ...data.tag, type: "tag" };
//   if (data.user) return { ...data.user, type: "user" };

//   return null;
// }

import { gql } from "@apollo/client";
import client from "@/api/apollo/client";

// Define the type for the nodes
interface NodeWithSlug {
  slug: string;
}

export async function getContentBySlug(
  slug: string,
  page: number = 1,
  perPage: number = 10
) {
  const { data } = await client.query({
    query: gql`
      query GetContentBySlug($slug: ID!) {

        category(id: $slug, idType: SLUG) {
          id
          name
          slug
          categoryImage
          description
          seo {
            metaDesc
            title
          }
          posts(first: 30, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              content
              date
              seo {
                readingTime
                metaDesc
                opengraphPublishedTime
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                  title
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
          children {
            nodes {
              name
              slug
              description
              posts {
                nodes {
                  title
                  date
                  slug
                  content
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      title
                    }
                  }
                  categories {
                    nodes {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }

        page(id: $slug, idType: URI) {
          id
          title
          content
          slug
          seo {
            metaDesc
            title
          }
        }

        post(id: $slug, idType: SLUG) {
          id
          title
          content
          slug
          author {
            node {
              name
              slug
              description
              avatar {
                url
              }
              seo {
                social {
                  facebook
                  instagram
                  pinterest
                }
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
          seo {
            metaDesc
            title
            opengraphPublishedTime
            opengraphModifiedTime
            readingTime
          }
          categories {
            nodes {
              name
              slug
              posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
                nodes {
                  title
                  slug
                  content
                  date
                  seo {
                    metaDesc
                    title
                    opengraphPublishedTime
                  }
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                      title
                    }
                  }
                  categories {
                    nodes {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
        }

        user(id: $slug, idType: SLUG) {
          id
          name
          slug
          description
          posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              categories {
                nodes {
                  name
                  slug
                }
              }
              content
              date
              seo {
                readingTime
                metaDesc
                opengraphPublishedTime
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                  title
                }
              }
            }
          }
          avatar {
            url
          }
          seo {
            social {
              facebook
              instagram
              pinterest
            }
          }
        }

        tag(id: $slug, idType: SLUG) {
          id
          name
          slug
          posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              categories {
                nodes {
                  name
                  slug
                }
              }
              content
              date
              seo {
                readingTime
                metaDesc
                opengraphPublishedTime
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                  title
                }
              }
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  if (data.category) return { ...data.category, type: "category" };
  if (data.page) return { ...data.page, type: "page" };
  if (data.post) return { ...data.post, type: "post" };
  if (data.tag) return { ...data.tag, type: "tag" };
  if (data.user) return { ...data.user, type: "user" };

  return null;
}
