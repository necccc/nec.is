import type { Route } from './+types/home'
import { Header } from '~/components/Header'
import css from './reading.module.scss'
import { getBookmarks } from '~/data/getBookmarks'
import dayjs from 'dayjs'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reading list | _Nec' },
    {
      name: 'description',
      content:
        "I'm using raindrop.io to save interesting posts, that I want to read later. Here are the most recent ones",
    },
  ]
}

export async function loader() {
  const bookmarks = await getBookmarks()
  return bookmarks
}

export default function Reading({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Header title={'Reading list'} resume={false} />

      <section className={css.intro}>
        <p>
          I'm using <a href="https://raindrop.io/">raindrop.io</a> to save
          interesting posts, that I want to read later. Here are the most recent
          ones:
        </p>

        {loaderData && (
          <>
            <ul className={css.bookmarks}>
              {loaderData.map((bookmark) => (
                <li key={`${bookmark._id}`}>
                  <span className={css.meta}>
                    <h4>{bookmark.title}</h4>
                    <small>
                      {dayjs(bookmark.created).format('YYYY-MM-DD')}
                    </small>
                    <a href={bookmark.link}>{bookmark.link}</a>
                    {bookmark.excerpt && <p>{bookmark.excerpt}</p>}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
