from django.urls import path

from .views import (
    home,
    products,
    orders,
    delete_product,
    update_product
)

urlpatterns = [

    path("", home),

    path("products/", products),

    path("orders/", orders),

    path(
        "products/delete/<str:product_id>/",
        delete_product
    ),

    path(
        "products/update/<str:product_id>/",
        update_product
    ),

]