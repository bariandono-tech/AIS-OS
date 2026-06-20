const docx = require('docx');
const fs = require('fs');

const doc = new docx.Document({
    sections: [{
        children: [
            new docx.TableOfContents("TOC", {
                hyperlink: true,
                stylesWithLevels: [
                    { styleName: "CaptionFigure", level: 1 }
                ]
            })
        ]
    }]
});

docx.Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("scratch/test_toc.docx", buffer);
    console.log("Written scratch/test_toc.docx");
});
