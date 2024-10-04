window.onload = function() {
    const form = document.getElementById('miFormulario');

    /*document.querySelectorAll('input[name="tipo_solicitante"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'fisica' || this.value === 'fisica_actividad_empresarial') {
                document.getElementById('representante_legal').style.display = 'none';
                document.getElementById('firma_electronica').style.display = 'block';
            } else if (this.value === 'moral') {
                document.getElementById('representante_legal').style.display = 'block';
                document.getElementById('firma_electronica').style.display = 'none';
            }
        });
    });*/

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
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

        const generateAndDownloadPdf = async (pdfFile, fileName, coordenadasCallback, data, xCoord) => {
            try {
                const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
                const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
                const pages = pdfDoc.getPages();
        
                const coordenadas = coordenadasCallback(pages);
        
                pages.forEach((page, pageIndex) => {
                    const { width, height } = page.getSize();
        
                    if (coordenadas[pageIndex]) {
                        Object.keys(coordenadas[pageIndex]).forEach(key => {
                            if (data[key]) {
                                page.drawText(data[key], { 
                                    x: coordenadas[pageIndex][key].x, 
                                    y: coordenadas[pageIndex][key].y,
                                    size: 12
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
            } catch (error) {
                console.error(`Error generando PDF para: ${fileName}`, error);
            }
        };

        const coordenadasAspiriaCredito = (pages) => ({
            0: {
                monto: { x: 85, y: 689 },
                promocode: { x: 353, y: 689 },
                nombre: { x: 93, y: 639 },
                email: { x: 330, y: 639 },
                fecha_nacimiento: { x: 175, y: 610 },
                lugar_nacimiento: { x: 250, y: 610 },
                rfc: { x: 75, y: 597 },
                curp: { x: 330, y: 597 },
                estado_civil: { x: 105, y: 582 },
                regimen_matrimonial: { x: 385, y: 582 },
                codigo_postal: { x: 73, y: 528 },
                domicilio: { x: 258, y: 528 },
                colonia: { x: 427, y: 528 },
                ciudad: { x: 88, y: 514 },
                municipio: { x: 258, y: 514 },
                estado: { x: 425, y: 514 },
                tiempo_domicilio: { x: 142, y: 499 },
                telefono: { x: 500, y: 499 },
                nombre_negocio: { x: 141, y: 456 },
                codigo_postal_negocio: { x: 295, y: 456 },
                domicilio_negocio: { x: 437, y: 456 },
                colonia_negocio: { x: 90, y: 442 },
                ciudad_negocio: { x: 308, y: 442 },
                municipio_negocio: { x: 438, y: 442 },
                estado_negocio: { x: 89, y: 427 },
                tiempo_negocio: { x: 361, y: 427 },
                telefono_negocio: { x: 293, y: 413 },
                anos_funcionamiento: { x: 141, y: 369 },
                recurso_funcionamiento: { x: 420, y: 369 },
                ingresos_funcionamiento: { x: 122, y: 355 },
                actividad_funcionamiento: { x: 402, y: 355 },
                banco: { x: 90, y: 307 },
                clabe_interbancaria: { x: 402, y: 307 },
                nombre_familiar1: { x: 98, y: 201 },
                parentesco_familiar1: { x: 360, y: 201 },
                telefono_familiar1: { x: 73, y: 186 },
                nombre_familiar2: { x: 98, y: 156 },
                parentesco_familiar2: { x: 360, y: 156 },
                telefono_familiar2: { x: 73, y: 141 }
            }
        });

        const coordenadasAspiriaFisica = (pages) => ({
            0: {
                nombre: { x: 138, y: 563 },
                rfc: { x: 78, y: 543 },
                domicilio: { x: 95, y: 524 },
                colonia: { x: 90, y: 504 },
                municipio: { x: 96, y: 486 },
                estado: { x: 295, y: 486 },
                codigo_postal: { x: 485, y: 486 },
                telefono: { x: 103, y: 467 } 
            }
        });
        
        const coordenadasHousolFisica = (pages) => ({
            0: { 
                fechag: { x: 120, y: 689 },  
                apellido_paterno: { x: 179, y: 666 },  
                apellido_materno: { x: 305, y: 666 },  
                nombre: { x: 410, y: 666 },  
                fecha_nacimiento:  { x: 90, y: 644},
                pais_nacimiento: { x: 179, y: 644 },
                nacionalidad: { x: 305, y: 644},
                rfc: { x: 411, y: 644},
                curp:  { x: 120, y: 621 },
                actividad_funcionamiento:  { x: 300, y: 621 },
                identificacion:{ x: 120, y: 596 },
                folio_identificacion: { x: 410, y: 596},
                domicilio:  { x: 180, y: 569 },
                numero_exterior: { x: 352, y: 569 },
                numero_interior: { x: 440, y: 569 },
                colonia: { x: 90, y: 547 },
                municipio: { x: 230, y: 547 },
                estado: { x: 410, y: 547 },
                ciudad: { x: 90, y: 524 },
                pais: { x: 230, y: 524 },
                codigo_postal: { x: 352, y: 524 },
                telefono: { x: 440, y: 524 },
                celular: { x: 90, y: 503 },
                telefono2: { x: 290, y:503 },
                extension: { x: 440, y: 503 },
                email: { x: 211, y: 482 }


            }
        });

        const coordenadasHousolMoral = (pages) => ({
            0: { 
                fechag: { x: 120, y: 689 },  
                rfcs: { x: 138, y: 250 },
                fecha_constitucion: { x: 138, y: 250 },
                pais_nacimiento: { x: 179, y: 644 },
                rfc: { x: 138, y: 250 },
                actividad_funcionamiento:  { x: 300, y: 621 },
                fecha_registro:  { x: 300, y: 621 },
                domicilio:  { x: 180, y: 569 },
                numero_exterior: { x: 352, y: 569 },
                numero_interior: { x: 440, y: 569 },
                colonia: { x: 90, y: 547 },
                municipio: { x: 230, y: 547 },
                estado: { x: 410, y: 547 },
                ciudad: { x: 90, y: 524 },
                pais: { x: 230, y: 524 },
                codigo_postal: { x: 352, y: 524 },
                celular: { x: 90, y: 503 },
                telefono: { x: 440, y: 524 },
                telefono2: { x: 290, y:503 },
                extension: { x: 440, y: 503 },
                email: { x: 211, y: 482 },
                


            
                
            }
        });

        const coordenadasCreditoHousolFisica = (pages) => ({
            0: { 
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            }
        });

        const coordenadasCreditoHousolmoral = (pages) => ({
            0: { 
                nombre: { x: 138, y: 229 },  
                rfc: { x: 138, y: 250 }
            }
        });

        const coordenadasCreditoPF = (pages) => ({
            0: {
            },
            2: {
                nombre: { x: 32, y: 482 },
                rfc: { x: 32, y: 433 },
                domicilio: { x: 32, y: 408 },
                colonia: { x: 32, y: 383 },
                municipio: { x: 32, y: 358 },
                estado: { x: 32, y: 334 },
                codigo_postal: { x: 32, y: 309 },
                telefono: { x: 32, y: 285 }
            }
            
        });

        const coordenadasCreditoPFAE = (pages) => ({
            0: { 
            },
            2: { 
                nombre: { x: 32, y: 482 },
                rfc: { x: 32, y: 433 },
                domicilio: { x: 32, y: 408 },
                colonia: { x: 32, y: 383 },
                municipio: { x: 32, y: 358 },
                estado: { x: 32, y: 334 },
                codigo_postal: { x: 32, y: 309 },
                telefono: { x: 32, y: 285 }
            }
        });

        const coordenadasCreditoPM = (pages) => ({
            0: { 
            },
            2: {
                nombre: { x: 32, y: 482 },  
                representante_moral: { x: 32, y: 458 },
                rfc: { x: 32, y: 433 },
                domicilio: { x: 32, y: 408 },
                colonia: { x: 32, y: 383 },
                municipio: { x: 32, y: 358 },
                estado: { x: 32, y: 334 },
                codigo_postal: { x: 32, y: 309 },
                telefono: { x: 32, y: 285 }
            }
        });

        const opcionPersona = data.tipo_solicitante;

        if (opcionPersona === 'fisica') {
            await generateAndDownloadPdf('src/aspiria/AspiriaFisica.pdf', 'AspiriaPersonaFisica.pdf', coordenadasAspiriaFisica, data);
            await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPF.pdf', coordenadasCreditoPF, data);
            await generateAndDownloadPdf('src/housol/HousolFisica.pdf', 'HousolFisica.pdf', coordenadasHousolFisica, data);
            await generateAndDownloadPdf('src/housol/HousolCreditoFisica.pdf', 'HousolCreditoFisica.pdf', coordenadasCreditoHousolFisica, data);
        } else if (opcionPersona === 'fisica_actividad_empresarial') {
            await generateAndDownloadPdf('src/aspiria/AspiriaCredito.pdf', 'AspiriaCredito.pdf', coordenadasAspiriaCredito, data);
            await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPFAE.pdf', coordenadasCreditoPFAE, data);
        } else if (opcionPersona === 'moral') {
            await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPM.pdf', coordenadasCreditoPM, data);
            await generateAndDownloadPdf('src/housol/HousolMoral.pdf', 'HousolMoral.pdf', coordenadasHousolMoral, data);
            await generateAndDownloadPdf('src/housol/HousolCreditoMoral.pdf', 'HousolCreditoMoral.pdf', coordenadasCreditoHousolmoral, data);
        }
    });
};