// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

type Data = {
  message?: string;
  domains?: DomainItem[];
};

type DomainItem = {
  siteName: string;
  link: string;
  tlds: string[];
};

const FREE_LOOKUPS = 12;
const FREE_LIMIT = 3;

const createSiteNames = async (prompt: string, lookups: number) => {
  const schema = {
    type: "object",
    properties: {
      siteNames: {
        type: "array",
        items: {
          domain: "string",
        },
        description:
          `An array of website names without the TLD.`,
      },
    },
    required: ["domains"]
  };
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: `You generate website names. They should be unique, and at least 6 characters. Rank them from best (index 0) to worst (last index)` },
      { role: "user", content: `Generate ${lookups} domain names for: ${prompt}` },
    ],
    model: "gpt-3.5-turbo-1106",
    functions: [{ name: "productDomains", parameters: schema }],
  });
  const choices = completion.choices;
  if (choices && choices.length) {
    const choice = choices[0];
    const jsonStr = choice.message.function_call?.arguments;
    if (!jsonStr) {
      return [];
    } else {
      const parsedArgs = JSON.parse(jsonStr);
      const siteNames = parsedArgs.siteNames as Array<string>;
      return siteNames;
    }
  }
  else {
    return [];
  }
};

const checkAvailability = async (siteNames: string[], tlds: string[], total: number) => {
  const availableDomains = new Map();
  for (let i = 0; i < siteNames.length; i++) {
    const siteName = siteNames[i];
    for (let j = 0; j < tlds.length; j++) {
      const tld = tlds[j];
      const domain = `${siteName}${tld}`;
      const searchParams = new URLSearchParams({
        apikey: process.env.WHOIS_API_KEY as string,
        r: 'taken',
        domain,
      });
      const result = await fetch(`https://api.whoapi.com?${searchParams}`);
      const json = await result.json();
      const isAvailable = json.taken === 0;
      if (isAvailable) {
        const tlds = [...(availableDomains.get(siteName) || []), tld];
        availableDomains.set(siteName, tlds);
      }
    }
    if (availableDomains.size === total) {
      return Object.fromEntries(availableDomains.entries());
    }
  }
  return Object.fromEntries(availableDomains.entries());
}

export async function POST(
  req: Request,
  res: NextApiResponse<Data>
) {
  const data = await req.json();
  if (req.method === 'POST') {
    const siteNames = await createSiteNames(data.prompt, FREE_LOOKUPS);
    await wait(500);
    const availableDomains = await checkAvailability(siteNames, data.tlds, FREE_LIMIT);
    const results = Object.entries(availableDomains).map(([siteName, tlds]) => ({
      siteName,
      tlds,
      link: `https://www.namecheap.com/domains/registration/results/?domain=${siteName}`,
    }));
    return Response.json({
      domains: results,
    });
  } else if (req.method === 'GET') {
    res.status(400).send({ message: 'Invalid request!' });
  }
};