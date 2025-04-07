import pyodbc
from datetime import datetime
import random

# Connexion à la base SQL Server
conn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=OrderServiceDb;"
    "UID=sa;"
    "PWD=dockerStrongPwd123;"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)
cursor = conn.cursor()

# Définir les paramètres
product_ids = [26, 27, 28, 29]
order_ids = [
    1, 1, 2, 2, 2, 1002, 1003, 1003, 1004, 1004, 1005, 1005, 1006, 1006, 1007, 1007,
    1008, 1008, 1009, 1009, 1010, 1010, 1011, 1011, 1012, 1012, 1013, 1013, 1014, 1014,
    1015, 1015, 1016, 1016, 1017, 1017
]

# Générer les dates entre janvier 2024 et aujourd’hui (le 15 de chaque mois)
start_date = datetime(2024, 1, 1)
end_date = datetime.now()
months = []
current = start_date
while current <= end_date:
    months.append(current.replace(day=15))
    if current.month == 12:
        current = current.replace(year=current.year + 1, month=1)
    else:
        current = current.replace(month=current.month + 1)

# Générer et exécuter les requêtes SQL
order_index = 0
inserted_count = 0

for month in months:
    for _ in range(len(order_ids) // len(months)):
        if order_index >= len(order_ids):
            break
        order_id = order_ids[order_index]
        order_index += 1

        used_products = set()
        for _ in range(3):  # 3 produits différents par commande
            product_id = random.choice([pid for pid in product_ids if pid not in used_products])
            used_products.add(product_id)
            quantity = random.randint(1, 5)
            total_price = round(quantity * random.uniform(10, 100), 2)
            create_at = month.strftime('%Y-%m-%d')

            # Exécution de la requête SQL
            cursor.execute(
                "INSERT INTO OrderItems (OrderId, ProductId, Quantity, TotalPrice, CreateAt) "
                "VALUES (?, ?, ?, ?, ?)",
                order_id, product_id, quantity, total_price, create_at
            )
            inserted_count += 1

# Validation des insertions
conn.commit()
print(f"{inserted_count} lignes insérées dans la table OrderItems ✅")

# Fermeture de la connexion
cursor.close()
conn.close()