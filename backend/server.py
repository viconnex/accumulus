import json

from flask import Flask
from flask import request
from flask_cors import CORS


from nlp import word_similarity

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
        similarity_words = word_similarity.similarity(word1, word2)

        return '''<h1>The firstword value is: {}</h1>
                  <h1>The secondword value is: {}</h1>
                  <h1>Similarity is: {}</h1>
                  '''.format(word1, word2, similarity_words)

    return '''<form method="POST">
                  Firstword: <input type="text" name="word1"><br>
                  Secondword: <input type="text" name="word2"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''


@app.route('/word_music_sheet', methods=['POST']) #GET requests will be blocked
def similarity_word_listchords():
    req_data = request.get_json()
    print(req_data)

    word = req_data['word']
    list_chords = req_data['chords']
    word_similarity.compute_similarity_word_listchords(
        word,
        list_chords
    )
    return json.dumps(list_chords)



if __name__ == '__main__':
    app.run(debug=True, port=5000)
