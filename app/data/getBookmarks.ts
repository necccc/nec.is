export interface Bookmark {
  _id: number
  link: string
  title: string
  cover: string
  tags: string[]
  created: string
  excerpt: string
}
interface BookmarkResponse {
  items?: Bookmark[]
}
export const getBookmarks = async (): Promise<Bookmark[] | undefined> => {
  const response = await fetch(
    'https://api.raindrop.io/rest/v1/raindrops/75137385',
    {
      headers: {
        Authorization: `Bearer ${process.env.RAINDROP_TOKEN}`,
        Accept: 'application/json',
      },
    }
  )

  if (response.status === 200) {
    const result = (await response.json()) as BookmarkResponse

    return result.items
  }
}
