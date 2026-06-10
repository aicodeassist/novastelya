import React from "react";

type JsonLdProps = {
  schema: object | object[];
};

export function JsonLd({ schema }: JsonLdProps) {
  const graph = Array.isArray(schema) ? schema : [schema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
export { JsonLd as SchemaScript };
