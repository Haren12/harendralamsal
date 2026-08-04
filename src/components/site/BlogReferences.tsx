import { Link } from "@tanstack/react-router";

type Props = {
  internalLinks?: string[];
  externalLinks?: string[];
};

function getTitleFromSlug(url: string) {
  const slug = url.split("/").pop() ?? url;

  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BlogReferences({ internalLinks = [], externalLinks = [] }: Props) {
  if (!internalLinks.length && !externalLinks.length) {
    return null;
  }

  return (
    <section className="mt-12 space-y-8 border-t pt-8">
      {internalLinks.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Related Articles</h2>

          <ul className="space-y-2">
            {internalLinks.map((link) => (
              <li key={link}>
                <Link to={link as any} className="text-blue-600 hover:underline">
                  {getTitleFromSlug(link)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {externalLinks.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">External References</h2>

          <ul className="space-y-2">
            {externalLinks.map((link) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
