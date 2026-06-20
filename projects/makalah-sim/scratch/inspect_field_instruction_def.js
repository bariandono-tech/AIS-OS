const docx = require('docx');
console.log("FieldInstruction source:");
// Print the string representation of FieldInstruction constructor or class
if (docx.FieldInstruction) {
    console.log(docx.FieldInstruction.toString());
} else {
    // If not directly exported, find it or check what properties are available
    console.log("FieldInstruction not directly exported");
}

// Let's also check if docx has TableOfContents options types
// We can check docx exports
console.log("\ndocx exports containing TableOfContents:");
console.log(Object.keys(docx).filter(k => k.includes("TOC") || k.includes("TableOfContents") || k.includes("Field")));
