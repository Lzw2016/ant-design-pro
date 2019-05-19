import React, { Fragment } from 'react';

const TypeEnum = {
  string: "string",
  number: "number",
  object: "object",
  array: "array",
  function: "function",
  null: "null",
  boolean: "boolean",
  symbol: "symbol",
  json: "json",
  math: "math",
  regexp: "regexp",
  date: "date",
  undefined: "undefined",
  nan: "nan",
  reactNode: "reactnode",
};

const varTypeOf = (object) => {
  const typeStr = Object.prototype.toString.call(object);
  let typeName;
  switch (`${typeStr}`.toLowerCase()) {
    case '[object string]':
      typeName = TypeEnum.string;
      break;
    case '[object number]':
      if (Number.isNaN(object)) {
        return TypeEnum.nan;
      }
      typeName = TypeEnum.number;
      break;
    case '[object object]':
      // console.log("object.$$typeof", !!object.$$typeof, object.props);
      if (object.$$typeof && object.props) {
        const type = varTypeOf(object.$$typeof);
        if (type === TypeEnum.symbol || type === TypeEnum.reactNode) {
          return TypeEnum.reactNode;
        }
      }
      typeName = TypeEnum.object;
      break;
    case '[object array]':
      typeName = TypeEnum.array;
      break;
    case '[object function]':
      typeName = TypeEnum.function;
      break;
    case '[object null]':
      typeName = TypeEnum.null;
      break;
    case '[object boolean]':
      typeName = TypeEnum.boolean;
      break;
    case '[object date]':
      typeName = TypeEnum.date;
      break;

    // 不常用
    case '[object symbol]':
      typeName = TypeEnum.symbol;
      break;
    case '[object json]':
      typeName = TypeEnum.json;
      break;
    case '[object math]':
      typeName = TypeEnum.math;
      break;
    case '[object regexp]':
      typeName = TypeEnum.regexp;
      break;

    // 貌似不会走的分支
    case '[object undefined]':
      typeName = TypeEnum.undefined;
      break;

    // 无法识别
    default:
      if (object === undefined) {
        return TypeEnum.undefined;
      }
      // eslint-disable-next-line no-console
      console.log("varTypeOf -> ", object, " | -> ", typeStr, " | ", `${typeStr}`.toLowerCase())
      typeName = TypeEnum.object;
  }
  return typeName;
};

/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable symbol-description */
const varTypeOfTest = () => {
  console.log(varTypeOf("1"));                        // string
  console.log(varTypeOf(1));                          // number
  console.log(varTypeOf({}));                         // object
  console.log(varTypeOf([]));                         // array
  console.log(varTypeOf(function () { }));            // function
  console.log(varTypeOf(() => { }));                  // function
  console.log(varTypeOf(null));                       // null
  console.log(varTypeOf(true));                       // boolean
  console.log(varTypeOf(Symbol()));                   // symbol
  console.log(varTypeOf(JSON));                       // json
  console.log(varTypeOf(Math));                       // math
  console.log(varTypeOf(RegExp()));                   // regexp
  console.log(varTypeOf(new Date()));                 // date
  console.log(varTypeOf(undefined));                  // undefined
  console.log(varTypeOf());                           // undefined
  console.log(varTypeOf(NaN));                        // nan
  console.log(varTypeOf(<div>123</div>));             // reactnode
  console.log(varTypeOf(<div />));                    // reactnode
  console.log(varTypeOf(<div><span>1</span></div>));  // reactnode
  console.log(varTypeOf(<div>1<span>2</span></div>)); // reactnode
  console.log(varTypeOf(<Fragment><div>1</div><span>2</span></Fragment>)); // reactnode
  console.log("----------------------------------");
  // console.log("<div>123</div>", <div>123</div>);
  // console.log("<div />", <div />);
  // console.log("<div><span>1</span></div>", <div><span>1</span></div>);
  // console.log("<div>1<span>2</span></div>", <div>1<span>2</span></div>);
  // console.log("<Fragment><div>1</div><span>2</span></Fragment>", <Fragment><div>1</div><span>2</span></Fragment>);
}

export {
  TypeEnum,
  varTypeOf,
  varTypeOfTest,
};
