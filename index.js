const { parse } = require('url')
const microCors = require('micro-cors')
const whois = require('whois')
const { send } = require('micro')

const parseWhoIsData = function (data) {
  var attr
  var attrColon
  var tempStr = ''
  var returnArray = []

  data.split('\n').forEach(function (part) {
    if (!part) return

    attrColon = part.indexOf(': ')
    attr = part.substr(0, attrColon)

    if (attr !== '') {
      returnArray.push({
        'attribute': attr,
        'value': part.substr(attrColon + 1).trim()
      })
    } else {
      tempStr += part.substr(attrColon + 1).trim() + '\n'
    }
  })

  returnArray.push({
    'attribute': 'End Text',
    'value': tempStr
  })

  return returnArray
}

const whoIs = (request, response) => {
  const { query } = parse(request.url, true)
  whois.lookup(query.whois, function (err, data) {
    if (err) { return }
    send(response, 200, parseWhoIsData(data))
  })
}

const cors = microCors({allowMethods: ['GET']})
module.exports = cors(whoIs)
