const isLeftParenthesis = ch => ch == "{";
const isRightParenthesis = ch => ch == "}";

const Token = (type, value) => ({ type, value });

const tokenzier = (result, char) => {
  if (isLeftParenthesis(char)) {
    return result.concat(Token("Left Parenthesis"));
  }

  if (isRightParenthesis(char)) {
    return result.concat(Token("Right Parenthesis"));
  }

  return result.concat(Token("Character", char));
};

function parseParenthesis(tokens) {
  let collection = [];
  let branching = false;
  let branch = [];
  for (let token of tokens) {
    if (token.type === "Left Parenthesis") {
      branching = true;
      branch = [];
      continue;
    }

    if (token.type === "Right Parenthesis") {
      branching = false;
      collection.push({ type: "Statement", value: [].concat(branch) });
      continue;
    }

    if (branching) {
      branch.push(token);
    }

    if (!branching) {
      collection.push(token);
    }
  }
  return collection;
}

function parseCharacters(tokens) {
  let string = "";
  let concat = false;
  const collection = [];
  for (let token of tokens) {
    if (token.type === "Character") {
      concat = true;
      string = string + token.value;
    }

    if (token.type !== "Character" && concat) {
      collection.push(Token("String", string));
      string = "";
      concat = false;
    }

    if (token.type !== "Character") {
      collection.push(token);
    }
  }
  if (concat && string != "") {
    collection.push(Token("String", string));
  }
  return collection;
}

function parseStatement(token) {
  const string = Token(
    "String",
    token.value.map(token => token.value).join("")
  );

  let matchData = string.value.match(/if (.*)/);

  if (matchData) {
    return {
      type: "Operator",
      value: "If",
      arguments: [matchData[1]]
    };
  }

  matchData = string.value.match(/else/);

  if (matchData) {
    return {
      type: "Operator",
      value: "Else"
    };
  }

  matchData = string.value.match(/\/if/);

  if (matchData) {
    return {
      type: "Operator",
      value: "End If"
    };
  }

  matchData = string.value.match(/foreach (.*) as (.*), (.*)/);

  if (matchData) {
    return {
      type: "Operator",
      value: "Foreach",
      arguments: matchData.slice(1)
    };
  }

  matchData = string.value.match(/\/foreach/);

  if (matchData) {
    return {
      type: "Operator",
      value: "End Foreach"
    };
  }

  matchData = string.value.match(/(.*)\[(.*)\]/);

  if (matchData) {
    return {
      type: "Operator",
      value: "Lookup",
      arguments: matchData.slice(1)
    };
  }

  return {
    type: "Variable",
    value: string.value
  };
}

function parseStatements(tokens) {
  return tokens.map(token => {
    if (token.type === "Statement") {
      return parseStatement(token);
    }

    return token;
  });
}

function mergeParenthesis(tokens) {
  const collection = [];
  let previous, current, next;

  for (let i = 0; i < tokens.length; i++) {
    previous = tokens[i - 1];
    current = tokens[i];
    next = tokens[i + 1];

    if (current.type === "Left Parenthesis") {
      if (next.type !== "Left Parenthesis") {
        collection.push(current);
      }
    }

    if (current.type === "Right Parenthesis") {
      if (previous.type !== "Right Parenthesis") {
        collection.push(current);
      }
    }

    if (
      current.type !== "Right Parenthesis" &&
      current.type !== "Left Parenthesis"
    ) {
      collection.push(current);
    }
  }

  return collection;
}


var sax = require("sax"),
  strict = false, // set to false for html-mode
  parser = sax.parser(strict, { lowercase: true, trim: false });

const tokenizeZepher = zephyrTemplate => {
  return new Promise((resolve, reject) => {
    let collection = []
    let selfClosing = false
    let tag = {}

    parser.ontext = function (t) {
      let result
      if (tag.name === 'style') {
        result = [Token("String", t)]
      } else {
        const chars = t.split("");
        const tokens = mergeParenthesis(chars.reduce(tokenzier, []));
        result =  parseStatements(parseCharacters(parseParenthesis(tokens)));
      }
      result.forEach(x => x.parent = tag)
      collection = collection.concat(result)
    };

    parser.onopentag = function (t) {
      tag = t
      const attr = Object.keys(t.attributes).map(function(key, index) {
        const chars = t.attributes[key].split("");
        const tokens = mergeParenthesis(chars.reduce(tokenzier, []));
        result =  parseStatements(parseCharacters(parseParenthesis(tokens)));
        return { key, value: result }
      });

      if (t.isSelfClosing) {
        collection.push(Token("Tag", { name: t.name, isSelfClosing: true, attr } ))
        selfClosing = t.name
      } else {
        collection.push(Token("Tag", { name: t.name, isSelfClosing: false, attr }))
        selfClosing = null
      }
    }

    parser.onclosetag = function (t) {
      if (t === selfClosing) {
        return
      }
      collection.push(Token("Closing Tag", t))
      tag = {}
    }

    parser.ondoctype = function(t) {
      collection.push(Token("String", `<!DOCTYPE${t}>`))
    }

    parser.oncomment = function(t) {
      collection.push(Token("String", `<!--${t}-->`))
    }

    parser.onend = function () {
      resolve(collection)
    }

    parser.write(zephyrTemplate).close();
  })
};

const parse = sailthruTemplate => {
  return tokenizeZepher(sailthruTemplate);
};

module.exports = {
  parse
};
