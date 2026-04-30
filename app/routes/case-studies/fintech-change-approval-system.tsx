import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'
import { Link } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Internal change approval at fintech - Case study - nec.is' },
    {
      name: 'description',
      content: 'Case study for an internal change approval service at fintech',
    },
  ]
}

export default function ChangeApprovalSystemCaseStudy() {
  return (
    <>
      <Header
        title={'Internal change approval service at fintech'}
        resume={false}
        subTitle={'Case study'}
        activeMenu="case-studies"
      />
      <ArticleContent>
        <Intro>
          <p>
            <em>“Write-level access to customer or system data.”</em> This is
            not a lightweight topic in a controlled and audited environment,
            like a financial institution. When a change is necessary to
            customer, user, or system-level data, usually more than a single
            person is involved: someone who prepares the data modification and
            someone or multiple people who need to review and sign-off that
            change.
          </p>
          <p>
            Departments that need such strict workflows are all over at a
            FinTech company: customer support, compliance, legal, back-office,
            marketing, and even business teams. They need to change customer
            data, customer accounts, publish messages on the website, or toggle
            business features behind feature flags.
          </p>
          <p>
            Our task was to design and implement a system where all this is
            possible in a secure and audited way.
          </p>
        </Intro>
        <p></p>
        <h3>Event-driven architecture</h3>
        <p>
          In an event-driven data model, we store data updates as individual
          events. Starting a change to a customer is an event. Someone reviewing
          the change is an event. Someone approving the change is also an event.
        </p>
        <p>
          I’ve explained the concept of event-sourcing in a{' '}
          <Link to="/case-studies/digital-bank-onboarding-flow">
            previous case study
          </Link>
          , but I’d like to emphasize its benefits for this particular use-case:
        </p>

        <ul>
          <li>
            <strong>Audited data flow</strong>
            <br />
            Everything that happens during an onboarding workflow is represented
            by an event. It is clear what happened, what decisions were made on
            what basis.
          </li>

          <li>
            <strong>Immutable data</strong>
            <br />
            Once an event is saved, nothing will change it. If some decision
            should mitigate it’s effect on the reduced state, a different event
            must represent that decision.
          </li>
          <li>
            <strong>Flexibility</strong>
            <br />
            Every action, decision, and update that we add to the system is
            implemented using new events. Complex and risky database migrations
            are unnecessary.
          </li>
        </ul>
        <h3>Role based access control</h3>
        <p></p>
      </ArticleContent>
    </>
  )
}
