export default function Meta({ title, description, url }) {
  return (
    <>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:image" content={`/api/og?t=${title}`} />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </>
  );
}
