import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def gerar_graficos_estaticos(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    sns.set_theme(style="whitegrid", palette="muted")
    plt.rcParams['font.sans-serif'] = 'Arial'

    # Carregar dados
    df_estoque = pd.read_csv(os.path.join(data_dir, '1_gestao_estoque.csv'))
    df_demanda = pd.read_csv(os.path.join(data_dir, '2_previsao_demanda_ia.csv'))
    df_funil = pd.read_csv(os.path.join(data_dir, '3_funil_meta_ads.csv'))
    df_omnichannel = pd.read_csv(os.path.join(data_dir, '4_logistica_omnichannel.csv'))
    df_segmentos = pd.read_csv(os.path.join(data_dir, '5_divisao_segmentos.csv'))
    df_trafego = pd.read_csv(os.path.join(data_dir, '6_mapa_trafego.csv'))

    fig, axes = plt.subplots(3, 2, figsize=(18, 16))
    fig.suptitle('DASHBOARD EXECUTIVO: VAREJO NA AV. SAUL ELKIND (LONDRINA/PR)\nAnálise Micro e Macro para Tomada de Decisão (Senac)', 
                 fontsize=18, fontweight='bold', color='#0F172A', y=0.98)

    # 1. Giro vs Ruptura
    ax1 = axes[0, 0]
    color_giro = '#1E3A8A'
    color_ruptura = '#DC2626'
    bars = ax1.bar(df_estoque['Perfil_Loja'], df_estoque['Giro_Estoque_Dias'], color=color_giro, alpha=0.85, width=0.45)
    ax1.set_ylabel('Giro de Estoque (Dias)', color=color_giro, fontweight='bold')
    ax1.set_title('1. Giro de Estoque vs Ruptura de Estoque', fontsize=12, fontweight='bold')
    
    for bar in bars:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2, yval + 2, f'{yval}d', ha='center', va='bottom', color=color_giro, fontweight='bold')

    ax1_twin = ax1.twinx()
    ax1_twin.plot(df_estoque['Perfil_Loja'], df_estoque['Ruptura_Pct'], color=color_ruptura, marker='o', linewidth=3, markersize=8)
    ax1_twin.set_ylabel('% Ruptura', color=color_ruptura, fontweight='bold')
    ax1_twin.grid(False)

    # 2. Venda vs IA
    ax2 = axes[0, 1]
    ax2.plot(df_demanda['Mes'], df_demanda['Venda_Real_BRL'] / 1000, marker='o', color='#2563EB', linewidth=2.5, label='Venda Real (R$ mil)')
    ax2.plot(df_demanda['Mes'], df_demanda['Previsao_IA_BRL'] / 1000, marker='s', color='#10B981', linestyle='--', linewidth=2, label='Previsão IA (R$ mil)')
    ax2.set_title('2. Previsão de Demanda com IA vs Venda Real', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Faturamento (R$ mil)', fontweight='bold')
    ax2.legend(loc='upper left')

    # 3. Share Omnichannel
    ax3 = axes[1, 0]
    sns.barplot(data=df_omnichannel, x='Canal', y='Share_Faturamento_Pct', ax=ax3, palette='Blues_r')
    ax3.set_title('3. Share de Faturamento por Canal Omnichannel', fontsize=12, fontweight='bold')
    ax3.set_ylabel('% Faturamento', fontweight='bold')
    ax3.set_xlabel('')

    for i, p in enumerate(ax3.patches):
        height = p.get_height()
        sla = df_omnichannel['SLA_Resposta_Minutos'].iloc[i]
        ax3.annotate(f'{height:.1f}%\nSLA: {sla}m', (p.get_x() + p.get_width() / 2., height / 2),
                     ha='center', va='center', color='white', fontweight='bold', fontsize=10)

    # 4. Share vs Margem
    ax4 = axes[1, 1]
    sns.scatterplot(data=df_segmentos, x='Share_Faturamento_Pct', y='Margem_Lucro_Pct', size='Qtd_Empresas', 
                    sizes=(200, 1000), hue='Segmento', ax=ax4, palette='Set2', legend=False)
    ax4.set_title('4. Share de Faturamento vs Margem de Lucro por Segmento', fontsize=12, fontweight='bold')
    ax4.set_xlabel('Share Faturamento (%)', fontweight='bold')
    ax4.set_ylabel('Margem Lucro Média (%)', fontweight='bold')
    
    for i in range(df_segmentos.shape[0]):
        ax4.text(df_segmentos['Share_Faturamento_Pct'][i]+0.8, df_segmentos['Margem_Lucro_Pct'][i], 
                 df_segmentos['Segmento'][i], fontsize=9, fontweight='bold')

    # 5. Mapa de Tráfego (Heatmap)
    ax5 = axes[2, 0]
    df_traf_hm = df_trafego.set_index('Periodo')
    sns.heatmap(df_traf_hm, annot=True, fmt=',d', cmap='YlOrRd', ax=ax5, cbar_kws={'label': 'Pessoas/Dia'})
    ax5.set_title('5. Tráfego Diario de Consumidores (Pontos Quentes)', fontsize=12, fontweight='bold')
    ax5.set_yticklabels(ax5.get_yticklabels(), rotation=0)

    # 6. Funil Meta Ads
    ax6 = axes[2, 1]
    y_pos = np.arange(len(df_funil))
    ax6.barh(y_pos, df_funil['Volume'], color='#8B5CF6', alpha=0.85)
    ax6.set_yticks(y_pos)
    ax6.set_yticklabels(df_funil['Etapa'], fontweight='bold')
    ax6.invert_yaxis()
    ax6.set_xscale('log')
    ax6.set_title('6. Funil Meta Ads (Escala Logarítmica)', fontsize=12, fontweight='bold')
    ax6.set_xlabel('Volume (Log)', fontweight='bold')

    for i, (val, tx) in enumerate(zip(df_funil['Volume'], df_funil['Taxa_Conversao'])):
        ax6.text(val * 1.15, i, f'{val:,} ({tx})', va='center', fontweight='bold', color='#4C1D95')

    plt.tight_layout(rect=[0, 0, 1, 0.96])
    filepath = os.path.join(output_dir, 'dashboard_estatico.png')
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Dashboard estatico salvo em: {filepath}")

if __name__ == '__main__':
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(root_dir, 'data')
    output_dir = os.path.join(root_dir, 'output')
    gerar_graficos_estaticos(data_dir, output_dir)
