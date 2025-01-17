import { NextApiRequest, NextApiResponse } from "next"

// API route for on-demand revalidation.
// See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation-beta.
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  let slug = request.query.slug as string
  const secret = request.query.secret as string

  // Validate secret.
  if (secret !== process.env.DRUPAL_PREVIEW_SECRET) {
    return response.status(401).json({ message: "Invalid secret." })
  }

  // Validate slug.
  if (!slug) {
    return response.status(400).json({ message: "Invalid slug." })
  }

  // Fix for home slug.
  if (slug === process.env.NEXT_PUBLIC_DRUPAL_FRONT_PAGE) {
    slug = "/"
  }

  try {
    await response.unstable_revalidate(slug)

    return response.json({})
  } catch (error) {
    return response.status(404).json({
      message: error.message,
    })
  }
}
