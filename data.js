/* ==========================================================================
   AVENIDA SAUL ELKIND RETAIL DASHBOARD - DATA ENGINE
   ========================================================================== */

const SaulElkindData = {
    // 1. Gestão de Estoque x Tecnologia
    estoque: {
        labels: ['Loja Roupas s/ Sistema\n(Caderno/Excel)', 'Loja c/ ERP Local\n(Tradicional)', 'Loja c/ ERP Nuvem +\nWhatsApp IA'],
        giroDias: [115, 68, 42],
        rupturaPct: [23.5, 11.2, 4.1]
    },

    // 2. Previsão de Demanda com IA (12 Meses)
    demanda: {
        meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        vendaReal: [85000, 78000, 92000, 98000, 125000, 148000, 138000, 110000, 95000, 108000, 135000, 215000],
        previsaoIA: [83500, 79000, 90500, 97000, 122000, 145000, 136000, 112000, 96000, 106500, 132000, 210000],
        eventos: ['Liq. Pós-Natal', 'Volta às Aulas', '5º Dia Útil', 'Outono', 'Dia das Mães', 'Frio Intenso Inverno', 'Feira/Frio Intenso', 'Dia dos Pais', 'Primavera', 'Dia das Crianças', 'Black Friday', 'Natal + 13º Salário']
    },

    // 3. Funil de Vendas Meta Ads (Raio 4km)
    funil: {
        etapas: ['Impressões Ads', 'Cliques no Link (CTR)', 'Mensagens WhatsApp', 'Vendas Fechadas'],
        volumes: [85000, 2380, 298, 74],
        taxas: ['100.0%', '2.8%', '12.5%', '24.8%']
    },

    // 4. Logística Omnichannel & SLA
    omnichannel: {
        canais: ['Loja Física (Presencial)', 'WhatsApp Manual', 'WhatsApp IA + Retire'],
        sharePct: [58.0, 24.0, 18.0],
        slaMinutos: [0, 45, 1.5],
        nps: [86, 62, 94]
    },

    // 5. Divisão por Segmento (As 500 Empresas)
    segmentos: {
        labels: ['Supermercados & Atacarejos', 'Móveis & Eletro (Âncoras)', 'Vestuário & Calçados', 'Farmácias & Saúde', 'Gastronomia Noturna'],
        sharePct: [38.0, 26.0, 16.0, 12.0, 8.0],
        margemPct: [8.5, 14.0, 28.0, 17.5, 22.0],
        qtdLojas: [15, 22, 180, 45, 238]
    },

    // 6. Mapa de Tráfego de Consumidores (Pontos Quentes)
    trafego: {
        periodos: ['Seg a Qui (Média)', '5º Dia Útil (Pico)', 'Sábado (Comercial)', 'Domingo (Feira 1km)'],
        cincao: [14500, 26000, 22000, 35000],
        ancoras: [9800, 21500, 16000, 7500],
        perifericos: [3200, 5500, 4800, 3000]
    }
};
