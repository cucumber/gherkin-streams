import { createRequire } from 'node:module'
import type { IGherkinOptions } from '@cucumber/gherkin'
import { MessageToNdjsonStream } from '@cucumber/message-streams'
import { IdGenerator } from '@cucumber/messages'
import { Command } from 'commander'

import GherkinStreams from '../GherkinStreams'

// read from package.json at runtime so it stays outside the compiled rootDir
const { version } = createRequire(__filename)('../../package.json')

const program = new Command()
program.version(version)
program.option('--no-source', 'Do not output Source messages')
program.option('--no-ast', 'Do not output GherkinDocument messages')
program.option('--no-pickles', 'Do not output Pickle messages')
program.option('--predictable-ids', 'Use predictable ids', false)
program.parse(process.argv)
const paths = program.args

const options: IGherkinOptions = {
  defaultDialect: 'en',
  includeSource: program.opts().source,
  includeGherkinDocument: program.opts().ast,
  includePickles: program.opts().pickles,
  newId: program.opts().predictableIds ? IdGenerator.incrementing() : IdGenerator.uuid(),
}

GherkinStreams.fromPaths(paths, options).pipe(new MessageToNdjsonStream()).pipe(process.stdout)
