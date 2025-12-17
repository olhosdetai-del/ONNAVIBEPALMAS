from django.shortcuts import render
from django.http import JsonResponse
from .models import Cliente
import json
import sqlite3
import os
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'loja/index.html')

def catalogo(request):
    return render(request, 'loja/catalogo.html')

def produto_detalhe(request):
    return render(request, 'loja/produto.html')

def medidas(request):
    return render(request, 'loja/medidas.html')

def salvar_cliente(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nome = data.get('nome')
        email = data.get('email')
        medida = data.get('medida')

        # Caminho para o banco Clientes.db na raiz do projeto
        db_path = os.path.join(settings.BASE_DIR, 'Clientes.db')

        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            # Insere na tabela Cliente conforme a estrutura identificada
            cursor.execute("INSERT INTO Cliente (nome, email, medida) VALUES (?, ?, ?)", 
                           (nome, email, medida))
            conn.commit()
            conn.close()
            return JsonResponse({'status': 'sucesso'})
        except Exception as e:
            return JsonResponse({'status': 'erro', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'metodo_invalido'}, status=400)