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
            operator: 'Between',
            value: [0,35.0],
            path: "$.data.dataReading.Temperature.value"
          }        ]          
    },
    // define the 'event' that will fire when the condition evaluates truthy
    event: {
      "type" : "message",
      params: {
        score: 3,
        dataTypeID : "TempDTID"
      }
    }
  })

  engine.addRule({
    // define the 'conditions' for when "hello world" should display
    conditions: {
      all: [{
          fact: 'displayMessage',
          operator: 'Between',
          value: [39.1,999],
          path: "$.data.dataReading.Temperature.value"
        }        ]     
    },
    // define the 'event' that will fire when the condition evaluates truthy
    event: {
      "type" : "message",
      params: {
        score: 2,
        dataTypeID : "TempDTID"
      }
    }
  })

  engine.addRule({
    // define the 'conditions' for when "hello world" should display
    conditions: {
        any: [{
            fact: 'displayMessage',
            operator: 'Between',
            value: [35.1,36],
            path: "$.data.dataReading.RespRate.value"
          },  
          {
              fact: 'displayMessage',
              operator: 'Between',
              value: [38.1,39],
              path: "$.data.dataReading.RespRate.value"
            }
          ]
    },
    // define the 'event' that will fire when the condition evaluates truthy
    event: {
      "type" : "message",
      params: {
        score: 1,
        dataTypeID : "TempDTID"
      }
    }
  })

  engine.addRule({
    // define the 'conditions' for when "hello world" should display
    conditions: {
      all: [{
          fact: 'displayMessage',
          operator: 'Between',
          value: [36.1,38],
          path: "$.data.dataReading.Temperature.value"
        }        ]     
    },
    // define the 'event' that will fire when the condition evaluates truthy
    event: {
      "type" : "message",
      params: {
        score: 0,
        dataTypeID : "TempDTID"
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
      "data": {
        "dataReading": {
          "RespRate": {
            "value": 10,
            "unmeasurable": ""
          },
          "Temperature": {
            "unmeasurable": "",
            "value": 41.2
          },
          "consciousness": {
            "value": "A",
            "unmeasurable": ""
          }          
        }
      }
    }
  }

  // engine.run() evaluates the rule using the facts provided
  const { events } = await engine.run(facts)

  events.map(event => console.log('Contributing Data Type ID ' + event.params.dataTypeID + ' score- ' +  event.params.score))
}

start()
/*
 * OUTPUT:
 *
 * hello-world!
 */
