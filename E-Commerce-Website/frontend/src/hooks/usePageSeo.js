import { useEffect } from "react";

const upsertMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "content") {
        tag.setAttribute(key, value);
      }
    });
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", attributes.content);
};

export function usePageSeo({ title, description, image, url }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      upsertMetaTag('meta[name="description"]', {
        name: "description",
        content: description,
      });

      upsertMetaTag('meta[property="og:description"]', {
        property: "og:description",
        content: description,
      });
    }

    if (title) {
      upsertMetaTag('meta[property="og:title"]', {
        property: "og:title",
        content: title,
      });
    }

    if (image) {
      upsertMetaTag('meta[property="og:image"]', {
        property: "og:image",
        content: image,
      });
    }

    if (url) {
      upsertMetaTag('meta[property="og:url"]', {
        property: "og:url",
        content: url,
      });
    }

    upsertMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
  }, [title, description, image, url]);
}
