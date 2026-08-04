from django.contrib import admin
from django.urls import path
from store import views
from django.urls import path, include

urlpatterns = [
    path("", views.home),
    path("admin/", admin.site.urls),
    path("api/products/", views.products),
    path("api/orders/", views.orders),
    path("api/", include("store.urls")),
]