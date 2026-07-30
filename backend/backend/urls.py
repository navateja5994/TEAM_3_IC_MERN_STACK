from django.contrib import admin
from django.urls import path
from store import views

urlpatterns = [
    path("", views.home),
    path("admin/", admin.site.urls),
    path("api/products/", views.products),
    path("api/orders/", views.orders),
]