from time import sleep
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/sentiment", methods=["POST"])
def get_sentiment():
    sleep(random.randrange(2,4)) # Simulate a delay
    data = request.json
    if data is None or "text" not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400
    text = data.get("text")
    print(text)
    print("Generating sentiment from:", text)
    random_sentiment = get_random_sentiment(text)
    print("Generated sentiment:", random_sentiment)
    return random_sentiment

def get_random_sentiment(text: str) -> dict:
    sentiments = ["positive", "negative", "neutral"]
    return {
        "sentiment": random.choice(sentiments),
        "confidence": round(random.random(), 2),
        "text": text
    }

if __name__ == "__main__":
    app.run(debug=True, port=9000)
