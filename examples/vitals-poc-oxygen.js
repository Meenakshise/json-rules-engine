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
            any: [{
                all: [{
                    fact: 'displayMessage',
                    operator: 'Between',
                    value: [0, 91],
                    path: "$.data.dataReading.oxygenSats.value"
                },
                {
                    fact: 'displayMessage',
                    operator: 'equal',
                    value: "scale1",
                    path: "$.data.dataReading.oxygenSats.scaleType"
                }]
            }, {
                all: [{
                    fact: 'displayMessage',
                    operator: 'Between',
                    value: [0, 83],
                    path: "$.data.dataReading.oxygenSats.value"
                }, {
                    fact: 'displayMessage',
                    operator: 'equal',
                    value: "scale2",
                    path: "$.data.dataReading.oxygenSats.scaleType"
                },
                {
                    fact: 'displayMessage',
                    operator: 'equal',
                    value: "yes",
                    path: "$.data.dataReading.oxygen.onAir"
                }]
            },{
                all: [{
                    any: [{
                        fact: 'displayMessage',
                        operator: 'Between',
                        value: [0, 83],
                        path: "$.data.dataReading.oxygenSats.value"
                    },
                    {
                        fact: 'displayMessage',
                        operator: 'Between',
                        value: [97, 999],
                        path: "$.data.dataReading.oxygenSats.value"
                    }]},
                   { all:[{
                        fact: 'displayMessage',
                        operator: 'equal',
                        value: "scale2",
                        path: "$.data.dataReading.oxygenSats.scaleType"
                    },{
                        fact: 'displayMessage',
                        operator: 'equal',
                        value: "yes",
                        path: "$.data.dataReading.oxygen.onOxygen"
                    },{
                        fact: 'displayMessage',
                        operator: 'equal',
                        value: "no",
                        path: "$.data.dataReading.oxygen.onAir"
                    }]
                }]
            }]
        },
        // define the 'event' that will fire when the condition evaluates truthy
        event: {
            "type": "success",
            params: {
                score: 3
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
                    "oxygenSats": {
                        "value": 98,
                        "scaleType": "scale2"
                    },
                    "oxygen": {
                        "onOxygen": "yes",
                        "onAir": "yes",
                        "selectedMaskID": 5
                    }
                }
            }
        }
    }
    engine.on('success', function(event, almanac, ruleResult) {
        console.log(ruleResult) // { type: 'my-event', params: { id: 1 }
      })

      engine.on('failure', function(event, almanac, ruleResult) {
        console.log(ruleResult) // { type: 'my-event', params: { id: 1 }
      })
    // engine.run() evaluates the rule using the facts provided
    const { events } = await engine.run(facts)
   
    events.map(event => console.log(event.params.score))
}

start()
/*
 * OUTPUT:
 *
 * hello-world!
 */
