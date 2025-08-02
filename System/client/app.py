# from client.app import Flask, render_template, request
# import subprocess

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')  

# @app.route('/run', methods=['POST'])
# def run():
#     subprocess.run(["python", "I:\\Projects\\Climate-Resilient-Agriculture\\System\\Google_Earth_Engine\\export_ndvi.py"])
#     return 'Python script ran successfully.'

# if __name__ == '__main__':
#     app.run(debug=True)





from flask import Flask, render_template, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/run', methods=['POST'])
def run():
    result = subprocess.run(
        ["python", r"I:\Projects\Climate-Resilient-Agriculture\System\Google_Earth_Engine\export_ndvi.py"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        return f'Script ran successfully.<br><pre>{result.stdout}</pre>'
    else:
        return f'Error running script:<br><pre>{result.stderr}</pre>'

if __name__ == '__main__':
    app.run(debug=True)
