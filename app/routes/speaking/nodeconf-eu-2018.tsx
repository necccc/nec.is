import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { YouTube } from '~/components/YouTube'
import { SlideShare } from '~/components/SlideShare'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'NodeConf EU 2018 - nec.is' },
    {
      name: 'description',
      content:
        'Took the stage and talked about cats and gifs in the npm ecosystem, the overhead in every npm module out there.',
    },
  ]
}

export default function Nodeconf2018() {
  return (
    <>
      <Header title={'NodeConf EU 2018'} resume={false} />
      <ArticleContent>
        <Intro>
          <p>
            Almost every Node.js developer saw the joke of the huge node_modules
            folder tearing hole in the space-time continuum, but how many
            thought of what could be done to prevent this?
          </p>
          <p>
            By fine-tuning our npm publishing workflow, we can save time,
            bandwidth and money for others, so let’s learn more about it! I’ll
            shed some light on how the npm module authoring works, and show some
            best practices on how we do npm authoring at our company.{' '}
          </p>
          <p>
            <em>
              Talk abstract for "Healthy & fit wombats for the greater good",{' '}
              <a href="https://www.nodeconf.eu">https://www.nodeconf.eu</a>
            </em>
          </p>
        </Intro>

        <p>
          It was a pleasure to speak at NodeConf EU in 2018 at the Lyrath Estate
          in Kilkenny, Ireland. The 3 day, single track conference balances
          great between sessions and workshops, giving us hands-on knowledge on
          various topics, like Node.js core contributions, GraphQL, WebAssembly,
          diagnosing issues in Node apps and many more.
        </p>

        <YouTube src="https://www.youtube.com/embed/V2V6gStgzvo" />
        <SlideShare src="//www.slideshare.net/slideshow/embed_code/key/bsuyA2aRYCXz2e" />
      </ArticleContent>
    </>
  )
}
