import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { SlideShare } from '~/components/SlideShare'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'
import { YouTube } from '~/components/YouTube'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RuhrJS 2017 - nec.is' },
    {
      name: 'description',
      content:
        'Spoke at an awesome and really friendly community event, in the Ruhr Valley',
    },
  ]
}

export default function RuhrJS2017() {
  return (
    <>
      <Header title={'RuhrJS 2017'} resume={false} />
      <ArticleContent>
        <Intro>
          <p>
            Npm has tons of modules for devops, like remote logging, metrics,
            service discovery, process management. Most of these are great when
            you do prototyping, but as soon as you arrive to production-land,
            you may find that a lots of these tasks are already handled by old
            players. This talk may be helpful for some people to avoid the same
            mistakes I did, when my first node app was on its journey to an
            established scaleable architecture.
          </p>

          <p>
            <em>
              Talk abstract for "Redundant DevOps",{' '}
              <a href="https://2017.ruhrjs.de/">https://2017.ruhrjs.de/</a>
            </em>
          </p>
        </Intro>

        <p>
          My CFP submission was selected by the RuhrJS team, and was invited to
          Bochum in Germany to give a talk about devops for people, who just
          started to write node services. The RuhrJS conference is an absolutely
          friendly and inclusive event, really well organized, with great talks
          during the two days.
        </p>

        <YouTube src="https://www.youtube.com/embed/3SMbGRVRUsc" />
        <SlideShare src="//www.slideshare.net/slideshow/embed_code/key/HGZMy0cZVzTwkj" />

        <p>
          I could finally meet Sarah Saltrick Meyer and Martin Splitt in person,
          and had a great time with Madeleine Neumann, Paul Verbeek-Mast, Lisa
          Passing, Alexandra Leisse, Lian Li and Stephanie Nemeth talking about
          creative hardware and LEDs, goofing around the beggining of the
          OnesieJS movement and spotting rabbits in the park!
        </p>
      </ArticleContent>
    </>
  )
}
