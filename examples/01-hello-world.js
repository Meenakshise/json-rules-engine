'use strict'
/*
 * This is the hello-world example from the README.
 *
 * Usage:
 *   node ./examples/01-hello-world.js
 *
 * For detailed output:
 *   DEBUG=json-rules-engine node ./examples/01-hello-world.js
 */

require('colors')
const { get } = require('lodash')
const { Engine } = require('json-rules-engine')

function pathResolver(object, path) {
  // when the rule below is evaluated:
  //   "object" will be the 'fact1' value
  //   "path" will be '.price[0]'
  return get(object, path)
}

async function start() {
  /**
   * Setup a new engine
   */
  const engine = new Engine(undefined, {})

  /**
   * Create a rule
   */
  engine.addRule({
    // define the 'conditions' for when "hello world" should display
    conditions: {
      all: [{
        fact: 'displayMessage',
        operator: 'equal',
        value: "iphone",
       // path: "childobj.phoneNumbers[0].type"
       path: "childobj.phoneNumbers.[?(@.number=='15')].type"
      }]
    },
    // define the 'event' that will fire when the condition evaluates truthy
    event: {
      type: 'message',
      params: {
        data: 'hello-world!'
      }
    }
  })

  /**
   * Define a 'displayMessage' as a constant value
   * Fact values do NOT need to be known at engine runtime; see the
   * 03-dynamic-facts.js example for how to pull in data asynchronously during runtime
   */
  //const facts = { displayMessage: true }

  const facts = {
    displayMessage: {
      "childobj": {
        "age": 15, "phoneNumbers": [
          {
            "type": "iphone",
            "number": 10
          },
          {
            "type": "home",
            "number": 15
          }
        ]
      }
    }
  }

  // engine.run() evaluates the rule using the facts provided
  const { events } = await engine.run(facts)

  events.map(event => console.log(event.params.data.green))
}

start()
/*
 * OUTPUT:
 *
 * hello-world!
 */
