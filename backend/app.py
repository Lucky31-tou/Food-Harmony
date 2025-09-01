from flask import Flask, request, jsonify
import db  
import json
import sqlite3

# Récupère un menu par son ID depuis la base de données
def get_menu_by_id(menu_id):
    db_con = db.get_db()
    menu = db_con.execute("SELECT * FROM menus WHERE id = ?", (menu_id,)).fetchone()
    return dict(menu) if menu else None

# Récupère un aliment par son ID depuis la base de données
def get_food_by_id(food_id):
    db_con = db.get_db()
    food = db_con.execute("SELECT * FROM foods WHERE id = ?", (food_id,)).fetchone()
    return dict(food) if food else None

# Fonction de création de l'application Flask
def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config.from_mapping(
        DATABASE="db.sqlite",
    )
    db.init_app(app)
    
    # Route pour ajouter un menu
    @app.route("/api/menus", methods=["POST"])
    def add_menu():
        data = request.get_json()
        list_food = json.dumps(data.get("listFood"))
        badge = data.get("badge")
        error = None

        # Vérifie la présence des champs requis
        if not list_food or not badge:
            error = "Missing data"

        if error is None:
            db_con = db.get_db()
            cursor = db_con.execute(
                "INSERT INTO menus (listfood, badge) VALUES (?, ?)",
                (list_food, badge)
            )
            db_con.commit()
            new_menu_id = cursor.lastrowid
            new_menu = get_menu_by_id(new_menu_id)
            # Retourne le menu nouvellement créé
            return jsonify({
                "id": new_menu["id"],
                "listFood": json.loads(new_menu["listfood"]),
                "badge": new_menu["badge"]
            }), 201
        
        return jsonify({"error": error}), 400
    
    # Route pour ajouter un aliment
    @app.route("/api/foods", methods=["POST"])
    def add_food():
        data = request.get_json()
        food_name = data.get("foodname")
        food_quantity = data.get("quantity")
        food_type = data.get("foodtype")
        error = None

        # Vérifie la présence des champs requis
        if not food_name or not food_quantity or not food_type:
            error = "Missing data"

        if error is None:
            db_con = db.get_db()
            # Ajoute l'aliment dans la base de données
            cursor = db_con.execute(
                "INSERT INTO foods (foodname, quantity, quantity_max, foodtype) VALUES (?, ?, ?, ?)",
                (food_name, food_quantity, food_quantity, food_type),
            )
            db_con.commit()
            new_food_id = cursor.lastrowid
            new_food = get_food_by_id(new_food_id)
            # Retourne l'aliment nouvellement créé
            return jsonify(new_food), 201
        
        return jsonify({"error": error}), 400
    

    # Route pour supprimer un aliment par son ID
    @app.route("/api/foods/<int:id>", methods=["DELETE"])
    def delete_food(id):
        db_con = db.get_db()
        db_con.execute(
            "DELETE FROM foods WHERE id = ?", (id,)
        )
        db_con.commit()
        return jsonify({'status': 'success'})
    
    # Route pour supprimer un menu par son ID
    @app.route("/api/menus/<int:id>", methods=["DELETE"])
    def delete_menu(id):
        db_con = db.get_db()
        db_con.execute(
            "DELETE FROM menus WHERE id = ?", (id,)
        )
        db_con.commit()
        return jsonify({'status': 'success'})

    # Route pour récupérer tous les aliments et menus
    @app.route("/api/foods-and-menus", methods=["GET"])
    def index():
        db_con = db.get_db()
        foods = db_con.execute(
            "SELECT * FROM foods"
        ).fetchall()

        menus = db_con.execute(
            "SELECT * FROM menus"
        ).fetchall()

        menus_data = []
        for menu in menus:
            m = dict(menu)
            m["listFood"] = json.loads(m["listfood"])  # Désérialise la liste des aliments
            del m["listfood"]                         # Supprime l'ancien champ
            menus_data.append(m)

        data = {
            "foods": [dict(row) for row in foods],
            "menus": [dict(row) for row in menus_data],
        }

        return jsonify(data)

    # Route pour mettre à jour la quantité d'un aliment
    @app.route("/api/foods/<int:id>", methods=["PUT"])
    def update_food(id):
        data = request.get_json()
        quantity = data.get("quantity")

        if quantity is None:
            return jsonify({"error": "Missing quantity"}), 400

        db_con = db.get_db()
        # Met à jour la quantité et ajuste quantity_max si besoin
        db_con.execute(
            "UPDATE foods SET quantity = ?, quantity_max = CASE WHEN ? > quantity_max THEN ? ELSE quantity_max END WHERE id = ?",
            (quantity, quantity, quantity, id),
        )
        db_con.commit()
        updated_food = get_food_by_id(id)
        return jsonify(updated_food)

    return app
