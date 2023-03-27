import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const TWITTER_BEARER_TOKEN =
  "AAAAAAAAAAAAAAAAAAAAAJXzhAEAAAAAEclAKJNojp8yG%2FZnFEhQateFn%2Fs%3DGBqvNKoNt4LvxYjHWJB8OZKhLBczekZfl3HBGO4lCYJS6zFJLj";
const DEFAULT_API_URL = "https://api.twitter.com/2";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> => {
  const { query } = req.query;

  const url =
    DEFAULT_API_URL +
    `/tweets/search/recent?query=${encodeURIComponent(
      query as string
    )}&tweet.fields=text,public_metrics,created_at&max_results=12`;

  const headers = {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  };

  try {
    const response = await axios.get<any>(url, { headers });
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).end("Server Error");
  }
};
