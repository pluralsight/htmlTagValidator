var expect = require('chai').expect,
    fs = require('fs'),
    htmlParser = require('./htmlParser');

var validateHtml = function(path) {
  var html = fs.readFileSync(__dirname + path, 'utf8');
  try {
    return htmlParser.parse(html);
  }catch(e) {
    console.log(e)
    throw e
  }
}



describe('pegParser', function() {
  describe('with a single html element with missing closing tag', function() {
    it('raises an error', function() {
      console.log(validateHtml('/testHtml/basicDiv.html'))
      expect(function(){ validateHtml('/testHtml/basicDiv.html')}).to.throw(Error)
    });

    // describe("error data", function() {
    //   it("contains line data", function() {
    //      var errorData = validateHtmlReturnData('/testHtml/basicDiv.html');
    //
    //      expect(errorData).to.have.property('line', 1);
    //      expect(errorData).to.have.property('char', 4);
    //      expect(errorData).to.have.property('name', "div");
    //   });
    // });
  });
});