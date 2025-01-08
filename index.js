function mostrarCampos() {
    const tipo = document.getElementById('tipo_solicitante').value;

    document.querySelectorAll('.tipo-solicitante').forEach(fieldset => {
        fieldset.style.display = 'none';
    });

    if (tipo) {
        document.getElementById(tipo).style.display = 'block';
    }
}

function setFechaActual() {
    const fechaCampoFisica = document.getElementById('fechag_fisica');
    const fechaCampoMoral = document.getElementById('fechag_moral');

    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const day = String(hoy.getDate()).padStart(2, '0');

    fechaCampoFisica.value = `${year}-${month}-${day}`;
    fechaCampoMoral.value = `${year}-${month}-${day}`;
}

function toggleDesdeCuando() {
    const clienteHousol = document.getElementById('cliente_housol_fisica').value;
    const desdeCuandoContainer = document.getElementById('desde_cuando_container');

    if (clienteHousol === 'si') {
        desdeCuandoContainer.style.display = 'block'; 
    } else {
        desdeCuandoContainer.style.display = 'none'; 
    }
}

function toggleRegimenMatrimonial() {
    const estadoCivil = document.getElementById('estado_civil_fisica').value;
    const regimenContainer = document.getElementById('regimen_matrimonial_container');
    const pensionContainer = document.getElementById('pension_container');

    if (estadoCivil === 'Casado') {
        regimenContainer.style.display = 'block';
        pensionContainer.style.display = 'none';
    } else if (estadoCivil === 'Divorciado') {
        pensionContainer.style.display = 'block';
        regimenContainer.style.display = 'none';
    } else {
        regimenContainer.style.display = 'none';
        pensionContainer.style.display = 'none';
    }
}

function toggleConHipoteca() {
    const vivienda = document.getElementById('vivienda_tipo_fisica').value;
    const hipotecaOption = document.getElementById('hipoteca_option');

    if (vivienda === 'Propia') {
        hipotecaOption.style.display = 'block';
    } else {
        hipotecaOption.style.display = 'none';
        document.getElementById('con_hipoteca').value = "";
    }
}

function toggleTrabajadorOptions() {
    const tipoTrabajador = document.getElementById('tipo_trabajador_fisica').value;
    const contratoContainer = document.getElementById('tipo_contrato_container');
    const actividadContainer = document.getElementById('actividad_empresa_container');

    if (tipoTrabajador === 'Asalariado') {
        contratoContainer.style.display = 'block';
        actividadContainer.style.display = 'none';
    } else if (tipoTrabajador === 'Independiente') {
        contratoContainer.style.display = 'none';
        actividadContainer.style.display = 'block';
    } else {
        contratoContainer.style.display = 'none';
        actividadContainer.style.display = 'none';
    }
}

// mostrarCampos al cargar la página
window.onload = () => {
    mostrarCampos(); 
    toggleDesdeCuando(); 
    toggleConHipoteca();
    setFechaActual();
    toggleRegimenMatrimonial();
    toggleTrabajadorOptions();
};


// mostrarCampos cada vez que cambia el tipo de solicitante
document.getElementById('tipo_solicitante').addEventListener('change', mostrarCampos);

const form = document.getElementById('miFormulario');

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

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
                                size: coordenadas[pageIndex][key].size
                            });
                        } else {
                            console.log(`Campo ${key} no tiene valor en data`);
                        }
                    });

                    if (coordenadas[pageIndex].TPersona) {
                        page.drawText('X', {
                            x: coordenadas[pageIndex].TPersona.x,
                            y: coordenadas[pageIndex].TPersona.y,
                            size: 12
                        });
                    }
                }

                if (fileName === 'AspiriaCredito.pdf' && pageIndex === 0) {
                    if (data.persona_fae === 'fisica') {
                        page.drawText('X', { x: 105, y: 624, size: 12 });
                    } else if (data.persona_fae === 'moral') {
                        page.drawText('X', { x: 225, y: 624, size: 12 });
                    }
                    if (data.tipodomicilio_fae === 'rento') {
                        page.drawText('X', { x: 340, y: 499, size: 12 });
                    } else if (data.tipodomicilio_fae === 'propio') {
                        page.drawText('X', { x: 440, y: 499, size: 12 });
                    }
                    if (data.tiponegocio_fae === 'rento') {
                        page.drawText('X', { x: 515, y: 426, size: 12 });
                    } else if (data.tiponegocio_fae === 'propio') {
                        page.drawText('X', { x: 95, y: 412, size: 12 });
                    }
                }
                else if (fileName === 'HousolCreditoFisica.pdf' && pageIndex === 0) {
                    if (data.cliente_housol_fisica === 'si') {
                        page.drawText('X', { x: 21.5, y: 899, size: 10 });
                    } else if (data.cliente_housol_fisica === 'no') {
                        page.drawText('X', { x: 42, y: 899, size: 10 });
                    }
                    if (data.nacionalidad_fisica === 'Mexicana') {
                        page.drawText('X', { x: 229.5, y: 877, size: 10 });
                    } else {
                        page.drawText('X', { x: 285, y: 877, size: 10 });
                    }
                    if (data.sexo_fisica === 'Masculino') {
                        page.drawText('X', { x: 474.5, y: 877, size: 10 });
                    } else if (data.sexo_fisica === 'Femenino'){
                        page.drawText('X', { x: 533.3, y: 877, size: 10 });
                    }
                    if (data.vivienda_tipo_fisica === 'Propia') {
                        page.drawText('X', { x: 15.5, y: 748.5, size: 10 });
                        if (data.con_hipoteca === 'si') {
                            page.drawText('X', { x: 112.5, y: 748.5, size: 10 });
                        } else if (data.con_hipoteca === 'no') {
                            page.drawText('X', { x: 133, y: 748.5, size: 10 });
                        }
                    } else if (data.vivienda_tipo_fisica === 'Rentada') {
                        page.drawText('X', { x: 15.5, y: 737, size: 10 });
                    } else if (data.vivienda_tipo_fisica === 'De padres o familiares') {
                        page.drawText('X', { x: 73, y: 737, size: 10 });
                    } else if (data.vivienda_tipo_fisica === 'Otra') {
                        page.drawText('X', { x: 15.5, y: 728, size: 10 });
                    }
                    else if (data.estado_civil_fisica === 'Soltero'){
                        page.drawText('X', { x: 224.2 , y: 748.2, size: 10 });
                    }
                    else if (data.estado_civil_fisica === 'Unión Libre'){
                        page.drawText('X', { x: 270.2 , y: 748.2, size: 10 });
                    }
                    else if (data.estado_civil_fisica === 'Casado'){
                        page.drawText('X', { x: 334 , y: 748.2, size: 10 });
                    }
                    else if (data.estado_civil_fisica === 'Divorciado'){
                        page.drawText('X', { x: 224.2 , y: 733, size: 10 });
                    }
                    else if (data.tipo_contrato_fisica === 'Tiempo indefinido'){
                        page.drawText('X', { x: 126.5 , y: 663, size: 10 })
                    }
                    else if (data.tipo_contrato_fisica === 'Temporal'){
                        page.drawText('X', { x: 210.5 , y: 663, size: 10 })
                    }
                    else if (data.tipo_contrato_fisica === 'Otro'){
                        page.drawText('X', { x: 263.2 , y: 663, size: 10 })
                    }
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
            monto_fae: { x: 85, y: 689, size: 10 },
            promocode_fae: { x: 353, y: 689, size: 10 },
            nombre_fae: { x: 93, y: 639, size: 10 },
            email_fae: { x: 330, y: 639, size: 10 },
            fecha_nacimiento_fae: { x: 175, y: 610, size: 10 },
            lugar_nacimiento_fae: { x: 250, y: 610, size: 10 },
            rfc_fae: { x: 75, y: 597, size: 10 },
            curp_fae: { x: 330, y: 597, size: 10 },
            estado_civil_fae: { x: 105, y: 582, size: 10 },
            regimen_matrimonial_fae: { x: 385, y: 582, size: 10 },
            codigo_postal_fae: { x: 73, y: 528, size: 10 },
            domicilio_fae: { x: 258, y: 528, size: 10 },
            colonia_fae: { x: 427, y: 528, size: 10 },
            ciudad_fae: { x: 88, y: 514, size: 10 },
            municipio_fae: { x: 258, y: 514, size: 10 },
            estado_fae: { x: 425, y: 514, size: 10 },
            tiempo_domicilio_fae: { x: 142, y: 499, size: 10 },
            telefono_fae: { x: 500, y: 499, size: 10 },
            nombre_negocio_fae: { x: 141, y: 456, size: 10 },
            codigo_postal_negocio_fae: { x: 295, y: 456, size: 10 },
            domicilio_negocio_fae: { x: 437, y: 456, size: 10 },
            colonia_negocio_fae: { x: 90, y: 442, size: 10 },
            ciudad_negocio_fae: { x: 308, y: 442, size: 10 },
            municipio_negocio_fae: { x: 438, y: 442, size: 10 },
            estado_negocio_fae: { x: 89, y: 427, size: 10 },
            tiempo_negocio_fae: { x: 361, y: 427, size: 10 },
            telefono_negocio_fae: { x: 293, y: 413, size: 10 },
            anos_funcionamiento_fae: { x: 141, y: 369, size: 10 },
            recurso_funcionamiento_fae: { x: 420, y: 369, size: 10 },
            ingresos_funcionamiento_fae: { x: 122, y: 355, size: 10 },
            actividad_funcionamiento_fae: { x: 402, y: 355, size: 10 },
            banco_fae: { x: 90, y: 307, size: 10 },
            clabe_interbancaria_fae: { x: 402, y: 307, size: 10 },
            nombre_familiar1_fae: { x: 98, y: 201, size: 10 },
            parentesco_familiar1_fae: { x: 360, y: 201, size: 10 },
            telefono_familiar1_fae: { x: 73, y: 186, size: 10 },
            nombre_familiar2_fae: { x: 98, y: 156, size: 10 },
            parentesco_familiar2_fae: { x: 360, y: 156, size: 10 },
            telefono_familiar2_fae: { x: 73, y: 141, size: 10 }
        }
    });

    const coordenadasAspiriaFisica = (pages) => ({
        0: {
            nombre_fisica: { x: 138, y: 563, size: 10 },
            rfc_fisica: { x: 78, y: 543, size: 10 },
            domicilio_fisica: { x: 95, y: 524, size: 10 },
            colonia_fisica: { x: 90, y: 505, size: 10 },
            municipio_fisica: { x: 96, y: 486, size: 10 },
            estado_fisica: { x: 295, y: 486, size: 10 },
            codigo_postal_fisica: { x: 485, y: 486, size: 10 },
            telefono_fisica: { x: 103, y: 467, size: 10 }
        }
    });

    const coordenadasCreditoPF = (pages) => ({
        0: {
        },
        2: {
            nombre_fisica: { x: 32, y: 482, size: 10 },
            rfc_fisica: { x: 32, y: 433, size: 10 },
            domicilio_fisica: { x: 32, y: 408, size: 10 },
            colonia_fisica: { x: 32, y: 383, size: 10 },
            municipio_fisica: { x: 32, y: 359, size: 10 },
            estado_fisica: { x: 32, y: 334, size: 10 },
            codigo_postal_fisica: { x: 32, y: 309, size: 10 },
            telefono_fisica: { x: 32, y: 285, size: 10 },
            TPersona: { x: 148, y: 516, size: 10 }
        }
    });

    const coordenadasCreditoPFAE = (pages) => ({
        0: {

        },
        2: {
            nombre_fae: { x: 32, y: 482, size: 10 },
            rfc_fae: { x: 32, y: 433, size: 10 },
            domicilio_fae: { x: 32, y: 408, size: 10 },
            colonia_fae: { x: 32, y: 383, size: 10 },
            municipio_fae: { x: 32, y: 359, size: 10 },
            estado_fae: { x: 32, y: 334, size: 10 },
            codigo_postal_fae: { x: 32, y: 309, size: 10 },
            telefono_fae: { x: 32, y: 285, size: 10 },
            TPersona: { x: 313.5, y: 516, size: 10 }
        }
    });

    const coordenadasCreditoPM = (pages) => ({
        0: {

        },
        2: {
            nombre_moral: { x: 32, y: 482, size: 10 },
            representante_moral: { x: 32, y: 458, size: 10 },
            rfc_moral: { x: 32, y: 433, size: 10 },
            domicilio_moral: { x: 32, y: 408, size: 10 },
            colonia_moral: { x: 32, y: 383, size: 10 },
            municipio_moral: { x: 32, y: 359, size: 10 },
            estado_moral: { x: 32, y: 334, size: 10 },
            codigo_postal_moral: { x: 32, y: 309, size: 10 },
            telefono_moral: { x: 32, y: 285, size: 10 },
            TPersona: { x: 387.5, y: 516, size: 10 }
        }
    });

    const coordenadasHousolFisica = (pages) => ({
        0: {
            fechag_fisica: { x: 120, y: 689, size: 10 },
            apellido_paterno_fisica: { x: 179, y: 666, size: 10 },
            apellido_materno_fisica: { x: 305, y: 666, size: 10 },
            nombre_fisica: { x: 410, y: 666, size: 10 },
            fecha_nacimiento_fisica: { x: 90, y: 644, size: 10 },
            pais_nacimiento_fisica: { x: 179, y: 644, size: 10 },
            nacionalidad_fisica: { x: 305, y: 644, size: 10 },
            rfc_fisica: { x: 411, y: 644, size: 10 },
            curp_fisica: { x: 120, y: 621, size: 10 },
            profesion_fisica: { x: 300, y: 621, size: 10 },
            identificacion_fisica: { x: 120, y: 596, size: 10 },
            folio_identificacion_fisica: { x: 410, y: 596, size: 10 },
            domicilio_fisica: { x: 180, y: 569, size: 10 },
            numero_exterior_fisica: { x: 352, y: 569, size: 10 },
            numero_interior_fisica: { x: 440, y: 569, size: 10 },
            colonia_fisica: { x: 90, y: 547, size: 10 },
            municipio_fisica: { x: 230, y: 547, size: 10 },
            estado_fisica: { x: 410, y: 547, size: 10 },
            ciudad_fisica: { x: 90, y: 524, size: 10 },
            pais_fisica: { x: 230, y: 524, size: 10 },
            codigo_postal_fisica: { x: 352, y: 524, size: 10 },
            telefono_fisica: { x: 440, y: 524, size: 10 },
            celular_fisica: { x: 90, y: 503, size: 10 },
            telefono2_fisica: { x: 290, y: 503, size: 10 },
            extension_fisica: { x: 440, y: 503, size: 10 },
            email_fisica: { x: 211, y: 482, size: 10 }
        }
    });

    const coordenadasCreditoHousolFisica = (pages) => ({
        0: {
            desde_cuando: { x: 120, y: 898, size:  8 },
            nombre_fisica: { x: 170, y: 898, size: 10 },
            apellido_paterno_fisica: { x: 320, y: 898, size: 10 },
            apellido_materno_fisica: { x: 455, y: 898, size: 10 },
            fecha_nacimiento_fisica: { x: 138, y: 229, size: 10 },
            lugar_nacimiento_fisica: { x: 100, y: 875, size: 10 },
            pais_nacimiento_fisica: { x: 350, y: 875, size: 10 },
            identificacion_fisica: { x: 25, y: 853, size: 10 },
            folio_identificacion_fisica: { x: 175, y: 853, size: 10 },
            escolaridad_fisica: { x: 290, y: 853, size: 10 },
            profesion_fisica: { x: 435, y: 853, size: 10 },
            rfc_fisica: { x: 25, y: 824, size: 10 },
            curp_fisica: { x: 200, y: 824, size: 10 },
            nss_fisica: { x: 440, y: 824, size: 10 },
            domicilio_fisica: { x: 25, y: 801.5, size: 10 },
            colonia_fisica: { x: 363, y: 801.5, size: 10 },
            codigo_postal_fisica: { x: 525, y: 801.5, size: 10 },
            municipio_fisica: { x: 25, y: 771.5, size: 10 },
            estado_fisica: { x: 155, y: 771.5, size: 10 },
            pais_fisica: { x: 293, y: 771.5, size: 10 },
            telefono_fisica: { x: 362, y: 771.5, size: 10 },
            email_fisica: { x: 485, y: 771.5, size: 10 },
            tiempo_residencia_fisica: { x: 185, y: 734, size: 10 },
            regimen_matrimonial_fisica: { x: 460, y: 748.2, size: 8 },
            pension_fisica: { x: 485, y: 733, size: 10 },
            dependientes_fisica: { x: 542, y: 731, size: 10 },
            nombre_empresa_fisica: { x: 25, y: 696, size: 10 },
            domicilio_empresa_fisica: { x: 300, y: 696, size: 10 },
            colonia_empresa_fisica: { x: 25, y: 673, size: 10 },
            codigo_postal_empresa_fisica: { x: 160, y: 673, size: 10 },
            municipio_empresa_fisica: { x: 218, y: 673, size: 10 },
            estado_empresa_fisica: { x: 438, y: 673, size: 10 },
            pais_empresa_fisica: { x: 551, y: 673, size: 10 },
            actividad_empresa_fisica: { x: 191, y: 650, size: 10 },
            giro_empresa_fisica: { x: 359, y: 650, size: 10 },
            departamento_empresa_fisica: { x: 505, y: 650, size: 10 },
            puesto_empresa_fisica: { x: 25, y: 623.5, size: 10 },
            fecha_ingreso_empresa_fisica: { x: 138, y: 229, size: 10 },
            antiguedad_empresa_fisica: { x: 138, y: 229, size: 10 },
            telefono_empresa_fisica: { x: 287, y: 623.5, size: 10 },
            actividades_empresa_fisica: { x: 25, y: 602, size: 10 },
        }
    });

    const coordenadasHousolMoral = (pages) => ({
        0: {
            fechag_moral: { x: 82, y: 681, size: 10 },
            denominacion_social_moral: { x: 80, y: 653, size: 10 },
            fecha_constitucion_moral: { x: 60, y: 626, size: 10 },
            pais_nacionalidad_moral: { x: 237, y: 626, size: 10 },
            rfc_moral: { x: 440, y: 626, size: 10 },
            actividad_funcionamiento_moral: { x: 60, y: 600, size: 10 },
            fecha_registro_moral: { x: 400, y: 600, size: 10 },
            domicilio_moral: { x: 105, y: 575, size: 10 },
            numero_exterior_moral: { x: 380, y: 575, size: 10 },
            numero_interior_moral: { x: 495, y: 575, size: 10 },
            colonia_moral: { x: 50, y: 546, size: 10 },
            municipio_moral: { x: 250, y: 546, size: 10 },
            estado_moral: { x: 450, y: 546, size: 10 },
            ciudad_moral: { x: 50, y: 514.5, size: 10 },
            pais_moral: { x: 235, y: 514.5, size: 10 },
            codigo_postal_moral: { x: 360, y: 514.5, size: 10 },
            celular_moral: { x: 478, y: 514.5, size: 10 },
            telefono_moral: { x: 60, y: 491, size: 10 },
            extension_moral: { x: 230, y: 491, size: 10 },
            telefono2_moral: { x: 320, y: 491, size: 10 },
            extension2_moral: { x: 510, y: 491, size: 10 },
            email_empresarial_moral: { x: 240, y: 468.5, size: 10 },
            identificacion_moral: { x: 60, y: 445, size: 10 },
            folio_identificacion_moral: { x: 330, y: 445, size: 10 },
            Autoridad_moral: {x: 460, y: 445, size:10 }
        }
    });

    const coordenadasCreditoHousolmoral = (pages) => ({
        0: {
            nombre: { x: 138, y: 229, size: 10 },
            rfc: { x: 138, y: 250, size: 10 }
        }
    });


    const coordenadasAutorizacionBuroMO = (pages) => ({
        0: {
            
        }
    });

    const CoordenadasPremoSolicitudPM = (pages) => ({
        0: {
           
        },
        1: {
            
        },
    });


    const CoordenadasCuestionarioPremoMoral = (pages) => ({
        0: {
            
        },
        1: {
            
        },
    });


    const coordenadasPremoSolicitudPF = (pages) => ({
        0: {
            
        }
    });

    const coordenadasCuestionarioPremoPF = (pages) => ({
        0: {
            
        }
    });

    const coordenadasAutorizacionBuroPFA = (pages) => ({
        0: {
            
        }
    });

    const coordenadasAutorizacionPF = (pages) => ({
        0: {
            TPersona: { x: 143, y: 502, size: 10 },
            nombre231: { x: 60, y: 453, size: 10 },
            apellido_paterno231: { x: 200, y: 453, size: 10 },
            apellido_materno231: { x: 310, y: 453, size: 10 },
            rfc231: { x: 90, y: 402, size: 10 },
            calle11: { x: 92, y: 385, size: 10 },
            no_exterior11: { x: 250, y: 385, size: 10 },
            no_interior11: { x: 280, y: 385, size: 10 },
            colonia11: { x: 330, y: 385, size: 10 },
            municipio11: { x: 95, y: 367, size: 10 },
            entidad_federativa11: { x: 234, y: 367, size: 10 },
            codigo_postal11: { x: 414, y: 367, size: 10 },
            telefono_celular231: { x: 100, y: 350, size: 10 },
        }
    });
    
    const coordenadasCuestionarioPF = (pages) => ({
        0: {
            
        },
        1: {
            
        }
    });
    
    const opcionPersona = data.tipo_solicitante;

    if (opcionPersona === 'fisica') {
        //await generateAndDownloadPdf('src/aspiria/AspiriaFisica.pdf', 'AspiriaPersonaFisica.pdf', coordenadasAspiriaFisica, data);
        //await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPF.pdf', coordenadasCreditoPF, data);
        //await generateAndDownloadPdf('src/housol/HousolFisica.pdf', 'HousolFisica.pdf', coordenadasHousolFisica, data);
        await generateAndDownloadPdf('src/housol/HousolCreditoFisica.pdf', 'HousolCreditoFisica.pdf', coordenadasCreditoHousolFisica, data);
        //await generateAndDownloadPdf('src/premo/archivoss2.pdf', 'PremoCuestionarioPF.pdf', coordenadasCuestionarioPF, data);
        //await generateAndDownloadPdf('src/premo/archivo.pdf', 'PremoAutorizacionPF.pdf', coordenadasAutorizacionPF, data);
    } else if (opcionPersona === 'fisica_actividad_empresarial') {
        await generateAndDownloadPdf('src/aspiria/AspiriaCredito.pdf', 'AspiriaCredito.pdf', coordenadasAspiriaCredito, data);
        //await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPFAE.pdf', coordenadasCreditoPFAE, data);
        //await generateAndDownloadPdf('src/premo/PremoSolicitudPF.pdf', 'PremoSolicitudPF.pdf', coordenadasPremoSolicitudPF, data);
        //await generateAndDownloadPdf('src/premo/PremoCuestionarioInicialPersonaFisica.pdf', 'PremoCuestionarioPFA.pdf', coordenadasCuestionarioPremoPF, data);
        //await generateAndDownloadPdf('src/premo/PremoAutorizacionBuro.pdf', 'PremoAutorizacionBuroPFA.pdf', coordenadasAutorizacionBuroPFA, data);
    } else if (opcionPersona === 'moral') {
        //await generateAndDownloadPdf('src/negocios/NegocioFormato.pdf', 'NegociosCreditoPM.pdf', coordenadasCreditoPM, data);
        //await generateAndDownloadPdf('src/housol/HousolMoral.pdf', 'HousolMoral.pdf', coordenadasHousolMoral, data);
        //await generateAndDownloadPdf('src/housol/HousolCreditoMoral.pdf', 'HousolCreditoMoral.pdf', coordenadasCreditoHousolmoral, data);
        //await generateAndDownloadPdf('src/premo/PremoAutorizacionBuro.pdf', 'PremoAutorizacionBuroMo.pdf', coordenadasAutorizacionBuroMO, data);
        //await generateAndDownloadPdf('src/premo/PremoSolicitudPM.pdf', 'PremoSolicitudMoral.pdf', CoordenadasPremoSolicitudPM, data);
        //await generateAndDownloadPdf('src/premo/PremoCuestionarioInicialPMO.pdf', 'PremoCuestionarioMoral.pdf', CoordenadasCuestionarioPremoMoral, data);
    }

    
});