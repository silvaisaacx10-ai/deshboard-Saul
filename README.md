# 📊 Varejo & Tecnologia na Avenida Saul Elkind (Londrina/PR)
## Projeto Analytics em Parceria com Alunos de Administração do Senac

Este repositório contém a engine de dados em Python para modelar, gerar datasets e visualizar os **gargalos operacionais (Visão Micro)** e as **oportunidades de mercado (Visão Macro)** das 500 empresas da Av. Saul Elkind na Zona Norte de Londrina/PR.

---

## 📁 Estrutura do Projeto

```
saul_elkind_analytics/
├── data/                       # Arquivos CSV gerados com os dados dos 6 indicadores
│   ├── 1_gestao_estoque.csv
│   ├── 2_previsao_demanda_ia.csv
│   ├── 3_funil_meta_ads.csv
│   ├── 4_logistica_omnichannel.csv
│   ├── 5_divisao_segmentos.csv
│   └── 6_mapa_trafego.csv
├── src/                        # Scripts Python de geração de gráficos
│   ├── gerar_graficos_estaticos.py  (Seaborn / Matplotlib -> PNG)
│   └── gerar_dashboard_plotly.py    (Plotly -> HTML Interativo)
├── output/                     # Artefatos gerados
│   ├── dashboard_estatico.png
│   └── dashboard_interativo.html
├── main.py                     # Pipeline unificado de execução
├── requirements.txt            # Dependências das bibliotecas Python
└── README.md                   # Documentação do projeto
```

---

## ⚙️ Como Executar o Projeto

1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

2. Execute a pipeline completa:
   ```bash
   python main.py
   ```

3. Abra o arquivo `output/dashboard_interativo.html` no seu navegador para navegar interativamente no Dashboard do projeto!

---

## 📌 Os 6 Indicadores Analisados

### VISÃO MICRO (Gargalos das Lojas)
1. **Gestão de Estoque (Tecnologia):** Giro de Estoque (dias) vs. Ruptura (%) entre 3 perfis de lojas.
2. **Previsão de Demanda com IA:** Comparativo de Venda Real vs. Modelo de IA ao longo de 12 meses com destaques nos picos do 5º dia útil, frio intenso e Natal.
3. **Gestão de Tráfego & Estoque Encalhado:** Funil de conversão de campanha de tráfego pago (Meta Ads) no raio de 4km.
4. **Logística Omnichannel (Atendimento):** % do Faturamento e SLA de resposta em minutos (Loja Física vs. WhatsApp Manual vs. WhatsApp IA).

### VISÃO MACRO (Oportunidades na Avenida)
5. **Divisão de Faturamento por Segmento:** Share financeiro e margem de lucro dos 5 grandes setores das 500 empresas da Saul Elkind.
6. **Mapa de Tráfego de Consumidores:** Foot traffic estimado nos pontos quentes (Coração do Cincão, Entorno das Âncoras e Trechos Periféricos) nos diferentes dias da semana (destaque para a Feira de Domingo).

---

## 🎯 Instruções para Excel / Power BI

- Todos os arquivos na pasta `data/*.csv` podem ser importados no **Power BI (Obter Dados -> Texto/CSV)** ou abertos diretamente no **Excel**.
- O arquivo `output/dashboard_interativo.html` pode ser apresentado diretamente em telas ou navegadores durante a banca de trabalhos do Senac.
