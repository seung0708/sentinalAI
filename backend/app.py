from flask import Flask, request
import json
#from feature_engineering import
app = Flask(__name__)

@app.route('/')
@app.route('/predict-fraud', methods=['POST'])
def predict_fraud():
    data = request.json
    print(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)