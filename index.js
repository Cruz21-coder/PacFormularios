window.onload = function() {
    const form = document.getElementById('miFormulario');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const generateAndDownloadPdf = async (pdfFile, fileName, coordenadasCallback, data) => {
            try {
                console.log(`Generando PDF para: ${fileName}`);

                const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
                const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
                const pages = pdfDoc.getPages();
                const firstPage = pages[0];
                const { width, height } = firstPage.getSize();
                const fontSize = 12;

                const coordenadas = coordenadasCallback(height);

                Object.keys(coordenadas).forEach(key => {
                    if (data[key]) {
                        firstPage.drawText(data[key], { 
                            x: coordenadas[key].x, 
                            y: coordenadas[key].y, 
                            size: fontSize 
                        });
                    }
                });

                if (fileName === 'AspiraSolicitudCredito.pdf') {
                    console.log("Aplicando condicionales específicas para Aspiria");

                    if (data.opcionpersona === 'opcion1') {
                        firstPage.drawText('X', { x: 105, y: height - 184, size: fontSize });
                    } else if (data.opcionpersona === 'opcion2') {
                        firstPage.drawText('X', { x: 225, y: height - 184, size: fontSize });
                    }

                    if (data.tipodomicilio === 'rento') {
                        firstPage.drawText('X', { x: 340, y: height - 310, size: fontSize });
                    } else if (data.tipodomicilio === 'propio') {
                        firstPage.drawText('X', { x: 440, y: height - 310, size: fontSize });
                    }

                    if (data.tiponegocio === 'rento') {
                        firstPage.drawText('X', { x: 515, y: height - 382, size: fontSize });
                    } else if (data.tiponegocio === 'propio') {
                        firstPage.drawText('X', { x: 95, y: height - 396, size: fontSize });
                    }
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                console.log(`Descarga completa para: ${fileName}`);
            } catch (error) {
                console.error(`Error generando PDF para: ${fileName}`, error);
            }
        };

        const coordenadasAspiria = (height) => ({
            monto: { x: 85, y: height - 120 },
            promocode: { x: 353, y: height - 120 },
            nombrelegal: { x: 93, y: height - 170 },
            emaillegal: { x: 330, y: height - 170 },
            fechalegal: { x: 175, y: height - 199 },
            lugarlegal: { x: 250, y: height - 199 },
            rfclegal: { x: 75, y: height - 212 },
            curplegal: { x: 330, y: height - 212 },
            civil: { x: 105, y: height - 227 },
            regimen: { x: 385, y: height - 227 },
            cpdomicilio: { x: 73, y: height - 281 },
            domiciliodomicilio: { x: 258, y: height - 281 },
            coloniadomicilio: { x: 427, y: height - 281 },
            ciudaddomicilio: { x: 88, y: height - 295 },
            municipiodomicilio: { x: 258, y: height - 295 },
            estadodomicilio: { x: 425, y: height - 295 },
            tiempodomicilio: { x: 142, y: height - 310 },
            telefonodomicilio: { x: 500, y: height - 310 },
            nombrenegocio: { x: 141, y: height - 353 },
            cpnegocio: { x: 295, y: height - 353 },
            domicilionegocio: { x: 437, y: height - 353 },
            colonianegocio: { x: 90, y: height - 367 },
            ciudadnegocio: { x: 308, y: height - 367 },
            municipionegocio: { x: 438, y: height - 367 },
            estadonegocio: { x: 89, y: height - 382 },
            tiemponegocio: { x: 361, y: height - 382 },
            telefononegocio: { x: 293, y: height - 396 },
            anosfuncionamiento: { x: 141, y: height - 440 },
            recursofuncionamiento: { x: 420, y: height - 440 },
            ingresfuncionamiento: { x: 122, y: height - 454 },
            actividadfuncionamiento: { x: 402, y: height - 454 },
            banco: { x: 90, y: height - 502 },
            clabeinterbancaria: { x: 402, y: height - 502 },
            nombrefamiliar1: { x: 98, y: height - 608 },
            parentescofamiliar1: { x: 360, y: height - 608 },
            telefonofamiliar1: { x: 73, y: height - 623 },
            nombrefamiliar2: { x: 98, y: height - 653 },
            parentescofamiliar2: { x: 360, y: height - 653 },
            telefonofamiliar2: { x: 73, y: height - 668 }
        });

        const coordenadasPremo = (height) => ({
            monto: { x: 85, y: height - 120 },
            nombrelegal: { x: 60, y: height - 455 },
            rfclegal: { x: 90, y: height - 403 },
            domiciliodomicilio: { x: 100, y: height - 385 }
        });

        await Promise.all([
            generateAndDownloadPdf('src/aspiria/SolicituddeCredito.pdf', 'AspiraSolicitudCredito.pdf', coordenadasAspiria, data),
            generateAndDownloadPdf('src/premo/FormatoautorizacionBuroPREMOSFP.pdf', 'FormularioPremo.pdf', coordenadasPremo, data)
        ]);
    });
};

