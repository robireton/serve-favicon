import crypto from 'node:crypto'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export default class TempIcon {
  constructor () {
    this.data = crypto.pseudoRandomBytes(100)
    this.exists = false
    this.path = join(tmpdir(), `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`)
  }

  unlinkSync () {
    if (this.exists) {
      this.exists = false
      fs.unlinkSync(this.path)
    }
  }

  writeSync () {
    if (this.exists) {
      throw new Error('already written')
    } else {
      fs.writeFileSync(this.path, this.data)
      this.exists = true
    }
  }
}
