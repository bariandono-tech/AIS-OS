const docx = require('docx');
console.log("TableOfContents class:");
console.log(docx.TableOfContents.toString());

// Let's inspect the constructor or prototype
const proto = docx.TableOfContents.prototype;
console.log("\nPrototype properties:");
console.log(Object.getOwnPropertyNames(proto));
