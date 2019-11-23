import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, url, imageUrl, label1, data1, label2, data2 }) => (
  <Helmet>
    <title>{title}</title>
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`https://golden-stack.now.sh${url}`} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:url" content={imageUrl} />
    <meta property="og:image:secure_url" content={imageUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:domain" content={'https://golden-stack.now.sh'} />
    <meta name="twitter:title" value={title} />
    <meta name="twitter:description" value={description} />
    <meta name="twitter:image" value={imageUrl} />
    <meta name="twitter:url" value={url} />
    <meta name="twitter:label1" value={label1} />
    <meta name="twitter:data1" value={data1} />
    <meta name="twitter:label2" value={label2} />
    <meta name="twitter:data2" value={data2} />
  </Helmet>
);

export default SEO;
