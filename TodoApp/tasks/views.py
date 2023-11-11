from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.http import JsonResponse, HttpResponse
from . models import Task
from . forms import TaskForm, CustomUserCreationForm
from django.contrib.auth import authenticate, login
import json


class TaskListView(LoginRequiredMixin, View):
    model = Task
    template_name = 'tasks/index.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            query = request.GET.get('status', '')
            if query and (query.lower() == 'pending' or query.lower() == 'completed'):
                filter = False if query.lower() == 'pending' else query.lower() == 'completed'
                querysets = self.model.objects.filter(
                    owner=request.user.id, isCompleted=filter).order_by('-created_at').values()
            else:
                querysets = self.model.objects.filter(
                    owner=request.user.id).order_by('-created_at').values()
            context = {'tasks': querysets, 'user': request.user,
                       'authenticated': request.user.is_authenticated}
            return render(request, self.template_name, context)


class TaskDetailView(LoginRequiredMixin, View):
    model = Task

    def get(self, request, id):
        if request.user.is_authenticated:
            obj = self.model.objects.get(id=id)
            serialized_data = []
            data = model_to_dict(
                obj, fields=[field.name for field in obj._meta.fields])
            data['created_at'] = str(obj.created_at)
            serialized_data.append(data)
            return JsonResponse(serialized_data, safe=False)
        return HttpResponse('something went wrong', status=400)


class TaskCreateView(LoginRequiredMixin, View):
    model = Task
    template_name = 'tasks/index.html'

    def post(self, request, id=None):
        if request.user.is_authenticated:
            form = TaskForm(request.POST)
            if id:
                obj = self.model.objects.get(id=id)
                form = TaskForm(request.POST, instance=obj)
            if form.is_valid():
                cleaned_data = form.cleaned_data
                cleaned_data['owner'] = request.user.id
                form.save()
                return JsonResponse('successful', safe=False)
            else:
                print('this error')
                errors = form.errors
                return JsonResponse({'error': 'Invalid fields', 'details': errors}, status=400)
        return JsonResponse({'error': 'Something went wrong'}, status=400)


class TaskDeleteView(LoginRequiredMixin, View):
    model = Task

    def post(self, request):
        if request.user.is_authenticated:
            try:
                data = json.loads(list(request.POST)[0])
                obj = self.model.objects.get(**data)
                obj.delete()
                return JsonResponse('success', safe=False)
            except:
                return JsonResponse({'error': 'Something went wrong'}, status=400)
        return JsonResponse({'error': 'Something went wrong'}, status=400)


class CreateUserView(View):
    form = CustomUserCreationForm
    template = 'registration/register.html'

    def get(self, request):
        return render(request, self.template, {'form': self.form()})

    def post(self, request):
        form = self.form(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('tasks:home')
        else:
            error_messages = {}
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages[field] = error
                    print(error)
            context = {
                'form': CustomUserCreationForm(),
                'messages': error_messages
            }
            return render(request, self.template, context)


class LoginView(View):
    template = 'registration/register.html'

    def get(self, request):
        return render(request, self.template, {})

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('tasks:home')
        else:
            context = {
                'message': 'Invalid username or password'
            }
            return render(request, self.template, context)
