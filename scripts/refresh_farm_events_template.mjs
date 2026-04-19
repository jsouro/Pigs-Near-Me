import fs from 'node:fs'
import path from 'node:path'

const repoEventsPath = path.resolve('events.json')
const publicEventsPath = path.resolve('public', 'events.json')

console.log('Farm event refresh template')
console.log('Repo feed:', repoEventsPath)
console.log('Public feed:', publicEventsPath)
console.log('')
console.log('What this script is for:')
console.log('- run once a day from your own cron or scheduler')
console.log('- check public Facebook event listings when accessible')
console.log('- use Google search to discover missing Metro Detroit farm events')
console.log('- write the normalized feed to both events.json and public/events.json')
console.log('')
console.log('Suggested event fields:')
console.log('- name')
console.log('- date')
console.log('- time')
console.log('- location')
console.log('- description')
console.log('- url')
console.log('- sourceType (facebook | google)')
console.log('- sourceLabel')
console.log('')
console.log('Recommended next implementation steps:')
console.log('1. Load both existing feed files.')
console.log('2. Pull public Facebook event info where visible.')
console.log('3. Run Google searches for Metro Detroit farm events and official event pages.')
console.log('4. Normalize and deduplicate events by name + date + location.')
console.log('5. Update lastUpdated and refreshNotes.')
console.log('6. Rewrite both JSON files.')
console.log('7. Commit and push the refreshed feed.')
console.log('')

for (const target of [repoEventsPath, publicEventsPath]) {
  if (!fs.existsSync(target)) {
    console.error('Missing feed file:', target)
    process.exit(1)
  }
}

console.log('Template ready. Replace this scaffold with your actual refresh logic.')
