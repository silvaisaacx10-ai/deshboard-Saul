/* ==========================================================================
   AVENIDA SAUL ELKIND RETAIL DASHBOARD - APP CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCharts();
    initTabs();
    initTables();
    initModal();
});

// THEME TOGGLE
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        
        // Re-render charts with updated theme colors
        Object.values(chartInstances).forEach(chart => chart.destroy());
        chartInstances = {};
        initCharts();
    });
}

// NAVIGATION TABS
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetPaneId = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const targetPane = document.getElementById(targetPaneId);
            if (targetPane) targetPane.classList.add('active');

            // Force Chart.js resize update when switching tab
            Object.values(chartInstances).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });
    });
}

// TABLES BUILDER & SEARCH
function initTables() {
    const container = document.getElementById('tables-list');
    if (!container) return;

    const tablesConfig = [
        {
            title: '1. Gestão de Estoque x Tecnologia (Giro vs Ruptura)',
            id: 'table-estoque',
            headers: ['Perfil da Loja', 'Giro de Estoque (Dias)', '% Ruptura de Estoque'],
            rows: SaulElkindData.estoque.labels.map((lbl, idx) => [
                lbl.replace('\n', ' '),
                `${SaulElkindData.estoque.giroDias[idx]} dias`,
                `${SaulElkindData.estoque.rupturaPct[idx]}%`
            ])
        },
        {
            title: '2. Previsão de Demanda com IA (12 Meses)',
            id: 'table-demanda',
            headers: ['Mês', 'Venda Real (R$)', 'Previsão IA (R$)', 'Driver / Evento de Consumo'],
            rows: SaulElkindData.demanda.meses.map((mes, idx) => [
                mes,
                `R$ ${SaulElkindData.demanda.vendaReal[idx].toLocaleString('pt-BR')}`,
                `R$ ${SaulElkindData.demanda.previsaoIA[idx].toLocaleString('pt-BR')}`,
                SaulElkindData.demanda.eventos[idx]
            ])
        },
        {
            title: '3. Funil de Vendas Meta Ads (Raio de 4km)',
            id: 'table-funil',
            headers: ['Etapa do Funil', 'Volume / Interações', 'Taxa de Conversão da Etapa'],
            rows: SaulElkindData.funil.etapas.map((etapa, idx) => [
                etapa,
                SaulElkindData.funil.volumes[idx].toLocaleString('pt-BR'),
                SaulElkindData.funil.taxas[idx]
            ])
        },
        {
            title: '4. Logística Omnichannel & SLA de Resposta',
            id: 'table-omnichannel',
            headers: ['Canal de Venda', 'Share Faturamento (%)', 'Tempo Médio Resposta (SLA)', 'NPS'],
            rows: SaulElkindData.omnichannel.canais.map((canal, idx) => [
                canal,
                `${SaulElkindData.omnichannel.sharePct[idx]}%`,
                `${SaulElkindData.omnichannel.slaMinutos[idx]} min`,
                SaulElkindData.omnichannel.nps[idx]
            ])
        },
        {
            title: '5. Divisão por Segmento (500 Lojas da Avenida)',
            id: 'table-segmentos',
            headers: ['Segmento Comercial', 'Share Faturamento (%)', 'Margem Lucro Média (%)', 'Qtd Lojas'],
            rows: SaulElkindData.segmentos.labels.map((seg, idx) => [
                seg,
                `${SaulElkindData.segmentos.sharePct[idx]}%`,
                `${SaulElkindData.segmentos.margemPct[idx]}%`,
                `${SaulElkindData.segmentos.qtdLojas[idx]} lojas`
            ])
        },
        {
            title: '6. Mapa de Tráfego de Consumidores (Pontos Quentes)',
            id: 'table-trafego',
            headers: ['Período da Semana', 'Coração Cincão (p/dia)', 'Entorno Âncoras (p/dia)', 'Trechos Periféricos (p/dia)'],
            rows: SaulElkindData.trafego.periodos.map((per, idx) => [
                per,
                `${SaulElkindData.trafego.cincao[idx].toLocaleString('pt-BR')} hab`,
                `${SaulElkindData.trafego.ancoras[idx].toLocaleString('pt-BR')} hab`,
                `${SaulElkindData.trafego.perifericos[idx].toLocaleString('pt-BR')} hab`
            ])
        }
    ];

    container.innerHTML = tablesConfig.map(t => `
        <div class="table-card" data-searchable>
            <div class="table-card-header">
                <h4>${t.title}</h4>
                <div class="table-actions">
                    <button class="btn btn-outline" onclick="copyTableToClipboard('${t.id}')">
                        <i class="fa-solid fa-copy"></i> Copiar para Excel
                    </button>
                </div>
            </div>
            <table class="data-table" id="${t.id}">
                <thead>
                    <tr>${t.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${t.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </div>
    `).join('');

    // Search filter listener
    const searchInput = document.getElementById('table-search');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('[data-searchable]').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}

function copyTableToClipboard(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csvText = '';
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.innerText.replace('\n', ' '));
        }
        csvText += rowData.join('\t') + '\n';
    }

    navigator.clipboard.writeText(csvText).then(() => {
        alert('Tabela copiada no formato TSV/Excel! Abra o Excel e cole com Ctrl+V.');
    }).catch(err => {
        console.error('Erro ao copiar tabela: ', err);
    });
}

// MODAL HANDLER
function initModal() {
    const btn = document.getElementById('btn-cloud-guide');
    const modal = document.getElementById('cloud-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    btn?.addEventListener('click', () => modal?.classList.add('active'));
    closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}
