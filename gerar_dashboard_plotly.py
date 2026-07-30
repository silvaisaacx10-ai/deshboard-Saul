import os
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def gerar_dashboard_plotly(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    # Carregar dados
    df_estoque = pd.read_csv(os.path.join(data_dir, '1_gestao_estoque.csv'))
    df_demanda = pd.read_csv(os.path.join(data_dir, '2_previsao_demanda_ia.csv'))
    df_funil = pd.read_csv(os.path.join(data_dir, '3_funil_meta_ads.csv'))
    df_omnichannel = pd.read_csv(os.path.join(data_dir, '4_logistica_omnichannel.csv'))
    df_segmentos = pd.read_csv(os.path.join(data_dir, '5_divisao_segmentos.csv'))
    df_trafego = pd.read_csv(os.path.join(data_dir, '6_mapa_trafego.csv'))

    fig = make_subplots(
        rows=3, cols=2,
        subplot_titles=(
            "1. Giro de Estoque vs Ruptura (Tecnologia)",
            "2. Previsão de Demanda com IA vs Venda Real",
            "3. Funil de Vendas Meta Ads (Raio 4km)",
            "4. Logística Omnichannel & SLA",
            "5. Share de Faturamento por Segmento",
            "6. Mapa de Tráfego de Consumidores (Pessoas/Dia)"
        ),
        specs=[[{"type": "xy"}, {"type": "xy"}],
               [{"type": "funnel"}, {"type": "domain"}],
               [{"type": "domain"}, {"type": "xy"}]]
    )

    # 1. Giro vs Ruptura
    fig.add_trace(go.Bar(x=df_estoque['Perfil_Loja'], y=df_estoque['Giro_Estoque_Dias'], name="Giro (Dias)", marker_color='#1E3A8A'), row=1, col=1)

    # 2. Venda Real vs IA
    fig.add_trace(go.Scatter(x=df_demanda['Mes'], y=df_demanda['Venda_Real_BRL'], name="Venda Real (R$)", mode='lines+markers', line=dict(color='#2563EB', width=3)), row=1, col=2)
    fig.add_trace(go.Scatter(x=df_demanda['Mes'], y=df_demanda['Previsao_IA_BRL'], name="Previsão IA (R$)", mode='lines+markers', line=dict(color='#10B981', dash='dash')), row=1, col=2)

    # 3. Funil
    fig.add_trace(go.Funnel(y=df_funil['Etapa'], x=df_funil['Volume'], textinfo="value+percent initial", marker={"color": ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"]}), row=2, col=1)

    # 4. Omnichannel (Rosca)
    fig.add_trace(go.Pie(labels=df_omnichannel['Canal'], values=df_omnichannel['Share_Faturamento_Pct'], hole=0.4, name="Omnichannel"), row=2, col=2)

    # 5. Segmentos (Pie)
    fig.add_trace(go.Pie(labels=df_segmentos['Segmento'], values=df_segmentos['Share_Faturamento_Pct'], hole=0.3, name="Segmentos"), row=3, col=1)

    # 6. Tráfego de Consumidores
    fig.add_trace(go.Scatter(x=df_trafego['Periodo'], y=df_trafego['Coracao_Cincao'], name="Coração Cincão", mode='lines+markers', line=dict(color='#EF4444', width=3)), row=3, col=2)
    fig.add_trace(go.Scatter(x=df_trafego['Periodo'], y=df_trafego['Entorno_Ancoras'], name="Entorno Âncoras", mode='lines+markers', line=dict(color='#F59E0B', width=3)), row=3, col=2)
    fig.add_trace(go.Scatter(x=df_trafego['Periodo'], y=df_trafego['Trechos_Perifericos'], name="Trechos Periféricos", mode='lines+markers', line=dict(color='#10B981', width=3)), row=3, col=2)

    fig.update_layout(
        height=1200,
        title_text="<b>DASHBOARD INTERATIVO: COMÉRCIO DA AV. SAUL ELKIND (LONDRINA/PR)</b><br><sup>Projeto de Pesquisa em Parceria com Alunos de Administração do Senac</sup>",
        template="plotly_white",
        showlegend=True
    )

    filepath = os.path.join(output_dir, 'dashboard_interativo.html')
    fig.write_html(filepath)
    print(f"[OK] Dashboard interativo HTML salvo em: {filepath}")

if __name__ == '__main__':
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(root_dir, 'data')
    output_dir = os.path.join(root_dir, 'output')
    gerar_dashboard_plotly(data_dir, output_dir)
