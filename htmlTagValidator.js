var htmlTagValidator = function() {
  var startingTagFirstChar = "<",
      startingTagLastChar = ">",
      closingTagSecondChar = "/",
      selfClosingTagSecondToLastChar = "/",
      commentSecondCharacter = "!",
      doctypeSecondCharacterPattern = new RegExp("[dD]"),
      startTagPattern = new RegExp("[a-z0-9-]"),
      commentPattern = new RegExp("^<!--.*-->"),
      doctypePattern = new RegExp("^<!doctype\s.*", "i");
  
  var parserFunc, previousParserFunc, currentTagName, startingTags, characterIndex;

  var selfClosing = [
  	"area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]

  var ignoreWithin = [
  	"pre",
  	"code",
  	"textarea",
  	"script"
  ]

  var tagObject = function(lIndex, cIndex) {
  	return {name: currentTagName, line: lIndex + 1, char: cIndex};
  }
  
  var throwEndingTagError = function(tagObj) {
    var newError = new Error("Ending tag not found for: " + tagObj.name + " at line: " + tagObj.line + " char: " + tagObj.char)
    newError.lineData = tagObj;
    throw newError;
  }
  
  var throwEndingCommentError = function(commentObj) {
    var newError = new Error("Comment ending not found for: `comment` at line: " + commentObj.line + " char: " + commentObj.char)
    newError.lineData = commentObj;
    throw newError;
  }
  
  var setParserFunc = function(func) {
    previousParserFunc = parserFunc;
    parserFunc = func;
  }
  
  var goBackNumChars = function(num) {
    characterIndex -= num;
  }

  var startingTagNameFinder = function startingTagNameFinder(character, lIndex, cIndex) {
  	if(startTagPattern.test(character)) {
  		currentTagName += character
  	} else if(character === closingTagSecondChar) {
      setParserFunc(endingTagNameFinder);
    } else if(character === commentSecondCharacter) {
      currentTagName = ""
      setParserFunc(commentOrDoctypeFinder);
  	} else if(selfClosing.indexOf(currentTagName) >= 0){
      setParserFunc(startingTagBeginningFinder);
    } else {
  		tagObj = tagObject(lIndex, cIndex)
  		startingTags.push(tagObj)
  	  
      if(ignoreWithin.indexOf(currentTagName) >= 0){
        currentTagName = "";
        goBackNumChars(1)
        setParserFunc(ignoredWithinEndingTagStartFinder);
      } else {
        currentTagName = "";
        goBackNumChars(1);
        setParserFunc(startingTagEndingFinder);
      }
  	}
  }

  var startingTagEndingFinder = function startingTagEndingFinder(character, lIndex, cIndex) {
  	if(character === startingTagLastChar) {
      setParserFunc(endingTagBeginningFinder);
  	}
  }

  var startingTagBeginningFinder = function startingTagBeginningFinder(character, lIndex, cIndex) {
  	if(character === startingTagFirstChar) {
      setParserFunc(startingTagNameFinder);
  	}
  }

  var endingTagNameFinder = function endingTagNameFinder(character, lIndex, cIndex) {
  	if(startTagPattern.test(character)) {
  		currentTagName += character
  	} else {
  		var lastStartTag = startingTags.pop();

  		if(lastStartTag.name === currentTagName) {
        setParserFunc(startingTagBeginningFinder);
  		} else {
        throwEndingTagError(lastStartTag)
  		}
  		currentTagName = ""
  	}
  }

  var endingTagSlashFinder = function endingTagSlashFinder(character, lIndex, cIndex) {
  	if(character === closingTagSecondChar) {
      setParserFunc(endingTagNameFinder);
  	} else {
  		// startingTagNameFinder(character, lIndex, cIndex);
      goBackNumChars(1)
      setParserFunc(startingTagNameFinder);
  	}
  }

  var endingTagBeginningFinder = function endingTagBeginningFinder(character, lIndex, cIndex) {
  	if(character === startingTagFirstChar) {
      setParserFunc(endingTagSlashFinder);
  	}
  }
  
  // Ignore with ignored tag list ex. pre, script, code
  var ignoredWithinEndingTagStartFinder = function ignoredWithinEndingTagStartFinder(character, lIndex, cIndex) {
    if(character === startingTagFirstChar) {
      setParserFunc(ignoredWithinEndingTagSlashFinder);
    }
  }
  
  var ignoredWithinEndingTagSlashFinder = function ignoredWithinEndingTagSlashFinder(character, lIndex, cIndex) {
    if(character === closingTagSecondChar) {
      setParserFunc(ignoredWithinEndingTagNameFinder);
    }
  }
  
  var ignoredWithinEndingTagNameFinder = function ignoredWithinEndingTagNameFinder(character, lIndex, cIndex) {
    if(startTagPattern.test(character)) {
      currentTagName += character
    } else {
      var lastStartTag = startingTags.pop();

      if(lastStartTag.name === currentTagName) {
        setParserFunc(startingTagBeginningFinder);
      } else {
        throwEndingTagError(lastStartTag)
      }
      currentTagName = ""
    }
  }
  
  var commentOrDoctypeFinder = function commentOrDoctypeFinder(character, lIndex, cIndex) {
    console.log("")
    if (doctypeSecondCharacterPattern.test(character)) {
      currentTagName = ""
      setParserFunc(startingTagBeginningFinder)
    } else {
      goBackNumChars(1);
      setParserFunc(commentFinder)
    }
  }
  
  var currentComment;
  var resetCurrentComment = function(lIndex, cIndex){
    currentComment = {content: "<!", line: lIndex + 1, char: cIndex - 1, name: "comment"}
  }

  // comment finding
  // (<!) - These have already been found on the way to this function
  // the remaining comment should look something like: -- some commment -->
  var commentFinder = function commentFinder(character, lIndex, cIndex) {
    if(!currentComment) {
      resetCurrentComment(lIndex, cIndex);
    }
    
    currentComment.content += character;  

    if(commentPattern.test(currentComment.content)) {
      currentComment = null;
      setParserFunc(startingTagBeginningFinder);
    }
  }

  var checkTags = function(string) {
    var lines = string.split("\n");
    setParserFunc(startingTagBeginningFinder);
    currentTagName = "";
    startingTags = [];
    currentComment = null;
  	
  	for(var lineIndex=0, l = lines.length; lineIndex < l; lineIndex++) {
  		for(characterIndex=0, ll=lines[lineIndex].length; characterIndex < ll; characterIndex++) {
  			if(!parserFunc) {break;}

  			parserFunc(lines[lineIndex][characterIndex], lineIndex, characterIndex)
  		}
  	}
  	
    if(currentComment) {
      throwEndingCommentError(currentComment);
    } else if(startingTags.length > 0) { 
  		var lastStartTag = startingTags[startingTags.length - 1];
  		throwEndingTagError(lastStartTag);
  	}
  }

  return checkTags;
}

if(module && module.exports) {
  module.exports = htmlTagValidator()
} else {
  window.htmlTagValidator = htmlTagValidator();
}
