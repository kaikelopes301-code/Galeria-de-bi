
import os
import shutil

dir_cliente = input('Digite o caminho da pasta do cliente: ').strip()
cliente_nome = os.path.basename(os.path.normpath(dir_cliente))


relatorios = [f for f in os.listdir(dir_cliente) if f.endswith('.pbix')]

if not relatorios:
    print('Nenhum relatório .pbix encontrado na pasta.')
    exit()

print('\nRelatórios encontrados:')
for idx, rel in enumerate(relatorios, 1):
    print(f'{idx}: {rel}')

# Usuário escolhe relatórios (ex: 1,3,4)
escolha = input('\nDigite os números dos relatórios que deseja organizar (separados por vírgula): ')
indices = [int(i.strip())-1 for i in escolha.split(',') if i.strip().isdigit() and 0 < int(i.strip()) <= len(relatorios)]


# Função para padronizar nomes (sem acentos, espaços, caracteres especiais)
import unicodedata
import re
def padronizar_nome(nome):
    nome = unicodedata.normalize('NFKD', nome).encode('ASCII', 'ignore').decode('ASCII')
    nome = re.sub(r'[^a-zA-Z0-9_]', '_', nome)
    nome = re.sub(r'_+', '_', nome)
    nome = nome.lower().strip('_')
    
    # Remove palavras comuns e desnecessárias, mas mantém datas (anos com 4 dígitos)
    palavras_remover = ['relatorio', 'de', 'do', 'da', 'dos', 'das', 'para', 'com', 'em', 'e', 'o', 'a', 'os', 'as']
    partes = nome.split('_')
    partes_limpas = [p for p in partes if p and p not in palavras_remover and (not p.isdigit() or len(p) == 4)]
    
    return '_'.join(partes_limpas) if partes_limpas else nome

cliente_nome_pad = padronizar_nome(cliente_nome)

for idx in indices:
    relatorio = relatorios[idx]
    nome_base = os.path.splitext(relatorio)[0]
    nome_base_pad = padronizar_nome(nome_base)
    pasta_destino = os.path.join(dir_cliente, f'{nome_base_pad}_{cliente_nome_pad}')
    os.makedirs(pasta_destino, exist_ok=True)
    origem = os.path.join(dir_cliente, relatorio)
    destino = os.path.join(pasta_destino, relatorio)
    shutil.move(origem, destino)
    print(f'Movido: {relatorio} -> {pasta_destino}')

print('\nOrganização concluída!')
