from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404, render
from .models import Task
from .serializers import TaskSerializer
from .forms import TaskForm

# ================================================
# Funciones para la API (JSON) - CRUD
# ================================================

# 🔹 Listar tareas con filtros (API)
@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    
    # Aplicar filtros desde los parámetros GET
    status_filter = request.GET.get('status')
    priority_filter = request.GET.get('priority')

    if status_filter and status_filter != 'all':
        tasks = tasks.filter(status=status_filter)

    if priority_filter and priority_filter != 'all':
        tasks = tasks.filter(priority=priority_filter)

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# 🔹 Crear una nueva tarea (API)
@api_view(['POST'])
def task_create(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task created successfully!", "task": serializer.data}, status=201)
    return Response(serializer.errors, status=400)

# 🔹 Obtener detalles de una tarea específica (API)
@api_view(['GET'])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    serializer = TaskSerializer(task)
    return Response(serializer.data)

# 🔹 Actualizar una tarea existente (API)
@api_view(['PUT', 'PATCH'])
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk)
    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task updated successfully!", "task": serializer.data})
    return Response(serializer.errors, status=400)

# 🔹 Eliminar una tarea (API)
@api_view(['DELETE'])
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.delete()
    return Response({"message": "Task deleted successfully!"}, status=204)

# 🔹 Endpoint de resumen de la API (API)
@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'List': '/api/tasks/',
        'Detail': '/api/tasks/<int:pk>/',
        'Create': '/api/tasks/create/',
        'Update': '/api/tasks/update/<int:pk>/',
        'Delete': '/api/tasks/delete/<int:pk>/',
    }
    return Response(api_urls)


# ================================================
# Funciones para Renderizar Templates HTML
# ================================================

# 🔹 Listar tareas (Vista que solo renderiza el template)
def task_list_view(request):
    return render(request, 'tasks/task_list.html')

# 🔹 Crear una nueva tarea (Vista que solo renderiza el template de creación)
def task_create_view(request):
    form = TaskForm()  # Crear una instancia del formulario
    return render(request, 'tasks/task_form.html', {'form': form})  # Pasarlo a la plantilla


# 🔹 Actualizar una tarea (Vista que solo renderiza el template de actualización)
def task_update_view(request, pk):
    return render(request, 'tasks/task_form.html')

# 🔹 Eliminar una tarea (Vista que solo renderiza el template de confirmación de eliminación)
def task_delete_view(request, pk):
    return render(request, 'tasks/task_confirm_delete.html')

# 🔹 Página de detalles de una tarea (Vista que solo renderiza el template de detalles)
def task_detail_view(request, pk):
    return render(request, 'tasks/task_detail.html')
