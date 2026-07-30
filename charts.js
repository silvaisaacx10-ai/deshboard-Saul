/* ==========================================================================
   AVENIDA SAUL ELKIND RETAIL DASHBOARD - CHART.JS CONTROLLER
   ========================================================================== */

let chartInstances = {};

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#94a3b8' : '#475569',
        border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        blue: '#38bdf8',
        indigo: '#6366f1',
        purple: '#a855f7',
        emerald: '#10b981',
        orange: '#f97316',
        rose: '#f43f5e',
        pink: '#ec4899'
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
                    backgroundColor: 'rgba(56, 189, 248, 0.8)',
                    borderColor: '#38bdf8',
                    borderWidth: 1,
                    borderRadius: 6,
                    yAxisID: 'yGiro'
                },
                {
                    label: '% Ruptura de Estoque',
                    data: SaulElkindData.estoque.rupturaPct,
                    type: 'line',
                    borderColor: '#f43f5e',
                    backgroundColor: '#f43f5e',
                    borderWidth: 3,
                    pointRadius: 6,
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

function createDemandaChart(canvasId, colors) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    const gradVenda = ctx.createLinearGradient(0, 0, 0, 300);
    gradVenda.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradVenda.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: SaulElkindData.demanda.meses,
            datasets: [
                {
                    label: 'Venda Real (R$)',
                    data: SaulElkindData.demanda.vendaReal,
                    borderColor: '#6366f1',
                    backgroundColor: gradVenda,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 5
                },
                {
                    label: 'Previsão IA (R$)',
                    data: SaulElkindData.demanda.previsaoIA,
                    borderColor: '#10b981',
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
                    callbacks: {
                        afterBody: function(items) {
                            return `Driver: ${SaulElkindData.demanda.eventos[items[0].dataIndex]}`;
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
                backgroundColor: ['#38bdf8', '#6366f1', '#a855f7', '#ec4899'],
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
                backgroundColor: ['#38bdf8', '#a855f7', '#10b981'],
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
                    backgroundColor: 'rgba(99, 102, 241, 0.85)',
                    borderRadius: 6
                },
                {
                    label: 'Margem Lucro Média (%)',
                    data: SaulElkindData.segmentos.margemPct,
                    backgroundColor: 'rgba(16, 185, 129, 0.85)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
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
                    borderColor: '#f43f5e',
                    backgroundColor: '#f43f5e',
                    borderWidth: 3,
                    pointRadius: 6,
                    tension: 0.3
                },
                {
                    label: 'Entorno Âncoras',
                    data: SaulElkindData.trafego.ancoras,
                    borderColor: '#f97316',
                    backgroundColor: '#f97316',
                    borderWidth: 3,
                    pointRadius: 6,
                    tension: 0.3
                },
                {
                    label: 'Trechos Periféricos',
                    data: SaulElkindData.trafego.perifericos,
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
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
