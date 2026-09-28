from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)

# Temporary list to store leaderboard entries in memory
leaderboard = []

@app.route('/')
def home():
    return send_from_directory('.', 'quizhome.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Route to accept new scores from JavaScript
@app.route('/submit-score', methods=['POST'])
def save_score():
    data = request.json
    player_name = data.get('name', 'Anonymous')
    score = data.get('score', 0)
    
    # Save entry to our leaderboard
    leaderboard.append({"name": player_name, "score": score})
    
    # Sort leaderboard by highest score first
    leaderboard.sort(key=lambda x: x['score'], reverse=True)
    print(f"Saved score for {player_name}: {score}")
    return jsonify({"message": "Score saved successfully!", "leaderboard": leaderboard})

# Route to get the current leaderboard list
@app.route('/get-leaderboard', methods=['GET'])
def get_leaderboard():
    return jsonify(leaderboard)

if __name__ == '__main__':
    app.run(port=5000, debug=True)