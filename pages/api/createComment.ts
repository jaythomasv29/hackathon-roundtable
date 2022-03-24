// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient  from '@sanity/client'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-03-25'
}

const client = sanityClient(config);

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)
  try {
    await client.create({
      _type: "comment",
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: `Couldn't submit comment`, e});
  }
  return res.status(200).json({ message: 'Comment submitted'})
;}
