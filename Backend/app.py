from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/summarize', methods=['POST'])
def summarize():
	data = request.json
	document_text = data.get('text', '')
	# Placeholder for AI summary
	summary = f"Summary of: {document_text[:50]}..."
	return jsonify({'summary': summary})

@app.route('/api/explain', methods=['POST'])
def explain():
	data = request.json
	clause = data.get('clause', '')
	explanation = f"Explanation of: {clause[:50]}..."
	return jsonify({'explanation': explanation})

@app.route('/api/ask', methods=['POST'])
def ask():
	data = request.json
	question = data.get('question', '')
	document_text = data.get('text', '')
	answer = f"Answer to '{question}' about document."
	return jsonify({'answer': answer})

if __name__ == '__main__':
	app.run(debug=True)
