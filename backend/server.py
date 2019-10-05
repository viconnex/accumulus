import json

from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/name/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/fakesimilarity')
def return_random_float():
    return str(0.2)


@app.route('/similaritya', methods=['GET', 'POST'])
def similarity():
    if request.method == 'POST':  #this block is only entered when the form is submitted
        word1 = request.form.get('word1')
        word2 = request.form['word2']
        similarity_words = _similaritywords(word1, word2)

        return '''<h1>The firstword value is: {}</h1>
                  <h1>The secondword value is: {}</h1>
                  <h1>Similarity is: {}</h1>
                  '''.format(word1, word2, similarity_words)

    return '''<form method="POST">
                  Firstword: <input type="text" name="word1"><br>
                  Secondword: <input type="text" name="word2"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''


WORDEMBEDDER = None


def _similaritywords(word1, word2):
    """todo"""
    global WORDEMBEDDER
    if WORDEMBEDDER is None:
        from gensim.models import KeyedVectors
        fname = "resources/cc.fr.300.vec"
        # fname = resources/wiki.multi.fr.vec
        limit = 10000
        print("Loading word2Vec from fname: %s" % fname)
        WORDEMBEDDER = KeyedVectors.load_word2vec_format(
            fname, binary=False,
            limit=limit)

    assert word1 in WORDEMBEDDER
    assert word1 in WORDEMBEDDER
    return WORDEMBEDDER.similarity(word1, word2)


def _compute_location(similarity1, similarity2):
    return similarity2 / (similarity1 + similarity2)


@app.route('/word_music_sheet', methods=['POST']) #GET requests will be blocked
def similarity_word_listchords():
    req_data = request.get_json()
    print(req_data)

    word = req_data['word']
    list_chords = req_data['chords']
    for chords in list_chords:
         similarity1 = _similaritywords(word, chords["leftNote"])
         similarity2 = _similaritywords(word, chords["rightNote"])
         chords["note"] = _compute_location(similarity1, similarity2)
    return json.dumps(list_chords)



if __name__ == '__main__':
    app.run(debug=True, port=5000)
