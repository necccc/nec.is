import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dynamic Adaptive Streaming over HTTP - Case study - nec.is' },
    {
      name: 'description',
      content: 'Dynamic Adaptive Streaming over HTTP',
    },
  ]
}

export default function DashCaseStudy() {
  return (
    <>
      <Header
        title={'Dynamic Adaptive Streaming over HTTP'}
        resume={false}
        subTitle={'Case study'}
      />
      <ArticleContent>
        <Intro>
          <p>
            https://medium.com/@n20/hls-rtmp-dash-webrtc-and-more-a-simple-guide-to-streaming-protocols-98cbabcd599f
            https://video.ibm.com/recorded/127985370 DASH
          </p>
        </Intro>

        <h3>DASH</h3>

        <p></p>

        <h3>Quality of service</h3>

        <p></p>
      </ArticleContent>
    </>
  )
}
