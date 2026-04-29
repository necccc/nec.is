import type { Route } from '../+types/home'

import { Intro } from '~/components/Intro'
import { Header } from '~/components/Header'
import { ArticleContent } from '~/components/ArticleContent'

import css from '~/components/ArticleContent/article.module.scss'

import eventSourcingImage from './assets/event-sourcing.svg'
import cqrsImage from './assets/cqrs.svg'
import cqrsScaledImage from './assets/cqrs-scaled.svg'
import stateMachineImage from './assets/state-machine.svg'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Onboarding customers at a digital bank - Case study - nec.is' },
    {
      name: 'description',
      content: 'Case study for onboarding customers at a digital bank',
    },
  ]
}

export default function DigiBankOnboardingCaseStudy() {
  return (
    <>
      <Header
        title={'Onboarding customers at a digital bank'}
        resume={false}
        subTitle={'Case study'}
      />
      <ArticleContent>
        <Intro>
          <p>
            In controlled environments, like financial, medical, or government,
            there could be myriads of requirements from legal and compliance
            departments regarding the system we should build. Digitally
            onboarding a customer for a B2B bank is no different. There is a KYC
            process for the individual person, due diligence for the customer,
            checking third-party data sources, user input, and implementing
            automated and manual decision-making.
          </p>
          <p>
            These steps in the process could cover a range of things, including
            legal and regulatory conditions. When designing for such
            environments, we must ensure to handle data safely and ready for an
            audit, while the experience is excellent for everyone, including our
            colleagues in areas like customer support.
          </p>
          <p>
            In this case study, I’d like to focus on the architectural decisions
            that made this possible, regardless of the exact requirements of the
            legal and regulatory environment.
          </p>
        </Intro>

        <h3>Event-sourcing</h3>
        <p>
          Modeling data for a complex workflow, like customer onboarding, can be
          challenging if we think in traditional, relational data modeling.
          Regulators could introduce a new law regarding KYC, and the compliance
          team could implement a new step in the due diligence process, both of
          them under time pressure.
        </p>
        <p>
          All these changes could lead to a complex restructuring of your data
          model in the database. Classic relational database design also hides
          the timeline of a workflow, which would be useful for a support team
          and for an auditor as well.
        </p>
        <p>
          To resolve these concerns, we designed our system to use an
          event-sourcing architectural pattern instead.
        </p>
        <p>
          <img
            src={eventSourcingImage}
            alt={`Diagram explaining the event-sourced pattern.
              Clients interact with a service, which emits a series of events,
              eventually stored in a database.`}
            className={css.scale_70}
          />
        </p>
        <p>
          In an event-driven data model, we store data updates as individual
          events. Every action, result, or decision that affects the workflow
          state is represented by an event. Every event has a creation date, a
          type, and a data schema unique to the event type. The complete state
          of a workflow is the reduced result of all events related to the
          workflow.
        </p>

        <p>This pattern makes several things possible:</p>
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
          <li>
            <strong>Observability</strong>
            <br />
            Different stakeholders can look at the event collection for a
            workflow through separate views (so-called “projections”). The
            customer support team can overview the whole workflow and help the
            customer if necessary.
          </li>
        </ul>
        <p>
          Using the event-sourced pattern might be complex at first; building
          the mental model of separating workflow state data, event data, and
          client data can be challenging. But using the proper abstractions,
          it’s a really powerful tool to handle complex workflows.
        </p>

        <h3>CQRS</h3>

        <p>
          With the event-sourced data model, we achieved immutable and auditable
          data, so it’s important that the business logic that interacts with
          this data model is compatible with these requirements. That means no
          direct access to the database; any data handled by our business logic
          should exist as events, and the “projection” of the event collection.
        </p>
        <p>
          This is accomplished by an architectural pattern known as
          Command-Query Responsibility Segregation (CQRS). Developers can use
          this pattern independently of the event-sourced data model, but they
          commonly use them together.
        </p>
        <p>
          CQRS uses commands to contain business logic. Commands have access to
          queries, to look at the workflow state, and commands emit events to
          change the state.
        </p>

        <p>
          <img
            src={cqrsImage}
            alt={`Diagram explaining the Command-Query Responsibility Segregation
              architectural pattern. The client interacts with an API handler,
              which sends commands. The command handler reads data throught queries,
              and emits data using events. A result or error may be sent back to the
              API handler and the client.`}
            className={css.scale_70}
          />
        </p>

        <p>
          Testing commands is simple by mocking queries and other dependencies.
          During peer review it’s easy to see patterns that do not belong to a
          command, like direct access to a database.
        </p>
        <p>
          Separating responsibilities and thinking in commands is also a good
          way to design a scalable architecture. Publish commands in a message
          queue where command handlers listen to the commands they are
          responsible, you can raise the number of command handlers if
          necessary.
        </p>

        <p>
          <img
            src={cqrsScaledImage}
            alt={`Diagram explaining CQRS at scale. Commands are sent to a message bus,
              from command handlers pick up commands. Events are emitted in an event
              message bus, which writes to the database.`}
            className={css.scale_70}
          />
        </p>
        <p>
          Encapsulating business logic in such a strict way is a constraint, but
          a useful one in complex applications.
        </p>

        <h3>State machines</h3>

        <p>
          Handling different states in any application is always an interesting
          problem when we make architectural decisions. As a practical
          guideline, I’d recommend using a state machine for any workflow that
          has or will have five or seven more states.
        </p>
        <p>
          The state machine is a software design pattern where you implement
          your application's states a graph. The graph nodes are the states your
          application has, and the edges are the events that put the application
          into each state.
        </p>
        <p>
          <img
            src={stateMachineImage}
            alt={`Diagram explaining a simple state machine. A finite graph,
              where the edges are events, and the nodes are state your
              application can take.`}
            className={css.scale_70}
          />
        </p>
        <p>
          Because every event in the state machine leads to a single state, and
          your application can only be in states included in the state machine,
          this pattern creates safe and predictable application state
          management.
        </p>
        <p>
          Complex workflows like automated customer onboarding may have dozens,
          or almost a hundred distinct states. Steps the client must follow,
          results and errors the clients must handle.
        </p>
        <p>
          Since we have already made the architectural decision to use event
          sourcing, the data modeling is happening through events. These events
          can drive a state machine, and in this way, we could map every state
          of our application. Using a state machine made testing easier,
          changing the workflow less challenging, and represented in a graph,
          engineers and product design can use it as documentation.
        </p>
      </ArticleContent>
    </>
  )
}
