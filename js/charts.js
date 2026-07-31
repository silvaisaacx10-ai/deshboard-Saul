/* ==========================================================================
   AVENIDA SAUL ELKIND RETAIL DASHBOARD - CHART.JS CONTROLLER (V2)
   ========================================================================== */

let chartInstances = {};

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#cbd5e1' : '#334155',
        border: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        tooltipBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        tooltipText: isDark ? '#f8fafc' : '#0f172a',
        blue: '#38bdf8',
        indigo: '#818cf8',
        purple: '#c084fc',
        emerald: '#34d399',
        orange: '#fb923c',
        rose: '#fb7185',
        pink: '#f472b6'
    };
}

// Configurações globais de tooltip para o Chart.js
function getGlobalTooltipOptions(colors) {
    return {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        borderColor: colors.border,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: '700' },
        bodyFont: { family: "'Inter', sans-serif", size: 12 }
    };
}

function createEstoqueChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: SaulElkindData.estoque.labels,
            datasets: [
                {
                    label: 'Giro de Estoque (Dias)',
                    data: SaulElkindData.estoque.giroDias,
                    backgroundColor: 'rgba(56, 189, 248, 0.85)',
                    borderColor: '#38bdf8',
                    borderWidth: 1,
                    borderRadius: 6,
                    yAxisID: 'yGiro'
                },
                {
                    label: '% Ruptura de Estoque',
                    data: SaulElkindData.estoque.rupturaPct,
                    type: 'line',
                    borderColor: '#fb7185',
                    backgroundColor: '#fb7185',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'yRuptura'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    ...getGlobalTooltipOptions(colors),
                    callbacks: {
                        label: function(ctx) {
                            return ctx.dataset.yAxisID === 'yGiro' ? `Giro: ${ctx.parsed.y} dias` : `Ruptura: ${ctx.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { color: colors.grid } },
                yGiro: { type: 'linear', position: 'left', title: { display: true, text: 'Dias de Estoque' }, grid: { color: colors.grid } },
                yRuptura: { type: 'linear', position: 'right', title: { display: true, text: '% Ruptura' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function createDemandaChart(canvasId, colors, period = 'todos') {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    const dataDemanda = SaulElkindData.getDemandaByPeriod(period);

    const gradVenda = ctx.createLinearGradient(0, 0, 0, 300);
    gradVenda.addColorStop(0, 'rgba(129, 140, 248, 0.45)');
    gradVenda.addColorStop(1, 'rgba(129, 140, 248, 0.0)');

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataDemanda.meses,
            datasets: [
                {
                    label: 'Venda Real (R$)',
                    data: dataDemanda.vendaReal,
                    borderColor: '#818cf8',
                    backgroundColor: gradVenda,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: 'Previsão IA (R$)',
                    data: dataDemanda.previsaoIA,
                    borderColor: '#34d399',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 4,
                    tension: 0.35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    ...getGlobalTooltipOptions(colors),
                    callbacks: {
                        afterBody: function(items) {
                            return `Driver: ${dataDemanda.eventos[items[0].dataIndex]}`;
                        },
                        label: function(ctx) {
                            return `${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { color: colors.grid } },
                y: { 
                    grid: { color: colors.grid },
                    ticks: { callback: val => 'R$ ' + (val/1000) + 'k' }
                }
            }
        }
    });
}

function updateDemandaPeriodFilter(period) {
    const dataDemanda = SaulElkindData.getDemandaByPeriod(period);
    
    ['chartDemanda', 'chartDemandaMicro'].forEach(id => {
        const chart = chartInstances[id];
        if (chart) {
            chart.data.labels = dataDemanda.meses;
            chart.data.datasets[0].data = dataDemanda.vendaReal;
            chart.data.datasets[1].data = dataDemanda.previsaoIA;
            chart.options.plugins.tooltip.callbacks.afterBody = function(items) {
                return `Driver: ${dataDemanda.eventos[items[0].dataIndex]}`;
            };
            chart.update('active');
        }
    });
}

function createFunilChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: SaulElkindData.funil.etapas,
            datasets: [{
                label: 'Volume de Pessoas / Interações',
                data: SaulElkindData.funil.volumes,
                backgroundColor: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'],
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...getGlobalTooltipOptions(colors),
                    callbacks: {
                        label: function(ctx) {
                            const idx = ctx.dataIndex;
                            return `Volume: ${ctx.parsed.x.toLocaleString('pt-BR')} (Conv: ${SaulElkindData.funil.taxas[idx]})`;
                        }
                    }
                }
            },
            scales: {
                x: { type: 'logarithmic', grid: { color: colors.grid }, title: { display: true, text: 'Volume (Log)' } },
                y: { grid: { color: colors.grid } }
            }
        }
    });
}

function createOmnichannelChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: SaulElkindData.omnichannel.canais,
            datasets: [{
                data: SaulElkindData.omnichannel.sharePct,
                backgroundColor: ['#38bdf8', '#c084fc', '#34d399'],
                borderWidth: 2,
                borderColor: colors.border
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    ...getGlobalTooltipOptions(colors),
                    callbacks: {
                        label: function(ctx) {
                            const idx = ctx.dataIndex;
                            const sla = SaulElkindData.omnichannel.slaMinutos[idx];
                            return `${ctx.label}: ${ctx.parsed}% (SLA: ${sla} min)`;
                        }
                    }
                }
            }
        }
    });
}

function createSegmentosChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: SaulElkindData.segmentos.labels,
            datasets: [
                {
                    label: 'Share Faturamento (%)',
                    data: SaulElkindData.segmentos.sharePct,
                    backgroundColor: 'rgba(129, 140, 248, 0.85)',
                    borderRadius: 6
                },
                {
                    label: 'Margem Lucro Média (%)',
                    data: SaulElkindData.segmentos.margemPct,
                    backgroundColor: 'rgba(52, 211, 153, 0.85)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: getGlobalTooltipOptions(colors)
            },
            scales: {
                x: { grid: { color: colors.grid } },
                y: { grid: { color: colors.grid }, title: { display: true, text: 'Percentual (%)' } }
            }
        }
    });
}

function createTrafegoChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: SaulElkindData.trafego.periodos,
            datasets: [
                {
                    label: 'Coração do Cincão',
                    data: SaulElkindData.trafego.cincao,
                    borderColor: '#fb7185',
                    backgroundColor: '#fb7185',
                    borderWidth: 3,
                    pointRadius: 6,
                    tension: 0.3
                },
                {
                    label: 'Entorno Âncoras',
                    data: SaulElkindData.trafego.ancoras,
                    borderColor: '#fb923c',
                    backgroundColor: '#fb923c',
                    borderWidth: 3,
                    pointRadius: 6,
                    tension: 0.3
                },
                {
                    label: 'Trechos Periféricos',
                    data: SaulElkindData.trafego.perifericos,
                    borderColor: '#34d399',
                    backgroundColor: '#34d399',
                    borderWidth: 3,
                    pointRadius: 6,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    ...getGlobalTooltipOptions(colors),
                    callbacks: {
                        label: function(ctx) {
                            return `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('pt-BR')} pessoas/dia`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { color: colors.grid } },
                y: { grid: { color: colors.grid }, title: { display: true, text: 'Pessoas / Dia' } }
            }
        }
    });
}

function initCharts() {
    const colors = getChartColors();
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = colors.text;

    // Charts Tab 1 (Visão Geral)
    createEstoqueChart('chartEstoque', colors);
    createDemandaChart('chartDemanda', colors);
    createFunilChart('chartFunil', colors);
    createOmnichannelChart('chartOmnichannel', colors);
    createSegmentosChart('chartSegmentos', colors);
    createTrafegoChart('chartTrafego', colors);

    // Charts Tab 2 (Visão Micro)
    createEstoqueChart('chartEstoqueMicro', colors);
    createDemandaChart('chartDemandaMicro', colors);
    createFunilChart('chartFunilMicro', colors);
    createOmnichannelChart('chartOmnichannelMicro', colors);

    // Charts Tab 3 (Visão Macro)
    createSegmentosChart('chartSegmentosMacro', colors);
    createTrafegoChart('chartTrafegoMacro', colors);
}

// Exportar qualquer gráfico diretamente como imagem PNG
function exportChartAsPNG(canvasId, filename = 'grafico_saul_elkind') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
