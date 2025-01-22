<<<<<<< HEAD
from flask import Flask, jsonify, request, send_from_directory
from datetime import datetime
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load data from JSON file
with open('wisata_data.json', 'r') as file:
    wisata_data = json.load(file)

@app.route('/api/search', methods=['GET'])
def search_locations():
    query = request.args.get('q', '').lower()
    results = [
        item for item in wisata_data['Wisata']
        if query in item['lokasi'].lower() or query in item['negara'].lower()
    ]
    return jsonify(results)

@app.route('/api/attraction/<int:id>', methods=['GET']) 
def get_attraction(id):
    attraction = next((item for item in wisata_data['Wisata'] if item['id'] == id), None)
    if attraction:
        return jsonify(attraction)
    return jsonify({"error": "Attraction not found"}), 404

@app.route('/api/recommendations/<int:id>/<category>', methods=['GET'])
def get_recommendations(id, category):
    attraction = next((item for item in wisata_data['Wisata'] if item['id'] == id), None)
    if not attraction:
        return jsonify({"error": "Attraction not found"}), 404

    print(f"Debug: Category - {category}")  # Debug print
    print(f"Debug: Attraction data - {attraction}")  # Debug print

    def get_item(key, default=""):
        value = attraction.get(key, default)
        print(f"Debug: Getting {key} - Value: {value}")  # Debug print
        return value

    if category.lower() == 'fotographer':
        main_item = {
            "name": get_item("Fotographer"),
            "rating": get_item("rating_fotographer"),
            "description": get_item("description_fotographer"),
            "image": get_item("url_image_fotographer"),
            "booking": "",
            "estimasi_biaya": get_item("estimasi_biaya_fotographer", "Harga tidak tersedia")
        }
    elif category.lower() == 'guide':
        main_item = {
            "name": get_item("guide"),
            "rating": get_item("rating_guide"),
            "description": get_item("description_guide"),
            "image": get_item("url_image_guide"),
            "booking": get_item("booking_guide"),
            "estimasi_biaya": get_item("estimasi_biaya_guide", "Harga tidak tersedia")
        }
    elif category.lower() == 'oleh-oleh':
        main_item = {
            "name": get_item("oleh-oleh"),
            "rating": get_item("rating_oleh"),
            "description": get_item("description_oleh"),
            "image": get_item("url_image_oleh"),
            "booking": "",
            "estimasi_biaya": get_item("harga_oleh")
        }
    elif category == 'penerbangan':
        main_item = {
            "name": get_item("nama_penerbangan"),
            "rating": get_item("rating_penerbangan"),
            "description": get_item("description_penerbangan"),
            "image": get_item("url_image_penerbangan"),
            "booking": get_item("booking_penerbangan"),
            "estimasi_biaya": get_item("Estimasi_biaya_penerbangan")
        }
    else:
        main_item = {
            "name": get_item(category),
            "rating": get_item(f"rating_{category}"),
            "description": get_item(f"description_{category}"),
            "image": get_item(f"url_image_{category}"),
            "booking": get_item(f"booking_{category}"),
            "estimasi_biaya": get_item(f"estimasi_biaya_{category}")
        }

    def get_recommendation(i):
        if category.lower() == 'fotographer':
            return {
                "name": get_item(f"Fotographer_rekomendasi_{i}"),
                "rating": get_item(f"rating_fotographer_rekomendasi_{i}"),
                "description": get_item(f"description_fotographer_rekomendasi_{i}"),
                "image": get_item(f"url_image_fotographer_rekomendasi_{i}"),
                "booking": "",
                "estimasi_biaya": get_item(f"estimasi_biaya_fotographer_rekomendasi_{i}", "Harga tidak tersedia")
            }
        elif category.lower() == 'guide':
            return {
                "name": get_item(f"guide_rekomendasi_{i}"),
                "rating": get_item(f"rating_guide_rekomendasi_{i}"),
                "description": get_item(f"description_guide_rekomendasi_{i}"),
                "image": get_item(f"url_image_guide_rekomendasi_{i}"),
                "booking": get_item(f"booking_guide_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_guide_rekomendasi_{i}", "Harga tidak tersedia")
            }
        elif category.lower() == 'oleh-oleh':
            return {
                "name": get_item(f"oleh-oleh_rekomendasi_{i}"),
                "rating": get_item(f"rating_oleh_rekomendasi_{i}"),
                "description": get_item(f"description_oleh_rekomendasi_{i}"),
                "image": get_item(f"url_image_oleh_rekomendasi_{i}"),
                "booking": "",
                "estimasi_biaya": get_item(f"harga_oleh_rekomendasi_{i}")
            }
        elif category == 'penerbangan':
            return {
                "name": get_item(f"nama_penerbangan_rekomendasi_{i}"),
                "rating": get_item(f"rating_penerbangan_rekomendasi_{i}"),
                "description": get_item(f"description_penerbangan_rekomendasi_{i}"),
                "image": get_item(f"url_image_penerbangan_rekomendasi_{i}"),
                "booking": get_item(f"booking_penerbangan_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_penerbangan_rekomendasi_{i}")
            }
        else:
            return {
                "name": get_item(f"{category}_rekomendasi_{i}"),
                "rating": get_item(f"rating_{category}_rekomendasi_{i}"),
                "description": get_item(f"description_{category}_rekomendasi_{i}"),
                "image": get_item(f"url_image_{category}_rekomendasi_{i}"),
                "booking": get_item(f"booking_{category}_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_{category}_rekomendasi_{i}")
            }

    recommendations = [get_recommendation(i) for i in range(1, 3)]

    result = {"main": main_item, "recommendations": recommendations}
    print(f"Debug: Result - {result}")  # Debug print
    return jsonify(result)

@app.route('/uploads/images/<filename>')
def serve_image(filename):
    return send_from_directory(os.path.join('uploads', 'images'), filename)

if __name__ == '__main__':
=======
from flask import Flask, jsonify, request, send_from_directory
from datetime import datetime
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load data from JSON file
with open('wisata_data.json', 'r') as file:
    wisata_data = json.load(file)

@app.route('/api/search', methods=['GET'])
def search_locations():
    query = request.args.get('q', '').lower()
    results = [
        item for item in wisata_data['Wisata']
        if query in item['lokasi'].lower() or query in item['negara'].lower()
    ]
    return jsonify(results)

@app.route('/api/attraction/<int:id>', methods=['GET']) 
def get_attraction(id):
    attraction = next((item for item in wisata_data['Wisata'] if item['id'] == id), None)
    if attraction:
        return jsonify(attraction)
    return jsonify({"error": "Attraction not found"}), 404

@app.route('/api/recommendations/<int:id>/<category>', methods=['GET'])
def get_recommendations(id, category):
    attraction = next((item for item in wisata_data['Wisata'] if item['id'] == id), None)
    if not attraction:
        return jsonify({"error": "Attraction not found"}), 404

    print(f"Debug: Category - {category}")  # Debug print
    print(f"Debug: Attraction data - {attraction}")  # Debug print

    def get_item(key, default=""):
        value = attraction.get(key, default)
        print(f"Debug: Getting {key} - Value: {value}")  # Debug print
        return value

    if category.lower() == 'fotographer':
        main_item = {
            "name": get_item("Fotographer"),
            "rating": get_item("rating_fotographer"),
            "description": get_item("description_fotographer"),
            "image": get_item("url_image_fotographer"),
            "booking": "",
            "estimasi_biaya": get_item("estimasi_biaya_fotographer", "Harga tidak tersedia")
        }
    elif category.lower() == 'guide':
        main_item = {
            "name": get_item("guide"),
            "rating": get_item("rating_guide"),
            "description": get_item("description_guide"),
            "image": get_item("url_image_guide"),
            "booking": get_item("booking_guide"),
            "estimasi_biaya": get_item("estimasi_biaya_guide", "Harga tidak tersedia")
        }
    elif category.lower() == 'oleh-oleh':
        main_item = {
            "name": get_item("oleh-oleh"),
            "rating": get_item("rating_oleh"),
            "description": get_item("description_oleh"),
            "image": get_item("url_image_oleh"),
            "booking": "",
            "estimasi_biaya": get_item("harga_oleh")
        }
    elif category == 'penerbangan':
        main_item = {
            "name": get_item("nama_penerbangan"),
            "rating": get_item("rating_penerbangan"),
            "description": get_item("description_penerbangan"),
            "image": get_item("url_image_penerbangan"),
            "booking": get_item("booking_penerbangan"),
            "estimasi_biaya": get_item("Estimasi_biaya_penerbangan")
        }
    else:
        main_item = {
            "name": get_item(category),
            "rating": get_item(f"rating_{category}"),
            "description": get_item(f"description_{category}"),
            "image": get_item(f"url_image_{category}"),
            "booking": get_item(f"booking_{category}"),
            "estimasi_biaya": get_item(f"estimasi_biaya_{category}")
        }

    def get_recommendation(i):
        if category.lower() == 'fotographer':
            return {
                "name": get_item(f"Fotographer_rekomendasi_{i}"),
                "rating": get_item(f"rating_fotographer_rekomendasi_{i}"),
                "description": get_item(f"description_fotographer_rekomendasi_{i}"),
                "image": get_item(f"url_image_fotographer_rekomendasi_{i}"),
                "booking": "",
                "estimasi_biaya": get_item(f"estimasi_biaya_fotographer_rekomendasi_{i}", "Harga tidak tersedia")
            }
        elif category.lower() == 'guide':
            return {
                "name": get_item(f"guide_rekomendasi_{i}"),
                "rating": get_item(f"rating_guide_rekomendasi_{i}"),
                "description": get_item(f"description_guide_rekomendasi_{i}"),
                "image": get_item(f"url_image_guide_rekomendasi_{i}"),
                "booking": get_item(f"booking_guide_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_guide_rekomendasi_{i}", "Harga tidak tersedia")
            }
        elif category.lower() == 'oleh-oleh':
            return {
                "name": get_item(f"oleh-oleh_rekomendasi_{i}"),
                "rating": get_item(f"rating_oleh_rekomendasi_{i}"),
                "description": get_item(f"description_oleh_rekomendasi_{i}"),
                "image": get_item(f"url_image_oleh_rekomendasi_{i}"),
                "booking": "",
                "estimasi_biaya": get_item(f"harga_oleh_rekomendasi_{i}")
            }
        elif category == 'penerbangan':
            return {
                "name": get_item(f"nama_penerbangan_rekomendasi_{i}"),
                "rating": get_item(f"rating_penerbangan_rekomendasi_{i}"),
                "description": get_item(f"description_penerbangan_rekomendasi_{i}"),
                "image": get_item(f"url_image_penerbangan_rekomendasi_{i}"),
                "booking": get_item(f"booking_penerbangan_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_penerbangan_rekomendasi_{i}")
            }
        else:
            return {
                "name": get_item(f"{category}_rekomendasi_{i}"),
                "rating": get_item(f"rating_{category}_rekomendasi_{i}"),
                "description": get_item(f"description_{category}_rekomendasi_{i}"),
                "image": get_item(f"url_image_{category}_rekomendasi_{i}"),
                "booking": get_item(f"booking_{category}_rekomendasi_{i}"),
                "estimasi_biaya": get_item(f"estimasi_biaya_{category}_rekomendasi_{i}")
            }

    recommendations = [get_recommendation(i) for i in range(1, 3)]

    result = {"main": main_item, "recommendations": recommendations}
    print(f"Debug: Result - {result}")  # Debug print
    return jsonify(result)

@app.route('/uploads/images/<filename>')
def serve_image(filename):
    return send_from_directory(os.path.join('uploads', 'images'), filename)

if __name__ == '__main__':
>>>>>>> 5cde761efd150d180a9a6b1350df47cbe8cba978
    app.run(debug=True)