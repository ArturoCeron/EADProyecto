import numpy as np
import pandas as pd
import csv
import os.path
import sys, json
pd.options.mode.chained_assignment = None

ruta = "https://raw.githubusercontent.com/ArturoCeron/EADProyecto/main/public/dataset/canciones.csv"
atributos = ["acousticness","danceability","energy","popularity", "tempo", "year"]
canciones = pd.read_csv(ruta)
canciones = canciones.drop_duplicates(subset=['artists','name'],keep='first')
normal = pd.read_csv(ruta)
normal = canciones.drop_duplicates(subset=['artists','name'],keep='first')
canciones["name"] = canciones["name"].str.lower()
canciones["artists"] = canciones["artists"].str.lower()
atributosCanciones = canciones[atributos]
nombres_y_Artistas = canciones[['name','artists']]
nombres = nombres_y_Artistas['name']
artistas = nombres_y_Artistas['artists']

lines = sys.stdin.readlines()

def normalize(column):
    max_value = column.max()
    min_value = column.min()
    result = (column - min_value) / (max_value - min_value)
    
    return result

for i in atributos:
    atributosCanciones[i] = normalize(canciones[i])
    

ENCODER = dict()
DECODER = dict()
comprobar = dict()
buscar = dict()

for i,cancion in enumerate(nombres_y_Artistas.values):
    if not (cancion[0],cancion[1]) in ENCODER:
        ENCODER[cancion[0],cancion[1]] = i
        DECODER[i] = cancion

for j,cancionJ in enumerate(nombres.values):
    if not (cancionJ) in comprobar:
        comprobar[cancionJ] = j
        buscar[j] = cancionJ

def recomendadas(cancion):
    global nombres_y_Artistas,atributosCanciones
    
    listaCanciones = []
    distancias = []
    
    for pos, objetivo in enumerate(atributosCanciones.values):
        distancias.append((np.linalg.norm(cancion - objetivo),pos)) #(distanciaObjetivo, posicionCancion)
    
    distancias.sort(key=lambda x:x[0])
    vacio = bool(sys.argv[3])
    if (vacio == False):
        cantidad = 10
    else:
        cantidad = int(sys.argv[3])
    for x in range(cantidad):
        listaCanciones.append(ENCODER[nombres_y_Artistas.values[distancias[x+1][1]][0],nombres_y_Artistas.values[distancias[x+1][1]][1]]) #(songName, songArtist)

    return listaCanciones

existeNombre = sys.argv[1].lower() in nombres.values
existeArtista = sys.argv[2].lower() in artistas.values
if existeNombre and existeArtista: 
    barrido = canciones.where(canciones['name'] == sys.argv[1].lower())
    conjunto = (sys.argv[2].lower())
    num = comprobar[sys.argv[1].lower()]
    verificar = DECODER[num]
    existe = sys.argv[2].lower() in verificar
    if (conjunto in barrido.values or existe):
        valor = ENCODER[sys.argv[1].lower(),sys.argv[2].lower()]
        test = atributosCanciones.values[valor]
        recommend = recomendadas(test) 
        resultados = []
        for song in recommend:
            resultados = str(normal['artists'].values[song]) + "@" + str(normal['name'].values[song]) + "@" + str(normal['year'].values[song]) + "@"
            print(str(resultados))
        sys.stdout.flush()
    else:
        print("Cancion no encontrada")  
else:
    print("Cancion no encontrada")  
