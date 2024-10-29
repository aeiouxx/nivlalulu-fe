// Funkce pro simulované načtení šablon
export const fetchTemplates = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Šablona pro malou firmu' },
            ]);
        }, 1000); // Simulované zpoždění 1 sekundu
    });
};

// Simulovaná HTML šablona jako string
// Funkce pro simulaci odpovědi ze serveru
export const fetchHtmlTemplateAndData = async (templateId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // HTML šablona s ID elementy pro jednotlivé části
            const htmlTemplate = `
                <!DOCTYPE html>
                    <html lang="cs">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Zálohová faktura</title>
                        <style>
                            /* Nastavení stránky A4 a tiskových vlastností */
                            @page {
                                size: A4;
                                margin: 0;
                            }
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                color: #000;
                                width: 210mm;
                                height: 297mm;
                                box-sizing: border-box;
                            }
                            .invoice-container {
                                padding: 15mm;
                                width: 180mm;
                                margin: auto;
                                box-sizing: border-box;
                            }
                            .header, .section, .footer {
                                width: 100%;
                                margin-bottom: 5px;
                                border: 1px solid #000;
                                padding: 10px;
                                box-sizing: border-box;
                            }
                            .header div, .footer div {
                                display: inline-block;
                                vertical-align: top;
                            }
                            .header .supplier, .header .customer {
                                width: 40%;
                            }
                            .header .title {
                                width: 20%;
                                text-align: center;
                                font-size: 1.2em;
                                font-weight: bold;
                            }
                            .section table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 10px;
                            }
                            .section th, .section td {
                                border: 1px solid #000;
                                padding: 5px;
                                text-align: center;
                                font-size: 0.9em;
                            }
                            .totals {
                                text-align: right;
                                margin-top: 10px;
                                font-size: 1em;
                                font-weight: bold;
                            }
                            .footer {
                                font-size: 0.8em;
                                text-align: center;
                                margin-top: 15px;
                            }
                            .footer .info, .footer .qr {
                                width: 50%;
                                display: inline-block;
                                vertical-align: top;
                            }
                            
                            /* Styl pro editovatelná pole */
                            .editable-field {
                                display: inline-block;
                                min-width: 100px; /* Minimální šířka pole */
                                padding: 2px 5px;
                                border-bottom: 1px dotted #000; /* Dolní ohraničení pole */
                                background-color: #f9f9f9; /* Světlé pozadí pro odlišení */
                                text-align: left;
                            }
                            
                            /* Přizpůsobení položek faktury */
                            .items-table td[data-field], .items-table td[data-item] {
                                min-width: 80px; /* Nastavení minimální šířky pro buňky položek */
                                padding: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="invoice-container">
                            <div class="title">
                                <h1>ZÁLOHOVÁ FAKTURA</h1>
                                č. <span class="editable-field" data-field="invoice.number"></span>
                            </div>
                            
                            <!-- Header Section -->
                            <div class="header">
                                <div class="supplier">
                                    <strong>Dodavatel:</strong><br>
                                    <div class="editable-field" data-field="supplier.name"></div><br>
                                    <div class="editable-field" data-field="supplier.address"></div><br>
                                    <div class="editable-field" data-field="supplier.country"></div><br>
                                    IČ: <span class="editable-field" data-field="supplier.ico"></span><br>
                                    DIČ: <span class="editable-field" data-field="supplier.dic"></span><br>
                                    Telefon: <span class="editable-field" data-field="supplier.phone"></span><br>
                                    E-mail: <span class="editable-field" data-field="supplier.email"></span><br>
                                </div>
                                <div class="customer">
                                    <strong>Odběratel:</strong><br>
                                    <div class="editable-field" data-field="customer.name"></div><br>
                                    <div class="editable-field" data-field="customer.contact_person"></div><br>
                                    <div class="editable-field" data-field="customer.address"></div><br>
                                    <div class="editable-field" data-field="customer.country"></div><br>
                                    IČ: <span class="editable-field" data-field="customer.ico"></span><br>
                                    DIČ: <span class="editable-field" data-field="customer.dic"></span>
                                </div>
                            </div>

                            <!-- Payment and Date Section -->
                            <div class="section">
                                <table>
                                    <tr>
                                        <td><strong>Datum vystavení:</strong><br> <span class="editable-field" data-field="invoice.issue_date"></span></td>
                                        <td><strong>Datum splatnosti:</strong><br> <span class="editable-field" data-field="invoice.due_date"></span></td>
                                        <td><strong>Forma úhrady:</strong><br> <span class="editable-field" data-field="invoice.payment_method"></span></td>
                                        <td><strong>Variabilní symbol:</strong><br> <span class="editable-field" data-field="invoice.variable_symbol"></span></td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Items Section -->
                            <div class="section">
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Označení dodávky</th>
                                            <th>Množství</th>
                                            <th>J.cena</th>
                                            <th>Cena</th>
                                            <th>%DPH</th>
                                            <th>DPH</th>
                                            <th>Kč Celkem</th>
                                        </tr>
                                    </thead>
                                    <tbody data-item="items">
                                        <!-- Dynamicky generované řádky podle JSON dat -->
                                    </tbody>
                                </table>
                            </div>

                            <!-- Totals Section -->
                            <div class="totals">
                                <strong>Součet položek:</strong> <span class="editable-field" data-field="totals.item_total"></span> Kč<br>
                                <strong>DPH:</strong> <span class="editable-field" data-field="totals.tax_total"></span> Kč<br>
                                <strong>CELKEM K ÚHRADĚ:</strong> <span class="editable-field" data-field="totals.total_due"></span> Kč
                            </div>

                            <!-- Footer Section -->
                            <div class="footer">
                                <div class="info">
                                    Vystavil: <span class="editable-field" data-field="issuer"></span><br>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
            `;

            // Počáteční JSON data pro editovatelné položky
            const jsonData ={
                "supplier": {
                    "name": "",
                    "address": "",
                    "country": "",
                    "ico": "",
                    "dic": "",
                    "phone": "",
                    "email": ""
                },
                "customer": {
                    "name": "",
                    "contact_person": "",
                    "address": "",
                    "country": "",
                    "ico": "",
                    "dic": ""
                },
                "invoice": {
                    "number": "",
                    "issue_date": "",
                    "due_date": "",
                    "payment_method": "",
                    "variable_symbol": ""
                },
                "items": [
                    {
                        "description": "",
                        "quantity": "",
                        "unit_price": "",
                        "price": "",
                        "tax_rate": "",
                        "tax": "",
                        "total": ""
                    },
                ],
                "totals": {
                    "item_total": "",
                    "tax_total": "",
                    "total_due": ""
                },
                "issuer": ""
            };

            resolve({ html: htmlTemplate, data: jsonData });
        }, 1000); // Simulované zpoždění
    });
};


