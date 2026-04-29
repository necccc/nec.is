import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Fintech internal change approval system - Case study - nec.is' },
    {
      name: 'description',
      content: 'Case study for a fintech internal change approval system',
    },
  ]
}

export default function ChangeApprovalSystemCaseStudy() {
  return (
    <>
      <Header
        title={'Fintech internal change approval system'}
        resume={false}
        subTitle={'Case study'}
      />
      <ArticleContent>
        <Intro>
          <p>
            controlled financial environment; audited processes are king; change
            requirements from every department of the company on customer data,
            compliance processes, financial accounts, on service settintgs, on
            website seettings, feature toggles
          </p>
        </Intro>

        <p></p>

        <h3>Event-driven</h3>

        <p></p>

        <h3>Role based access control</h3>

        <p></p>
      </ArticleContent>
    </>
  )
}
