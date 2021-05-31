const _ = require('lodash')

var branch = 'Bsms Physics'
var res = _.camelCase(branch)
var result = res.replace(/([A-Z])/g, " $1");
var branch_sliced = result.charAt(0).toUpperCase() + result.slice(1);

console.log(branch_sliced)
console.log(res)