from flask import Flask,request, jsonify
from flask_cors import CORS
import base64   
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload-imagedata', methods=['POST'])
def upload_imagedata():
    data = request.get_json()

    if 'image' not in data:
        return jsonify({"message": "Nenhuma imagem enviada"}), 400
    
    # Obtém a imagem em base64
    image_base64 = data['image'].split(',')[1]  # Remove o prefixo "data:image/png;base64,"

    # Decodifica a imagem base64
    image_data = base64.b64decode(image_base64)

    # Salva a imagem como PNG
    image_path = os.path.join(UPLOAD_FOLDER, 'written_number.png')
    with open(image_path, 'wb') as f:
        f.write(image_data)

    return jsonify({"message": f"Imagem enviada e salva como {image_path}"})


if __name__ == '__main__':
    app.run(port=5000)