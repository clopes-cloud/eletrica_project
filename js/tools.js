function calcularTempoIEC(I_inj, Ip, TMS, tipoCurva) {
    if (I_inj <= Ip) return "Não atua";
    
    let K = 0.14, alpha = 0.02;
    if (tipoCurva === 'very') { K = 13.5; alpha = 1.0; }
    else if (tipoCurva === 'extremely') { K = 80.0; alpha = 2.0; }

    const M = I_inj / Ip;
    const tempo = TMS * (K / (Math.pow(M, alpha) - 1));
    return tempo.toFixed(3) + " s";
}

function gerarTabela() {
    const Ip51 = parseFloat(document.getElementById('pickup51').value);
    const TMS51 = parseFloat(document.getElementById('tms51').value);
    const tcPrim = parseFloat(document.getElementById('tcPrim51').value) || 1;
    const tcSec = parseFloat(document.getElementById('tcSec51').value) || 1;
    const rtc = tcPrim / tcSec;
    const curva51 = document.getElementById('curva51').value;

    const divResultado = document.getElementById('resultadoTabela');
    const multiplos = [1.5, 2.0, 3.0, 5.0, 10.0];

    let html = `
        <h3>Tabela de Testes Calculada (Função 51)</h3>
        <p><strong>RTC (Relação TC):</strong> ${rtc.toFixed(2)} (${tcPrim}/${tcSec}A)</p>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Múltiplo (xIp)</th>
                    <th>Corrente Primária (A)</th>
                    <th>Corrente Secundária (A)</th>
                    <th>Tempo Esperado</th>
                </tr>
            </thead>
            <tbody>
    `;

    multiplos.forEach(m => {
        const iPrim = Ip51 * m;
        const iSec = iPrim / rtc;
        const tempo = calcularTempoIEC(iPrim, Ip51, TMS51, curva51);

        html += `
            <tr>
                <td>${m}x</td>
                <td>${iPrim.toFixed(1)} A</td>
                <td>${iSec.toFixed(2)} A</td>
                <td><strong>${tempo}</strong></td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    divResultado.innerHTML = html;
    divResultado.style.display = "block";
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dados do Formulário
    const local = document.getElementById('local').value || 'Não informado';
    const fabricante = document.getElementById('fabricante').value || 'Não informado';
    const modelo = document.getElementById('modelo').value || 'Não informado';

    const pickup51 = document.getElementById('pickup51').value || '0';
    const tms51 = document.getElementById('tms51').value || '0';
    const tcPrim51 = document.getElementById('tcPrim51').value || '1';
    const tcSec51 = document.getElementById('tcSec51').value || '1';
    const curva51Sel = document.getElementById('curva51');
    const curva51Text = curva51Sel.options[curva51Sel.selectedIndex].text;

    const pickup50 = document.getElementById('pickup50').value || '0';
    const tempo50 = document.getElementById('tempo50').value || '0';

    const pickup51N = document.getElementById('pickup51N').value || '0';
    const tms51N = document.getElementById('tms51N').value || '0';
    const tcPrimN = document.getElementById('tcPrimNeutro').value || '1';
    const tcSecN = document.getElementById('tcSecNeutro').value || '1';
    const curva51NSel = document.getElementById('curva51N');
    const curva51NText = curva51NSel.options[curva51NSel.selectedIndex].text;

    const pickup50N = document.getElementById('pickup50N').value || '0';
    const tempo50N = document.getElementById('tempo50N').value || '0';

    // Cabeçalho Oficial
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, 210, 25, 'F');

    doc.setTextColor(245, 196, 0); // Amarelo Eletro Tech
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ELETRO TECH", 14, 13);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("SOLUÇÕES ELÉTRICAS & ENGENHARIA", 14, 18);

    doc.text("Relatório de Parametrização e Testes", 196, 13, { align: "right" });
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 196, 18, { align: "right" });

    // Título Principal
    doc.setTextColor(17, 17, 17);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO DE AJUSTE DE PROTEÇÃO (ANSI 50/51 & 50N/51N)", 105, 35, { align: "center" });

    // Tabela 1: Equipamento
    doc.autoTable({
        startY: 40,
        head: [['Informações do Equipamento', 'Valores']],
        body: [
            ['Local do Equipamento / Subestação', local],
            ['Fabricante / Modelo', `${fabricante} / ${modelo}`]
        ],
        headStyles: { fillColor: [245, 196, 0], textColor: [17, 17, 17], fontStyle: 'bold' },
        theme: 'grid'
    });

    // Tabela 2: Proteção de Fase
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [['Parâmetros da Função (Fase)', 'Ajuste']],
        body: [
            ['Função 51 (Pickup / TMS)', `${pickup51} A | Dial: ${tms51}`],
            ['TC Primário / Secundário', `${tcPrim51} A / ${tcSec51} A`],
            ['Tipo de Curva 51', curva51Text],
            ['Função 50 (Pickup / Tempo)', `${pickup50} A | Tempo: ${tempo50} s`]
        ],
        headStyles: { fillColor: [245, 196, 0], textColor: [17, 17, 17], fontStyle: 'bold' },
        theme: 'grid'
    });

    // Tabela 3: Proteção de Neutro
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [['Parâmetros da Função (Neutro)', 'Ajuste']],
        body: [
            ['Função 51N (Pickup / TMS)', `${pickup51N} A | Dial: ${tms51N}`],
            ['TC Primário / Secundário (Neutro)', `${tcPrimN} A / ${tcSecN} A`],
            ['Tipo de Curva 51N', curva51NText],
            ['Função 50N (Pickup / Tempo)', `${pickup50N} A | Tempo: ${tempo50N} s`]
        ],
        headStyles: { fillColor: [245, 196, 0], textColor: [17, 17, 17], fontStyle: 'bold' },
        theme: 'grid'
    });

    // Tabela 4: Simulação de Tempos de Disparo
    const Ip = parseFloat(pickup51) || 100;
    const TMS = parseFloat(tms51) || 0.1;
    const tcP = parseFloat(tcPrim51) || 100;
    const tcS = parseFloat(tcSec51) || 5;
    const rtc = tcP / tcS;
    const multiplos = [1.5, 2.0, 3.0, 5.0, 10.0];

    const dadosSimulacao = multiplos.map(m => {
        const iPrim = Ip * m;
        const iSec = iPrim / rtc;
        const tempo = calcularTempoIEC(iPrim, Ip, TMS, curva51Sel.value);
        return [`${m}x Ip`, `${iPrim.toFixed(1)} A`, `${iSec.toFixed(2)} A`, tempo];
    });

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [['Múltiplo (xIp)', 'Corrente Primária (A)', 'Corrente Secundária (A)', 'Tempo de Atuação Esperado']],
        body: dadosSimulacao,
        headStyles: { fillColor: [17, 17, 17], textColor: [255, 255, 255], fontStyle: 'bold' },
        theme: 'striped'
    });

    // Download em PDF
    const nomeArquivo = `Relatorio_Protecao_${local.replace(/\s+/g, '_')}.pdf`;
    doc.save(nomeArquivo);
}