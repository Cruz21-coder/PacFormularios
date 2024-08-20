window.onload = function() {
    const form = document.getElementById('miFormulario');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        const existingPdfBytes = await fetch('src/ejemplo1.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const { width, height } = firstPage.getSize();
        const fontSize = 12;

        firstPage.drawText(nombre, { x: 100, y: height - 100, size: fontSize });
        firstPage.drawText(email, { x: 100, y: height - 120, size: fontSize });
        firstPage.drawText(mensaje, { x: 100, y: height - 140, size: fontSize });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FormularioPremo.pdf';
        a.click();
    });
};