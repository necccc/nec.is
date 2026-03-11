import type { Route } from './+types/home'

import { Header } from '~/components/Header'

import css from './working.module.scss'
import classNames from 'classnames'
import { Link } from 'react-router'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Szabolcs Szabolcsi-Toth' },
    {
      name: 'description',
      content: 'Résumé for Szabolcs Szabolcsi-Toth',
    },
  ]
}

export default function Working() {
  return (
    <>
      <div className={css.resume} id="skills">
        <Header title={'Szabolcs Szabolcsi-Toth'} resume={true} />
        <article className={css.resume_container}>
          <h2 className={css.resume_section_title}>Technologies and Skills</h2>

          <div className={css.resume_section}>
            <ul>
              <li>
                <strong>Languages: </strong>
                English, Hungarian
              </li>
              <li>
                <strong>Code: </strong>
                TypeScript, JavaScript, Node.js, React, HTML, CSS, SASS/SCSS,
                Go, PHP, Bash
              </li>
              <li>
                <strong>Frameworks & libraries: </strong>
                Fastify, Express, Hapi, sequelize, liquibase, React,
                react-router, nextjs, react-query, zustand
              </li>
              <li id="work">
                <strong>Deployment &amp; operations: </strong>
                npm, AWS, linux systems, git/github/gitlab, Docker, Chef,
                Kubernetes, Tekton CI/CD, Hashicorp Vault, TravisCI, TeamCity
              </li>
              <li>
                <strong>Design: </strong>
                web, responsive web, Figma, Photoshop, Illustrator
              </li>
            </ul>
          </div>

          <h2 className={css.resume_section_title}>Work Experience</h2>

          <div className={css.resume_section}>
            <h3>Staff Engineer</h3>
            <h4>
              <Link to="https://binx.hu/">BinX Zrt</Link> •{' '}
              <em>2022 - present</em>
            </h4>
            <ul>
              <li>
                Work with the engineering team and business development to
                create a new financial service from the ground up
              </li>
            </ul>

            <h3>CEO & Organizer</h3>
            <h4>
              JSSC Event organizing, private company • <em>2017 - present</em>
            </h4>
            <ul>
              <li>Company management</li>
              <li>Financial management</li>
              <li>Event organizing</li>
            </ul>

            <h3>Senior Engineer</h3>
            <h4>
              <Link to="https://cloud.ibm.com/catalog/architecture/deploy-arch-ibm-devsecops-alm-e1c16cac-7ea8-413f-a819-67e3a3251e44-global">
                IBM Cloud
              </Link>{' '}
              • <em>2019 - 2022</em>
            </h4>
            <ul>
              <li>
                Design and implement an{' '}
                <a href="https://cloud.ibm.com/docs/devsecops?topic=devsecops-cd-devsecops-pipelines">
                  opinionated DevSecOps pipeline
                </a>{' '}
                for "continous compliance". Aim of this toolchain to help teams
                transparently stay audit-ready during their daily work.
              </li>
              <li>Delegate of IBM for ECMA's TC39</li>
              <li>
                Developing user facing Cloud UI's and microservices in React and
                Node.js
              </li>
            </ul>

            <h3>Senior Frontend Engineer</h3>
            <h4>
              <Link to="https://video.ibm.com/">IBM Cloud Video</Link> (formerly
              Ustream, acquired by IBM) • <em>2016 - 2019</em>
            </h4>
            <ul>
              <li>
                Finding solutions to a backend-for-frontend system using React,
                to feature i18n, SSR, code splitting and Redux state management
              </li>
              <li>
                Transforming a huge legacy JS codebase to module and webpack
              </li>
              <li>
                Driving procedures to have a meetup location at our office
              </li>
              <li>
                Developed and participated in the design process of a Caption
                Editor for both Cloud Video and Watson Media
              </li>
              <li>
                Planned and developed the Node.js based service for our Q&A
                allpication
              </li>
            </ul>

            <h3>Senior Frontend Engineer</h3>
            <h4>
              <Link to="https://web.archive.org/web/20160210020209/http://www.ustream.tv/">
                Ustream Inc
              </Link>
              , startup • <em>2009 - 2016</em>
            </h4>
            <ul>
              <li>
                Early development of mobile video/live player, with ad
                integration
              </li>
              <li>
                Embedable player for both mobile and desktop (core desktop
                player was flash based by another team)
              </li>
              <li>
                Created core interactive modules like chat, social message wall
              </li>
              <li>
                Helped desiging, and creating a custom MVC framework for the
                site JS codebase
              </li>
              <li>
                Finished several iterations on the whole site design together
                with the team
              </li>
              <li>Active participation in recruitment, interviewing</li>
            </ul>

            <h3>Senior Frontend Developer</h3>
            <h4>
              <Link to="https://web.archive.org/web/20060114013213/http://www.carnation.hu/">
                Carnation
              </Link>{' '}
              (later it was acquired by POSSIBLE), digital agency •{' '}
              <em>2007 - 2009</em>
            </h4>
            <ul>
              <li>Sites for media, telecommunication, banks</li>
              <li>Mentoring peers</li>
            </ul>

            <h3>Frontend Developer</h3>
            <h4>
              <Link to="https://web.archive.org/web/20060114013213/http://www.carnation.hu/">
                Carnation
              </Link>{' '}
              (later it was acquired by POSSIBLE), digital agency •{' '}
              <em>2004 - 2007</em>
            </h4>
            <ul>
              <li id="community">Agency work: media sites, microsites</li>
            </ul>
          </div>

          <h2 className={css.resume_section_title}>Community work</h2>

          <div className={css.resume_section}>
            <h3>JSConf Budapest 2015 - 2024</h3>
            <h4>Curator, chief organizer</h4>
            <ul>
              <li>
                <p>
                  JSConf Budapest was the part of the international JSConf
                  family
                </p>

                <p>
                  <a href="https://2015.jsconfbp.com/">2015</a> |{' '}
                  <a href="https://2016.jsconfbp.com/">2016</a> |{' '}
                  <a href="https://2017.jsconfbp.com/">2017</a> |{' '}
                  <a href="https://2019.jsconfbp.com/">2019</a> |{' '}
                  <a href="https://2022.jsconfbp.com/">2022</a> |{' '}
                  <a href="https://jsconfbp.com/">2024</a>
                </p>
              </li>
              <li>2 day, single track event</li>
              <li>92 speakers and more than 2500 attendees since 2015</li>
              <li>Focused on technology, culture and diversity</li>
              <li>Curated and organized 6 successful events</li>
              <li>
                My participation was in curating the lineup, organizing venue,
                catering, hotel and flight arrangements and sponsor negotiations
              </li>
            </ul>

            <h3>CSSConf Budapest 2016 - 2019</h3>
            <h4>Organizer</h4>
            <ul>
              <li>
                CSSConf Budapest is the part of the international CSSConf family
              </li>
              <li>single day single track event</li>
              <li>27 speakers and ~800 attendees since 2016</li>
              <li>Organized and helped at 3 successful events</li>
              <li>
                My participation was in organizing venue, catering, hotel and
                flight arrangements and sponsor negotiations
              </li>
            </ul>

            <h3>Frontend Meetup Budapest 2018 - present</h3>
            <h4>Co-Organizer</h4>
            <ul>
              <li>Helping around the meetup organization, speakers, venues</li>
              <li>Occasional MCing at the events</li>
            </ul>

            <h3>Global Diversity CFP Day Workshop 2018 - present</h3>
            <h4>Mentor, facilitator</h4>
            <ul>
              <li>Helping around the organization, mentors, venue</li>
              <li id="speaking">Mentoring at the workshop itself</li>
            </ul>
          </div>

          <h2 className={css.resume_section_title}>Speaking Engagements</h2>

          <div className={classNames(css.resume_section, css.speaking)}>
            <h3>NodeConf EU 2018</h3>
            <h4>
              <Link to="/speaking/nodeconf-eu-2018">
                Healthy & fit wombats for the greater good
              </Link>
            </h4>
            <p>Kilkenny, Ireland • 2018 Nov 5-7</p>

            <h3>Thunder Plains 2017</h3>
            <h4>
              <Link to="/speaking/thunderplains-2017">Café Terminal</Link>
            </h4>
            <p>Oklahoma City, OK, USA • 2017 Nov 3</p>

            <h3>RuhrJS 2017</h3>
            <h4>
              <Link to="/speaking/ruhrjs-2017">Redundant DevOps</Link>
            </h4>
            <p>Bochum, Germany • 2017 Oct 14-15</p>

            <h3>UpFront Conference 2017</h3>
            <h4>
              <Link to="/speaking/upfront-2017">Café Terminal</Link>
            </h4>
            <p>Manchester, UK • 2017 May 19</p>

            <h3>Craft Conference 2014</h3>
            <h4>JavaScript Module Server</h4>
            <p>Budapest, Hungary • 2014 Apr 23-25</p>
          </div>

          <h2 className={css.resume_section_title} id="education">
            Education
          </h2>

          <div className={css.resume_section}>
            <h3>Bachelor of IT Engineering</h3>
            <h4>
              <a href="https://mik.pte.hu/">University of Pécs - MIK (PMMFK)</a>
            </h4>
            <ul>
              <li>
                Pécs, Hungary • <em>1999 - 2004</em>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </>
  )
}
