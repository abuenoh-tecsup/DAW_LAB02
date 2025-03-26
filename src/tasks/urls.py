from django.urls import path
from . import views

urlpatterns = [
    # API Endpoints
    path('api/tasks/', views.task_list, name='task_list_api'),
    path('api/tasks/create/', views.task_create, name='task_create_api'),
    path('api/tasks/<int:pk>/', views.task_detail, name='task_detail_api'),
    path('api/tasks/update/<int:pk>/', views.task_update, name='task_update_api'),
    path('api/tasks/delete/<int:pk>/', views.task_delete, name='task_delete_api'),
    path('api/', views.api_overview, name='api_overview'),

    # Template Render Views
    path('', views.task_list_view, name='task_list'),
    path('tasks/', views.task_list_view, name='task_list'),
    path('tasks/create/', views.task_create_view, name='task_create'),
    path('tasks/update/<int:pk>/', views.task_update_view, name='task_update'),
    path('tasks/delete/<int:pk>/', views.task_delete_view, name='task_delete'),
    path('tasks/detail/<int:pk>/', views.task_detail_view, name='task_detail'),
]
