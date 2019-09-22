from flask import Flask
from flask import request
app = Flask(__name__)


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
        firstword = request.form.get('firstword')
        secondword = request.form['secondword']

        return '''<h1>The firstword value is: {}</h1>
                  <h1>The secondword value is: {}</h1>'''.format(firstword, secondword)

    return '''<form method="POST">
                  Firstword: <input type="text" name="firstword"><br>
                  Secondword: <input type="text" name="secondword"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''


@app.route('/jsonexample', methods=['POST']) #GET requests will be blocked
def json_example():
    req_data = request.get_json()
    print(req_data)

    language = req_data.get('language', "no")
    print(language)
    framework = req_data.get('framework', "no")
    python_version = req_data.get('version_info', "no") #two keys are needed because of the nested object
    example = req_data.get('examples', "no") #an index is needed because of the array
    boolean_test = req_data.get('boolean_test', "no")

    return '''
           The language value is: {}
           The framework value is: {}
           The Python version is: {}
           The item at index 0 in the example list is: {}
           '''.format(language, framework, python_version, example, boolean_test)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
