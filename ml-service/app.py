from flask import Flask, request, jsonify
from flask_cors import CORS
import predict
from preprocess import validate_input

app = Flask(__name__)
CORS(app)

# Load model at startup
predict.load_model()


@app.route('/health', methods=['GET'])
def health():
    if predict.model_loaded:
        return jsonify({'status': 'healthy', 'model_loaded': True, 'error': None})
    return jsonify({'status': 'unhealthy', 'model_loaded': False, 'error': predict.load_error}), 503


@app.route('/predict', methods=['POST'])
def predict_route():
    if not predict.model_loaded:
        return jsonify({'error': 'Model not loaded', 'details': predict.load_error}), 503

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Validate input
    errors = validate_input(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    try:
        result = predict.make_prediction(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
