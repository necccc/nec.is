import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { SlideShare } from '~/components/SlideShare'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'UpFront Conference 2017 - nec.is' },
    {
      name: 'description',
      content:
        'Visited beautiful Manchester with an old coffee machine, for a lovely conference with great people.',
    },
  ]
}

export default function Upfront2017() {
  return (
    <>
      <Header title={'UpFront Conference 2017'} resume={false} />
      <ArticleContent>
        <Intro>
          <p>
            Welcome to our impromptu coffeeshop where you can be the connected
            smart barista! Create the coffee that blends with technology, hack &
            tamper with hardware, and brew an espresso from the command line -
            or from the browser!
          </p>

          <p>
            <em>
              Talk abstract for "Café Terminal",{' '}
              <a href="https://2017.upfrontconf.com">
                https://2017.upfrontconf.com
              </a>
            </em>
          </p>
        </Intro>

        <p>
          Unfortunately there was no video recording, so the only truly
          succesful presentation of this talk remains exclusive to those, who
          were lucky to be there :) Here are the slides from the talk:
        </p>

        <SlideShare src="//www.slideshare.net/slideshow/embed_code/key/vDWFRzp0lgeLZi" />

        <p>
          It was really great to meet wonderful people, like Sara Soueidan,
          Mathias Bynens, Charlie Gerard and Alice Bartlett. At the afterparty,
          it was nice to see my talk somewhat inspired people, especially when
          I've mentioned that hardware and IOT can be hacked together with Slack
          bots or even LEGO.
        </p>

        <p>
          The city was beautiful, loved the mixture of old industrial buildings
          and modern architecture, definitely wish to go back again!
        </p>
      </ArticleContent>
    </>
  )
}
