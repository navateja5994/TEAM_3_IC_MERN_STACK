from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongodb import products_collection, orders_collection
import json


def home(request):
    return JsonResponse({
        "message": "Welcome to CodeX Accessories API"
    })


def products(request):
    data = list(products_collection.find({}, {"_id": 0}))
    return JsonResponse(data, safe=False)


@csrf_exempt
def orders(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            print("Received Order:", data)

            result = orders_collection.insert_one(data)

            print("Inserted ID:", result.inserted_id)

            return JsonResponse({
                "message": "Order Saved Successfully"
            })

        except Exception as e:
            print(e)
            return JsonResponse({
                "error": str(e)
            }, status=500)

    return JsonResponse({
        "message": "Orders API Working"
    })