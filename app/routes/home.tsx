import type { Route } from './+types/home'
import { Header } from '~/components/Header'
import css from './home.module.scss'

export function meta({}: Route.MetaArgs) {
  return [
    { title: '_Nec' },
    {
      name: 'description',
      content: 'Personal page of Szabolcs Szabolcsi-Toth aka. @_Nec',
    },
  ]
}

export default function Home() {
  return (
    <>
      <Header title={"Hi, I'm Szabolcs!"} resume={false} />

      <section className={css.intro}>
        <p>
          Mostly online as <strong>_nec</strong>, I'm a{' '}
          <a href="/working">developer</a> living near Oslo, Norway.{' '}
        </p>

        <p>
          Organizer and curator of{' '}
          <a href="http://jsconfbp.com/">JSConf Budapest</a> and{' '}
          <a href="http://cssconfbp.rocks/">CSSConf Budapest</a>, organizer of{' '}
          <a href="https://www.meetup.com/Frontend-Meetup-Budapest/">
            Frontend Meetup Budapest
          </a>{' '}
          occasional <a href="/working#speaking">speaker</a>, hobby hardware
          hacker, photographer and Lego nerd. Staff engineer at BinX, a B2B
          neobank founded in the EU.
        </p>
      </section>
    </>
  )
}
