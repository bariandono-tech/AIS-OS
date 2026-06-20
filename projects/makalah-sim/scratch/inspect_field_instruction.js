const docx = require('docx');

// Let's create an instance of TableOfContents with different properties and print their XML representation
// to see how it maps.
const doc = new docx.Document({
    sections: [{
        children: [
            new docx.TableOfContents("TOC", {
                hyperlink: true,
                headingStyleRange: "1-3",
                stylesWithLevels: [
                    { styleName: "CaptionFigure", level: 1 }
                ]
            })
        ]
    }]
});

docx.Packer.toXml(doc).then((xml) => {
    // Let's print the XML around w:instrText
    console.log("XML Output:");
    const match = xml.match(/<w:instrText[^>]*>(.*?)<\/w:instrText>/g);
    if (match) {
        match.forEach((m) => console.log("  " + m));
    } else {
        console.log("No w:instrText found. Full XML snippet:");
        console.log(xml.substring(0, 1000));
    }
});
