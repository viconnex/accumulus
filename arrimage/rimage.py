import json
import os

# os.chdir('arrimage')

dictionnaire = open('liste.de.mots.francais.frgut.txt', 'r')
# dictionnaire = open('test.txt', 'r')

rimageCount = 0
dictionnage = {}
# limit = 1000
# i=0
for line in dictionnaire:
    # if i == limit:
        # break
    word = line.split("\n")[0]
    decoupage = word.split("age")
    if len(decoupage) > 1 and decoupage[-1]=='':
        dictionnage[word] = len(word)
        print(word)
        rimageCount += 1
    # i+=1

file = open('dictionnage.json', 'w+')
json.dump(dictionnage, file)
print(rimageCount)
# 1327 mots