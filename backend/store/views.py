from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongodb import products_collection, orders_collection
from bson import ObjectId
import json


def home(request):
    return JsonResponse({
        "message": "Welcome to CodeX Accessories API"
    })

@csrf_exempt
def products(request):

    if request.method == "GET":

        data = list(
            products_collection.find({})
        )

        for product in data:
            product["_id"] = str(product["_id"])

        return JsonResponse(
            data,
            safe=False
        )


    elif request.method == "POST":

        try:

            data = json.loads(request.body)

            products_collection.insert_one(data)

            return JsonResponse({
                "message":"Product Added Successfully"
            })

        except Exception as e:

            return JsonResponse({
                "error":str(e)
            },status=500)

@csrf_exempt
def delete_product(request, product_id):

    if request.method == "DELETE":

        result = products_collection.delete_one(
            {"_id": ObjectId(product_id)}
        )

        if result.deleted_count == 1:
            return JsonResponse({"message": "Product Deleted"})
        else:
            return JsonResponse({"message": "Product Not Found"}, status=404)


@csrf_exempt
def update_product(request, product_id):

    if request.method == "PUT":

        data = json.loads(request.body)

        products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$set": {
                    "name": data["name"],
                    "category": data["category"],
                    "price": data["price"],
                    "rating": data["rating"],
                    "reviews": data["reviews"],
                    "image": data["image"]
                }
            }
        )

        return JsonResponse({
            "message": "Product Updated Successfully"
        })
    
@csrf_exempt
def orders(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            result = orders_collection.insert_one(data)

            return JsonResponse({
                "message":"Order Saved Successfully"
            })


        except Exception as e:

            return JsonResponse({
                "error":str(e)
            },status=500)



    if request.method == "GET":

        data = list(
            orders_collection.find(
                {},
                {"_id":0}
            )
        )

        return JsonResponse(
            data,
            safe=False
        )