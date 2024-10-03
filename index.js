window.onload = function() {
    const form = document.getElementById('miFormulario');

    document.querySelectorAll('input[name="tipo_solicitante"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'fisica' || this.value === 'fisica_actividad_empresarial') {
                document.getElementById('representante_legal').style.display = 'none';
                document.getElementById('firma_electronica').style.display = 'block';
            } else if (this.value === 'moral') {
                document.getElementById('representante_legal').style.display = 'block';
                document.getElementById('firma_electronica').style.display = 'none';
            }
        });
    });

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
                const fontSize = 12;

                // Obtener las coordenadas por página
                const coordenadas = coordenadasCallback(pages);

                // Recorrer las páginas y agregar texto donde corresponda
                pages.forEach((page, pageIndex) => {
                    const { width, height } = page.getSize();

                    if (coordenadas[pageIndex]) {
                        Object.keys(coordenadas[pageIndex]).forEach(key => {
                            if (data[key]) {
                                page.drawText(data[key], { 
                                    x: coordenadas[pageIndex][key].x, 
                                    y: height - coordenadas[pageIndex][key].y, 
                                    size: fontSize 
                                });
                            }
                        });
                    }
                });

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

        // Define coordenadas de los PDFs por página
        const coordenadasCreditoPF = (pages) => ({
            0: { // Página 1
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            },
            1: { // Página 2
                nombre: { x: 100, y: 300 },  
                rfc: { x: 100, y: 320 }
            }
            // Agrega más páginas según sea necesario
        });

        const coordenadasCreditoPFAE = (pages) => ({
            0: { 
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            },
            1: { 
                nombre: { x: 120, y: 300 },  
                rfc: { x: 120, y: 320 }
            }
        });

        const coordenadasCreditoPM = (pages) => ({
            0: { 
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            },
            2: { // Página 3
                nombre: { x: 110, y: 330 },  
                rfc: { x: 110, y: 350 }
            }
        });

        const coordenadasCreditoTradicional = (pages) => ({
            0: { 
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            }
        });

        // Generar PDF según el tipo de solicitante
        const opcionPersona = data.tipo_solicitante;

        if (opcionPersona === 'fisica') {
            
        } else if (opcionPersona === 'fisica_actividad_empresarial') {
            
        } else if (opcionPersona === 'moral') {
            
        }

        // Generar PDF común
        await generateAndDownloadPdf('src/negocios/CreditoPF_EFirma.pdf', 'NegociosCreditoPF.pdf', coordenadasCreditoPF, data);
        await generateAndDownloadPdf('src/negocios/CreditoPFAE_EFirma.pdf', 'NegociosCreditoPFAE.pdf', coordenadasCreditoPFAE, data);
        await generateAndDownloadPdf('src/negocios/CreditoPM_EFirma.pdf', 'NegociosCreditoPM.pdf', coordenadasCreditoPM, data);
        await generateAndDownloadPdf('src/negocios/CreditoTradicional.pdf', 'NegociosCreditoTradicional.pdf', coordenadasCreditoTradicional, data);
    });
};

/*window.onload = function() {
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

                if (fileName === 'AspiriaSolicitudCredito.pdf') {
                    console.log("Aplicando condicionales específicas para AspiriaSolicitudCredito");

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

        const coordenadasAspiriaCredito = (height) => ({
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

        const coordenadasAspiriaFisica = (height) => ({
            nombrelegal: { x: 138, y: height - 229 },
            rfclegal: { x: 78, y: height - 249 },
            domiciliodomicilio: { x: 95, y: height - 268 },
            coloniadomicilio: { x: 90, y: height - 288 },
            municipiodomicilio: { x: 96, y: height - 306 },
            estadodomicilio: { x: 295, y: height - 306 },
            cpdomicilio: { x: 485, y: height - 306 },
            telefonodomicilio: { x: 103, y: height - 325 }
        });

        const coordenadasHousolFisico = (height) => ({
            fechalegal:{ x: 138, y: height - 229 },
            nombrelegal: { x: 138, y: height - 229 }
        });

        const coordenadasHousolMoral = (height) => ({
            fechalegal:{ x: 138, y: height - 229 },
            nombrelegal: { x: 138, y: height - 229 },
            nombrelegal: { x: 138, y: height - 229 }
        });

        const opcionPersona = data.opcionpersona;

        if (opcionPersona === 'fisica') { // Persona Física
            await generateAndDownloadPdf('src/aspiria/AspiriaFisica.pdf', 'AspiriaPersonaFisica.pdf', coordenadasAspiriaFisica, data);
            await generateAndDownloadPdf('src/housol/HousolFisica.pdf', 'HousolPersonaFisica.pdf', coordenadasHousolFisico, data);
        } else if (opcionPersona === 'moral') { // Persona Moral
            await generateAndDownloadPdf('src/housol/HousolMoral.pdf', 'HousolPersonaMoral.pdf', coordenadasHousolMoral, data);
        } else if (opcionPersona === 'fisiactiviades') { // Persona Física con Actividades Empresariales
            await generateAndDownloadPdf('src/aspiria/AspiriaCredito.pdf', 'AspiriaSolicitudCredito.pdf', coordenadasAspiriaCredito, data);
        }
    });
};*/

