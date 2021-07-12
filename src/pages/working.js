import React from 'react'
import classnames from 'classnames'
import Layout from '../components/Layout'
import css from './working.module.scss'

export default () => (
  <Layout
    title="Szabolcs Szabolcsi-Toth"
    pathName="/working"
    skipMetaTitle
    resume
  >
    <article className={ css.resumeContainer }>

        <h2 className={ css.resumeSectionTitle }>Technologies and Skills</h2>

        <div className={ css.resumeSection }>
            <ul>
                <li><strong>Languages:</strong>
                  English, Hungarian</li>
                <li><strong>Design:</strong>
                  web, responsive web, Figma, Photoshop, Illustrator</li>
                <li><strong>Code:</strong>
                  JavaScript, TypeScript, Node.js, HTML5/CSS3, SASS/SCSS, Go, PHP, Bash</li>
                <li><strong>Deployment & maintenance:</strong>
                  npm, linux systems, git/github/gitlab, Docker, Chef, Kubernetes, Tekton CI/CD, Hashicorp Vault, TravisCI, TeamCity</li>
            </ul>
        </div>

        <h2 className={ css.resumeSectionTitle  }>Work Experience</h2>

        <div className={ css.resumeSection }>

            <h3>CEO & Organizer</h3>
            <h4>JSSC Event organizing, private company • <em>2017 - present</em></h4>
            <ul>
                <li>Company management</li>
                <li>Financial management</li>
                <li>Event organizing</li>
            </ul>

            <h3>Senior Engineer</h3>
            <h4>IBM Cloud • <em>2019 - present</em></h4>
            <ul>
              <li>Design and implement an <a href="https://www.ibm.com/cloud/blog/announcements/devsecops-reference-implementation-for-audit-ready-compliance-across-development-teams">opinionated DevSecOps pipeline</a> for "continous compliance".
              Aim of this toolchain to help teams transparently stay audit-ready during their daily work.</li>
              <li>Delegate of IBM for ECMA's TC39</li>
              <li>Developing user facing Cloud UI's and microservices in React and Node.js</li>
            </ul>

            <h3>Senior Frontend Engineer</h3>
            <h4>IBM Cloud Video (formerly Ustream, acquired by IBM) • <em>2016 - 2019</em></h4>
            <ul>
                <li>Finding solutions to a backend-for-frontend system using React, to feature i18n, SSR, code splitting and Redux state management</li>
                <li>Transforming a huge legacy JS codebase to module and webpack</li>
                <li>Driving procedures to have a meetup location at our office</li>
                <li>Developed and participated in the design process of a Caption Editor for both Cloud Video and Watson Media</li>
                <li>Planned and developed the Node.js based service for our Q&A allpication</li>
            </ul>

            <h3>Senior Frontend Engineer</h3>
            <h4>Ustream Inc, startup • <em>2009 - 2016</em></h4>
            <ul>
                <li>Early development of mobile video/live player, with ad integration</li>
                <li>Embedable player for both mobile and desktop (core desktop player was flash based by another team)</li>
                <li>Created core interactive modules like chat, social message wall</li>
                <li>Helped desiging, and creating a custom MVC framework for the site JS codebase</li>
                <li>Finished several iterations on the whole site design together with the team</li>
                <li>Active participation in recruitment, interviewing</li>
            </ul>

            <h3>Senior Frontend Developer</h3>
            <h4>Carnation (later it was acquired by POSSIBLE), digital agency • <em>2007 - 2009</em></h4>
            <ul>
                <li>Sites for media, telecommunication, banks</li>
                <li>Mentoring peers</li>
            </ul>

            <h3>Frontend Developer</h3>
            <h4>Carnation (later it was acquired by POSSIBLE), digital agency • <em>2004 - 2007</em></h4>
            <ul>
                <li>Agency work: media sites, microsites</li>
            </ul>

        </div>

        <h2 className={ css.resumeSectionTitle }>Community work</h2>

        <div className={ css.resumeSection }>

            <h3>JSConf Budapest 2015 - present</h3>
            <h4>Curator, organizer</h4>
            <ul>
                <li>JSConf Budapest is the part of the international JSConf family</li>
                <li>2 day, single track event</li>
                <li>92 speakers and more than 2100 attendees since 2015</li>
                <li>Focused on technology, culture and diversity</li>
                <li>Curated and organized 4 successful events so far</li>
                <li>My participation was in curating the lineup, organizing venue, catering, hotel and flight arrangements and sponsor negotiations</li>
            </ul>

            <h3>CSSConf Budapest 2016 - 2019</h3>
            <h4>Organizer</h4>
            <ul>
                <li>CSSConf Budapest is the part of the international CSSConf family</li>
                <li>single day single track event</li>
                <li>27 speakers and ~800 attendees since 2016</li>
                <li>Organized and helped at 3 successful events so far</li>
                <li>My participation was in organizing venue, catering, hotel and flight arrangements and sponsor negotiations</li>
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
                <li>Mentoring at the workshop itself</li>
            </ul>
        </div>

        <h2 className={ css.resumeSectionTitle  }>Speaking Engagements</h2>

        <div className={ classnames(css.resumeSection, css.speaking) }>

            <h3>NodeConf EU 2018</h3>
            <h4>Healthy & fit wombats for the greater good</h4>
            <p>
                Kilkenny, Ireland • 2018 Nov 5-7
            </p>

            <h3>Thunder Plains 2017</h3>
            <h4>Café Terminal</h4>
            <p>
                Oklahoma City, OK, USA • 2017 Nov 3
            </p>

            <h3>RuhrJS 2017</h3>
            <h4>Redundant DevOps</h4>
            <p>
                Bochum, Germany • 2017 Oct 14-15
            </p>

            <h3>UpFront Conference 2017</h3>
            <h4>Café Terminal</h4>
            <p>
                Manchester, UK • 2017 May 19
            </p>

            <h3>Craft Conference 2014</h3>
            <h4>JavaScript Module Server</h4>
            <p>
                Budapest, Hungary • 2014 Apr 23-25
            </p>

        </div>

        <h2 className={ css.resumeSectionTitle }>Education</h2>

        <div className={ css.resumeSection }>

            <h3>Bachelor of IT Engineering</h3>
            <h4>University of Pécs - PMMFK</h4>
            <ul>
                <li>Pécs, Hungary  • <em>1999 - 2004</em></li>
            </ul>

        </div>


    </article>
</Layout>)
