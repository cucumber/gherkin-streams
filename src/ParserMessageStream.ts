import { Transform, type TransformCallback } from 'node:stream'
import { generateMessages, type IGherkinOptions } from '@cucumber/gherkin'
import type * as messages from '@cucumber/messages'

/**
 * Stream that reads Source messages and writes GherkinDocument and Pickle messages.
 */
export default class ParserMessageStream extends Transform {
  constructor(private readonly options: IGherkinOptions) {
    super({ writableObjectMode: true, readableObjectMode: true })
  }

  public _transform(envelope: messages.Envelope, _encoding: string, callback: TransformCallback) {
    if (envelope.source) {
      const messageList = generateMessages(
        envelope.source.data,
        envelope.source.uri,
        envelope.source.mediaType,
        this.options
      )
      for (const message of messageList) {
        this.push(message)
      }
    }
    callback()
  }
}
