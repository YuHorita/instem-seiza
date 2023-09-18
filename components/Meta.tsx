import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  title: string;
  description: string;
  url: string;
};

const Meta = (props: Props) => {
  const { title, description, url } = props;
  const router = useRouter();
  const { id } = router.query;
  return (
    <Head>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:image" content={`/api/og?t=${id}`} />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default Meta;
