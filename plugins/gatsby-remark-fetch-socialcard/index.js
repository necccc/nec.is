const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const sh = require('shelljs');

const writeFile = promisify(fs.writeFile)

module.exports = async ({ markdownNode }) => {
  const post = markdownNode.frontmatter;

  if (process.env.NODE_ENV === 'production') return;

  if (markdownNode.fields) {
    const output = path.join(
      './public/social',
      `${markdownNode.fields.slug.replace(/\//gi, '')}.json`
    )

    const socialCardData = {
      id: markdownNode.fields.socialCardId,
      title: post.title,
      text: (post.date && moment(post.date).format('MMM Do, YYYY')) || '',
      colors: {
        title: '#FFF',
        text: '#DDD',
        logo: '#FFF'
      }
    }

    if (post.image) {
      socialCardData.image = {
        url: post.image,
        x: post.imageXoffset || 0,
        y: post.imageYoffset || 0,
        width: '100%'
      }
    }

    try {
      sh.mkdir('-p', './public/social')
      await writeFile(output, JSON.stringify(socialCardData))
    } catch(e) {
      console.error(e)
    }
  }
};
