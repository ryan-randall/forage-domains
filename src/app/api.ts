// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'
// import OpenAI from "openai";

// const openai = new OpenAI();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const getAvailableDomains = async (productDescription: string) => {
  await wait(1000);
  return [
    { siteName: "test1.com", link: "godaddy.com" },
    { siteName: "test2.com", link: "godaddy.com" },
    { siteName: "test3.com", link: "godaddy.com" },
    { siteName: "test4.com", link: "godaddy.com" },
    { siteName: "test5.com", link: "godaddy.com" },
  ];
};

export { getAvailableDomains };
