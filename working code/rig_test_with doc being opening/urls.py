from django.contrib import admin
from django.urls import path, include

from . import views

from django.urls import path
from .views import *
urlpatterns = [

path('pfr-add-test-rig-dashboard/',views.pfr_add_test_rig_dashboard, name='pfr_add_test_rig_dashboard'),
path('create-rig-test/',create_rig_test, name='create_rig_test'),
path('get-rig-test/',get_rig_test_data, name='get_rig_test_data'),
path('update-rig-test/<str:rig_test_id>/', views.update_rig_test, name='update_rig_test'),
path('delete-rig-test/<str:rig_test_id>/', views.delete_rig_test, name='delete_rig_test'),




]